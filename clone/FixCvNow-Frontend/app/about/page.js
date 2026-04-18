import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { COLORS } from '@/lib/colors'

const whoWeHelp = [
  'Professionals who know their work—but struggle to present it',
  'Candidates getting rejected despite having the right experience',
  'Freshers who don\'t know how to structure a strong CV',
  'Job seekers whose resumes don\'t pass ATS filters',
]

const whatMakesDifferent = [
  'See real improvements before you pay',
  'No signup required for instant upgrades',
  'Get a structured, professional CV in under 2 minutes',
  'Affordable for everyone (starting at just ₹19)',
  'Built for real hiring scenarios—not just templates',
]

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">

        {/* Hero */}
        <div className="py-16 px-6 text-center" style={{ backgroundColor: COLORS.bgLight }}>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4" style={{ color: COLORS.blue }}>
              About FixCVNow
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed">
              At FixCVNow, we help you turn an average resume into a recruiter-ready, ATS-friendly CV in under 2 minutes—without writing a single line yourself.
            </p>
            <p className="text-slate-500 mt-3 leading-relaxed">
              FixCVNow is a smart, AI-powered resume optimisation platform that improves structure, grammar, keywords, and readability—so your resume actually gets shortlisted.
            </p>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">

          {/* The Problem */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: COLORS.blue }}>The Problem We're Solving</h2>
            <p className="text-slate-600 leading-relaxed mb-3">
              Every day, thousands of qualified candidates get rejected—not because they lack skills, but because their resumes fail in the first 6–10 seconds.
            </p>
            <p className="text-slate-600 leading-relaxed font-medium">
              Poor formatting. Weak wording. Missing keywords.<br />
              Small mistakes. Big consequences.
            </p>
            <p className="text-slate-600 leading-relaxed mt-3">
              We saw this gap—and decided to fix it.
            </p>
          </section>

          {/* Who We Help */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: COLORS.blue }}>Who We Help</h2>
            <p className="text-slate-600 mb-4">FixCVNow is built for:</p>
            <ul className="space-y-3 mb-4">
              {whoWeHelp.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="mt-1 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS.green }} />
                  <span className="text-slate-600">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-slate-700 font-semibold">If you have a resume—we make it better.</p>
          </section>

          {/* What Makes Us Different */}
          <section className="rounded-2xl p-8" style={{ backgroundColor: COLORS.bgLight }}>
            <h2 className="text-2xl font-bold mb-6" style={{ color: COLORS.blue }}>What Makes FixCVNow Different</h2>
            <ul className="space-y-3">
              {whatMakesDifferent.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: COLORS.green }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-slate-600">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Mission & Vision */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border rounded-2xl p-7" style={{ borderColor: COLORS.border }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: COLORS.green }}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: COLORS.blue }}>Our Mission</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                To make high-quality, recruiter-ready resumes accessible to everyone—regardless of background, experience, or budget.
              </p>
            </div>
            <div className="border rounded-2xl p-7" style={{ borderColor: COLORS.border }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: COLORS.blue }}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: COLORS.blue }}>Our Vision</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                To become the world's most trusted platform for resume transformation and career growth.
              </p>
            </div>
          </section>

          {/* Our Story */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: COLORS.blue }}>Our Story</h2>
            <p className="text-slate-600 leading-relaxed mb-3">
              FixCVNow was built on a simple insight: <span className="font-semibold text-slate-700">Talent is everywhere—but most resumes don't reflect it.</span>
            </p>
            <p className="text-slate-600 leading-relaxed mb-3">
              With over 40 years of combined experience across hiring, sales, and talent acquisition, our team understands exactly how recruiters evaluate resumes.
            </p>
            <p className="text-slate-600 leading-relaxed mb-3">
              We've seen firsthand that over 90% of resumes fail—not due to lack of skill—but because they fail to communicate value quickly.
            </p>
            <p className="text-slate-600 leading-relaxed">
              So we built FixCVNow—a platform that transforms resumes into clear, structured, and impactful profiles in under 2 minutes—at a cost anyone can afford.
            </p>
          </section>

          {/* Beyond Job Seekers */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: COLORS.blue }}>Beyond Job Seekers</h2>
            <p className="text-slate-600 leading-relaxed">
              FixCVNow is not just for candidates. We also empower freelance resume writers and career professionals to deliver high-quality resumes faster—and scale their services profitably.
            </p>
          </section>

          {/* Built for Real Impact */}
          <section>
            <h2 className="text-2xl font-bold mb-4" style={{ color: COLORS.blue }}>Built for Real Impact</h2>
            <p className="text-slate-600 leading-relaxed">
              Thousands of job seekers are already using FixCVNow to improve their resumes and increase their chances of getting shortlisted.
            </p>
          </section>

          {/* CTA */}
          <section className="rounded-2xl p-10 text-center" style={{ backgroundColor: COLORS.blue }}>
            <h2 className="text-2xl font-bold text-white mb-3">Ready to fix your resume?</h2>
            <p className="text-slate-300 mb-6">Upload your CV and see the difference instantly. No signup required. No risk. Just better resumes.</p>
            <Link
              href="/?page=upload"
              className="inline-block px-8 py-3 rounded-xl font-bold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: COLORS.green }}
            >
              Fix My Resume Now
            </Link>
          </section>

        </div>
      </main>
      <Footer />
    </div>
  )
}
