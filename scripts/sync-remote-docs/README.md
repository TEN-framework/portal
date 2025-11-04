# Sync Remote Docs Script

Synchronises documentation from the upstream `TEN-framework/ten-framework` repository into the portal. It keeps the portal’s copy of `content/docs/ten_framework` aligned with the latest remote tag while preserving a limited set of local historical versions.

## Prerequisites
- `bun` ≥ 1.1 (CLI entry point uses Bun). Node.js ≥ 22 per the workspace `package.json` engines.
- A local checkout of the portal repository (this directory).
- Two working copies of the `ten-framework` repository at the tags you want to compare. The GitHub Actions workflow shown below prepares these paths automatically when run in CI.
- A diff manifest (`diff.json`) describing which remote files were added, deleted, modified, or renamed between the two tags.

## CLI Usage

```bash
bun run scripts:sync-remote-docs \
  --new-version <new_tag> \
  --diff-json <path/to/diff.json> \
  --prev-repo <path/to/ten-framework/<previous_tag>> \
  --latest-repo <path/to/ten-framework/<new_tag>> \
  --doc-config <path/to/ten-framework/<new_tag>/docs/_portal_config.json>
```

### Arguments
- `--new-version`: Tag that will become the new `latest` docs version locally.
- `--diff-json`: JSON file containing arrays of changed filenames (`added_files`, `deleted_files`, `modified_files`, `renamed_files`).
- `--prev-repo`: Absolute path to the `ten-framework` checkout for the previously published tag.
- `--latest-repo`: Absolute path to the `ten-framework` checkout for the target tag being synced.
- `--doc-config`: Path to the remote `_portal_config.json` that lists matcher rules for filtering which files are allowed to sync into the portal.

The script logs progress with the `[sync-remote-docs]` prefix, validates inputs, and exits non-zero if any step fails.

## What the Script Does

1. **Version management**
   - Updates `content/docs/ten_framework/_version.json` to set `latest` to the `--new-version` tag and retain only the newest `MAX_LOCAL_VERSION_COUNT` entries (default 10).
   - Copies the previous `latest` docs into `content/docs/ten_framework/<previous_latest_tag>` and refreshes that version’s `meta.json` title/description.
   - Removes older local doc folders that fall outside the retention window.
2. **Diff ingestion**
   - Reads the `diff.json` manifest to understand which remote docs changed.
   - Loads `_portal_config.json` (or its defaults) to obtain regex matchers that whitelist files allowed to sync.
   - Filters each diff bucket so only allowed filenames proceed.
3. **Apply changes**
   - For each allowed addition or modification, reads the remote MD/MDX file, parses the frontmatter, and writes the full file into the portal’s `content/docs/ten_framework/(latest)` directory according to the `_portal_target` frontmatter field.
   - For deletions, removes the corresponding local target file.
   - For modifications, replaces the existing local file with the updated content.

Any failure encountered while creating, deleting, or reading files is collected and causes the script to exit after processing the diff.

## `diff.json` Shape

Example structure consumed by the script:

```json
{
  "added_files": ["guides/new-feature.mdx"],
  "deleted_files": ["guides/old-feature.mdx"],
  "modified_files": ["api/reference.mdx"],
  "renamed_files": ["how-to/start-here.mdx"]
}
```

The filenames are relative to the remote `docs` root (see `DEFAULT_REMOTE_DOCS_FOLDER`).

## Portal Config Matchers

`_portal_config.json` may define a `matcher` array of regular expressions. Only files matching **all** expressions are synced. When the config is missing or invalid, the defaults from `constant.ts` apply:

- Include `*.md` and `*.mdx` files.
- Exclude files whose names start with `README-`.
- Exclude anything under `code-of-conduct/`.

## Related GitHub Actions Workflow

`.github/workflows/sync-remote-docs.yml` automates the end-to-end flow:
- Checks out the desired remote tag (`--latest-repo`) and the current published tag (`--prev-repo`).
- Generates `.tmp/diff.json` by diffing the two tags and saves it for the script.
- Runs `bun run scripts:sync-remote-docs` with the appropriate arguments.
- Commits the updated docs to a dedicated branch and opens a pull request.
- Uploads the diff manifest as an Actions artifact for auditing.

Running locally mirrors this workflow: produce the diff JSON (e.g. via `git diff --name-only`), download both remote tag checkouts, then invoke the CLI with absolute paths.

## Troubleshooting
- Set `DEBUG=*` or run with `bun --inspect` for additional diagnostics if needed.
- Inspect the logs for `[sync-remote-docs] Action failure logs:`; these are collected failures that caused the script to exit.
- Ensure the remote files include a `_portal_target` frontmatter field; missing targets cause the script to terminate.

