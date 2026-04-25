// lib/pdf/executive-navy.jsx
// @react-pdf/renderer — Executive Navy template
import React from 'react'

import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import { groupExperience } from '../utils/groupExperience'
import { TEMPLATE } from '../theme'

const T = TEMPLATE['executive-navy']
const SZ = T.sizePdf
const C = T.color

const styles = StyleSheet.create({
  page: {
    fontFamily: T.font.pdf,
    fontSize: SZ.body,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: C.headerBg,
    paddingHorizontal: 24,
    paddingVertical: 18,
    textAlign: 'center',
  },
  name: {
    fontSize: SZ.name,
    fontFamily: T.font.pdfBold,
    color: C.headerText,
    letterSpacing: 2,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  title: {
    fontSize: SZ.sectionHead,
    color: C.headerSub,
    fontFamily: T.font.pdfBold,
    textAlign: 'center',
    marginTop: 3,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 6,
    gap: 16,
  },
  contactItem: {
    fontSize: SZ.small,
    color: C.headerSub,
  },
  body: {
    flexDirection: 'row',
    flex: 1,
    minHeight: 650,
  },
  leftCol: {
    width: '35%',
    backgroundColor: C.panelBg,
    padding: 18,
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.08)',
    borderRightStyle: 'solid',
  },
  rightCol: {
    width: '65%',
    padding: 18,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: SZ.sectionHead,
    fontFamily: T.font.pdfBold,
    color: C.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 1.5,
    borderBottomColor: C.accent,
    borderBottomStyle: 'solid',
    paddingBottom: 2,
    marginBottom: 6,
  },
  summaryText: {
    fontSize: SZ.body,
    color: C.textBody,
    lineHeight: 1.5,
  },
  skillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  skillBullet: {
    fontSize: SZ.body - 2,
    color: C.accent,
    marginRight: 4,
  },
  skillText: {
    fontSize: SZ.body,
    color: C.textBody,
    flex: 1,
  },
  eduBlock: {
    marginBottom: 7,
    flexDirection: 'row',
    gap: 5,
  },
  eduBullet: {
    fontSize: SZ.body - 4,
    color: C.accent,
    marginTop: 2,
    marginRight: 4,
    flexShrink: 0,
  },
  eduContent: {
    flex: 1,
  },
  eduDegree: {
    fontSize: SZ.body,
    fontFamily: T.font.pdfBold,
    color: C.textPrimary,
  },
  eduField: {
    fontSize: SZ.small,
    color: C.textSecondary,
  },
  eduMeta: {
    fontSize: SZ.small,
    color: C.textMuted,
  },
  certBlock: {
    marginBottom: 6,
    flexDirection: 'row',
    gap: 5,
  },
  certContent: {
    flex: 1,
  },
  certName: {
    fontSize: SZ.body,
    fontFamily: T.font.pdfBold,
    color: C.textPrimary,
  },
  certMeta: {
    fontSize: SZ.small,
    color: C.textMuted,
  },
  jobBlock: {
    marginBottom: 12,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginBottom: 3,
  },
  jobCompany: {
    fontSize: SZ.sectionHead,
    fontFamily: T.font.pdfBold,
    color: C.textPrimary,
  },
  jobRole: {
    fontSize: SZ.body,
    fontFamily: T.font.pdfBold,
    color: C.textSecondary,
  },
  jobDateBadge: {
    fontSize: SZ.small,
    color: C.textMuted,
    backgroundColor: 'rgba(0,0,0,0.04)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  companyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 5,
  },
  companyOverallDates: {
    fontSize: SZ.small,
    color: C.textMuted,
    backgroundColor: 'rgba(0,0,0,0.04)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  positionsBlock: {
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(0,0,0,0.1)',
    borderLeftStyle: 'solid',
  },
  positionEntry: {
    marginBottom: 8,
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 2,
  },
  positionRole: {
    fontSize: SZ.body,
    fontFamily: T.font.pdfBold,
    color: C.textSecondary,
  },
  positionDates: {
    fontSize: SZ.small,
    color: C.textMuted,
  },
  bullet: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 2,
    paddingLeft: 4,
  },
  bulletDot: {
    fontSize: SZ.body,
    color: C.textFaint,
  },
  bulletText: {
    fontSize: SZ.body,
    color: C.textBody,
    flex: 1,
    lineHeight: 1.4,
  },
})

export function ExecutiveNavyPDF({ data }) {
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{data.name}</Text>
          {(data.headline || data.title) && <Text style={styles.title}>{data.headline || data.title}</Text>}
          <View style={styles.contactRow}>
            {data.phone && <Text style={styles.contactItem}>Ph. {data.phone}{data.alternatePhone ? ` / ${data.alternatePhone}` : ''}</Text>}
            {data.email && <Text style={styles.contactItem}>Email {data.email}</Text>}
            {address ? <Text style={styles.contactItem}>Addr. {address}</Text> : null}
            {data.nationality && <Text style={styles.contactItem}>Nationality: {data.nationality}</Text>}
            {data.dateOfBirth && <Text style={styles.contactItem}>DOB: {data.dateOfBirth}</Text>}
            {data.gender && <Text style={styles.contactItem}>Gender: {data.gender}</Text>}
            {data.maritalStatus && <Text style={styles.contactItem}>Marital Status: {data.maritalStatus}</Text>}
            {data.socialLinks?.map((link, idx) => (
              <Text key={idx} style={styles.contactItem}>{link.label}: {link.url}</Text>
            ))}
          </View>
        </View>

        <View style={styles.body}>
          {/* LEFT column */}
          <View style={styles.leftCol}>
            {data.summary && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Profile Summary</Text>
                <Text style={styles.summaryText}>{data.summary}</Text>
              </View>
            )}

            {coreSkills.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Core Competencies</Text>
                {coreSkills.slice(0, 12).map((skill, idx) => (
                  <View key={idx} style={styles.skillRow}>
                    <Text style={styles.skillBullet}>•</Text>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            )}

            {data.education?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {data.education.map((edu, idx) => (
                  <View key={idx} style={styles.eduBlock}>
                    <Text style={styles.eduBullet}>•</Text>
                    <View style={styles.eduContent}>
                      <Text style={styles.eduDegree}>{edu.degree}</Text>
                      {(edu.fieldOfStudy || edu.field) && <Text style={styles.eduField}>{edu.fieldOfStudy || edu.field}</Text>}
                      <Text style={styles.eduMeta}>
                        {edu.institution || edu.school} | {edu.endYear || edu.end || edu.year}{(edu.grade || edu.percentage || edu.gpa) ? ` | ${edu.grade || edu.percentage || edu.gpa}` : ''}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {!moveRight.has('languages') && data.languages?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Languages</Text>
                {data.languages.map((lang, idx) => (
                  <View key={idx} style={styles.skillRow}>
                    <Text style={styles.skillBullet}>•</Text>
                    <Text style={styles.skillText}>{getLangText(lang)}</Text>
                  </View>
                ))}
              </View>
            )}

            {!moveRight.has('certifications') && data.certifications?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Certifications</Text>
                {data.certifications.map((cert, idx) => (
                  <View key={idx} style={styles.certBlock}>
                    <Text style={styles.eduBullet}>•</Text>
                    <View style={styles.certContent}>
                      <Text style={styles.certName}>{cert.name}</Text>
                      {(cert.issuingOrganization || cert.issuer || cert.issueDate || cert.year) && (
                        <Text style={styles.certMeta}>
                          {[cert.issuingOrganization || cert.issuer, cert.issueDate || cert.year].filter(Boolean).join(' | ')}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {!moveRight.has('awards') && data.awards?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Awards & Recognition</Text>
                {data.awards.map((award, idx) => (
                  <View key={idx} style={styles.skillRow}>
                    <Text style={styles.skillBullet}>•</Text>
                    <Text style={styles.skillText}>{getAwardText(award)}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* RIGHT column */}
          <View style={styles.rightCol}>
            {data.keyHighlights?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Key Highlights</Text>
                {data.keyHighlights.map((point, idx) => (
                  <View key={idx} style={styles.bullet}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{point}</Text>
                  </View>
                ))}
              </View>
            )}

            {grouped.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Work Experience</Text>
                {grouped.map((group, gIdx) => (
                  <View key={gIdx} style={styles.jobBlock}>
                    {group.isSingleRole ? (
                      <>
                        <View style={styles.jobHeader}>
                          <View>
                            <Text style={styles.jobCompany}>{group.company}</Text>
                            <Text style={styles.jobRole}>{group.positions[0].role}</Text>
                          </View>
                          <Text style={styles.jobDateBadge}>
                            {group.positions[0].start}{group.positions[0].end ? ` – ${group.positions[0].end}` : ' – Present'}
                          </Text>
                        </View>
                        {getBullets(group.positions[0]).map((bullet, i) => (
                          <View key={i} style={styles.bullet}>
                            <Text style={styles.bulletDot}>•</Text>
                            <Text style={styles.bulletText}>{bullet}</Text>
                          </View>
                        ))}
                      </>
                    ) : (
                      <>
                        <View style={styles.companyHeader}>
                          <Text style={styles.jobCompany}>{group.company}</Text>
                          <Text style={styles.companyOverallDates}>
                            {group.overallStart}{group.overallEnd ? ` – ${group.overallEnd}` : ' – Present'}
                          </Text>
                        </View>
                        <View style={styles.positionsBlock}>
                          {group.positions.map((pos, pIdx) => (
                            <View key={pIdx} style={styles.positionEntry}>
                              <View style={styles.positionHeader}>
                                <Text style={styles.positionRole}>{pos.role}</Text>
                                <Text style={styles.positionDates}>{pos.start}{pos.end ? ` – ${pos.end}` : ' – Present'}</Text>
                              </View>
                              {getBullets(pos).map((bullet, i) => (
                                <View key={i} style={styles.bullet}>
                                  <Text style={styles.bulletDot}>•</Text>
                                  <Text style={styles.bulletText}>{bullet}</Text>
                                </View>
                              ))}
                            </View>
                          ))}
                        </View>
                      </>
                    )}
                  </View>
                ))}
              </View>
            )}

            {moveRight.has('awards') && data.awards?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Awards & Recognition</Text>
                {data.awards.map((award, idx) => (
                  <View key={idx} style={styles.skillRow}>
                    <Text style={styles.skillBullet}>•</Text>
                    <Text style={styles.skillText}>{getAwardText(award)}</Text>
                  </View>
                ))}
              </View>
            )}

            {moveRight.has('languages') && data.languages?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Languages</Text>
                {data.languages.map((lang, idx) => (
                  <View key={idx} style={styles.skillRow}>
                    <Text style={styles.skillBullet}>•</Text>
                    <Text style={styles.skillText}>{getLangText(lang)}</Text>
                  </View>
                ))}
              </View>
            )}

            {moveRight.has('certifications') && data.certifications?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Certifications</Text>
                {data.certifications.map((cert, idx) => (
                  <View key={idx} style={styles.certBlock}>
                    <Text style={styles.eduBullet}>•</Text>
                    <View style={styles.certContent}>
                      <Text style={styles.certName}>{cert.name}</Text>
                      {(cert.issuingOrganization || cert.issuer || cert.issueDate || cert.year) && (
                        <Text style={styles.certMeta}>
                          {[cert.issuingOrganization || cert.issuer, cert.issueDate || cert.year].filter(Boolean).join(' | ')}
                        </Text>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {data.interests?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Interests & Hobbies</Text>
                {data.interests.map((item, idx) => (
                  <View key={idx} style={styles.skillRow}>
                    <Text style={styles.skillBullet}>•</Text>
                    <Text style={styles.skillText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}

            {data.extraSections?.map((section, sIdx) => (
              section.items?.length > 0 && (
                <View key={sIdx} style={styles.section}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  {section.items.map((item, iIdx) => (
                    <View key={iIdx} style={styles.skillRow}>
                      <Text style={styles.skillBullet}>•</Text>
                      <Text style={styles.skillText}>{item}</Text>
                    </View>
                  ))}
                </View>
              )
            ))}
          </View>
        </View>
      </Page>
    </Document>
  )
}
