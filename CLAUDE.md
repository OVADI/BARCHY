# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

BARCHY is an offline-first PWA vademecum for architecture/building students (steel, timber, concrete tables, Bbl requirements for new-build dwellings, drawing conventions, small calculators). SvelteKit 2 + Svelte 5 + TypeScript, fully static (`adapter-static`), offline via `@vite-pwa/sveltekit`. The user communicates in Dutch; UI copy is bilingual (nl/en).

## Commands

Node 22+.

```bash
npm run dev                 # dev server (port 5173 in .claude/launch.json)
npm run build               # static build into build/ (fails on invalid content)
npm run preview             # serve build/; restart after every rebuild (it indexes build/ at startup)
npm run check               # svelte-check + tsc for scripts/ (tsconfig.scripts.json)
npm run lint                # prettier --check + eslint
npm run format              # prettier --write
npm test                    # vitest run (src/**, scripts/** *.test.ts)
npx vitest run src/lib/checks/stair.test.ts   # single test file
npx vitest run -t "name"                      # single test by name
npm run validate            # validate /content against schemas
npm run import:vademecum    # re-import tables from the pinned Vademecum commit
BASE_PATH=/barchy npm run build && npm run serve:pages   # GitHub Pages-like server on :4174
```

CI (`.github/workflows/deploy.yml`) runs `lint`, `check`, `test`. On push to main it also deploys to GitHub Pages on the custom domain barchy.ovadi.nl (`static/CNAME`, `BASE_PATH` empty; Web3Forms key from repo variable `WEB3FORMS_KEY`). `test:e2e` exists but there is no Playwright config or test dir yet.

## Architecture

**Content is data, validated at build time.** All building values live as JSON under `content/` (steel families, sheets, corrections, timber, rebar, Bbl/steel facts, drawing conventions, i18n, `sources.json`). `src/lib/content/validate.ts` maps every file path to a Zod schema in `src/lib/schema/`; an unknown file is an error too. It runs from the Vite plugin (`src/lib/content/vite-plugin.ts`, fails the build / shows the dev overlay), `npm run validate`, and tests. Adding a content file means adding its schema and a pattern in `SCHEMAS`.

**Zod stays out of the client bundle.** Content is parsed only in `+page.server.ts` loads and `+server.ts` endpoints, which are prerendered (`+layout.ts` sets `prerender = true`), so data ends up in prerendered page data or JSON files, not JS. Examples: `routes/space/+page.server.ts` (Bbl facts), `routes/data/steel/[family].json/+server.ts` (per-family steel JSON, stripped via `lib/steel/client.ts`), `routes/data/search.json/+server.ts` (index built by `lib/search/build.ts`). The client fetches these via `lib/steel/load.ts` / `lib/search/load.ts`; the service worker precaches them. Profile pages (`/steel/[series]/[size]`) are not prerendered and open the SPA fallback (`404.html`) offline.

**Every value is sourced and has a review state** (`lib/schema/source.ts`): `SourceRef` (shown in the InfoSheet, never as loose text), `status` = `flagged | auto_checked | human_verified` (human_verified requires `verifiedBy`/`verifiedOn`; open error-level `issues` force `flagged`), optional `corrections` with reason + source. Facts (`lib/schema/fact.ts`) have `type` `requirement | rule_of_thumb | data`, which determines the UI colour (cobalt / orange / white).

**Vademecum import** (`scripts/import-vademecum.ts`, helpers in `scripts/vademecum/`): fetches TeachBooks/vademecum at a pinned commit (`scripts/vademecum/source.ts`, cached in `scripts/.cache/`), parses the HTML `<table>`s in the markdown (RHS/UNP headers are wrong, so columns are mapped by fixed order), runs consistency checks (`lib/checks/steel.ts`) and writes `content/` plus `reports/vademecum-issues.md`. Nothing is fixed silently: value changes go only through `content/steel/corrections.json`. Don't hand-edit imported files; rerun the importer.

**Steel model:** family (HE, IPE, UNP, SHS, RHS, CHS) + variant. Displayed as "HEA 200"; search also matches "HE 200 A". Default picker shows HEA/HEB/HEM/IPE/UNP/SHS/RHS/CHS, others behind "Meer varianten".

**i18n:** `content/i18n/nl.json` is the reference; `en.json` must have identical keys (type error otherwise, via `lib/i18n/messages.ts`). Keys are typed `MessageKey` dotted paths. Bilingual content fields use `{ nl, en }`.

**Base path:** `BASE_PATH` env (empty for root, `/barchy` on GitHub Pages) feeds both `svelte.config.js` and the PWA scope in `vite.config.ts`; always build URLs with `base` from `$app/paths`.

**Storage:** `lib/storage/kv.ts` (IndexedDB via idb-keyval → localStorage → memory); saved items/parts list in `lib/storage/saved.svelte.ts`, CSV export in `lib/storage/csv.ts`.

**Styling:** design tokens in `src/lib/styles/tokens.css` (dark by default), shared components in `src/lib/components/`; `/dev/tokens` is a dev-only page excluded from precache.

## Rules for this project

- Never invent building values. An uncertain value gets `verify: true` / `[VERIFY]` and stays `flagged`. A value checked against the Vademecum or the Bbl is acceptable (`human_verified`, `verifiedBy: OVADI`).
- Work is organised in phases in `docs/faseplan.md` ("fase N"). After a phase: stop with a short summary and a checklist for the user, and update the phase status/commit in that file.
- SvelteKit is pinned to 2.x with Vite 7: `@vite-pwa/sveltekit` 1.1.0 does not support Kit 3. Dependencies are pinned to exact versions.
- Prettier: tabs, single quotes, no trailing commas, width 100.
- `wetten.overheid.nl` (Bbl source): use `curl --http1.1` and read the raw text for values.
