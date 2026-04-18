// components/templates/classic-bold/index.js
// Template 5 — Classic Bold
// Two-column 65/35 layout, blue accent, thick black section headers, light grey sidebar

import { TEMPLATE } from '@/lib/theme'

const T = TEMPLATE['classic-bold']
const C = T.color

const profToScore = (p = '') => {
  const lp = p.toLowerCase()
  if (lp.includes('native') || lp.includes('fluent')) return 5
  if (lp.includes('advanced')) return 4
  if (lp.includes('intermediate') || lp.includes('conversational')) return 3
  if (lp.includes('basic') || lp.includes('elementary')) return 2
  return 2
}

function SectionHeader({ title }) {
  return (
    <div style={{ borderBottom: `2.5px solid ${C.textPrimary}`, marginBottom: '10px', paddingBottom: '3px' }}>
      <h2 style={{
        fontSize: '11px', fontWeight: '900', textTransform: 'uppercase',
        letterSpacing: '0.08em', color: C.textPrimary, margin: 0,
        fontFamily: T.font.html,
      }}>
        {title}
      </h2>
    </div>
  )
}

export function ClassicBoldTemplate({ data }) {
  if (!data) return null

  const address = data.currentAddress || data.address?.full || data.address?.city
    || [data.location?.city, data.location?.state, data.location?.country].filter(Boolean).join(', ')
  const allSkills = Array.isArray(data.skills)
    ? data.skills
    : [...(data.skills?.technicalSkills || []), ...(data.skills?.softSkills || []), ...(data.skills?.toolsAndTechnologies || [])]
  const getBullets = (exp) => [...(exp.description || []), ...(exp.achievements || [])]
  const getAwardText = (a) => typeof a === 'string' ? a : (a.title || '')
  const getLang = (l) => typeof l === 'string'
    ? { name: l, proficiency: '' }
    : { name: l.language || '', proficiency: l.proficiency || '' }

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
    <div style={{ backgroundColor: 'white', fontFamily: T.font.html, minHeight: '100%' }}>
      {/* ── Header ── */}
      <div style={{ padding: '36px 40px 18px', borderBottom: `3px solid ${C.accent}` }}>
        <h1 style={{
          fontSize: '32px', fontWeight: '900', color: C.headerText,
          margin: '0 0 8px 0', letterSpacing: '-0.01em',
        }}>
          {data.name || 'Your Name'}
        </h1>
        {headline && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0 4px', marginBottom: '10px', fontSize: '11px', fontWeight: '700', color: C.accent }}>
            {headline.split('|').map((part, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {i > 0 && <span style={{ color: C.borderLight }}>|</span>}
                {part.trim()}
              </span>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 18px', fontSize: '10px', color: C.textBody }}>
          {contactParts.map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', minHeight: 'calc(100% - 130px)' }}>

        {/* ── Left Column ── */}
        <div style={{ padding: '22px 28px 24px 40px', borderRight: `1px solid ${C.borderLight}` }}>
          {/* Summary */}
          {data.summary && (
            <div style={{ marginBottom: '22px' }}>
              <SectionHeader title="Summary" />
              <p style={{ fontSize: '10px', color: C.textBody, lineHeight: '1.65', margin: 0 }}>
                {data.summary}
              </p>
            </div>
          )}

          {/* Experience */}
          {(data.experience || []).length > 0 && (
            <div style={{ marginBottom: '22px' }}>
              <SectionHeader title="Experience" />
              {data.experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: '16px' }}>
                  <p style={{ fontWeight: '800', fontSize: '11px', color: C.textPrimary, margin: '0 0 2px 0' }}>
                    {exp.role}
                  </p>
                  <p style={{ fontWeight: '700', fontSize: '10px', color: C.accent, margin: '0 0 4px 0' }}>
                    {exp.company}
                  </p>
                  <div style={{ display: 'flex', gap: '14px', fontSize: '9px', color: C.textMuted, marginBottom: '6px' }}>
                    <span>{exp.start}{exp.end ? ` - ${exp.end}` : ' - Present'}</span>
                    {exp.location && <span>{exp.location}</span>}
                  </div>
                  {getBullets(exp).map((b, j) => (
                    <div key={j} style={{ display: 'flex', gap: '6px', marginBottom: '3px', alignItems: 'flex-start' }}>
                      <span style={{ color: C.textMuted, flexShrink: 0, fontWeight: 'bold', fontSize: '10px', marginTop: '1px' }}>•</span>
                      <span style={{ fontSize: '9px', color: C.textBody, lineHeight: '1.55' }}>{b}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Extra Sections */}
          {(data.extraSections || []).map((section, si) =>
            section.items?.length > 0 ? (
              <div key={si} style={{ marginBottom: '22px' }}>
                <SectionHeader title={section.title} />
                {section.items.map((item, ii) => (
                  <div key={ii} style={{ display: 'flex', gap: '6px', marginBottom: '4px', alignItems: 'flex-start' }}>
                    <span style={{ color: C.textMuted, flexShrink: 0, fontWeight: 'bold', fontSize: '10px' }}>•</span>
                    <span style={{ fontSize: '9px', color: C.textBody }}>{item}</span>
                  </div>
                ))}
              </div>
            ) : null
          )}
        </div>

        {/* ── Right Column (Sidebar) ── */}
        <div style={{ padding: '22px 28px 24px 20px', backgroundColor: C.panelBg }}>

          {/* Key Achievements */}
          {data.keyHighlights?.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <SectionHeader title="Key Achievements" />
              {data.keyHighlights.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '6px', alignItems: 'flex-start' }}>
                  <span style={{ color: C.accent, flexShrink: 0, fontWeight: '900', fontSize: '11px', marginTop: '0px' }}>✓</span>
                  <p style={{ fontSize: '9px', color: C.textBody, margin: 0, lineHeight: '1.55' }}>{item}</p>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {allSkills.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <SectionHeader title="Skills" />
              <p style={{ fontSize: '10px', color: C.textBody, lineHeight: '1.8', margin: 0 }}>
                {allSkills.join(', ')}
              </p>
            </div>
          )}

          {/* Education */}
          {data.education?.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <SectionHeader title="Education" />
              {data.education.map((edu, i) => (
                <div key={i} style={{ marginBottom: '10px' }}>
                  <p style={{ fontWeight: '800', fontSize: '10px', color: C.textPrimary, margin: '0 0 2px 0' }}>
                    {edu.degree}{edu.fieldOfStudy || edu.field ? ` — ${edu.fieldOfStudy || edu.field}` : ''}
                  </p>
                  <p style={{ fontWeight: '700', fontSize: '9px', color: C.accent, margin: '0 0 2px 0' }}>
                    {edu.institution || edu.school || ''}
                  </p>
                  <p style={{ fontSize: '8px', color: C.textMuted, margin: 0 }}>
                    {[edu.endYear || edu.end || edu.year || '', edu.grade || edu.percentage || edu.gpa || ''].filter(Boolean).join('  •  ')}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {data.certifications?.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <SectionHeader title="Certifications" />
              {data.certifications.map((cert, i) => (
                <div key={i} style={{ marginBottom: '8px' }}>
                  <p style={{ fontWeight: '800', fontSize: '10px', color: C.textPrimary, margin: '0 0 1px 0' }}>{cert.name}</p>
                  <p style={{ fontSize: '8px', color: C.textMuted, margin: 0 }}>
                    {[cert.issuingOrganization || cert.issuer, cert.issueDate || cert.year].filter(Boolean).join(' | ')}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Awards */}
          {data.awards?.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <SectionHeader title="Awards" />
              {data.awards.map((a, i) => (
                <div key={i} style={{ display: 'flex', gap: '6px', marginBottom: '4px', alignItems: 'flex-start' }}>
                  <span style={{ color: C.textMuted, fontWeight: 'bold', fontSize: '10px', flexShrink: 0 }}>•</span>
                  <span style={{ fontSize: '9px', color: C.textBody }}>{getAwardText(a)}</span>
                </div>
              ))}
            </div>
          )}

          {/* Interests */}
          {data.interests?.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <SectionHeader title="Interests" />
              <p style={{ fontSize: '10px', color: C.textBody, lineHeight: '1.8', margin: 0 }}>
                {data.interests.join(', ')}
              </p>
            </div>
          )}

          {/* Languages */}
          {data.languages?.length > 0 && (
            <div style={{ marginBottom: '18px' }}>
              <SectionHeader title="Languages" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px' }}>
                {data.languages.map((l, i) => {
                  const { name, proficiency } = getLang(l)
                  const score = profToScore(proficiency)
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '10px', color: C.textPrimary }}>{name}</div>
                        {proficiency && <div style={{ fontSize: '8px', color: C.textMuted }}>{proficiency}</div>}
                      </div>
                      <div style={{ display: 'flex', gap: '2px', marginLeft: '6px' }}>
                        {[1, 2, 3, 4, 5].map(step => (
                          <div key={step} style={{
                            width: '5px', height: '12px', borderRadius: '2px',
                            backgroundColor: step <= score ? C.accent : C.borderLight,
                          }} />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function ClassicBoldPreview({ data }) {
  const allSkills = Array.isArray(data.skills)
    ? data.skills
    : [...(data.skills?.technicalSkills || []), ...(data.skills?.softSkills || []), ...(data.skills?.toolsAndTechnologies || [])]
  const address = data.currentAddress || data.address?.full || data.address?.city
    || [data.location?.city, data.location?.state, data.location?.country].filter(Boolean).join(', ')
  const exp = data.experience?.[0]
  const exp2 = data.experience?.[1]
  const getBullets = (e) => [...(e.description || []), ...(e.achievements || [])]

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
  ].filter(Boolean)

  return (
    <div className="h-full bg-white text-[7px] leading-tight overflow-hidden" style={{ fontFamily: T.font.html }}>
      {/* Header */}
      <div className="px-3 pt-2 pb-1.5" style={{ borderBottom: `2px solid ${C.accent}` }}>
        <div className="font-black text-[11px] truncate" style={{ color: C.headerText }}>{data.name}</div>
        {headline && (
          <div className="font-bold text-[7px] truncate" style={{ color: C.accent }}>{headline}</div>
        )}
        <div className="flex flex-wrap gap-x-2 gap-y-0 text-[5px] mt-0.5" style={{ color: C.textBody }}>
          {contactParts.map((p, i) => <span key={i} className="truncate">{p}</span>)}
        </div>
      </div>

      {/* Body: 2-column */}
      <div className="grid h-full" style={{ gridTemplateColumns: '1.7fr 1fr' }}>
        {/* Left */}
        <div className="px-2 py-1.5 space-y-1.5" style={{ borderRight: `1px solid ${C.borderLight}` }}>
          {data.summary && (
            <div>
              <div style={{ borderBottom: `1.5px solid ${C.textPrimary}` }} className="mb-0.5">
                <span className="font-black text-[5px] uppercase tracking-widest" style={{ color: C.textPrimary }}>Summary</span>
              </div>
              <p className="text-[5px] line-clamp-2 leading-snug" style={{ color: C.textBody }}>{data.summary}</p>
            </div>
          )}
          {(exp || exp2) && (
            <div>
              <div style={{ borderBottom: `1.5px solid ${C.textPrimary}` }} className="mb-0.5">
                <span className="font-black text-[5px] uppercase tracking-widest" style={{ color: C.textPrimary }}>Experience</span>
              </div>
              {[exp, exp2].filter(Boolean).map((e, i) => (
                <div key={i} className="mb-1">
                  <div className="font-extrabold text-[6px] truncate" style={{ color: C.textPrimary }}>{e.role}</div>
                  <div className="font-bold text-[5px] truncate" style={{ color: C.accent }}>{e.company}</div>
                  <div className="text-[5px]" style={{ color: C.textMuted }}>{e.start}{e.end ? ` - ${e.end}` : ' - Present'}</div>
                  {getBullets(e).slice(0, 2).map((b, j) => (
                    <div key={j} className="flex gap-0.5">
                      <span className="font-bold" style={{ color: C.textMuted }}>•</span>
                      <span className="text-[5px] line-clamp-1" style={{ color: C.textBody }}>{b}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="px-2 py-1.5 space-y-1.5" style={{ backgroundColor: C.panelBg }}>
          {allSkills.length > 0 && (
            <div>
              <div style={{ borderBottom: `1.5px solid ${C.textPrimary}` }} className="mb-0.5">
                <span className="font-black text-[5px] uppercase tracking-widest" style={{ color: C.textPrimary }}>Skills</span>
              </div>
              <p className="text-[5px] leading-relaxed" style={{ color: C.textBody }}>{allSkills.slice(0, 8).join(', ')}</p>
            </div>
          )}
          {data.education?.[0] && (
            <div>
              <div style={{ borderBottom: `1.5px solid ${C.textPrimary}` }} className="mb-0.5">
                <span className="font-black text-[5px] uppercase tracking-widest" style={{ color: C.textPrimary }}>Education</span>
              </div>
              <div className="font-extrabold text-[6px] truncate" style={{ color: C.textPrimary }}>{data.education[0].degree}</div>
              <div className="font-bold text-[5px] truncate" style={{ color: C.accent }}>{data.education[0].institution || data.education[0].school}</div>
              <div className="text-[5px]" style={{ color: C.textMuted }}>{data.education[0].endYear || data.education[0].end || data.education[0].year || ''}</div>
            </div>
          )}
          {data.keyHighlights?.length > 0 && (
            <div>
              <div style={{ borderBottom: `1.5px solid ${C.textPrimary}` }} className="mb-0.5">
                <span className="font-black text-[5px] uppercase tracking-widest" style={{ color: C.textPrimary }}>Key Achievements</span>
              </div>
              {data.keyHighlights.slice(0, 3).map((item, i) => (
                <div key={i} className="flex gap-0.5 mb-0.5">
                  <span className="font-black text-[5px]" style={{ color: C.accent }}>✓</span>
                  <span className="text-[5px] line-clamp-1" style={{ color: C.textBody }}>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
