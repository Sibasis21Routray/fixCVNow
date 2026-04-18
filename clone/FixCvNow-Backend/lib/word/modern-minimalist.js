// lib/word/modern-minimalist.js
// Word — Modern Minimalist (template 4)

import {
  Document, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType, AlignmentType, TableLayoutType,
  convertInchesToTwip,
} from 'docx'
import { TEMPLATE } from '../theme'

const T  = TEMPLATE['modern-minimalist']
const SZ = T.sizeWord
const CW = T.colorWord

const MARGIN  = 720   // 0.5 inch
const TEXT_W  = 11906 - MARGIN * 2
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
      new TextRun({ text: '\u25C6  ', color: CW.accent, size: SZ.sectionHead, bold: true }),
      new TextRun({ text: title, color: CW.textPrimary, size: SZ.sectionHead, bold: true, font: T.font.word }),
    ],
    spacing: { before: 240, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: CW.textMuted } },
  })
}

function bullet(text, indent = 0) {
  return new Paragraph({
    children: [
      new TextRun({ text: '\u2022  ', size: SZ.body, color: CW.textMuted }),
      new TextRun({ text, size: SZ.body, color: CW.textBody, font: T.font.word }),
    ],
    spacing: { after: 40 },
    indent: { left: INDENT + convertInchesToTwip(indent) },
  })
}

export function buildModernMinimalistDoc(data) {
  const paragraphs = []
  const allSkills = Array.isArray(data.skills)
    ? data.skills
    : [...(data.skills?.technicalSkills || []), ...(data.skills?.softSkills || []), ...(data.skills?.toolsAndTechnologies || [])]
  const address = data.currentAddress || data.address?.full || data.address?.city
    || [data.location?.city, data.location?.state, data.location?.country].filter(Boolean).join(', ')
  const getLangText = (l) => typeof l === 'string' ? l : `${l.language || ''}${l.proficiency ? ` (${l.proficiency})` : ''}`
  const getAwardText = (a) => typeof a === 'string' ? a : (a.title || '')
  const getBullets = (pos) => [...(pos.description || []), ...(pos.achievements || [])]

  const headline = (() => {
    const h = data.title || data.headline
    if (!h) return null
    const clean = h.trim().replace(/^\/+|\/+$/g, '').trim()
    return clean || null
  })()

  // ── Header (slate background table) ──
  const headerRows = []

  // Name row
  headerRows.push(new Paragraph({
    children: [new TextRun({ text: data.name || '', bold: true, size: SZ.name, color: CW.headerText, font: T.font.word })],
    spacing: { before: 80, after: 40 },
  }))

  // Headline
  if (headline) {
    headerRows.push(new Paragraph({
      children: [new TextRun({ text: headline, size: SZ.small, color: CW.headerSub, font: T.font.word })],
      spacing: { after: 60 },
    }))
  }

  // Contact rows
  const contactFields = [
    address   ? { label: 'Address',        value: address } : null,
    data.phone ? { label: 'Phone',          value: [data.phone, data.alternatePhone].filter(Boolean).join(' / ') } : null,
    data.email ? { label: 'E-mail',         value: data.email } : null,
    data.nationality ? { label: 'Nationality', value: data.nationality } : null,
    data.dateOfBirth  ? { label: 'DOB',        value: data.dateOfBirth } : null,
    data.gender       ? { label: 'Gender',     value: data.gender } : null,
    data.maritalStatus ? { label: 'Marital Status', value: data.maritalStatus } : null,
    ...(data.socialLinks || []).map(l => ({ label: l.label, value: l.url })),
  ].filter(Boolean)

  for (const field of contactFields) {
    headerRows.push(new Paragraph({
      children: [
        new TextRun({ text: `${field.label}   `, size: SZ.small, bold: true, color: CW.headerSub, font: T.font.word }),
        new TextRun({ text: field.value, size: SZ.small, color: CW.headerSub, font: T.font.word }),
      ],
      spacing: { after: 30 },
    }))
  }

  const headerTable = new Table({
    width: { size: TEXT_W, type: WidthType.DXA },
    layout: TableLayoutType.FIXED,
    columnWidths: [TEXT_W],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: TEXT_W, type: WidthType.DXA },
            shading: { fill: CW.headerBg, type: ShadingType.CLEAR },
            borders: noBorder(),
            margins: { top: 120, bottom: 160, left: 200, right: 200 },
            children: headerRows,
          }),
        ],
      }),
    ],
  })
  paragraphs.push(headerTable)

  // ── Summary ──
  if (data.summary) {
    paragraphs.push(new Paragraph({
      children: [new TextRun({ text: data.summary?.replace(/\n/g, ' '), size: SZ.body, color: CW.textBody, font: T.font.word })],
      spacing: { before: 200, after: 160 },
    }))
  }

  // ── Key Highlights ──
  if (data.keyHighlights?.length > 0) {
    paragraphs.push(sectionHeader('Key Highlights'))
    for (const item of data.keyHighlights) paragraphs.push(bullet(item))
  }

  // ── Work History ──
  if ((data.experience || []).length > 0) {
    paragraphs.push(sectionHeader('Work History'))
    for (const exp of data.experience) {
      paragraphs.push(new Paragraph({
        children: [
          new TextRun({ text: `${exp.start} – ${exp.end || 'Present'}   `, size: SZ.small, color: CW.textMuted, font: T.font.word }),
          new TextRun({ text: exp.role, size: SZ.body, bold: true, color: CW.textPrimary, font: T.font.word }),
        ],
        spacing: { before: 120, after: 30 },
      }))
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: exp.company + (exp.location ? `, ${exp.location}` : ''), size: SZ.small, color: CW.textSecondary, font: T.font.word })],
        spacing: { after: 50 },
        indent: { left: INDENT },
      }))
      for (const b of getBullets(exp)) paragraphs.push(bullet(b))
    }
  }

  // ── Skills (2-column) ──
  if (allSkills.length > 0) {
    paragraphs.push(sectionHeader('Skills'))
    const skillRows = []
    for (let i = 0; i < allSkills.length; i += 2) {
      skillRows.push(new TableRow({
        children: [
          new TableCell({
            children: [bullet(allSkills[i])],
            width: { size: HALF, type: WidthType.DXA },
            borders: noBorder(),
          }),
          new TableCell({
            children: [allSkills[i + 1] ? bullet(allSkills[i + 1]) : new Paragraph('')],
            width: { size: HALF, type: WidthType.DXA },
            borders: noBorder(),
          }),
        ],
      }))
    }
    if (skillRows.length > 0) {
      paragraphs.push(new Table({ width: { size: TEXT_W, type: WidthType.DXA }, layout: TableLayoutType.FIXED, columnWidths: [HALF, HALF], rows: skillRows }))
    }
  }

  // ── Education ──
  if (data.education?.length > 0) {
    paragraphs.push(sectionHeader('Education'))
    for (const edu of data.education) {
      const year = edu.endYear || edu.end || edu.year || ''
      const grade = edu.grade || edu.percentage || edu.gpa || ''
      paragraphs.push(new Paragraph({
        children: [
          new TextRun({ text: `${year}${grade ? `  •  ${grade}` : ''}   `, size: SZ.small, color: CW.textMuted, font: T.font.word }),
          new TextRun({ text: edu.degree + ((edu.fieldOfStudy || edu.field) ? `: ${edu.fieldOfStudy || edu.field}` : ''), size: SZ.body, bold: true, color: CW.textPrimary, font: T.font.word }),
        ],
        spacing: { before: 100, after: 30 },
      }))
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: edu.institution || edu.school || '', size: SZ.small, color: CW.textSecondary, font: T.font.word })],
        spacing: { after: 60 },
        indent: { left: INDENT },
      }))
    }
  }

  // ── Certifications ──
  if (data.certifications?.length > 0) {
    paragraphs.push(sectionHeader('Certifications'))
    for (const cert of data.certifications) {
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: cert.name, size: SZ.body, bold: true, color: CW.textPrimary, font: T.font.word })],
        spacing: { before: 80, after: 30 },
      }))
      const org = cert.issuingOrganization || cert.issuer
      const date = cert.issueDate || cert.year
      if (org || date) {
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text: [org, date].filter(Boolean).join(' | '), size: SZ.small, color: CW.textMuted, font: T.font.word })],
          spacing: { after: 50 },
          indent: { left: INDENT },
        }))
      }
    }
  }

  // ── Awards ──
  if (data.awards?.length > 0) {
    paragraphs.push(sectionHeader('Awards & Recognition'))
    for (const a of data.awards) paragraphs.push(bullet(getAwardText(a)))
  }

  // ── Languages ──
  if (data.languages?.length > 0) {
    paragraphs.push(sectionHeader('Languages'))
    for (const l of data.languages) paragraphs.push(bullet(getLangText(l)))
  }

  // ── Interests ──
  if (data.interests?.length > 0) {
    paragraphs.push(sectionHeader('Interests & Hobbies'))
    for (const item of data.interests) paragraphs.push(bullet(item))
  }

  // ── Extra Sections ──
  for (const section of (data.extraSections || [])) {
    if (!section.items?.length) continue
    paragraphs.push(sectionHeader(section.title))
    for (const item of section.items) paragraphs.push(bullet(item))
  }

  return new Document({
    sections: [{
      properties: { page: { margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } } },
      children: paragraphs,
    }],
  })
}
