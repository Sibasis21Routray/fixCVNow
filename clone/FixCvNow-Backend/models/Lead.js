// models/Lead.js
import mongoose from 'mongoose'

const leadSchema = new mongoose.Schema({
  sessionId:   { type: String, required: true, unique: true, index: true },
  name:        { type: String, default: '' },
  email:       { type: String, default: '' },
  phone:       { type: String, default: '' },
  extractedAt: { type: Date,   default: Date.now, index: true },
})

export const Lead = mongoose.models.Lead ?? mongoose.model('Lead', leadSchema)
