<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Styling: Tailwind utilities first, custom CSS last

This project uses **Tailwind CSS v4** (configured in `src/app/globals.css` via `@import "tailwindcss"` and `@theme`). All component styling must be done with Tailwind utility classes inline on the JSX element.

**Do NOT** add new custom CSS classes to `globals.css` for styling that can be expressed as Tailwind utilities — even if the className string gets long, even if the same combination repeats across a few components. The whole point of the Tailwind migration was to remove the parallel hand-written stylesheet; reintroducing classes for "convenience" recreates the problem.

**Allowed in `globals.css`:**
- Pre-existing design-system classes already there (`.btn`, `.btn--*`, `.tag`, `.tag--*`, `.tick-frame`, `.placeholder`, `.h-display`, `.h-title`, `.h-section`, `.lnk`, `.field`, `.lbl`, `.cap-rule`, `.prose`, `.gridpaper`, `.gridpaper-fine`, `.kbd`, `.rule`, `.rule--*`, `.mono`, `.serif`, `.icn`, `.stroke`, `.mc-root`).
- The `.mc-drawer` / `.mc-drawer-backdrop` / `.mc-qcm-aside` / `.mc-qcm-aside-backdrop` scaffolding for fixed-position slide-in drawers (the `transform`/`visibility`/`transition` toggle keyed off `[data-open]` and the `body:has(...)` scroll lock genuinely cannot be done with utilities).
- Things with no utility equivalent: `::before`/`::after` decorations, `@media (min-width: 769px) { display: none !important }` for desktop-only hiding of mobile-only structural elements, `-webkit-overflow-scrolling`, complex `:has()` selectors.

**Before adding a new class to `globals.css`, try first:**
- Arbitrary variants: `data-[open=true]:translate-x-0`, `aria-[expanded=true]:bg-ink`.
- Child/descendant selectors: `[&_svg]:opacity-40`, `[&>div]:flex`.
- Arbitrary values: `px-[14px]`, `tracking-[0.04em]`, `min-h-[calc(100vh-50px)]`.

If after all that a custom class is genuinely warranted, ask the user before adding it.
