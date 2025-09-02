import { NextRequest } from 'next/server'

// In-memory storage (resets on server restart)
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
  
  // Fallback to unknown
  return 'unknown'
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request)

    // Determine if this is the first visit from this IP
    const isFirstVisit = !visits.has(ip)

    // Only count unique IPs (first time visitors)
    if (isFirstVisit) {
      visits.set(ip, Date.now())
    }

    return Response.json({
      uniqueVisitors: visits.size,
      yourIP: ip,
      isFirstVisit
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
      totalVisits: Array.from(visits.values()).length
    })
  } catch (error) {
    console.error('Error getting visit count:', error)
    return Response.json({ error: 'Failed to get visit count' }, { status: 500 })
  }
}