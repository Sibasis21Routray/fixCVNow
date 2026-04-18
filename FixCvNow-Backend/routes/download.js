// server/routes/download.js
// PDF and Word download — uses the same lib files as Next.js routes
// tsx handles the JSX transformation in lib/pdf/*.jsx files
import { Router } from 'express'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { renderToBuffer } from '@react-pdf/renderer'
import { Packer } from 'docx'
import { Payment } from '../models/Payment.js'
import { Invoice } from '../models/Invoice.js'
import { trackConversion } from '../lib/middleware/ipBlock.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// pathToFileURL required on Windows for dynamic imports with absolute paths
const { getPDFComponent, getInvoicePDFComponent } = await import(pathToFileURL(path.resolve(__dirname, '../lib/pdf/index.js')).href)
const { getWordDocument } = await import(pathToFileURL(path.resolve(__dirname, '../lib/word/index.js')).href)
const { createInvoiceFromPayment } = await import(pathToFileURL(path.resolve(__dirname, '../lib/invoice.js')).href)

const router = Router()

// POST /api/download/pdf
router.post('/pdf', async (req, res) => {
  const start = Date.now()
  try {
    const { resumeData, templateId, paymentId, sessionId } = req.body

    if (!resumeData) {
      return res.status(400).json({ error: 'Missing resumeData' })
    }

    if (!sessionId || !paymentId) {
      return res.status(402).json({ error: 'Payment required for download' })
    }

    // Verify payment exists, is paid, and not consumed
    const payment = await Payment.findOne({
      sessionId,
      paymentId,
      status: 'paid',
      downloadConsumed: false
    })

    if (!payment) {
      return res.status(402).json({ error: 'Payment not found, already consumed, or invalid' })
    }

    const pdfElement = getPDFComponent(resumeData, templateId ?? 1)
    const buffer = await renderToBuffer(pdfElement)
    const filename = `${(resumeData.name || 'resume').replace(/[^a-z0-9]/gi, '_')}.pdf`

    // Mark as consumed AFTER successful generation
    payment.downloadConsumed = true
    await payment.save()

    const ms = Date.now() - start
    console.log(`[Download PDF] template:${templateId ?? 1} | size: ${(buffer.length / 1024).toFixed(1)} KB | time: ${(ms / 1000).toFixed(2)}s | file: ${filename} | payment: ${paymentId}`)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.setHeader('Content-Length', String(buffer.length))
    res.send(buffer)
    
    // Reset IP block count on conversion
    trackConversion(req.userIP).catch(() => {})

  } catch (err) {
    console.error(`[Download PDF] Error (${((Date.now() - start) / 1000).toFixed(2)}s):`, err.message)
    res.status(500).json({ error: 'PDF generation failed', message: err.message })
  }
})

// POST /api/download/word
router.post('/word', async (req, res) => {
  const start = Date.now()
  try {
    const { resumeData, templateId, paymentId, sessionId } = req.body

    if (!resumeData) {
      return res.status(400).json({ error: 'Missing resumeData' })
    }

    if (!sessionId || !paymentId) {
      return res.status(402).json({ error: 'Payment required for download' })
    }

    // Verify payment exists, is paid, and not consumed
    const payment = await Payment.findOne({
      sessionId,
      paymentId,
      status: 'paid',
      downloadConsumed: false
    })

    if (!payment) {
      return res.status(402).json({ error: 'Payment not found, already consumed, or invalid' })
    }

    const doc = getWordDocument(resumeData, templateId ?? 1)
    const buffer = await Packer.toBuffer(doc)
    const filename = `${(resumeData.name || 'resume').replace(/[^a-z0-9]/gi, '_')}.docx`

    // Mark as consumed AFTER successful generation
    payment.downloadConsumed = true
    await payment.save()

    const ms = Date.now() - start
    console.log(`[Download Word] template:${templateId ?? 1} | size: ${(buffer.length / 1024).toFixed(1)} KB | time: ${(ms / 1000).toFixed(2)}s | file: ${filename} | payment: ${paymentId}`)

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.setHeader('Content-Length', String(buffer.length))
    res.send(buffer)
    
    // Reset IP block count on conversion
    trackConversion(req.userIP).catch(() => {})

  } catch (err) {
    console.error(`[Download Word] Error (${((Date.now() - start) / 1000).toFixed(2)}s):`, err.message)
    res.status(500).json({ error: 'Word generation failed', message: err.message })
  }
})

// POST /api/download/invoice - generates invoice after payment
router.post('/invoice', async (req, res) => {
  const start = Date.now()
  try {
    const { sessionId, paymentId, resumeData } = req.body

    if (!sessionId || !paymentId) {
      return res.status(400).json({ error: 'Missing sessionId or paymentId' })
    }

    // Find the payment (already consumed download payment is fine for invoice)
    const payment = await Payment.findOne({
      sessionId,
      paymentId,
      status: 'paid'
    })

    if (!payment) {
      return res.status(402).json({ error: 'Valid payment required for invoice' })
    }

    // Try to find stored invoice
    let storedInvoice = await Invoice.findOne({ paymentId })

    // If missing (background task hasn't finished), create it now
    if (!storedInvoice && payment) {
      console.log(`[Invoice PDF] Stored invoice missing for ${paymentId}, creating now...`)
      storedInvoice = await createInvoiceFromPayment(payment)
    }

    const invoiceData = storedInvoice ? {
      customerName: storedInvoice.customerName,
      email: storedInvoice.email,
      phone: storedInvoice.phone,
      sessionId: storedInvoice.sessionId,
      paymentId: storedInvoice.paymentId,
      amount: storedInvoice.amount,
      currency: storedInvoice.currency,
      date: storedInvoice.createdAt,
      description: storedInvoice.items[0]?.description || 'Resume Service',
      templateId: storedInvoice.templateId,
      purpose: storedInvoice.purpose,
      invoiceNumber: storedInvoice.invoiceNumber,
      items: storedInvoice.items
    } : {
      customerName: resumeData?.name || 'Customer',
      email: resumeData?.email || '',
      phone: resumeData?.phone || '',
      sessionId: payment.sessionId,
      paymentId: payment.paymentId,
      amount: payment.amount,
      currency: payment.currency,
      date: payment.paidAt || payment.createdAt,
      description: payment.purpose === 'optimize' ? 'AI-optimized' : 'Professional clean',
      templateId: payment.templateId,
      purpose: payment.purpose,
      items: null // Will use fallback in PDF component
    }

    const pdfElement = await getInvoicePDFComponent(invoiceData)
    const buffer = await renderToBuffer(pdfElement)
    // Extract the 6-digit sequential part if available (e.g., from 'RBGGOT 000048')
    const invNo = invoiceData.invoiceNumber?.match(/\d+/)?.[0] || payment.paymentId.slice(-6);
    const filename = `invoice_${invNo}.pdf`

    const ms = Date.now() - start
    console.log(`[Invoice PDF] payment:${paymentId} | size: ${(buffer.length / 1024).toFixed(1)} KB | time: ${(ms / 1000).toFixed(2)}s | file: ${filename}`)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.setHeader('Content-Length', String(buffer.length))
    res.send(buffer)

  } catch (err) {
    console.error(`[Invoice PDF] Error (${((Date.now() - start) / 1000).toFixed(2)}s):`, err.message)
    res.status(500).json({ error: 'Invoice generation failed', message: err.message })
  }
})

export default router
