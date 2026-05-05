'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { CloudUploadIcon } from '@/components/asset-icons'
import { COLORS } from '@/lib/colors'
import { resumeStorage, leadsStorage, sessionStorage_util } from '@/lib/storage'
import { useToast } from '@/hooks/use-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

// ─────────────────────────────────────────────
// Extraction: real sections driven by SSE events
// ─────────────────────────────────────────────
const EXTRACTION_SECTIONS = [
  { key: 'upload',     label: 'Uploading to secure storage...'           },
  { key: 'personal',   label: 'Extracting personal info...'              },
  { key: 'experience', label: 'Extracting work experience...'            },
  { key: 'education',  label: 'Extracting education & certifications...' },
  { key: 'skills',     label: 'Extracting skills & languages...'         },
  { key: 'extras',     label: 'Extracting projects & extra details...'   },
  { key: 'done',       label: 'Finalizing resume...'                     },
]

// These 5 run in parallel — progress is based on how many have completed (never decreases)
const PARALLEL_SECTION_KEYS = ['personal', 'experience', 'education', 'skills', 'extras']
const COUNT_TO_PROGRESS = [12, 28, 46, 63, 80, 92] // index = number of sections done (0–5)

// Optimization phase keeps a fake-timer approach (single call, no SSE)
const OPTIMIZATION_STEPS = [
  'Analyzing current content...',
  'Inferring seniority level...',
  'Optimizing with ATS keywords...',
  'Enhancing action verbs...',
  'Quantifying achievements...',
  'Generating key highlights...',
  'Final polishing...',
  'Preparing your optimized CV...',
]

// Minimum duration constants (15 seconds = 15000 ms)
const MIN_EXTRACTION_DURATION = 15000
const MIN_OPTIMIZATION_DURATION = 15000

export default function ProcessingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('id')
  const phase = searchParams.get('phase') || 'extraction'

  // Extraction state — driven by SSE events
  const [completedSections, setCompletedSections] = useState(new Set())
  const [currentSectionLabel, setCurrentSectionLabel] = useState(EXTRACTION_SECTIONS[0].label)
  const [extractionProgress, setExtractionProgress] = useState(0)

  // Optimization state — fake timer
  const [optStep, setOptStep] = useState(0)
  const [optProgress, setOptProgress] = useState(0)

  const [error, setError] = useState(null)
  const [isComplete, setIsComplete] = useState(false)
  const abortRef = useRef(null)
  
  // Timer refs for minimum duration tracking
  const startTimeRef = useRef(null)
  const realExtractionCompleteRef = useRef(false)
  const realOptimizationCompleteRef = useRef(false)

  // ─────────────────────────────────────────────
  // Prevent browser back
  // ─────────────────────────────────────────────
  useEffect(() => {
    window.history.pushState(null, '', window.location.href)
    const handleBack = () => window.history.pushState(null, '', window.location.href)
    window.addEventListener('popstate', handleBack)
    return () => window.removeEventListener('popstate', handleBack)
  }, [])

  // ─────────────────────────────────────────────
  // Fake progress timer for optimization phase with minimum duration
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'optimization' || isComplete) return

    // Record start time
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now()
    }

    const interval = setInterval(() => {
      setOptProgress((prev) => {
        // Don't go to 100% until real completion happens
        if (prev >= 95) return 95
        if (prev < 30) return prev + 2
        if (prev < 60) return prev + 1.5
        if (prev < 85) return prev + 0.8
        return prev + 0.3
      })
    }, 300)

    return () => clearInterval(interval)
  }, [phase, isComplete])

  useEffect(() => {
    if (phase !== 'optimization') return
    const stepIndex = Math.floor((optProgress / 95) * OPTIMIZATION_STEPS.length)
    setOptStep(Math.min(stepIndex, OPTIMIZATION_STEPS.length - 1))
  }, [optProgress, phase])

  // ─────────────────────────────────────────────
  // Extraction via SSE ReadableStream with minimum duration backwards progress
// ─────────────────────────────────────────────
const performExtraction = useCallback(async () => {
    setError(null)
    setIsComplete(false)
    setCompletedSections(new Set())
    setExtractionProgress(0)
    setCurrentSectionLabel(EXTRACTION_SECTIONS[0].label)
    realExtractionCompleteRef.current = false
    
    startTimeRef.current = Date.now()
    const MIN_DURATION = 15000 // 15 seconds minimum

    const controller = new AbortController()
    abortRef.current = controller

    let apiCompleted = false
    const progressRef = { current: 0 } // Use object ref instead of closure variable
    
    // Fake progress timer
    const progressTimer = setInterval(() => {
      if (apiCompleted) return
      
      const elapsed = Date.now() - startTimeRef.current
      const progressPercent = Math.min(85, (elapsed / MIN_DURATION) * 100)
      
      // Add small random increment, but ensure we never go backwards
      const randomIncrement = Math.random() * 2 + 0.5 // 0.5 to 2.5
      const newProgress = Math.min(85, Math.max(progressRef.current, progressPercent + randomIncrement))
      
      if (newProgress > progressRef.current) {
        progressRef.current = newProgress
        setExtractionProgress(newProgress)
        
        // Update completed sections based on progress
        const sectionsComplete = Math.floor(newProgress / (85 / PARALLEL_SECTION_KEYS.length))
        setCompletedSections(prev => {
          const next = new Set(prev)
          PARALLEL_SECTION_KEYS.slice(0, sectionsComplete).forEach(k => next.add(k))
          return next
        })
        
        // Update current label
        if (sectionsComplete < PARALLEL_SECTION_KEYS.length) {
          const section = EXTRACTION_SECTIONS.find(s => s.key === PARALLEL_SECTION_KEYS[sectionsComplete])
          if (section) setCurrentSectionLabel(section.label)
        }
      }
    }, 500 + Math.random() * 500)

    try {
      const file = sessionStorage_util.getUploadedFile()
      if (!file) throw new Error('Session expired. Please upload your file again.')

      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch(`${API_URL}/api/extract`, {
        method: 'POST',
        body: formData,
        signal: controller.signal,
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Extraction failed. Please try again.')
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue

          let event
          try {
            event = JSON.parse(line.slice(6))
          } catch {
            continue
          }

          if (event.type === 'progress' && event.status === 'done') {
            setCompletedSections(prev => {
              const next = new Set([...prev, event.section])
              const doneCount = PARALLEL_SECTION_KEYS.filter(k => next.has(k)).length
              const realProgress = COUNT_TO_PROGRESS[doneCount] ?? 12
              
              // Only update if higher than current
              if (realProgress > progressRef.current) {
                progressRef.current = realProgress
                setExtractionProgress(realProgress)
              }
              return next
            })
          }

          if (event.type === 'done') {
            apiCompleted = true
            clearInterval(progressTimer)
            
            leadsStorage.updateLead(sessionId, event.leadData)
            resumeStorage.saveResumeData(sessionId, event.resumeData)
            if (event.fileId) {
              sessionStorage.setItem(`fileId_${sessionId}`, event.fileId)
            }
            sessionStorage.setItem(`extracted_${sessionId}`, 'true')

            setCompletedSections(new Set(EXTRACTION_SECTIONS.map((s) => s.key)))
            setIsComplete(true)

            // Calculate remaining time
            const elapsed = Date.now() - startTimeRef.current
            const remaining = Math.max(0, MIN_DURATION - elapsed)
            
            if (remaining > 1000) {
              // Smooth animation for remaining time - calculate target progress
              const startProgress = progressRef.current
              const smoothProgressInterval = setInterval(() => {
                const now = Date.now()
                const totalElapsed = now - startTimeRef.current
                const timeLeft = MIN_DURATION - totalElapsed
                
                if (timeLeft <= 0) {
                  clearInterval(smoothProgressInterval)
                  progressRef.current = 100
                  setExtractionProgress(100)
                  setCurrentSectionLabel('Complete!')
                  setTimeout(() => {
                    window.location.replace(`/?id=${sessionId}`)
                  }, 200)
                  return
                }
                
                // Calculate progress based on elapsed time since API response
                const timeSinceApiDone = totalElapsed - elapsed
                const progressRange = 100 - startProgress
                const additionalProgress = (timeSinceApiDone / remaining) * progressRange
                const finalProgress = Math.min(100, startProgress + additionalProgress)
                
                if (finalProgress > progressRef.current) {
                  progressRef.current = finalProgress
                  setExtractionProgress(finalProgress)
                  setCurrentSectionLabel('Finalizing resume...')
                }
              }, 100)
            } else {
              // Less than 1 second remaining, just complete
              progressRef.current = 100
              setExtractionProgress(100)
              setCurrentSectionLabel('Complete!')
              setTimeout(() => {
                window.location.replace(`/?id=${sessionId}`)
              }, remaining + 300)
            }
          }

          if (event.type === 'error') {
            clearInterval(progressTimer)
            if (event.code === 'TOKEN_LIMIT_EXCEEDED') {
              toast({
                title: "Resume Too Large",
                description: event.error || "The resume content exceeds 10,000 tokens.",
                variant: "destructive",
              })
              // Stop processing and redirect back to upload or show error in UI
              setError(event.error)
              return
            }
            throw new Error(event.error || 'Extraction failed. Please try again.')
          }
        }
      }

    } catch (err) {
      clearInterval(progressTimer)
      if (err.name === 'AbortError') return
      console.warn('[ProcessingPage] Extraction error:', err.message)
      setError(err.message || 'Failed to extract resume. Please try again.')
    }
  }, [sessionId])

  // Cleanup on unmount
  useEffect(() => {
    return () => abortRef.current?.abort()
  }, [])

  // ─────────────────────────────────────────────
  // Kick off extraction on mount
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!sessionId || phase !== 'extraction') return

    if (sessionStorage.getItem(`extracted_${sessionId}`)) {
      window.location.replace(`/?id=${sessionId}`)
      return
    }

    const uploadedFile = sessionStorage_util.getUploadedFile()
    if (!uploadedFile) {
      router.replace('/')
      return
    }

    const timer = setTimeout(performExtraction, 800)
    return () => clearTimeout(timer)
  }, [sessionId, phase, router, performExtraction])

  // ─────────────────────────────────────────────
  // Fake optimization completion handler
  // ─────────────────────────────────────────────
  const completeOptimization = useCallback(() => {
    if (realOptimizationCompleteRef.current) return
    realOptimizationCompleteRef.current = true
    
    // Set to 95% first
    setOptProgress(95)
    setOptStep(OPTIMIZATION_STEPS.length - 1)
    setIsComplete(true)
    
    const elapsedTime = Date.now() - startTimeRef.current
    const remainingTime = Math.max(0, MIN_OPTIMIZATION_DURATION - elapsedTime)
    
    if (remainingTime > 0) {
      setTimeout(() => {
        setOptProgress(100)
        setTimeout(() => {
          window.location.replace(`/?id=${sessionId}`)
        }, 300)
      }, remainingTime)
    } else {
      setOptProgress(100)
      setTimeout(() => {
        window.location.replace(`/?id=${sessionId}`)
      }, 300)
    }
  }, [sessionId])

  // Simulate optimization completion (replace with actual API call when ready)
  useEffect(() => {
    if (phase !== 'optimization') return
    
    // Record start time
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now()
    }
    
    // Simulate API call - replace this with your actual optimization API call
    const timer = setTimeout(() => {
      completeOptimization()
    }, 2000) // Simulate 2-second real processing - replace with actual API
    
    return () => clearTimeout(timer)
  }, [phase, completeOptimization])

  // ─────────────────────────────────────────────
  // Derived display values
  // ─────────────────────────────────────────────
  const displayProgress = phase === 'optimization' ? optProgress : extractionProgress
  const displayLabel = phase === 'optimization'
    ? OPTIMIZATION_STEPS[optStep]
    : currentSectionLabel

  // ─────────────────────────────────────────────
  // Error state
  // ─────────────────────────────────────────────
  if (error) {
    return (
      <div className="px-6 py-12 md:py-20 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full bg-red-50 border-4 border-red-100 flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={38} className="text-red-400" />
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ color: COLORS.blue }}>
            Extraction Failed
          </h2>
          <p className="text-slate-500 mb-8 leading-relaxed text-sm">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={performExtraction}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: COLORS.green }}
            >
              <RefreshCw size={18} />
              Try Again
            </button>
            <button
              onClick={() => router.replace('/?page=upload')}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold border-2 transition-all hover:bg-slate-50"
              style={{ borderColor: COLORS.blue, color: COLORS.blue }}
            >
              <CloudUploadIcon size={18} />
              Upload Different File
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────
  // Main UI
  // ─────────────────────────────────────────────
  return (
    <div className="px-6 py-12 md:py-20 min-h-screen flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full">

        {/* Animated spinner */}
        <div className="flex justify-center mb-12">
          <div className="relative w-24 h-24">
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-500 border-r-green-500 animate-spin"
              style={{ borderTopColor: COLORS.green, borderRightColor: COLORS.green }}
            />
            <div
              className="absolute inset-2 rounded-full border-4 border-transparent border-b-blue-500 animate-spin"
              style={{ borderBottomColor: COLORS.blue, animationDirection: 'reverse' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                style={{ backgroundColor: COLORS.green }}
              >
                ✨
              </div>
            </div>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: COLORS.blue }}>
          {phase === 'extraction' ? 'Extracting Your CV' : 'Optimizing Your CV'}
        </h2>
        <p className="text-slate-500 text-center text-lg mb-12">
          {phase === 'extraction'
            ? 'Reading and parsing your resume in parallel...'
            : 'Our AI is working its magic...'}
        </p>

        {/* Steps */}
        <div className="mb-12">
          {phase === 'extraction' ? (
            // Real section-based steps — tick off as they complete (any order)
            EXTRACTION_SECTIONS.map((section, index) => {
              const isDone = completedSections.has(section.key)
              // First section in the list that isn't done yet is shown as "active"
              const firstIncompleteIndex = EXTRACTION_SECTIONS.findIndex(s => !completedSections.has(s.key))
              const isActive = !isDone && index === firstIncompleteIndex
              return (
                <div key={section.key} className="flex items-center gap-4 mb-4">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold transition-all ${
                      isDone ? 'scale-100' : isActive ? 'scale-110 animate-pulse' : ''
                    }`}
                    style={{
                      backgroundColor: isDone || isActive ? COLORS.green : '#cbd5e1',
                    }}
                  >
                    {isDone ? '✓' : isActive ? '⚡' : index + 1}
                  </div>
                  <span
                    className={`text-sm md:text-base transition-all ${
                      isDone || isActive ? 'text-slate-800 font-medium' : 'text-slate-400'
                    }`}
                  >
                    {section.label}
                  </span>
                </div>
              )
            })
          ) : (
            // Fake-timer optimization steps
            OPTIMIZATION_STEPS.map((step, index) => (
              <div key={index} className="flex items-center gap-4 mb-4">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold transition-all ${
                    index < optStep ? 'scale-100' : index === optStep ? 'scale-110 animate-pulse' : ''
                  }`}
                  style={{
                    backgroundColor: index <= optStep ? COLORS.green : '#cbd5e1',
                  }}
                >
                  {index < optStep ? '✓' : index === optStep ? '⚡' : index + 1}
                </div>
                <span
                  className={`text-sm md:text-base transition-all ${
                    index <= optStep ? 'text-slate-800 font-medium' : 'text-slate-400'
                  }`}
                >
                  {step}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold" style={{ color: COLORS.blue }}>
              {displayLabel}
            </span>
            <span className="text-sm font-semibold text-slate-500">
              {Math.round(displayProgress)}%
            </span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${displayProgress}%`, backgroundColor: COLORS.green }}
            />
          </div>
        </div>

        <p className="text-center text-slate-500 text-sm">
          {phase === 'extraction'
            ? 'Sections extract in parallel — usually done in 15–20 seconds.'
            : 'This usually takes 20–30 seconds. Hang tight!'}
        </p>
      </div>
    </div>
  )
}