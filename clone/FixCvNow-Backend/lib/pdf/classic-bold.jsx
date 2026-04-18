// lib/pdf/classic-bold.jsx
// @react-pdf/renderer — Classic Bold template (template 5)
import React from 'react'
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import { TEMPLATE } from '../theme'

const T  = TEMPLATE['classic-bold']
const SZ = T.sizePdf
const C  = T.color
const MARGIN = 36

// Column widths: left 63%, right 37%
const LEFT_W  = '63%'
const RIGHT_W = '37%'

const styles = StyleSheet.create({
  page: {
    fontFamily: T.font.pdf,
    fontSize: SZ.body,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingHorizontal: MARGIN,
    paddingTop: 24,
    paddingBottom: 14,
    borderBottomWidth: 2.5,
    borderBottomColor: C.accent,
    borderBottomStyle: 'solid',
  },
  name: {
    fontSize: SZ.name,
    fontFamily: T.font.pdfBold,
    color: C.headerText,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  headline: {
    fontSize: SZ.small,
    fontFamily: T.font.pdfBold,
    color: C.accent,
    marginBottom: 5,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  contactItem: {
    fontSize: SZ.micro,
    color: C.textBody,
  },
  body: {
    flexDirection: 'row',
    flex: 1,
  },
  leftCol: {
    width: LEFT_W,
    paddingLeft: MARGIN,
    paddingRight: 18,
    paddingTop: 16,
    paddingBottom: 24,
    borderRightWidth: 0.5,
    borderRightColor: C.borderLight,
    borderRightStyle: 'solid',
  },
  rightCol: {
    width: RIGHT_W,
    paddingLeft: 14,
    paddingRight: MARGIN,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: C.panelBg,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: SZ.small,
    fontFamily: T.font.pdfBold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: C.textPrimary,
    borderBottomWidth: 1.5,
    borderBottomColor: C.textPrimary,
    borderBottomStyle: 'solid',
    paddingBottom: 2,
    marginBottom: 6,
  },
  summaryText: {
    fontSize: SZ.body,
    color: C.textBody,
    lineHeight: 1.55,
  },
  jobBlock: {
    marginBottom: 12,
  },
  jobRole: {
    fontSize: SZ.sectionHead,
    fontFamily: T.font.pdfBold,
    color: C.textPrimary,
    marginBottom: 1,
  },
  jobCompany: {
    fontSize: SZ.body,
    fontFamily: T.font.pdfBold,
    color: C.accent,
    marginBottom: 2,
  },
  jobMeta: {
    fontSize: SZ.micro,
    color: C.textMuted,
    marginBottom: 4,
  },
  bullet: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 2,
  },
  bulletDot: {
    fontSize: SZ.body,
    color: C.textMuted,
  },
  bulletText: {
    fontSize: SZ.micro,
    color: C.textBody,
    flex: 1,
    lineHeight: 1.45,
  },
  // Right sidebar styles
  achievementRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 5,
  },
  checkMark: {
    fontSize: SZ.body,
    fontFamily: T.font.pdfBold,
    color: C.accent,
  },
  achievementText: {
    fontSize: SZ.micro,
    color: C.textBody,
    flex: 1,
    lineHeight: 1.45,
  },
  skillsText: {
    fontSize: SZ.body,
    color: C.textBody,
    lineHeight: 1.7,
  },
  eduBlock: {
    marginBottom: 8,
  },
  eduDegree: {
    fontSize: SZ.body,
    fontFamily: T.font.pdfBold,
    color: C.textPrimary,
    marginBottom: 1,
  },
  eduInstitution: {
    fontSize: SZ.small,
    fontFamily: T.font.pdfBold,
    color: C.accent,
    marginBottom: 1,
  },
  eduMeta: {
    fontSize: SZ.micro,
    color: C.textMuted,
  },
  certBlock: {
    marginBottom: 6,
  },
  certName: {
    fontSize: SZ.body,
    fontFamily: T.font.pdfBold,
    color: C.textPrimary,
    marginBottom: 1,
  },
  certMeta: {
    fontSize: SZ.micro,
    color: C.textMuted,
  },
  listItem: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 3,
  },
  listText: {
    fontSize: SZ.body,
    color: C.textBody,
    flex: 1,
    lineHeight: 1.4,
  },
  langBlock: {
    marginBottom: 4,
  },
  langName: {
    fontSize: SZ.body,
    fontFamily: T.font.pdfBold,
    color: C.textPrimary,
  },
  langProf: {
    fontSize: SZ.micro,
    color: C.textMuted,
  },
})

function SectionTitle({ title }) {
  return <Text style={styles.sectionTitle}>{title}</Text>
}

export function ClassicBoldPDF({ data }) {
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.name || ''}</Text>
          {headline && <Text style={styles.headline}>{headline}</Text>}
          <View style={styles.contactRow}>
            {contactParts.map((item, i) => (
              <Text key={i} style={styles.contactItem}>{item}</Text>
            ))}
          </View>
        </View>

        {/* Body */}
        <View style={styles.body}>
          {/* Left Column */}
          <View style={styles.leftCol}>
            {/* Summary */}
            {data.summary && (
              <View style={styles.section}>
                <SectionTitle title="Summary" />
                <Text style={styles.summaryText}>{data.summary?.replace(/\n/g, ' ')}</Text>
              </View>
            )}

            {/* Experience */}
            {(data.experience || []).length > 0 && (
              <View style={styles.section}>
                <SectionTitle title="Experience" />
                {data.experience.map((exp, i) => (
                  <View key={i} style={styles.jobBlock}>
                    <Text style={styles.jobRole}>{exp.role}</Text>
                    <Text style={styles.jobCompany}>{exp.company}</Text>
                    <Text style={styles.jobMeta}>
                      {exp.start}{exp.end ? ` – ${exp.end}` : ' – Present'}{exp.location ? `  •  ${exp.location}` : ''}
                    </Text>
                    {getBullets(exp).map((b, j) => (
                      <View key={j} style={styles.bullet}>
                        <Text style={styles.bulletDot}>•</Text>
                        <Text style={styles.bulletText}>{b}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}

            {/* Extra Sections */}
            {(data.extraSections || []).map((section, si) =>
              section.items?.length > 0 ? (
                <View key={si} style={styles.section}>
                  <SectionTitle title={section.title} />
                  {section.items.map((item, ii) => (
                    <View key={ii} style={styles.bullet}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{item}</Text>
                    </View>
                  ))}
                </View>
              ) : null
            )}
          </View>

          {/* Right Sidebar */}
          <View style={styles.rightCol}>
            {/* Key Achievements */}
            {data.keyHighlights?.length > 0 && (
              <View style={styles.section}>
                <SectionTitle title="Key Achievements" />
                {data.keyHighlights.map((item, i) => (
                  <View key={i} style={styles.achievementRow}>
                    <Text style={styles.checkMark}>✓</Text>
                    <Text style={styles.achievementText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Skills */}
            {allSkills.length > 0 && (
              <View style={styles.section}>
                <SectionTitle title="Skills" />
                <Text style={styles.skillsText}>{allSkills.join(', ')}</Text>
              </View>
            )}

            {/* Education */}
            {data.education?.length > 0 && (
              <View style={styles.section}>
                <SectionTitle title="Education" />
                {data.education.map((edu, i) => (
                  <View key={i} style={styles.eduBlock}>
                    <Text style={styles.eduDegree}>
                      {edu.degree}{(edu.fieldOfStudy || edu.field) ? ` — ${edu.fieldOfStudy || edu.field}` : ''}
                    </Text>
                    <Text style={styles.eduInstitution}>{edu.institution || edu.school || ''}</Text>
                    <Text style={styles.eduMeta}>
                      {[edu.endYear || edu.end || edu.year, edu.grade || edu.percentage || edu.gpa].filter(Boolean).join('  •  ')}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Certifications */}
            {data.certifications?.length > 0 && (
              <View style={styles.section}>
                <SectionTitle title="Certifications" />
                {data.certifications.map((cert, i) => (
                  <View key={i} style={styles.certBlock}>
                    <Text style={styles.certName}>{cert.name}</Text>
                    <Text style={styles.certMeta}>
                      {[cert.issuingOrganization || cert.issuer, cert.issueDate || cert.year].filter(Boolean).join(' | ')}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Awards */}
            {data.awards?.length > 0 && (
              <View style={styles.section}>
                <SectionTitle title="Awards" />
                {data.awards.map((a, i) => (
                  <View key={i} style={styles.listItem}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.listText}>{getAwardText(a)}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Languages */}
            {data.languages?.length > 0 && (
              <View style={styles.section}>
                <SectionTitle title="Languages" />
                {data.languages.map((l, i) => (
                  <View key={i} style={styles.langBlock}>
                    <Text style={styles.langName}>{typeof l === 'string' ? l : (l.language || '')}</Text>
                    {(typeof l !== 'string' && l.proficiency) && (
                      <Text style={styles.langProf}>{l.proficiency}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Interests */}
            {data.interests?.length > 0 && (
              <View style={styles.section}>
                <SectionTitle title="Interests" />
                <Text style={styles.skillsText}>{data.interests.join(', ')}</Text>
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  )
}
