# Resume Templates

Each template has three representations that must stay in sync:

| Representation | Purpose |
|---------------|---------|
| **UI component** (`components/templates/<name>/index.js`) | Renders in the browser — used by `ResumePreview.js` and `TemplateSelector.js` |
| **PDF template** (`lib/pdf/<name>.jsx`) | Server-side PDF via `@react-pdf/renderer` — called by `POST /api/download/pdf` |
| **Word template** (`lib/word/<name>.js`) | Server-side `.docx` via `docx` — called by `POST /api/download/word` |

Each UI template file exports:
1. **Full template component** — used by `ResumePreview.js`
2. **Mini preview component** — used by `TemplateSelector.js` for thumbnail cards

---

## Template List

| ID | Name | UI File | PDF File | Word File |
|----|------|---------|----------|-----------|
| `1` | Classic Professional | `components/templates/classic-professional/index.js` | `lib/pdf/classic-professional.jsx` | `lib/word/classic-professional.js` |
| `2` | Executive Navy | `components/templates/executive-navy/index.js` | `lib/pdf/executive-navy.jsx` | `lib/word/executive-navy.js` |
| `3` | Minimal Serif | `components/templates/minimal-serif/index.js` | `lib/pdf/minimal-serif.jsx` | `lib/word/minimal-serif.js` |

Dispatcher modules select the right implementation by `templateId`:
- `lib/pdf/index.js` → `getPDFComponent(resumeData, templateId)`
- `lib/word/index.js` → `getWordDocument(resumeData, templateId)`

---

## Template 1: Classic Professional

**UI**: `components/templates/classic-professional/index.js`
**PDF**: `lib/pdf/classic-professional.jsx`
**Word**: `lib/word/classic-professional.js`

### Design

- Font: Georgia (serif) / `Times-Roman` in PDF
- Header: Name in large bold, contact info on one line with `Ph.` / `Email` / `Addr.` labels + social links
- Section dividers: horizontal rule with section title above (blue square icon + title)
- Experience: company name in bold, role and dates below
- Education: table-style layout (course / university / year)
- Accent color: `#1a5276` (deep blue) for section title icons

### Sections (in order)

- Name + contact (header)
- Career Objective (summary)
- Key Highlights (if present)
- Professional Experience (with bullet points)
- Education (3-column table)
- Skills (2-column layout)
- Languages (2-column layout, if present)
- Certifications (if present)
- Awards & Recognition (if present)

### Layout

Single-column, traditional top-to-bottom layout. Best for conservative industries (finance, law, government).

---

## Template 2: Executive Navy

**UI**: `components/templates/executive-navy/index.js`
**PDF**: `lib/pdf/executive-navy.jsx`
**Word**: `lib/word/executive-navy.js`

### Design

- Font: System sans-serif / `Helvetica` in PDF and Word
- Header: Dark navy (`#1a3a5c`) full-width banner — name in white, title in yellow (`#FDE68A`), contact line (phone • email • address • social links) in light blue
- Two-column layout: 35% left sidebar + 65% right content
- Section title accent: navy thick bottom border
- Left panel background: light gray (`#f0f4f8`)

### Sections (in order)

**Header (full-width)**
- Name, title, contact info (phone • email • address • social links)

**Left column (35%)**
- Profile Summary
- Core Competencies (skills, up to 12)
- Education
- Languages (if present)
- Certifications (if present)
- Awards & Recognition (if present)

**Right column (65%)**
- Key Highlights (if present)
- Work Experience (with bullet points, grouped by company)

### Layout

Two-column with full-width navy header. Best for senior professionals, managers, and executives.

### Word Implementation Note

The Word template uses a **single table** with two rows:
- Row 1: one cell with `columnSpan: 2` + navy shading → header always spans full page width
- Row 2: left (35%) + right (65%) cells

This ensures the navy banner spans 100% width independent of the body column split. Table-level borders set `insideH` and `insideV` to `NONE` to suppress all internal dividers.

---

## Template 3: Minimal Serif

**UI**: `components/templates/minimal-serif/index.js`
**PDF**: `lib/pdf/minimal-serif.jsx`
**Word**: `lib/word/minimal-serif.js`

### Design

- Font: Times New Roman / `Times-Roman` in PDF
- Header: Gray (`#F5F5F5`) background bar — name left-aligned, contact info right-aligned (phone, email, address, social links each on own line)
- Two-column layout with thin right border divider (PDF/UI) — no visible divider in Word
- Summary banner: full-width centered block between header and columns
- Minimal decoration — relies on whitespace and typography

### Sections (in order)

**Header**
- Name, job title (left) — contact info right-aligned (Ph. / Email / Addr. / social links)

**Summary banner** (full-width)
- Centered summary text with "SUMMARY" label

**Left column (40%)**
- Education
- Skills (vertical list)
- Languages (if present)
- Awards & Recognition (if present)

**Right column (60%)**
- Key Highlights (if present)
- Professional Experience (with bullet points, grouped by company)
- Certifications (if present)

### Layout

Two-column. Best for creative professionals, academics, and roles where clean design signals attention to detail.

---

## Adding a New Template

To add a fourth template (e.g., "Modern Teal"), create three files and register in two dispatcher modules + two UI files.

### 1. Create the UI component

`components/templates/modern-teal/index.js`

```js
export function ModernTealTemplate({ data }) {
  return (
    <div id="resume-content">
      {/* render data fields here */}
    </div>
  )
}

export function TealPreview({ data }) {
  return (
    <div style={{ transform: 'scale(0.4)', transformOrigin: 'top left', width: '250%' }}>
      <ModernTealTemplate data={data} />
    </div>
  )
}
```

### 2. Create the PDF template

`lib/pdf/modern-teal.jsx`

```jsx
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'

// Use built-in fonts: Helvetica, Helvetica-Bold, Times-Roman, Times-Bold
// No emoji — use text labels for contact info

export function ModernTealPDF({ data }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ... */}
      </Page>
    </Document>
  )
}
```

### 3. Create the Word template

`lib/word/modern-teal.js`

```js
import { Document, Paragraph, TextRun, Table, ... } from 'docx'

export function buildModernTealDoc(data) {
  // Build and return a Document object
  return new Document({ sections: [{ children: [...] }] })
}
```

### 4. Register in dispatchers

`lib/pdf/index.js`:
```js
import { ModernTealPDF } from './modern-teal'

export function getPDFComponent(resumeData, templateId) {
  switch (Number(templateId)) {
    case 4: return <ModernTealPDF data={resumeData} />
    // ...
  }
}
```

`lib/word/index.js`:
```js
import { buildModernTealDoc } from './modern-teal'

export function getWordDocument(resumeData, templateId) {
  switch (Number(templateId)) {
    case 4: return buildModernTealDoc(resumeData)
    // ...
  }
}
```

### 5. Register in TemplateSelector.js

```js
import { TealPreview } from '@/components/templates/modern-teal'

const templates = [
  // ...existing
  { id: 4, name: 'Modern Teal', preview: <TealPreview data={resumeData} /> },
]
```

### 6. Register in ResumePreview.js

```js
import { ModernTealTemplate } from '@/components/templates/modern-teal'

// In the template render switch:
case '4': return <ModernTealTemplate data={activeData} />
```

---

## Template Data Contract

All three representations (UI, PDF, Word) receive the same `data` / `resumeData` object:

```ts
{
  name: string
  title: string | null
  email: string | null
  phone: string | null
  dateOfBirth: string | null       // e.g. "15 March 1985"
  nationality: string | null
  address: {
    full: string | null
    city: string | null
    state: string | null
    // ...other address fields
  } | null
  socialLinks: Array<{             // generic list of any social/professional links
    label: string                  // e.g. "LinkedIn", "GitHub", "Portfolio"
    url: string
  }> | null
  summary: string | null
  keyHighlights: string[] | null   // bullet points for a "Key Highlights" section
  experience: Array<{
    company: string
    role: string
    start: string | null
    end: string | null             // null means "Present"
    description: string[] | null   // null means no bullets (promotion-only entry)
  }>
  education: Array<{
    institution: string
    school: string                 // fallback for institution
    degree: string
    field: string | null
    start: string | null
    end: string | null
    year: string | null            // fallback for end
  }>
  skills: string[]
  languages: string[] | null
  certifications: Array<{
    name: string
    issuer: string | null
    year: string | null
  }> | null
  awards: string[] | null          // awards, prizes, recognitions
}
```

Templates must handle null / empty arrays gracefully — hide the section when there is no data.

---

## Contact Info Rendering

All three representations use text labels instead of emoji (emoji are not supported by `@react-pdf/renderer` built-in fonts):

| Field | Label |
|-------|-------|
| Phone | `Ph.` |
| Email | `Email` |
| Address | `Addr.` |
| Social links | `{link.label}: {link.url}` (rendered for each entry) |

---

## Experience Grouping

All templates use `lib/utils/groupExperience.js` to group multiple roles at the same company together. The helper returns:

```js
[
  {
    company: string,
    isSingleRole: boolean,
    overallStart: string,    // earliest start date across all positions
    overallEnd: string,      // latest end date (null = "Present")
    positions: Array<{ role, start, end, description }>
  }
]
```

- **Single role**: renders company name + role + date + bullets
- **Multiple roles**: renders company name + overall date range, then each role indented below with its own bullets

---

## PDF Templates (`lib/pdf/`)

Built with `@react-pdf/renderer`. Key constraints:
- Only built-in fonts work without registration: `Helvetica`, `Helvetica-Bold`, `Helvetica-Oblique`, `Times-Roman`, `Times-Bold`, `Times-Italic`, `Courier`
- No emoji or special Unicode glyphs — use plain ASCII alternatives
- Styles defined with `StyleSheet.create()` using a subset of CSS (no `gap` shorthand in older versions — use `columnGap` / `rowGap`)
- Route handler file must use `.jsx` extension to support JSX syntax: `app/api/download/pdf/route.jsx`
- Generation: `renderToBuffer(<Component />)` from `@react-pdf/renderer`

---

## Word Templates (`lib/word/`)

Built with the `docx` npm library. Key patterns:
- All sizes in **twips** (1 inch = 1440 twips) — use `convertInchesToTwip()` from `docx` for readability
- Table borders: set `NO_BORDER` on every cell + set `insideH` / `insideV` on the table itself to fully suppress dividers
- Full-width header spanning split columns: use `columnSpan: 2` on a single header cell in a shared table instead of two separate tables
- Shading: `{ fill: 'RRGGBB', type: ShadingType.CLEAR }` (no `#` prefix on hex colors)
- Generation: `Packer.toBuffer(doc)` from `docx`
