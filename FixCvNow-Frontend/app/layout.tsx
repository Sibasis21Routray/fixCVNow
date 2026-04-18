import { Geist, Geist_Mono } from 'next/font/google'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata = {
  title: 'FixCVNow - AI-Powered Resume Optimizer',
  description: 'Optimize your CV with AI. Get hired faster. No sign-up required.',
  generator: 'v0.app',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/assets/favicon-icon.png',
  },
}

import { Toaster } from '@/components/ui/toaster'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1E3A5F" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
