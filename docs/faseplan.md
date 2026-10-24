# BARCHY-faseplan

Dit is het vaste overzicht van de fases van BARCHY. Verwijs ernaar met "fase N".

**Werkwijze**

- Na elke fase stopt het werk met een korte samenvatting en een controlelijst.
- Bouwwaarden worden nooit verzonnen. Een onzekere waarde krijgt `verify: true` en [VERIFY].
- Alle Bbl-feiten blijven `verify: true` tot ze gecontroleerd zijn.
- Na het afronden van een fase wordt dit bestand bijgewerkt: status en commit.

| Fase | Onderwerp                  | Status                 |
| ---- | -------------------------- | ---------------------- |
| 1    | Fundament                  | Klaar                  |
| 2+3  | Staal en content-basis     | Klaar (zie correctie)  |
| 4    | Bbl en ruimte              | Klaar                  |
| 5    | Hout, beton en staalplaten | Klaar, ter controle    |
| 6    | Zoeken                     | Gepland                |
| 7    | Tekenen                    | Gepland, wacht op bron |
| 8    | Presentatie-checklist      | Gepland                |
| 9    | Afronding                  | Gepland                |

---

## Klaar

### Fase 1: Fundament

Commit `cb60a59`

- SvelteKit 2, Svelte 5 en TypeScript, gebouwd als statische PWA die offline werkt
- Kleuren, tekst en afstanden als tokens (`tokens.css`), standaard donker
- Basiscomponenten: Tile, Stat, Pill, IconButton, Stepper, TypeTag, InfoFab, InfoSheet, BottomNav en PageHeader
- Nederlands en Engels uit `content/i18n`
- Deploy-workflow

### Fase 2+3: Staal en content-basis

Commit `61fee6d`

- Staaldata uit het Vademecum voor HE, IPE, UNP, SHS, RHS en CHS, met correcties en een importrapport (`reports/vademecum-issues.md`)
- Schema's en validatie bij het bouwen, plus rekenkernen voor doorsnede en gewicht
- Staalbrowser en profielscherm
- Stuklijst en Bewaard, met export naar CSV
- Ruwe data voor hout (`content/timber/sections.json`), beton (`content/concrete/rebar.json`) en staalplaten (`content/steel/sheets.json`)

> **Correctie:** de commit noemt beton, hout en tekenhulp, maar die schermen zijn nog niet gebouwd. Ze tonen alleen "binnenkort". Ze staan daarom bij fase 5 en 7.

### Fase 4: Bbl en ruimte

Commit `ce29887`

- 56 Bbl-eisen voor woonfunctie nieuwbouw (hoofdstuk 4, versie 24-09-2026) in `content/facts/bbl.json`, nog niet gecontroleerd
- Pagina Ruimte & mens (`/space`) met tabbladen
- Trapcalculator (`/tools/stair`) die toetst aan de Bbl-feiten
- Rapport `reports/bbl-issues.md`

---

## Gepland

### Fase 5: Hout, beton en staalplaten

Commits `a89c0f6`, feedback verwerkt in `99ec1f7`

- Hout (`/timber`): gezaagd en gelamineerd hout uit `content/timber/sections.json`. Je kiest b en h en ziet een doorsnede op schaal met A, Wy, Iy, Wz en Iz. Bij grote liggers schaalt de eenheid mee (×10⁶ of ×10⁹), zodat de getallen passen
- Beton (`/concrete`): wapeningsoppervlakte uit `content/concrete/rebar.json`. Je kiest Ø en het aantal staven (1–10), plus de volledige tabel
- Staalplaten (`/steel/sheets`, tegel op het staalscherm): h, t, Iy, Wy en σ uit `content/steel/sheets.json`. Iy, Wy en σ staan op Controleren zolang de eenhedenvraag open is
- Nieuwe componenten: `ValueGrid` (waardentegels met uitlegkaart, zoals bij staal) en `ChoiceRow` (rij keuzepillen)
- Houtdoorsnede met schematische arcering: schuin voor gezaagd, liggend voor gelamineerd. De echte tekenconventie volgt in fase 7
- Precache na deze fase: 120 bestanden, 870 KiB

**Te controleren door de gebruiker:**

- Eenheden en σ van de staalplaten (zie hieronder bij Doorlopend)
- 14 houtmaten staan op Controleren: geen tabelwaarde in de rij past erbij (bijvoorbeeld gezaagd 58 × 69)
- De bronregel van hout en beton luidt nu "Oorspronkelijke staaldata: Bouwen met Staal". Dat klopt waarschijnlijk niet voor hout en beton; graag aangeven wat er moet staan

### Fase 6: Zoeken

**Doel:** werkend zoeken, ook offline.

- Eén index over staalprofielen, hout, beton, Bbl-eisen en tools
- Het zoekveld op Home koppelen aan `/search`
- Andere schrijfwijzen vinden hetzelfde resultaat, bijvoorbeeld "HE 200 A" → "HEA 200"
- Komt na fase 5, zodat alle content in de index kan

### Fase 7: Tekenen (lijnsoorten en arcering)

**Doel:** de tekenhulp vullen (`/drawing`).

**Voorwaarde:** eerst is een bron nodig, zoals een Vademecum-hoofdstuk of een NEN-norm. Die moet worden aangeleverd of bevestigd. Zonder bron start deze fase niet.

### Fase 8: Presentatie-checklist

**Doel:** per presentatiemoment nalopen of je project compleet is: wat moet erin, wat moet je laten zien, en aan welke eisen heb je het ontwerp getoetst.

- Werkt voor bachelor-midterms en eindpresentaties en voor het master-afstuderen (P1 t/m P5)
- **Eigen lijsten:** de app bevat geen vaste TU Delft-eisen. Je maakt zelf een lijst per vak of moment en vult de punten in. Zo komt er geen verzonnen inhoud in de app.
- Per moment een checklist met punten om af te vinken, met per punt een notitie: waarin het zit (tekening, maquette, rapport) en de status
- Een punt kan verwijzen naar een onderdeel van BARCHY, bijvoorbeeld de trapcalculator of een Bbl-eis, zodat je ziet waaraan je het ontwerp hebt getoetst
- Lijsten worden lokaal op het apparaat bewaard en werken offline. Exporteren (bijvoorbeeld als CSV) zoals bij de stuklijst
- Lijst kopiëren naar een nieuw moment (bijvoorbeeld van P2 naar P3)

**Open punten, af te stemmen bij de start van de fase:**

- Komt dit onder Bewaard of krijgt het een eigen tab?
- Is een voorbeeldlijst gewenst, of start elke lijst leeg?

### Fase 9: Afronding

- Instellingen uitbreiden, zoals licht/donker
- Eventueel extra rekentools
- De grootte van de offline-cache (PWA precache) meten en rapporteren
- Volledige controleronde over alle [VERIFY]-waarden
- Release

---

## Doorlopend: controle door de gebruiker

- [ ] 56 Bbl-eisen nalopen (`content/facts/bbl.json`). Zie de aandachtspunten 1–5 in `reports/bbl-issues.md`
- [ ] Eenheden van I en W bij de staalplaten bevestigen, en vastleggen welke spanning σ is (`reports/vademecum-issues.md`)
- [ ] Correctie HE 160 M (iz) controleren (`content/steel/corrections.json`)
- [ ] Correctie UNP 150 → 160 controleren (`content/steel/corrections.json`)
