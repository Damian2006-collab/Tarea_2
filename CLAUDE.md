# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Dami's Burguer — a static multi-page marketing site for a burger restaurant, built incrementally without a frontend framework or bundler. TypeScript is used only for future form-validation logic, not for the page structure itself.

## Commands

- `npm run build` — compiles `ts/**/*.ts` to `js/` via `tsc`. Fails with `TS18003: No inputs were found` until at least one `.ts` file exists in `ts/`.
- No dev server script is defined. Serve the static files with any static server (e.g. `python -m http.server 8000`) and open the HTML files directly — no build step is required to view any page.
- No lint or test commands are configured. The `test` script in `package.json` is the default npm placeholder, not a real test runner.

## Architecture

**Pages are self-contained HTML files, not templated.** `index.html`, `menu.html`, `nosotros.html`, `login.html`, and `registro.html` each carry their own full `<style>` block in `<head>` — the CSS is currently duplicated across all five files rather than linked from `/css`. When changing global styles (colors, spacing tokens in `:root`, header/nav rules, responsive breakpoints, or the shared `.auth-card`/`.auth-form` rules), the same edit must be repeated in every HTML file's embedded `<style>` block until/unless the project migrates to a shared external stylesheet.

**Site structure and nav:**
- `index.html` is the home page and owns the sections that don't warrant their own page: hero (`#inicio`), a featured-menu preview (`#menu`), `#nosotros` and `#testimonios` anchors, and the `#contacto` section containing the live contact form.
- `menu.html` and `nosotros.html` are dedicated pages, currently scaffolded but empty: doctype, head (meta tags + the shared `<style>` block), and a fully wired header/nav (including the mobile `nav-toggle` script), but `<main id="contenido-principal">` has no content yet and there is no `<footer>`. Content for these is added incrementally in later work.
- `login.html` and `registro.html` are complete auth pages (unlike `menu.html`/`nosotros.html`, they are not scaffolds) — each has a centered `.auth-card` with a form and a full `<footer>`. They cross-link to each other via `.auth-switch`. Only `login.html` has a top-level nav entry ("Iniciar sesión"); `registro.html` is reached from the login page's switch link, not from the main nav.
- Cross-page nav links use relative paths (`menu.html`, `nosotros.html`, `login.html`) for dedicated pages and `index.html#anchor` for sections that only exist on the home page. Each page's own nav item carries `aria-current="page"`.
- Every page duplicates the same inline nav-toggle/`Escape`-to-close `<script>` at the end of `<body>` since there's no shared JS include yet. Pages that use `.animate-on-scroll` (`index.html`, `login.html`, `registro.html`) also duplicate the `IntersectionObserver` block in that same script; the scaffolded pages (`menu.html`, `nosotros.html`) currently omit it since they have nothing to animate.

**Forms:** each form follows the same contract — a semantic class hook plus a `<div class="form-feedback"></div>` immediately after `</form>` — for upcoming TypeScript validation:
- Contact (`index.html#contacto`): `<form class="contact-form form-contacto">` with `#nombre`, `#email`, `#mensaje`.
- Login (`login.html`): `<form class="auth-form form-login">` with `#email`, `#password`.
- Registro (`registro.html`): `<form class="auth-form form-registro">` with `#nombre`, `#email`, `#password`, `#confirmar-password`.

Keep these class/id contracts stable — they're the hooks the TS validation scripts query against.

Each field carries `aria-describedby` pointing at a `<span class="field-error" id="error-*" aria-live="polite">` (combined with the existing `#hint-*` id where a hint paragraph is also present) plus `aria-invalid="false"`. The validation scripts toggle `aria-invalid` and set the error span's text at submit time — they never inject new DOM nodes, only fill in elements that already exist in the markup. `.form-feedback` gets a `form-feedback--success`/`form-feedback--error` class and a summary message; `.field-error:empty` collapses visually via the `min-height` in CSS rather than `display:none`, so screen readers still get a stable live region.

**Dark mode:** every page supports a manual light/dark toggle (`#btn-theme`, the 🌙/☀️ button next to the logo), driven by a `data-theme="dark"|"light"` attribute on `<html>`. Two duplicated pieces make this work per page:
- A blocking inline `<script>` at the very top of `<head>` (before `<style>`) reads `localStorage.getItem('theme')`, falls back to `prefers-color-scheme`, and sets `data-theme` before first paint to avoid a flash of the wrong theme.
- A `[data-theme="dark"]` CSS block right after `:root` in each `<style>` that overrides the color tokens plus a few hardcoded selectors that don't use CSS variables (`.site-header`, `.site-footer`, card backgrounds, form inputs).

The toggle click handler (bottom `<script>`) flips the attribute and persists the choice to `localStorage`, so the preference carries across pages on the same origin. Same duplication caveat as the rest of the CSS/JS: any change to the dark palette or toggle behavior must be repeated in all five files.

**Mobile-first CSS:** unqualified rules in each `<style>` block are the mobile layout (single-column grids, centered hero, collapsed `.main-nav` dropdown, visible `.nav-toggle`); a single `@media (min-width: 769px)` block near the end of the block progressively re-enables the desktop layout (two-column grids, static horizontal nav, hidden toggle). There is no `max-width` breakpoint and no `!important` — desktop overrides win purely through source order (declared after the base rules, same specificity). If you add a new responsive rule, follow this pattern: write the mobile behavior unqualified, then add the desktop override inside the existing `min-width: 769px` block, keeping it in the same relative position across all five files.

**Typography tokens:** `:root` also carries `--font-family-base`, `--font-size-sm/base/md/lg`, `--font-size-section-title`, `--font-size-hero-title`, and `--line-height-base`. `body`, `.logo`, `.section-header h2`, and `.hero h1` consume these; other font-sizes in the file (menu cards, badges, form hints, etc.) are still literal values — extend the token set if those need to become swappable too.

**SEO:** `robots.txt` at the project root allows all crawlers (`User-agent: * / Allow: /`) — there's no sitemap since the project has no deployed domain yet. Each page's `<head>` carries Open Graph (`og:type`, `og:title`, `og:description`, `og:image`) and Twitter Card (`twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`) meta tags mirroring that page's own `<title>`/`<meta name="description">`. All five pages currently reuse the same hero photo as `og:image`/`twitter:image` since no page has a more specific dedicated image asset.

**TypeScript pipeline:** `tsconfig.json` compiles `./ts` → `./js` with `target`/`module: ES2022`, `lib: ["ES2022", "DOM"]`, and `strict: true`. `/css` is still empty scaffolding, but `/ts` and `/js` are now in use:
- `ts/contacto.ts` → `js/contacto.js`, loaded only by `index.html`, validates `.form-contacto`.
- `ts/login.ts` → `js/login.js`, loaded only by `login.html`, validates `.form-login`.
- `ts/registro.ts` → `js/registro.js`, loaded only by `registro.html`, validates `.form-registro` (includes password length + confirm-password match).

None of these files use `import`/`export` — each is a self-contained IIFE compiled as a plain script (not an ES module), so it's loaded with a plain `<script src="js/*.js"></script>` at the end of `<body>`, no `type="module"` needed. Each script locates its form via `document.querySelector('.form-*')`, and its feedback element via `form.nextElementSibling` (relying on `.form-feedback` being the form's immediate next sibling in the markup — don't move it elsewhere without updating the script). Validators are duplicated per file rather than shared via an import, consistent with the rest of the project's per-page duplication convention.
