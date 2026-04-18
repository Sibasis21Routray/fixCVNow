// lib/utils/invoice.js
import { Invoice } from '../../models/Invoice.js'

/**
 * Generates a sequential invoice number with RBGGOT prefix.
 * Format: RBGGOT 000001
 * 
 * @returns {Promise<string>}
 */
export async function generateSequentialInvoiceNumber() {
  try {
    // Find the latest invoice to get the last number
    // We filter for invoiceNumbers starting with 'RBGGOT '
    const lastInvoice = await Invoice.findOne({
      invoiceNumber: /^RBGGOT /
    }).sort({ createdAt: -1 })

    let nextNumber = 0

    if (lastInvoice) {
      const match = lastInvoice.invoiceNumber.match(/RBGGOT\s+(\d+)/)
      if (match && match[1]) {
        nextNumber = parseInt(match[1], 10) + 1
      }
    }

    // Pad with 6 zeros
    const paddedNumber = String(nextNumber).padStart(6, '0')
    return `RBGGOT ${paddedNumber}`
  } catch (err) {
    console.error('[InvoiceUtils] Failed to generate invoice number:', err.message)
    // Fallback to a timestamp based one if sequential fails
    return `RBGGOT ${Date.now()}`
  }
}
