// routes/payment.js
// Razorpay payment integration — order creation, verification, and webhook
import { Router } from 'express'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { Payment } from '../models/Payment.js'
import { Pricing } from '../models/Pricing.js'
import { createInvoiceFromPayment } from '../lib/invoice.js'
import { trackConversion } from '../lib/middleware/ipBlock.js'

const router = Router()

// Price map in paise (1 INR = 100 paise)
const PRICES = {
  download: 900,   // ₹9 — unlocks both PDF and Word (user picks one)
  download_pdf: 900,   // ₹9 (legacy, kept for backwards compat)
  download_word: 900,   // ₹9 (legacy, kept for backwards compat)
  optimize: 1900,  // ₹19
}

function getRazorpay() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })
}

// ── GET /api/payment/pricing ──────────────────────────────
// Returns the currently active dynamic prices (after discount config)
router.get('/pricing', async (req, res) => {
  try {
    const pricing = await Pricing.findOne({ configId: 'global' })
    const result = { 
      download: { original: 9, final: 9, hasOffer: false }, 
      optimize: { original: 19, final: 19, hasOffer: false } 
    }
    
    if (pricing) {
      for (const key of ['download', 'optimize']) {
        if (pricing[key]) {
          let original = pricing[key].price || (key === 'download' ? 9 : 19)
          let final = original
          let hasOffer = false
          let expiresAt = null
          if (pricing[key].offerDiscount > 0 && pricing[key].offerDuration && new Date(pricing[key].offerDuration) > new Date()) {
            final = Math.round(original * (1 - pricing[key].offerDiscount / 100))
            hasOffer = true
            expiresAt = pricing[key].offerDuration
          }
          result[key] = { original, final, hasOffer, discount: pricing[key].offerDiscount, expiresAt }
        }
      }
    }
    
    res.json(result)
  } catch (err) {
    console.error('[Payment] pricing fetch error:', err.message)
    res.status(500).json({ error: 'Failed to fetch pricing' })
  }
})

// ── POST /api/payment/create-order ──────────────────────────────
// Called by frontend before opening Razorpay modal.
// Creates a Razorpay order and saves it in DB.
router.post('/create-order', async (req, res) => {
  try {
    const { sessionId, purpose, templateId, customerName, email, phone } = req.body

    if (!sessionId || !purpose) {
      return res.status(400).json({ error: 'Invalid request: missing sessionId or purpose' })
    }

    let normalizedPurpose = purpose
    if (purpose === 'download_pdf' || purpose === 'download_word') {
       normalizedPurpose = 'download'
    }

    if (normalizedPurpose !== 'download' && normalizedPurpose !== 'optimize') {
      return res.status(400).json({ error: 'Invalid purpose' })
    }

    // Fetch dynamic pricing
    let pricing = await Pricing.findOne({ configId: 'global' })
    let amount = 900 // Fallback
    
    if (pricing && pricing[normalizedPurpose]) {
      const config = pricing[normalizedPurpose]
      let currentPrice = config.price
      
      // Check if there is an active offer
      if (config.offerDiscount > 0 && config.offerDuration && new Date(config.offerDuration) > new Date()) {
         currentPrice = currentPrice * (1 - config.offerDiscount / 100)
      }
      
      amount = Math.round(currentPrice * 100) // Convert to paise
    } else {
       // use old fallback logic
       const FALLBACK_PRICES = { download: 900, optimize: 1900 }
       amount = FALLBACK_PRICES[normalizedPurpose]
    }

    const razorpay = getRazorpay()

    const order = await razorpay.orders.create({
      amount,
      currency: 'INR',
      receipt: `fcn_${sessionId.slice(-8)}_${purpose.slice(0, 3)}_${Date.now()}`,
    })

    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress
    await Payment.create({
      sessionId,
      orderId: order.id,
      purpose,
      templateId: templateId ?? null,
      amount,
      customerName: customerName ?? null,
      email: email ?? null,
      phone: phone ?? null,
      customerIP: ip,
      status: 'created',
    })

    console.log(`[Payment] Order created: ${order.id} | purpose: ${purpose} | ₹${amount / 100}`)

    res.json({
      orderId: order.id,
      amount,
      currency: 'INR',
      key: process.env.RAZORPAY_KEY_ID,
    })
  } catch (err) {
    console.error('[Payment] create-order error:', err.message)
    res.status(500).json({ error: 'Failed to create payment order' })
  }
})

// ── POST /api/payment/verify ─────────────────────────────────────
// Called by frontend after Razorpay handler fires success callback.
// Verifies HMAC signature and marks payment as paid.
router.post('/verify', async (req, res) => {
  try {
    const { orderId, razorpay_payment_id, razorpay_signature, sessionId } = req.body

    if (!orderId || !razorpay_payment_id || !razorpay_signature || !sessionId) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Verify Razorpay signature
    const body = `${orderId}|${razorpay_payment_id}`
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex')

    if (expectedSignature !== razorpay_signature) {
      console.warn(`[Payment] Invalid signature for order ${orderId}`)
      return res.status(400).json({ error: 'Invalid payment signature' })
    }

    // Find the order
    const payment = await Payment.findOne({ orderId })
    if (!payment) {
      return res.status(404).json({ error: 'Order not found' })
    }
    if (payment.sessionId !== sessionId) {
      console.warn(`[Payment] Session mismatch for order ${orderId}`)
      return res.status(403).json({ error: 'Session mismatch' })
    }

    // Idempotent — if already marked paid (e.g. webhook fired first), just return success
    if (payment.status === 'paid') {
      console.log(`[Payment] Already verified: ${orderId}`)
      return res.json({ success: true, paymentId: payment.paymentId })
    }

    // Mark paid
    payment.paymentId = razorpay_payment_id
    payment.signature = razorpay_signature
    payment.status = 'paid'
    payment.paidAt = new Date()
    await payment.save()

    // Generate invoice in background
    createInvoiceFromPayment(payment).catch(e => console.error('[Payment] Invoice generation failed:', e.message))

    // Reset IP block count on payment verification
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress
    trackConversion(ip).catch(() => {})

    console.log(`[Payment] Verified: ${orderId} | paymentId: ${razorpay_payment_id}`)
    res.json({ success: true, paymentId: razorpay_payment_id })

  } catch (err) {
    console.error('[Payment] verify error:', err.message)
    res.status(500).json({ error: 'Payment verification failed' })
  }
})

// ── POST /api/payment/webhook ────────────────────────────────────
// Called by Razorpay servers on payment.captured / payment.failed.
// Body is raw (not JSON-parsed) — must be registered before express.json().
// Provides a safety net if the frontend /verify call fails (network drop, tab close).
router.post('/webhook', (req, res) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
  const signature = req.headers['x-razorpay-signature']

  // If no webhook secret configured, acknowledge without processing
  if (!webhookSecret) {
    console.warn('[Webhook] RAZORPAY_WEBHOOK_SECRET not set — skipping signature check')
    return res.status(200).json({ ok: true })
  }

  // Verify signature using raw body
  const rawBody = req.body // Buffer when express.raw() is used
  const expectedSignature = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex')

  if (expectedSignature !== signature) {
    console.warn('[Webhook] Invalid signature')
    return res.status(400).json({ error: 'Invalid webhook signature' })
  }

  let event
  try {
    event = JSON.parse(rawBody.toString())
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body' })
  }

  console.log(`[Webhook] Event: ${event.event}`)

  if (event.event === 'payment.captured') {
    const rp = event.payload.payment.entity
    Payment.findOneAndUpdate(
      { orderId: rp.order_id, status: { $ne: 'paid' } },
      { status: 'paid', paymentId: rp.id, paidAt: new Date() },
      { returnDocument: 'after' },
    ).then((payment) => {
      if (payment) {
        createInvoiceFromPayment(payment).catch(e => console.error('[Webhook] Invoice generation failed:', e.message))
        // Reset IP block count on webhook conversion
        trackConversion(payment.customerIP).catch(() => {})
      }
    }).catch((err) => console.error('[Webhook] DB update error:', err.message))
  }

  if (event.event === 'payment.failed') {
    const rp = event.payload.payment.entity
    Payment.findOneAndUpdate(
      { orderId: rp.order_id, status: 'created' },
      { status: 'failed' },
      { returnDocument: 'before' },
    ).catch((err) => console.error('[Webhook] DB update error:', err.message))
  }

  res.status(200).json({ ok: true })
})

export default router
