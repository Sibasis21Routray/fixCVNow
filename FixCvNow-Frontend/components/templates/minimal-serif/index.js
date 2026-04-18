// components/templates/minimal-serif/index.js
//Modern Corporate frontend
import { groupExperience } from '@/lib/utils/groupExperience'
import { TEMPLATE } from '@/lib/theme'

const T = TEMPLATE['minimal-serif']

const getLangText = (lang) => typeof lang === 'string' ? lang : `${lang.language || ''}${lang.proficiency ? ` (${lang.proficiency})` : ''}`
const getAwardText = (award) => typeof award === 'string' ? award : (award.title || '')

// ─────────────────────────────────────────────
// Full template — used in ResumePreview
// ─────────────────────────────────────────────
export function MinimalSerifTemplate({ data, getBlurClass }) {
  const allSkills = Array.isArray(data.skills)
    ? data.skills
    : [...(data.skills?.technicalSkills || []), ...(data.skills?.softSkills || []), ...(data.skills?.toolsAndTechnologies || [])]
  const address = data.currentAddress || data.address?.full || data.address?.city
    || [data.location?.city, data.location?.state, data.location?.country].filter(Boolean).join(', ')
  const getBullets = (pos) => [...(pos.description || []), ...(pos.achievements || [])]

  // Column balance: move sections from left → right if left is significantly taller
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
    <div className="bg-white h-full text-xs leading-relaxed" style={{ fontFamily: T.font.html }}>
      {/* Header — black background, centered */}
      <div className="px-8 py-5 text-center" style={{ backgroundColor: T.color.headerBg }}>
        <div>
          <h1 className="text-2xl font-bold uppercase text-center" style={{ letterSpacing: '0.1em', color: T.color.headerText }}>
            {data.name}
          </h1>
          {(() => { const h = data.headline || data.title; return h && h.trim().replace(/\//g,'').trim() ? <p className="text-sm mt-0.5 italic text-center" style={{ color: T.color.headerSub }}>{h}</p> : null })()}
        </div>
        <div className="mt-3 text-[10px] space-y-0.5" style={{ color: T.color.headerSub }}>
          {data.phone && <div className="flex items-center gap-1 justify-center"><span className="font-semibold">Ph.</span><span>{data.phone}{data.alternatePhone ? ` / ${data.alternatePhone}` : ''}</span></div>}
          {data.email && <div className="flex items-center gap-1 justify-center"><span className="font-semibold">Email</span><span>{data.email}</span></div>}
          {address && <div className="flex items-center gap-1 justify-center"><span className="font-semibold">Addr.</span><span>{address}</span></div>}
          {data.nationality && <div className="flex items-center gap-1 justify-center"><span className="font-semibold">Nationality:</span><span>{data.nationality}</span></div>}
          {data.dateOfBirth && <div className="flex items-center gap-1 justify-center"><span className="font-semibold">DOB:</span><span>{data.dateOfBirth}</span></div>}
          {data.socialLinks?.map((link, idx) => (
            <div key={idx} className="flex items-center gap-1 justify-center">
              <span className="font-semibold">{link.label}:</span><span>{link.url}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      {data.summary && (
        <div className={`px-8 py-3 border-b border-gray-200 ${getBlurClass('light')}`}>
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-center mb-2" style={{ color: T.color.textPrimary }}>Summary</h2>
          <p className="text-[10px] leading-relaxed text-center max-w-2xl mx-auto" style={{ color: T.color.textBody }}>{data.summary}</p>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="flex">
        {/* Left */}
        <div className="px-6 py-4 space-y-4 border-r border-gray-200" style={{ width: '35%' }}>
          {data.education?.length > 0 && (
            <div className={getBlurClass('heavy')}>
              <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-2" style={{ color: T.color.textPrimary }}>Education</h2>
              <div className="space-y-2">
                {data.education.map((edu, idx) => (
                  <div key={idx}>
                    <p className="font-bold text-[10px]" style={{ color: T.color.textPrimary }}>{edu.degree}{(edu.fieldOfStudy || edu.field) ? ` — ${edu.fieldOfStudy || edu.field}` : ''}</p>
                    <p className="text-[10px]" style={{ color: T.color.textSecondary }}>{edu.institution || edu.school}</p>
                    <p className="text-[9px]" style={{ color: T.color.textMuted }}>{(edu.startYear || edu.start) ? `${edu.startYear || edu.start} – ` : ''}{edu.endYear || edu.end || edu.year}{(edu.grade || edu.percentage || edu.gpa) ? ` | ${edu.grade || edu.percentage || edu.gpa}` : ''}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {allSkills.length > 0 && (
            <div className={getBlurClass('heavy')}>
              <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-2" style={{ color: T.color.textPrimary }}>Skills</h2>
              <ul className="space-y-1">
                {allSkills.map((skill, idx) => (
                  <li key={idx} className="text-[10px] flex gap-1.5 items-start" style={{ color: T.color.textBody }}>
                    <span className="flex-shrink-0" style={{ color: T.color.textFaint }}>•</span>
                    <span className="min-w-0" style={{ overflowWrap: 'anywhere' }}>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!moveRight.has('languages') && data.languages?.length > 0 && (
            <div className={getBlurClass('heavy')}>
              <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-2" style={{ color: T.color.textPrimary }}>Languages</h2>
              <ul className="space-y-1">
                {data.languages.map((lang, idx) => (
                  <li key={idx} className="text-[10px] flex gap-1.5 items-start" style={{ color: T.color.textBody }}>
                    <span className="flex-shrink-0" style={{ color: T.color.textFaint }}>•</span>{getLangText(lang)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!moveRight.has('awards') && data.awards?.length > 0 && (
            <div className={getBlurClass('heavy')}>
              <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-2" style={{ color: T.color.textPrimary }}>Awards & Recognition</h2>
              <ul className="space-y-1">
                {data.awards.map((award, idx) => (
                  <li key={idx} className="text-[10px] flex gap-1.5 items-start" style={{ color: T.color.textBody }}>
                    <span className="flex-shrink-0" style={{ color: T.color.textFaint }}>•</span>{getAwardText(award)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="px-6 py-4 space-y-4" style={{ flex: 1 }}>
          {data.keyHighlights?.length > 0 && (
            <div className={getBlurClass('light')}>
              <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-2" style={{ color: T.color.textPrimary }}>Key Highlights</h2>
              <ul className="space-y-1">
                {data.keyHighlights.map((point, idx) => (
                  <li key={idx} className="text-[10px] flex gap-1.5 items-start" style={{ color: T.color.textBody }}>
                    <span className="flex-shrink-0" style={{ color: T.color.textFaint }}>•</span><span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.experience?.length > 0 && (
            <div className={getBlurClass('heavy')}>
              <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-2" style={{ color: T.color.textPrimary }}>
                Professional Experience
              </h2>
              <div className="space-y-3">
                {groupExperience(data.experience).map((group, gIdx) => (
                  <div key={gIdx}>
                    {group.isSingleRole ? (
                      <>
                        <p className="font-bold text-[11px] uppercase" style={{ color: T.color.textPrimary }}>{group.company}</p>
                        <div className="flex justify-between items-start gap-2 flex-wrap">
                          <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: T.color.textSecondary }}>{group.positions[0].role}</p>
                          <p className="text-[9px]" style={{ color: T.color.textMuted }}>
                            {group.positions[0].start}{group.positions[0].end ? ` - ${group.positions[0].end}` : ' - Present'}
                          </p>
                        </div>
                        <ul className="mt-1 space-y-0.5 pl-2">
                          {getBullets(group.positions[0]).map((bullet, i) => (
                            <li key={i} className="text-[10px] flex gap-1" style={{ color: T.color.textBody }}>
                              <span className="flex-shrink-0" style={{ color: T.color.textFaint }}>•</span><span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between items-baseline gap-2">
                          <p className="font-bold text-[11px] uppercase" style={{ color: T.color.textPrimary }}>{group.company}</p>
                          <p className="text-[9px] flex-shrink-0" style={{ color: T.color.textMuted }}>
                            {group.overallStart}{group.overallEnd ? ` - ${group.overallEnd}` : ' - Present'}
                          </p>
                        </div>
                        <div className="mt-1 space-y-2 pl-3 border-l border-gray-300">
                          {group.positions.map((pos, pIdx) => (
                            <div key={pIdx}>
                              <div className="flex justify-between items-start gap-2 flex-wrap">
                                <p className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: T.color.textSecondary }}>{pos.role}</p>
                                <p className="text-[9px] flex-shrink-0" style={{ color: T.color.textMuted }}>
                                  {pos.start}{pos.end ? ` - ${pos.end}` : ' - Present'}
                                </p>
                              </div>
                              {getBullets(pos).length > 0 && (
                                <ul className="mt-0.5 space-y-0.5 pl-2">
                                  {getBullets(pos).map((bullet, i) => (
                                    <li key={i} className="text-[10px] flex gap-1" style={{ color: T.color.textBody }}>
                                      <span className="flex-shrink-0" style={{ color: T.color.textFaint }}>•</span><span>{bullet}</span>
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

          {data.certifications?.length > 0 && (
            <div className={getBlurClass('heavy')}>
              <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-2" style={{ color: T.color.textPrimary }}>
                Certifications
              </h2>
              <div className="space-y-2">
                {data.certifications.map((cert, idx) => (
                  <div key={idx}>
                    <p className="font-bold text-[10px]" style={{ color: T.color.textPrimary }}>{cert.name}</p>
                    {(cert.issuingOrganization || cert.issuer || cert.issueDate || cert.year) && (
                      <p className="text-[9px]" style={{ color: T.color.textMuted }}>
                        {[cert.issuingOrganization || cert.issuer, cert.issueDate || cert.year].filter(Boolean).join(' | ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {moveRight.has('awards') && data.awards?.length > 0 && (
            <div className={getBlurClass('heavy')}>
              <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-2" style={{ color: T.color.textPrimary }}>Awards & Recognition</h2>
              <ul className="space-y-1">
                {data.awards.map((award, idx) => (
                  <li key={idx} className="text-[10px] flex gap-1.5 items-start" style={{ color: T.color.textBody }}>
                    <span className="flex-shrink-0" style={{ color: T.color.textFaint }}>•</span>{getAwardText(award)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {moveRight.has('languages') && data.languages?.length > 0 && (
            <div className={getBlurClass('heavy')}>
              <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-2" style={{ color: T.color.textPrimary }}>Languages</h2>
              <ul className="space-y-1">
                {data.languages.map((lang, idx) => (
                  <li key={idx} className="text-[10px] flex gap-1.5 items-start" style={{ color: T.color.textBody }}>
                    <span className="flex-shrink-0" style={{ color: T.color.textFaint }}>•</span>{getLangText(lang)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.interests?.length > 0 && (
            <div className={getBlurClass('heavy')}>
              <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-2" style={{ color: T.color.textPrimary }}>Interests & Hobbies</h2>
              <ul className="space-y-1">
                {data.interests.map((item, idx) => (
                  <li key={idx} className="text-[10px] flex gap-1.5 items-start" style={{ color: T.color.textBody }}>
                    <span className="flex-shrink-0" style={{ color: T.color.textFaint }}>•</span>{item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.extraSections?.map((section, sIdx) => (
            section.items?.length > 0 && (
              <div key={sIdx} className={getBlurClass('heavy')}>
                <h2 className="text-[11px] font-bold uppercase tracking-widest border-b border-gray-400 pb-1 mb-2" style={{ color: T.color.textPrimary }}>{section.title}</h2>
                <ul className="space-y-1">
                  {section.items.map((item, iIdx) => (
                    <li key={iIdx} className="text-[10px] flex gap-1.5 items-start" style={{ color: T.color.textBody }}>
                      <span className="flex-shrink-0" style={{ color: T.color.textFaint }}>•</span>{item}
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
export function SerifPreview({ data }) {
  const exp = data.experience?.[0]
  const exp2 = data.experience?.[1]
  const edu = data.education?.[0]
  const allSkills = Array.isArray(data.skills)
    ? data.skills
    : [...(data.skills?.technicalSkills || []), ...(data.skills?.softSkills || []), ...(data.skills?.toolsAndTechnologies || [])]

  return (
    <div className="h-full bg-white text-[7px] leading-tight overflow-hidden" style={{ fontFamily: T.font.html }}>
      {/* Header — centered for preview */}
      <div className="px-3 py-2 text-center" style={{ backgroundColor: T.color.headerBg }}>
        <div className="font-bold text-[10px] uppercase truncate" style={{ letterSpacing: '0.08em', color: T.color.headerText }}>
          {data.name}
        </div>
        {(() => { const h = data.headline || data.title; return h && h.trim().replace(/\//g,'').trim() ? <div className="text-[7px] italic truncate" style={{ color: T.color.headerSub }}>{h}</div> : null })()}
        <div className="text-[6px] space-y-0.5 mt-1" style={{ color: T.color.headerSub }}>
          {data.phone && <div>{data.phone}{data.alternatePhone ? ` / ${data.alternatePhone}` : ''}</div>}
          {data.email && <div className="truncate max-w-[90px] mx-auto">{data.email}</div>}
        </div>
      </div>

      {data.summary && (
        <div className="px-3 py-1 border-b border-gray-200 text-center">
          <div className="text-[6px] font-bold uppercase tracking-widest mb-0.5" style={{ color: T.color.textPrimary }}>Summary</div>
          <p className="text-[6px] line-clamp-2" style={{ color: T.color.textBody }}>{data.summary}</p>
        </div>
      )}

      <div className="grid grid-cols-5">
        <div className="col-span-2 px-2 py-2 border-r border-gray-200 space-y-2">
          {edu && (
            <div>
              <div className="text-[6px] font-bold uppercase tracking-widest border-b border-gray-400 pb-0.5 mb-1" style={{ color: T.color.textPrimary }}>Education</div>
              <p className="font-bold text-[6px] truncate" style={{ color: T.color.textPrimary }}>{edu.degree}</p>
              <p className="text-[6px] truncate" style={{ color: T.color.textSecondary }}>{edu.institution || edu.school}</p>
              <p className="text-[6px]" style={{ color: T.color.textMuted }}>{(edu.startYear || edu.start) ? `${edu.startYear || edu.start}–` : ''}{edu.endYear || edu.end || edu.year}</p>
            </div>
          )}
          {allSkills.length > 0 && (
            <div>
              <div className="text-[6px] font-bold uppercase tracking-widest border-b border-gray-400 pb-0.5 mb-1" style={{ color: T.color.textPrimary }}>Skills</div>
              <ul className="space-y-0.5">
                {allSkills.slice(0, 4).map((s, i) => (
                  <li key={i} className="text-[6px] flex gap-0.5" style={{ color: T.color.textBody }}>
                    <span className="flex-shrink-0" style={{ color: T.color.textFaint }}>•</span>
                    <span className="truncate">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="col-span-3 px-2 py-2">
          <div className="text-[6px] font-bold uppercase tracking-widest border-b border-gray-400 pb-0.5 mb-1" style={{ color: T.color.textPrimary }}>Professional Experience</div>
          {exp && (
            <div className="mb-1.5">
              <p className="font-bold text-[7px] uppercase truncate" style={{ color: T.color.textPrimary }}>{exp.company}</p>
              <div className="flex justify-between items-start gap-1 flex-wrap">
                <p className="text-[6px] font-semibold uppercase truncate" style={{ color: T.color.textSecondary }}>{exp.role}</p>
                <p className="text-[6px] flex-shrink-0" style={{ color: T.color.textMuted }}>{exp.start}{exp.end ? `–${exp.end}` : '–Present'}</p>
              </div>
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
              <p className="font-bold text-[7px] uppercase truncate" style={{ color: T.color.textPrimary }}>{exp2.company}</p>
              <p className="text-[6px] truncate" style={{ color: T.color.textSecondary }}>{exp2.role}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}