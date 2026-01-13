const ipRateLimit = new Map()

export const dynamicRateLimiter = (req, res, next) => {
    const ip = req.ip || req.socket.remoteAddress
    const now = Date.now()

    if (!ipRateLimit.has(ip)) {
        ipRateLimit.set(ip, { attempts: 0, blockedUntil: 0, level: 0 })
    }

    const data = ipRateLimit.get(ip)

    if (data.blockedUntil > now) {
        const remainingSeconds = Math.ceil((data.blockedUntil - now) / 1000)
        return res.status(429).json({
            status: "ERROR",
            message: `Terlalu banyak percobaan. Silakan tunggu ${remainingSeconds} detik.`,
            retryAfter: remainingSeconds
        })
    }

    if (data.blockedUntil !== 0 && data.blockedUntil <= now) {
        data.blockedUntil = 0
        data.attempts = 0
    }

    req.rateLimitData = data

    next()
}


export const incrementFailCount = (req) => {
    const data = req.rateLimitData
    if (!data) return

    data.attempts += 1

    if (data.attempts >= 6) {
        const baseDuration = 30
        const multiplier = Math.pow(2, data.level)
        const durationSeconds = baseDuration * multiplier

        data.blockedUntil = Date.now() + (durationSeconds * 1000)
        data.level += 1
        data.attempts = 0

        return durationSeconds
    }

    return 0
}

export const resetRateLimit = (req) => {
    const ip = req.ip || req.socket.remoteAddress
    ipRateLimit.delete(ip)
}