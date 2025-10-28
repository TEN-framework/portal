import { type NextRequest, NextResponse } from 'next/server'

// In-memory cache for last successful responses
const cache = new Map<string, { stargazers_count: number; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const repo = searchParams.get('repo')

  if (!repo) {
    return NextResponse.json(
      { error: 'Repository parameter is required' },
      { status: 400 }
    )
  }

  const cacheKey = repo
  const now = Date.now()

  // Check if we have a recent cached response
  const cached = cache.get(cacheKey)
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json({
      stargazers_count: cached.stargazers_count,
      cached_at: new Date(cached.timestamp).toISOString(),
      from_cache: true
    })
  }

  try {
    // Prepare headers for authenticated requests
    const headers: HeadersInit = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'TEN-Portal-Website'
    }

    // Add authentication if GitHub token is available (server-side only)
    const githubToken = process.env.GITHUB_TOKEN
    if (githubToken) {
      headers.Authorization = `Bearer ${githubToken}`
    }

    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers
    })

    if (response.ok) {
      const data = await response.json()
      const starCount = data.stargazers_count

      // Cache the successful response
      cache.set(cacheKey, { stargazers_count: starCount, timestamp: now })

      return NextResponse.json({
        stargazers_count: starCount,
        cached_at: new Date().toISOString(),
        from_cache: false
      })
    } else if (response.status === 403) {
      // Handle rate limit exceeded
      const rateLimitReset = response.headers.get('X-RateLimit-Reset')
      const resetTime = rateLimitReset
        ? new Date(parseInt(rateLimitReset, 10) * 1000)
        : null

      console.warn(
        'GitHub API rate limit exceeded.',
        resetTime ? `Resets at: ${resetTime.toLocaleString()}` : ''
      )

      // Return last successful cached data or fallback
      const fallbackCount = cached?.stargazers_count || 7135
      return NextResponse.json(
        {
          stargazers_count: fallbackCount,
          error: 'Rate limit exceeded',
          reset_time: resetTime?.toISOString(),
          from_cache: !!cached
        },
        { status: 429 }
      )
    } else {
      console.error(
        'GitHub API request failed:',
        response.status,
        response.statusText
      )

      // Return last successful cached data or fallback
      const fallbackCount = cached?.stargazers_count || 7135
      return NextResponse.json(
        {
          error: 'Failed to fetch repository data',
          stargazers_count: fallbackCount,
          from_cache: !!cached
        },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('Failed to fetch star count:', error)

    // Return last successful cached data or fallback
    const fallbackCount = cached?.stargazers_count || 7135
    return NextResponse.json(
      {
        error: 'Internal server error',
        stargazers_count: fallbackCount,
        from_cache: !!cached
      },
      { status: 500 }
    )
  }
}
