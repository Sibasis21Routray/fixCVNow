// models/Payment.js
import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true },
  orderId: { type: String, required: true, unique: true, index: true },
  paymentId: { type: String, default: null, index: true },
  signature: { type: String, default: null },
  purpose: { type: String, enum: ['download', 'download_pdf', 'download_word', 'optimize'], required: true },
  templateId: { type: Number, default: null },
  status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created', index: true },
  downloadConsumed: { type: Boolean, default: false },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  customerName: { type: String, default: null },
  email: { type: String, default: null },
  phone: { type: String, default: null },
  customerIP: { type: String, default: null },
  createdAt: { type: Date, default: Date.now, index: true },
  paidAt: { type: Date, default: null },
})

export const Payment = mongoose.model('Payment', paymentSchema)
