// components/templates/classic-early-career/index.js
// Template 6 — Classic Early Career
// Identical to Classic Professional except "Profile Summary" is labelled "Career Objective"

import { groupExperience } from '@/lib/utils/groupExperience'
import { TEMPLATE } from '@/lib/theme'

const T = TEMPLATE['classic-early-career']

const getLangText = (lang) => typeof lang === 'string' ? lang : `${lang.language || ''}${lang.proficiency ? ` (${lang.proficiency})` : ''}`
const getAwardText = (award) => typeof award === 'string' ? award : (award.title || '')

// ─────────────────────────────────────────────
// Full template — used in ResumePreview
// ─────────────────────────────────────────────
export function ClassicEarlyCareerTemplate({ data, getBlurClass }) {
  const allSkills = Array.isArray(data.skills)
    ? data.skills
    : [...(data.skills?.technicalSkills || []), ...(data.skills?.softSkills || []), ...(data.skills?.toolsAndTechnologies || [])]
  const address = data.currentAddress || data.address?.full || data.address?.city
    || [data.location?.city, data.location?.state, data.location?.country].filter(Boolean).join(', ')
  const getBullets = (pos) => [...(pos.description || []), ...(pos.achievements || [])]
  return (
    <div className="bg-white h-full text-sm leading-relaxed" style={{ fontFamily: T.font.html }}>
      {/* Header — black background */}
      <div className="text-center pb-4 pt-6 px-8" style={{ backgroundColor: T.color.headerBg }}>
        <h1 className="text-2xl font-bold tracking-wide" style={{ color: T.color.headerText }}>{data.name}</h1>
        <div className="flex items-center justify-center gap-3 text-xs mt-2 flex-wrap" style={{ color: T.color.headerSub }}>
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

      <div className="px-8 py-4 space-y-4">
        {/* Career Objective — only label differs from Classic Professional */}
        {data.summary && (
          <div className={getBlurClass('light')}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: T.color.accent }} />
              <h2 className="text-sm font-bold" style={{ color: T.color.textPrimary }}>Career Objective</h2>
            </div>
            <div className="border-t border-gray-300 pt-2">
              <p className="text-xs leading-relaxed" style={{ color: T.color.textBody }}>{data.summary}</p>
            </div>
          </div>
        )}

        {/* Key Highlights */}
        {data.keyHighlights?.length > 0 && (
          <div className={getBlurClass('light')}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: T.color.accent }} />
              <h2 className="text-sm font-bold" style={{ color: T.color.textPrimary }}>Key Highlights</h2>
            </div>
            <div className="border-t border-gray-300 pt-2">
              <ul className="space-y-0.5">
                {data.keyHighlights.map((point, idx) => (
                  <li key={idx} className="text-xs flex gap-1" style={{ color: T.color.textBody }}>
                    <span style={{ color: T.color.textFaint }}>•</span><span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Professional Experience */}
        {data.experience?.length > 0 && (
          <div className={getBlurClass('heavy')}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: T.color.accent }} />
              <h2 className="text-sm font-bold" style={{ color: T.color.textPrimary }}>Professional Experience</h2>
            </div>
            <div className="border-t border-gray-300 pt-2 space-y-3">
              {groupExperience(data.experience).map((group, gIdx) => (
                <div key={gIdx}>
                  {group.isSingleRole ? (
                    <>
                      <p className="font-bold text-xs" style={{ color: T.color.textPrimary }}>{group.company}</p>
                      <p className="text-xs italic" style={{ color: T.color.textMuted }}>
                        {group.positions[0].role} | {group.positions[0].start}{group.positions[0].end ? ` – ${group.positions[0].end}` : ' – Present'}
                      </p>
                      <ul className="mt-1 space-y-0.5">
                        {getBullets(group.positions[0]).map((bullet, i) => (
                          <li key={i} className="text-xs flex gap-1" style={{ color: T.color.textBody }}>
                            <span style={{ color: T.color.textFaint }}>•</span><span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-baseline gap-2">
                        <p className="font-bold text-xs" style={{ color: T.color.textPrimary }}>{group.company}</p>
                        <p className="text-xs flex-shrink-0" style={{ color: T.color.textMuted }}>{group.overallStart}{group.overallEnd ? ` – ${group.overallEnd}` : ' – Present'}</p>
                      </div>
                      <div className="mt-1 space-y-2 pl-2 border-l border-gray-200">
                        {group.positions.map((pos, pIdx) => (
                          <div key={pIdx}>
                            <p className="text-xs italic" style={{ color: T.color.textSecondary }}>
                              {pos.role} <span style={{ color: T.color.textMuted }}>| {pos.start}{pos.end ? ` – ${pos.end}` : ' – Present'}</span>
                            </p>
                            {getBullets(pos).length > 0 && (
                              <ul className="mt-0.5 space-y-0.5">
                                {getBullets(pos).map((bullet, i) => (
                                  <li key={i} className="text-xs flex gap-1" style={{ color: T.color.textBody }}>
                                    <span style={{ color: T.color.textFaint }}>•</span><span>{bullet}</span>
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

        {/* Education Table */}
        {data.education?.length > 0 && (
          <div className={getBlurClass('heavy')}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: T.color.accent }} />
              <h2 className="text-sm font-bold" style={{ color: T.color.textPrimary }}>Education</h2>
            </div>
            <div className="border-t border-gray-300 pt-2">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr style={{ backgroundColor: T.color.accent, color: T.color.accentText }}>
                    <th className="border border-gray-300 px-2 py-1 text-left">Course</th>
                    <th className="border border-gray-300 px-2 py-1 text-left">University/Board</th>
                    <th className="border border-gray-300 px-2 py-1 text-left">Year</th>
                    <th className="border border-gray-300 px-2 py-1 text-left">%/Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {data.education.map((edu, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="border border-gray-300 px-2 py-1" style={{ color: T.color.textBody }}>{edu.degree}{(edu.fieldOfStudy || edu.field) ? ` (${edu.fieldOfStudy || edu.field})` : ''}</td>
                      <td className="border border-gray-300 px-2 py-1" style={{ color: T.color.textBody }}>{edu.institution || edu.school}</td>
                      <td className="border border-gray-300 px-2 py-1" style={{ color: T.color.textMuted }}>{edu.endYear || edu.end || edu.year}</td>
                      <td className="border border-gray-300 px-2 py-1" style={{ color: T.color.textMuted }}>{edu.grade || edu.percentage || edu.gpa || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Skills */}
        {allSkills.length > 0 && (
          <div className={getBlurClass('heavy')}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: T.color.accent }} />
              <h2 className="text-sm font-bold" style={{ color: T.color.textPrimary }}>Skills</h2>
            </div>
            <div className="border-t border-gray-300 pt-2">
              <ul className="grid grid-cols-2 gap-0.5">
                {allSkills.map((skill, idx) => (
                  <li key={idx} className="text-xs flex gap-1" style={{ color: T.color.textBody }}>
                    <span style={{ color: T.color.textFaint }}>•</span><span className="min-w-0" style={{ overflowWrap: 'anywhere' }}>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages?.length > 0 && (
          <div className={getBlurClass('heavy')}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: T.color.accent }} />
              <h2 className="text-sm font-bold" style={{ color: T.color.textPrimary }}>Languages</h2>
            </div>
            <div className="border-t border-gray-300 pt-2">
              <ul className="grid grid-cols-2 gap-0.5">
                {data.languages.map((lang, idx) => (
                  <li key={idx} className="text-xs flex gap-1" style={{ color: T.color.textBody }}>
                    <span style={{ color: T.color.textFaint }}>•</span><span>{getLangText(lang)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Certifications */}
        {data.certifications?.length > 0 && (
          <div className={getBlurClass('heavy')}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: T.color.accent }} />
              <h2 className="text-sm font-bold" style={{ color: T.color.textPrimary }}>Certifications</h2>
            </div>
            <div className="border-t border-gray-300 pt-2 space-y-1">
              {data.certifications.map((cert, idx) => (
                <div key={idx}>
                  <p className="text-xs font-semibold" style={{ color: T.color.textPrimary }}>{cert.name}</p>
                  {(cert.issuingOrganization || cert.issuer || cert.issueDate || cert.year) && (
                    <p className="text-xs" style={{ color: T.color.textMuted }}>
                      {[cert.issuingOrganization || cert.issuer, cert.issueDate || cert.year].filter(Boolean).join(' | ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Awards & Recognition */}
        {data.awards?.length > 0 && (
          <div className={getBlurClass('heavy')}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: T.color.accent }} />
              <h2 className="text-sm font-bold" style={{ color: T.color.textPrimary }}>Awards & Recognition</h2>
            </div>
            <div className="border-t border-gray-300 pt-2">
              <ul className="space-y-0.5">
                {data.awards.map((award, idx) => (
                  <li key={idx} className="text-xs flex gap-1" style={{ color: T.color.textBody }}>
                    <span style={{ color: T.color.textFaint }}>•</span><span>{getAwardText(award)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Interests & Hobbies */}
        {data.interests?.length > 0 && (
          <div className={getBlurClass('heavy')}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: T.color.accent }} />
              <h2 className="text-sm font-bold" style={{ color: T.color.textPrimary }}>Interests & Hobbies</h2>
            </div>
            <div className="border-t border-gray-300 pt-2">
              <ul className="grid grid-cols-2 gap-0.5">
                {data.interests.map((item, idx) => (
                  <li key={idx} className="text-xs flex gap-1" style={{ color: T.color.textBody }}>
                    <span style={{ color: T.color.textFaint }}>•</span><span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Dynamic extra sections */}
        {data.extraSections?.map((section, sIdx) => (
          section.items?.length > 0 && (
            <div key={sIdx} className={getBlurClass('heavy')}>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: T.color.accent }} />
                <h2 className="text-sm font-bold" style={{ color: T.color.textPrimary }}>{section.title}</h2>
              </div>
              <div className="border-t border-gray-300 pt-2">
                <ul className="space-y-0.5">
                  {section.items.map((item, iIdx) => (
                    <li key={iIdx} className="text-xs flex gap-1" style={{ color: T.color.textBody }}>
                      <span style={{ color: T.color.textFaint }}>•</span><span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Mini preview — used in TemplateSelector
// ─────────────────────────────────────────────
export function EarlyCareerPreview({ data }) {
  const exp = data.experience?.[0]
  const edu = data.education?.slice(0, 2) || []
  const allSkills = Array.isArray(data.skills)
    ? data.skills
    : [...(data.skills?.technicalSkills || []), ...(data.skills?.softSkills || []), ...(data.skills?.toolsAndTechnologies || [])]
  const locationStr = data.currentAddress || data.address?.full || data.address?.city
    || [data.location?.city, data.location?.state, data.location?.country].filter(Boolean).join(', ')
    || (typeof data.location === 'string' ? data.location : '')

  return (
    <div className="h-full bg-white p-3 text-[8px] leading-tight overflow-hidden" style={{ fontFamily: T.font.html }}>
      <div className="text-center pb-1.5 mb-2" style={{ backgroundColor: T.color.headerBg }}>
        <div className="font-bold text-[11px] truncate pt-1.5 px-2" style={{ color: T.color.headerText }}>{data.name}</div>
        <div className="text-[7px] truncate pb-1.5 px-2" style={{ color: T.color.headerSub }}>
          {[[data.phone, data.alternatePhone].filter(Boolean).join(' / '), data.email, locationStr].filter(Boolean).join(' | ')}
        </div>
      </div>

      {data.summary && (
        <div className="mb-2">
          <div className="flex items-center gap-1 mb-0.5">
            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: T.color.accent }} />
            <span className="font-bold text-[7px]" style={{ color: T.color.textPrimary }}>Career Objective</span>
          </div>
          <div className="w-full border-t border-gray-300 mb-0.5" />
          <p className="text-[7px] leading-snug line-clamp-2" style={{ color: T.color.textBody }}>{data.summary}</p>
        </div>
      )}

      {exp && (
        <div className="mb-2">
          <div className="flex items-center gap-1 mb-0.5">
            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: T.color.accent }} />
            <span className="font-bold text-[7px]" style={{ color: T.color.textPrimary }}>Professional Experience</span>
          </div>
          <div className="w-full border-t border-gray-300 mb-0.5" />
          <p className="font-bold text-[7px] truncate" style={{ color: T.color.textPrimary }}>{exp.company}</p>
          <p className="italic text-[7px] truncate" style={{ color: T.color.textMuted }}>
            {exp.role} | {exp.start}{exp.end ? ` – ${exp.end}` : ' – Present'}
          </p>
          {exp.description?.[0] && (
            <p className="text-[7px] truncate" style={{ color: T.color.textBody }}>• {exp.description[0]}</p>
          )}
        </div>
      )}

      {edu.length > 0 && (
        <div className="mb-2">
          <div className="flex items-center gap-1 mb-0.5">
            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: T.color.accent }} />
            <span className="font-bold text-[7px]" style={{ color: T.color.textPrimary }}>Education</span>
          </div>
          <div className="w-full border-t border-gray-300 mb-0.5" />
          <table className="w-full text-[6px] border-collapse">
            <thead>
              <tr style={{ backgroundColor: T.color.accent, color: T.color.accentText }}>
                <th className="border border-gray-300 px-1 py-0.5 text-left">Course</th>
                <th className="border border-gray-300 px-1 py-0.5 text-left">University</th>
                <th className="border border-gray-300 px-1 py-0.5">Year</th>
              </tr>
            </thead>
            <tbody>
              {edu.map((e, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-300 px-1 py-0.5 truncate max-w-[60px]" style={{ color: T.color.textBody }}>{e.degree}</td>
                  <td className="border border-gray-300 px-1 py-0.5 truncate max-w-[70px]" style={{ color: T.color.textBody }}>{e.institution || e.school}</td>
                  <td className="border border-gray-300 px-1 py-0.5 text-center" style={{ color: T.color.textMuted }}>{e.endYear || e.end || e.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {allSkills.length > 0 && (
        <div>
          <div className="flex items-center gap-1 mb-0.5">
            <div className="w-2 h-2 rounded-sm flex-shrink-0" style={{ backgroundColor: T.color.accent }} />
            <span className="font-bold text-[7px]" style={{ color: T.color.textPrimary }}>Skills</span>
          </div>
          <div className="w-full border-t border-gray-300 mb-0.5" />
          <div className="flex flex-wrap gap-x-2 gap-y-0.5">
            {allSkills.slice(0, 5).map((s, i) => (
              <span key={i} className="text-[6px]" style={{ color: T.color.textBody }}>• {s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
