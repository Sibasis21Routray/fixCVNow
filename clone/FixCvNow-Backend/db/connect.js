// db/connect.js
import mongoose from 'mongoose'

mongoose.set('bufferCommands', false)

let connected = false

export function isDbConnected() {
  return mongoose.connection.readyState === 1
}

/** @returns {Promise<boolean>} */
export async function connectDB() {
  if (connected) return true
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.warn('[DB] MONGODB_URI not set — database features disabled')
    return false
  }
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10_000,
      connectTimeoutMS: 10_000,
    })
    connected = true
    console.log('[DB] Connected to MongoDB')
    return true
  } catch (err) {
    console.error('[DB] Connection failed:', err.message)
    return false
  }
}
