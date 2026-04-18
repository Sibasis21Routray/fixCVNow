# Developer Guide

This guide is written for developers new to the codebase. It explains how the system works end-to-end and — most importantly — **where to make changes and what they will affect**.

---

## Table of Contents

1. [How the System Works (Quick Summary)](#how-the-system-works)
2. [The 10-File Rule: Adding or Changing a Resume Field](#the-10-file-rule)
3. [Adding a New Resume Template](#adding-a-new-resume-template)
4. [Changing the AI Extraction Behavior](#changing-the-ai-extraction-behavior)
5. [Changing the AI Optimization Behavior](#changing-the-ai-optimization-behavior)
6. [Key Files and Their Roles](#key-files-and-their-roles)
7. [Common Gotchas](#common-gotchas)

---

## How the System Works

Here is the full lifecycle of a user session:

```
1. User lands on the site → LandingPage
2. User uploads a PDF/Word file → UploadPage stores it in memory
3. ProcessingPage sends the file to POST /api/extract-resume
4. The API uploads the file to OpenAI (gpt-5-nano) and parses structured JSON
5. resumeData is saved to sessionStorage under a unique sessionId
6. User picks a template → navigates to ResumePreview
7. ResumePreview reads resumeData from sessionStorage and renders the template
8. User optionally pays ₹20 → calls POST /api/optimize-resume (gpt-4o-mini)
9. optimizedData is saved to sessionStorage; user can toggle between original/optimized
10. User pays ₹9 → calls POST /api/download/pdf or POST /api/download/word
11. Server generates the file and returns it as a binary blob for browser download
```

There is **no database**. All data lives in the browser's `sessionStorage`. The server routes are fully stateless.

---

## The 10-File Rule

**When you add, rename, or remove a field from the resume data structure**, you must update up to 10 files to keep everything in sync. Every field flows through this chain:

```
Zod Schema (extract route)
    → AI Prompt (extract route)
    → 3 UI Templates (components/templates/*)
    → 3 PDF Templates (lib/pdf/*)
    → 3 Word Templates (lib/word/*)
    → [Optional] Zod Schema + Prompt (optimize route)
```

### Step-by-step: Adding a new field

**Example: adding a `portfolio` field (a single URL string)**

---

#### Step 1: Add to the Zod schema in the extract route

File: `app/api/extract-resume/route.js`

```js
const ResumeSchema = z.object({
  // ...existing fields
  portfolio: z.string().nullable(),   // ← add this
})
```

---

#### Step 2: Update the extraction prompt

File: `app/api/extract-resume/route.js` — the system prompt string

```
"10. Extract the candidate's portfolio URL if present."
```

The AI will now extract the field. Without the prompt instruction, the field will always be null even if it's in the schema.

---

#### Step 3–5: Add to all 3 UI templates

Files:
- `components/templates/classic-professional/index.js`
- `components/templates/executive-navy/index.js`
- `components/templates/minimal-serif/index.js`

Example (wherever contact info is shown):
```jsx
{data.portfolio && <span>Portfolio: {data.portfolio}</span>}
```

---

#### Step 6–8: Add to all 3 PDF templates

Files:
- `lib/pdf/classic-professional.jsx`
- `lib/pdf/executive-navy.jsx`
- `lib/pdf/minimal-serif.jsx`

Example (inside the `<View>` that renders contact info):
```jsx
{data.portfolio && <Text style={styles.contactItem}>Portfolio: {data.portfolio}</Text>}
```

---

#### Step 9–11: Add to all 3 Word templates

Files:
- `lib/word/classic-professional.js`
- `lib/word/executive-navy.js`
- `lib/word/minimal-serif.js`

Example (wherever contactParts or contactLine is built):
```js
const contactParts = [data.phone, data.email, data.portfolio].filter(Boolean)
```

---

#### Step 12 (optional): If the field should be AI-optimized

File: `app/api/optimize-resume/route.js`

- Add the field to `OptimizedContentSchema`
- Add instructions to `SYSTEM_PROMPT`
- Merge it back in the `optimizedData` object at the end of the route

---

### Existing fields and where they appear

| Field | Extract Schema | Extract Prompt | UI Templates | PDF | Word | Optimize |
|-------|:---:|:---:|:---:|:---:|:---:|:---:|
| `name` | ✓ | ✓ | ✓ | ✓ | ✓ | preserved |
| `title` | ✓ | ✓ | ✓ | ✓ | ✓ | preserved |
| `email`, `phone` | ✓ | ✓ | ✓ | ✓ | ✓ | preserved |
| `dateOfBirth` | ✓ | ✓ | — | — | — | preserved |
| `nationality` | ✓ | ✓ | — | — | — | preserved |
| `address` | ✓ | ✓ | ✓ | ✓ | ✓ | preserved |
| `socialLinks` | ✓ | ✓ | ✓ | ✓ | ✓ | preserved |
| `summary` | ✓ | ✓ | ✓ | ✓ | ✓ | **optimized** |
| `keyHighlights` | ✓ | ✓ | ✓ | ✓ | ✓ | **generated/optimized** |
| `experience` | ✓ | ✓ | ✓ | ✓ | ✓ | **optimized** |
| `education` | ✓ | ✓ | ✓ | ✓ | ✓ | preserved |
| `skills` | ✓ | ✓ | ✓ | ✓ | ✓ | preserved |
| `languages` | ✓ | ✓ | ✓ | ✓ | ✓ | preserved |
| `certifications` | ✓ | ✓ | ✓ | ✓ | ✓ | preserved |
| `awards` | ✓ | ✓ | ✓ | ✓ | ✓ | preserved |

> **Note**: `dateOfBirth` and `nationality` are extracted but not currently rendered in any template. They are available in `resumeData` if you want to display them.

> **Note on `keyHighlights` at extraction time**: If the resume has a dedicated "Key Highlights" / "Key Achievements" section, it is captured verbatim. If not, the extract prompt synthesizes 3–5 highlights from awards/recognition and top bullet points for candidates with **10+ years of experience or a senior title** (HOD, Head, Manager, Director, VP, Chief, Lead, etc.). Candidates with fewer than 10 years and no senior title and no dedicated section will have `keyHighlights: null` after extraction — the optimize route will generate them on demand for mid/senior profiles.

---

## Adding a New Resume Template

See `docs/TEMPLATES.md` → "Adding a New Template" for the full walkthrough.

**Summary of files to create/edit:**

| Action | File |
|--------|------|
| Create UI component + preview | `components/templates/<name>/index.js` |
| Create PDF template | `lib/pdf/<name>.jsx` |
| Create Word template | `lib/word/<name>.js` |
| Register PDF dispatcher | `lib/pdf/index.js` |
| Register Word dispatcher | `lib/word/index.js` |
| Register in template picker | `components/TemplateSelector.js` |
| Register in preview | `components/ResumePreview.js` |

---

## Changing the AI Extraction Behavior

The extraction route is at `app/api/extract-resume/route.js`.

### To change what fields are extracted

1. Modify `ResumeSchema` (Zod) to add/remove/rename fields
2. Update the system prompt to instruct the AI accordingly
3. Update all templates that display those fields (3 UI + 3 PDF + 3 Word)

### To change how bullet points are structured

Edit the **PHASE 2 — STRUCTURE descriptions** section of the system prompt. Currently it normalizes to 3–8 bullets per role, removes duplicates, and preserves all numbers.

### To adjust reasoning effort

The extract route uses `reasoning: { effort: "medium" }`. This controls how much the model "thinks" before answering. Options: `"minimal"`, `"low"`, `"medium"`, `"high"`.

**Important**: `gpt-5-nano` does NOT support `temperature`, `top_p`, or other sampling parameters. Only `reasoning: { effort }` is valid as an extra control parameter.

### To change the model

Change `model: "gpt-5-nano"` on the `openai.responses.parse()` call. If you switch to a model that supports temperature (e.g., `gpt-4o-mini`), remove the `reasoning` block and add `temperature` instead.

---

## Changing the AI Optimization Behavior

The optimization route is at `app/api/optimize-resume/route.js`.

### To change the seniority thresholds

Edit the **STEP 1 — INFER SENIORITY** section of `SYSTEM_PROMPT`. Current thresholds:
- `junior`: 0–6 years, individual contributor
- `mid`: 7–14 years, team lead or specialist
- `senior`: 15+ years OR VP/Director/Head of/CXO equivalent

### To change how bullets are rewritten

Edit the **STEP 2 — OPTIMIZE BULLETS AND SUMMARY** section. Separate sub-rules apply for all levels vs. junior/mid vs. senior.

### To change Key Highlights generation

Edit the **KEY HIGHLIGHTS GENERATION** section. Currently:
- Mid and senior: generate 4–6 metric-led highlights
- Junior OR original has good highlights: return existing (improved) or null

### To change the ATS analysis

Edit the **STEP 3 — ATS OPTIMIZATION** section. The AI identifies keywords present, added, and missing.

### To add a new optimized field

1. Add the field to `OptimizedContentSchema` (Zod)
2. Add instructions in `SYSTEM_PROMPT`
3. Include the field in the user prompt input text (so the AI can see the current value)
4. Merge the field into `optimizedData` at the bottom of the route

### Model note

The optimize route uses `gpt-4o-mini` with `temperature: 0.6`. This model supports temperature. Do not add `reasoning: { effort }` here — that is for gpt-5-nano only.

---

## Key Files and Their Roles

### Entry Point / Routing

| File | Role |
|------|------|
| `app/page.js` | Next.js page — just renders `HomeClient` |
| `app/HomeClient.jsx` | SPA router — reads URL params, renders the correct screen |
| `app/layout.tsx` | Root layout — includes `<Toaster />` for global toasts |

### UI Screens

| File | Screen |
|------|--------|
| `components/LandingPage.js` | Hero + CTA |
| `components/UploadPage.js` | File upload, session ID generation, in-memory file storage |
| `components/ProcessingPage.js` | Progress animation, calls extract API, handles errors |
| `components/TemplateSelector.js` | Template picker with live preview thumbnails |
| `components/ResumePreview.js` | Main view — compare toggle, payment modal, download buttons |
| `components/SessionExpired.js` | Full-page error with countdown redirect |

### Templates (UI)

| File | Template |
|------|---------|
| `components/templates/classic-professional/index.js` | Classic Professional — full + preview |
| `components/templates/executive-navy/index.js` | Executive Navy — full + preview |
| `components/templates/minimal-serif/index.js` | Minimal Serif — full + preview |

### API Routes

| File | Route |
|------|-------|
| `app/api/extract-resume/route.js` | `POST /api/extract-resume` — AI extraction (gpt-5-nano) |
| `app/api/optimize-resume/route.js` | `POST /api/optimize-resume` — AI optimization (gpt-4o-mini) |
| `app/api/download/pdf/route.jsx` | `POST /api/download/pdf` — PDF generation (note: `.jsx` extension required) |
| `app/api/download/word/route.js` | `POST /api/download/word` — Word generation |

### PDF Templates

| File | Template |
|------|---------|
| `lib/pdf/index.js` | Dispatcher — `getPDFComponent(resumeData, templateId)` |
| `lib/pdf/classic-professional.jsx` | Classic Professional PDF |
| `lib/pdf/executive-navy.jsx` | Executive Navy PDF |
| `lib/pdf/minimal-serif.jsx` | Minimal Serif PDF |

### Word Templates

| File | Template |
|------|---------|
| `lib/word/index.js` | Dispatcher — `getWordDocument(resumeData, templateId)` |
| `lib/word/classic-professional.js` | Classic Professional Word |
| `lib/word/executive-navy.js` | Executive Navy Word |
| `lib/word/minimal-serif.js` | Minimal Serif Word |

### Utilities / Config

| File | Role |
|------|------|
| `lib/storage.js` | sessionStorage helpers (`resumeStorage`, `leadsStorage`, `sessionStorage_util`) |
| `lib/theme.js` | Color, font, and size constants for all templates (`TEMPLATE['<id>']`) |
| `lib/utils/groupExperience.js` | Groups multi-role company entries for experience rendering |
| `hooks/use-toast.ts` | shadcn toast hook — `import { toast } from "@/hooks/use-toast"` |

---

## Common Gotchas

### 1. `gpt-5-nano` does not support temperature

If you pass `temperature` to `gpt-5-nano`, it will return a 400 error. The extract route uses `reasoning: { effort: "medium" }` instead. Do not add temperature there.

### 2. Edit requires reading the file first

The `Edit` tool (and most editor tools) require the file to be read in the current session before it can be modified. If you get a "File has not been read yet" error, read the file first.

### 3. PDF route file must be `.jsx`

The PDF download route at `app/api/download/pdf/route.jsx` must use the `.jsx` extension — it contains JSX syntax (`<Component />`). Renaming it to `.js` will cause a build error.

### 4. No emoji in PDF templates

`@react-pdf/renderer` built-in fonts (`Helvetica`, `Times-Roman`, etc.) do not support emoji. Use text labels like `Ph.`, `Email`, `Addr.` instead of phone/mail/location emoji.

### 5. Word hex colors have no `#` prefix

When setting `shading` or colors in `docx`, hex colors must be plain strings without `#`: `"1A3A5C"` not `"#1A3A5C"`.

### 6. Word sizes are in twips

All Word template measurements are in twips (1 inch = 1440 twips). Use `convertInchesToTwip(n)` from `docx` to convert inches to twips for readability.

### 7. `sessionStorage` is tab-scoped

Opening the URL in a new tab shows "Session Not Found" — this is expected behavior, not a bug. The `SessionExpired` component handles this with a redirect countdown.

### 8. File object lives in memory, not sessionStorage

The uploaded `File` object (from the file input) is stored in an in-memory Map (`sessionStorage_util._uploadedFileMap`), not in sessionStorage. It is cleared on page refresh. If a user refreshes `ProcessingPage`, the file is gone and the component redirects to `/` automatically.

### 9. `npm install` needs `--legacy-peer-deps`

There is a peer dependency conflict between `react-day-picker` and `date-fns@4`. Always use:
```bash
npm install --legacy-peer-deps
```

### 10. Adding a section to only one template

If you add a section to one template's UI but not its PDF/Word counterparts, downloads will be missing the section. Always update all three representations together.

### 11. `groupExperience` is used by all templates

`lib/utils/groupExperience.js` groups multi-role entries at the same company. All three template types use it. If you change how experience data is structured (e.g., add a new field to each role), update `groupExperience.js` to pass that field through the grouped output.

### 12. `displayData` in ResumePreview

`ResumePreview.js` has a `viewMode` state (`'original'` or `'optimized'`). The rendered template always receives `displayData`, which is:
```js
const displayData = viewMode === 'optimized' && optimizedData ? optimizedData : resumeData
```
Both downloads (PDF and Word) also use `displayData`, so the user downloads whichever version they are viewing.
