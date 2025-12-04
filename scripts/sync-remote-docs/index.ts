import { IDENTIFIER_ROOT } from './constant'
import {
  _printAndExitOnActionFailureLogs,
  filterDiffByMatcher,
  getDiff,
  getPortalConfig,
  handleDiff,
  versioningDocs
} from './utils'

const LOG_INDENTIFIER = `${IDENTIFIER_ROOT}`

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

  console.log(LOG_INDENTIFIER, `Starting sync remote docs...`)

  console.log(LOG_INDENTIFIER, `========================================`)
  console.log(LOG_INDENTIFIER, `New version       : ${newVersion}`)
  console.log(LOG_INDENTIFIER, `Diff JSON         : ${diffJsonPath}`)
  console.log(LOG_INDENTIFIER, `Previous repo     : ${previousRepoPath}`)
  console.log(LOG_INDENTIFIER, `Latest repo       : ${latestRepoPath}`)
  console.log(LOG_INDENTIFIER, `Doc config        : ${docConfigPath}`)
  console.log(LOG_INDENTIFIER, `========================================`)

  // main logic
  // 0. versioning docs
  console.debug('\n\n', LOG_INDENTIFIER, `=== Step 0: Versioning docs ===`)
  await versioningDocs(newVersion)
  // 1. get diff
  console.debug('\n\n', LOG_INDENTIFIER, `=== Step 1: Getting diff ===`)
  const rawDiffJson = await getDiff(diffJsonPath)
  // 2. get portal config
  console.debug(
    '\n\n',
    LOG_INDENTIFIER,
    `=== Step 2: Getting portal config ===`
  )
  const portalConfig = await getPortalConfig(docConfigPath)
  // 3. filter diff by portal config
  console.debug(
    '\n\n',
    LOG_INDENTIFIER,
    `=== Step 3: Filtering diff by portal config ===`
  )
  const filteredDiffJson = await filterDiffByMatcher(rawDiffJson, portalConfig)
  console.debug(LOG_INDENTIFIER, `Filtered diff:`, filteredDiffJson)
  // 4. handle file
  console.debug('\n\n', LOG_INDENTIFIER, `=== Step 4: Handling diff ===`)
  await handleDiff(filteredDiffJson, { previousRepoPath, latestRepoPath })

  _printAndExitOnActionFailureLogs()

  console.debug('\n\n', LOG_INDENTIFIER, `=== Completed successfully! ===`)
}

main()
