# Payment Flow

## Overview

FixCVNow uses a **pay-per-resume** model. Users pay once per uploaded resume session, not per download. Two payment tiers exist.

> **Current status**: Payment UI is fully implemented. The actual payment gateway (Razorpay/Stripe) has not been integrated yet. The "Pay Now" button in the modal currently simulates a successful payment for development/testing purposes.

---

## Pricing Tiers

| Tier | Price | What You Get |
|------|-------|-------------|
| Basic | ₹9 | Download your formatted resume as PDF |
| Optimized | ₹20 | AI rewrites summary & experience + download PDF |

---

## Payment States

Payment state is stored in `sessionStorage` as `payment_<sessionId>` with one of three values:

| Value | Meaning |
|-------|---------|
| `'none'` | No payment made (default) |
| `'basic'` | Paid ₹9 — download unlocked |
| `'optimized'` | Paid ₹20 — AI optimize + download unlocked |

State persists across template changes within the same browser tab (because it's keyed by `sessionId`, not by template).

---

## User Flow

### ₹9 Download Flow

```
User clicks "Download PDF"
      ↓
PaymentModal opens (₹9 plan features shown)
      ↓
User clicks "Pay ₹9"
      [payment gateway — not yet integrated]
      ↓
paymentStatus → 'basic'  (saved to sessionStorage)
      ↓
Modal closes
      ↓
POST /api/download/pdf called → server generates PDF → browser downloads file
      ↓
All future downloads on this session are free
```

### ₹20 Optimize + Download Flow

```
User clicks "Optimize with AI"
      ↓
PaymentModal opens (₹20 plan features shown)
      ↓
User clicks "Pay ₹20"
      [payment gateway — not yet integrated]
      ↓
POST /api/optimize-resume called
      ↓
Loading spinner shown while API processes
      ↓
optimizedData saved to sessionStorage
paymentStatus → 'optimized'  (saved to sessionStorage)
      ↓
Optimize card removed from sidebar permanently
Compare toggle (Original | AI Optimized) appears
      ↓
Download is now free (no further payment needed)
```

---

## UI: PaymentModal Component

The `PaymentModal` is an inline component inside `ResumePreview.js`. It is a full-screen overlay with a centered card.

### Props (internal state driving the modal)

| State | Type | Description |
|-------|------|-------------|
| `showPaymentModal` | boolean | Whether the modal is visible |
| `paymentType` | `'basic' \| 'optimized'` | Which tier is being shown |

### Modal Content by Tier

**Basic (₹9)**
- "Download Your Formatted Resume"
- Features: Professional PDF, Chosen template, ATS-friendly format
- CTA: "Pay ₹9 & Download"

**Optimized (₹20)**
- "AI Optimize + Download"
- Features: Everything in Basic + AI-rewritten summary, Stronger bullet points, ATS keyword optimization
- CTA: "Pay ₹20 & Optimize"

---

## Payment Gateway Integration (Future)

When integrating a real payment gateway (Razorpay recommended for Indian INR payments):

### Recommended Flow

1. On "Pay Now" click, call your backend to create an order:
   ```
   POST /api/create-order
   Body: { amount: 1000, sessionId }  // amount in paise
   Response: { orderId, amount, currency }
   ```

2. Open the Razorpay checkout widget with the `orderId`

3. On successful payment, Razorpay calls your webhook:
   ```
   POST /api/payment-webhook
   Body: { orderId, paymentId, signature }
   ```

4. Verify the signature server-side, then return success to client

5. Client sets `paymentStatus` in sessionStorage and proceeds with download/optimization

### Razorpay Integration Checklist

- [ ] Install `razorpay` npm package on server
- [ ] Create `/api/create-order` route
- [ ] Create `/api/payment-webhook` route with signature verification
- [ ] Add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to `.env.local`
- [ ] Load Razorpay checkout script in browser
- [ ] Handle payment failure gracefully (show error, keep modal open)

### Alternative: Stripe

Stripe also supports INR payments. The flow is similar but uses `PaymentIntent` instead of `order`.

---

## Security Considerations (for payment integration)

- Never trust client-side payment status for sensitive operations
- If optimization results should be gated, verify payment server-side before calling OpenAI
- Webhook signature verification is mandatory to prevent fake payment confirmations
- Consider storing `sessionId → paymentStatus` in a short-lived Redis cache (1 hour) server-side as a source of truth after payment is verified
- The current `sessionStorage`-only approach is acceptable while payment is not integrated, but must be hardened before going live
