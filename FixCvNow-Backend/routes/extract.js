// server/routes/extract.js
// Parallel extraction with SSE streaming — 5 concurrent OpenAI calls
import { Router } from 'express'
import multer from 'multer'
import mammoth from 'mammoth'
import OpenAI from 'openai'
import { z } from 'zod'
import { zodTextFormat } from 'openai/helpers/zod'
import { isDbConnected } from '../db/connect.js'
import { Lead } from '../models/Lead.js'
import { TokenUsage } from '../models/TokenUsage.js'
import { incrementParseCount } from '../lib/middleware/ipBlock.js'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

/** OpenAI SDK uploads require global `File` (Node 20+). Multer gives a Buffer — use fetch + Blob + FormData for Node 18. */
async function uploadAssistantFileFromBuffer(client, buffer, filename, mimeType) {
  const base = String(client.baseURL).replace(/\/$/, '')
  const url = `${base}/files`
  const body = new FormData()
  body.set('purpose', 'assistants')
  body.append(
    'file',
    new Blob([buffer], { type: mimeType || 'application/octet-stream' }),
    filename,
  )
  const headers = new Headers()
  headers.set('Authorization', `Bearer ${client.apiKey}`)
  if (client.organization) headers.set('OpenAI-Organization', client.organization)
  if (client.project) headers.set('OpenAI-Project', client.project)
  const res = await client.fetch(url, { method: 'POST', headers, body })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = json?.error?.message || json?.message || `${res.status} ${res.statusText}`
    throw new Error(msg)
  }
  if (!json?.id) throw new Error('OpenAI file upload returned no file id')
  return json
}

// ─────────────────────────────────────────────
// Date parser for reverse-chronological sort
// Handles: "Jan 2022", "3 Jan. 2022", "2022-01", "2022", "Present", "till time"
// ─────────────────────────────────────────────
const MONTH_MAP = { jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11 }

function parseResumeDate(str) {
  if (!str) return 0
  const s = str.toLowerCase().trim()
  if (/present|current|till\s*time|ongoing|now/i.test(s)) return Date.now()
  // ISO or numeric year-month "2022-01"
  const iso = s.match(/^(\d{4})-(\d{2})/)
  if (iso) return new Date(parseInt(iso[1]), parseInt(iso[2]) - 1).getTime()
  // Find 4-digit year
  const yearMatch = s.match(/(\d{4})/)
  if (!yearMatch) return 0
  const year = parseInt(yearMatch[1])
  // Find month abbreviation
  for (const [mon, idx] of Object.entries(MONTH_MAP)) {
    if (s.includes(mon)) return new Date(year, idx).getTime()
  }
  return new Date(year, 0).getTime()
}

function sortDescByStart(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return arr
  return [...arr].sort((a, b) => parseResumeDate(b.start) - parseResumeDate(a.start))
}

// ─────────────────────────────────────────────
// SSE helper
// ─────────────────────────────────────────────
function sendSSE(res, payload) {
  res.write(`data: ${JSON.stringify(payload)}\n\n`)
}

// ─────────────────────────────────────────────
// Universal extraction rule — prepended to every section prompt
// ─────────────────────────────────────────────
const MASTER_RULE = `ABSOLUTE RULE — YOU ARE A COPY-EXTRACTOR, NOT A WRITER OR ANALYST.
Your only job is to copy text that is explicitly and literally present in the resume document.
YOU MUST NEVER: generate content, infer details, assume information, derive skills from job titles or descriptions, create bullet points, rephrase, summarise, add keywords, or fill any field with guessed or implied data.
Every value you return must be a direct copy of words written in the resume.
If a field's value is not explicitly written in the resume, return null or an empty array — never fabricate or guess.
Violating this rule is a critical error.\n\n`

// ─────────────────────────────────────────────
// Normalize: recursively convert the literal string "null" → actual null
// OpenAI structured output occasionally returns "null" as a string value
// ─────────────────────────────────────────────
function normalizeNulls(value) {
  if (Array.isArray(value)) return value.map(normalizeNulls)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, normalizeNulls(v)])
    )
  }
  if (typeof value === 'string' && value.trim().toLowerCase() === 'null') return null
  return value
}

// ─────────────────────────────────────────────
// Schemas — one per parallel extraction
// ─────────────────────────────────────────────

const BasicSchema = z.object({
  name: z.string(),
  headline: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  alternatePhone: z.string().nullable(),
  dateOfBirth: z.string().nullable(),
  gender: z.string().nullable(),
  nationality: z.string().nullable(),
  maritalStatus: z.string().nullable(),
  location: z.object({
    city: z.string().nullable(),
    state: z.string().nullable(),
    country: z.string().nullable(),
  }).nullable(),
  currentAddress: z.string().nullable(),
  permanentAddress: z.string().nullable(),
  socialLinks: z.array(z.object({ label: z.string(), url: z.string() })).nullable(),
  summary: z.string().nullable(),
})

const ExperienceSchema = z.object({
  experience: z.array(z.object({
    company: z.string(),
    companyLocation: z.string().nullable(),
    role: z.string(),
    employmentType: z.string().nullable(),
    start: z.string().nullable(),
    end: z.string().nullable(),
    isCurrentRole: z.boolean().nullable(),
    description: z.array(z.string()).nullable(),
    achievements: z.array(z.string()).nullable(),
    technologiesUsed: z.array(z.string()).nullable(),
  })),
})

const EducationSchema = z.object({
  education: z.array(z.object({
    institution: z.string(),
    degree: z.string(),
    fieldOfStudy: z.string().nullable(),
    location: z.string().nullable(),
    startYear: z.string().nullable(),
    endYear: z.string().nullable(),
    grade: z.string().nullable(),
  })),
  certifications: z.array(z.object({
    name: z.string(),
    issuingOrganization: z.string().nullable(),
    issueDate: z.string().nullable(),
    expirationDate: z.string().nullable(),
    credentialId: z.string().nullable(),
    credentialUrl: z.string().nullable(),
  })).nullable(),
  awards: z.array(z.object({
    title: z.string(),
    issuer: z.string().nullable(),
    date: z.string().nullable(),
    description: z.string().nullable(),
  })).nullable(),
})

const SkillsSchema = z.object({
  skills: z.object({
    technicalSkills: z.array(z.string()),
    softSkills: z.array(z.string()),
    toolsAndTechnologies: z.array(z.string()),
  }),
  coreCompetencies: z.array(z.string()).nullable(),
  languages: z.array(z.object({
    language: z.string(),
    proficiency: z.string().nullable(),
  })).nullable(),
  interests: z.array(z.string()).nullable(),
})

const ExtrasSchema = z.object({
  projects: z.array(z.object({
    projectName: z.string(),
    description: z.string().nullable(),
    technologies: z.array(z.string()).nullable(),
    projectUrl: z.string().nullable(),
  })).nullable(),
  publications: z.array(z.object({
    title: z.string(),
    publisher: z.string().nullable(),
    publicationDate: z.string().nullable(),
    url: z.string().nullable(),
  })).nullable(),
  professionalMemberships: z.array(z.object({
    organization: z.string(),
    role: z.string().nullable(),
    yearJoined: z.string().nullable(),
  })).nullable(),
  volunteerExperience: z.array(z.object({
    organization: z.string(),
    role: z.string().nullable(),
    description: z.string().nullable(),
    startDate: z.string().nullable(),
    endDate: z.string().nullable(),
  })).nullable(),
  resumeMetadata: z.object({
    totalYearsExperience: z.string().nullable(),
    industries: z.array(z.string()).nullable(),
    seniorityLevel: z.string().nullable(),
    preferredRoles: z.array(z.string()).nullable(),
    targetLocations: z.array(z.string()).nullable(),
  }).nullable(),
  employmentDetails: z.object({
    currentCtc: z.string().nullable(),
    expectedCtc: z.string().nullable(),
    noticePeriod: z.string().nullable(),
    willingToRelocate: z.boolean().nullable(),
  }).nullable(),
  atsAnalysis: z.object({
    atsScore: z.string().nullable(),
    keywordsDetected: z.array(z.string()).nullable(),
    keywordsMissing: z.array(z.string()).nullable(),
    recommendations: z.array(z.string()).nullable(),
  }).nullable(),
  extraSections: z.array(z.object({
    title: z.string(),
    items: z.array(z.string()),
  })).nullable(),
})

// ─────────────────────────────────────────────
// Single extraction call helper
// ─────────────────────────────────────────────
// fileRef: { fileId } for PDF (input_file) | { resumeText } for DOCX (input_text)
async function extractSection(fileRef, schema, schemaName, systemPrompt, userPrompt) {
  const docContent = fileRef.fileId
    ? { type: 'input_file', file_id: fileRef.fileId }
    : { type: 'input_text', text: `RESUME CONTENT:\n\n${fileRef.resumeText}` }

  const response = await openai.responses.parse({
    model: 'gpt-4o-mini',
    input: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: [
          { type: 'input_text', text: userPrompt },
          docContent,
        ],
      },
    ],
    text: { format: zodTextFormat(schema, schemaName) },
    temperature:0,
  })
  return {
    data: response.output_parsed,
    usage: response.usage ?? null,
  }
}

// ─────────────────────────────────────────────
// POST /api/extract  — SSE response
// ─────────────────────────────────────────────
router.post('/', upload.single('file'), async (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress
  const isBlocked = await incrementParseCount(ip)
  
  if (isBlocked) {
    return res.status(403).json({ error: 'Access Denied', message: 'Too many requests without conversion. Try again in 10 hours.' })
  }

  console.log(`[Extract] Request received from IP: ${ip}`)

  // Set SSE headers immediately so client can start reading
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  if (!req.file) {
    sendSSE(res, { type: 'error', error: 'No file provided' })
    return res.end()
  }

  if (!process.env.OPENAI_API_KEY) {
    sendSSE(res, { type: 'error', error: 'OpenAI API key not configured' })
    return res.end()
  }

  // Heartbeat every 15s to keep connection alive
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n')
  }, 15000)

  let fileId = null

  try {
    // 1. Prepare file — PDF uploads to OpenAI, DOCX extracts text locally
    sendSSE(res, { type: 'progress', section: 'upload', label: 'Uploading to secure storage...', progress: 5 })

    const isDocx = req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      || req.file.originalname.toLowerCase().endsWith('.docx')

    let fileRef // { fileId } or { resumeText }

    if (isDocx) {
      console.log('[Extract] DOCX detected — extracting text with mammoth')
      const result = await mammoth.extractRawText({ buffer: req.file.buffer })
      if (!result.value || result.value.trim().length < 50) {
        sendSSE(res, { type: 'error', error: 'Could not read text from your Word document. Please try uploading as PDF.' })
        clearInterval(heartbeat)
        return res.end()
      }
      fileRef = { resumeText: result.value }
      console.log(`[Extract] DOCX text extracted: ${result.value.length} characters`)
    } else {
      console.log('[Extract] PDF detected — uploading to OpenAI')
      const uploadedFile = await uploadAssistantFileFromBuffer(
        openai,
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
      )
      fileId = uploadedFile.id
      fileRef = { fileId }
      console.log('[Extract] File uploaded:', fileId)
    }

    sendSSE(res, { type: 'progress', section: 'upload', label: 'File ready — starting extraction...', progress: 10 })

    // 2. Launch 5 parallel extractions
    const results = {}

    const tasks = [
      {
        key: 'personal',
        label: 'Extracting personal info...',
        run: () => extractSection(
          fileRef,
          BasicSchema,
          'basic',
          MASTER_RULE + 'Extract personal information from this resume. Rules: (1) NAME: full name only — no slashes or punctuation. (2) HEADLINE: only if a professional title is explicitly written near the name — otherwise null. (3) PHONES: only phone numbers explicitly written; if two exist, primary in phone, second in alternatePhone. (4) EMAIL: only if explicitly written. (5) DATE OF BIRTH: only if explicitly written. (6) NATIONALITY: only if explicitly written — never infer from name or location. (7) SUMMARY: copy the summary/objective text exactly as written — do not rewrite. (8) All other fields: extract exactly as written, null if not present.',
          'Extract all personal information, contact details, date of birth, social links, and professional summary/objective from this resume.',
        ),
      },
      {
        key: 'experience',
        label: 'Extracting work experience...',
        run: () => extractSection(
          fileRef,
          ExperienceSchema,
          'experience',
          MASTER_RULE + 'Extract work experience and internships. For each role: (1) company, location, job title, employmentType — copy exactly as written. (2) dates — copy exactly as written. (3) description — copy ONLY bullet points or sentences explicitly written under that role; null if none written. (4) achievements — only if explicitly listed as achievements; do NOT derive from description bullets. (5) technologiesUsed — only if explicitly listed for that role; never infer from job title. Copy all numbers and wording verbatim.',
          'Extract all work experience entries from this resume with company, role, dates, description bullets, achievements, and technologies used.',
        ),
      },
      {
        key: 'education',
        label: 'Extracting education & certifications...',
        run: () => extractSection(
          fileRef,
          EducationSchema,
          'education',
          MASTER_RULE + 'Extract education, certifications, and awards. For education: copy institution, degree, fieldOfStudy (only if written), location, startYear, endYear (if only one year given it is endYear), grade exactly as written (e.g. "60.22%", "8.5 CGPA"). For certifications: copy only those explicitly listed — a "Training" or "Courses" section counts as certifications. Do NOT infer certifications from job history. For awards/accomplishments: copy only those explicitly written. Return null for any section not present in the resume.',
          'Extract all education (with percentage/grade and specialization), certifications, and awards/recognition from this resume.',
        ),
      },
      {
        key: 'skills',
        label: 'Extracting skills & languages...',
        run: () => extractSection(
          fileRef,
          SkillsSchema,
          'skills',
          MASTER_RULE + 'Extract skills, languages, and interests. SKILLS RULE: Populate technicalSkills, softSkills, toolsAndTechnologies ONLY from a section explicitly headed "Skills", "Technical Skills", "Key Skills", "Core Skills", "Competencies", or "Skills & Competencies". If no such section exists return empty arrays [] — do NOT extract from any other section. The following are NOT skills sections: Training, Certifications, Courses, Education, Experience, Projects, Accomplishments, Achievements, Awards. NEVER derive a skill from a certification title or training name (e.g. "Microsoft certified Advance excel" → do NOT create skill "Advance Excel"). Languages: only from a dedicated languages section. Interests: only from a dedicated Hobbies/Interests section — null if not present.',
          'Extract all skills (technical, soft, tools), core competencies, languages, and interests/hobbies from this resume.',
        ),
      },
      {
        key: 'extras',
        label: 'Extracting projects & additional details...',
        run: () => extractSection(
          fileRef,
          ExtrasSchema,
          'extras',
          MASTER_RULE + 'Extract projects, publications, memberships, volunteer experience, employment details, and career metadata. Copy only what is explicitly written — null for anything not present. Projects: copy name, description, technologies, URL only as written; never infer technologies from narrative. Employment details (CTC, notice period): only if explicitly stated. Career metadata: only if explicitly stated; do NOT calculate years of experience or infer seniority from job history. ATS analysis: base only on text present in the resume. extraSections: include ONLY genuinely unique sections not captured elsewhere (e.g. co-curricular activities, positions of responsibility, NSS/NCC, workshops). EXCLUDE from extraSections: personal info, summary, experience, education, skills, training, certifications, awards, projects, languages, interests, declaration. Return null if no unique extra sections exist.',
          'Extract projects/internships, publications, memberships, volunteer experience, employment details, career metadata, ATS analysis, and any genuinely unique remaining sections from this resume.',
        ),
      },
    ]

    // Progress points per section
    const progressMap = { personal: 28, experience: 55, education: 68, skills: 80, extras: 92 }

    // Token usage accumulator
    const usageLog = {}

    // Run all tasks in parallel, stream SSE as each one completes
    const parallelStart = Date.now()
    await Promise.all(
      tasks.map(({ key, label, run }) => {
        const sectionStart = Date.now()
        return run()
          .then(({ data, usage }) => {
            results[key] = data
            const ms = Date.now() - sectionStart

            // Log per-section usage
            const u = {
              input_tokens:  usage?.input_tokens  ?? 0,
              output_tokens: usage?.output_tokens ?? 0,
              total_tokens:  usage?.total_tokens  ?? 0,
              time_ms: ms,
            }
            usageLog[key] = u
            console.log(
              `[Extract] ✓ ${key.padEnd(12)} | in: ${String(u.input_tokens).padStart(6)} | out: ${String(u.output_tokens).padStart(5)} | total: ${String(u.total_tokens).padStart(6)} | time: ${(ms/1000).toFixed(2)}s`
            )

            sendSSE(res, {
              type: 'progress',
              section: key,
              label: label.replace('Extracting', 'Extracted').replace('...', ' ✓'),
              progress: progressMap[key],
              status: 'done',
            })
          })
          .catch((err) => {
            const ms = Date.now() - sectionStart
            console.error(`[Extract] ✗ ${key} failed (${(ms/1000).toFixed(2)}s):`, err.message)
            results[key] = null
            usageLog[key] = { input_tokens: 0, output_tokens: 0, total_tokens: 0, time_ms: ms, error: err.message }
            sendSSE(res, {
              type: 'progress',
              section: key,
              label: `${key} extraction failed — using defaults`,
              progress: progressMap[key],
              status: 'error',
            })
          })
      })
    )

    const totalMs = Date.now() - parallelStart

    // 3. Log combined token usage + timing
    const totalUsage = Object.values(usageLog).reduce(
      (acc, u) => ({
        input_tokens:  acc.input_tokens  + (u.input_tokens  || 0),
        output_tokens: acc.output_tokens + (u.output_tokens || 0),
        total_tokens:  acc.total_tokens  + (u.total_tokens  || 0),
      }),
      { input_tokens: 0, output_tokens: 0, total_tokens: 0 }
    )
    console.log('─'.repeat(68))
    console.log('[Extract] TOKEN USAGE + TIMING SUMMARY')
    console.log('─'.repeat(68))
    for (const [section, u] of Object.entries(usageLog)) {
      const pct = totalUsage.total_tokens > 0
        ? ((u.total_tokens / totalUsage.total_tokens) * 100).toFixed(1)
        : '0.0'
      console.log(
        `  ${section.padEnd(12)} | in: ${String(u.input_tokens).padStart(6)} | out: ${String(u.output_tokens).padStart(5)} | total: ${String(u.total_tokens).padStart(6)} (${pct}%) | ${(u.time_ms/1000).toFixed(2)}s`
      )
    }
    console.log('─'.repeat(68))
    console.log(
      `  ${'TOTAL'.padEnd(12)} | in: ${String(totalUsage.input_tokens).padStart(6)} | out: ${String(totalUsage.output_tokens).padStart(5)} | total: ${String(totalUsage.total_tokens).padStart(6)}        | wall: ${(totalMs/1000).toFixed(2)}s`
    )
    console.log('─'.repeat(68))

    // 4. Merge all results into a single resumeData object
    const resumeData = {
      // Basic
      name: results.personal?.name || '',
      headline: results.personal?.headline || null,
      email: results.personal?.email || null,
      phone: results.personal?.phone || null,
      alternatePhone: results.personal?.alternatePhone || null,
      dateOfBirth: results.personal?.dateOfBirth || null,
      gender: results.personal?.gender || null,
      nationality: results.personal?.nationality || null,
      maritalStatus: results.personal?.maritalStatus || null,
      location: results.personal?.location || null,
      currentAddress: results.personal?.currentAddress || null,
      permanentAddress: results.personal?.permanentAddress || null,
      socialLinks: results.personal?.socialLinks || null,
      summary: results.personal?.summary || null,

      // Experience — sorted newest first
      experience: sortDescByStart(results.experience?.experience || []),

      // Education
      education: results.education?.education || [],
      certifications: results.education?.certifications || null,
      awards: results.education?.awards || null,

      // Skills — only populated if a dedicated skills section was found in the resume
      skills: (() => {
        const s = results.skills?.skills
        const hasAny = s && (
          (s.technicalSkills?.length > 0) ||
          (s.softSkills?.length > 0) ||
          (s.toolsAndTechnologies?.length > 0)
        )
        return hasAny ? s : { technicalSkills: [], softSkills: [], toolsAndTechnologies: [] }
      })(),
      coreCompetencies: results.skills?.coreCompetencies?.length > 0 ? results.skills.coreCompetencies : null,
      languages: results.skills?.languages?.length > 0 ? results.skills.languages : null,
      interests: results.skills?.interests?.length > 0 ? results.skills.interests : null,

      // Extras
      projects: results.extras?.projects || null,
      publications: results.extras?.publications || null,
      professionalMemberships: results.extras?.professionalMemberships || null,
      volunteerExperience: results.extras?.volunteerExperience || null,
      resumeMetadata: results.extras?.resumeMetadata || null,
      employmentDetails: results.extras?.employmentDetails || null,
      atsAnalysis: results.extras?.atsAnalysis || null,
      extraSections: (() => {
        const EXCLUDE_RE = /personal\s*(profile|information|details|attributes|profiles?)|profile\s*summary|career\s*objective|about\s*me|professional\s*summary|^objective$|^summary$|^declaration$|^hobbies?$|areas?\s*of\s*interest|^interests?$|^skills?$|technical\s*skills?|soft\s*skills?|^languages?$|^education$|academic\s*qual|professional\s*qual|work\s*experience|^experience$|employment\s*(history|details)?|^certifications?$|^awards?|^achievements?$|^projects?$|^internship|^publications?$|^contact|^address|nationality|^gender$|date\s*of\s*birth|^name$/
        const filtered = (results.extras?.extraSections || []).filter(s => !EXCLUDE_RE.test((s.title || '').toLowerCase().trim()))
        return filtered.length > 0 ? filtered : null
      })(),
    }

    // 4. Validate minimum required fields
    if (!resumeData.name || resumeData.name.trim() === '') {
      await openai.files.delete(fileId).catch(() => {})
      clearInterval(heartbeat)
      sendSSE(res, {
        type: 'error',
        error: "We couldn't identify a name in your resume. Please ensure your name appears clearly at the top.",
        code: 'MISSING_NAME',
      })
      return res.end()
    }

    if (!resumeData.experience || resumeData.experience.length === 0) {
      await openai.files.delete(fileId).catch(() => {})
      clearInterval(heartbeat)
      sendSSE(res, {
        type: 'error',
        error: "We couldn't find any work experience in your resume. Please ensure your resume includes job history.",
        code: 'MISSING_EXPERIENCE',
      })
      return res.end()
    }

    const leadData = {
      name: resumeData.name || 'Unknown',
      email: resumeData.email || '',
      phone: resumeData.phone || '',
    }

    console.log('[Extract] Complete for:', resumeData.name)

    // 5. Persist lead + token usage only when Mongo is connected (bufferCommands=false → no queueing)
    const backendSessionId = fileId || `docx_${Date.now()}`
    if (isDbConnected()) {
      Lead.updateOne(
        { sessionId: backendSessionId },
        {
          $set:         { sessionId: backendSessionId, ...leadData },
          $setOnInsert: { extractedAt: new Date() },
        },
        { upsert: true },
      ).catch((err) => console.warn('[DB] Lead save failed:', err.message))

      TokenUsage.create({
        operation:    'extract',
        sessionId:    backendSessionId,
        inputTokens:  totalUsage.input_tokens,
        outputTokens: totalUsage.output_tokens,
        totalTokens:  totalUsage.total_tokens,
        sections:     usageLog,
        durationMs:   totalMs,
      }).catch((err) => console.warn('[DB] TokenUsage save failed:', err.message))
    }

    // 6. Send final done event (fileId kept alive for optimize route)
    sendSSE(res, {
      type: 'done',
      resumeData: normalizeNulls(resumeData),
      leadData,
      fileId,
    })

    clearInterval(heartbeat)
    res.end()

  } catch (error) {
    console.error('[Extract] Critical error:', error)
    clearInterval(heartbeat)

    // Clean up file if upload succeeded but extraction failed
    if (fileId) {
      await openai.files.delete(fileId).catch(() => {})
    }

    sendSSE(res, { type: 'error', error: error.message || 'Internal server error' })
    res.end()
  }
})

export default router
