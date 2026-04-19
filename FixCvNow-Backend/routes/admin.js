// routes/admin.js
import { Router } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { Admin } from '../models/Admin.js'
import { Lead } from '../models/Lead.js'
import { TokenUsage } from '../models/TokenUsage.js'

const router = Router()

// ============================================================
// MIDDLEWARE
// ============================================================

/**
 * Authentication middleware for admin routes
 * Verifies JWT token from Authorization header
 */
function requireAuth(req, res, next) {
  const auth = req.headers.authorization
  
  // Check if Bearer token exists
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  
  try {
    // Verify and decode JWT token
    req.admin = jwt.verify(auth.slice(7), process.env.JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

// ============================================================
// LEAD MANAGEMENT ROUTES
// ============================================================

/**
 * GET /admin/leads
 * Fetch paginated list of leads with optional search
 * Query params: page, limit, search
 */
router.get('/leads', requireAuth, async (req, res) => {
  try {
    // Pagination parameters (sanitized)
    const page  = Math.max(1, parseInt(req.query.page)  || 1)
    const limit = Math.min(100, parseInt(req.query.limit) || 20)
    const skip  = (page - 1) * limit
    
    // Search filter (case-insensitive across name, email, phone)
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

    // Execute parallel queries for data and total count
    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ extractedAt: -1 })  // Newest first
        .skip(skip)
        .limit(limit)
        .lean(),
      Lead.countDocuments(filter),
    ])

    res.json({
      leads,
      total,
      page,
      pages: Math.ceil(total / limit)
    })
  } catch (err) {
    console.error('[Admin] Leads error:', err.message)
    res.status(500).json({ error: 'Failed to fetch leads' })
  }
})

// ============================================================
// AUTHENTICATION ROUTES
// ============================================================

/**
 * POST /admin/login
 * Admin login endpoint
 * Body: { username, password }
 * Returns JWT token on success
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    
    // Validate input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' })
    }

    // Find admin by username
    const admin = await Admin.findOne({ username })
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' })

    // Verify password hash
    const valid = await bcrypt.compare(password, admin.passwordHash)
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' })

    // Generate JWT token (7 days expiry)
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

// ============================================================
// TOKEN USAGE ROUTES
// ============================================================

/**
 * GET /admin/token-usage
 * Fetch paginated token usage records
 * Query params: page, limit, operation (optional filter)
 */
router.get('/token-usage', requireAuth, async (req, res) => {
  try {
    // Pagination parameters
    const page      = Math.max(1, parseInt(req.query.page)  || 1)
    const limit     = Math.min(100, parseInt(req.query.limit) || 20)
    const skip      = (page - 1) * limit
    
    // Optional operation filter (extract/optimize)
    const operation = req.query.operation
    const filter = operation ? { operation } : {}

    // Execute parallel queries
    const [records, total] = await Promise.all([
      TokenUsage.find(filter)
        .sort({ timestamp: -1 })  // Newest first
        .skip(skip)
        .limit(limit)
        .lean(),
      TokenUsage.countDocuments(filter),
    ])

    res.json({
      records,
      total,
      page,
      pages: Math.ceil(total / limit)
    })
  } catch (err) {
    console.error('[Admin] Token usage error:', err.message)
    res.status(500).json({ error: 'Failed to fetch token usage' })
  }
})

// ============================================================
// STATISTICS ROUTES
// ============================================================

/**
 * GET /admin/stats
 * Get aggregated statistics including:
 * - Total leads count
 * - Token usage by operation (extract/optimize)
 * - Daily token usage for last 14 days
 */
router.get('/stats', requireAuth, async (req, res) => {
  try {
    // Get total leads and aggregated token stats in parallel
    const [totalLeads, tokenAgg] = await Promise.all([
      Lead.countDocuments(),
      TokenUsage.aggregate([
        {
          $group: {
            _id: '$operation',           // Group by operation type
            totalTokens:  { $sum: '$totalTokens' },
            inputTokens:  { $sum: '$inputTokens' },
            outputTokens: { $sum: '$outputTokens' },
            count:        { $sum: 1 },    // Number of API calls
          },
        },
      ]),
    ])

    // ========================================================
    // Daily token usage for last 14 days
    // ========================================================
    const since = new Date()
    since.setDate(since.getDate() - 13)  // Go back 13 days to get 14 days total
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
      { $sort: { '_id.date': 1 } },  // Sort by date ascending
    ])

    // ========================================================
    // Format response data
    // ========================================================
    
    // Convert token aggregation array to object for easier access
    const byOperation = {}
    for (const row of tokenAgg) {
      byOperation[row._id] = row
    }

    // Calculate total tokens across all operations
    const totalTokens = tokenAgg.reduce((sum, record) => sum + record.totalTokens, 0)
    
    // Get operation counts with fallback to 0
    const totalExtracts  = byOperation.extract?.count  ?? 0
    const totalOptimizes = byOperation.optimize?.count ?? 0

    res.json({
      totalLeads,           // Total leads in database
      totalExtracts,        // Number of extract operations
      totalOptimizes,       // Number of optimize operations
      totalTokens,          // Total tokens consumed
      byOperation,          // Detailed breakdown by operation
      dailyUsage,           // Daily usage for charts
    })
  } catch (err) {
    console.error('[Admin] Stats error:', err.message)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

export default router