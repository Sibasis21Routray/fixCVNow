# FixCVNow — AI-Powered Resume Optimizer

FixCVNow is a no-login, no-database resume optimization SaaS built with Next.js and OpenAI. Users upload their CV, get it extracted and displayed in a professional template, and can optionally pay to download or AI-optimize it.

----






## Features

- Upload a PDF or Word resume and extract structured data via OpenAI (`gpt-5-nano`)
- Extracts: name, title, contact info, date of birth, nationality, social links (LinkedIn, GitHub, portfolio, etc.), summary, key highlights, experience, education, skills, languages, certifications, awards
- Choose from 3 professional resume templates with live preview
- Switch templates freely before downloading
- Pay ₹9 to download your formatted resume as **PDF** (server-generated via `@react-pdf/renderer`)
- Pay ₹9 to download as **Word (.docx)** (server-generated via `docx`)
- Pay ₹20 to AI-optimize your resume content + download in any format
- AI optimization includes: seniority detection, rewritten summary and bullets, key highlights generation for mid/senior profiles, ATS keyword analysis
- Compare original vs. AI-optimized content side by side
- No account, no database, no data retention — everything lives in `sessionStorage`

---

## Tech Stack

| Layer           | Technology                                                                 |
|----------------|----------------------------------------------------------------------------|
| Framework      | Next.js 16 (App Router)                                                    |
| UI Library     | Tailwind CSS + shadcn/ui (Radix UI)                                        |
| AI — Extraction | OpenAI `gpt-5-nano` via Responses API (`openai.responses.parse`)          |
| AI — Optimization | OpenAI `gpt-4o-mini` via Responses API (`openai.responses.parse`)       |
| Schema         | Zod + `zodTextFormat` (structured output)                                  |
| PDF Generation | `@react-pdf/renderer` (server-side)                                        |
| Word Generation | `docx` (server-side)                                                      |
| State          | React `useState` + `sessionStorage`                                        |
| Toasts         | shadcn `useToast` + `<Toaster />`                                          |
| Icons          | Lucide React                                                               |

---

## Getting Started

### Prerequisites

- Node.js 18+
- An OpenAI API key

### Installation

```bash
git clone <repo-url>
cd fixcvnow
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` is required due to a peer dependency conflict between `react-day-picker` and `date-fns@4`.

### Environment Variables

Create a `.env.local` file in the project root:

```env
OPENAI_API_KEY=sk-...
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
app/
  layout.tsx                   # Root layout with Toaster
  page.js                      # Entry point — renders HomeClient
  HomeClient.jsx               # SPA router (URL param-based)
  globals.css
  api/
    extract-resume/            # POST /api/extract-resume  (gpt-5-nano)
    optimize-resume/           # POST /api/optimize-resume (gpt-4o-mini)
    download/
      pdf/                     # POST /api/download/pdf
      word/                    # POST /api/download/word

components/
  LandingPage.js               # Hero section + upload CTA
  UploadPage.js                # File upload form
  ProcessingPage.js            # Extraction progress screen
  TemplateSelector.js          # Pick a resume template
  ResumePreview.js             # View, compare, pay, download
  SessionExpired.js            # Full-page error + countdown
  Navbar.js
  Footer.js
  templates/
    classic-professional/
      index.js                 # Full template + ClassicPreview
    executive-navy/
      index.js                 # Full template + NavyPreview
    minimal-serif/
      index.js                 # Full template + SerifPreview
  ui/                          # shadcn/ui primitives

lib/
  storage.js                   # sessionStorage helpers
  theme.js                     # Template color/font/size constants
  utils/
    groupExperience.js         # Groups multi-role company entries
  pdf/
    index.js                   # PDF dispatcher
    classic-professional.jsx   # @react-pdf/renderer template
    executive-navy.jsx         # @react-pdf/renderer template
    minimal-serif.jsx          # @react-pdf/renderer template
  word/
    index.js                   # Word dispatcher
    classic-professional.js    # docx template
    executive-navy.js          # docx template
    minimal-serif.js           # docx template

hooks/
  use-toast.ts                 # shadcn toast hook
```

---

## Documentation

| Doc | Description |
|-----|-------------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design, routing, data flow |
| [docs/API.md](docs/API.md) | API routes reference |
| [docs/FEATURES.md](docs/FEATURES.md) | Feature list and user journeys |
| [docs/PAYMENT.md](docs/PAYMENT.md) | Payment flow and future integration plan |
| [docs/TEMPLATES.md](docs/TEMPLATES.md) | Resume template details |
| [docs/STORAGE.md](docs/STORAGE.md) | Client-side storage architecture |
| [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) | Developer guide — where to make changes and what they affect |

---

## License

Private / proprietary. All rights reserved.

## Add CI/CD Pipeline --

