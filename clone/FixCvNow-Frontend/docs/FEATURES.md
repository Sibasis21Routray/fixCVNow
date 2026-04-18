# Features

## User Journey

```
Landing Page
    ↓
Upload Resume (PDF/Word)
    ↓
Processing Screen (AI Extraction via gpt-5-nano)
    ↓
Template Selection
    ↓
Resume Preview
    ├── Change Template
    ├── Pay ₹9 → Download PDF  (server-generated via @react-pdf/renderer)
    ├── Pay ₹9 → Download Word (.docx)  (server-generated via docx)
    └── Pay ₹20 → AI Optimize → Compare → Download PDF or Word
```

---

## Feature Details

### 1. Landing Page

- Hero section explaining the product value proposition
- Single CTA button: "Optimize My CV"
- Navigates to the upload page

---

### 2. Resume Upload

- Accepts PDF and Word (`.doc`, `.docx`) files
- File size and type validation before upload
- Stores the File object in an in-memory map (not sessionStorage — `File` objects cannot be serialized)
- Generates a unique `sessionId` at this point
- Navigates to the processing screen on confirmation

---

### 3. AI Extraction (ProcessingPage)

- Animated progress bar (0 → 95% smooth, then jumps to 100% on completion)
- 8 animated step indicators that light up sequentially
- The actual API call happens after an 800ms delay to let the animation start
- **Refresh protection**: if the user refreshes on this page, the in-memory file is gone. The component detects this and immediately redirects to `/` instead of re-calling the API
- **Back button protection**: `history.pushState` prevents the browser back button from leaving this page mid-extraction
- On success: saves `resumeData` and `leadData` to `sessionStorage`, navigates to template selector
- On failure: shows a styled error screen with "Try Again" and "Go to Home" buttons
- **Auto-retry**: if the OpenAI parse fails on first attempt, the API automatically retries once

#### Fields extracted

| Field | Description |
|-------|-------------|
| `name` | Full name (required — fails if missing) |
| `title` | Current job title |
| `email`, `phone` | Contact details |
| `dateOfBirth` | Date of birth, exactly as written in the resume |
| `nationality` | Nationality if stated |
| `address` | Structured address (full, city, state, pin, etc.) |
| `socialLinks` | All social/professional links as `[{ label, url }]` — LinkedIn, GitHub, Portfolio, Website, Twitter, etc. |
| `summary` | Professional summary |
| `keyHighlights` | Points from a dedicated "Key Highlights" or "Achievements" section |
| `experience` | Work history: company, role, dates, bullet points |
| `education` | Degrees, institutions, years |
| `skills` | Skills list |
| `languages` | Languages spoken |
| `certifications` | Certifications with issuer and year |
| `awards` | Awards, prizes, recognitions from dedicated sections |

---

### 4. Template Selection (TemplateSelector)

- 3 template choices with live preview cards (real extracted data shown in each thumbnail):
  - Classic Professional (ID: 1)
  - Executive Navy (ID: 2)
  - Minimal Serif (ID: 3)
- Clicking a template navigates to `/?id=<sessionId>&template=<templateId>`

---

### 5. Resume Preview (ResumePreview)

This is the core screen. It has three zones:

#### Left sidebar

- Session info (name, extracted date)
- "Change Template" button → goes back to TemplateSelector
- Download card (₹9) — triggers payment modal; shows separate "Download PDF" and "Download Word" buttons after payment
- Optimize card (₹20) — triggers payment modal, hidden permanently after optimization is paid
- If AI optimized: compare toggle (Original | ✨ AI Optimized)

#### Main area

- Full resume rendered in the selected template
- Switches between original and optimized content based on view mode

#### Session error handling

- If `?id` is missing from URL → `SessionExpired` screen ("Session Not Found")
- If `?template` is missing → `SessionExpired` screen ("Invalid Session")
- If `resumeStorage.getResumeData(sessionId)` returns null → `SessionExpired` screen ("Session Not Found")

---

### 6. Change Template

- User can switch templates freely at any point from the ResumePreview sidebar
- Clicking "Change Template" → `router.push('/?id=<sessionId>')` → TemplateSelector
- Payment status and optimized data are preserved (stored in `sessionStorage` by `sessionId`)
- After selecting a new template, the user is taken back to ResumePreview with the same data

---

### 7. Download PDF (₹9)

- Available to all users immediately
- Clicking "Download PDF" opens the PaymentModal showing the ₹9 plan features
- After payment (not yet integrated — UI only), `paymentStatus` is set to `'basic'`
- Calls `POST /api/download/pdf` with `{ resumeData, templateId }`
- Server generates the PDF using `@react-pdf/renderer` — produces a visually styled file matching the template
- Browser downloads the file as `<Name>.pdf` via `URL.createObjectURL()`
- Each template has its own `@react-pdf/renderer` component in `lib/pdf/`
- Contact info displayed as `Ph.` / `Email` / `Addr.` text labels (emoji not supported by PDF built-in fonts)
- Shows an independent loading spinner on the PDF button while generating; the Word button is unaffected
- Once paid, all future downloads on the same session are free

---

### 8. Download Word (.docx) (₹9)

- Available alongside PDF download after payment
- Calls `POST /api/download/word` with `{ resumeData, templateId }`
- Server generates the Word document using the `docx` npm library — produces a `.docx` file styled to match the template
- Browser downloads the file as `<Name>.docx` via `URL.createObjectURL()`
- Each template has its own `docx` builder in `lib/word/`
- The Executive Navy Word template uses a single table with `columnSpan: 2` on the header row so the navy banner spans full page width independently of the 35%/65% column split below
- Shows an independent loading spinner on the Word button while generating; the PDF button is unaffected

---

### 9. AI Optimization (₹20)

- Available once only — the Optimize card disappears after payment
- Clicking "Optimize with AI" opens the PaymentModal showing the ₹20 plan features
- After payment (UI only), the app calls `POST /api/optimize-resume`
- A loading spinner shows while the API processes
- On success: `optimizedData` saved to `sessionStorage` as `optimized_<sessionId>`
- `paymentStatus` set to `'optimized'`
- Compare toggle appears: "Original" | "✨ AI Optimized"
- Viewing AI Optimized and downloading (PDF or Word) is free from that point
- On failure: destructive toast notification ("Optimization failed. Please try again.")

#### What the AI optimizes

| What changes | Detail |
|---|---|
| **Seniority detection** | Classified as `junior` / `mid` / `senior` based on title, years of experience, and scope language |
| **Summary** | Rewritten to be metric-led and transformation-focused (senior) or professional and growth-oriented (junior/mid) |
| **Experience bullets** | Strengthened with action verbs, better quantification, cleaner phrasing; strategic governance language for senior |
| **Key Highlights** | Generated (4–6 metric-led highlights) for mid/senior profiles; null returned for junior unless original resume had highlights |
| **ATS analysis** | Returns `keywords_detected`, `keywords_added`, and `missing_keywords` |

#### What does NOT change

- Company names, roles, and dates (always preserved exactly)
- Education, skills, languages, certifications, awards, address, contact info

---

### 10. Compare View

- Appears in the sidebar after successful optimization
- Toggle between "Original" and "✨ AI Optimized"
- The template re-renders with the selected data
- Fields that change: `summary`, `experience` descriptions, `keyHighlights`
- All other fields are identical between original and optimized

---

### 11. Session Expiry Handling

`SessionExpired` is a reusable full-page error component used whenever a session is invalid:

- Large red alert icon
- Clear title and message explaining why the session is unavailable
- Animated countdown bar (6 seconds by default)
- Auto-redirects to `/` after countdown
- Action buttons: "Go to Home" and "Upload New Resume"

Common triggers:
- User opens a shared resume URL in a new browser or tab
- User refreshes the page after sessionStorage was cleared
- URL is manually constructed with a non-existent session ID

---

## What Is Not Yet Implemented

| Feature | Status |
|---------|--------|
| Actual payment processing (Razorpay/Stripe) | Planned |
| Displaying ATS analysis results in the UI | Planned |
| Email delivery of resume | Planned |
| Lead capture / CRM integration | Planned |
| Rate limiting on API routes | Planned |
| Analytics / conversion tracking | Planned |
