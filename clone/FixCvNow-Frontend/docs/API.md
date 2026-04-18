# API Reference

All API routes are Next.js App Router route handlers located under `app/api/`. They are stateless — no data is stored on the server.

---

## POST `/api/extract-resume`

Extracts structured resume data from an uploaded file using OpenAI.

### Request

- **Content-Type**: `multipart/form-data`
- **Body field**: `file` — a PDF or Word document

```js
const formData = new FormData()
formData.append('file', file)

const res = await fetch('/api/extract-resume', {
  method: 'POST',
  body: formData,
})
```

### Processing

1. Reads the uploaded file as a buffer
2. Uploads the file to OpenAI using `openai.files.create()` (purpose: `"assistants"`)
3. Calls `openai.responses.parse()` with `zodTextFormat` and `reasoning: { effort: "medium" }`
4. Model: `gpt-5-nano`
5. Validates the response against the `ResumeSchema` Zod schema
6. Deletes the uploaded file from OpenAI after parsing (cleanup)
7. Validates minimum required fields (name + at least one experience entry)
8. Extracts `leadData` (name, email, phone) for lead tracking
9. **Retry**: if the first parse attempt fails, it is automatically retried once

### Response

```json
{
  "success": true,
  "resumeData": { ... },
  "leadData": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+91 9876543210"
  }
}
```

### Resume Data Schema

```ts
ResumeSchema = {
  name: string,
  title: string | null,
  email: string | null,
  phone: string | null,
  dateOfBirth: string | null,       // e.g. "15 March 1985" or "15/03/1985"
  nationality: string | null,
  address: {
    full: string | null,
    street: string | null,
    area: string | null,
    city: string | null,
    district: string | null,
    state: string | null,
    pin: string | null,
  } | null,
  socialLinks: Array<{              // any social/professional link
    label: string,                  // e.g. "LinkedIn", "GitHub", "Portfolio"
    url: string,                    // full URL or handle as written
  }> | null,
  summary: string | null,
  keyHighlights: string[] | null,   // from dedicated "Key Highlights" section if present
  experience: Array<{
    company: string,
    role: string,
    start: string | null,
    end: string | null,
    description: string[] | null,   // bullet points; null for roles with no description
  }>,
  education: Array<{
    institution: string,
    degree: string,
    field: string | null,
    start: string | null,
    end: string | null,
  }>,
  skills: string[],
  languages: string[] | null,
  certifications: Array<{
    name: string,
    issuer: string | null,
    year: string | null,
  }> | null,
  awards: string[] | null,         // awards, prizes, recognitions from dedicated sections
}
```

### Error Responses

**Missing name:**
```json
{
  "error": "We couldn't identify a name in your resume...",
  "code": "MISSING_NAME"
}
```
HTTP status: `400`

**Missing experience:**
```json
{
  "error": "We couldn't find any work experience in your resume...",
  "code": "MISSING_EXPERIENCE"
}
```
HTTP status: `400`

**Server error:**
```json
{
  "error": "Internal server error",
  "message": "..."
}
```
HTTP status: `500`

---

## POST `/api/optimize-resume`

Rewrites a resume's summary, key highlights, and experience bullet points using OpenAI. Also detects candidate seniority and returns an ATS keyword analysis.

### Request

- **Content-Type**: `application/json`
- **Body**:

```json
{
  "resumeData": { ... }
}
```

The full `resumeData` object (as returned by `/api/extract-resume`) must be passed in.

```js
const res = await fetch('/api/optimize-resume', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ resumeData }),
})
```

### Processing

1. Accepts `resumeData` from the request body
2. Sends it to OpenAI using `openai.responses.parse()` with `zodTextFormat` and `temperature: 0.6`
3. Model: `gpt-4o-mini`
4. The AI performs three steps:
   - **Step 1 — Seniority detection**: classifies as `junior` / `mid` / `senior` based on title, years, scope
   - **Step 2 — Content optimization**: rewrites summary and experience bullets based on seniority level; strategic governance language for senior, achievement-oriented for junior/mid
   - **Step 3 — ATS analysis**: identifies present keywords, added keywords, and missing keywords
5. Also generates `keyHighlights` (4–6 metric-led highlights for mid/senior profiles; returns existing or null for junior)
6. Validates response against `OptimizedContentSchema`
7. Merges optimized content back into the original `resumeData` — all other fields (education, skills, address, certifications, awards, etc.) are preserved unchanged

### Optimized Content Schema (internal)

```ts
OptimizedContentSchema = {
  seniority: "junior" | "mid" | "senior",
  summary: string | null,
  keyHighlights: string[] | null,
  experience: Array<{
    company: string,
    role: string,
    start: string | null,
    end: string | null,
    description: string[] | null,
  }>,
  ats: {
    keywords_detected: string[],   // ATS keywords already in the resume
    keywords_added: string[],      // keywords reinforced through optimization
    missing_keywords: string[],    // important industry keywords not yet present
  },
}
```

### Response

```json
{
  "success": true,
  "optimizedData": {
    "name": "Jane Doe",
    "summary": "Results-driven software engineer with 8+ years...",
    "keyHighlights": ["Grew platform revenue by 40%...", "Led 15-person engineering team..."],
    "experience": [ ... ],
    "skills": [ ... ],
    "education": [ ... ]
    // ...all other original fields preserved
  },
  "ats": {
    "keywords_detected": ["Python", "machine learning", "data pipeline"],
    "keywords_added": ["ETL", "stakeholder management"],
    "missing_keywords": ["Spark", "dbt", "MLOps"]
  }
}
```

### Error Response

```json
{
  "error": "Optimization failed",
  "message": "..."
}
```
HTTP status: `500`

---

## POST `/api/download/pdf`

Generates a styled PDF of the resume using `@react-pdf/renderer` and streams it as a downloadable file.

### Request

- **Content-Type**: `application/json`
- **Body**:

```json
{
  "resumeData": { ... },
  "templateId": 1
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `resumeData` | object | Yes | Full resume data object |
| `templateId` | number | No | `1` (Classic), `2` (Navy), `3` (Serif). Defaults to `1` |

```js
const res = await fetch('/api/download/pdf', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ resumeData, templateId }),
})

const blob = await res.blob()
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = 'resume.pdf'
a.click()
```

### Processing

1. Receives `resumeData` and `templateId`
2. Selects the matching `@react-pdf/renderer` template component via `getPDFComponent()`
3. Renders to a binary buffer using `renderToBuffer()`
4. Returns the buffer as a PDF blob

### Response

- **Content-Type**: `application/pdf`
- **Content-Disposition**: `attachment; filename="<Name>.pdf"`
- **Body**: raw PDF binary

### Error Response

```json
{ "error": "PDF generation failed" }
```
HTTP status: `500`

### PDF Template Files

| Template ID | File |
|-------------|------|
| `1` | `lib/pdf/classic-professional.jsx` |
| `2` | `lib/pdf/executive-navy.jsx` |
| `3` | `lib/pdf/minimal-serif.jsx` |

All PDF templates use built-in fonts (`Helvetica`, `Times-Roman`). Emoji characters are not supported — contact info uses `Ph.` / `Email` / `Addr.` text labels instead.

---

## POST `/api/download/word`

Generates a styled Word (.docx) document of the resume using the `docx` library and streams it as a downloadable file.

### Request

- **Content-Type**: `application/json`
- **Body**:

```json
{
  "resumeData": { ... },
  "templateId": 1
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `resumeData` | object | Yes | Full resume data object |
| `templateId` | number | No | `1` (Classic), `2` (Navy), `3` (Serif). Defaults to `1` |

```js
const res = await fetch('/api/download/word', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ resumeData, templateId }),
})

const blob = await res.blob()
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = 'resume.docx'
a.click()
```

### Processing

1. Receives `resumeData` and `templateId`
2. Selects the matching `docx` builder function via `getWordDocument()`
3. Serializes the document to a binary buffer using `Packer.toBuffer()`
4. Returns the buffer as a `.docx` blob

### Response

- **Content-Type**: `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- **Content-Disposition**: `attachment; filename="<Name>.docx"`
- **Body**: raw Word binary

### Error Response

```json
{ "error": "Word generation failed" }
```
HTTP status: `500`

### Word Template Files

| Template ID | File |
|-------------|------|
| `1` | `lib/word/classic-professional.js` |
| `2` | `lib/word/executive-navy.js` |
| `3` | `lib/word/minimal-serif.js` |

The Executive Navy Word template uses a single `Table` with `columnSpan: 2` on the header row so the navy banner spans full page width independently of the 35%/65% column split below.

---

## Notes

- `/api/extract-resume` and `/api/optimize-resume` require `OPENAI_API_KEY` to be set in environment variables
- `/api/download/pdf` and `/api/download/word` have no external dependencies — they run entirely server-side with npm packages
- File parsing is handled by OpenAI's file processing — supports PDF and Word formats
- Structured output is enforced via Zod schemas using `zodTextFormat` (OpenAI's `response_format` feature), so responses are always valid and typed
- `gpt-5-nano` does **not** support `temperature`, `top_p`, or other sampling parameters — only `reasoning: { effort }` is supported as an additional control
- `gpt-4o-mini` supports `temperature` (used at `0.6` in the optimize route)
- There is no rate limiting implemented currently; this should be added before production launch
- No data is logged or stored server-side
