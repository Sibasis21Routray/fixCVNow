// components/SessionExpired.js
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, Home } from 'lucide-react'
import { CloudUploadIcon } from '@/components/asset-icons'
import { COLORS } from '@/lib/colors'

/**
 * Full-page error screen for expired / missing sessions.
 *
 * Props:
 *   title        – Heading text
 *   message      – Body description
 *   redirectTo   – Where to redirect after countdown  (default "/")
 *   redirectDelay – Seconds before auto-redirect       (default 6)
 */
export default function SessionExpired({
  title = 'Session Not Found',
  message = 'This session has expired or no longer exists. Sessions are stored temporarily in your browser and are lost when the tab is closed or the page is refreshed on a new device.',
  redirectTo = '/',
  redirectDelay = 6,
}) {
  const router = useRouter()
  const [countdown, setCountdown] = useState(redirectDelay)

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          router.replace(redirectTo)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [router, redirectTo])

  const progress = (countdown / redirectDelay) * 100

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="max-w-lg w-full text-center">

        {/* Icon */}
        <div className="w-24 h-24 rounded-full bg-red-50 border-4 border-red-100 flex items-center justify-center mx-auto mb-8">
          <AlertCircle size={44} className="text-red-400" />
        </div>

        {/* Heading */}
        <h2
          className="text-2xl md:text-3xl font-bold mb-3"
          style={{ color: COLORS.blue }}
        >
          {title}
        </h2>

        {/* Message */}
        <p className="text-slate-500 mb-10 leading-relaxed text-sm md:text-base max-w-md mx-auto">
          {message}
        </p>

        {/* Countdown bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8 text-left">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Redirecting automatically
            </span>
            <span className="text-sm font-bold text-slate-700">{countdown}s</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-linear"
              style={{
                width: `${progress}%`,
                backgroundColor: COLORS.green,
              }}
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => router.replace('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105 active:scale-95"
            style={{ backgroundColor: COLORS.blue }}
          >
            <Home size={18} />
            Go to Home
          </button>
          <button
            onClick={() => router.replace('/?page=upload')}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold border-2 transition-all hover:bg-slate-50"
            style={{ borderColor: COLORS.blue, color: COLORS.blue }}
          >
            <CloudUploadIcon size={18} />
            Upload New Resume
          </button>
        </div>

      </div>
    </div>
  )
}
