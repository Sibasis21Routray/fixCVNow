// routes/admin.js
import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { Admin } from '../models/Admin.js'
import { Lead } from '../models/Lead.js'
import { TokenUsage } from '../models/TokenUsage.js'

const router = Router()

// ─────────────────────────────────────────────
// Auth middleware
// ─────────────────────────────────────────────
function requireAuth(req, res, next) {
  const auth = req.headers.authorization
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    req.admin = jwt.verify(auth.slice(7), process.env.JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// ─────────────────────────────────────────────
// POST /admin/login
// ─────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' })
    }

    const admin = await Admin.findOne({ username })
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, admin.passwordHash)
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    res.json({ token, username: admin.username })
  } catch (err) {
    console.error('[Admin] Login error:', err.message)
    res.status(500).json({ error: 'Login failed' })
  }
})

// ─────────────────────────────────────────────
// GET /admin/stats
// ─────────────────────────────────────────────
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const [totalLeads, tokenAgg] = await Promise.all([
      Lead.countDocuments(),
      TokenUsage.aggregate([
        {
          $group: {
            _id: '$operation',
            totalTokens:  { $sum: '$totalTokens' },
            inputTokens:  { $sum: '$inputTokens' },
            outputTokens: { $sum: '$outputTokens' },
            count:        { $sum: 1 },
          },
        },
      ]),
    ])

    // Daily token usage for last 14 days
    const since = new Date()
    since.setDate(since.getDate() - 13)
    since.setHours(0, 0, 0, 0)

    const dailyUsage = await TokenUsage.aggregate([
      { $match: { timestamp: { $gte: since } } },
      {
        $group: {
          _id: {
            date:      { $dateToString: { format: '%Y-%m-%d', date: '$timestamp' } },
            operation: '$operation',
          },
          totalTokens: { $sum: '$totalTokens' },
          count:       { $sum: 1 },
        },
      },
      { $sort: { '_id.date': 1 } },
    ])

    const byOperation = {}
    for (const row of tokenAgg) byOperation[row._id] = row

    const totalTokens = tokenAgg.reduce((s, r) => s + r.totalTokens, 0)
    const totalExtracts  = byOperation.extract?.count  ?? 0
    const totalOptimizes = byOperation.optimize?.count ?? 0

    res.json({ totalLeads, totalExtracts, totalOptimizes, totalTokens, byOperation, dailyUsage })
  } catch (err) {
    console.error('[Admin] Stats error:', err.message)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

// ─────────────────────────────────────────────
// GET /admin/token-usage?page=1&limit=20&operation=extract
// ─────────────────────────────────────────────
router.get('/token-usage', requireAuth, async (req, res) => {
  try {
    const page      = Math.max(1, parseInt(req.query.page)  || 1)
    const limit     = Math.min(100, parseInt(req.query.limit) || 20)
    const skip      = (page - 1) * limit
    const operation = req.query.operation

    const filter = operation ? { operation } : {}

    const [records, total] = await Promise.all([
      TokenUsage.find(filter).sort({ timestamp: -1 }).skip(skip).limit(limit).lean(),
      TokenUsage.countDocuments(filter),
    ])

    res.json({ records, total, page, pages: Math.ceil(total / limit) })
  } catch (err) {
    console.error('[Admin] Token usage error:', err.message)
    res.status(500).json({ error: 'Failed to fetch token usage' })
  }
})

// ─────────────────────────────────────────────
// GET /admin/leads?page=1&limit=20&search=...
// ─────────────────────────────────────────────
router.get('/leads', requireAuth, async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page)  || 1)
    const limit = Math.min(100, parseInt(req.query.limit) || 20)
    const skip  = (page - 1) * limit
    const search = req.query.search?.trim()

    const filter = search
      ? {
          $or: [
            { name:  { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone: { $regex: search, $options: 'i' } },
          ],
        }
      : {}

    const [leads, total] = await Promise.all([
      Lead.find(filter).sort({ extractedAt: -1 }).skip(skip).limit(limit).lean(),
      Lead.countDocuments(filter),
    ])

    res.json({ leads, total, page, pages: Math.ceil(total / limit) })
  } catch (err) {
    console.error('[Admin] Leads error:', err.message)
    res.status(500).json({ error: 'Failed to fetch leads' })
  }
})

export default router
