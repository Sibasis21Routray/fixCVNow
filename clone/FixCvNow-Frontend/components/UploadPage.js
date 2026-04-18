// this is components/UploadPage.js
'use client'

import { useRef, useState } from 'react'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { ResumeUploadIcon, DocumentIcon } from '@/components/asset-icons'
import { COLORS } from '@/lib/colors'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { leadsStorage, sessionStorage_util, resumeStorage } from '@/lib/storage'

export default function UploadPage() {
  const router = useRouter()
  const fileInputRef = useRef()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file')
      return
    }

    setLoading(true)
    setError(null)

    try {
      console.log('[v0] Starting resume extraction...')
      
      // Create a temporary session first
      const tempLead = leadsStorage.addLead({
        name: 'Extracting...',
        email: '',
        phone: ''
      })

      const sessionId = tempLead.sessionId
      console.log('[v0] Temp session created:', sessionId)

      // Store the file for the processing page to use
      sessionStorage_util.setUploadedFile(file)

      // Navigate to processing page IMMEDIATELY with phase=extraction
      router.replace(`/?id=${sessionId}&page=processing&phase=extraction`)

      // API call happens in the background (processing page will call it)
    } catch (err) {
      console.error('[v0] Upload error:', err)
      setError(err.message || 'Failed to process resume. Please try again.')
      setLoading(false)
    }
  }

  const handleClearFile = (e) => {
    e.stopPropagation()
    setFile(null)
    setError(null)
  }

  return (
    <div className="px-6 py-10 md:py-14 animate-in slide-in-from-bottom-4 duration-500">

      <div className="max-w-2xl mx-auto text-center flex-1 flex flex-col justify-center">
        <h2
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ color: COLORS.blue }}
        >
          Upload your existing CV
        </h2>

        <p className="text-slate-500 mb-10 text-base md:text-lg">
          We support PDF, DOC, and DOCX formats. Let our AI extract and polish your data.
        </p>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Upload Zone */}
        <div
          onClick={() => fileInputRef.current.click()}
          className={`border-2 border-dashed rounded-2xl p-8 md:p-10 mb-6 cursor-pointer transition-all ${
            file
              ? 'border-green-500 bg-green-50'
              : 'border-slate-200 bg-white hover:border-blue-300'
          }`}
        >
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            onClick={(e) => { e.target.value = '' }}
            accept=".pdf,.doc,.docx,.txt"
          />

          <div className="flex flex-col items-center">
            {file ? (
              <>
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
                  <CheckCircle size={32} />
                </div>
                <p className="font-bold text-lg md:text-xl mb-2">{file.name}</p>
                <p className="text-sm text-slate-500 mb-6">
                  {(file.size / 1024 / 1024).toFixed(2)} MB • Ready for AI extraction
                </p>
                <button
                  className="text-sm text-slate-400 underline hover:text-slate-600 mb-6"
                  onClick={handleClearFile}
                >
                  Change file
                </button>
              </>
            ) : (
              <>
                <div
className="flex items-center justify-center mb-6 group-hover:text-green-500 transition-colors"                  

style={{ color: COLORS.green }}
                >
                  <ResumeUploadIcon size={120} />
                </div>
                <p className="font-bold text-lg md:text-xl mb-2">
                  Click to upload your CV
                </p>
                <p className="text-xs text-slate-400 mt-4">
                  PDF, DOC, DOCX • Max 2 MB
                </p>
              </>
            )}
          </div>
        </div>

        {/* Upload Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className={`px-8 py-3 rounded-xl text-white font-bold text-lg transition-all ${
              !file || loading
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:scale-105 active:scale-95 cursor-pointer'
            }`}
            style={{ backgroundColor: (!file || loading) ? '#999' : COLORS.green }}
          >
            {loading ? 'Improving...' : 'Improve My CV'}
          </button>

          {file && (
            <button
              onClick={handleClearFile}
              disabled={loading}
              className="px-8 py-3 rounded-xl border-2 font-bold text-lg transition-all"
              style={{ borderColor: COLORS.blue, color: COLORS.blue, opacity: loading ? 0.5 : 1 }}
            >
              Choose Different File
            </button>
          )}
        </div>
        <div className="mt-5 text-[11px]  text-center leading-relaxed">
                    By uploading, you agree to our{" "}
                    <Link
                      href="/terms"
                      className="underline "
                    >
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="underline "
                    >
                      Privacy Policy
                    </Link>
                    .
                  </div>

        {/* Info Box */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-2xl p-6 text-left">
          <div className="flex gap-3">
            <DocumentIcon size={120} className="flex-shrink-0 mt-1" />
            <div>
              <p className="font-bold text-blue-900 mb-2">What happens next?</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• We'll extract your resume content</li>
                <li>• AI will analyze and improve your CV</li>
                <li>• You'll preview it in professional templates</li>
                <li>• Pay and Download Professional Clean OR AI Optimized</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
