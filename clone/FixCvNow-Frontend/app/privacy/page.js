import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { COLORS } from '@/lib/colors'

const sections = [
  {
    title: '1. Information We Collect',
    content: `1.1 Information You Provide
When you upload your resume or interact with our platform, we may collect:
• Name
• Email address (if provided)
• Resume content
• Employment history and professional details contained in your resume
• Skills and education details
• Any other information voluntarily provided by you

This information is necessary to provide the resume improvement service.

1.2 Automatically Collected Information
When you access our website, certain technical information may automatically be collected, including:
• IP address
• Browser type
• Device information
• Operating system
• Website usage data
• Log files and analytics data

This information helps us maintain security and improve the platform.

1.3 Payment Information
Payments are processed through secure third-party payment gateways. FixCVNow does not store your payment card details. Payment information is handled directly by the payment processor.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use your information to:
• Provide resume improvement services
• Process and analyse uploaded resumes
• Generate improved resume versions
• Improve the functionality and performance of our services
• Maintain system security and prevent misuse
• Provide customer support
• Comply with legal obligations

We do not sell your personal information to third parties.`,
  },
  {
    title: '3. Resume Processing and AI Technology',
    content: `FixCVNow uses artificial intelligence and automated tools to analyse and improve resumes. While we strive to provide accurate and helpful suggestions, AI-generated content may occasionally contain errors or inaccuracies. Users are responsible for reviewing and verifying the final resume before submitting it to employers. FixCVNow shall not be responsible for any consequences arising from the use of AI-generated resume content.`,
  },
  {
    title: '4. Data Storage and Retention',
    content: `We take data minimization seriously:
• Uploaded resume files are automatically deleted within 24 hours.
• Certain structured data extracted during processing may be temporarily stored to improve the service and maintain system performance.
• We retain data only for as long as necessary to provide the service or comply with legal obligations.
• Users may request deletion of their data where applicable.`,
  },
  {
    title: '5. Data Security',
    content: `We implement reasonable administrative, technical, and organizational safeguards designed to protect your information against unauthorized access, disclosure, alteration, or destruction. However, no method of internet transmission or electronic storage is completely secure. While we strive to protect your information, we cannot guarantee absolute security.`,
  },
  {
    title: '6. Sharing of Information',
    content: `We may share limited information with trusted third parties only when necessary, including:
• Payment processors
• Cloud infrastructure providers
• Security and analytics services

These service providers are required to protect your information and use it only for the purposes of providing services to FixCVNow. We do not sell or rent your personal data.`,
  },
  {
    title: '7. International Data Transfers',
    content: `FixCVNow may operate globally. Your information may be processed or stored on servers located outside your country of residence. By using our services, you consent to the transfer of your information to jurisdictions that may have different data protection laws. We take reasonable steps to ensure that such transfers comply with applicable privacy laws.`,
  },
  {
    title: '8. Your Rights',
    content: `Depending on applicable laws in your jurisdiction, you may have the right to:
• Request access to your personal data
• Request correction of inaccurate data
• Request deletion of your personal information
• Withdraw consent for data processing where applicable

To exercise these rights, please contact us using the information below.`,
  },
  {
    title: '9. Cookies and Analytics',
    content: `FixCVNow may use cookies and similar technologies to improve website functionality, analyse traffic and user behaviour, and enhance user experience. You may control cookie preferences through your browser settings.`,
  },
  {
    title: '10. Third-Party Links',
    content: `Our website may contain links to third-party websites or services. We are not responsible for the privacy practices or content of those third-party websites.`,
  },
  {
    title: "11. Children's Privacy",
    content: `FixCVNow services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that such information has been collected, we will take steps to delete it.`,
  },
  {
    title: '12. Changes to This Privacy Policy',
    content: `We may update this Privacy Policy from time to time to reflect changes in our services, legal requirements, or operational practices. The updated policy will be posted on this page with the revised "Last Updated" date.`,
  },
  {
    title: '13. Contact Us',
    content: `If you have any questions regarding this Privacy Policy or our data practices, please contact us at:\nEmail: support@fixcvnow.com\nWebsite: https://www.fixcvnow.com`,
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <div className="py-16 px-6 text-center" style={{ backgroundColor: COLORS.bgLight }}>
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3" style={{ color: COLORS.blue }}>
              Privacy Policy
            </h1>
            <p className="text-slate-400 text-sm">Last Updated: 1st April 2026</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-16">
          <p className="text-slate-600 mb-12 leading-relaxed">
            FixCVNow ("we", "our", or "us") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how FixCVNow collects, uses, processes, and protects the information you provide when using our website and services. By accessing or using FixCVNow, you agree to the practices described in this Privacy Policy.
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
