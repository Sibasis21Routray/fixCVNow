// server/routes/optimize.js
// Direct port of app/api/optimize-resume/route.js
import { Router } from 'express'
import OpenAI from 'openai'
import { z } from 'zod'
import { zodTextFormat } from 'openai/helpers/zod'
import { isDbConnected } from '../db/connect.js'
import { TokenUsage } from '../models/TokenUsage.js'
import { trackConversion } from '../lib/middleware/ipBlock.js'

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
  ats: z.object({
    keywords_detected: z.array(z.string()),
    keywords_added: z.array(z.string()),
    missing_keywords: z.array(z.string()),
  }),
})

const SYSTEM_PROMPT =
  'You are an expert resume writer and ATS optimization engine. You work in three steps.' +
  '\n\nSTEP 1 — INFER SENIORITY:' +
  '\nAnalyse the candidate\'s current title, all role titles, years of experience, team/P&L ownership signals, and scope language in the bullets.' +
  '\nClassify as:' +
  '\n• \'junior\' — 0–6 years, individual contributor, no team ownership' +
  '\n• \'mid\' — 7–14 years, team lead or specialist, functional ownership' +
  '\n• \'senior\' — 15+ years OR VP/AVP/DVP/Director/Head of/CXO/GM/President equivalent title OR clear P&L or org-level ownership' +
  '\nReturn your classification in the seniority field.' +
  '\n\nSTEP 2 — OPTIMIZE BULLETS AND SUMMARY based on seniority:' +
  '\n\nFor ALL levels:' +
  '\n• Each bullet must be 12–20 words. Use strong action verbs. Focus on impact and responsibility.' +
  '\n• Do not fabricate metrics or numbers not present in the original.' +
  '\n• Improve grammar and clarity. Remove vague or redundant phrasing.' +
  '\n• Summary: 3–4 lines maximum. Include total years of experience, industry/domain, key functional expertise, and leadership or technical strengths.' +
  '\n\nFor junior/mid additionally:' +
  '\n• Make bullets achievement-oriented. Quantify wherever the original data allows.' +
  '\n• Summary tone: professional and growth-oriented.' +
  '\n\nFor senior additionally:' +
  '\n• Convert task lists into strategic governance language.' +
  '\n• Summary must be metric-led and transformation-focused. Mention domain and top 2–3 achievements.' +
  '\n• PRESERVE ALL numeric data exactly — percentages, YoY figures, team sizes, revenue values are non-negotiable.' +
  '\n\nKEY HIGHLIGHTS GENERATION:' +
  '\n• For mid and senior profiles: generate 4–6 concise Key Highlights drawn from the candidate\'s strongest measurable achievements across all roles.' +
  '\n• Each highlight should be 10–20 words, start with a strong metric or outcome.' +
  '\n• For junior profiles OR if the original resume already has a Key Highlights section: return the existing highlights (improved if needed) or null.' +
  '\n• Return results in the keyHighlights field.' +
  '\n\nSTEP 3 — ATS OPTIMIZATION:' +
  '\n• Identify ATS keywords already present in the resume relevant to the candidate\'s industry and role.' +
  '\n• List keywords you added or reinforced through the optimization.' +
  '\n• Suggest important industry keywords that are missing and should be considered.' +
  '\n• Do not keyword-stuff. All keywords must fit naturally in context.' +
  '\n\nSTEP 4 — SKILLS EXTRACTION (only when skills are missing):' +
  '\n• You will be told whether the resume has an existing skills section.' +
  '\n• If skills are MISSING: extract and populate technicalSkills, softSkills, and toolsAndTechnologies by reading the full resume — experience bullets, certifications, training, and projects. Include only genuinely relevant skills for the candidate\'s domain.' +
  '\n• If skills already EXIST: return null for the skills field — do not modify existing skills.' +
  '\n\nSTRICT RULES FOR ALL STEPS:' +
  '\n1. Keep company names, roles, and dates exactly as given.' +
  '\n2. Return every experience entry in the same order.' +
  '\n3. Each role\'s bullets belong only to that role — never redistribute content between roles.' +
  '\n4. If a role is marked [NO DESCRIPTION]: look at the role title, company name, industry context, and any skills/responsibilities mentioned elsewhere in the resume to write 3–5 relevant, realistic bullet points for that role. Use strong action verbs. Do NOT fabricate numbers or metrics — write responsibility-focused bullets that are consistent with the role and industry.'

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
    
    // Reset IP block count on conversion
    trackConversion(req.userIP).catch(() => {})

  } catch (error) {
    console.error('[Optimize] Error:', error)
    res.status(500).json({ error: 'Optimization failed', message: error.message })
  }
})

export default router
