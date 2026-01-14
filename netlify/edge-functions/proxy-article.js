const UPSTREAM_HOST = 'aaam5byplvnk2vai.myquickcreator.com'
const UPSTREAM_ORIGIN = `https://${UPSTREAM_HOST}`

const rewriteHtml = (html, siteOrigin) => {
  let output = html.replaceAll(UPSTREAM_ORIGIN, siteOrigin)
  output = output.replaceAll('href="/"', 'href="/article/"')
  output = output.replaceAll('href="/#', 'href="/article/#')
  return output
}

export default async (request) => {
  const url = new URL(request.url)
  const targetUrl = new URL(url.pathname + url.search, UPSTREAM_ORIGIN)

  const headers = new Headers(request.headers)
  headers.delete('host')
  headers.delete('accept-encoding')
  headers.set('x-forwarded-host', url.host)
  headers.set('x-forwarded-proto', url.protocol.replace(':', ''))
  headers.set('x-forwarded-path', url.pathname)

  const init = {
    method: request.method,
    headers,
    redirect: 'manual'
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    init.body = request.body
  }

  let response
  try {
    response = await fetch(targetUrl.toString(), init)
  } catch (error) {
    console.error('QC proxy error:', error)
    return new Response('Upstream service unavailable', { status: 502 })
  }

  const headersOut = new Headers(response.headers)
  const location = headersOut.get('location')
  if (location && location.startsWith(UPSTREAM_ORIGIN)) {
    headersOut.set('location', location.replace(UPSTREAM_ORIGIN, url.origin))
  }

  const contentType = headersOut.get('content-type') ?? ''
  if (contentType.includes('text/html')) {
    const html = await response.text()
    const rewritten = rewriteHtml(html, url.origin)
    headersOut.delete('content-length')
    return new Response(rewritten, {
      status: response.status,
      statusText: response.statusText,
      headers: headersOut
    })
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headersOut
  })
}
