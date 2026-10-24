# BARCHY

Offline-first vademecum voor architectuur- en bouwkundestudenten. Een PWA met bouwkundige kerngegevens, rekenhulpen en toetsing aan de Bbl-eisen voor woonfuncties in nieuwbouw.

## Onderdelen

- **Beton, staal en hout:** vademecum-tabellen en constructieve gegevens
- **Ruimte:** Bbl-eisen woonfunctie nieuwbouw, inclusief trapcalculator
- **Tekenen, tools, zoeken, opgeslagen items, instellingen**

De content staat in [content/](content) en wordt bij het bouwen gevalideerd. Alle waarden komen uit bronnen (zie `content/sources.json`); er worden geen gebouwwaarden verzonnen.

## Techniek

SvelteKit 2 + Svelte 5, TypeScript, statisch gebouwd met `adapter-static` en offline beschikbaar via `@vite-pwa/sveltekit`. Lokale opslag via `idb-keyval`. Tests met Vitest en Playwright.

## Aan de slag

Vereist Node.js 22 of nieuwer.

```bash
npm install
npm run dev
```

## Scripts

| Commando                   | Doel                           |
| -------------------------- | ------------------------------ |
| `npm run dev`              | Ontwikkelserver                |
| `npm run build`            | Productiebuild                 |
| `npm run preview`          | Productiebuild lokaal bekijken |
| `npm run check`            | Type- en Svelte-controle       |
| `npm run lint`             | Prettier en ESLint             |
| `npm run format`           | Code formatteren               |
| `npm test`                 | Unit-tests                     |
| `npm run test:e2e`         | End-to-end-tests               |
| `npm run validate`         | Content valideren              |
| `npm run import:vademecum` | Vademecum-content importeren   |
| `npm run icons`            | PWA-iconen genereren           |

## Licentie

MIT
