// this is components/BeforeAfter.js
'use client'

import { useRef, useState, useEffect } from 'react'

// Natural design width: before(400) + gap(32) + arrow(48) + gap(32) + after(420) = 932
const DESIGN_W = 932

// Fake text line placeholder (blurred content effect)
function FL({ w = 45 }) {
  return (
    <span
      style={{
        display: 'inline-block',
        height: '6px',
        width: `${w}px`,
        backgroundColor: '#e2e8f0',
        borderRadius: '9999px',
        verticalAlign: 'middle',
        marginLeft: '8px',
      }}
    />
  )
}

// ─── BEFORE card ─────────────────────────────────────────────────────────────
function BeforeCard() {
  return (
    <div className="relative w-full max-w-[400px] pt-5 shrink-0">
      {/* Floating BEFORE label */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 z-10 text-white font-bold tracking-widest px-10 py-2.5 rounded-xl text-[15px] shadow-sm"
        style={{ backgroundColor: '#59626C' }}
      >
        BEFORE
      </div>

      {/* Outer container */}
      <div
        className="rounded-2xl p-3 pt-10 h-[680px]"
        style={{ backgroundColor: '#DFE3E7', boxShadow: '0 8px 30px rgb(0,0,0,0.06)' }}
      >
        {/* Inner white card */}
        <div className="bg-white rounded-xl p-7 shadow-sm h-full text-[#1F2937] flex flex-col">

          {/* Header */}
          <div className="text-center mb-3 mt-2">
            <h1 className="font-bold text-[22px] tracking-wide text-black">AJAY DUGGAR</h1>
            <p className="text-[11px] mt-1.5" style={{ color: '#4B5563' }}>
              Email:ajay@email.com | Phone: (123) 456-7890
            </p>
          </div>

          <div className="border-t-[1.5px] border-[#E5E7EB] w-full my-4" />

          {/* Career Objective */}
          <div className="mb-5 mt-1">
            <h2 className="font-bold text-[14px] mb-2 text-black">CAREER OBJECTIVE</h2>
            <p className="text-[12px] leading-[1.6]" style={{ color: '#374151' }}>
              Experienced professional seeking a challenging job opportunity in a reputed company to grow and utilize my skills.
            </p>
          </div>

          {/* Work Experience */}
          <div className="mb-5">
            <h2 className="font-bold text-[14px] mb-3 text-black">WORK EXPERIENCE</h2>

            {/* Job 1 */}
            <div className="mb-4">
              <div className="flex justify-between items-center w-full mb-1">
                <span className="font-bold text-[13px] text-black">Job Title, Company A</span>
                <span className="text-[12px]" style={{ color: '#374151' }}>2018 - 2020</span>
              </div>
              <ul className="list-disc ml-5 space-y-1 mt-1.5">
                <li className="text-[12px]" style={{ color: '#374151' }}>Responsible for managing tasks<FL w={45} /></li>
                <li className="text-[12px]" style={{ color: '#374151' }}>Worked on various projects<FL w={65} /></li>
                <li className="text-[12px]" style={{ color: '#374151' }}>Team collaboration<FL w={35} /></li>
              </ul>
            </div>

            {/* Job 2 */}
            <div className="mb-2">
              <div className="flex justify-between items-center w-full mb-1 mt-3">
                <span className="font-bold text-[13px] text-black">Job Title, Company B</span>
                <span className="text-[12px]" style={{ color: '#374151' }}>2020 - Present</span>
              </div>
              <ul className="list-disc ml-5 space-y-1 mt-1.5">
                <li className="text-[12px]" style={{ color: '#374151' }}>Did multiple tasks<FL w={100} /></li>
                <li className="text-[12px]" style={{ color: '#374151' }}>Project coordination<FL w={45} /></li>
                <li className="text-[12px]" style={{ color: '#374151' }}>Achieved targets<FL w={55} /></li>
              </ul>
            </div>
          </div>

          {/* Education */}
          <div className="mb-5 mt-2">
            <h2 className="font-bold text-[14px] mb-3 text-black">EDUCATION</h2>
            <div className="flex justify-between items-center w-full">
              <span className="font-bold text-[13px] text-black">Degree, University Name</span>
              <span className="text-[12px]" style={{ color: '#374151' }}>2014 - 2018</span>
            </div>
          </div>

          {/* Skills */}
          <div className="mt-auto mb-2">
            <h2 className="font-bold text-[14px] mb-3 text-black flex items-center">
              SKILLS <FL w={65} />
            </h2>
            <ul className="list-disc ml-5 space-y-1">
              <li className="text-[12px]" style={{ color: '#374151' }}>
                Managing, Teamwork, MS Office, Communication
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  )
}

// ─── AFTER card ──────────────────────────────────────────────────────────────
function AfterCard() {
  return (
    <div className="relative w-full max-w-[420px] pt-5 shrink-0">
      {/* Floating AFTER label */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 z-10 text-white font-bold tracking-widest px-14 py-2.5 rounded-xl text-[15px]"
        style={{
          backgroundColor: '#15B965',
          boxShadow: '0 0 25px 12px rgba(255,255,255,1), 0 12px 25px -5px rgba(100,116,139,0.5)',
        }}
      >
        AFTER
      </div>

      {/* Outer container with gradient */}
      <div
        className="rounded-2xl p-3 pt-10 h-[680px] relative"
        style={{
          background: 'linear-gradient(to bottom, #15B965, #A6E7C4, #ffffff)',
          boxShadow: '0 15px 40px rgb(21,185,101,0.2)',
        }}
      >
        {/* Inner white card */}
        <div className="bg-white rounded-xl p-7 shadow-sm h-full text-[#111827] flex flex-col relative overflow-hidden">

          {/* Header */}
          <div className="text-center mb-3 mt-1">
            <h1 className="font-extrabold text-[24px] tracking-wide">AJAY DUGGAR</h1>
            <p className="text-[15px] font-semibold mt-0.5" style={{ color: '#15B965' }}>Software Engineer</p>

            {/* Contact */}
            <div className="flex items-center justify-center gap-2 mt-2 text-[10px] font-medium" style={{ color: '#4B5563' }}>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" style={{ color: '#15B965' }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
               ajay@email.com
              </span>
              <span style={{ color: '#D1D5DB' }}>|</span>
              <span className="text-[11px]">(123) 456-7890</span>
              <span style={{ color: '#D1D5DB' }}>|</span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" style={{ color: '#15B965' }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                LinkedIn
              </span>
            </div>
          </div>

          <div className="border-t border-[#E5E7EB] w-full my-3" />

          {/* Professional Summary */}
          <div className="mb-4 mt-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="font-extrabold text-[13px] tracking-wide">PROFESSIONAL SUMMARY</h2>
              <div className="h-1 rounded-full flex-grow max-w-[60px]" style={{ backgroundColor: '#15B965' }} />
            </div>
            <ul className="space-y-1.5 mt-2">
              <li className="flex items-start gap-2">
                <span className="w-[5px] h-[5px] rounded-full shrink-0 mt-[7px]" style={{ backgroundColor: '#4B5563' }} />
                <span className="text-[12.5px] font-medium">5+ years of experience in software development</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-[5px] h-[5px] rounded-full shrink-0 mt-[7px]" style={{ backgroundColor: '#4B5563' }} />
                <span className="text-[12.5px] font-medium">Expert in Python, Java, and AI Solutions</span>
              </li>
            </ul>
          </div>

          {/* Work Experience */}
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="font-extrabold text-[13px] tracking-wide">WORK EXPERIENCE</h2>
              <div className="h-1 rounded-full flex-grow max-w-[105px]" style={{ backgroundColor: '#15B965' }} />
            </div>

            {/* Job 1 */}
            <div className="mb-1 mt-4">
              <div className="flex justify-between items-center w-full mb-0.5">
                <span className="font-extrabold text-[13.5px]">Software Developer <FL w={30} /></span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: '#E6F5EC', color: '#15B965' }}>2020 - Present</span>
              </div>
              <div className="text-[13.5px] mb-1.5 font-medium" style={{ color: '#4B5563' }}>
                Company B<FL w={45} />
              </div>
              <ul className="space-y-1.5 mt-2">
                <li className="flex items-center gap-2">
                  <span className="w-[5px] h-[5px] rounded-full shrink-0" style={{ backgroundColor: '#4B5563' }} />
                  <span className="text-[12.5px] font-medium">Developed 10+ projects <FL w={45} /></span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-[5px] h-[5px] rounded-full shrink-0" style={{ backgroundColor: '#15B965' }} />
                  <span className="text-[12.5px] font-bold" style={{ color: '#15B965' }}>Achieved 98% project success</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="ml-1 shrink-0 -rotate-45">
                    <path d="M2 12h18M14 6l6 6-6 6" stroke="#15B965" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </li>
              </ul>
            </div>

            {/* Job 2 */}
            <div className="mb-4">
              <div className="flex justify-between items-center w-full mb-0.5">
                <span className="font-extrabold text-[13.5px]">Senior Software Engineer</span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: '#E6F5EC', color: '#15B965' }}>2018 - 2020</span>
              </div>
              <div className="text-[13.5px] mb-1.5 font-medium" style={{ color: '#4B5563' }}>
                Company A <FL w={45} /><br />
                <FL w={65} />
              </div>
              <ul className="space-y-1.5 mt-2">
                <li className="flex items-center gap-2">
                  <span className="w-[5px] h-[5px] rounded-full shrink-0" style={{ backgroundColor: '#4B5563' }} />
                  <span className="text-[12.5px] font-medium">Led a team of 5 developers</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#15B965" className="ml-1 shrink-0">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-[5px] h-[5px] rounded-full shrink-0" style={{ backgroundColor: '#15B965' }} />
                  <span className="text-[12.5px] font-bold" style={{ color: '#15B965' }}>Improved efficiency by 25%</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="ml-1 shrink-0 -rotate-45">
                    <path d="M2 12h18M14 6l6 6-6 6" stroke="#15B965" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </li>
              </ul>
            </div>

            
          </div>

          {/* Education */}
          <div className="mb-4 mt-3">
            <div className="flex items-center gap-3 mb-3">
              <h2 className="font-extrabold text-[13px] tracking-wide">EDUCATION</h2>
              <div className="h-1 rounded-full flex-grow max-w-[85px]" style={{ backgroundColor: '#15B965' }} />
            </div>
            <div className="flex justify-between items-center w-full mb-0.5">
              <span className="font-extrabold text-[13.5px]">M.Sc. Computer Science</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded" style={{ backgroundColor: '#E7ECF3', color: '#374151' }}>2014 - 2018</span>
            </div>
            <div className="text-[13.5px] font-medium" style={{ color: '#4B5563' }}>
              University Name <FL w={65} />
            </div>
          </div>

          {/* Key Skills */}
          <div className="mt-auto">
            <h2 className="font-extrabold text-[13px] mb-2 tracking-wide">KEY SKILLS</h2>
            <div className="flex flex-wrap gap-2">
              <span className="text-white px-3 py-1 rounded-[4px] text-[12px] font-bold" style={{ backgroundColor: '#15B965' }}>Python</span>
              <span className="px-3 py-1 rounded-[4px] text-[12px] font-bold" style={{ backgroundColor: '#E8F3ED', color: '#111827' }}>Java</span>
              <span className="px-3 py-1 rounded-[4px] text-[12px] font-bold" style={{ backgroundColor: '#E8F3ED', color: '#111827' }}>AI</span>
              <span className="px-3 py-1 rounded-[4px] text-[12px] font-bold" style={{ backgroundColor: '#E8F3ED', color: '#111827' }}>Leadership</span>
              <span className="px-3 py-1 rounded-[4px] text-[12px] font-bold" style={{ backgroundColor: '#E8F3ED', color: '#111827' }}>AWS</span>
            </div>
          </div>

        </div>

        {/* Floating checkmark badge */}
        <div
          className="absolute z-20 bg-white rounded-full p-1"
          style={{ bottom: '6%', right: '-20px', boxShadow: '0 5px 15px rgba(21,185,101,0.3)' }}
        >
          <div
            className="rounded-full w-[42px] h-[42px] flex items-center justify-center bg-white"
            style={{ border: '3px solid #15B965' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#15B965" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

      </div>
    </div>
  )
}

// ─── Main Export ─────────────────────────────────────────────────────────────
// Fits inside any container — scales the fixed-width design proportionally.
export default function BeforeAfter() {
  const wrapRef = useRef(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    function calcScale() {
      if (!wrapRef.current) return
      const available = wrapRef.current.offsetWidth
      setScale(Math.min(1, available / DESIGN_W))
    }
    calcScale()
    window.addEventListener('resize', calcScale)
    return () => window.removeEventListener('resize', calcScale)
  }, [])

  // Natural height of cards including top label overflow (680 card + 20 label overhang)
  const NATURAL_H = 700

  return (
    // Outer ref div — measures available width
    <div ref={wrapRef} className="w-full overflow-hidden">
      {/* Height spacer so the parent doesn't collapse */}
      <div style={{ height: NATURAL_H * scale, position: 'relative' }}>
        {/* Fixed-size inner, scaled from top-left */}
        <div
          style={{
            width: DESIGN_W,
            transformOrigin: 'top left',
            transform: `scale(${scale})`,
            position: 'absolute',
            top: 0,
            left: 0,
          }}
          className="flex flex-row items-center gap-8"
        >
          <BeforeCard />

          {/* Arrow */}
          <div className="shrink-0 -mx-2">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="#15B965" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 10.5h11v-4l8 5.5-8 5.5v-4H3z" />
            </svg>
          </div>

          <AfterCard />
        </div>
      </div>
    </div>
  )
}
