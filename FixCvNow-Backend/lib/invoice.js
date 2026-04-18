import { Invoice } from '../models/Invoice.js'
import { generateSequentialInvoiceNumber } from './utils/invoice.js'

export async function createInvoiceFromPayment(payment) {
  try {
    // Check if invoice already exists
    const existing = await Invoice.findOne({ paymentId: payment.paymentId })
    if (existing) return existing

    const invoiceNumber = await generateSequentialInvoiceNumber()
    
    const itemDescription = payment.purpose === 'optimize' ? 'AI-optimized' : 'Professional clean'

    const invoice = await Invoice.create({
      invoiceNumber,
      paymentId: payment.paymentId,
      sessionId: payment.sessionId,
      customerName: payment.customerName || 'Customer',
      email: payment.email,
      phone: payment.phone,
      amount: payment.amount,
      currency: payment.currency,
      purpose: payment.purpose,
      templateId: payment.templateId,
      items: [{
        description: itemDescription,
        qty: 1,
        rate: payment.amount,
        amount: payment.amount
      }],
      createdAt: payment.paidAt || new Date()
    })

    console.log(`[Invoice] Created: ${invoiceNumber} for payment ${payment.paymentId}`)
    return invoice
  } catch (err) {
    console.error('[Invoice] Creation error:', err.message)
    return null
  }
}
