// lib/word/classic-bold.js
// Word — Classic Bold (template 5)

import {
  Document, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType, AlignmentType, TableLayoutType,
  convertInchesToTwip,
} from 'docx'
import { TEMPLATE } from '../theme'

const T  = TEMPLATE['classic-bold']
const SZ = T.sizeWord
const CW = T.colorWord

const MARGIN = 720   // 0.5 inch
const TEXT_W = 11906 - MARGIN * 2

// Two-column widths: left 63%, right 37%
const LEFT_W  = Math.round(TEXT_W * 0.63)
const RIGHT_W = TEXT_W - LEFT_W
const HALF    = Math.round(TEXT_W / 2)
const INDENT  = convertInchesToTwip(0.2)

function noBorder() {
  return {
    top:    { style: BorderStyle.NONE },
    bottom: { style: BorderStyle.NONE },
    left:   { style: BorderStyle.NONE },
    right:  { style: BorderStyle.NONE },
  }
}

function sectionHeader(title) {
  return new Paragraph({
    children: [
      new TextRun({ text: title, color: CW.textPrimary, size: SZ.sectionHead, bold: true, font: T.font.word, allCaps: true }),
    ],
    spacing: { before: 200, after: 60 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: CW.textPrimary } },
  })
}

function bullet(text, indentIn = 0) {
  return new Paragraph({
    children: [
      new TextRun({ text: '\u2022  ', size: SZ.body, color: CW.textMuted }),
      new TextRun({ text, size: SZ.body, color: CW.textBody, font: T.font.word }),
    ],
    spacing: { after: 40 },
    indent: { left: INDENT + convertInchesToTwip(indentIn) },
  })
}

export function buildClassicBoldDoc(data) {
  const allSkills = Array.isArray(data.skills)
    ? data.skills
    : [...(data.skills?.technicalSkills || []), ...(data.skills?.softSkills || []), ...(data.skills?.toolsAndTechnologies || [])]
  const address = data.currentAddress || data.address?.full || data.address?.city
    || [data.location?.city, data.location?.state, data.location?.country].filter(Boolean).join(', ')
  const getLangText = (l) => typeof l === 'string' ? l : `${l.language || ''}${l.proficiency ? ` (${l.proficiency})` : ''}`
  const getAwardText = (a) => typeof a === 'string' ? a : (a.title || '')
  const getBullets = (exp) => [...(exp.description || []), ...(exp.achievements || [])]

  const headline = (() => {
    const h = data.title || data.headline
    if (!h) return null
    const clean = h.trim().replace(/^\/+|\/+$/g, '').trim()
    return clean || null
  })()

  const contactParts = [
    data.phone ? [data.phone, data.alternatePhone].filter(Boolean).join(' / ') : null,
    data.email,
    address,
    data.nationality ? `Nationality: ${data.nationality}` : null,
    data.dateOfBirth ? `DOB: ${data.dateOfBirth}` : null,
    data.gender ? `Gender: ${data.gender}` : null,
    data.maritalStatus ? `Marital Status: ${data.maritalStatus}` : null,
    ...(data.socialLinks || []).map(l => `${l.label}: ${l.url}`),
  ].filter(Boolean)

  // ── Build Left column paragraphs ──
  const leftParas = []

  if (data.summary) {
    leftParas.push(sectionHeader('Summary'))
    leftParas.push(new Paragraph({
      children: [new TextRun({ text: data.summary?.replace(/\n/g, ' '), size: SZ.body, color: CW.textBody, font: T.font.word })],
      spacing: { after: 80 },
    }))
  }

  if ((data.experience || []).length > 0) {
    leftParas.push(sectionHeader('Experience'))
    for (const exp of data.experience) {
      leftParas.push(new Paragraph({
        children: [new TextRun({ text: exp.role, size: SZ.body, bold: true, color: CW.textPrimary, font: T.font.word })],
        spacing: { before: 100, after: 30 },
      }))
      leftParas.push(new Paragraph({
        children: [new TextRun({ text: exp.company, size: SZ.body, bold: true, color: CW.accent, font: T.font.word })],
        spacing: { after: 30 },
      }))
      leftParas.push(new Paragraph({
        children: [new TextRun({
          text: `${exp.start}${exp.end ? ` – ${exp.end}` : ' – Present'}${exp.location ? `   •   ${exp.location}` : ''}`,
          size: SZ.muted, color: CW.textMuted, font: T.font.word,
        })],
        spacing: { after: 50 },
      }))
      for (const b of getBullets(exp)) leftParas.push(bullet(b))
      leftParas.push(new Paragraph({ children: [], spacing: { after: 60 } }))
    }
  }

  for (const section of (data.extraSections || [])) {
    if (!section.items?.length) continue
    leftParas.push(sectionHeader(section.title))
    for (const item of section.items) leftParas.push(bullet(item))
  }

  // ── Build Right (sidebar) paragraphs ──
  const rightParas = []

  if (data.keyHighlights?.length > 0) {
    rightParas.push(sectionHeader('Key Achievements'))
    for (const item of data.keyHighlights) {
      rightParas.push(new Paragraph({
        children: [
          new TextRun({ text: '\u2713  ', size: SZ.body, bold: true, color: CW.accent }),
          new TextRun({ text: item, size: SZ.muted, color: CW.textBody, font: T.font.word }),
        ],
        spacing: { after: 60 },
        indent: { left: INDENT },
      }))
    }
  }

  if (allSkills.length > 0) {
    rightParas.push(sectionHeader('Skills'))
    rightParas.push(new Paragraph({
      children: [new TextRun({ text: allSkills.join(', '), size: SZ.body, color: CW.textBody, font: T.font.word })],
      spacing: { after: 80 },
    }))
  }

  if (data.education?.length > 0) {
    rightParas.push(sectionHeader('Education'))
    for (const edu of data.education) {
      rightParas.push(new Paragraph({
        children: [new TextRun({
          text: edu.degree + ((edu.fieldOfStudy || edu.field) ? ` — ${edu.fieldOfStudy || edu.field}` : ''),
          size: SZ.body, bold: true, color: CW.textPrimary, font: T.font.word,
        })],
        spacing: { before: 80, after: 20 },
      }))
      rightParas.push(new Paragraph({
        children: [new TextRun({ text: edu.institution || edu.school || '', size: SZ.small, bold: true, color: CW.accent, font: T.font.word })],
        spacing: { after: 20 },
      }))
      rightParas.push(new Paragraph({
        children: [new TextRun({
          text: [edu.endYear || edu.end || edu.year, edu.grade || edu.percentage || edu.gpa].filter(Boolean).join('  •  '),
          size: SZ.muted, color: CW.textMuted, font: T.font.word,
        })],
        spacing: { after: 60 },
      }))
    }
  }

  if (data.certifications?.length > 0) {
    rightParas.push(sectionHeader('Certifications'))
    for (const cert of data.certifications) {
      rightParas.push(new Paragraph({
        children: [new TextRun({ text: cert.name, size: SZ.body, bold: true, color: CW.textPrimary, font: T.font.word })],
        spacing: { before: 80, after: 20 },
      }))
      const certOrg = cert.issuingOrganization || cert.issuer
      const certDate = cert.issueDate || cert.year
      if (certOrg || certDate) {
        rightParas.push(new Paragraph({
          children: [new TextRun({ text: [certOrg, certDate].filter(Boolean).join(' | '), size: SZ.muted, color: CW.textMuted, font: T.font.word })],
          spacing: { after: 50 },
        }))
      }
    }
  }

  if (data.awards?.length > 0) {
    rightParas.push(sectionHeader('Awards'))
    for (const a of data.awards) rightParas.push(bullet(getAwardText(a)))
  }

  if (data.interests?.length > 0) {
    rightParas.push(sectionHeader('Interests'))
    rightParas.push(new Paragraph({
      children: [new TextRun({ text: data.interests.join(', '), size: SZ.body, color: CW.textBody, font: T.font.word })],
      spacing: { after: 80 },
    }))
  }

  if (data.languages?.length > 0) {
    rightParas.push(sectionHeader('Languages'))
    for (const l of data.languages) {
      const name = typeof l === 'string' ? l : (l.language || '')
      const prof = typeof l === 'string' ? '' : (l.proficiency || '')
      rightParas.push(new Paragraph({
        children: [
          new TextRun({ text: name, size: SZ.body, bold: true, color: CW.textPrimary, font: T.font.word }),
          ...(prof ? [new TextRun({ text: `  ${prof}`, size: SZ.muted, color: CW.textMuted, font: T.font.word })] : []),
        ],
        spacing: { after: 40 },
      }))
    }
  }

  // Pad the shorter column so Word renders them side-by-side without collapse
  const maxLen = Math.max(leftParas.length, rightParas.length)
  while (leftParas.length  < maxLen) leftParas.push(new Paragraph({ children: [] }))
  while (rightParas.length < maxLen) rightParas.push(new Paragraph({ children: [] }))

  // ── Header ──
  const paragraphs = []

  paragraphs.push(new Table({
    width: { size: TEXT_W, type: WidthType.DXA },
    layout: TableLayoutType.FIXED,
    columnWidths: [TEXT_W],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: TEXT_W, type: WidthType.DXA },
            borders: { top: noBorder().top, left: noBorder().left, right: noBorder().right, bottom: { style: BorderStyle.SINGLE, size: 12, color: CW.accent } },
            children: [
              new Paragraph({
                children: [new TextRun({ text: data.name || '', bold: true, size: SZ.name, color: CW.headerText, font: T.font.word })],
                spacing: { before: 80, after: 40 },
              }),
              ...(headline ? [new Paragraph({
                children: [new TextRun({ text: headline, size: SZ.body, bold: true, color: CW.accent, font: T.font.word })],
                spacing: { after: 40 },
              })] : []),
              ...(contactParts.length > 0 ? [new Paragraph({
                children: contactParts.map((p, i) => new TextRun({
                  text: (i > 0 ? '   ' : '') + p,
                  size: SZ.muted, color: CW.textBody, font: T.font.word,
                })),
                spacing: { after: 80 },
              })] : []),
            ],
          }),
        ],
      }),
    ],
  }))

  // ── Two-column body table ──
  paragraphs.push(new Table({
    width: { size: TEXT_W, type: WidthType.DXA },
    layout: TableLayoutType.FIXED,
    columnWidths: [LEFT_W, RIGHT_W],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: LEFT_W, type: WidthType.DXA },
            borders: { top: noBorder().top, bottom: noBorder().bottom, left: noBorder().left, right: { style: BorderStyle.SINGLE, size: 4, color: CW.textFaint } },
            margins: { right: 200 },
            children: leftParas,
          }),
          new TableCell({
            width: { size: RIGHT_W, type: WidthType.DXA },
            borders: noBorder(),
            shading: { fill: CW.panelBg, type: ShadingType.CLEAR },
            margins: { left: 200 },
            children: rightParas,
          }),
        ],
      }),
    ],
  }))

  return new Document({
    sections: [{
      properties: { page: { margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } } },
      children: paragraphs,
    }],
  })
}
