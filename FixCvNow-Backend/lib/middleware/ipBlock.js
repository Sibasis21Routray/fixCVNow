import { IPActivity } from '../../models/IPActivity.js'

/**
 * Middleware to check if an IP is currently blocked
 */
export const checkIPBlock = async (req, res, next) => {
  // Get IP (handles proxies like Cloudflare/Nginx)
  const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress
  
  try {
    const activity = await IPActivity.findOne({ ip })
    
    if (activity && activity.blockedUntil && activity.blockedUntil > new Date()) {
      const remainingHours = Math.ceil((activity.blockedUntil - new Date()) / (1000 * 60 * 60))
      console.warn(`[IPBlock] Denied access to blocked IP: ${ip}`)
      return res.status(403).json({
        error: 'Access Denied',
        message: `Your IP has been temporarily restricted due to excessive usage without conversion. Please try again after ${remainingHours} hours or contact support.`
      })
    }
    
    req.userIP = ip
    next()
  } catch (err) {
    console.error('[IPBlock Middleware] Error:', err.message)
    next() // Fail open if DB issue
  }
}

/**
 * Increments the parse count for an IP and blocks if threshold is reached.
 * @returns {Boolean} true if the IP was just blocked
 */
export const incrementParseCount = async (ip) => {
  if (!ip) return false
  try {
    const activity = await IPActivity.findOneAndUpdate(
      { ip },
      { 
        $inc: { parseCount: 1 },
        $set: { lastActivity: new Date() }
      },
      { upsert: true, new: true }
    )
    
    // Threshold: 10 parses without download/optimize
    if (activity.parseCount >= 5) {
      const blockTime = new Date(Date.now() + 10 * 60 * 60 * 1000) // 10 hours
      await IPActivity.updateOne({ ip }, { $set: { blockedUntil: blockTime } })
      console.log(`[IPBlock] Blocked IP ${ip} for 10 hours (10+ parses without conversion)`)
      return true
    }
    return false
  } catch (err) {
    console.error('[IPBlock Increment] Error:', err.message)
    return false
  }
}

/**
 * Resets the parse count for an IP upon successful conversion (optimize/download)
 */
export const trackConversion = async (ip) => {
  if (!ip) return
  try {
    await IPActivity.findOneAndUpdate(
      { ip },
      { $set: { parseCount: 0, blockedUntil: null } }
    )
    console.log(`[IPBlock] Reset activity for IP ${ip} (Successful conversion)`)
  } catch (err) {
    console.error('[IPBlock Track] Error:', err.message)
  }
}
