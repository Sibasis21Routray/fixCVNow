// lib/word/index.js
// Dispatches to the correct Word document builder by templateId

import { buildClassicProfessionalDoc } from './classic-professional'
import { buildExecutiveNavyDoc } from './executive-navy'
import { buildMinimalSerifDoc } from './minimal-serif'
import { buildModernMinimalistDoc } from './modern-minimalist'
import { buildClassicBoldDoc } from './classic-bold'
import { buildClassicEarlyCareerDoc } from './classic-early-career'

export function getWordDocument(resumeData, templateId) {
  const id = Number(templateId)
  switch (id) {
    case 2: return buildExecutiveNavyDoc(resumeData)
    case 3: return buildMinimalSerifDoc(resumeData)
    case 4: return buildModernMinimalistDoc(resumeData)
    case 5: return buildClassicBoldDoc(resumeData)
    case 6: return buildClassicEarlyCareerDoc(resumeData)
    case 1:
    default: return buildClassicProfessionalDoc(resumeData)
  }
}
