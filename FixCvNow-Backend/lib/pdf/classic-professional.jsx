// lib/pdf/classic-professional.jsx
// @react-pdf/renderer — Classic Professional template
import React from 'react'

import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer'
import { groupExperience } from '../utils/groupExperience'
import { TEMPLATE } from '../theme'

const T = TEMPLATE['classic-professional']
const SZ = T.sizePdf
const C  = T.color
const MARGIN = 54  // 0.75 inch = 54pt

const styles = StyleSheet.create({
  page: {
    fontFamily: T.font.pdf,
    fontSize: SZ.body,
    backgroundColor: '#ffffff',
    paddingTop: MARGIN,
    paddingBottom: MARGIN,
    paddingLeft: MARGIN,
    paddingRight: MARGIN,
  },
  header: {
    backgroundColor: C.headerBg,
    marginHorizontal: -MARGIN,
    marginTop: -MARGIN,
    paddingHorizontal: MARGIN,
    paddingTop: 18,
    paddingBottom: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  name: {
    fontSize: SZ.name,
    fontFamily: T.font.pdfBold,
    color: C.headerText,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 5,
    gap: 10,
  },
  contactItem: {
    fontSize: SZ.small,
    color: C.headerSub,
  },
  section: {
    marginBottom: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  sectionSquare: {
    width: 8,
    height: 8,
    backgroundColor: C.accent,
    borderRadius: 1,
  },
  sectionTitle: {
    fontSize: SZ.sectionHead,
    fontFamily: T.font.pdfBold,
    color: C.textPrimary,
  },
  sectionDivider: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.12)',
    borderTopStyle: 'solid',
    marginBottom: 6,
    marginTop: 2,
  },
  summaryText: {
    fontSize: SZ.body,
    color: C.textBody,
    lineHeight: 1.5,
  },
  jobBlock: {
    marginBottom: 10,
  },
  jobCompany: {
    fontSize: SZ.sectionHead,
    fontFamily: T.font.pdfBold,
    color: C.textPrimary,
  },
  jobMeta: {
    fontSize: SZ.small,
    color: C.textMuted,
    fontFamily: T.font.pdfItalic,
    marginBottom: 3,
  },
  companyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 4,
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
  positionRole: {
    fontSize: SZ.body,
    color: C.textSecondary,
    fontFamily: T.font.pdfItalic,
  },
  positionDates: {
    fontSize: SZ.small,
    color: C.textMuted,
  },
  bullet: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 2,
    marginTop: 1,
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
  table: {
    width: '100%',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: C.accent,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableRowAlt: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  thCell: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.15)',
    borderStyle: 'solid',
    padding: 4,
    fontSize: SZ.small,
    fontFamily: T.font.pdfBold,
    color: C.accentText,
  },
  tdCell: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.15)',
    borderStyle: 'solid',
    padding: 4,
    fontSize: SZ.small,
    color: C.textBody,
  },
  tdYearCell: {
    width: 55,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.15)',
    borderStyle: 'solid',
    padding: 4,
    fontSize: SZ.small,
    color: C.textMuted,
  },
  thYearCell: {
    width: 55,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.15)',
    borderStyle: 'solid',
    padding: 4,
    fontSize: SZ.small,
    fontFamily: T.font.pdfBold,
    color: C.accentText,
  },
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillItem: {
    width: '50%',
    flexDirection: 'row',
    gap: 3,
    marginBottom: 2,
  },
  skillText: {
    fontSize: SZ.body,
    color: C.textBody,
    flex: 1,
  },
  certBlock: {
    marginBottom: 5,
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

export function ClassicProfessionalPDF({ data }) {
  const grouped = groupExperience(data.experience)
  const allSkills = Array.isArray(data.skills)
    ? data.skills
    : [...(data.skills?.technicalSkills || []), ...(data.skills?.softSkills || []), ...(data.skills?.toolsAndTechnologies || [])]
  const address = data.currentAddress || data.address?.full || data.address?.city
    || [data.location?.city, data.location?.state, data.location?.country].filter(Boolean).join(', ')
  const getLangText = (lang) => typeof lang === 'string' ? lang : `${lang.language || ''}${lang.proficiency ? ` (${lang.proficiency})` : ''}`
  const getAwardText = (award) => typeof award === 'string' ? award : (award.title || '')
  const getBullets = (pos) => [...(pos.description || []), ...(pos.achievements || [])]

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{data.name}</Text>
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

        {data.summary && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionSquare} />
              <Text style={styles.sectionTitle}>Profile Summary</Text>
            </View>
            <View style={styles.sectionDivider} />
            <Text style={styles.summaryText}>{data.summary?.replace(/\n/g, ' ')}</Text>
          </View>
        )}

        {data.keyHighlights?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionSquare} />
              <Text style={styles.sectionTitle}>Key Highlights</Text>
            </View>
            <View style={styles.sectionDivider} />
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
            <View style={styles.sectionHeader}>
              <View style={styles.sectionSquare} />
              <Text style={styles.sectionTitle}>Professional Experience</Text>
            </View>
            <View style={styles.sectionDivider} />
            {grouped.map((group, gIdx) => (
              <View key={gIdx} style={styles.jobBlock}>
                {group.isSingleRole ? (
                  <>
                    <Text style={styles.jobCompany}>{group.company}</Text>
                    <Text style={styles.jobMeta}>
                      {group.positions[0].role} | {group.positions[0].start}{group.positions[0].end ? ` – ${group.positions[0].end}` : ' – Present'}
                    </Text>
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
                          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' }}>
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

        {data.education?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionSquare} />
              <Text style={styles.sectionTitle}>Education</Text>
            </View>
            <View style={styles.sectionDivider} />
            <View style={styles.table}>
              <View style={styles.tableHeaderRow}>
                <Text style={styles.thCell}>Course</Text>
                <Text style={styles.thCell}>University / Board</Text>
                <Text style={styles.thYearCell}>Year</Text>
                <Text style={styles.thYearCell}>%/Grade</Text>
              </View>
              {data.education.map((edu, idx) => (
                <View key={idx} style={idx % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
                  <Text style={styles.tdCell}>{edu.degree}{(edu.fieldOfStudy || edu.field) ? ` (${edu.fieldOfStudy || edu.field})` : ''}</Text>
                  <Text style={styles.tdCell}>{edu.institution || edu.school}</Text>
                  <Text style={styles.tdYearCell}>{edu.endYear || edu.end || edu.year}</Text>
                  <Text style={styles.tdYearCell}>{edu.grade || edu.percentage || edu.gpa || '-'}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {allSkills.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionSquare} />
              <Text style={styles.sectionTitle}>Skills</Text>
            </View>
            <View style={styles.sectionDivider} />
            <View style={styles.skillsGrid}>
              {allSkills.map((skill, idx) => (
                <View key={idx} style={styles.skillItem}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {data.languages?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionSquare} />
              <Text style={styles.sectionTitle}>Languages</Text>
            </View>
            <View style={styles.sectionDivider} />
            <View style={styles.skillsGrid}>
              {data.languages.map((lang, idx) => (
                <View key={idx} style={styles.skillItem}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.skillText}>{getLangText(lang)}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {data.certifications?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionSquare} />
              <Text style={styles.sectionTitle}>Certifications</Text>
            </View>
            <View style={styles.sectionDivider} />
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

        {data.awards?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionSquare} />
              <Text style={styles.sectionTitle}>Awards & Recognition</Text>
            </View>
            <View style={styles.sectionDivider} />
            {data.awards.map((award, idx) => (
              <View key={idx} style={styles.bullet}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{getAwardText(award)}</Text>
              </View>
            ))}
          </View>
        )}

        {data.interests?.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionSquare} />
              <Text style={styles.sectionTitle}>Interests & Hobbies</Text>
            </View>
            <View style={styles.sectionDivider} />
            <View style={styles.skillsGrid}>
              {data.interests.map((item, idx) => (
                <View key={idx} style={styles.skillItem}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.skillText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {data.extraSections?.map((section, sIdx) => (
          section.items?.length > 0 && (
            <View key={sIdx} style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionSquare} />
                <Text style={styles.sectionTitle}>{section.title}</Text>
              </View>
              <View style={styles.sectionDivider} />
              {section.items.map((item, iIdx) => (
                <View key={iIdx} style={styles.bullet}>
                  <Text style={styles.bulletDot}>•</Text>
                  <Text style={styles.bulletText}>{item}</Text>
                </View>
              ))}
            </View>
          )
        ))}
      </Page>
    </Document>
  )
}
