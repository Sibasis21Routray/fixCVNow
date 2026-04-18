// lib/pdf/modern-minimalist.jsx
// @react-pdf/renderer — Modern Minimalist template (template 4)
import React from 'react'
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import { TEMPLATE } from '../theme'

const T  = TEMPLATE['modern-minimalist']
const SZ = T.sizePdf
const C  = T.color
const MARGIN = 0
const INNER  = 36

const styles = StyleSheet.create({
  page: {
    fontFamily: T.font.pdf,
    fontSize: SZ.body,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: C.headerBg,
    paddingHorizontal: INNER + 14,
    paddingTop: 28,
    paddingBottom: 20,
  },
  name: {
    fontSize: SZ.name + 4,
    fontFamily: T.font.pdfBold,
    color: C.headerText,
    marginBottom: 4,
  },
  headline: {
    fontSize: SZ.small,
    color: 'rgba(255,255,255,0.75)',
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 3,
  },
  contactLabel: {
    fontSize: SZ.small,
    fontFamily: T.font.pdfBold,
    color: 'rgba(255,255,255,0.9)',
    width: 52,
  },
  contactValue: {
    fontSize: SZ.small,
    color: 'rgba(255,255,255,0.9)',
    flex: 1,
  },
  body: {
    paddingHorizontal: INNER + 14,
    paddingTop: 20,
    paddingBottom: 28,
  },
  summaryText: {
    fontSize: SZ.body,
    color: C.textBody,
    lineHeight: 1.55,
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    marginTop: 4,
  },
  diamond: {
    width: 8,
    height: 8,
    backgroundColor: C.accent,
    transform: 'rotate(45deg)',
  },
  sectionTitle: {
    fontSize: SZ.sectionHead,
    fontFamily: T.font.pdfBold,
    color: C.textPrimary,
    letterSpacing: 0.3,
  },
  timelineEntry: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  timelineDiamond: {
    width: 6,
    height: 6,
    backgroundColor: C.accent,
    transform: 'rotate(45deg)',
    marginTop: 3,
    marginRight: 8,
    flexShrink: 0,
  },
  timelineDates: {
    width: 64,
    flexShrink: 0,
    marginRight: 12,
  },
  timelineDateTop: {
    fontSize: SZ.micro,
    fontFamily: T.font.pdfBold,
    color: C.textSecondary,
    textTransform: 'uppercase',
  },
  timelineDateBot: {
    fontSize: SZ.micro,
    fontFamily: T.font.pdfBold,
    color: C.textSecondary,
    textTransform: 'uppercase',
  },
  timelineContent: {
    flex: 1,
  },
  jobRole: {
    fontSize: SZ.sectionHead,
    fontFamily: T.font.pdfBold,
    color: C.textPrimary,
    marginBottom: 1,
  },
  jobCompany: {
    fontSize: SZ.small,
    color: C.textSecondary,
    marginBottom: 5,
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
    fontSize: SZ.body,
    color: C.textBody,
    flex: 1,
    lineHeight: 1.4,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 16,
  },
  skillItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  skillDiamond: {
    width: 4,
    height: 4,
    backgroundColor: C.accent,
    transform: 'rotate(45deg)',
    flexShrink: 0,
  },
  skillText: {
    fontSize: SZ.body,
    color: C.textBody,
    flex: 1,
  },
  eduDegree: {
    fontSize: SZ.sectionHead,
    fontFamily: T.font.pdfBold,
    color: C.textPrimary,
    marginBottom: 1,
  },
  eduInstitution: {
    fontSize: SZ.small,
    color: C.textSecondary,
  },
  certName: {
    fontSize: SZ.body,
    fontFamily: T.font.pdfBold,
    color: C.textPrimary,
    marginBottom: 1,
  },
  certMeta: {
    fontSize: SZ.small,
    color: C.textMuted,
  },
  listItem: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 3,
    paddingLeft: 16,
  },
  listText: {
    fontSize: SZ.body,
    color: C.textBody,
    flex: 1,
    lineHeight: 1.4,
  },
})

function SectionHeader({ title }) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.diamond} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  )
}

function Bullet({ text }) {
  return (
    <View style={styles.bullet}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.bulletText}>{text}</Text>
    </View>
  )
}

export function ModernMinimalistPDF({ data }) {
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.name || ''}</Text>
          {headline && <Text style={styles.headline}>{headline}</Text>}
          {address && (
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Address</Text>
              <Text style={styles.contactValue}>{address}</Text>
            </View>
          )}
          {data.phone && (
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>{data.phone}{data.alternatePhone ? ` / ${data.alternatePhone}` : ''}</Text>
            </View>
          )}
          {data.email && (
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>E-mail</Text>
              <Text style={styles.contactValue}>{data.email}</Text>
            </View>
          )}
          {data.nationality && (
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Nationality</Text>
              <Text style={styles.contactValue}>{data.nationality}</Text>
            </View>
          )}
          {data.dateOfBirth && (
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>DOB</Text>
              <Text style={styles.contactValue}>{data.dateOfBirth}</Text>
            </View>
          )}
          {data.gender && (
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Gender</Text>
              <Text style={styles.contactValue}>{data.gender}</Text>
            </View>
          )}
          {data.maritalStatus && (
            <View style={styles.contactRow}>
              <Text style={styles.contactLabel}>Marital Status</Text>
              <Text style={styles.contactValue}>{data.maritalStatus}</Text>
            </View>
          )}
          {(data.socialLinks || []).map((link, i) => (
            <View key={i} style={styles.contactRow}>
              <Text style={styles.contactLabel}>{link.label}</Text>
              <Text style={styles.contactValue}>{link.url}</Text>
            </View>
          ))}
        </View>

        {/* Body */}
        <View style={styles.body}>
          {/* Summary */}
          {data.summary && (
            <Text style={styles.summaryText}>{data.summary?.replace(/\n/g, ' ')}</Text>
          )}

          {/* Key Highlights */}
          {data.keyHighlights?.length > 0 && (
            <View style={styles.section}>
              <SectionHeader title="Key Highlights" />
              {data.keyHighlights.map((item, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Work History */}
          {(data.experience || []).length > 0 && (
            <View style={styles.section}>
              <SectionHeader title="Work History" />
              {data.experience.map((exp, i) => (
                <View key={i} style={styles.timelineEntry}>
                  <View style={styles.timelineDiamond} />
                  <View style={styles.timelineDates}>
                    <Text style={styles.timelineDateTop}>{exp.start} –</Text>
                    <Text style={styles.timelineDateBot}>{exp.end || 'Present'}</Text>
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.jobRole}>{exp.role}</Text>
                    <Text style={styles.jobCompany}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</Text>
                    {getBullets(exp).map((b, j) => <Bullet key={j} text={b} />)}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Skills */}
          {allSkills.length > 0 && (
            <View style={styles.section}>
              <SectionHeader title="Skills" />
              <View style={styles.skillsGrid}>
                {allSkills.map((s, i) => (
                  <View key={i} style={styles.skillItem}>
                    <View style={styles.skillDiamond} />
                    <Text style={styles.skillText}>{s}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Education */}
          {data.education?.length > 0 && (
            <View style={styles.section}>
              <SectionHeader title="Education" />
              {data.education.map((edu, i) => (
                <View key={i} style={styles.timelineEntry}>
                  <View style={styles.timelineDiamond} />
                  <View style={styles.timelineDates}>
                    <Text style={styles.timelineDateTop}>{edu.endYear || edu.end || edu.year || ''}</Text>
                    {(edu.grade || edu.percentage || edu.gpa) && (
                      <Text style={styles.timelineDateBot}>{edu.grade || edu.percentage || edu.gpa}</Text>
                    )}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.eduDegree}>
                      {edu.degree}{(edu.fieldOfStudy || edu.field) ? `: ${edu.fieldOfStudy || edu.field}` : ''}
                    </Text>
                    <Text style={styles.eduInstitution}>{edu.institution || edu.school || ''}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Certifications */}
          {data.certifications?.length > 0 && (
            <View style={styles.section}>
              <SectionHeader title="Certifications" />
              {data.certifications.map((cert, i) => (
                <View key={i} style={styles.timelineEntry}>
                  <View style={styles.timelineDiamond} />
                  <View style={styles.timelineDates}>
                    <Text style={styles.timelineDateTop}>{cert.issueDate || cert.year || ''}</Text>
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.certName}>{cert.name}</Text>
                    {(cert.issuingOrganization || cert.issuer) && (
                      <Text style={styles.certMeta}>{cert.issuingOrganization || cert.issuer}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Awards */}
          {data.awards?.length > 0 && (
            <View style={styles.section}>
              <SectionHeader title="Awards & Recognition" />
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
              <SectionHeader title="Languages" />
              {data.languages.map((l, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.listText}>{getLangText(l)}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Interests */}
          {data.interests?.length > 0 && (
            <View style={styles.section}>
              <SectionHeader title="Interests & Hobbies" />
              {data.interests.map((item, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Extra Sections */}
          {(data.extraSections || []).map((section, si) =>
            section.items?.length > 0 ? (
              <View key={si} style={styles.section}>
                <SectionHeader title={section.title} />
                {section.items.map((item, ii) => (
                  <View key={ii} style={styles.listItem}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.listText}>{item}</Text>
                  </View>
                ))}
              </View>
            ) : null
          )}
        </View>
      </Page>
    </Document>
  )
}
