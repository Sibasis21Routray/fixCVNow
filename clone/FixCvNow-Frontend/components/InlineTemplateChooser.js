"use client";

import { ClassicPreview } from "@/components/templates/classic-professional";
import { NavyPreview } from "@/components/templates/executive-navy";
import { SerifPreview } from "@/components/templates/minimal-serif";
import { ModernPreview } from "@/components/templates/modern-minimalist";
import { ClassicBoldPreview } from "@/components/templates/classic-bold";
import { EarlyCareerPreview } from "@/components/templates/classic-early-career";
import { COLORS } from "@/lib/colors";

export default function InlineTemplateChooser({
  activeTemplate,
  setActiveTemplate,
  resumeData,
}) {
  const templates = [
    {
      id: 1,
      name: "Classic Professional",
      preview: <ClassicPreview data={resumeData} />,
      scale: 0.28,
    },
    {
      id: 2,
      name: "Navy",
      preview: <NavyPreview data={resumeData} />,
      scale: 0.28,
    },
    {
      id: 3,
      name: "Serif",
      preview: <SerifPreview data={resumeData} />,
      scale: 0.28,
    },
    {
      id: 4,
      name: "Modern Minimalist",
      preview: <ModernPreview data={resumeData} />,
      scale: 0.19,
    },
    {
      id: 5,
      name: "Classic Bold",
      preview: <ClassicBoldPreview data={resumeData} />,
      scale: 0.28,
    },
    {
      id: 6,
      name: "Early Career",
      preview: <EarlyCareerPreview data={resumeData} />,
      scale: 0.28,
    },
  ];

  return (
    <div className="mb-6">
      {/* Title */}
      <p
        className="text-xs font-bold uppercase tracking-wider mb-3"
        style={{ color: COLORS.blue }}
      >
        Choose Template
      </p>

      {/* Small fixed thumbnails */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {templates.map((template) => (
          <div
            key={template.id}
            onClick={() => setActiveTemplate(template.id)}
            className={`flex-shrink-0 cursor-pointer rounded-md border transition-all ${
              activeTemplate === template.id
                ? "border-green-500 shadow-sm scale-105"
                : "border-slate-200 hover:border-slate-300"
            }`}
            style={{ width: "110px" }}
          >
            {/* Preview */}
            <div
              className="bg-white overflow-hidden rounded-t-md"
              style={{ height: "70px" }}
            >
              <div
                style={{
                  transform: `scale(${template.scale})`,
                  transformOrigin: "top left",
                  width: `${Math.round(100 / template.scale)}%`,
                }}
              >
                {template.preview}
              </div>
            </div>

            {/* Name */}
            <div className="py-1 text-center bg-white rounded-b-md">
              <p className="text-[10px] font-semibold text-slate-600">
                {template.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}