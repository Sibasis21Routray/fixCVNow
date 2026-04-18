// lib/pdf/minimal-serif.jsx
// @react-pdf/renderer — Minimal Serif template
import React from 'react'

import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import { groupExperience } from '../utils/groupExperience'
import { TEMPLATE } from '../theme'

const T = TEMPLATE['minimal-serif']
const SZ = T.sizePdf
const C  = T.color
const MARGIN = 28  // 0.75 inch

const styles = StyleSheet.create({
  page: {
    fontFamily: T.font.pdf,
    fontSize: SZ.body,
    backgroundColor: '#ffffff',
    paddingTop: MARGIN,
  paddingBottom: MARGIN,
  },
  header: {
    backgroundColor: C.headerBg,
    paddingHorizontal: MARGIN,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
  },
  name: {
    fontSize: SZ.name,
    fontFamily: T.font.pdfBold,
    color: C.headerText,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  titleText: {
    fontSize: SZ.body,
    color: C.headerSub,
    fontFamily: T.font.pdfItalic,
    marginTop: 2,
  },
  headerRight: {
    textAlign: 'right',
  },
  contactItem: {
    fontSize: SZ.small,
    color: C.headerSub,
    textAlign: 'right',
    marginBottom: 2,
  },
  labelBold: {
  fontFamily: T.font.pdfBold,
},
  summaryBanner: {
    paddingHorizontal: MARGIN,
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    borderBottomStyle: 'solid',
  },
  summaryLabel: {
    fontSize: SZ.small,
    fontFamily: T.font.pdfBold,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: C.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: SZ.body,
    color: C.textBody,
    lineHeight: 1.5,
    textAlign: 'center',
  },
  body: {
    flexDirection: 'row',
    flex: 1,
  },
  leftCol: {
    width: '35%',
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderRightWidth: 0.5,
    borderRightColor: 'rgba(0,0,0,0.1)',
    borderRightStyle: 'solid',
  },
  rightCol: {
    width: '65%',
    paddingHorizontal: 22,
    paddingVertical: 16,
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: SZ.sectionHead,
    fontFamily: T.font.pdfBold,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: C.textPrimary,
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(0,0,0,0.2)',
    borderBottomStyle: 'solid',
    paddingBottom: 2,
    marginBottom: 6,
  },
  eduBlock: {
    marginBottom: 7,
  },
  eduDegree: {
    fontSize: SZ.body,
    fontFamily: T.font.pdfBold,
    color: C.textPrimary,
  },
  eduInstitution: {
    fontSize: SZ.small,
    color: C.textSecondary,
  },
  eduDates: {
    fontSize: SZ.small,
    color: C.textMuted,
  },
  listItem: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 3,
  },
  listDot: {
    fontSize: SZ.body,
    color: C.textFaint,
  },
  listText: {
    fontSize: SZ.body,
    color: C.textBody,
    flex: 1,
    lineHeight: 1.4,
  },
  jobBlock: {
    marginBottom: 12,
  },
  jobCompany: {
    fontSize: SZ.sectionHead,
    fontFamily: T.font.pdfBold,
    color: C.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  jobRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  jobRole: {
    fontSize: SZ.body,
    fontFamily: T.font.pdfBold,
    color: C.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  jobDates: {
    fontSize: SZ.small,
    color: C.textMuted,
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
  },
  positionsBlock: {
    paddingLeft: 10,
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(0,0,0,0.12)',
    borderLeftStyle: 'solid',
  },
  positionEntry: {
    marginBottom: 8,
  },
  positionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  positionRole: {
    fontSize: SZ.body,
    fontFamily: T.font.pdfBold,
    color: C.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  positionDates: {
    fontSize: SZ.small,
    color: C.textMuted,
  },
  bullet: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 2,
    paddingLeft: 6,
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
  certBlock: {
    marginBottom: 6,
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
})

export function MinimalSerifPDF({ data }) {
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

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.name}>{data.name}</Text>
            {(data.headline || data.title) && <Text style={styles.titleText}>{data.headline || data.title}</Text>}
          </View>
          <View style={styles.headerRight}>
            {data.phone && <Text style={styles.contactItem}><Text style={styles.labelBold}>Ph. </Text> {data.phone}{data.alternatePhone ? ` / ${data.alternatePhone}` : ''}</Text>}
            {data.email && <Text style={styles.contactItem}><Text style={styles.labelBold}>Email </Text> {data.email}</Text>}
            {address ? <Text style={styles.contactItem}><Text style={styles.labelBold}>Addr. </Text> {address}</Text> : null}
            {data.nationality && <Text style={styles.contactItem}><Text style={styles.labelBold}>Nationality: </Text> {data.nationality}</Text>}
            {data.dateOfBirth && <Text style={styles.contactItem}><Text style={styles.labelBold}>DOB: </Text> {data.dateOfBirth}</Text>}
            {data.gender && <Text style={styles.contactItem}><Text style={styles.labelBold}>Gender: </Text> {data.gender}</Text>}
            {data.maritalStatus && <Text style={styles.contactItem}><Text style={styles.labelBold}>Marital Status: </Text> {data.maritalStatus}</Text>}
            {data.socialLinks?.map((link, idx) => (
              <Text key={idx} style={styles.contactItem}>{link.label}: {link.url}</Text>
            ))}
          </View>
        </View>

        {data.summary && (
          <View style={styles.summaryBanner}>
            <Text style={styles.summaryLabel}>Summary</Text>
            <Text style={styles.summaryText}>{data.summary?.replace(/\n/g, ' ')}</Text>
          </View>
        )}

        <View style={styles.body}>
          {/* LEFT */}
          <View style={styles.leftCol}>
            {data.education?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {data.education.map((edu, idx) => (
                  <View key={idx} style={styles.eduBlock}>
                    <Text style={styles.eduDegree}>{edu.degree}{(edu.fieldOfStudy || edu.field) ? ` — ${edu.fieldOfStudy || edu.field}` : ''}</Text>
                    <Text style={styles.eduInstitution}>{edu.institution || edu.school}</Text>
                    <Text style={styles.eduDates}>
                      {(edu.startYear || edu.start) ? `${edu.startYear || edu.start} – ` : ''}{edu.endYear || edu.end || edu.year}{(edu.grade || edu.percentage || edu.gpa) ? ` | ${edu.grade || edu.percentage || edu.gpa}` : ''}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {allSkills.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills</Text>
                {allSkills.map((skill, idx) => (
                  <View key={idx} style={styles.listItem}>
                    <Text style={styles.listDot}>•</Text>
                    <Text style={styles.listText}>{skill}</Text>
                  </View>
                ))}
              </View>
            )}

            {!moveRight.has('languages') && data.languages?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Languages</Text>
                {data.languages.map((lang, idx) => (
                  <View key={idx} style={styles.listItem}>
                    <Text style={styles.listDot}>•</Text>
                    <Text style={styles.listText}>{getLangText(lang)}</Text>
                  </View>
                ))}
              </View>
            )}

            {!moveRight.has('awards') && data.awards?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Awards & Recognition</Text>
                {data.awards.map((award, idx) => (
                  <View key={idx} style={styles.listItem}>
                    <Text style={styles.listDot}>•</Text>
                    <Text style={styles.listText}>{getAwardText(award)}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* RIGHT */}
          <View style={styles.rightCol}>
            {data.keyHighlights?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Key Highlights</Text>
                {data.keyHighlights.map((point, idx) => (
                  <View key={idx} style={styles.listItem}>
                    <Text style={styles.listDot}>•</Text>
                    <Text style={styles.listText}>{point}</Text>
                  </View>
                ))}
              </View>
            )}

            {grouped.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Professional Experience</Text>
                {grouped.map((group, gIdx) => (
                  <View key={gIdx} style={styles.jobBlock}>
                    {group.isSingleRole ? (
                      <>
                        <Text style={styles.jobCompany}>{group.company}</Text>
                        <View style={styles.jobRow}>
                          <Text style={styles.jobRole}>{group.positions[0].role}</Text>
                          <Text style={styles.jobDates}>
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

            {data.certifications?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Certifications</Text>
                {data.certifications.map((cert, idx) => (
                  <View key={idx} style={styles.certBlock}>
                    <Text style={styles.certName}>{cert.name}</Text>
                    {(cert.issuingOrganization || cert.issuer || cert.issueDate || cert.year) && (
                      <Text style={styles.certMeta}>
                        {[cert.issuingOrganization || cert.issuer, cert.issueDate || cert.year].filter(Boolean).join(' | ')}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {moveRight.has('awards') && data.awards?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Awards & Recognition</Text>
                {data.awards.map((award, idx) => (
                  <View key={idx} style={styles.listItem}>
                    <Text style={styles.listDot}>•</Text>
                    <Text style={styles.listText}>{getAwardText(award)}</Text>
                  </View>
                ))}
              </View>
            )}

            {moveRight.has('languages') && data.languages?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Languages</Text>
                {data.languages.map((lang, idx) => (
                  <View key={idx} style={styles.listItem}>
                    <Text style={styles.listDot}>•</Text>
                    <Text style={styles.listText}>{getLangText(lang)}</Text>
                  </View>
                ))}
              </View>
            )}

            {data.interests?.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Interests & Hobbies</Text>
                {data.interests.map((item, idx) => (
                  <View key={idx} style={styles.listItem}>
                    <Text style={styles.listDot}>•</Text>
                    <Text style={styles.listText}>{item}</Text>
                  </View>
                ))}
              </View>
            )}

            {data.extraSections?.map((section, sIdx) => (
              section.items?.length > 0 && (
                <View key={sIdx} style={styles.section}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  {section.items.map((item, iIdx) => (
                    <View key={iIdx} style={styles.listItem}>
                      <Text style={styles.listDot}>•</Text>
                      <Text style={styles.listText}>{item}</Text>
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
