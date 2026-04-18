// this is components/Footer.js
'use client'

import Link from 'next/link'
import { COLORS } from '@/lib/colors'

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-20" style={{ borderColor: COLORS.border }}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-sm">

          {/* Brand Section */}
          <div className="flex flex-col gap-4 items-start">
            <img
              src="/assets/logo.png"
              alt="FixCVNow Logo"
              className="h-10 w-auto max-w-[160px] object-contain"
            />
            <p className="text-slate-500 text-xs leading-snug">
              AI-powered resume improvement you can trust.
            </p>
           <div className="flex items-center gap-3">
  {/* LinkedIn */}
  <a
    href="https://www.linkedin.com/company/fixcvnow"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="LinkedIn"
    className="transition-opacity hover:opacity-80"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#0077B5">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.381-1.563 2.844-1.563 3.042 0 3.604 2.002 3.604 4.604v5.592z" />
    </svg>
  </a>

  {/* Instagram */}
  <a
    href="https://www.instagram.com/fixcvnow/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram"
    className="transition-opacity hover:opacity-80"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#E4405F">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  </a>

  {/* Facebook */}
  <a
    href="https://www.facebook.com/profile.php?id=61576448974742"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Facebook"
    className="transition-opacity hover:opacity-80"
  >
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  </a>
</div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold mb-4 text-xs uppercase tracking-wider" style={{ color: COLORS.blue }}>
              Product
            </h4>
            <ul className="space-y-2 text-slate-500">
              <li>
                <Link href="/#pricing" className="hover:text-slate-800 transition-colors">Pricing</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-slate-800 transition-colors">FAQ</Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-slate-800 transition-colors">How It Works</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold mb-4 text-xs uppercase tracking-wider" style={{ color: COLORS.blue }}>
              Legal
            </h4>
            <ul className="space-y-2 text-slate-500">
              <li>
                <Link href="/terms" className="hover:text-slate-800 transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-slate-800 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-slate-800 transition-colors">Refund &amp; Cancellation Policy</Link>
              </li>
              <li>
                <Link href="/ai-data-usage" className="hover:text-slate-800 transition-colors">AI &amp; Data Usage Policy</Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="hover:text-slate-800 transition-colors">Cookie Policy</Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold mb-4 text-xs uppercase tracking-wider" style={{ color: COLORS.blue }}>
              Company
            </h4>
            <ul className="space-y-2 text-slate-500">
              <li>
                <Link href="/about" className="hover:text-slate-800 transition-colors">About Us</Link>
              </li>
              <li>
                support@FixCVNow.com
              </li>
              {/* <li>
                <Link href="/contact" className="hover:text-slate-800 transition-colors">Contact Us</Link>
              </li> */}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Strip */}
      <div className="border-t" style={{ borderColor: COLORS.border }}>
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-slate-400 text-xs">
          © 2026 FixCVNow | All Rights Reserved
        </div>
      </div>
    </footer>
  )
}
