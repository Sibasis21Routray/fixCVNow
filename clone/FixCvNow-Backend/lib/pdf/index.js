// lib/pdf/index.js
// Dispatches to the correct PDF template by templateId
// Uses React.createElement instead of JSX so this .js file needs no JSX transform

import React from 'react'
import { ClassicProfessionalPDF } from './classic-professional.jsx'
import { ExecutiveNavyPDF } from './executive-navy.jsx'
import { MinimalSerifPDF } from './minimal-serif.jsx'
import { ModernMinimalistPDF } from './modern-minimalist.jsx'
import { ClassicBoldPDF } from './classic-bold.jsx'
import { ClassicEarlyCareerPDF } from './classic-early-career.jsx'
import { InvoicePDF } from './invoice.jsx'

export async function getInvoicePDFComponent(invoiceData) {
  if (!InvoicePDF) {
    throw new Error('InvoicePDF component is not defined')
  }
  return React.createElement(InvoicePDF, { data: invoiceData })
}

export function getPDFComponent(data, templateId) {
  const id = Number(templateId)
  switch (id) {
    case 2: return React.createElement(ExecutiveNavyPDF, { data })
    case 3: return React.createElement(MinimalSerifPDF, { data })
    case 4: return React.createElement(ModernMinimalistPDF, { data })
    case 5: return React.createElement(ClassicBoldPDF, { data })
    case 6: return React.createElement(ClassicEarlyCareerPDF, { data })
    case 1:
    default: return React.createElement(ClassicProfessionalPDF, { data })
  }
}
