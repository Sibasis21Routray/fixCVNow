import React, { useEffect, useState } from "react"

interface Props {
  isVisible: boolean
}

const STEPS = [
  "Generating your AI Career Upgrade...",
  "Improving your profile summary...",
  "Optimizing role descriptions...",
  "Extracting key skills...",
  "Enhancing achievement phrasing...",
  "Adding ATS keywords...",
  "Final polishing...",
]

export const ResumeProcessingOverlay: React.FC<Props> = ({ isVisible }) => {
  const [stepIndex, setStepIndex] = useState(0)

  // 🔥 AUTO RUN LOGIC
  useEffect(() => {
    if (!isVisible) return

    setStepIndex(0)

    const interval = setInterval(() => {
      setStepIndex((prev) => {
        if (prev >= STEPS.length - 1) return prev
        return prev + 1
      })
    }, 2200) // speed control

    return () => clearInterval(interval)
  }, [isVisible])

  if (!isVisible) return null

  return (
    <>
      {/* Inline CSS (same file as requested) */}
      <style>{`
        @keyframes spin-slow {
          to { transform: rotate(360deg); }
        }
        .spin-slow {
          animation: spin-slow 2.5s linear infinite;
        }
      `}</style>

      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-sm">
        
        <div className="w-full max-w-md px-6 text-center">

          {/* Animated Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white text-xl">
                ✨
              </div>

              <div className="absolute inset-0 rounded-full border-4 border-green-400 border-t-transparent animate-spin"></div>
              <div className="absolute inset-[-8px] rounded-full border-4 border-slate-300 border-b-transparent spin-slow"></div>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Transforming Your Resume
          </h2>

          <p className="text-slate-500 mb-6 text-sm font-semibold text-green-600">
            AI-Powered Optimization in Progress...
          </p>

          {/* Steps */}
          <div className="text-left space-y-3">
            {STEPS.map((step, i) => {
              const isActive = stepIndex === i
              const isDone = stepIndex > i

              return (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold
                      ${
                        isDone
                          ? "bg-green-500 text-white"
                          : isActive
                          ? "bg-green-500 text-white animate-pulse"
                          : "bg-slate-200 text-slate-500"
                      }
                    `}
                  >
                    {isDone ? "✓" : i + 1}
                  </div>

                  <p
                    className={`text-sm ${
                      isActive
                        ? "text-slate-800 font-semibold"
                        : isDone
                        ? "text-slate-500"
                        : "text-slate-400"
                    }`}
                  >
                    {step}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Footer */}
          <p className="mt-8 text-xs text-slate-400 uppercase tracking-widest font-bold">
            FixCVNow AI Engine v2.0
          </p>
        </div>
      </div>
    </>
  )
}