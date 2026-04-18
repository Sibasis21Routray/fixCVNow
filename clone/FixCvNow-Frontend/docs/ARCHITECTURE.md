# Architecture

## Overview

FixCVNow is a single-page application (SPA) built on the **Next.js App Router**. All navigation happens inside one page (`app/page.js`) via URL search parameters — there are no separate Next.js routes for different screens. The server side handles AI processing and document generation via four API routes.

---

## Routing

All routing is handled client-side by `HomeClient.jsx`. The URL params determine which screen to render:

```
/?                              → LandingPage
/?page=upload                   → UploadPage
/?page=processing&id=<sid>      → ProcessingPage (extraction)
/?id=<sid>                      → TemplateSelector
/?id=<sid>&template=<tid>       → ResumePreview
```

### Routing Logic (simplified)

```js
// HomeClient.jsx
if (id && template)  → <ResumePreview />
if (id)              → <TemplateSelector />
if (page === 'processing') → <ProcessingPage />
if (page === 'upload')     → <UploadPage />
default              → <LandingPage />
```

Navigation uses `router.push()` and `router.replace()` from Next.js `useRouter`. The back button from ProcessingPage is blocked using `history.pushState` so users cannot accidentally re-trigger extraction.

---

## Data Flow

### Extraction Flow

```
User uploads file
      ↓
UploadPage saves file to sessionStorage_util (in-memory Map)
      ↓
Navigates to /processing?id=<sessionId>
      ↓
ProcessingPage reads file from memory
      ↓
POST /api/extract-resume  (file → OpenAI gpt-5-nano → structured JSON)
      ↓
resumeStorage.saveResumeData(sessionId, data)  → sessionStorage
leadsStorage.updateLead(sessionId, leadData)   → sessionStorage
      ↓
Navigates to /?id=<sessionId>  (TemplateSelector)
      ↓
User picks template
      ↓
Navigates to /?id=<sessionId>&template=<templateId>  (ResumePreview)
```

### Optimization Flow

```
User clicks "Optimize with AI" in ResumePreview
      ↓
PaymentModal shown (₹20)  [payment not yet integrated]
      ↓
POST /api/optimize-resume  (resumeData → OpenAI gpt-4o-mini → optimized JSON)
      ↓
Response includes: optimizedData + ats { keywords_detected, keywords_added, missing_keywords }
      ↓
Optimized data cached in sessionStorage as `optimized_<sessionId>`
      ↓
paymentStatus set to 'optimized' in sessionStorage as `payment_<sessionId>`
      ↓
Compare toggle (Original | AI Optimized) appears in UI
```

### Download Flow

```
User clicks "Download PDF" or "Download Word" in ResumePreview
      ↓
PaymentModal shown (₹9)  [payment not yet integrated]
      ↓
POST /api/download/pdf  OR  POST /api/download/word
Body: { resumeData, templateId }
      ↓
Server generates document using @react-pdf/renderer (PDF) or docx (Word)
      ↓
Binary blob returned in response
      ↓
Browser triggers file download via URL.createObjectURL()
```

---

## Component Hierarchy

```
app/page.js
  └─ HomeClient.jsx  (SPA router)
       ├─ LandingPage.js
       ├─ UploadPage.js
       ├─ ProcessingPage.js
       ├─ TemplateSelector.js
       │    └─ ClassicPreview, NavyPreview, SerifPreview
       └─ ResumePreview.js
            ├─ PaymentModal  (inline component)
            ├─ ClassicProfessionalTemplate
            ├─ ExecutiveNavyTemplate
            ├─ MinimalSerifTemplate
            └─ SessionExpired.js  (shown on missing/invalid session)
```

---

## Server-Side

Four API routes handle all server-side logic:

| Route | Model | Purpose |
|-------|-------|---------|
| `POST /api/extract-resume` | `gpt-5-nano` | Parses uploaded file, extracts all resume fields via OpenAI Responses API |
| `POST /api/optimize-resume` | `gpt-4o-mini` | Detects seniority, rewrites summary/bullets, generates keyHighlights, returns ATS analysis |
| `POST /api/download/pdf` | — | Generates a styled PDF using `@react-pdf/renderer` and returns a binary blob |
| `POST /api/download/word` | — | Generates a styled Word `.docx` using `docx` and returns a binary blob |

The first two routes require `OPENAI_API_KEY`. The download routes are fully self-contained with no external API calls. All routes are **stateless** — nothing is persisted on the server.

### OpenAI API Usage

Both AI routes use `openai.responses.parse()` with `zodTextFormat` for structured output:

- **Extract route** (`gpt-5-nano`): uploads the file to OpenAI, sends it with `input_file` content type, uses `reasoning: { effort: "medium" }`. Does NOT support `temperature`.
- **Optimize route** (`gpt-4o-mini`): sends resume data as text, uses `temperature: 0.6`.

---

## Template System

Each template has three representations:

| Representation | Location | Used by |
|---------------|----------|---------|
| UI component (React/Tailwind) | `components/templates/<name>/index.js` | `ResumePreview.js`, `TemplateSelector.js` |
| PDF template (`@react-pdf/renderer`) | `lib/pdf/<name>.jsx` | `POST /api/download/pdf` |
| Word template (`docx`) | `lib/word/<name>.js` | `POST /api/download/word` |

Dispatcher modules (`lib/pdf/index.js`, `lib/word/index.js`) select the correct template based on `templateId`.

Experience entries are pre-processed by `lib/utils/groupExperience.js`, which groups multiple roles at the same company together. All three template representations use this utility.

---

## Session Identity

Each session gets a unique ID generated at upload time:

```js
const sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2)}`
```

This ID is used as:
- URL param `?id=<sessionId>`
- Key prefix for all `sessionStorage` entries (`resume_<id>`, `lead_<id>`, `payment_<id>`, `optimized_<id>`)

Sessions are **tab-scoped**: sharing the URL in a new tab or browser results in a "Session Not Found" screen with a countdown redirect, because `sessionStorage` does not persist across tabs or devices.

---

## Error Handling

| Scenario | Handling |
|---------|---------|
| No session data for URL ID | `SessionExpired` full-page component with 6s countdown redirect |
| Extraction API failure | Error screen in `ProcessingPage` with retry + home buttons |
| Optimization API failure | `toast({ variant: "destructive" })` in sidebar |
| PDF/Word download failure | `toast({ variant: "destructive" })` in sidebar |
| User refreshes on ProcessingPage | Detects missing in-memory file → `router.replace('/')` immediately |
| User presses back from ProcessingPage | Blocked via `history.pushState` popstate handler |
| OpenAI parse failure on extraction | Auto-retried once before returning an error |

---

## State Management

No global state management library is used. State is managed via:

1. **React `useState`** — component-local UI state (progress, modals, view mode, download loading states per button)
2. **`sessionStorage`** — cross-component persistent state (resume data, payment status, optimized data)
3. **URL params** — routing and session identity
4. **In-memory Map** (`sessionStorage_util._uploadedFileMap`) — stores the actual `File` object before it's sent to the API (File objects cannot be serialized to sessionStorage)
