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
  const newVersion = getArg('--new-version') // 0.11.27
  const diffJsonPath = getArg('--diff-json') // .tmp/diff.json
  const previousRepoPath = getArg('--prev-repo') // .tmp/ten_framework/0.11.26
  const latestRepoPath = getArg('--latest-repo') // .tmp/ten_framework/0.11.27
  const docConfigPath = getArg('--doc-config') // .tmp/ten_framework/0.11.27/docs/_portal_config.json

  if (
    !newVersion ||
    !diffJsonPath ||
    !previousRepoPath ||
    !latestRepoPath ||
    !docConfigPath
  ) {
    console.error(
      'Usage: bun run scripts/sync-remote-docs \\',
      '\n  --new-version <tag> \\',
      '\n  --diff-json <diff.json> \\',
      '\n  --prev-repo <path> \\',
      '\n  --latest-repo <path> \\',
      '\n  --doc-config <path>'
    )
    process.exit(1)
  }

  console.log(`[sync-remote-docs] Starting sync remote docs...`)

  console.log(`[sync-remote-docs] Using new version: ${newVersion}`)
  console.log(`[sync-remote-docs] Reading diff from: ${diffJsonPath}`)
  console.log(
    `[sync-remote-docs] Using previous docs from: ${previousRepoPath}`
  )
  console.log(`[sync-remote-docs] Using latest docs from: ${latestRepoPath}`)
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
  await handleDiff(filteredDiffJson, { previousRepoPath, latestRepoPath })
}

main()
