// server/routes/optimize.js
// Direct port of app/api/optimize-resume/route.js
import { Router } from 'express'
import OpenAI from 'openai'
import { z } from 'zod'
import { zodTextFormat } from 'openai/helpers/zod'
import { isDbConnected } from '../db/connect.js'
import { TokenUsage } from '../models/TokenUsage.js'

const router = Router()
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const OptimizedContentSchema = z.object({
  seniority: z.enum(['junior', 'mid', 'senior']),
  summary: z.string().nullable(),
  keyHighlights: z.array(z.string()).nullable(),
  experience: z.array(z.object({
    company: z.string(),
    role: z.string(),
    start: z.string().nullable(),
    end: z.string().nullable(),
    description: z.array(z.string()).nullable(),
  })),
  skills: z.object({
    technicalSkills: z.array(z.string()),
    softSkills: z.array(z.string()),
    toolsAndTechnologies: z.array(z.string()),
  }).nullable(),
  resumeMetadata: z.object({
    totalYearsExperience: z.string().nullable(),
    industries: z.array(z.string()).nullable(),
    seniorityLevel: z.string().nullable(),
    preferredRoles: z.array(z.string()).nullable(),
    targetLocations: z.array(z.string()).nullable(),
  }).nullable(),
  ats: z.object({
    keywords_detected: z.array(z.string()),
    keywords_added: z.array(z.string()),
    missing_keywords: z.array(z.string()),
  }),
})

const SYSTEM_PROMPT = `
You are an expert resume writer, ATS optimization engine, and factual rewriting system.

Your primary rule: NEVER fabricate or assume data. Every improvement must be grounded in the original resume.

-----------------------------
STEP 1 — INFER SENIORITY
-----------------------------
Analyse:
- Total years of experience
- Role progression and titles
- Scope of responsibility (team, targets, ownership)
- Industry context

Classify as:
• "junior" — 0–6 years, execution-focused roles
• "mid" — 7–14 years, ownership of function or targets
• "senior" — 15+ years OR leadership titles OR P&L ownership

Return in: seniority

-----------------------------
STEP 2 — BULLET OPTIMIZATION (STRICT MODE)
-----------------------------

CRITICAL RULE: DO NOT INVENT METRICS.

Allowed transformations:
1. If numbers/metrics exist → preserve EXACTLY
2. If no metrics exist → DO NOT add % or numbers
3. Instead → strengthen impact using:
   - scale words (high-volume, multi-client, regional, cross-functional)
   - outcome words (improved, strengthened, accelerated, enhanced)

Bullet rules:
• 12–18 words only
• Start with strong action verb
• Structure: Action → What → Outcome (if available)
• No generic phrases like "responsible for", "worked on"

GOOD EXAMPLE (no metrics):
"Managed end-to-end sales operations across multiple client accounts, consistently achieving assigned monthly targets."

BAD EXAMPLE:
"Improved sales by 30%" (if not in original)

-----------------------------
SUMMARY RULES (STRICT)
-----------------------------
• 3–4 lines max
• MUST include:
  - total years of experience (calculated, not assumed)
  - industry/domain
  - core strengths
• DO NOT introduce fake achievements

Tone:
- Junior/Mid: growth + capability
- Senior: impact + leadership

-----------------------------
KEY HIGHLIGHTS (ANTI-HALLUCINATION)
-----------------------------
Generate ONLY if:
- Metrics or strong outcomes exist in original

If NOT → generate IMPACT-based highlights WITHOUT numbers

Format:
• 4–5 highlights
• 10–16 words
• Start with outcome/action

-----------------------------
STEP 3 — ATS OPTIMIZATION (INTELLIGENT)
-----------------------------
Return 3 sections:

1. existingKeywords:
   - Extract real keywords already present

2. reinforcedKeywords:
   - Keywords you NATURALLY strengthened in rewrite

3. missingKeywords:
   - HIGH-VALUE domain-specific keywords
   - Must be role-relevant (NOT generic like "hardworking")

Example (sales role):
✔ CASA, Lead Generation, Client Acquisition
✖ Communication, Team Player

-----------------------------
STEP 4 — SKILL EXTRACTION (SMART INFERENCE MODE)
-----------------------------

If skills section EXISTS → return null

If skills are MISSING → extract using DEEP CONTEXT:

Sources:
- Job titles
- Responsibilities
- Industry (banking, insurance, media, etc.)

Return structured:

technicalSkills:
- Domain-specific hard skills ONLY

toolsAndTechnologies:
- Software, platforms, tools

softSkills:
- Only if clearly demonstrated (max 5)

RULES:
❌ No generic dumping (communication, teamwork unless proven)
✅ Infer real domain skills

Example:
If "CASA sales" → include:
- CASA Portfolio Management
- Retail Banking Sales
- Client Acquisition

-----------------------------
STEP 5 — NO DESCRIPTION ROLES
-----------------------------
If role has no bullets:

• Infer responsibilities using:
  - role title
  - industry
  - adjacent roles

• Write 3–4 realistic bullets
• NO metrics

-----------------------------
GLOBAL RULES (NON-NEGOTIABLE)
-----------------------------
1. NEVER fabricate numbers, %, revenue, or growth
2. NEVER exaggerate achievements
3. Keep roles, companies, dates EXACT
4. Maintain role order
5. Do NOT copy generic templates — adapt to context
6. Write like a human recruiter would believe it

-----------------------------
OUTPUT FORMAT
-----------------------------
Return JSON with:
{
  seniority,
  summary,
  keyHighlights,
  experience,
  atsOptimization: {
    existingKeywords,
    reinforcedKeywords,
    missingKeywords
  },
  skills
}
`;
router.post('/', async (req, res) => {
  console.log('[Optimize] Request received')

  try {
    const { resumeData, fileId } = req.body

    if (!resumeData) {
      return res.status(400).json({ error: 'No resume data provided' })
    }

    const startTime = Date.now()

    const experienceText = (resumeData.experience || [])
      .map((exp, idx) => {
        const bullets = exp.description && exp.description.length > 0
          ? exp.description.map((b) => `- ${b}`).join('\n')
          : '[NO DESCRIPTION — infer and write 3–5 bullets from role title, company, and resume context]'
        return `[${idx}] Company: ${exp.company}\nRole: ${exp.role}\nDuration: ${exp.start ?? '?'} – ${exp.end ?? 'Present'}\nDescription:\n${bullets}`
      })
      .join('\n\n')

    const keyHighlightsSection = resumeData.keyHighlights?.length
      ? `\n\n## Key Highlights (preserve these in output)\n${resumeData.keyHighlights.map((h) => `- ${h}`).join('\n')}`
      : ''

    const existingSkills = resumeData.skills
    const hasSkills = existingSkills && (
      (existingSkills.technicalSkills?.length > 0) ||
      (existingSkills.softSkills?.length > 0) ||
      (existingSkills.toolsAndTechnologies?.length > 0)
    )

    const skillsStatus = hasSkills
      ? `## Existing Skills (DO NOT modify — return null for skills field)\nTechnical: ${existingSkills.technicalSkills?.join(', ') || 'none'}\nSoft: ${existingSkills.softSkills?.join(', ') || 'none'}\nTools: ${existingSkills.toolsAndTechnologies?.join(', ') || 'none'}`
      : `## Skills: NONE PRESENT — extract and populate skills from the full resume content (experience, certifications, training, projects).`

    const userTextContent = `Optimize this resume for ${resumeData.name}:\n\n## Current Title\n${resumeData.headline || resumeData.title || 'Not specified'}\n\n## Current Summary\n${resumeData.summary || 'None'}${keyHighlightsSection}\n\n${skillsStatus}\n\n## Experience\n${experienceText}\n\nInfer seniority, optimize the summary and all experience entries in the exact same order, generate keyHighlights as instructed, extract skills if missing, and return ATS analysis. For roles marked [NO DESCRIPTION], write 3–5 relevant bullet points inferred from the role title, company, industry, and any skills or responsibilities mentioned elsewhere in this resume.`

    const userContent = fileId
      ? [
          { type: 'input_text', text: userTextContent },
          { type: 'input_file', file_id: fileId },
        ]
      : userTextContent

    const response = await openai.responses.parse({
      model: 'gpt-4o-mini',
      input: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userContent },
      ],
      text: { format: zodTextFormat(OptimizedContentSchema, 'optimized') },
      temperature: 0.6,
    })

    const optimized = response.output_parsed
    const u = response.usage ?? {}
    const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log('─'.repeat(60))
    console.log('[Optimize] TOKEN USAGE + TIMING')
    console.log('─'.repeat(60))
    console.log(`  in: ${String(u.input_tokens ?? 0).padStart(6)} | out: ${String(u.output_tokens ?? 0).padStart(6)} | total: ${String(u.total_tokens ?? 0).padStart(6)} | time: ${timeTaken}s`)
    console.log(`  seniority: ${optimized.seniority}`)
    console.log('─'.repeat(60))
    console.log('[Optimize] Seniority detected:', optimized.seniority)

    if (isDbConnected()) {
      TokenUsage.create({
        operation:    'optimize',
        sessionId:    fileId || null,
        inputTokens:  u.input_tokens  ?? 0,
        outputTokens: u.output_tokens ?? 0,
        totalTokens:  u.total_tokens  ?? 0,
        durationMs:   Math.round((Date.now() - startTime)),
      }).catch((err) => console.warn('[DB] TokenUsage save failed:', err.message))
    }

    const optimizedData = {
      ...resumeData,
      summary: optimized.summary,
      keyHighlights: optimized.keyHighlights?.length ? optimized.keyHighlights : resumeData.keyHighlights,
      experience: resumeData.experience.map((exp, idx) => ({
        ...exp,
        description: optimized.experience[idx]?.description ?? exp.description ?? null,
      })),
      // Use AI-extracted skills only when the original had none
      skills: !hasSkills && optimized.skills ? optimized.skills : (resumeData.skills ?? { technicalSkills: [], softSkills: [], toolsAndTechnologies: [] }),
      // Pass through untouched — optimizer does not touch these
      interests: resumeData.interests ?? null,
      extraSections: resumeData.extraSections ?? null,
    }

    // Clean up the OpenAI file now that optimization is done
    if (fileId) {
      await openai.files.delete(fileId).catch((err) => {
        console.warn('[Optimize] File cleanup failed:', err.message)
      })
    }

    res.json({ success: true, optimizedData, ats: optimized.ats })

  } catch (error) {
    console.error('[Optimize] Error:', error)
    res.status(500).json({ error: 'Optimization failed', message: error.message })
  }
})

export default router