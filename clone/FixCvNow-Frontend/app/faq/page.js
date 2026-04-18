'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { COLORS } from '@/lib/colors'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqs = [
  {
    q: 'What does FixCVNow do?',
    a: `FixCVNow improves your existing resume using AI. It automatically:
• Corrects grammar and spelling mistakes
• Cleans formatting and spacing
• Organizes resume sections properly
• Improves readability for recruiters
• Makes your resume ATS-friendly

You can preview the Professional CV improvement first and then choose to download the improved version.`,
  },
  {
    q: 'Do I need to create an account?',
    a: 'No. You can upload your resume and see the improvement without creating an account or signing up.',
  },
  {
    q: 'What is the difference between the two plans?',
    a: `Professional CV:
• Grammar and spelling corrections
• Clean formatting and spacing
• Proper section structure
• ATS-friendly layout
Best for candidates who want a clean and professional resume.

AI Career Upgrade — Includes everything in Professional CV, plus:
• Profile summary rewritten
• AI-generated role-specific summary
• Skills extraction and organization
• Keyword optimisation for ATS systems
• Improved achievement phrasing
Best for candidates applying to competitive roles.`,
  },
  {
    q: 'Can I preview the resume before paying?',
    a: 'Yes. You can preview the Professional CV improvements before making any payment. If you choose the AI Career Upgrade, the AI-enhanced version will be generated after payment, and you will be able to preview it before downloading.',
  },
  {
    q: 'What file formats can I upload?',
    a: 'You can upload your resume in PDF, DOC, or DOCX format. These are the most commonly used resume formats.',
  },
  {
    q: 'How long does it take to improve my resume?',
    a: 'Usually less than one minute. Our AI processes your resume and prepares the improved version almost instantly.',
  },
  {
    q: 'Will my resume be ready for job applications?',
    a: 'Yes. The improved resume is designed to be clean, professional, and easy for recruiters to read, while also being ATS-friendly. You can directly use it when applying for jobs.',
  },
  {
    q: 'What is ATS and why is it important?',
    a: `Many companies use Applicant Tracking Systems (ATS) to filter resumes. These systems scan resumes for proper structure, relevant keywords, and clear sections. FixCVNow improves your resume formatting and structure so it can be easily read by both ATS systems and recruiters.`,
  },
  {
    q: 'Can I edit the resume after downloading?',
    a: 'Yes. You can download your resume in Word format, which allows you to edit and customize it further if needed.',
  },
  {
    q: 'Can I use the same resume for multiple job applications?',
    a: 'Yes. The improved resume is designed to be clean and professional, making it suitable for most job applications. You can further customize it later for specific roles if needed.',
  },
  {
    q: 'What if my resume does not parse correctly?',
    a: `Sometimes resumes with heavy graphics, tables, or scanned images may not extract properly. If this happens, try uploading a Word (.DOC or .DOCX) version or a simple PDF without graphics. This usually solves the problem.`,
  },
  {
    q: 'Does FixCVNow support multi-page resumes?',
    a: 'Yes. FixCVNow supports multi-page resumes, and our AI analyses the entire document to improve formatting and readability.',
  },
  {
    q: 'Will FixCVNow change my experience or add false information?',
    a: 'No. FixCVNow does not create fake experience or incorrect information. It only improves grammar, wording, structure, and formatting. Your original experience and achievements remain unchanged.',
  },
  {
    q: 'Can AI make mistakes?',
    a: 'AI technology can sometimes make mistakes or generate imperfect suggestions. We recommend that you review the AI-generated content carefully before using the resume for job applications. FixCVNow is a resume improvement tool, and the user is responsible for reviewing the final resume before submitting it to employers.',
  },
  {
    q: 'Is my resume data safe?',
    a: 'Yes. Your resume is processed securely and uploaded files are automatically deleted within 24 hours. Only limited structured data may be retained to improve the service.',
  },
  {
    q: 'Is online payment secure?',
    a: 'Yes. Payments are processed through a secure payment gateway, and your payment information is not stored on our servers.',
  },
  {
    q: 'What if I paid but did not receive my download?',
    a: 'If you face any issue, refresh the page and check your payment confirmation page. If the problem continues, contact our support team and we will assist you.',
  },
  {
    q: 'Is FixCVNow a subscription service?',
    a: 'No. FixCVNow is a one-time payment service. You only pay once for the improved resume. There are no subscriptions or hidden charges.',
  },
  {
    q: 'Who should use FixCVNow?',
    a: `FixCVNow is useful for:
• Freshers preparing their first resume
• Professionals updating their CV
• Candidates applying for private sector jobs
• Anyone who wants a cleaner and stronger resume`,
  },
  {
    q: 'Do recruiters really notice resume formatting?',
    a: 'Yes. Recruiters typically spend 6–8 seconds scanning a resume initially. A clean structure and clear formatting helps them quickly understand your skills and experience.',
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="border rounded-xl overflow-hidden transition-all"
      style={{ borderColor: open ? COLORS.green : COLORS.border }}
    >
      <button
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-sm md:text-base"
        style={{ color: COLORS.blue }}
        onClick={() => setOpen(!open)}
      >
        <span>{q}</span>
        {open
          ? <ChevronUp size={18} className="shrink-0" style={{ color: COLORS.green }} />
          : <ChevronDown size={18} className="shrink-0 text-slate-400" />
        }
      </button>
      {open && (
        <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed whitespace-pre-line border-t" style={{ borderColor: COLORS.border }}>
          {a}
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <div className="py-16 px-6 text-center" style={{ backgroundColor: COLORS.bgLight }}>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ color: COLORS.blue }}>
              Frequently Asked Questions
            </h1>
            <p className="text-slate-500 text-lg">
              Everything you need to know about FixCVNow.
            </p>
          </div>
        </div>

        {/* FAQ List */}
        <div className="max-w-3xl mx-auto px-6 py-16 space-y-3">
          {faqs.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} />
          ))}
        </div>

        {/* CTA */}
        <div className="max-w-3xl mx-auto px-6 pb-16 text-center">
          <p className="text-slate-500 text-sm">
            Still have questions?{' '}
            <a href="mailto:support@fixcvnow.com" className="font-semibold hover:underline" style={{ color: COLORS.green }}>
              Contact our support team
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
