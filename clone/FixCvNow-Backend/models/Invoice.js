import mongoose from 'mongoose'

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true, index: true },
  paymentId: { type: String, required: true, index: true },
  sessionId: { type: String, required: true, index: true },
  customerName: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  purpose: { type: String, required: true },
  templateId: { type: Number },
  items: [{
    description: String,
    qty: { type: Number, default: 1 },
    rate: Number,
    amount: Number
  }],
  createdAt: { type: Date, default: Date.now }
})

export const Invoice = mongoose.model('Invoice', invoiceSchema)
