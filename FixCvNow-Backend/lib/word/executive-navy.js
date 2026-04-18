// lib/word/executive-navy.js
// Word — Senior Leadership

import {
  Document, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, BorderStyle, ShadingType, AlignmentType, TableLayoutType,
  convertInchesToTwip,
} from 'docx'
import { groupExperience } from '../utils/groupExperience'
import { TEMPLATE } from '../theme'

const T  = TEMPLATE['executive-navy']
const SZ = T.sizeWord
const CW = T.colorWord
const INDENT = convertInchesToTwip(0.25)

// A4 = 11906 twips, zero margins — table fills edge-to-edge
const TABLE_W   = 11906
const COL_LEFT  = Math.round(TABLE_W * 0.35)
const COL_RIGHT = TABLE_W - COL_LEFT

const NO_BORDER     = { style: BorderStyle.NONE, size: 0, color: 'auto' }
const ALL_NONE      = { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER }
const TABLE_BORDERS = { ...ALL_NONE, insideH: NO_BORDER, insideV: NO_BORDER }

function sectionTitle(title) {
  return new Paragraph({
    children: [new TextRun({ text: title, bold: true, size: SZ.sectionHead, color: CW.textPrimary, font: T.font.word })],
    spacing: { before: 160, after: 60 },
    border: { bottom: { style: BorderStyle.THICK, size: 8, color: CW.accent } },
  })
}

function skillRow(text) {
  return new Paragraph({
    children: [
      new TextRun({ text: '\u25CF  ', size: SZ.small, color: CW.accent }),
      new TextRun({ text, size: SZ.small, color: CW.textBody, font: T.font.word }),
    ],
    spacing: { after: 50 },
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

export function buildExecutiveNavyDoc(data) {
  const grouped = groupExperience(data.experience)
  const allSkills = Array.isArray(data.skills)
    ? data.skills
    : [...(data.skills?.technicalSkills || []), ...(data.skills?.softSkills || []), ...(data.skills?.toolsAndTechnologies || [])]
  const coreSkills = data.coreCompetencies?.length > 0 ? data.coreCompetencies : allSkills
  const address = data.currentAddress || data.address?.full || data.address?.city
    || [data.location?.city, data.location?.state, data.location?.country].filter(Boolean).join(', ')
  const getLangText = (lang) => typeof lang === 'string' ? lang : `${lang.language || ''}${lang.proficiency ? ` (${lang.proficiency})` : ''}`
  const getAwardText = (award) => typeof award === 'string' ? award : (award.title || '')
  const getBullets = (pos) => [...(pos.description || []), ...(pos.achievements || [])]

  // Column balance
  const expBullets = (data.experience || []).reduce((sum, exp) => sum + getBullets(exp).length * 1.5 + 3, 0)
  const leftScore = coreSkills.length + (data.education?.length || 0) * 3 + (data.languages?.length || 0) + (data.certifications?.length || 0) * 2 + (data.awards?.length || 0) * 1.5 + (data.summary ? 4 : 0)
  const rightScore = (data.keyHighlights?.length || 0) * 1.5 + expBullets
  const moveRight = new Set()
  let imbalance = leftScore - rightScore
  for (const s of [
    { key: 'awards', cost: (data.awards?.length || 0) * 1.5 + 2 },
    { key: 'languages', cost: (data.languages?.length || 0) + 2 },
    { key: 'certifications', cost: (data.certifications?.length || 0) * 2 + 2 },
  ]) { if (imbalance > 8) { moveRight.add(s.key); imbalance -= s.cost } }

  const socialParts = (data.socialLinks || []).map(l => `${l.label}: ${l.url}`)
  const phoneStr = [data.phone, data.alternatePhone].filter(Boolean).join(' / ')
  const extraParts = [
    data.nationality ? `Nationality: ${data.nationality}` : null,
    data.dateOfBirth ? `DOB: ${data.dateOfBirth}` : null,
    data.gender ? `Gender: ${data.gender}` : null,
    data.maritalStatus ? `Marital Status: ${data.maritalStatus}` : null,
  ].filter(Boolean)
  const contactLine = [phoneStr, data.email, address, ...extraParts, ...socialParts]
    .filter(Boolean).join('   \u2022   ')

  // ── Header (black background) ──
  const headerChildren = [
    new Paragraph({
      children: [new TextRun({ text: (data.name || '').toUpperCase(), bold: true, size: SZ.name, color: CW.headerText, font: T.font.word })],
      alignment: AlignmentType.CENTER,
      spacing: { before: 100, after: 60 },
    }),
    ...(data.title ? [new Paragraph({
      children: [new TextRun({ text: data.title, bold: true, size: SZ.sectionHead, color: CW.headerSub, font: T.font.word })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 60 },
    })] : []),
    ...(contactLine ? [new Paragraph({
      children: [new TextRun({ text: contactLine, size: SZ.small, color: CW.headerSub, font: T.font.word })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
    })] : []),
  ]

  // ── Left column ──
  const leftChildren = []

  if (data.summary) {
    leftChildren.push(sectionTitle('PROFILE SUMMARY'))
    leftChildren.push(new Paragraph({
      children: [new TextRun({ text: data.summary, size: SZ.small, color: CW.textBody, font: T.font.word })],
      spacing: { after: 80 },
    }))
  }

  if (coreSkills.length > 0) {
    leftChildren.push(sectionTitle('CORE COMPETENCIES'))
    coreSkills.slice(0, 12).forEach(s => leftChildren.push(skillRow(s)))
  }

  if (data.education?.length > 0) {
    leftChildren.push(sectionTitle('EDUCATION'))
    for (const edu of data.education) {
      leftChildren.push(new Paragraph({
        children: [new TextRun({ text: edu.degree || '', bold: true, size: SZ.body, color: CW.textPrimary, font: T.font.word })],
        spacing: { after: 30 },
      }))
      if (edu.fieldOfStudy || edu.field) {
        leftChildren.push(new Paragraph({
          children: [new TextRun({ text: edu.fieldOfStudy || edu.field, size: SZ.small, color: CW.textSecondary, font: T.font.word })],
          spacing: { after: 30 },
        }))
      }
      leftChildren.push(new Paragraph({
        children: [new TextRun({
          text: `${edu.institution || edu.school || ''}  |  ${edu.endYear || edu.end || edu.year || ''}${(edu.grade || edu.percentage || edu.gpa) ? `  |  ${edu.grade || edu.percentage || edu.gpa}` : ''}`,
          size: SZ.muted, color: CW.textMuted, font: T.font.word,
        })],
        spacing: { after: 80 },
      }))
    }
  }

  if (!moveRight.has('languages') && data.languages?.length > 0) {
    leftChildren.push(sectionTitle('LANGUAGES'))
    data.languages.forEach(l => leftChildren.push(skillRow(getLangText(l))))
  }

  if (!moveRight.has('certifications') && data.certifications?.length > 0) {
    leftChildren.push(sectionTitle('CERTIFICATIONS'))
    for (const cert of data.certifications) {
      leftChildren.push(new Paragraph({
        children: [new TextRun({ text: cert.name, bold: true, size: SZ.body, color: CW.textPrimary, font: T.font.word })],
        spacing: { after: 30 },
      }))
      const certOrg = cert.issuingOrganization || cert.issuer
      const certDate = cert.issueDate || cert.year
      if (certOrg || certDate) {
        leftChildren.push(new Paragraph({
          children: [new TextRun({
            text: [certOrg, certDate].filter(Boolean).join(' | '),
            size: SZ.muted, color: CW.textMuted, font: T.font.word,
          })],
          spacing: { after: 60 },
        }))
      }
    }
  }

  if (!moveRight.has('awards') && data.awards?.length > 0) {
    leftChildren.push(sectionTitle('AWARDS & RECOGNITION'))
    data.awards.forEach(a => leftChildren.push(skillRow(getAwardText(a))))
  }

  // ── Right column ──
  const rightChildren = []

  if (data.keyHighlights?.length > 0) {
    rightChildren.push(sectionTitle('KEY HIGHLIGHTS'))
    for (const point of data.keyHighlights) rightChildren.push(bullet(point))
    rightChildren.push(new Paragraph({ children: [], spacing: { after: 80 } }))
  }

  if (grouped.length > 0) {
    rightChildren.push(sectionTitle('WORK EXPERIENCE'))
    for (const group of grouped) {
      if (group.isSingleRole) {
        const pos = group.positions[0]
        rightChildren.push(new Paragraph({
          children: [new TextRun({ text: group.company, bold: true, size: SZ.body, color: CW.textPrimary, font: T.font.word })],
          spacing: { after: 30 },
        }))
        rightChildren.push(new Paragraph({
          children: [
            new TextRun({ text: pos.role, bold: true, size: SZ.body, color: CW.textSecondary, font: T.font.word }),
            new TextRun({
              text: `    ${pos.start}${pos.end ? ` \u2013 ${pos.end}` : ' \u2013 Present'}`,
              size: SZ.muted, color: CW.textMuted, font: T.font.word,
            }),
          ],
          spacing: { after: 60 },
        }))
        for (const b of (getBullets(pos))) rightChildren.push(bullet(b))
      } else {
        rightChildren.push(new Paragraph({
          children: [
            new TextRun({ text: group.company, bold: true, size: SZ.body, color: CW.textPrimary, font: T.font.word }),
            new TextRun({
              text: `    ${group.overallStart}${group.overallEnd ? ` \u2013 ${group.overallEnd}` : ' \u2013 Present'}`,
              size: SZ.muted, color: CW.textMuted, font: T.font.word,
            }),
          ],
          spacing: { after: 50 },
        }))
        for (const pos of group.positions) {
          rightChildren.push(new Paragraph({
            children: [
              new TextRun({ text: pos.role, bold: true, size: SZ.body, color: CW.textSecondary, font: T.font.word }),
              new TextRun({
                text: `    ${pos.start}${pos.end ? ` \u2013 ${pos.end}` : ' \u2013 Present'}`,
                size: SZ.muted, color: CW.textMuted, font: T.font.word,
              }),
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

  if (moveRight.has('awards') && data.awards?.length > 0) {
    rightChildren.push(sectionTitle('AWARDS & RECOGNITION'))
    data.awards.forEach(a => rightChildren.push(skillRow(getAwardText(a))))
  }

  if (moveRight.has('languages') && data.languages?.length > 0) {
    rightChildren.push(sectionTitle('LANGUAGES'))
    data.languages.forEach(l => rightChildren.push(skillRow(getLangText(l))))
  }

  if (moveRight.has('certifications') && data.certifications?.length > 0) {
    rightChildren.push(sectionTitle('CERTIFICATIONS'))
    for (const cert of data.certifications) {
      rightChildren.push(new Paragraph({
        children: [new TextRun({ text: cert.name, bold: true, size: SZ.body, color: CW.textPrimary, font: T.font.word })],
        spacing: { after: 30 },
      }))
      const certOrg = cert.issuingOrganization || cert.issuer
      const certDate = cert.issueDate || cert.year
      if (certOrg || certDate) {
        rightChildren.push(new Paragraph({
          children: [new TextRun({
            text: [certOrg, certDate].filter(Boolean).join(' | '),
            size: SZ.muted, color: CW.textMuted, font: T.font.word,
          })],
          spacing: { after: 60 },
        }))
      }
    }
  }

  if (data.interests?.length > 0) {
    rightChildren.push(sectionTitle('INTERESTS & HOBBIES'))
    data.interests.forEach(item => rightChildren.push(skillRow(item)))
  }

  for (const section of (data.extraSections || [])) {
    if (!section.items?.length) continue
    rightChildren.push(sectionTitle(section.title.toUpperCase()))
    section.items.forEach(item => rightChildren.push(skillRow(item)))
  }

  const mainTable = new Table({
    width: { size: TABLE_W, type: WidthType.DXA },
    layout: TableLayoutType.FIXED,
    columnWidths: [COL_LEFT, COL_RIGHT],
    borders: TABLE_BORDERS,
    rows: [
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 2,
            width: { size: TABLE_W, type: WidthType.DXA },
            shading: { fill: CW.headerBg, type: ShadingType.CLEAR },
            borders: ALL_NONE,
            margins: {
              top: convertInchesToTwip(0.15), bottom: convertInchesToTwip(0.15),
              left: convertInchesToTwip(0.25), right: convertInchesToTwip(0.25),
            },
            children: headerChildren,
          }),
        ],
      }),
      new TableRow({
        children: [
          new TableCell({
            width: { size: COL_LEFT, type: WidthType.DXA },
            shading: { fill: CW.panelBg, type: ShadingType.CLEAR },
            borders: ALL_NONE,
            margins: {
              top: convertInchesToTwip(0.12), bottom: convertInchesToTwip(0.12),
              left: convertInchesToTwip(0.3), right: convertInchesToTwip(0.15),
            },
            children: leftChildren.length > 0 ? leftChildren : [new Paragraph('')],
          }),
          new TableCell({
            width: { size: COL_RIGHT, type: WidthType.DXA },
            borders: ALL_NONE,
            margins: {
              top: convertInchesToTwip(0.12), bottom: convertInchesToTwip(0.12),
              left: convertInchesToTwip(0.15), right: convertInchesToTwip(0.3),
            },
            children: rightChildren.length > 0 ? rightChildren : [new Paragraph('')],
          }),
        ],
      }),
    ],
  })

  return new Document({
    sections: [{
      properties: { page: { margin: { top: 0, bottom: 720, left: 0, right: 0 } } },
      children: [mainTable],
    }],
  })
}
