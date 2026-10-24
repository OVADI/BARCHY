# BARCHY

Offline-first vademecum voor architectuur- en bouwkundestudenten. Een PWA met bouwkundige kerngegevens, rekenhulpen en toetsing aan de Bbl-eisen voor woonfuncties in nieuwbouw.

**Live:** [barchy.ovadi.nl](https://barchy.ovadi.nl)

BARCHY is een studentenproject en geen officiële app van de TU Delft. De gegevens komen uit het TU Delft Vademecum en de Bbl en kunnen kleine fouten bevatten: controleer waarden altijd in de bron.

## Onderdelen

- **Beton, staal en hout:** vademecum-tabellen en constructieve gegevens
- **Ruimte:** Bbl-eisen woonfunctie nieuwbouw, inclusief trapcalculator
- **Tekenen, tools, zoeken, opgeslagen items**
- **Over BARCHY:** bronnen, disclaimer en een feedbackformulier

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
| `npm run report:status`    | Controle-overzicht maken       |
| `npm run import:vademecum` | Vademecum-content importeren   |
| `npm run icons`            | PWA-iconen genereren           |

## Deploy

Elke push naar `main` test en bouwt de app en zet hem op GitHub Pages (`.github/workflows/deploy.yml`), op het eigen domein uit `static/CNAME`.

Eenmalig in te stellen:

1. **Pages:** Settings → Pages → Source: GitHub Actions. Custom domain: `barchy.ovadi.nl`, daarna Enforce HTTPS.
2. **DNS** bij de beheerder van ovadi.nl: een `CNAME`-record `barchy` → `ovadi.github.io`.
3. **Feedbackformulier:** maak een access key op [web3forms.com](https://web3forms.com) en zet die als repository-variabele `WEB3FORMS_KEY` (Settings → Secrets and variables → Actions → Variables). Zonder key toont About een link naar GitHub Issues.

## Bijdragen

Zie [CONTRIBUTING.md](CONTRIBUTING.md). Fouten en wensen kun je melden via Issues of via het formulier op de About-pagina.

## Licentie

- **Code:** MIT, zie [LICENSE](LICENSE).
- **Gegevens:** de tabellen en teksten in `content/` zijn afgeleid van het [TU Delft Vademecum](https://github.com/TeachBooks/vademecum) (TeachBooks), licentie [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Bbl-waarden komen uit het [Besluit bouwwerken leefomgeving](https://wetten.overheid.nl/BWBR0041297/2026-09-24); wetteksten zijn vrij van auteursrecht (Auteurswet art. 11).
