// components/templates/modern-minimalist/index.js
// Template 4 — Modern Minimalist (refined to match image reference)

import { TEMPLATE } from '@/lib/theme'

const T = TEMPLATE['modern-minimalist']
const C = T.color

const DiamondIcon = ({ size = 10, hollow = false }) => (
  <div style={{
    width: size, height: size,
    backgroundColor: hollow ? 'white' : C.accent,
    border: hollow ? `2px solid ${C.accent}` : 'none',
    transform: 'rotate(45deg)',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }} />
)

function SectionHeader({ title }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px', marginTop: '20px' }}>
      <DiamondIcon size={24} />
      <h2 style={{
        fontSize: '14px', fontWeight: 'bold', color: C.textPrimary, margin: 0,
        fontFamily: T.font.html, letterSpacing: '0.02em'
      }}>
        {title}
      </h2>
    </div>
  )
}

// Reusable timeline row: date-right | diamond | content
function TimelineEntry({ dateTop, dateBottom, children }) {
  return (
    <div style={{ display: 'flex', marginBottom: '20px', alignItems: 'flex-start' }}>
      <div style={{ width: '12px', display: 'flex', justifyContent: 'center', zIndex: 1, marginTop: '4px', flexShrink: 0, marginLeft: '7px' }}>
        <div style={{ width: '8px', height: '8px', backgroundColor: C.accent, transform: 'rotate(45deg)'}} />
      </div>
       <div style={{ width: '70px', textAlign: 'right', paddingLeft: '5px', flexShrink: 0 }}>
        {dateTop   && <div style={{ fontSize: '9px', fontWeight: 'bold', color: C.textSecondary, textTransform: 'uppercase' }}>{dateTop.slice(0,3)} {dateTop.slice(-6)}</div>}
        {dateBottom && <div style={{ fontSize: '9px', fontWeight: 'bold', color: C.textSecondary, textTransform: 'uppercase' }}>{dateBottom.slice(0,3)} {dateBottom.slice(-4)}</div>}
      </div>
      <div style={{ flex: 1, paddingLeft: '15px'}}>
        {children}
      </div>
    </div>
  )
}

const TimelineBar = () => (
  <div style={{ position: 'absolute', left: '12px', top: '5px', bottom: '5px', width: '1px', backgroundColor: '#CBD5E1' }} />
)

export function ModernMinimalistTemplate({ data }) {
  if (!data) return null

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
    <div style={{ backgroundColor: 'white', fontFamily: T.font.html, minHeight: '100%', paddingBottom: '40px' }}>
      {/* ── Header ── */}
      <div style={{ backgroundColor: C.headerBg, padding: '40px 50px 30px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: C.headerText, margin: '0 0 6px 0', letterSpacing: '0.02em' }}>
          {data.name || 'Your Name'}
        </h1>
        {headline && (
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', marginBottom: '12px' }}>{headline}</div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {address && (
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)' }}>
              <span style={{ fontWeight: 'bold', marginRight: '8px' }}>Address</span>{address}
            </div>
          )}
          {data.phone && (
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)' }}>
              <span style={{ fontWeight: 'bold', marginRight: '8px' }}>Phone</span>
              {data.phone}{data.alternatePhone ? ` / ${data.alternatePhone}` : ''}
            </div>
          )}
          {data.email && (
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)' }}>
              <span style={{ fontWeight: 'bold', marginRight: '8px' }}>E-mail</span>{data.email}
            </div>
          )}
          {data.nationality && (
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)' }}>
              <span style={{ fontWeight: 'bold', marginRight: '8px' }}>Nationality</span>{data.nationality}
            </div>
          )}
          {data.dateOfBirth && (
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)' }}>
              <span style={{ fontWeight: 'bold', marginRight: '8px' }}>DOB</span>{data.dateOfBirth}
            </div>
          )}
          {data.gender && (
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)' }}>
              <span style={{ fontWeight: 'bold', marginRight: '8px' }}>Gender</span>{data.gender}
            </div>
          )}
          {data.maritalStatus && (
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)' }}>
              <span style={{ fontWeight: 'bold', marginRight: '8px' }}>Marital Status</span>{data.maritalStatus}
            </div>
          )}
          {(data.socialLinks || []).map((link, i) => (
            <div key={i} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.9)' }}>
              <span style={{ fontWeight: 'bold', marginRight: '8px' }}>{link.label}</span>{link.url}
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: '30px 50px' }}>
        {/* ── Summary ── */}
        {data.summary && (
          <div style={{ marginBottom: '30px' }}>
            <p style={{ fontSize: '11px', color: C.textBody, lineHeight: '1.6', margin: 0 }}>{data.summary}</p>
          </div>
        )}

        {/* ── Key Highlights ── */}
        {data.keyHighlights?.length > 0 && (
          <div style={{ marginBottom: '25px' }}>
            <SectionHeader title="Key Highlights" />
            <div style={{ paddingLeft: '107px' }}>
              {data.keyHighlights.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '5px', alignItems: 'flex-start' }}>
                  <span style={{ color: C.textMuted, flexShrink: 0, marginTop: '2px', fontSize: '10px' }}>•</span>
                  <span style={{ fontSize: '10px', color: C.textBody, lineHeight: '1.5' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Work History ── */}
        {(data.experience || []).length > 0 && (
          <div style={{ marginBottom: '25px' }}>
            <SectionHeader title="Work History" />
            <div style={{ position: 'relative' }}>
              <TimelineBar />
              {data.experience.map((exp, i) => (
                <TimelineEntry key={i} dateTop={`${exp.start} -`} dateBottom={exp.end || 'Present'}>
                  <p style={{ fontWeight: 'bold', fontSize: '12px', color: C.textPrimary, margin: '0 0 2px 0' }}>
                    {exp.role}
                  </p>
                  <p style={{ fontSize: '10px', color: C.textSecondary, margin: '0 0 8px 0' }}>
                    {exp.company}{exp.location ? `, ${exp.location}` : ''}
                  </p>
                  {getBullets(exp).map((b, j) => (
                    <div key={j} style={{ display: 'flex', gap: '8px', marginBottom: '4px', alignItems: 'flex-start' }}>
                      <span style={{ color: C.textMuted, flexShrink: 0, marginTop: '2px', fontSize: '10px' }}>•</span>
                      <span style={{ fontSize: '10px', color: C.textBody, lineHeight: '1.5' }}>{b}</span>
                    </div>
                  ))}
                </TimelineEntry>
              ))}
            </div>
          </div>
        )}

        {/* ── Skills ── */}
        {allSkills.length > 0 && (
          <div style={{ marginBottom: '25px' }}>
            <SectionHeader title="Skills" />
            <div style={{ paddingLeft: '81px', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '12px', top: '0', bottom: '0', width: '1px', backgroundColor: '#CBD5E1' }} />
              <div style={{ paddingLeft: '25px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px 30px' }}>
                {allSkills.map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '4px', backgroundColor: C.accent, transform: 'rotate(45deg)', flexShrink: 0 }} />
                    <span style={{ fontSize: '10px', color: C.textBody }}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Education ── */}
        {data.education?.length > 0 && (
          <div style={{ marginBottom: '25px' }}>
            <SectionHeader title="Education" />
            <div style={{ position: 'relative' }}>
              <TimelineBar />
              {data.education.map((edu, i) => (
                <TimelineEntry
                  key={i}
                  dateTop={edu.endYear || edu.end || edu.year || ''}
                  dateBottom={edu.grade || edu.percentage || edu.gpa || ''}
                >
                  <p style={{ fontWeight: 'bold', fontSize: '11px', color: C.textPrimary, margin: '0 0 2px 0' }}>
                    {edu.degree}{edu.fieldOfStudy || edu.field ? `: ${edu.fieldOfStudy || edu.field}` : ''}
                  </p>
                  <p style={{ fontSize: '10px', color: C.textSecondary, margin: 0 }}>
                    {edu.institution || edu.school || ''}
                  </p>
                </TimelineEntry>
              ))}
            </div>
          </div>
        )}

        {/* ── Certifications ── */}
        {data.certifications?.length > 0 && (
          <div style={{ marginBottom: '25px' }}>
            <SectionHeader title="Certifications" />
            <div style={{ position: 'relative' }}>
              <TimelineBar />
              {data.certifications.map((cert, i) => (
                <TimelineEntry key={i} dateTop={cert.issueDate || cert.year || ''}>
                  <p style={{ fontWeight: 'bold', fontSize: '11px', color: C.textPrimary, margin: '0 0 2px 0' }}>{cert.name}</p>
                  <p style={{ fontSize: '10px', color: C.textSecondary, margin: 0 }}>
                    {cert.issuingOrganization || cert.issuer || ''}
                  </p>
                </TimelineEntry>
              ))}
            </div>
          </div>
        )}

        {/* ── Awards ── */}
        {data.awards?.length > 0 && (
          <div style={{ marginBottom: '25px' }}>
            <SectionHeader title="Awards & Recognition" />
            <div style={{ paddingLeft: '107px' }}>
              {data.awards.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '5px', alignItems: 'flex-start' }}>
                  <span style={{ color: C.textMuted, flexShrink: 0, marginTop: '2px', fontSize: '10px' }}>•</span>
                  <span style={{ fontSize: '10px', color: C.textBody }}>{getAwardText(a)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Interests & Languages (side by side) ── */}
        {(data.interests?.length > 0 || data.languages?.length > 0) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '25px' }}>
            {data.interests?.length > 0 && (
              <div>
                <SectionHeader title="Interests & Hobbies" />
                <div style={{ paddingLeft: '14px' }}>
                  {data.interests.map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <div style={{ width: '4px', height: '4px', backgroundColor: C.accent, transform: 'rotate(45deg)', flexShrink: 0 }} />
                      <span style={{ fontSize: '10px', color: C.textBody }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data.languages?.length > 0 && (
              <div>
                <SectionHeader title="Languages" />
                <div style={{ paddingLeft: '14px' }}>
                  {data.languages.map((l, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <div style={{ width: '4px', height: '4px', backgroundColor: C.accent, transform: 'rotate(45deg)', flexShrink: 0 }} />
                      <span style={{ fontSize: '10px', color: C.textBody }}>{getLangText(l)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Extra Sections ── */}
        {(data.extraSections || []).map((section, si) =>
          section.items?.length > 0 ? (
            <div key={si} style={{ marginBottom: '25px' }}>
              <SectionHeader title={section.title} />
              <div style={{ paddingLeft: '107px' }}>
                {section.items.map((item, ii) => (
                  <div key={ii} style={{ display: 'flex', gap: '8px', marginBottom: '5px', alignItems: 'flex-start' }}>
                    <span style={{ color: C.textMuted, flexShrink: 0, marginTop: '2px', fontSize: '10px' }}>•</span>
                    <span style={{ fontSize: '10px', color: C.textBody }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : null
        )}
      </div>
    </div>
  )
}

export function ModernPreview({ data }) {
  const allSkills = Array.isArray(data.skills)
    ? data.skills
    : [...(data.skills?.technicalSkills || []), ...(data.skills?.softSkills || []), ...(data.skills?.toolsAndTechnologies || [])]
  const address = data.currentAddress || data.address?.full || data.address?.city
    || [data.location?.city, data.location?.state, data.location?.country].filter(Boolean).join(', ')
  const exp = data.experience?.[0]
  const exp2 = data.experience?.[1]

  return (
    <div className="h-full bg-white text-[7px] leading-tight overflow-hidden" style={{ fontFamily: T.font.html }}>
      {/* Header */}
      <div className="px-3 py-2" style={{ backgroundColor: C.headerBg }}>
        <div className="font-bold text-[11px] truncate" style={{ color: C.headerText }}>{data.name}</div>
        {(data.title || data.headline) && (
          <div className="text-[7px] truncate mb-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>{data.title || data.headline}</div>
        )}
        <div className="space-y-0.5">
          {address && (
            <div className="text-[6px] truncate" style={{ color: 'rgba(255,255,255,0.85)' }}>
              <span className="font-bold mr-1">Address</span>{address}
            </div>
          )}
          {data.phone && (
            <div className="text-[6px] truncate" style={{ color: 'rgba(255,255,255,0.85)' }}>
              <span className="font-bold mr-1">Phone</span>{data.phone}{data.alternatePhone ? ` / ${data.alternatePhone}` : ''}
            </div>
          )}
          {data.email && (
            <div className="text-[6px] truncate" style={{ color: 'rgba(255,255,255,0.85)' }}>
              <span className="font-bold mr-1">E-mail</span>{data.email}
            </div>
          )}
          {data.dateOfBirth && (
            <div className="text-[6px] truncate" style={{ color: 'rgba(255,255,255,0.85)' }}>
              <span className="font-bold mr-1">DOB</span>{data.dateOfBirth}
            </div>
          )}
        </div>
      </div>

      <div className="px-3 py-1.5 space-y-1.5">
        {/* Summary */}
        {data.summary && (
          <p className="text-[6px] line-clamp-2 leading-snug" style={{ color: C.textBody }}>{data.summary}</p>
        )}

        {/* Work History */}
        {(exp || exp2) && (
          <div>
            <div className="flex items-center gap-1 mb-1">
              <div style={{ width: 6, height: 6, backgroundColor: C.accent, transform: 'rotate(45deg)', flexShrink: 0 }} />
              <span className="font-bold text-[6px] uppercase tracking-wider" style={{ color: C.textPrimary }}>Work History</span>
            </div>
            {[exp, exp2].filter(Boolean).map((e, i) => (
              <div key={i} className="flex gap-1 mb-1 items-start">
                <div style={{ width: 5, height: 5, backgroundColor: C.accent, transform: 'rotate(45deg)', flexShrink: 0, marginTop: 2 }} />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[6px] truncate" style={{ color: C.textPrimary }}>{e.role}</div>
                  <div className="text-[5px] truncate" style={{ color: C.textSecondary }}>{e.company}</div>
                </div>
                <div className="text-[5px] flex-shrink-0" style={{ color: C.textMuted }}>{e.start}–{e.end || 'Now'}</div>
              </div>
            ))}
          </div>
        )}

        {/* Skills */}
        {allSkills.length > 0 && (
          <div>
            <div className="flex items-center gap-1 mb-1">
              <div style={{ width: 6, height: 6, backgroundColor: C.accent, transform: 'rotate(45deg)', flexShrink: 0 }} />
              <span className="font-bold text-[6px] uppercase tracking-wider" style={{ color: C.textPrimary }}>Skills</span>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
              {allSkills.slice(0, 8).map((s, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div style={{ width: 3, height: 3, backgroundColor: C.accent, transform: 'rotate(45deg)', flexShrink: 0 }} />
                  <span className="text-[5px] truncate" style={{ color: C.textBody }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {data.education?.[0] && (
          <div>
            <div className="flex items-center gap-1 mb-1">
              <div style={{ width: 6, height: 6, backgroundColor: C.accent, transform: 'rotate(45deg)', flexShrink: 0 }} />
              <span className="font-bold text-[6px] uppercase tracking-wider" style={{ color: C.textPrimary }}>Education</span>
            </div>
            <div className="flex gap-1 items-start">
              <div style={{ width: 5, height: 5, backgroundColor: C.accent, transform: 'rotate(45deg)', flexShrink: 0, marginTop: 2 }} />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-[6px] truncate" style={{ color: C.textPrimary }}>{data.education[0].degree}</div>
                <div className="text-[5px] truncate" style={{ color: C.textSecondary }}>{data.education[0].institution || data.education[0].school}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
