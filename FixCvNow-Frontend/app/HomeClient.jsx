'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '../components/Navbar'
import LandingPage from '../components/LandingPage'
import UploadPage from '../components/UploadPage'
import ProcessingPage from '../components/ProcessingPage'
import TemplateSelector from '../components/TemplateSelector'
import ResumePreview from '../components/ResumePreview'
import Footer from '../components/Footer'

export default function HomeClient() {
  const searchParams = useSearchParams()
  const page = searchParams.get('page')
  const sessionId = searchParams.get('id')
  const templateId = searchParams.get('template')

  // Read sessionStorage only after mount to avoid SSR/CSR hydration mismatch
  const [sessionFlags, setSessionFlags] = useState({ isFromProcessing: null, isAlreadyExtracted: null })

  useEffect(() => {
    if (sessionId) {
      setSessionFlags({
        isFromProcessing: sessionStorage.getItem(`processing_${sessionId}`),
        isAlreadyExtracted: sessionStorage.getItem(`extracted_${sessionId}`),
      })
    }
  }, [sessionId])

  const renderContent = () => {
    if (sessionId) {
      if (templateId) {
        return <ResumePreview />
      }

      const { isFromProcessing, isAlreadyExtracted } = sessionFlags
      if ((page === 'processing' || isFromProcessing) && !isAlreadyExtracted) {
        return <ProcessingPage />
      }
      return <TemplateSelector />
    }

    switch (page) {
      case 'upload':
        return <UploadPage />
      case 'processing':
        return <ProcessingPage />
      case 'templates':
        return <TemplateSelector />
      case 'preview':
        return <ResumePreview />
      default:
        return <LandingPage />
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {renderContent()}
      </main>
      <Footer />
    </div>
  )
}
