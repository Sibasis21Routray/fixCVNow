// lib/word/classic-professional.js
// Word — Classic Professional

import {
  Document, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType, AlignmentType, TableLayoutType,
  convertInchesToTwip,
} from 'docx'
import { groupExperience } from '../utils/groupExperience'
import { TEMPLATE } from '../theme'

const T  = TEMPLATE['classic-professional']
const SZ = T.sizeWord
const CW = T.colorWord
const INDENT = convertInchesToTwip(0.25)

// A4 = 11906 twips. 0.75" margins → text area = 9746 twips.
const MARGIN = 1080
const TEXT_W = 11906 - MARGIN * 2
const EDU_C1 = Math.round(TEXT_W * 0.32)
const EDU_C2 = Math.round(TEXT_W * 0.42)
const EDU_C3 = Math.round(TEXT_W * 0.13)
const EDU_C4 = TEXT_W - EDU_C1 - EDU_C2 - EDU_C3
const HALF   = Math.round(TEXT_W / 2)

function sectionHeader(title) {
  return new Paragraph({
    children: [
      new TextRun({ text: '\u25A0  ', color: CW.accent, size: SZ.sectionHead, bold: true }),
      new TextRun({ text: title, color: CW.textPrimary, size: SZ.sectionHead, bold: true, font: T.font.word }),
    ],
    spacing: { before: 200, after: 80 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'D1D5DB' } },
  })
}

function bullet(text, extraIndentIn = 0) {
  return new Paragraph({
    children: [
      new TextRun({ text: '\u2022  ', size: SZ.body, color: CW.textFaint }),
      new TextRun({ text, size: SZ.body, color: CW.textBody, font: T.font.word }),
    ],
    spacing: { after: 50 },
    indent: { left: INDENT + convertInchesToTwip(extraIndentIn) },
  })
}

function cellBorders() {
  return {
    top:    { style: BorderStyle.SINGLE, size: 4, color: 'D1D5DB' },
    bottom: { style: BorderStyle.SINGLE, size: 4, color: 'D1D5DB' },
    left:   { style: BorderStyle.SINGLE, size: 4, color: 'D1D5DB' },
    right:  { style: BorderStyle.SINGLE, size: 4, color: 'D1D5DB' },
  }
}

export function buildClassicProfessionalDoc(data) {
  const grouped = groupExperience(data.experience)
  const paragraphs = []
  const allSkills = Array.isArray(data.skills)
    ? data.skills
    : [...(data.skills?.technicalSkills || []), ...(data.skills?.softSkills || []), ...(data.skills?.toolsAndTechnologies || [])]
  const address = data.currentAddress || data.address?.full || data.address?.city
    || [data.location?.city, data.location?.state, data.location?.country].filter(Boolean).join(', ')
  const getLangText = (lang) => typeof lang === 'string' ? lang : `${lang.language || ''}${lang.proficiency ? ` (${lang.proficiency})` : ''}`
  const getAwardText = (award) => typeof award === 'string' ? award : (award.title || '')
  const getBullets = (pos) => [...(pos.description || []), ...(pos.achievements || [])]

  // ── Header row (black background) ──
  const socialParts = (data.socialLinks || []).map(l => `${l.label}: ${l.url}`)
  const phoneStr = [data.phone, data.alternatePhone].filter(Boolean).join(' / ')
  const extraParts = [
    data.nationality ? `Nationality: ${data.nationality}` : null,
    data.dateOfBirth ? `DOB: ${data.dateOfBirth}` : null,
    data.gender ? `Gender: ${data.gender}` : null,
    data.maritalStatus ? `Marital Status: ${data.maritalStatus}` : null,
  ].filter(Boolean)
  const contactParts = [phoneStr, data.email, address, ...extraParts, ...socialParts].filter(Boolean)
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
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
            children: [
              new Paragraph({
                children: [new TextRun({ text: data.name || '', bold: true, size: SZ.name, color: CW.headerText, font: T.font.word })],
                alignment: AlignmentType.CENTER,
                spacing: { before: 100, after: 40 },
              }),
              ...(contactParts.length > 0 ? [new Paragraph({
                children: [new TextRun({ text: contactParts.join('   |   '), size: SZ.small, color: CW.headerSub, font: T.font.word })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 100 },
              })] : []),
            ],
          }),
        ],
      }),
    ],
  })
  paragraphs.push(headerTable)

  // ── Profile Summary ──
  if (data.summary) {
    paragraphs.push(sectionHeader('Profile Summary'))
    paragraphs.push(new Paragraph({
      children: [new TextRun({ text: data.summary?.replace(/\n/g, ' '), size: SZ.body, color: CW.textBody, font: T.font.word })],
      spacing: { after: 80 },
    }))
  }

  // ── Key Highlights ──
  if (data.keyHighlights?.length > 0) {
    paragraphs.push(sectionHeader('Key Highlights'))
    for (const point of data.keyHighlights) paragraphs.push(bullet(point))
  }

  // ── Professional Experience ──
  if (grouped.length > 0) {
    paragraphs.push(sectionHeader('Professional Experience'))
    for (const group of grouped) {
      if (group.isSingleRole) {
        const pos = group.positions[0]
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text: group.company, size: SZ.body, bold: true, color: CW.textPrimary, font: T.font.word })],
          spacing: { after: 40 },
        }))
        paragraphs.push(new Paragraph({
          children: [new TextRun({
            text: `${pos.role}  |  ${pos.start}${pos.end ? ` – ${pos.end}` : ' – Present'}`,
            size: SZ.small, italics: true, color: CW.textMuted, font: T.font.word,
          })],
          spacing: { after: 60 },
        }))
        for (const b of (getBullets(pos))) paragraphs.push(bullet(b))
      } else {
        paragraphs.push(new Paragraph({
          children: [
            new TextRun({ text: group.company, size: SZ.body, bold: true, color: CW.textPrimary, font: T.font.word }),
            new TextRun({
              text: `   ${group.overallStart}${group.overallEnd ? ` – ${group.overallEnd}` : ' – Present'}`,
              size: SZ.muted, color: CW.textMuted, font: T.font.word,
            }),
          ],
          spacing: { after: 50 },
        }))
        for (const pos of group.positions) {
          paragraphs.push(new Paragraph({
            children: [
              new TextRun({ text: pos.role, size: SZ.body, italics: true, color: CW.textSecondary, font: T.font.word }),
              new TextRun({
                text: `   ${pos.start}${pos.end ? ` – ${pos.end}` : ' – Present'}`,
                size: SZ.muted, color: CW.textMuted, font: T.font.word,
              }),
            ],
            spacing: { before: 60, after: 40 },
            indent: { left: convertInchesToTwip(0.2) },
          }))
          for (const b of (getBullets(pos))) paragraphs.push(bullet(b, 0.2))
        }
      }
      paragraphs.push(new Paragraph({ children: [], spacing: { after: 60 } }))
    }
  }

  // ── Education (table) ──
  if (data.education?.length > 0) {
    paragraphs.push(sectionHeader('Education'))
    const headerRow = new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: 'Course', bold: true, color: CW.accentText, size: SZ.muted, font: T.font.word })] })],
          shading: { fill: CW.accent, type: ShadingType.CLEAR, color: CW.accent },
          width: { size: EDU_C1, type: WidthType.DXA },
          borders: cellBorders(),
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: 'University / Board', bold: true, color: CW.accentText, size: SZ.muted, font: T.font.word })] })],
          shading: { fill: CW.accent, type: ShadingType.CLEAR, color: CW.accent },
          width: { size: EDU_C2, type: WidthType.DXA },
          borders: cellBorders(),
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: 'Year', bold: true, color: CW.accentText, size: SZ.muted, font: T.font.word })] })],
          shading: { fill: CW.accent, type: ShadingType.CLEAR, color: CW.accent },
          width: { size: EDU_C3, type: WidthType.DXA },
          borders: cellBorders(),
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: '%/Grade', bold: true, color: CW.accentText, size: SZ.muted, font: T.font.word })] })],
          shading: { fill: CW.accent, type: ShadingType.CLEAR, color: CW.accent },
          width: { size: EDU_C4, type: WidthType.DXA },
          borders: cellBorders(),
        }),
      ],
    })
    const dataRows = data.education.map((edu, idx) => new TableRow({
      children: [
        new TableCell({
          width: { size: EDU_C1, type: WidthType.DXA },
          children: [new Paragraph({ children: [new TextRun({ text: `${edu.degree || ''}${(edu.fieldOfStudy || edu.field) ? ` (${edu.fieldOfStudy || edu.field})` : ''}`, size: SZ.muted, font: T.font.word, color: CW.textBody })] })],
          shading: idx % 2 === 1 ? { fill: 'F9FAFB', type: ShadingType.CLEAR } : {},
          borders: cellBorders(),
        }),
        new TableCell({
          width: { size: EDU_C2, type: WidthType.DXA },
          children: [new Paragraph({ children: [new TextRun({ text: edu.institution || edu.school || '', size: SZ.muted, font: T.font.word, color: CW.textBody })] })],
          shading: idx % 2 === 1 ? { fill: 'F9FAFB', type: ShadingType.CLEAR } : {},
          borders: cellBorders(),
        }),
        new TableCell({
          width: { size: EDU_C3, type: WidthType.DXA },
          children: [new Paragraph({ children: [new TextRun({ text: edu.endYear || edu.end || edu.year || '', size: SZ.muted, font: T.font.word, color: CW.textMuted })] })],
          shading: idx % 2 === 1 ? { fill: 'F9FAFB', type: ShadingType.CLEAR } : {},
          borders: cellBorders(),
        }),
        new TableCell({
          width: { size: EDU_C4, type: WidthType.DXA },
          children: [new Paragraph({ children: [new TextRun({ text: edu.grade || edu.percentage || edu.gpa || '-', size: SZ.muted, font: T.font.word, color: CW.textMuted })] })],
          shading: idx % 2 === 1 ? { fill: 'F9FAFB', type: ShadingType.CLEAR } : {},
          borders: cellBorders(),
        }),
      ],
    }))
    paragraphs.push(new Table({
      width: { size: TEXT_W, type: WidthType.DXA },
      layout: TableLayoutType.FIXED,
      columnWidths: [EDU_C1, EDU_C2, EDU_C3, EDU_C4],
      rows: [headerRow, ...dataRows],
    }))
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
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
          }),
          new TableCell({
            children: [allSkills[i + 1] ? bullet(allSkills[i + 1]) : new Paragraph('')],
            width: { size: HALF, type: WidthType.DXA },
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
          }),
        ],
      }))
    }
    if (skillRows.length > 0) {
      paragraphs.push(new Table({ width: { size: TEXT_W, type: WidthType.DXA }, layout: TableLayoutType.FIXED, columnWidths: [HALF, HALF], rows: skillRows }))
    }
  }

  // ── Languages (2-column) ──
  if (data.languages?.length > 0) {
    paragraphs.push(sectionHeader('Languages'))
    const langRows = []
    for (let i = 0; i < data.languages.length; i += 2) {
      langRows.push(new TableRow({
        children: [
          new TableCell({
            children: [bullet(getLangText(data.languages[i]))],
            width: { size: HALF, type: WidthType.DXA },
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
          }),
          new TableCell({
            children: [data.languages[i + 1] ? bullet(getLangText(data.languages[i + 1])) : new Paragraph('')],
            width: { size: HALF, type: WidthType.DXA },
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
          }),
        ],
      }))
    }
    if (langRows.length > 0) {
      paragraphs.push(new Table({ width: { size: TEXT_W, type: WidthType.DXA }, layout: TableLayoutType.FIXED, columnWidths: [HALF, HALF], rows: langRows }))
    }
  }

  // ── Certifications ──
  if (data.certifications?.length > 0) {
    paragraphs.push(sectionHeader('Certifications'))
    for (const cert of data.certifications) {
      paragraphs.push(new Paragraph({
        children: [new TextRun({ text: cert.name, bold: true, size: SZ.body, color: CW.textPrimary, font: T.font.word })],
        spacing: { after: 40 },
      }))
      const certOrg = cert.issuingOrganization || cert.issuer
      const certDate = cert.issueDate || cert.year
      if (certOrg || certDate) {
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text: [certOrg, certDate].filter(Boolean).join(' | '), size: SZ.muted, color: CW.textMuted, font: T.font.word })],
          spacing: { after: 60 },
        }))
      }
    }
  }

  // ── Awards & Recognition ──
  if (data.awards?.length > 0) {
    paragraphs.push(sectionHeader('Awards & Recognition'))
    for (const award of data.awards) paragraphs.push(bullet(getAwardText(award)))
  }

  // ── Interests & Hobbies ──
  if (data.interests?.length > 0) {
    paragraphs.push(sectionHeader('Interests & Hobbies'))
    const intRows = []
    for (let i = 0; i < data.interests.length; i += 2) {
      intRows.push(new TableRow({
        children: [
          new TableCell({
            children: [bullet(data.interests[i])],
            width: { size: HALF, type: WidthType.DXA },
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
          }),
          new TableCell({
            children: [data.interests[i + 1] ? bullet(data.interests[i + 1]) : new Paragraph('')],
            width: { size: HALF, type: WidthType.DXA },
            borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
          }),
        ],
      }))
    }
    if (intRows.length > 0) {
      paragraphs.push(new Table({ width: { size: TEXT_W, type: WidthType.DXA }, layout: TableLayoutType.FIXED, columnWidths: [HALF, HALF], rows: intRows }))
    }
  }

  // ── Extra dynamic sections ──
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
