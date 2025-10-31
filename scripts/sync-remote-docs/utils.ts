import {
  access,
  readdir,
  stat,
  mkdir,
  copyFile,
  readFile,
  unlink,
  writeFile,
  rmdir
} from 'node:fs/promises'
import { resolve, join } from 'node:path'
import * as matter from 'gray-matter'
import {
  DEFAULT_LOCAL_DOCS_RELATIVE_PATH,
  DEFAULT_LOCAL_LATEST_DOCS_RELATIVE_PATH,
  DEFAULT_LOCAL_VERSION_JSON_RELATIVE_PATH,
  type DiffJson,
  FileAction,
  IDENTIFIER_ROOT,
  LocalVersionJson,
  MAX_LOCAL_VERSION_COUNT,
  PortalConfig,
  RemoteDocFrontmatter
} from './constant'

const LOG_INDENTIFIER = `${IDENTIFIER_ROOT} [utils] `

// #region Private Functions
const _checkFileExists = async (
  filePath: string,
  { createIfNotExists = false }
): Promise<boolean> => {
  try {
    await access(filePath)
    return true
  } catch {
    if (createIfNotExists) {
      await mkdir(filePath, { recursive: true })
    }
    return false
  }
}
const _deleteFile = async (filePath: string): Promise<void> => {
  try {
    await unlink(filePath)
  } catch (error) {
    console.error(
      LOG_INDENTIFIER,
      `Failed to delete file at ${filePath}`,
      error
    )
    // process.exit(1)
    // allow to continue
  }
}
const _createFile = async (
  filePath: string,
  content: string
): Promise<void> => {
  try {
    await _checkFileExists(filePath, { createIfNotExists: true })
    await writeFile(filePath, content)
  } catch (error) {
    console.error(
      LOG_INDENTIFIER,
      `Failed to create file at ${filePath}`,
      error
    )
    // process.exit(1)
    // allow to continue
  }
}
const _deleteFolder = async (folderPath: string): Promise<void> => {
  try {
    await rmdir(folderPath)
  } catch (error) {
    console.error(
      LOG_INDENTIFIER,
      `Failed to delete folder at ${folderPath}`,
      error
    )
    // process.exit(1)
    // allow to continue
  }
}
const _readFile = async (filePath: string): Promise<string> => {
  try {
    const absFilePath = resolve(process.cwd(), filePath)
    console.log(`[sync-remote-docs] Reading file at ${absFilePath}`)
    return await readFile(filePath, 'utf-8')
  } catch (error) {
    console.error(LOG_INDENTIFIER, `Failed to read file at ${filePath}`, error)
    process.exit(1)
  }
}
// version: xx.xx.xx such as 0.11.26, versions are sorted from oldest to newest
const _sortAndDedupVersions = (versions: string[]): string[] => {
  return versions
    .sort((a, b) => a.localeCompare(b))
    .filter((version, index, self) => self.indexOf(version) === index)
}
// #endregion

// #region Public Functions
export const copyFolderWithFiles = async (
  src: string,
  dest: string
): Promise<void> => {
  try {
    // Ensure dest exists
    await mkdir(dest, { recursive: true })
    // Read items (files/directories) in src
    const items = await readdir(src)
    for (const item of items) {
      const srcPath = join(src, item)
      const destPath = join(dest, item)
      const itemStat = await stat(srcPath)
      if (itemStat.isDirectory()) {
        await copyFolderWithFiles(srcPath, destPath) // Recurse into folder
      } else if (itemStat.isFile()) {
        await copyFile(srcPath, destPath)
      }
    }
  } catch (error) {
    console.error(
      LOG_INDENTIFIER,
      `Failed to recursively copy folder at ${src} to ${dest}`,
      error
    )
    process.exit(1)
  }
}

export const versioningDocs = async (newVersion: string) => {
  const localLatestDocsPath = resolve(
    process.cwd(),
    ...DEFAULT_LOCAL_LATEST_DOCS_RELATIVE_PATH
  )
  const localVersionJsonPath = resolve(
    process.cwd(),
    ...DEFAULT_LOCAL_VERSION_JSON_RELATIVE_PATH
  )

  try {
    // 1. read local version json
    const localVersionJson = await readFile(localVersionJsonPath, 'utf-8')
    const localVersionJsonData: LocalVersionJson = LocalVersionJson.parse(
      JSON.parse(localVersionJson)
    )
    // 2. versioning docs
    // 2.0 prepare new local version json data
    const allVersions = _sortAndDedupVersions([
      ...localVersionJsonData.versions,
      newVersion
    ])
    // 2.1 determine versions to be kept and versions to be removed
    const versionsToBeKept = allVersions.slice(-MAX_LOCAL_VERSION_COUNT)
    const versionsToBeRemoved = allVersions.slice(0, -MAX_LOCAL_VERSION_COUNT)
    // 2.2 create new local version json file
    const newLocalVersionJsonData: LocalVersionJson = {
      latest: newVersion,
      versions: versionsToBeKept
    }
    await writeFile(
      localVersionJsonPath,
      JSON.stringify(newLocalVersionJsonData, null, 2)
    )
    // 2.3 delete old version docs
    for (const version of versionsToBeRemoved) {
      await _deleteFolder(
        resolve(process.cwd(), ...DEFAULT_LOCAL_DOCS_RELATIVE_PATH, version)
      )
    }
    // 3. copy latest docs to old version docs(latest => previous version docs)
    const previousVersionDocsPath = resolve(
      process.cwd(),
      ...DEFAULT_LOCAL_DOCS_RELATIVE_PATH,
      localVersionJsonData.latest
    )
    await copyFolderWithFiles(localLatestDocsPath, previousVersionDocsPath)
    console.info(
      LOG_INDENTIFIER,
      `Versioning docs successfully from ${localLatestDocsPath} to ${previousVersionDocsPath}`
    )
  } catch (error) {
    console.error(LOG_INDENTIFIER, `Failed to versioning docs}`, error)
    process.exit(1)
  }
}

export const getDiff = async (diffJsonPath: string): Promise<DiffJson> => {
  try {
    const diffContent = await readFile(diffJsonPath, 'utf-8')
    const diffJson: DiffJson = JSON.parse(diffContent)
    console.debug(
      LOG_INDENTIFIER,
      `Diff read successfully from ${diffJsonPath}`
    )
    return diffJson
  } catch (error) {
    console.error(
      LOG_INDENTIFIER,
      `Failed to read diff.json at ${diffJsonPath}`,
      error
    )
    process.exit(1)
  }
}

export const getPortalConfig = async (
  portalConfigPath: string
): Promise<PortalConfig> => {
  try {
    console.log(
      `[sync-remote-docs] Reading portal config from ${portalConfigPath}`
    )
    const portalConfigContent = await _readFile(portalConfigPath)
    const portalConfig: PortalConfig = JSON.parse(portalConfigContent)
    console.debug(
      LOG_INDENTIFIER,
      `Portal config read successfully from ${portalConfigPath}`,
      portalConfig
    )
    return portalConfig
  } catch (error) {
    console.error(
      LOG_INDENTIFIER,
      `Failed to read portal config at ${portalConfigPath}`,
      error
    )
    const defaultPortalConfig = PortalConfig.parse({})
    console.debug(
      LOG_INDENTIFIER,
      `Using default portal config`,
      defaultPortalConfig
    )
    return defaultPortalConfig
  }
}

export const getAllowedFiles = async (
  files: string[],
  portalConfig: PortalConfig
): Promise<string[]> => {
  const allowedFiles = files.filter((file) =>
    portalConfig.matcher.every((pattern) => {
      // matcher is a list of regex strings; use directly
      const regex = new RegExp(pattern)
      return regex.test(file)
    })
  )
  console.debug(
    LOG_INDENTIFIER,
    `Allowed files[${allowedFiles.length}]: ${allowedFiles.join(', ')}`
  )
  return allowedFiles
}

export const filterDiffByMatcher = async (
  diffJson: DiffJson,
  portalConfig: PortalConfig
): Promise<DiffJson> => {
  const result: DiffJson = {
    added_files: await getAllowedFiles(diffJson.added_files, portalConfig),
    deleted_files: await getAllowedFiles(diffJson.deleted_files, portalConfig),
    modified_files: await getAllowedFiles(
      diffJson.modified_files,
      portalConfig
    ),
    renamed_files: await getAllowedFiles(diffJson.renamed_files, portalConfig)
  }
  console.debug(
    LOG_INDENTIFIER,
    `Allowed files from diff[${result.added_files.length}]: ${result.added_files.join(', ')}`
  )
  return result
}

export const readRemoteDocFile = async (
  filePath: string
): Promise<{
  frontmatter: RemoteDocFrontmatter
  content: string
  raw: string
}> => {
  try {
    const mdxFile = await readFile(filePath, 'utf-8')
    console.debug(LOG_INDENTIFIER, `File read successfully from ${filePath}`)
    const { data: frontmatter, content: fileContent } = matter(mdxFile)
    const parsedFrontmatter = RemoteDocFrontmatter.parse(frontmatter)
    return {
      frontmatter: parsedFrontmatter,
      content: fileContent,
      raw: mdxFile
    }
  } catch (error) {
    console.error(LOG_INDENTIFIER, `Failed to read file at ${filePath}`, error)
    process.exit(1)
  }
}

const _deleteLocalDocFile = async (filePath: string): Promise<void> => {
  const { frontmatter } = await readRemoteDocFile(filePath)
  const localDocPath = resolve(
    process.cwd(),
    ...DEFAULT_LOCAL_LATEST_DOCS_RELATIVE_PATH,
    frontmatter._portal_target
  )
  await _deleteFile(localDocPath)
  console.debug(
    LOG_INDENTIFIER,
    `Local doc file deleted successfully from ${localDocPath}`
  )
}
const _createLocalDocFile = async (
  filePath: string,
  content: string
): Promise<void> => {
  const localDocPath = resolve(
    process.cwd(),
    ...DEFAULT_LOCAL_LATEST_DOCS_RELATIVE_PATH,
    filePath
  )
  await _createFile(localDocPath, content)
  console.debug(
    LOG_INDENTIFIER,
    `Local doc file created successfully at ${localDocPath}`
  )
}

export const handleDiff = async (
  diffJson: DiffJson,
  options: {
    previousDocsPath: string
    latestDocsPath: string
  }
) => {
  const { previousDocsPath, latestDocsPath } = options

  for (const file of diffJson.added_files) {
    const remoteDocPath = resolve(latestDocsPath, file)
    const { frontmatter, raw } = await readRemoteDocFile(remoteDocPath)
    await _createLocalDocFile(frontmatter._portal_target, raw)
  }
  for (const file of diffJson.deleted_files) {
    const remoteDocPath = resolve(previousDocsPath, file)
    const { frontmatter } = await readRemoteDocFile(remoteDocPath)
    await _deleteLocalDocFile(frontmatter._portal_target)
  }
  for (const file of diffJson.modified_files) {
    const remoteNewDocPath = resolve(latestDocsPath, file)
    const remoteOldDocPath = resolve(previousDocsPath, file)
    const { frontmatter: newFrontmatter, raw: newRaw } =
      await readRemoteDocFile(remoteNewDocPath)
    const { frontmatter: oldFrontmatter } =
      await readRemoteDocFile(remoteOldDocPath)
    await _deleteLocalDocFile(oldFrontmatter._portal_target)
    await _createLocalDocFile(newFrontmatter._portal_target, newRaw)
  }
}
