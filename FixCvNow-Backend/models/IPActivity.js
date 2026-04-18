import mongoose from 'mongoose'

const IPActivitySchema = new mongoose.Schema({
  ip: { type: String, required: true, unique: true },
  parseCount: { type: Number, default: 0 },
  lastActivity: { type: Date, default: Date.now },
  blockedUntil: { type: Date, default: null },
}, { timestamps: true })

// Index for automatic cleanup or quick lookups
IPActivitySchema.index({ ip: 1 })
IPActivitySchema.index({ blockedUntil: 1 })

export const IPActivity = mongoose.model('IPActivity', IPActivitySchema)
