// this is components/TemplateSelector.js
'use client'

import { useState, useEffect } from 'react'
import { CheckCircle } from 'lucide-react'
import { COLORS } from '@/lib/colors'
import { useRouter, useSearchParams } from 'next/navigation'
import { resumeStorage } from '@/lib/storage'
import { ClassicPreview } from '@/components/templates/classic-professional'
import { NavyPreview } from '@/components/templates/executive-navy'
import { SerifPreview } from '@/components/templates/minimal-serif'
import { ModernPreview } from '@/components/templates/modern-minimalist'
import { ClassicBoldPreview } from '@/components/templates/classic-bold'
import { EarlyCareerPreview } from '@/components/templates/classic-early-career'
// ─────────────────────────────────────────────
// Fallback sample data shown only if nothing extracted
// ─────────────────────────────────────────────
const SAMPLE_DATA = {
  name: 'Your Name',
  title: 'Your Job Title',
  email: 'your@email.com',
  phone: '+91 00000 00000',
  location: 'City, India',
  summary: 'Your professional summary will appear here, highlighting your key skills and years of experience...',
  experience: [
    {
      company: 'Your Company Name',
      role: 'Your Role',
      start: '2021',
      end: null,
      description: ['Your key achievement and responsibility will appear here'],
    },
    {
      company: 'Previous Company',
      role: 'Previous Role',
      start: '2018',
      end: '2021',
      description: ['Another achievement will show here'],
    },
  ],
  skills: ['Skill One', 'Skill Two', 'Skill Three', 'Skill Four', 'Skill Five'],
  education: [
    { degree: 'Your Degree', institution: 'Your University', end: '2018' },
    { degree: 'Previous Degree', institution: 'Your College', end: '2015' },
  ],
}

// ─────────────────────────────────────────────
// Main TemplateSelector Component
// ─────────────────────────────────────────────
export default function TemplateSelector() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('id')
  const [resumeData, setResumeData] = useState(SAMPLE_DATA)
  const [dataLoaded, setDataLoaded] = useState(false)

  useEffect(() => {
    if (!sessionId) return
    const stored = resumeStorage.getResumeData(sessionId)
    if (stored?.data) {
      setResumeData(stored.data)
      setDataLoaded(true)
    }
  }, [sessionId])

  // Trap browser back button — go to landing instead of processing
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const handleBack = () => window.location.replace('/')
    window.addEventListener('popstate', handleBack)
    return () => window.removeEventListener('popstate', handleBack)
  }, [])

  const handleSelectTemplate = (templateId) => {
    if (sessionId) {
      router.push(`/?id=${sessionId}&template=${templateId}`)
    }
  }

  const templates = [
    {
      id: 1,
      name: 'Corporate Standard',
      description: ' Clean and structured format trusted by recruiters — ideal for BFSI, insurance, and corporate roles.',
      preview: <ClassicPreview data={resumeData} />,
    },
    {
      id: 2,
      name: 'Senior Leadership',
      description: 'Designed for experienced professionals — highlights leadership, achievements, and decision-making roles.',
      preview: <NavyPreview data={resumeData} />,
    },
    {
      id: 3,
      name: 'Modern Corporate',
      description: 'Sleek and modern design — perfect for professionals in sales, operations, and growth roles.',
      preview: <SerifPreview data={resumeData} />,
    },
    {
      id: 4,
      name: ' Startup & Tech',
      description: 'Contemporary layout built for startups, tech, and fast-growing companies.',
      preview: <ModernPreview data={resumeData} />,
    },
    {
      id: 5,
      name: 'Impact Resume',
      description: 'Strong headings and bold structure — makes your experience stand out instantly.',
      preview: <ClassicBoldPreview data={resumeData} />,
    },
    {
      id: 6,
      name: 'Classic Early Career',
      description: ' Simple and effective format for freshers and early-career professionals.',
      preview: <EarlyCareerPreview data={resumeData} />,
    },
  ]

  return (
    <div className="px-6 py-12 md:py-20 animate-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2" style={{ color: COLORS.blue }}>
          Choose Your Template
        </h2>

        {dataLoaded ? (
          <p className="text-center text-sm font-semibold mb-1" style={{ color: COLORS.green }}>
            ✓ Showing live preview with <span className="font-bold">{resumeData.name}</span>'s extracted data
          </p>
        ) : (
          <p className="text-center text-sm text-slate-400 mb-1">
            Loading your extracted data into previews…
          </p>
        )}

        <p className="text-center mb-12 text-base md:text-lg text-slate-500">
All templates are ATS-friendly. Choose based on your role, experience level, and the type of impression you want to create.        </p>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => handleSelectTemplate(template.id)}
              className="group cursor-pointer transition-all duration-300 hover:scale-105"
            >
              <div
                className="rounded-2xl overflow-hidden border-2 shadow-md hover:shadow-2xl transition-all h-full flex flex-col"
                style={{ borderColor: COLORS.border }}
              >
                {/* Live Preview */}
                <div className="h-72 bg-gray-50 overflow-hidden relative border-b border-gray-100">
                  {template.preview}
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col bg-white">
                  <h3 className="font-bold text-lg mb-2" style={{ color: COLORS.blue }}>
                    {template.name}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4 flex-1">{template.description}</p>
                  <button
                    className="w-full py-3 rounded-xl text-white font-bold transition-all hover:scale-105 active:scale-95"
                    style={{ backgroundColor: COLORS.green }}
                  >
                    Select Template
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        {/* Added 'select-none' to prevent text selection */}
<div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 md:p-8 select-none" 
     onCopy={(e) => e.preventDefault()}> 
  <div className="flex gap-4">
    <CheckCircle size={24} className="text-blue-600 flex-shrink-0 mt-0.5" />
    <div>
      <p className="font-bold text-blue-900 mb-2">How this works:</p>
      <p className="text-blue-800 text-sm">
        Select a template to see your resume transformed into a clean, professional format. 
        Download it instantly or take it one step further with AI optimization to make it impactful.
      </p>
    </div>
  </div>
</div>
      </div>
    </div>
  )
}
