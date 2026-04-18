// this is components/ResumePreview.js
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lock,
  LockOpen,
  Info,
} from "lucide-react";
import { SecureDownloadIcon, ResumeOptimizeIcon } from "@/components/asset-icons";
import { COLORS } from "@/lib/colors";
import { resumeStorage } from "@/lib/storage";
import { toast } from "@/hooks/use-toast";
import { ClassicProfessionalTemplate } from "@/components/templates/classic-professional";
import { ExecutiveNavyTemplate } from "@/components/templates/executive-navy";
import { MinimalSerifTemplate } from "@/components/templates/minimal-serif";
import { ModernMinimalistTemplate } from "@/components/templates/modern-minimalist";
import { ClassicBoldTemplate } from "@/components/templates/classic-bold";
import { ClassicEarlyCareerTemplate } from "@/components/templates/classic-early-career";
import SessionExpired from "@/components/SessionExpired";
import InlineTemplateChooser from "@/components/InlineTemplateChooser";

// ─────────────────────────────────────────────
// Default sample data if extraction fails
// ─────────────────────────────────────────────
const SAMPLE_RESUME_DATA = {
  name: "John Doe",
  title: "Senior Product Manager",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  summary:
    "Results-driven Product Manager with 8+ years of experience building scalable products that drive revenue growth and customer satisfaction.",
  experience: [
    {
      role: "Senior Product Manager",
      company: "Tech Corp",
      start: "2021",
      end: null,
      description: [
        "Led cross-functional teams of 10+ engineers, designers, and marketers",
        "Increased user engagement by 45% through data-driven product decisions",
      ],
    },
    {
      role: "Product Manager",
      company: "Innovation Labs",
      start: "2018",
      end: "2021",
      description: [
        "Developed go-to-market strategy for 3 new product launches",
        "Reduced customer churn by 28% through feature prioritization",
      ],
    },
  ],
  skills: [
    "Product Strategy",
    "Data Analysis",
    "User Research",
    "Agile",
    "SQL",
    "Leadership",
  ],
  education: [
    { degree: "MBA", institution: "Stanford University", end: "2018" },
    {
      degree: "B.S. Computer Science",
      institution: "UC Berkeley",
      end: "2015",
    },
  ],
};

const noBlur = () => "";

const TEMPLATE_NAMES = {
  1: "Classic Professional",
  2: "Executive Navy",
  3: "Minimal Serif",
  4: "Modern Minimalist",
  5: "Classic Bold",
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// ─────────────────────────────────────────────
// Razorpay helpers
// ─────────────────────────────────────────────
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ─────────────────────────────────────────────
// Main ResumePreview Component
// ─────────────────────────────────────────────
export default function ResumePreview() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("id");
  const initialTemplateId = searchParams.get("template");
  const [activeTemplate, setActiveTemplate] = useState(
    Number(initialTemplateId) || 1
  );

  // Resume data
  const [resumeData, setResumeData] = useState(null);
  const [optimizedData, setOptimizedData] = useState(null);
  const [viewMode, setViewMode] = useState("original"); // 'original' | 'optimized'
  const [fileId, setFileId] = useState(null);

  // Optimization state
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizingMsgIndex, setOptimizingMsgIndex] = useState(0);
  const [optimizeFailed, setOptimizeFailed] = useState(false);
  // Stored after optimize payment verified — allows retry without re-paying
  const [optimizePaymentId, setOptimizePaymentId] = useState(null);

  // Shared download unlock — ₹9 unlocks both PDF and Word; resets after one download
  const [downloadUnlocked, setDownloadUnlocked] = useState(false);
  const [downloadPaymentId, setDownloadPaymentId] = useState(null);

  // Download loading states (true while generating file after payment)
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isDownloadingWord, setIsDownloadingWord] = useState(false);

  // Page load
  const [loading, setLoading] = useState(true);
  const [errorType, setErrorType] = useState(null);

  const OPTIMIZING_MESSAGES = [
    "Generating your AI Career Upgrade...",
    "Improving your profile summary...",
    "Optimizing role descriptions...",
    "Extracting key skills...",
    "Enhancing achievement phrasing...",
    "Adding ATS keywords...",
    "Final polishing...",
  ];

  useEffect(() => {
    if (!isOptimizing) return;
    setOptimizingMsgIndex(0);
    const interval = setInterval(() => {
      setOptimizingMsgIndex((prev) =>
        prev < OPTIMIZING_MESSAGES.length - 1 ? prev + 1 : prev
      );
    }, 3500);
    return () => clearInterval(interval);
  }, [isOptimizing]);

  // ── Restore state from sessionStorage on mount ──
  useEffect(() => {
    if (!sessionId) {
      setErrorType("invalid");
      setLoading(false);
      return;
    }

    const stored = resumeStorage.getResumeData(sessionId);
    if (!stored?.data) {
      setErrorType("missing");
      setLoading(false);
      return;
    }

    setResumeData(stored.data);

    // Restore fileId for optimize route
    const savedFileId = sessionStorage.getItem(`fileId_${sessionId}`);
    if (savedFileId) setFileId(savedFileId);

    // Restore optimized data
    const cachedOptimized = sessionStorage.getItem(`optimized_${sessionId}`);
    if (cachedOptimized) {
      try {
        setOptimizedData(JSON.parse(cachedOptimized));
        setViewMode("optimized");
      } catch {
        /* ignore bad cache */
      }
    }

    // Restore optimize paymentId (for retry after page refresh)
    const savedOptimizePaymentId = sessionStorage.getItem(
      `optimizePaymentId_${sessionId}`
    );
    if (savedOptimizePaymentId) setOptimizePaymentId(savedOptimizePaymentId);

    // Restore shared download unlock state (persisted so page refresh doesn't lose a paid unlock)
    const savedDownloadPaymentId = sessionStorage.getItem(`downloadPaymentId_${sessionId}`);
    if (savedDownloadPaymentId) { setDownloadPaymentId(savedDownloadPaymentId); setDownloadUnlocked(true); }

    setLoading(false);
  }, [sessionId]);

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => window.location.replace("/");
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // ── Core Razorpay flow ──
  // Opens Razorpay modal for the given purpose.
  // Calls onSuccess(paymentId) after verification, onDismiss on cancel.
  const openRazorpay = async ({ purpose, templateId, onSuccess, onDismiss }) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast({
        title: "Payment gateway unavailable",
        description: "Could not load Razorpay. Please check your connection and refresh.",
        variant: "destructive",
        duration: 6000,
      });
      onDismiss?.();
      return;
    }

    // Create order on backend
    let orderData;
    try {
      const res = await fetch(`${API_URL}/api/payment/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, purpose, templateId }),
      });
      if (!res.ok) throw new Error("Order creation failed");
      orderData = await res.json();
    } catch {
      toast({
        title: "Could not initiate payment",
        description: "Failed to create payment order. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      onDismiss?.();
      return;
    }

    const options = {
      key: orderData.key,
      amount: orderData.amount,
      currency: orderData.currency,
      order_id: orderData.orderId,
      name: "FixCVNow",
      description:
        purpose === "optimize"
          ? "AI Resume Optimization"
          : "Resume Download",
      prefill: { name: resumeData?.name || "" },
      theme: { color: COLORS.blue },

      handler: async (response) => {
        // Payment succeeded on Razorpay — now verify server-side
        try {
          const verifyRes = await fetch(`${API_URL}/api/payment/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              sessionId,
            }),
          });
          if (!verifyRes.ok) throw new Error("Verification failed");
          const verifyData = await verifyRes.json();
          onSuccess(verifyData.paymentId);
        } catch {
          toast({
            title: "Payment verification failed",
            description:
              "Your payment was received but verification failed. Please contact support with your session ID: " +
              sessionId,
            variant: "destructive",
            duration: 12000,
          });
          onDismiss?.();
        }
      },

      modal: {
        ondismiss: () => {
          onDismiss?.();
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", (response) => {
      toast({
        title: "Payment failed",
        description:
          response.error?.description ||
          "Payment was not completed. Please try again.",
        variant: "destructive",
        duration: 6000,
      });
      onDismiss?.();
    });
    rzp.open();
  };

  // ── Shared unlock (pay ₹9 — unlocks both PDF and Word, user picks one) ──
  const handleUnlockDownload = () => {
    openRazorpay({
      purpose: "download",
      templateId: activeTemplate,
      onSuccess: (paymentId) => {
        setDownloadPaymentId(paymentId);
        setDownloadUnlocked(true);
        sessionStorage.setItem(`downloadPaymentId_${sessionId}`, paymentId);
        toast({
          title: "Payment successful!",
          description: "Choose PDF or Word to download your resume.",
          duration: 4000,
        });
      },
      onDismiss: () => {},
    });
  };

  // ── Reset shared lock (called after either format is downloaded) ──
  const resetDownloadLock = () => {
    setDownloadUnlocked(false);
    setDownloadPaymentId(null);
    sessionStorage.removeItem(`downloadPaymentId_${sessionId}`);
  };

  // ── Download PDF (after unlock) ──
  const handleDownloadPdf = async () => {
    setIsDownloadingPdf(true);
    try {
      const res = await fetch(`${API_URL}/api/download/pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData: displayData,
          templateId: activeTemplate,
          paymentId: downloadPaymentId,
          sessionId,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "PDF generation failed");
      }
      const blob = await res.blob();
      triggerBlobDownload(blob, `${displayData.name || "resume"}.pdf`);
      resetDownloadLock();
    } catch (e) {
      toast({
        title: "Download failed",
        description: e.message || "Could not generate your PDF. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // ── Download Word (after unlock) ──
  const handleDownloadWord = async () => {
    setIsDownloadingWord(true);
    try {
      const res = await fetch(`${API_URL}/api/download/word`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData: displayData,
          templateId: activeTemplate,
          paymentId: downloadPaymentId,
          sessionId,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Word generation failed");
      }
      const blob = await res.blob();
      triggerBlobDownload(blob, `${displayData.name || "resume"}.docx`);
      resetDownloadLock();
    } catch (e) {
      toast({
        title: "Download failed",
        description: e.message || "Could not generate your Word document. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsDownloadingWord(false);
    }
  };

  // ── Run AI optimization (with paymentId for server verification) ──
  const runOptimization = async (paymentId) => {
    if (!resumeData) return;
    setIsOptimizing(true);
    setOptimizeFailed(false);

    try {
      const res = await fetch(`${API_URL}/api/optimize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData, fileId, paymentId, sessionId }),
      });

      if (!res.ok) throw new Error("Optimization failed");

      const data = await res.json();
      setOptimizedData(data.optimizedData);
      setViewMode("optimized");
      sessionStorage.setItem(
        `optimized_${sessionId}`,
        JSON.stringify(data.optimizedData)
      );
      // Clear the optimize paymentId — no longer needed after success
      sessionStorage.removeItem(`optimizePaymentId_${sessionId}`);
      setOptimizePaymentId(null);
      // Unlock download as part of the optimize purchase
      setDownloadPaymentId(paymentId);
      setDownloadUnlocked(true);
      sessionStorage.setItem(`downloadPaymentId_${sessionId}`, paymentId);
    } catch {
      setOptimizeFailed(true);
      toast({
        title: "Optimization failed",
        description:
          "Something went wrong while optimizing your resume. You can retry — no additional payment needed.",
        variant: "destructive",
        duration: 8000,
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  // ── Optimize button clicked (opens payment first) ──
  const handleOptimize = () => {
    openRazorpay({
      purpose: "optimize",
      onSuccess: (paymentId) => {
        // Store paymentId so retry doesn't re-charge
        setOptimizePaymentId(paymentId);
        sessionStorage.setItem(`optimizePaymentId_${sessionId}`, paymentId);
        runOptimization(paymentId);
      },
      onDismiss: () => {},
    });
  };

  // ── Retry optimization (uses already-paid paymentId, no new charge) ──
  const handleRetryOptimization = () => {
    if (optimizePaymentId) {
      runOptimization(optimizePaymentId);
    }
  };

  // ── Blob download helper ──
  const triggerBlobDownload = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ── Derived state ──
  const hasOptimized = !!optimizedData;
  const isPaidOptimizing = isOptimizing || (optimizePaymentId && !hasOptimized);
  const displayData =
    viewMode === "optimized" && optimizedData
      ? optimizedData
      : resumeData ?? SAMPLE_RESUME_DATA;

  // ── Template renderer ──
  const getTemplateContent = () => {
    const props = { data: displayData, getBlurClass: noBlur };
    switch (activeTemplate) {
      case 1: return <ClassicProfessionalTemplate {...props} />;
      case 2: return <ExecutiveNavyTemplate {...props} />;
      case 3: return <MinimalSerifTemplate {...props} />;
      case 4: return <ModernMinimalistTemplate {...props} />;
      case 5: return <ClassicBoldTemplate {...props} />;
      case 6: return <ClassicEarlyCareerTemplate {...props} />;
      default: return <ClassicProfessionalTemplate {...props} />;
    }
  };

  // ─────────────────────────────────────────────
  // Loading / Error screens
  // ─────────────────────────────────────────────
  if (loading) {
    return (
      <div className="px-6 py-12 min-h-screen flex items-center justify-center">
        <p className="text-slate-600 font-bold text-lg">Loading resume...</p>
      </div>
    );
  }

  if (errorType === "invalid") {
    return (
      <SessionExpired
        title="Invalid Link"
        message="This link is missing required parameters. Please upload your resume again to get started."
      />
    );
  }

  if (errorType === "missing") {
    return (
      <SessionExpired
        title="Session Not Found"
        message="Your session has expired or doesn't exist in this browser. Sessions are stored temporarily and are lost when you open the link in a new tab or browser."
      />
    );
  }

  // ─────────────────────────────────────────────
  // Main Render
  // ─────────────────────────────────────────────
  return (
    <div className="px-6 py-4 md:py-4 animate-in slide-in-from-bottom-4 duration-500 min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <InlineTemplateChooser
          activeTemplate={activeTemplate}
          setActiveTemplate={setActiveTemplate}
          resumeData={displayData}
        />

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ── Resume Preview ── */}
          <div className="lg:col-span-8">
            {/* Compare toggle — appears after optimization */}
            {optimizedData && (
              <div className="flex items-center gap-1.5 mb-4 bg-white rounded-xl p-1 border border-slate-200 shadow-sm w-fit">
                <button
                  onClick={() => setViewMode("original")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    viewMode === "original"
                      ? "bg-slate-800 text-white shadow"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Original
                </button>
                <button
                  onClick={() => setViewMode("optimized")}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    viewMode === "optimized"
                      ? "text-white shadow"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                  style={
                    viewMode === "optimized"
                      ? { backgroundColor: COLORS.green }
                      : {}
                  }
                >
                  <ResumeOptimizeIcon size={13} />
                  AI Optimized
                </button>
              </div>
            )}

            {/* Template */}
            <div
              className="bg-white rounded-2xl shadow-xl overflow-hidden border-4"
              style={{ borderColor: COLORS.border }}
            >
              <div
                className="h-[800px] overflow-y-auto"
                style={{ backgroundColor: "#fafafa" }}
              >
                {getTemplateContent()}
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 space-y-4">



               {/* ─────────────────────────────────────
                  OPTIMIZE CARD
                  Hidden after optimization completes
              ───────────────────────────────────── */}
              {!hasOptimized && !isOptimizing && (
                <div
                  className="bg-white rounded-2xl p-5 border-2 shadow-sm"
                  style={{ borderColor: COLORS.green }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${COLORS.green}18` }}
                    >
                      <ResumeOptimizeIcon size={19} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">
                        AI Optimized Resume
                      </h3>
                      <span
                        className="text-xs font-bold"
                        style={{ color: COLORS.green }}
                      >
                        ₹19 · One-time AI enhancement
                      </span>
                    </div>
                  </div>

                  <ul className="text-xs text-slate-600 space-y-1.5 mb-4">
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
                      ATS-friendly keywords
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
                      Strong action verbs
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
                      Quantified achievements
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-green-500 flex-shrink-0" />
                      Compare original vs AI version
                    </li>
                  </ul>

                  {optimizeFailed ? (
                    // Retry state — optimization failed but payment was made
                    <div>
                      <div className="flex items-center gap-2 mb-3 p-2.5 bg-red-50 rounded-lg">
                        <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                        <p className="text-xs text-red-600">
                          Optimization failed. No additional charge for retry.
                        </p>
                      </div>
                      <button
                        onClick={handleRetryOptimization}
                        className="w-full py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
                        style={{ backgroundColor: COLORS.green }}
                      >
                        <ResumeOptimizeIcon size={15} />
                        Retry Optimization (Free)
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={handleOptimize}
                      className="w-full py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
                      style={{ backgroundColor: COLORS.green }}
                    >
                      Pay ₹19 &amp; Optimize
                    </button>
                  )}
                </div>
              )}

              {/* ─────────────────────────────────────
                  DOWNLOAD CARD
              ───────────────────────────────────── */}
              <div className="bg-white rounded-2xl p-5 border-2 border-blue-200 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50">
                    <SecureDownloadIcon size={19} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">
                      Download Resume
                    </h3>
                    <span className="text-xs text-slate-400 font-medium">
                      ₹9 per download · PDF or Word
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                  Pay to unlock, then click to download. Switch template before
                  unlocking — each download is a separate payment.
                </p>

                {/* ── Version notice ── */}
                {hasOptimized && viewMode === "original" && (
                  <div className="flex items-start gap-2 mb-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                    <AlertCircle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-700 leading-relaxed">
                      You will download the <strong>original</strong> version.
                      Toggle to <strong>AI Optimized</strong> above to download
                      the enhanced version instead.
                    </p>
                  </div>
                )}
                {hasOptimized && viewMode === "optimized" && (
                  <div className="flex items-start gap-2 mb-3 p-2.5 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle2 size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-green-700 leading-relaxed">
                      You will download the <strong>AI optimized</strong> version.
                    </p>
                  </div>
                )}
                {!hasOptimized && (
                  <div className="flex items-start gap-2 mb-3 p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                    <Info size={14} className="text-blue-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Downloading original resume. Want the AI enhanced version?
                      Pay <strong>₹19</strong> to optimize first.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  {/* ── Single Pay button (locked state) ── */}
                  {!downloadUnlocked && !isDownloadingPdf && !isDownloadingWord && (
                    <button
                      className="w-full py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 flex items-center justify-center gap-2"
                      style={{ backgroundColor: COLORS.blue }}
                      onClick={handleUnlockDownload}
                    >
                      <Lock size={15} />
                      Pay ₹9 · Unlock Download
                    </button>
                  )}

                  {/* ── PDF Button (unlocked or downloading) ── */}
                  {(downloadUnlocked || isDownloadingPdf) && (
                    <button
                      className="w-full py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      style={{ backgroundColor: isDownloadingPdf ? COLORS.blue : "#16a34a" }}
                      onClick={handleDownloadPdf}
                      disabled={isDownloadingPdf || isDownloadingWord}
                    >
                      {isDownloadingPdf ? (
                        <><Loader2 size={15} className="animate-spin" />Generating PDF…</>
                      ) : (
                        <><LockOpen size={15} />Download PDF</>
                      )}
                    </button>
                  )}

                  {/* ── Word Button (unlocked or downloading) ── */}
                  {(downloadUnlocked || isDownloadingWord) && (
                    <button
                      className="w-full py-2.5 rounded-xl font-bold text-sm border-2 transition-all hover:bg-green-50 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      style={
                        isDownloadingWord
                          ? { borderColor: COLORS.blue, color: COLORS.blue }
                          : { borderColor: "#16a34a", color: "#16a34a" }
                      }
                      onClick={handleDownloadWord}
                      disabled={isDownloadingWord || isDownloadingPdf}
                    >
                      {isDownloadingWord ? (
                        <><Loader2 size={15} className="animate-spin" />Generating Word…</>
                      ) : (
                        <><LockOpen size={15} />Download Word</>
                      )}
                    </button>
                  )}
                </div>
              </div>

             

              {/* ─────────────────────────────────────
                  OPTIMIZING — loading state
              ───────────────────────────────────── */}
              {isOptimizing && (
                <div
                  className="bg-white rounded-2xl p-6 border-2 shadow-sm text-center"
                  style={{ borderColor: COLORS.green }}
                >
                  <Loader2
                    size={34}
                    className="animate-spin mx-auto mb-3"
                    style={{ color: COLORS.green }}
                  />
                  <p className="font-bold text-slate-700 text-sm mb-1">
                    {OPTIMIZING_MESSAGES[optimizingMsgIndex]}
                  </p>
                  <p className="text-xs text-slate-400">
                    This takes 15–30 seconds
                  </p>
                </div>
              )}

              {/* ─────────────────────────────────────
                  OPTIMIZATION COMPLETE
              ───────────────────────────────────── */}
              {hasOptimized && !isOptimizing && (
                <div
                  className="bg-white rounded-2xl p-5 border-2 shadow-sm"
                  style={{ borderColor: COLORS.green }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                    <h3 className="font-bold text-slate-800 text-sm">
                      AI Optimization Complete
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Use the <strong>toggle above</strong> the resume to compare
                    your original and AI-optimized versions. Download either
                    version using the buttons above.
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
