import type { NextRequest } from 'next/server'

// In-memory storage (resets on server restart)
// In production, consider using Redis or a database
const visits = new Map<string, number>()

function getClientIP(request: NextRequest): string {
  // Try to get the real IP address from various headers
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip') // Cloudflare

  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim()
  }

  if (realIP) return realIP
  if (cfConnectingIP) return cfConnectingIP

  // Fallback to localhost for development
  return request.ip || 'localhost'
}

function getVisitorFingerprint(request: NextRequest, ip: string): string {
  // Create a more unique identifier combining IP + User Agent
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const acceptLanguage = request.headers.get('accept-language') || 'unknown'
  
  // Create a hash for better uniqueness while preserving privacy
  const combined = `${ip}|${userAgent}|${acceptLanguage}`
  const hash = Buffer.from(combined).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 16)
  
  return `visitor_${hash}`
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)
    const fingerprint = getVisitorFingerprint(request, ip)

    // Determine if this is the first visit from this fingerprint
    const isFirstVisit = !visits.has(fingerprint)

    // Only count unique visitors (first time visitors)
    if (isFirstVisit) {
      visits.set(fingerprint, Date.now())
    }

    return Response.json({
      uniqueVisitors: visits.size,
      yourIP: ip,
      isFirstVisit,
    })
  } catch (error) {
    console.error('Error in visit counter:', error)
    return Response.json({ error: 'Failed to count visit' }, { status: 500 })
  }
}

export async function GET() {
  try {
    return Response.json({
      uniqueVisitors: visits.size,
      totalVisits: Array.from(visits.values()).length,
    })
  } catch (error) {
    console.error('Error getting visit count:', error)
    return Response.json(
      { error: 'Failed to get visit count' },
      { status: 500 }
    )
  }
}
