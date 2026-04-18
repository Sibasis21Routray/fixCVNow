// this is components/LandingPage.js
'use client'

import { CheckCircle, ArrowRight, AlertCircle, ChevronRight, Dot } from 'lucide-react'
import { ResumeUploadIcon, AiBrainIcon, DocumentPreviewIcon, SecureDownloadIcon, QuickTemplatesIcon } from '@/components/asset-icons'
import { COLORS } from '@/lib/colors'
import Link from 'next/link';
import { useRouter } from 'next/navigation'
import BeforeAfter from '@/components/BeforeAfter'

export default function LandingPage() {
  const router = useRouter()

  const handleStart = () => {
    router.push('/?page=upload')
  }
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 animate-in fade-in duration-700">
      {/* Hero grid: text left, before/after right on large screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
        {/* Left: hero text */}
        <div className="text-center lg:text-left">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6" style={{ color: COLORS.blue }}>
            Fix Your CV with AI. <br />
            <span className="">Get Hired Faster.</span>
          </h1>
          <p className="text-lg mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            AI fixes grammar, structure, and formatting to make your resume recruiter-ready and ATS-friendly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={handleStart}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-white font-bold text-lg shadow-lg hover:scale-105 active:scale-95 transition-all"
              style={{ backgroundColor: COLORS.green }}
            >
              Upload Your CV – Free Preview <ArrowRight size={20} />
            </button>
            <Link href="#how-it-works" className="group inline-flex items-center justify-center text-sm hover:text-slate-700">
              See How it Works <ChevronRight size={16} className="inline transition-transform duration-300 group-hover:translate-x-2" />
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-6 text-sm justify-center lg:justify-start">
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> Used by Students, Professionals and Executives</span>
            <span className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500" /> AI-powered <Dot size={16}/>Secured <Dot size={16}/> Instant results</span>
          </div>
        </div>

        {/* Right: before/after component */}
        <div className="w-full">
          <BeforeAfter />
        </div>
      </div>

      {/* How It Works Section - As seen in your second image */}
      <section id="how-it-works" className="mb-32 scroll-mt-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4" style={{ color: COLORS.blue }}>
            Upgrade Your CV in Minutes. No Sign-Up Required.
          </h2>
          <div className="flex items-center justify-center flex-wrap gap-2 md:gap-4  text-xs md:text-sm font-medium tracking-wider">
            <span>Upload</span>
            <ArrowRight size={14} />
            <span>AI improves</span>
            <ArrowRight size={14} />
            <span>Choose a template</span>
            <ArrowRight size={14} />
            <span>Pay</span>
            <ArrowRight size={14} />
            <span>Download</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {/* Step 1 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm relative group hover:shadow-md transition-shadow">
            <div className="absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: COLORS.green }}>1</div>
            <div className="flex flex-col items-center mt-4">
           {/* Increased container to w-32 (128px) to accommodate the large icon */}
<div className="flex items-center justify-center mb-6 group-hover:text-green-500 transition-colors">
  <ResumeUploadIcon size={120} />
</div>
              <h3 className="font-bold text-lg mb-3" style={{ color: COLORS.blue }}>Upload Your CV</h3>
              <p className="text-sm  leading-relaxed">
                Upload your existing CV in PDF, Word, or text format. No login, No email, No friction.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm relative group hover:shadow-md transition-shadow">
            <div className="absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: COLORS.green }}>2</div>
            <div className="flex flex-col items-center mt-4">
              <div className="flex items-center justify-center mb-6 group-hover:text-green-500 transition-colors">
                <AiBrainIcon style={{marginTop:-15}} size={120} />
              </div>
              <h3 className="font-bold text-lg mb-3" style={{ color: COLORS.blue }}>AI Upgrades Structure & Content</h3>
              <p className="text-sm  leading-relaxed">
                Our AI restructures your CV, improves wording, and optimizes it for recruiters and ATS systems.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm relative group hover:shadow-md transition-shadow">
            <div className="absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: COLORS.green }}>3</div>
            <div className="flex flex-col items-center mt-4">
              <div className="flex items-center justify-center mb-6 group-hover:text-green-500 transition-colors">
                <DocumentPreviewIcon style={{marginTop:-10}} size={120} />
              </div>
              <h3 className="font-bold text-lg mb-3" style={{ color: COLORS.blue }}>Preview Professional templates.</h3>
              <p className="text-sm  leading-relaxed">
                See your upgraded CV in 6 modern templates.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm relative group hover:shadow-md transition-shadow">
            <div className="absolute top-4 left-4 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: COLORS.green }}>4</div>
            <div className="flex flex-col items-center mt-4">
              <div className="flex items-center justify-center mb-6 group-hover:text-green-500 transition-colors">
                <SecureDownloadIcon style={{marginTop:-10}} size={120} />
              </div>
              <h3 className="font-bold text-lg mb-3" style={{ color: COLORS.blue }}>Pay and Download</h3>
              <p className="text-sm  leading-relaxed">
               Select your favorite template, pay, and download your CV in PDF or Word.
              </p>
            </div>
          </div>
        </div>

        {/* Banner call to action */}
       {/* Changed p-8 to py-4 (vertical) and px-6 (horizontal) to slim it down */}
{/* Reduced md:p-8 to md:py-5 for a slimmer vertical profile */}
<div className="bg-white rounded-2xl p-4 md:py-5 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-100 shadow-inner">
  <div className="flex items-center gap-4">
    <div className="rounded-full bg-white flex items-center justify-center">
      {/* Brought this down from 220 to 140 — still large, but not overwhelming */}
      <ResumeUploadIcon size={140} />
    </div>
    <div>
      <p className="font-bold text-slate-800 text-lg">Your Resume Is Ready. Now Choose How Strong You Want It.</p>
      <p className="text-sm opacity-70">Choose Between Professional Clean OR AI Optimized.</p>
    </div>
  </div>
  <div className="flex flex-col items-center gap-2">
    <button
      onClick={handleStart}
      className="px-8 py-3 rounded-xl text-white font-bold hover:opacity-90 transition-opacity whitespace-nowrap"
      style={{ backgroundColor: COLORS.green }}
    >
      Try Now
    </button>
    <div className="flex items-center gap-3 text-[10px] font-medium uppercase tracking-widest">
      <span>No sign-up</span>
      <span>•</span>
      <span>Instant download</span>
    </div>
  </div>
</div>
      </section>

      {/* Pricing Section */}
<section id="pricing" className="mt-24 scroll-mt-24">

  {/* Hero line */}
  <div className="text-center mb-12">
    <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ color: COLORS.blue }}>
      Your Resume Is Ready. Now Choose How Strong You Want It.
    </h2>
    <p className="text-slate-500">
      Clean and professional — or strategically optimised for competitive roles.
    </p>
  </div>

  {/* Plan Cards */}
  <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto px-4">

    {/* PROFESSIONAL CV */}
    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
      <div className="mb-5 px-5 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider w-fit">
       Professional Clean
      </div>

      <div className="flex items-end gap-2 mb-1">
        <span className="text-4xl font-black" style={{ color: COLORS.blue }}>₹9</span>
        <span className="text-lg text-slate-400 line-through font-bold mb-1">₹49</span>
      </div>
      <p className="text-sm text-slate-500 mb-6 font-medium">Clean. Correct. Ready for job applications.</p>

      <ul className="space-y-3 mb-8 text-sm flex-1">
        {[
          'Grammar mistakes corrected',
          'Spelling errors fixed',
          'Professional formatting',
          'Recruiter-friendly section order',
          'Spacing & bullet consistency',
          'Tense correction',
          'ATS-friendly layout',
          'No watermark',
        ].map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <p className="text-xs text-slate-400 mb-4">Best for freshers and job seekers who want a clean, strong resume.</p>

      <button
        onClick={handleStart}
        className="w-full py-3.5 text-white font-bold rounded-2xl transition-all hover:opacity-90"
        style={{ backgroundColor: COLORS.blue }}
      >
        Download Professional CV — ₹9
      </button>
      <p className="mt-3 text-sm text-center text-slate-400 font-bold">One Time Payment</p>
    </div>

    {/* AI CAREER UPGRADE */}
    <div className="bg-white p-8 rounded-3xl shadow-xl border-2 border-green-200 flex flex-col relative">
      {/* Recommended badge */}
      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-bold uppercase tracking-wider shadow" style={{ backgroundColor: COLORS.green }}>
        Recommended
      </div>

      <div className="mb-5 px-5 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider w-fit">
        AI Optimized
      </div>

      <div className="flex items-end gap-2 mb-1">
        <span className="text-4xl font-black" style={{ color: COLORS.blue }}>₹19</span>
        <span className="text-lg text-slate-400 line-through font-bold mb-1">₹99</span>
      </div>
      <p className="text-sm text-slate-500 mb-6 font-medium">Stronger positioning. Better impact. Higher confidence.</p>

      <ul className="space-y-3 mb-8 text-sm flex-1">
        {[
          'Everything in Professional Clean',
          'Profile Summary professionally rewritten',
          'AI Generated Role-Specific Summary',
          'AI Extracted & Structured Skills Section',
          'Keyword optimisation for stronger ATS alignment',
          'Achievement phrasing improvement',
          'Enhanced recruiter readability',
          'No watermark',
        ].map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <p className="text-xs text-slate-400 mb-4">Recommended for serious job seekers and competitive roles.</p>

      <button
        onClick={handleStart}
        className="w-full py-3.5 text-white font-bold rounded-2xl transition-all hover:opacity-90"
        style={{ backgroundColor: COLORS.green }}
      >
        Download AI Career Upgrade — ₹19
      </button>
      <p className="mt-3 text-sm text-center text-slate-400 font-bold">One Time Payment</p>
    </div>

  </div>

  {/* Comparison Table */}
  <div className="max-w-4xl mx-auto px-4 mt-16">
    <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: COLORS.bgLight }}>
            <th className="text-left px-6 py-4 font-bold" style={{ color: COLORS.blue }}>Feature</th>
            <th className="px-6 py-4 font-bold text-center" style={{ color: COLORS.blue }}>Professional CV</th>
            <th className="px-6 py-4 font-bold text-center" style={{ color: COLORS.green }}>AI Career Upgrade</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {[
            ['Grammar & Spelling Correction', true, true],
            ['Professional Formatting', true, true],
            ['Recruiter-Friendly Structure', true, true],
            ['ATS-Friendly Layout', true, true],
            ['No Watermark', true, true],
            ['Profile Summary Rewrite', false, true],
            ['Role-Specific AI Summary', false, true],
            ['AI Skills Extraction', false, true],
            ['Keyword Optimisation', false, true],
            ['Achievement Enhancement', false, true],
            ['Enhanced Recruiter Readability', false, true],
          ].map(([feature, basic, pro]) => (
            <tr key={feature} className="bg-white hover:bg-slate-50 transition-colors">
              <td className="px-6 py-3.5 text-slate-700">{feature}</td>
              <td className="px-6 py-3.5 text-center">
                {basic ? <span className="text-green-500 font-bold text-base">✔</span> : <span className="text-slate-300 font-bold">—</span>}
              </td>
              <td className="px-6 py-3.5 text-center">
                {pro ? <span className="font-bold text-base" style={{ color: COLORS.green }}>✔</span> : <span className="text-slate-300 font-bold">—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Trust copy */}
    <p className="text-center text-slate-400 text-sm mt-6 font-medium">
      No subscriptions. No hidden charges. One-time payment. Instant download.
    </p>
  </div>

</section>
    </div>
  );
}
