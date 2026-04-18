// components/templates/executive-navy/index.js

import { groupExperience } from '@/lib/utils/groupExperience'
import { TEMPLATE } from '@/lib/theme'

const T = TEMPLATE['executive-navy']

const getLangText = (lang) => typeof lang === 'string' ? lang : `${lang.language || ''}${lang.proficiency ? ` (${lang.proficiency})` : ''}`
const getAwardText = (award) => typeof award === 'string' ? award : (award.title || '')

// ─────────────────────────────────────────────
// Full template — used in ResumePreview
// ─────────────────────────────────────────────
export function ExecutiveNavyTemplate({ data, getBlurClass }) {
  const allSkills = Array.isArray(data.skills)
    ? data.skills
    : [...(data.skills?.technicalSkills || []), ...(data.skills?.softSkills || []), ...(data.skills?.toolsAndTechnologies || [])]
  const coreSkills = data.coreCompetencies?.length > 0 ? data.coreCompetencies : allSkills
  const address = data.currentAddress || data.address?.full || data.address?.city
    || [data.location?.city, data.location?.state, data.location?.country].filter(Boolean).join(', ')
  const getBullets = (pos) => [...(pos.description || []), ...(pos.achievements || [])]

  // Column balance: move sections from left → right if left is significantly taller
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
    <div className="bg-white h-full text-xs leading-relaxed" style={{ fontFamily: T.font.html }}>
      {/* Header — black background */}
      <div className="px-6 py-4" style={{ backgroundColor: T.color.headerBg }}>
        <h1 className="text-xl font-bold tracking-widest uppercase text-center" style={{ color: T.color.headerText }}>{data.name}</h1>
        {(() => { const h = data.headline || data.title; return h && h.trim().replace(/\//g,'').trim() ? <p className="text-center font-semibold text-sm mt-0.5" style={{ color: T.color.headerSub }}>{h}</p> : null })()}
        <div className="flex justify-center gap-6 mt-2 text-[11px] flex-wrap" style={{ color: T.color.headerSub }}>
          {data.phone && <span><span className="font-semibold">Ph.</span> {data.phone}{data.alternatePhone ? ` / ${data.alternatePhone}` : ''}</span>}
          {data.email && <span><span className="font-semibold">Email</span> {data.email}</span>}
          {address && <span><span className="font-semibold">Addr.</span> {address}</span>}
          {data.nationality && <span><span className="font-semibold">Nationality:</span> {data.nationality}</span>}
          {data.dateOfBirth && <span><span className="font-semibold">DOB:</span> {data.dateOfBirth}</span>}
          {data.socialLinks?.map((link, idx) => (
            <span key={idx}><span className="font-semibold">{link.label}:</span> {link.url}</span>
          ))}
        </div>
      </div>

      <div className="flex" style={{ minHeight: '700px' }}>
        {/* Left Column */}
        <div className="p-4 space-y-4 border-r border-gray-200" style={{ width: '35%', backgroundColor: T.color.panelBg }}>
          {data.summary && (
            <div className={getBlurClass('light')}>
              <h2 className="text-[10px] font-bold uppercase tracking-widest mb-1 pb-0.5 border-b-2" style={{ borderColor: T.color.accent, color: T.color.textPrimary }}>
                Profile Summary
              </h2>
              <p className="text-[10px] leading-relaxed" style={{ color: T.color.textBody }}>{data.summary}</p>
            </div>
          )}

          {coreSkills.length > 0 && (
            <div className={getBlurClass('heavy')}>
              <h2 className="text-[10px] font-bold uppercase tracking-widest mb-1 pb-0.5 border-b-2" style={{ borderColor: T.color.accent, color: T.color.textPrimary }}>
                Core Competencies
              </h2>
              <ul className="space-y-0.5">
                {coreSkills.slice(0, 10).map((skill, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-[10px]" style={{ color: T.color.textBody }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: T.color.accent }} />
                    <span className="min-w-0" style={{ overflowWrap: 'anywhere' }}>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.education?.length > 0 && (
            <div className={getBlurClass('heavy')}>
              <h2 className="text-[10px] font-bold uppercase tracking-widest mb-1 pb-0.5 border-b-2" style={{ borderColor: T.color.accent, color: T.color.textPrimary }}>
                Education
              </h2>
              <div className="space-y-2">
                {data.education.map((edu, idx) => (
                  <div key={idx} className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: T.color.accent }} />
                    <div>
                      <p className="font-bold text-[10px]" style={{ color: T.color.textPrimary }}>{edu.degree}</p>
                      {(edu.fieldOfStudy || edu.field) && <p className="text-[9px]" style={{ color: T.color.textSecondary }}>{edu.fieldOfStudy || edu.field}</p>}
                      <p className="text-[9px]" style={{ color: T.color.textMuted }}>
                        {edu.institution || edu.school} | {edu.endYear || edu.end || edu.year}{(edu.grade || edu.percentage || edu.gpa) ? ` | ${edu.grade || edu.percentage || edu.gpa}` : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!moveRight.has('languages') && data.languages?.length > 0 && (
            <div className={getBlurClass('heavy')}>
              <h2 className="text-[10px] font-bold uppercase tracking-widest mb-1 pb-0.5 border-b-2" style={{ borderColor: T.color.accent, color: T.color.textPrimary }}>
                Languages
              </h2>
              <ul className="space-y-0.5">
                {data.languages.map((lang, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 text-[10px]" style={{ color: T.color.textBody }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: T.color.accent }} />
                    {getLangText(lang)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!moveRight.has('certifications') && data.certifications?.length > 0 && (
            <div className={getBlurClass('heavy')}>
              <h2 className="text-[10px] font-bold uppercase tracking-widest mb-1 pb-0.5 border-b-2" style={{ borderColor: T.color.accent, color: T.color.textPrimary }}>
                Certifications
              </h2>
              <div className="space-y-1.5">
                {data.certifications.map((cert, idx) => (
                  <div key={idx} className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: T.color.accent }} />
                    <div>
                      <p className="font-bold text-[10px]" style={{ color: T.color.textPrimary }}>{cert.name}</p>
                      {(cert.issuingOrganization || cert.issuer || cert.issueDate || cert.year) && (
                        <p className="text-[9px]" style={{ color: T.color.textMuted }}>
                          {[cert.issuingOrganization || cert.issuer, cert.issueDate || cert.year].filter(Boolean).join(' | ')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!moveRight.has('awards') && data.awards?.length > 0 && (
            <div className={getBlurClass('heavy')}>
              <h2 className="text-[10px] font-bold uppercase tracking-widest mb-1 pb-0.5 border-b-2" style={{ borderColor: T.color.accent, color: T.color.textPrimary }}>
                Awards & Recognition
              </h2>
              <div className="space-y-1">
                {data.awards.map((award, idx) => (
                  <div key={idx} className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: T.color.accent }} />
                    <p className="text-[10px]" style={{ color: T.color.textBody }}>{getAwardText(award)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="p-4 space-y-4" style={{ flex: 1 }}>
          {data.keyHighlights?.length > 0 && (
            <div className={getBlurClass('light')}>
              <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2 pb-0.5 border-b-2" style={{ borderColor: T.color.accent, color: T.color.textPrimary }}>
                Key Highlights
              </h2>
              <ul className="space-y-0.5 pl-2">
                {data.keyHighlights.map((point, idx) => (
                  <li key={idx} className="text-[10px] flex gap-1" style={{ color: T.color.textBody }}>
                    <span className="font-bold flex-shrink-0" style={{ color: T.color.textFaint }}>•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.experience?.length > 0 && (
            <div className={getBlurClass('heavy')}>
              <h2 className="text-[10px] font-bold uppercase tracking-widest mb-2 pb-0.5 border-b-2" style={{ borderColor: T.color.accent, color: T.color.textPrimary }}>
                Work Experience
              </h2>
              <div className="space-y-3">
                {groupExperience(data.experience).map((group, gIdx) => (
                  <div key={gIdx}>
                    {group.isSingleRole ? (
                      <>
                        <div className="flex justify-between items-start flex-wrap gap-1">
                          <div>
                            <p className="font-bold text-[11px]" style={{ color: T.color.textPrimary }}>{group.company}</p>
                            <p className="text-[10px] font-semibold" style={{ color: T.color.textSecondary }}>{group.positions[0].role}</p>
                          </div>
                          <p className="text-[9px] bg-gray-100 px-1.5 py-0.5 rounded" style={{ color: T.color.textMuted }}>
                            {group.positions[0].start}{group.positions[0].end ? ` – ${group.positions[0].end}` : ' – Present'}
                          </p>
                        </div>
                        <ul className="mt-1 space-y-0.5 pl-2">
                          {getBullets(group.positions[0]).map((bullet, i) => (
                            <li key={i} className="text-[10px] flex gap-1" style={{ color: T.color.textBody }}>
                              <span className="font-bold flex-shrink-0" style={{ color: T.color.textFaint }}>•</span>
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-start flex-wrap gap-1">
                          <p className="font-bold text-[11px]" style={{ color: T.color.textPrimary }}>{group.company}</p>
                          <p className="text-[9px] bg-gray-100 px-1.5 py-0.5 rounded" style={{ color: T.color.textMuted }}>
                            {group.overallStart}{group.overallEnd ? ` – ${group.overallEnd}` : ' – Present'}
                          </p>
                        </div>
                        <div className="mt-1 space-y-2 pl-3 border-l-2" style={{ borderColor: T.color.borderLight }}>
                          {group.positions.map((pos, pIdx) => (
                            <div key={pIdx}>
                              <div className="flex justify-between items-start flex-wrap gap-1">
                                <p className="text-[10px] font-semibold" style={{ color: T.color.textSecondary }}>{pos.role}</p>
                                <p className="text-[9px]" style={{ color: T.color.textMuted }}>{pos.start}{pos.end ? ` – ${pos.end}` : ' – Present'}</p>
                              </div>
                              {getBullets(pos).length > 0 && (
                                <ul className="mt-0.5 space-y-0.5 pl-1">
                                  {getBullets(pos).map((bullet, i) => (
                                    <li key={i} className="text-[10px] flex gap-1" style={{ color: T.color.textBody }}>
                                      <span className="font-bold flex-shrink-0" style={{ color: T.color.textFaint }}>•</span>
                                      <span>{bullet}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {moveRight.has('awards') && data.awards?.length > 0 && (
            <div className={getBlurClass('heavy')}>
              <h2 className="text-[10px] font-bold uppercase tracking-widest mb-1 pb-0.5 border-b-2" style={{ borderColor: T.color.accent, color: T.color.textPrimary }}>
                Awards & Recognition
              </h2>
              <div className="space-y-1">
                {data.awards.map((award, idx) => (
                  <div key={idx} className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: T.color.accent }} />
                    <p className="text-[10px]" style={{ color: T.color.textBody }}>{getAwardText(award)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {moveRight.has('languages') && data.languages?.length > 0 && (
            <div className={getBlurClass('heavy')}>
              <h2 className="text-[10px] font-bold uppercase tracking-widest mb-1 pb-0.5 border-b-2" style={{ borderColor: T.color.accent, color: T.color.textPrimary }}>
                Languages
              </h2>
              <ul className="space-y-0.5">
                {data.languages.map((lang, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 text-[10px]" style={{ color: T.color.textBody }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: T.color.accent }} />
                    {getLangText(lang)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {moveRight.has('certifications') && data.certifications?.length > 0 && (
            <div className={getBlurClass('heavy')}>
              <h2 className="text-[10px] font-bold uppercase tracking-widest mb-1 pb-0.5 border-b-2" style={{ borderColor: T.color.accent, color: T.color.textPrimary }}>
                Certifications
              </h2>
              <div className="space-y-1.5">
                {data.certifications.map((cert, idx) => (
                  <div key={idx} className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full mt-1 flex-shrink-0" style={{ backgroundColor: T.color.accent }} />
                    <div>
                      <p className="font-bold text-[10px]" style={{ color: T.color.textPrimary }}>{cert.name}</p>
                      {(cert.issuingOrganization || cert.issuer || cert.issueDate || cert.year) && (
                        <p className="text-[9px]" style={{ color: T.color.textMuted }}>
                          {[cert.issuingOrganization || cert.issuer, cert.issueDate || cert.year].filter(Boolean).join(' | ')}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.interests?.length > 0 && (
            <div className={getBlurClass('heavy')}>
              <h2 className="text-[10px] font-bold uppercase tracking-widest mb-1 pb-0.5 border-b-2" style={{ borderColor: T.color.accent, color: T.color.textPrimary }}>
                Interests & Hobbies
              </h2>
              <ul className="space-y-0.5">
                {data.interests.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-1.5 text-[10px]" style={{ color: T.color.textBody }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: T.color.accent }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.extraSections?.map((section, sIdx) => (
            section.items?.length > 0 && (
              <div key={sIdx} className={getBlurClass('heavy')}>
                <h2 className="text-[10px] font-bold uppercase tracking-widest mb-1 pb-0.5 border-b-2" style={{ borderColor: T.color.accent, color: T.color.textPrimary }}>
                  {section.title}
                </h2>
                <ul className="space-y-0.5">
                  {section.items.map((item, iIdx) => (
                    <li key={iIdx} className="flex items-center gap-1.5 text-[10px]" style={{ color: T.color.textBody }}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: T.color.accent }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Mini preview — used in TemplateSelector
// ─────────────────────────────────────────────
export function NavyPreview({ data }) {
  const exp = data.experience?.[0]
  const exp2 = data.experience?.[1]
  const edu = data.education?.[0]
  const allSkills = Array.isArray(data.skills)
    ? data.skills
    : [...(data.skills?.technicalSkills || []), ...(data.skills?.softSkills || []), ...(data.skills?.toolsAndTechnologies || [])]
  const coreSkills = data.coreCompetencies?.length > 0 ? data.coreCompetencies : allSkills

  return (
    <div className="h-full bg-white text-[7px] leading-tight overflow-hidden" style={{ fontFamily: T.font.html }}>
      <div className="px-3 py-2 text-center" style={{ backgroundColor: T.color.headerBg }}>
        <div className="font-bold text-[10px] tracking-widest uppercase truncate" style={{ color: T.color.headerText }}>{data.name}</div>
        {(data.headline || data.title) && (
          <div className="text-[8px] font-semibold truncate" style={{ color: T.color.headerSub }}>{data.headline || data.title}</div>
        )}
        <div className="text-[6px] mt-0.5 truncate" style={{ color: T.color.headerSub }}>
          {[[data.phone, data.alternatePhone].filter(Boolean).join(' / '), data.email].filter(Boolean).join(' | ')}
        </div>
      </div>

      <div className="grid grid-cols-5 h-full">
        <div className="col-span-2 p-2 space-y-2 border-r border-gray-200" style={{ backgroundColor: T.color.panelBg }}>
          {data.summary && (
            <div>
              <div className="text-[6px] font-bold uppercase tracking-widest border-b-2 pb-0.5 mb-1" style={{ borderColor: T.color.accent, color: T.color.textPrimary }}>
                Profile Summary
              </div>
              <p className="text-[6px] line-clamp-3" style={{ color: T.color.textBody }}>{data.summary}</p>
            </div>
          )}
          {coreSkills.length > 0 && (
            <div>
              <div className="text-[6px] font-bold uppercase tracking-widest border-b-2 pb-0.5 mb-1" style={{ borderColor: T.color.accent, color: T.color.textPrimary }}>
                Core Competencies
              </div>
              <ul className="space-y-0.5">
                {coreSkills.slice(0, 4).map((s, i) => (
                  <li key={i} className="flex items-center gap-1 text-[6px]" style={{ color: T.color.textBody }}>
                    <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: T.color.accent }} />
                    <span className="truncate">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {edu && (
            <div>
              <div className="text-[6px] font-bold uppercase tracking-widest border-b-2 pb-0.5 mb-1" style={{ borderColor: T.color.accent, color: T.color.textPrimary }}>
                Education
              </div>
              <p className="text-[6px] font-bold truncate" style={{ color: T.color.textPrimary }}>{edu.degree}</p>
              <p className="text-[6px] truncate" style={{ color: T.color.textMuted }}>{edu.institution || edu.school} | {edu.endYear || edu.end || edu.year}</p>
            </div>
          )}
        </div>

        <div className="col-span-3 p-2">
          <div className="text-[6px] font-bold uppercase tracking-widest border-b-2 pb-0.5 mb-1" style={{ borderColor: T.color.accent, color: T.color.textPrimary }}>
            Work Experience
          </div>
          {exp && (
            <div className="mb-2">
              <p className="font-bold text-[7px] truncate" style={{ color: T.color.textPrimary }}>{exp.company}</p>
              <p className="text-[6px] font-semibold truncate" style={{ color: T.color.textSecondary }}>
                {exp.role} | {exp.start}{exp.end ? `–${exp.end}` : '–Present'}
              </p>
              <ul className="mt-0.5 space-y-0.5">
                {exp.description?.slice(0, 2).map((b, i) => (
                  <li key={i} className="text-[6px] flex gap-0.5" style={{ color: T.color.textBody }}>
                    <span className="flex-shrink-0" style={{ color: T.color.textFaint }}>•</span>
                    <span className="line-clamp-1">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {exp2 && (
            <div>
              <p className="font-bold text-[7px] truncate" style={{ color: T.color.textPrimary }}>{exp2.company}</p>
              <p className="text-[6px] truncate" style={{ color: T.color.textSecondary }}>{exp2.role}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
