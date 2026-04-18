// this is app/page.js
"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LandingPage from "@/components/LandingPage";
import UploadPage from "@/components/UploadPage";
import ProcessingPage from "@/components/ProcessingPage";
import TemplateSelector from "@/components/TemplateSelector";
import ResumePreview from "@/components/ResumePreview";
import { COLORS } from "@/lib/colors";

export default function Home() {
  const [step, setStep] = useState("landing");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Navigation handlers
  const goToLanding = () => {
    setStep("landing");

    // remove hash
    window.history.replaceState(null, "", "/");

    // scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goToUpload = () => setStep("upload");
  const goToProcessing = () => setStep("processing");
  const goToTemplates = () => setStep("templates");
  const goToPreview = (templateId) => {
    setSelectedTemplate(templateId);
    setStep("preview");
  };
  const goBackToTemplates = () => setStep("templates");

  const navigateToSection = (sectionId) => {
    setStep("landing");

    setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 50);
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: COLORS.bgLight }}
    >
      {/* Navbar */}
      <Navbar
        onLogoClick={goToLanding}
        onHomeClick={goToLanding}
        onNavigateToSection={navigateToSection}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full transition-all duration-300">
        {/* Landing Page */}
        {step === "landing" && <LandingPage onStart={goToUpload} />}

        {/* Upload Page */}
        {step === "upload" && <UploadPage onUpload={goToProcessing} />}

        {/* Processing Page */}
        {step === "processing" && <ProcessingPage onFinished={goToTemplates} />}

        {/* Template Selector */}
        {step === "templates" && <TemplateSelector onSelect={goToPreview} />}

        {/* Resume Preview */}
        {step === "preview" && (
          <ResumePreview
            templateId={selectedTemplate}
            onBack={goBackToTemplates}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
