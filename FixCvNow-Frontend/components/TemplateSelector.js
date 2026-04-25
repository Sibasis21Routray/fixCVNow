// this is components/TemplateSelector.js
'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Loader2 } from 'lucide-react'
import { COLORS } from '@/lib/colors'
import { ResumeOptimizeIcon } from '@/components/asset-icons'
import { useRouter, useSearchParams } from 'next/navigation'
import { resumeStorage } from '@/lib/storage'
import { toast } from '@/hooks/use-toast'
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

  const [pricing, setPricing] = useState({
    download: { final: 99, original: 124, hasOffer: true, discount: 20, expiresAt: new Date(Date.now() + 86400000).toISOString() },
    optimize: { final: 19, original: 24, hasOffer: true, discount: 20, expiresAt: new Date(Date.now() + 86400000).toISOString() }
  })

  // Optimization state
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizingMsgIndex, setOptimizingMsgIndex] = useState(0)

  const OPTIMIZING_MESSAGES = [
    "Generating your AI Career Upgrade...",
    "Improving your profile summary...",
    "Optimizing role descriptions...",
    "Extracting key skills...",
    "Enhancing achievement phrasing...",
    "Adding ATS keywords...",
    "Final polishing...",
  ];

  useEffect(() => {
    if (!isOptimizing) return;
    setOptimizingMsgIndex(0);
    const interval = setInterval(() => {
      setOptimizingMsgIndex((prev) =>
        prev < OPTIMIZING_MESSAGES.length - 1 ? prev + 1 : prev
      );
    }, 2800);
    return () => clearInterval(interval);
  }, [isOptimizing]);

  useEffect(() => {
    if (!sessionId) return
    const stored = resumeStorage.getResumeData(sessionId)
    if (stored?.data) {
      setResumeData(stored.data)
      setDataLoaded(true)
    }
  }, [sessionId])

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/payment/pricing`)
      .then(res => res.json())
      .then(data => {
        if (data && data.download) setPricing(data)
      })
      .catch(err => console.error('Pricing fetch error:', err))
  }, [])

  // Trap browser back button — go to landing instead of processing
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const handleBack = () => window.location.replace('/')
    window.addEventListener('popstate', handleBack)
    return () => window.removeEventListener('popstate', handleBack)
  }, [])

  const handleSelectTemplate = async (templateId) => {
    if (!sessionId) return
    
    setIsOptimizing(true)
    const fileId = sessionStorage.getItem(`fileId_${sessionId}`)
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

    try {
      const res = await fetch(`${API_URL}/api/optimize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData, fileId, sessionId }),
      });

      if (!res.ok) throw new Error("Optimization failed");

      const data = await res.json();
      // Store optimized data for the next page
      sessionStorage.setItem(`optimized_${sessionId}`, JSON.stringify(data.optimizedData));
      
      // Navigate to preview
      router.push(`/?id=${sessionId}&template=${templateId}`)
    } catch (err) {
      console.error("Optimization failed:", err)
      setIsOptimizing(false)
      toast({
        title: "Optimization failed",
        description: "Something went wrong while enhancing your resume. Please try again.",
        variant: "destructive"
      })
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
                   Select Template & Optimize
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        {/* Added 'select-none' to prevent text selection */}
<div
  className="relative bg-gradient-to-br from-blue-50 to-white border border-blue-200 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 select-none"
  onCopy={(e) => e.preventDefault()}
>
  {/* Accent glow */}
  <div className="absolute inset-0 rounded-2xl bg-blue-100 opacity-0 hover:opacity-20 transition duration-300 pointer-events-none"></div>

  <div className="flex gap-4 items-start">
    
    {/* Icon */}
    <div className="bg-blue-100 p-2 rounded-full">
      <CheckCircle size={22} className="text-blue-600" />
    </div>

    {/* Content */}
    <div className="flex-1">
      <p className="font-semibold text-blue-900 text-lg leading-snug mb-2">
        Choose a template and get your CV optimized instantly
      </p>

      <p className="text-blue-800 text-sm mb-3 leading-relaxed">
        Get your <span className="font-semibold">AI Optimized Resume Download</span> for{" "}
        <span className="font-semibold text-blue-900">₹{pricing.optimize.final.toFixed(2)}</span>{" "}
        {pricing.optimize.hasOffer && (
          <span className="text-xs text-blue-400 line-through mr-1">₹{pricing.optimize.original.toFixed(2)}</span>
        )}
        or get a <span className="font-semibold">clean professional version for</span> for{" "}
        <span className="font-semibold text-blue-900">₹{pricing.download.final.toFixed(2)}</span>{" "}
        {pricing.download.hasOffer && (
          <span className="text-xs text-blue-400 line-through mr-1">₹{pricing.download.original.toFixed(2)}</span>
        )}.
      </p>

      {/* Footer row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <span className="text-xs text-blue-700 font-medium">
          No signup required • Instant download
        </span>

        
      </div>
    </div>
  </div>
</div>
      </div>

      {/* ── Optimization Overlay ── */}
      {isOptimizing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="max-w-md w-full px-6 text-center">
            
            
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              Transforming Your Resume
            </h3>
            
            <div className="flex items-center justify-center gap-2 mb-6 text-green-600 font-bold">
               <Loader2 className="animate-spin" size={20} />
               <span>AI-Powered Optimization in Progress</span>
            </div>

            <div className=" min-h-[100px] flex items-center justify-center">
               <p className="text-slate-600 font-medium animate-in slide-in-from-bottom-2 transition-all key={optimizingMsgIndex}">
                 {OPTIMIZING_MESSAGES[optimizingMsgIndex]}
               </p>
            </div>
            
            <p className="mt-8 text-xs text-slate-400 uppercase tracking-widest font-bold">
               FixCVNow AI Engine v2.0
            </p>
          </div>
        </div>
       )} 
    </div>
  )
}
