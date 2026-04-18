// lib/word/minimal-serif.js
// Word — Minimal Serif

import {
  Document, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType, AlignmentType, TableLayoutType,
  convertInchesToTwip,
} from 'docx'
import { groupExperience } from '../utils/groupExperience'
import { TEMPLATE } from '../theme'

const T  = TEMPLATE['minimal-serif']
const SZ = T.sizeWord
const CW = T.colorWord
const INDENT = convertInchesToTwip(0.25)

// A4 = 11906 twips. 0.75" margins → text area = 9746 twips.
const MARGIN     = 720
const TEXT_W     = 11906 - MARGIN * 2
const HDR_LEFT   = Math.round(TEXT_W * 0.60)
const HDR_RIGHT  = TEXT_W - HDR_LEFT
const BODY_LEFT  = Math.round(TEXT_W * 0.35)
const BODY_RIGHT = TEXT_W - BODY_LEFT


const SPACING = {
  paragraph: 120,     // normal gap
  sectionBefore: 240, // before section title
  sectionAfter: 120,  // after section title
  block: 160,         // between blocks
}

function sectionTitle(title) {
  return new Paragraph({
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: SZ.sectionHead,
        color: CW.textPrimary,
        font: T.font.word
      })
    ],

    spacing: {
      before: 240,
      after: 120,
    },

    border: {
      bottom: {
        style: BorderStyle.SINGLE,
        size: 4,
        color: 'CCCCCC'
      }
    },
  })
}

function bullet(text, extraIndentIn = 0) {
  return new Paragraph({
    children: [
      new TextRun({
        text: '\u2022  ',
        font: T.font.word,
        size: SZ.body,
        color: CW.textFaint,
      }),

      new TextRun({
        text,
        font: T.font.word,
        size: SZ.body,
        color: CW.textBody,
      })
    ],

    spacing: {
      after: 120,
      line: 276,
    },

    indent: {
      left: INDENT + convertInchesToTwip(extraIndentIn)
    },
  })
}

export function buildMinimalSerifDoc(data) {
  const grouped = groupExperience(data.experience)
  const allSkills = Array.isArray(data.skills)
    ? data.skills
    : [...(data.skills?.technicalSkills || []), ...(data.skills?.softSkills || []), ...(data.skills?.toolsAndTechnologies || [])]
  const address = data.currentAddress || data.address?.full || data.address?.city
    || [data.location?.city, data.location?.state, data.location?.country].filter(Boolean).join(', ')
  const getLangText = (lang) => typeof lang === 'string' ? lang : `${lang.language || ''}${lang.proficiency ? ` (${lang.proficiency})` : ''}`
  const getAwardText = (award) => typeof award === 'string' ? award : (award.title || '')
  const getBullets = (pos) => [...(pos.description || []), ...(pos.achievements || [])]

  // Column balance
  const expBullets = (data.experience || []).reduce((sum, exp) => sum + getBullets(exp).length * 1.5 + 3, 0)
  const leftScore = allSkills.length + (data.education?.length || 0) * 3 + (data.languages?.length || 0) + (data.awards?.length || 0) * 1.5
  const rightScore = (data.keyHighlights?.length || 0) * 1.5 + expBullets + (data.certifications?.length || 0) * 2
  const moveRight = new Set()
  let imbalance = leftScore - rightScore
  for (const s of [
    { key: 'awards', cost: (data.awards?.length || 0) * 1.5 + 2 },
    { key: 'languages', cost: (data.languages?.length || 0) + 2 },
  ]) { if (imbalance > 8) { moveRight.add(s.key); imbalance -= s.cost } }

  // ── Black header table ──
  const headerTable = new Table({
    width: { size: TEXT_W, type: WidthType.DXA },
    layout: TableLayoutType.FIXED,
    columnWidths: [HDR_LEFT, HDR_RIGHT],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: HDR_LEFT, type: WidthType.DXA },
            shading: { fill: CW.headerBg, type: ShadingType.CLEAR },
            borders: {
              top: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.THICK, size: 12, color: '1F2937' },
            },
            children: [
              new Paragraph({
                children: [new TextRun({ text: (data.name || '').toUpperCase(), bold: true, size: SZ.name, color: CW.headerText, font: T.font.word })],
                spacing: { before: 120, after: 60 },
              }),
              ...(data.title ? [new Paragraph({
                children: [new TextRun({ text: data.title, italics: true, size: SZ.body, color: CW.headerSub, font: T.font.word })],
                spacing: { after: 120 },
              })] : []),
            ],
          }),
          new TableCell({
            width: { size: HDR_RIGHT, type: WidthType.DXA },
            shading: { fill: CW.headerBg, type: ShadingType.CLEAR },
            borders: {
              top: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.THICK, size: 12, color: '1F2937' },
            },
            children: [
              ...(data.phone ? [new Paragraph({
                children: [new TextRun({ text: `Ph. ${[data.phone, data.alternatePhone].filter(Boolean).join(' / ')}`, size: SZ.small, color: CW.headerSub, font: T.font.word })],
                alignment: AlignmentType.RIGHT,
                spacing: { before: 120, after: 30 },
              })] : []),
              ...(data.email ? [new Paragraph({
                children: [new TextRun({ text: `Email ${data.email}`, size: SZ.small, color: CW.headerSub, font: T.font.word })],
                alignment: AlignmentType.RIGHT,
                spacing: { after: 30 },
              })] : []),
              ...(address ? [new Paragraph({
                children: [new TextRun({ text: `Addr. ${address}`, size: SZ.small, color: CW.headerSub, font: T.font.word })],
                alignment: AlignmentType.RIGHT,
                spacing: { after: 30 },
              })] : []),
              ...(data.nationality ? [new Paragraph({
                children: [new TextRun({ text: `Nationality: ${data.nationality}`, size: SZ.small, color: CW.headerSub, font: T.font.word })],
                alignment: AlignmentType.RIGHT,
                spacing: { after: 30 },
              })] : []),
              ...(data.dateOfBirth ? [new Paragraph({
                children: [new TextRun({ text: `DOB: ${data.dateOfBirth}`, size: SZ.small, color: CW.headerSub, font: T.font.word })],
                alignment: AlignmentType.RIGHT,
                spacing: { after: 30 },
              })] : []),
              ...(data.gender ? [new Paragraph({
                children: [new TextRun({ text: `Gender: ${data.gender}`, size: SZ.small, color: CW.headerSub, font: T.font.word })],
                alignment: AlignmentType.RIGHT,
                spacing: { after: 30 },
              })] : []),
              ...(data.maritalStatus ? [new Paragraph({
                children: [new TextRun({ text: `Marital Status: ${data.maritalStatus}`, size: SZ.small, color: CW.headerSub, font: T.font.word })],
                alignment: AlignmentType.RIGHT,
                spacing: { after: 30 },
              })] : []),
              ...(data.socialLinks || []).map((link, idx) => new Paragraph({
                children: [new TextRun({ text: `${link.label}: ${link.url}`, size: SZ.small, color: CW.headerSub, font: T.font.word })],
                alignment: AlignmentType.RIGHT,
                spacing: { after: idx === (data.socialLinks.length - 1) ? 120 : 30 },
              })),
            ],
          }),
        ],
      }),
    ],
  })

  // ── Summary banner ──
  const summaryParagraphs = []
  if (data.summary) {
    summaryParagraphs.push(new Paragraph({
      children: [new TextRun({ text: 'SUMMARY', bold: true, size: SZ.muted, color: CW.textPrimary, font: T.font.word })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 50 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: 'E5E7EB' } },
    }))
    summaryParagraphs.push(
  new Paragraph({
    children: [
      new TextRun({
        text: data.summary,
        size: SZ.body,
        color: CW.textBody,
        font: T.font.word
      })
    ],

    alignment: AlignmentType.CENTER,

    spacing: {
      after: 160,
      line: 276,
    }
  })
)
  }

  // ── Left column ──
  const leftChildren = []

  if (data.education?.length > 0) {
    leftChildren.push(sectionTitle('EDUCATION'))
    for (const edu of data.education) {
      leftChildren.push(new Paragraph({
        children: [new TextRun({ text: `${edu.degree || ''}${(edu.fieldOfStudy || edu.field) ? ` — ${edu.fieldOfStudy || edu.field}` : ''}`, bold: true, size: SZ.body, color: CW.textPrimary, font: T.font.word })],
        spacing: { after: 30 },
      }))
      leftChildren.push(new Paragraph({
        children: [new TextRun({ text: edu.institution || edu.school || '', size: SZ.small, color: CW.textSecondary, font: T.font.word })],
        spacing: { after: 30 },
      }))
      leftChildren.push(new Paragraph({
        children: [new TextRun({ text: `${(edu.startYear || edu.start) ? `${edu.startYear || edu.start} – ` : ''}${edu.endYear || edu.end || edu.year || ''}${(edu.grade || edu.percentage || edu.gpa) ? ` | ${edu.grade || edu.percentage || edu.gpa}` : ''}`, size: SZ.muted, color: CW.textMuted, font: T.font.word })],
        spacing: { after: 80 },
      }))
    }
  }

  if (allSkills.length > 0) {
    leftChildren.push(sectionTitle('SKILLS'))
    allSkills.forEach(s => leftChildren.push(bullet(s)))
  }

  if (!moveRight.has('languages') && data.languages?.length > 0) {
    leftChildren.push(sectionTitle('LANGUAGES'))
    data.languages.forEach(l => leftChildren.push(bullet(getLangText(l))))
  }

  if (!moveRight.has('awards') && data.awards?.length > 0) {
    leftChildren.push(sectionTitle('AWARDS & RECOGNITION'))
    data.awards.forEach(a => leftChildren.push(bullet(getAwardText(a))))
  }

  // ── Right column ──
  const rightChildren = []

  if (data.keyHighlights?.length > 0) {
    rightChildren.push(sectionTitle('KEY HIGHLIGHTS'))
    for (const point of data.keyHighlights) rightChildren.push(bullet(point))
    rightChildren.push(new Paragraph({ children: [], spacing: { after: 80 } }))
  }

  if (grouped.length > 0) {
    rightChildren.push(sectionTitle('PROFESSIONAL EXPERIENCE'))
    for (const group of grouped) {
      if (group.isSingleRole) {
        const pos = group.positions[0]
        rightChildren.push(new Paragraph({
          children: [new TextRun({ text: (group.company || '').toUpperCase(), bold: true, size: SZ.body, color: CW.textPrimary, font: T.font.word })],
          spacing: { after: 40 },
        }))
        rightChildren.push(new Paragraph({
          children: [
            new TextRun({ text: (pos.role || '').toUpperCase(), bold: true, size: SZ.body, color: CW.textSecondary, font: T.font.word }),
            new TextRun({ text: `    ${pos.start}${pos.end ? ` – ${pos.end}` : ' – Present'}`, size: SZ.muted, color: CW.textMuted, font: T.font.word }),
          ],
          spacing: { after: 60 },
        }))
        for (const b of (getBullets(pos))) rightChildren.push(bullet(b))
      } else {
        rightChildren.push(new Paragraph({
          children: [
            new TextRun({ text: (group.company || '').toUpperCase(), bold: true, size: SZ.body, color: CW.textPrimary, font: T.font.word }),
            new TextRun({
              text: `    ${group.overallStart}${group.overallEnd ? ` – ${group.overallEnd}` : ' – Present'}`,
              size: SZ.muted, color: CW.textMuted, font: T.font.word,
            }),
          ],
          spacing: { after: 50 },
        }))
        for (const pos of group.positions) {
          rightChildren.push(new Paragraph({
            children: [
              new TextRun({ text: (pos.role || '').toUpperCase(), bold: true, size: SZ.body, color: CW.textSecondary, font: T.font.word }),
              new TextRun({ text: `    ${pos.start}${pos.end ? ` – ${pos.end}` : ' – Present'}`, size: SZ.muted, color: CW.textMuted, font: T.font.word }),
            ],
            spacing: { before: 60, after: 40 },
            indent: { left: convertInchesToTwip(0.2) },
          }))
          for (const b of (getBullets(pos))) rightChildren.push(bullet(b, 0.2))
        }
      }
      rightChildren.push(new Paragraph({ children: [], spacing: { after: 80 } }))
    }
  }

  if (data.certifications?.length > 0) {
    rightChildren.push(sectionTitle('CERTIFICATIONS'))
    for (const cert of data.certifications) {
      rightChildren.push(new Paragraph({
        children: [new TextRun({ text: cert.name, bold: true, size: SZ.body, color: CW.textPrimary, font: T.font.word })],
        spacing: { after: 40 },
      }))
      const certOrg = cert.issuingOrganization || cert.issuer
      const certDate = cert.issueDate || cert.year
      if (certOrg || certDate) {
        rightChildren.push(new Paragraph({
          children: [new TextRun({ text: [certOrg, certDate].filter(Boolean).join(' | '), size: SZ.muted, color: CW.textMuted, font: T.font.word })],
          spacing: { after: 60 },
        }))
      }
    }
  }

  if (moveRight.has('awards') && data.awards?.length > 0) {
    rightChildren.push(sectionTitle('AWARDS & RECOGNITION'))
    data.awards.forEach(a => rightChildren.push(bullet(getAwardText(a))))
  }

  if (moveRight.has('languages') && data.languages?.length > 0) {
    rightChildren.push(sectionTitle('LANGUAGES'))
    data.languages.forEach(l => rightChildren.push(bullet(getLangText(l))))
  }

  if (data.interests?.length > 0) {
    rightChildren.push(sectionTitle('INTERESTS & HOBBIES'))
    data.interests.forEach(item => rightChildren.push(bullet(item)))
  }

  for (const section of (data.extraSections || [])) {
    if (!section.items?.length) continue
    rightChildren.push(sectionTitle(section.title.toUpperCase()))
    section.items.forEach(item => rightChildren.push(bullet(item)))
  }

  const bodyTable = new Table({
    width: { size: TEXT_W, type: WidthType.DXA },
    layout: TableLayoutType.FIXED,
    columnWidths: [BODY_LEFT, BODY_RIGHT],
    rows: [
      new TableRow({
        children: [
          new TableCell({
  width: { size: BODY_LEFT, type: WidthType.DXA },

  margins: {
    left: 200,
  },

  borders: {
    top: { style: BorderStyle.NONE },
    bottom: { style: BorderStyle.NONE },
    left: { style: BorderStyle.NONE },
    right: { style: BorderStyle.NONE }
  },

  children: leftChildren.length > 0
    ? leftChildren
    : [new Paragraph('')],
}),
          new TableCell({
  width: { size: BODY_RIGHT, type: WidthType.DXA },

  margins: {
    left: 200,
  },

  borders: {
    top: { style: BorderStyle.NONE },
    bottom: { style: BorderStyle.NONE },
    left: { style: BorderStyle.NONE },
    right: { style: BorderStyle.NONE }
  },

  children: rightChildren.length > 0
    ? rightChildren
    : [new Paragraph('')],
}),
        ],
      }),
    ],
  })

  return new Document({
  styles: {
    default: {
      document: {
        run: {
          font: T.font.word,
        },
      },
    },
  },

  sections: [{
    properties: {
      page: {
        margin: {
          top: MARGIN,
          bottom: MARGIN,
          left: MARGIN,
          right: MARGIN
        }
      }
    },

    children: [
      headerTable,
      ...summaryParagraphs,
      bodyTable
    ],
  }],
})
}
