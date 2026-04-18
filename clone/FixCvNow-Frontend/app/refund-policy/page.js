import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { COLORS } from '@/lib/colors'

const sections = [
  {
    title: '1. Nature of the Service',
    content: `FixCVNow provides digital resume improvement services that are delivered instantly after processing. Once a resume has been processed and the improved version is generated, the service is considered delivered. Due to the nature of digital services, most purchases are not eligible for refunds.`,
  },
  {
    title: '2. Non-Refundable Services',
    content: `Payments made for the following services are generally non-refundable:
• Professional CV improvements
• AI Career Upgrade resume generation
• Downloaded resume files

Once the improved resume has been generated and made available for download, the service is considered completed.`,
  },
  {
    title: '3. Exceptions for Technical Issues',
    content: `In certain cases, refunds may be considered if:
• The user successfully completed payment but did not receive access to the improved resume.
• A technical error prevented the resume from being generated.
• The service failed to function due to a system error.

In such cases, users should contact FixCVNow support with proof of payment. Refund requests are reviewed on a case-by-case basis.`,
  },
  {
    title: '4. Duplicate Payments',
    content: `If a user is accidentally charged multiple times for the same service, the duplicate charge may be refunded after verification.`,
  },
  {
    title: '5. AI Content Disclaimer',
    content: `FixCVNow uses artificial intelligence to generate resume improvements. While we strive to provide helpful suggestions, AI-generated content may occasionally contain errors or require user review. Users are responsible for reviewing the generated resume before using it for job applications. Refunds will not be issued solely due to dissatisfaction with AI-generated suggestions.`,
  },
  {
    title: '6. Payment Processing',
    content: `Payments are processed through secure third-party payment gateways. FixCVNow does not store payment card information. Refund processing times may depend on the policies of the payment provider or the user's bank.`,
  },
  {
    title: '7. Contact for Support',
    content: `If you experience a technical issue with your purchase, please contact us:\nEmail: support@fixcvnow.com\nWebsite: https://www.fixcvnow.com\n\nPlease include:\n• Payment confirmation\n• Date of purchase\n• Description of the issue`,
  },
  {
    title: '8. Policy Updates',
    content: `FixCVNow reserves the right to modify this Refund & Cancellation Policy at any time. Updated policies will be published on this page with the revised Last Updated date.`,
  },
]

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <div className="py-16 px-6 text-center" style={{ backgroundColor: COLORS.bgLight }}>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3" style={{ color: COLORS.blue }}>
              Refund &amp; Cancellation Policy
            </h1>
            <p className="text-slate-400 text-sm">Last Updated: 1st April 2026</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-16">
          <p className="text-slate-600 mb-12 leading-relaxed">
            This Refund &amp; Cancellation Policy explains the conditions under which refunds may be issued for services purchased through FixCVNow. By purchasing a service from FixCVNow, you agree to this policy.
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
