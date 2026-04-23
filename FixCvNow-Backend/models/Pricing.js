import mongoose from 'mongoose'

const pricingSchema = new mongoose.Schema({
  configId: { type: String, default: 'global', unique: true },
  download: {
    price: { type: Number, default: 0 },
    offerDiscount: { type: Number, default: 0 }, // percentage 0-100
    offerDuration: { type: Date, default: null }, // offer valid until
  },
  optimize: {
    price: { type: Number, default: 0 },
    offerDiscount: { type: Number, default: 0 }, // percentage 0-100
    offerDuration: { type: Date, default: null }, // offer valid until
  },
  updatedAt: { type: Date, default: Date.now }
})

export const Pricing = mongoose.models.Pricing ?? mongoose.model('Pricing', pricingSchema)
