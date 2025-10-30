/**
 * Get the version after the product name from the pathname
 * @param pathname - The pathname to get the version from
 * @param productName - The product name to get the version from
 * @param options - The options to get the version from
 * @returns The version after the product name from the pathname or null if not found
 *
 * Example:
 * pathname: /docs/ten_framework/v0.11.25/message_system
 * productName: ten_framework
 * options: { versionPrefix: 'v' }
 * returns: v0.11.25
 */
export const getVersionFromPathname = (
  pathname: string,
  productName: string,
  options?: {
    versionPrefix?: string
  }
) => {
  const { versionPrefix = 'v' } = options ?? {}

  const version = pathname?.split(`/${productName}/`)?.[1]?.split('/')?.[0]

  if (!version || !version.startsWith(versionPrefix)) return null

  // Judge if the version string looks like a version (e.g., v0.11.25, 1.2.3, v1, etc.)
  const versionLikeRegex = new RegExp(`^${versionPrefix}?[0-9]+(\\.[0-9]+)*$`)
  if (versionLikeRegex.test(version)) {
    // If versionPrefix present, remove it
    if (version.startsWith(versionPrefix)) {
      return version.slice(versionPrefix.length)
    }
    return version
  }
  // Not a version-like string
  return null
}

export const sortVersions = (
  versions: string[],
  options?: {
    versionPrefix?: string
    sort?: 'asc' | 'desc'
  }
) => {
  const { versionPrefix = 'v', sort = 'asc' } = options ?? {}

  const parsedVersions = versions
    .map((version) => {
      return version.split(versionPrefix).join('')
    })
    .sort((a, b) => {
      return sort === 'asc' ? a.localeCompare(b) : b.localeCompare(a)
    })

  return parsedVersions
}
