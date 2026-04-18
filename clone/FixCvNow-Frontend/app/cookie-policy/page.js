import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { COLORS } from '@/lib/colors'

const sections = [
  {
    title: '1. What Are Cookies',
    content: `Cookies are small text files that are stored on your device when you visit a website. They help websites remember information about your visit, such as:
• User preferences
• Login sessions
• Browsing behavior
• Device information

Cookies help improve website functionality and user experience.`,
  },
  {
    title: '2. How FixCVNow Uses Cookies',
    content: `FixCVNow may use cookies for the following purposes:

Essential Cookies — These cookies are necessary for the website to function properly. They help enable basic features such as page navigation, security, session management, and payment processing. Without these cookies, certain parts of the website may not function correctly.

Performance and Analytics Cookies — We may use analytics tools to understand how visitors use our website. These cookies may collect information such as pages visited, time spent on the website, device type, and general geographic region. This information helps us improve the performance and usability of FixCVNow.

Functional Cookies — Functional cookies help remember your preferences and improve the user experience. Examples include remembering language preferences, previously entered information, and user interface settings.`,
  },
  {
    title: '3. Third-Party Cookies',
    content: `Some cookies may be placed by third-party services that help us operate the website, such as:
• Payment processing providers
• Analytics services
• Security services

These providers may use cookies according to their own privacy policies.`,
  },
  {
    title: '4. Managing Cookies',
    content: `Most web browsers allow you to control or disable cookies through browser settings. You can choose to:
• Block cookies
• Delete stored cookies
• Receive notifications when cookies are used

Please note that disabling cookies may affect the functionality of certain parts of the website.`,
  },
  {
    title: '5. Updates to This Policy',
    content: `We may update this Cookie Policy from time to time to reflect changes in our services or legal requirements. Any updates will be posted on this page with the updated Last Updated date.`,
  },
  {
    title: '6. Contact Information',
    content: `If you have questions about this Cookie Policy, please contact:\nEmail: support@fixcvnow.com\nWebsite: https://www.fixcvnow.com`,
  },
]

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <div className="py-16 px-6 text-center" style={{ backgroundColor: COLORS.bgLight }}>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3" style={{ color: COLORS.blue }}>
              Cookie Policy
            </h1>
            <p className="text-slate-400 text-sm">Last Updated: 1st April 2026</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-16">
          <p className="text-slate-600 mb-12 leading-relaxed">
            This Cookie Policy explains how FixCVNow uses cookies and similar technologies when you visit or use our website. By continuing to use our website, you consent to the use of cookies as described in this policy.
          </p>

          <div className="space-y-10">
            {sections.map((s) => (
              <div key={s.title}>
                <h2 className="text-lg font-bold mb-3" style={{ color: COLORS.blue }}>{s.title}</h2>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{s.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
