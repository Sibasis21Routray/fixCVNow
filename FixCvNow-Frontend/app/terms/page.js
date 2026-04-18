import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { COLORS } from '@/lib/colors'

const sections = [
  {
    title: '1. About FixCVNow',
    content: `FixCVNow is an AI-powered resume improvement platform that helps users improve the structure, formatting, grammar, and presentation of their existing resumes. The service allows users to upload their resumes, review improvements, and download enhanced versions of their resumes. FixCVNow provides tools for resume enhancement but does not guarantee job placement, interviews, or employment outcomes.`,
  },
  {
    title: '2. Eligibility',
    content: `By using FixCVNow, you confirm that:
• You are at least 18 years old or have the consent of a parent or guardian.
• You have the legal right to upload and use the content contained in your resume.
• The information you upload does not violate any applicable laws or third-party rights.`,
  },
  {
    title: '3. User Responsibilities',
    content: `Users are responsible for:
• Ensuring the accuracy of information provided in their resumes.
• Reviewing the final resume before using it for job applications.
• Ensuring that uploaded content does not contain illegal, harmful, or misleading material.

Users agree not to use FixCVNow for unlawful purposes or to generate misleading or fraudulent professional information.`,
  },
  {
    title: '4. AI-Generated Content Disclaimer',
    content: `FixCVNow uses artificial intelligence to generate resume improvements and suggestions. While we strive to provide useful and accurate improvements, AI-generated content may contain errors, omissions, or inaccuracies. Users must review and verify all generated content before submitting resumes to employers. FixCVNow does not guarantee the accuracy, completeness, or suitability of AI-generated content, and users assume full responsibility for how the content is used.`,
  },
  {
    title: '5. Service Description',
    content: `FixCVNow currently offers two primary services:

Professional CV — Provides basic resume improvements including grammar and spelling corrections, formatting improvements, resume structure organization, and an ATS-friendly layout.

AI Career Upgrade — Includes all Professional CV improvements plus additional AI enhancements such as profile summary rewriting, AI-generated role summaries, skills extraction, and resume keyword optimisation. The AI Career Upgrade version is generated after payment.`,
  },
  {
    title: '6. Payments',
    content: `Certain features of FixCVNow require payment. By purchasing a paid service:
• You agree to pay the stated price displayed on the website.
• Payments are processed through secure third-party payment gateways.
• FixCVNow does not store payment card details.
• All payments are one-time payments and not subscription-based unless explicitly stated.`,
  },
  {
    title: '7. Refund Policy',
    content: `Due to the nature of digital services and instant delivery, all purchases are generally non-refundable once the improved resume has been generated. However, if a user experiences a technical issue that prevents them from accessing their purchased resume, they may contact support for assistance. Refunds, if granted, are issued solely at the discretion of FixCVNow.`,
  },
  {
    title: '8. Data Handling',
    content: `Users acknowledge that resumes uploaded to the platform will be processed by automated systems. Uploaded resume files are automatically deleted within 24 hours. FixCVNow may retain limited structured data extracted during processing to improve the service. For more details, please refer to our Privacy Policy.`,
  },
  {
    title: '9. Intellectual Property',
    content: `All software, algorithms, website design, branding, and platform technology associated with FixCVNow remain the property of FixCVNow. Users may use the generated resumes for personal job applications but may not:
• Resell the service
• Reverse engineer the system
• Use the platform for commercial redistribution`,
  },
  {
    title: '10. Limitation of Liability',
    content: `FixCVNow is provided on an "as-is" and "as-available" basis. To the maximum extent permitted by law, FixCVNow shall not be liable for:
• Any employment decisions made by recruiters or employers
• Job application outcomes
• Errors or inaccuracies in AI-generated content
• Loss of employment opportunities
• Indirect or consequential damages arising from use of the service

Users assume full responsibility for reviewing and using their resumes.`,
  },
  {
    title: '11. Service Availability',
    content: `We aim to keep the service available at all times, but we do not guarantee uninterrupted or error-free access. FixCVNow may temporarily suspend or modify the service for maintenance, upgrades, or technical reasons.`,
  },
  {
    title: '12. Termination of Use',
    content: `We reserve the right to suspend or terminate access to FixCVNow if users:
• Violate these Terms
• Attempt to misuse the service
• Upload harmful or illegal content`,
  },
  {
    title: '13. Changes to These Terms',
    content: `We may update these Terms from time to time. Updated Terms will be posted on this page with the revised Last Updated date. Continued use of the service after changes means you accept the updated Terms.`,
  },
  {
    title: '14. Governing Law',
    content: `These Terms shall be governed by and interpreted in accordance with the applicable laws of the jurisdiction in which FixCVNow operates. Any disputes arising from the use of the service shall be subject to the jurisdiction of the competent courts in that region.`,
  },
  {
    title: '15. Contact Information',
    content: `If you have any questions regarding these Terms, please contact us:\nEmail: support@fixcvnow.com\nWebsite: https://www.fixcvnow.com`,
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <div className="py-16 px-6 text-center" style={{ backgroundColor: COLORS.bgLight }}>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3" style={{ color: COLORS.blue }}>
              Terms of Service
            </h1>
            <p className="text-slate-400 text-sm">Last Updated: 1st April 2026</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-16">
          <p className="text-slate-600 mb-12 leading-relaxed">
            These Terms of Service ("Terms") govern your use of the FixCVNow website and services. By accessing or using FixCVNow, you agree to comply with and be bound by these Terms. If you do not agree with these Terms, please do not use the service.
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
