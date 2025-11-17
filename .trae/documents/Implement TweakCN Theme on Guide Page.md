## What I Found
- Guide page wrapper uses `guide-theme` in `app/[lang]/guide/page.tsx:561` and hero section class `guide-hero` in `app/[lang]/guide/page.tsx:562`.
- Gradient background for the hero is defined in `app/global.css:342–355` using `radial-gradient` and `linear-gradient`.
- Guide theme variables are already scoped with `.guide-theme` and `.dark .guide-theme` in `app/global.css:201–246`.
- Tailwind v4 CSS-first is used; theme tokens map via `@theme inline` in `app/global.css:417–446` and `--color-*` to existing CSS vars.

## Goal
- Replace the current gradient on `/guide` with a solid color palette from TweakCN.
- Scope the new palette to the guide page only (no site-wide changes).

## Implementation Steps
1. Add the TweakCN theme
   - Run: `pnpm dlx shadcn@latest add https://tweakcn.com/r/themes/cmhwvd8m4000a04jr0ean9y29`.
   - This fetches the theme and wires it to `app/global.css` per `components.json`.

2. Scope variables to the guide theme
   - Extract the generated `:root` variables from the added theme.
   - Move/merge them under `.guide-theme` and `.dark .guide-theme` in `app/global.css` (e.g., `--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`, `--border`).
   - Keep Tailwind mapping via `@theme inline` as-is; it already points to these vars.

3. Remove the AI-ish gradient from the hero
   - Replace the gradient in `app/global.css:342–353` with a flat style:
     - `background-color: var(--background)` and `border-bottom: 1px solid var(--border)` (consistent with `app/global.css:248–252`).
   - Ensure text remains `var(--foreground)`.

4. Audit guide-specific components
   - Confirm `.guide-chip`, `.guide-cta-*`, `.guide-panel`, `.guide-text-muted` continue to read from the updated variables (`app/global.css:290–318`, `320–341`, `367–373`, `393–415`).
   - Adjust minor mix/hover colors to align with the new palette only if needed.

5. Clean up duplicates
   - Remove the older/conflicting `.guide-theme` block if any duplication causes overrides, keeping one clear definition.

6. Verify
   - Start the dev server and open `/guide`.
   - Check light/dark modes, hover states, and ensure the theme is confined to the guide page.

## Deliverables
- Updated `app/global.css` with scoped TweakCN color variables for `.guide-theme`.
- Simplified, non-gradient `guide-hero` styling.
- No visual regressions elsewhere; only `/guide` updated.