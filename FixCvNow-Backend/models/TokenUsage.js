// models/TokenUsage.js
import mongoose from 'mongoose'

const tokenUsageSchema = new mongoose.Schema({
  operation:    { type: String, enum: ['extract', 'optimize'], required: true, index: true },
  sessionId:    { type: String, index: true },
  model:        { type: String, default: 'gpt-4o-mini' },
  inputTokens:  { type: Number, default: 0 },
  outputTokens: { type: Number, default: 0 },
  totalTokens:  { type: Number, default: 0 },
  // For extract: per-section breakdown { personal: {input,output,total,time_ms}, ... }
  sections:     { type: mongoose.Schema.Types.Mixed },
  durationMs:   { type: Number },
  timestamp:    { type: Date, default: Date.now, index: true },
})

export const TokenUsage = mongoose.models.TokenUsage ?? mongoose.model('TokenUsage', tokenUsageSchema)
