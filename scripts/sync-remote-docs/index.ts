import {
  filterDiffByMatcher,
  getDiff,
  getPortalConfig,
  handleDiff,
  versioningDocs
} from './utils'

// Simple CLI arg parsing
function getArg(flag: string): string | undefined {
  const idx = process.argv.indexOf(flag)
  return idx !== -1 ? process.argv[idx + 1] : undefined
}

async function main() {
  const newVersion = getArg('--new-version')
  const diffJsonPath = getArg('--diff-json')
  const previousDocsPath = getArg('--prev-docs')
  const latestDocsPath = getArg('--latest-docs')
  const docConfigPath = getArg('--doc-config')

  if (
    !newVersion ||
    !diffJsonPath ||
    !previousDocsPath ||
    !latestDocsPath ||
    !docConfigPath
  ) {
    console.error(
      'Usage: bun run scripts/sync-remote-docs \\',
      '\n  --new-version <tag> \\',
      '\n  --diff-json <diff.json> \\',
      '\n  --prev-docs <path> \\',
      '\n  --latest-docs <path> \\',
      '\n  --doc-config <path>'
    )
    process.exit(1)
  }

  console.log(`[sync-remote-docs] Starting sync remote docs...`)

  console.log(`[sync-remote-docs] Using new version: ${newVersion}`)
  console.log(`[sync-remote-docs] Reading diff from: ${diffJsonPath}`)
  console.log(
    `[sync-remote-docs] Using previous docs from: ${previousDocsPath}`
  )
  console.log(`[sync-remote-docs] Using latest docs from: ${latestDocsPath}`)
  console.log(`[sync-remote-docs] Using doc config from: ${docConfigPath}`)

  // main logic
  // 0. versioning docs
  await versioningDocs(newVersion)
  // 1. get diff
  const rawDiffJson = await getDiff(diffJsonPath)
  // 2. get portal config
  const portalConfig = await getPortalConfig(docConfigPath)
  // 3. filter diff by portal config
  const filteredDiffJson = await filterDiffByMatcher(rawDiffJson, portalConfig)
  console.log(`[sync-remote-docs] Filtered diff:`, filteredDiffJson)
  // 4. handle file
  await handleDiff(filteredDiffJson, { previousDocsPath, latestDocsPath })
}

main()
