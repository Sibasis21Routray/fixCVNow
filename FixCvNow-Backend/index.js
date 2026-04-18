// server/index.js

import { config } from 'dotenv'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'

// --------------------------------------------------
// Load ENV first
// --------------------------------------------------
const __dirname = path.dirname(fileURLToPath(import.meta.url))
config({ path: path.resolve(__dirname, '.env') })

// --------------------------------------------------
// DB + Admin seed
// --------------------------------------------------
import { connectDB } from './db/connect.js'
import { Admin } from './models/Admin.js'

async function seedAdmin() {
  const username = process.env.ADMIN_USERNAME || 'admin'
  const password = process.env.ADMIN_PASSWORD || 'fixcvnow@admin'
  const exists = await Admin.findOne({ username })
  if (!exists) {
    const passwordHash = await bcrypt.hash(password, 12)
    await Admin.create({ username, passwordHash })
    console.log(`[Admin] Seeded admin user: "${username}"`)
  }
}

const dbConnected = await connectDB()
if (dbConnected) {
  await seedAdmin().catch((err) => console.warn('[Admin] Seed failed:', err.message))
} else {
  console.warn('[Admin] Skipping seed — database not connected')
  console.warn('[DB] Leads and token usage will not be saved until MongoDB is reachable (MONGODB_URI + Atlas IP allowlist).')
}

// --------------------------------------------------
// Dynamic imports (Windows-safe)
// --------------------------------------------------
const { default: extractRoute } = await import(
  pathToFileURL(path.resolve(__dirname, 'routes/extract.js')).href
)

const { default: optimizeRoute } = await import(
  pathToFileURL(path.resolve(__dirname, 'routes/optimize.js')).href
)

const { default: downloadRoute } = await import(
  pathToFileURL(path.resolve(__dirname, 'routes/download.js')).href
)

const { default: adminRoute } = await import(
  pathToFileURL(path.resolve(__dirname, 'routes/admin.js')).href
)

const { default: previewRoute } = await import(
  pathToFileURL(path.resolve(__dirname, 'routes/preview.js')).href
)

const { default: paymentRoute } = await import(
  pathToFileURL(path.resolve(__dirname, 'routes/payment.js')).href
)

const { checkIPBlock } = await import(
  pathToFileURL(path.resolve(__dirname, 'lib/middleware/ipBlock.js')).href
)

// --------------------------------------------------
// Init App
// --------------------------------------------------
const app = express()

// --------------------------------------------------
// CORS CONFIG
// --------------------------------------------------
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://fixcvnow.com',
    'https://www.fixcvnow.com'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  exposedHeaders: ['Content-Disposition']
}))

app.options('*', cors())

// --------------------------------------------------
// Webhook raw body — MUST be before express.json()
// Razorpay webhook signature requires the raw request buffer
// --------------------------------------------------
app.use('/api/payment/webhook', express.raw({ type: '*/*' }))

// --------------------------------------------------
// Middleware
// --------------------------------------------------
app.use(express.json({ limit: '10mb' }))

// --------------------------------------------------
// Routes
// --------------------------------------------------
app.use('/api/extract',  checkIPBlock, extractRoute)
app.use('/api/optimize', checkIPBlock, optimizeRoute)
app.use('/api/download', checkIPBlock, downloadRoute)
app.use('/api/payment',  paymentRoute)
app.use('/admin',        adminRoute)
app.use('/api/preview',  previewRoute)

// --------------------------------------------------
// Health Check
// --------------------------------------------------
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// --------------------------------------------------
// GLOBAL ERROR HANDLER
// --------------------------------------------------
app.use((err, req, res, next) => {
  console.error('🔥 ERROR:', err.message)
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  })
})

// --------------------------------------------------
// Start Server
// --------------------------------------------------
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`🔑 OpenAI Key: ${process.env.OPENAI_API_KEY ? 'Loaded' : 'Missing'}`)
  console.log(`🗄️  MongoDB:    ${process.env.MONGODB_URI   ? 'Configured' : 'Not set — DB features disabled'}`)
})
