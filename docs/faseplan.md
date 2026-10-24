# BARCHY-faseplan

Dit is het vaste overzicht van de fases van BARCHY. Verwijs ernaar met "fase N".

**Werkwijze**

- Na elke fase stopt het werk met een korte samenvatting en een controlelijst.
- Bouwwaarden worden nooit verzonnen. Een onzekere waarde krijgt `verify: true` en [VERIFY].
- Alle Bbl-feiten blijven `verify: true` tot ze gecontroleerd zijn.
- Na het afronden van een fase wordt dit bestand bijgewerkt: status en commit.

| Fase | Onderwerp                  | Status                |
| ---- | -------------------------- | --------------------- |
| 1    | Fundament                  | Klaar                 |
| 2+3  | Staal en content-basis     | Klaar (zie correctie) |
| 4    | Bbl en ruimte              | Klaar                 |
| 5    | Hout, beton en staalplaten | Klaar, ter controle   |
| 6    | Zoeken                     | Klaar, ter controle   |
| 7    | Tekenen                    | Klaar, ter controle   |
| 8    | Presentatie-checklist      | Gepland               |
| 9    | Afronding                  | Gepland               |

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

## Ter controle

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

Commit `9247650`

- Eén zoekindex over 408 staalprofielen, 207 houtmaten, 8 wapeningsdiameters, 10 staalplaten, 56 Bbl-eisen, 30 staalvuistregels en materiaalwaarden, de tools en de schermen
- De index wordt bij het bouwen gemaakt (`/data/search.json`) en zit in de offline-cache, dus zoeken werkt ook offline
- Andere schrijfwijzen vinden hetzelfde resultaat: "HE 200 A", "HEA200" en "HE A 200" → HEA 200; "48,3x4" → CHS 48,3×4; "69 x 195" → gezaagd hout 69 × 195; "Ø12" → wapening Ø12
- Woorden werken in het Nederlands en Engels, ook artikelnummers zoals "4.163"
- Het zoekveld op Home stuurt door naar `/search`. De zoekterm staat in de URL, dus terug gaan of een link delen geeft dezelfde resultaten
- Een resultaat opent direct de juiste maat of eis: hout, beton en staalplaten openen met die maat gekozen, Ruimte en Staal openen het juiste tabblad en markeren de eis
- Zoekindex: 167 KB (20 KB gecomprimeerd). Precache na deze fase: 124 bestanden, 1057 KiB

**Te controleren door de gebruiker:**

- Zoek een paar profielen in je eigen schrijfwijze en meld wat niet gevonden wordt
- Zoekwoorden per profielfamilie (bijvoorbeeld "koker", "buis", "breedflensbalk") staan in `src/lib/search/build.ts`. Kloppen deze benamingen?
- Groei van de offline-cache: van 870 naar 1057 KiB

### Fase 7: Tekenen

Commit `bb379e0`

- Bron gevonden in het Vademecum zelf: hoofdstuk Tekeninstructies, "Lijnsoorten en arcering" (gebaseerd op NEN 2302) en "Constructie tekeningen". De arceringstabellen verwijzen naar de Lecture Notes Technical Drawings (CT1052-09). Door de gebruiker bevestigd als bron (24-10-2026)
- Tekenen (`/drawing`) met drie tabbladen:
  - Arcering: 21 arceringen in vier groepen, met per arcering de schalen (1:100 t/m 1:1) en de opmerking uit de bron. Je kunt filteren op schaal
  - Lijnsoorten: getrokken lijn, streeplijn, gemengde streeplijn en stippellijn, met waarvoor en in welke dikte ze in de tekeninstructies gebruikt worden
  - Constructietekeningen: de stappen voor de DC-plattegrond, de geëxplodeerde axonometrie en het constructiedetail, met lijnsoort, lijndikte en kleur
- Inhoud in `content/drawing/conventions.json`. De arceringen zijn opnieuw getekend als SVG naar de afbeeldingen in het Vademecum; lijnafstanden volgen de afbeeldingen en zijn geen waarde uit de bron. Alles staat op Controleren
- De houtdoorsnede gebruikt nu de arcering Hout uit het Vademecum, voor gezaagd en gelamineerd hout
- Zoeken vindt arceringen, lijnsoorten en tekeninstructies, bijvoorbeeld "streeplijn", "hardhout" of "axonometrie". Bij gelijke treffers gaan hele woorden nu voor: "beton" vindt beton voor "betonsteen"
- Rapport `reports/drawing-issues.md`
- Precache na deze fase: 125 bestanden, 1172 KiB (was 1077 KiB, gemeten op de vorige commit)

**Te controleren door de gebruiker:**

- Vergelijk de getekende arceringen en lijnen met de afbeeldingen in het Vademecum
- De aandachtspunten 1–7 in `reports/drawing-issues.md`, vooral de volgorde van de schalen bij beton en de arceringen die in de bron gelijk zijn (hout en metselwerk overige, hardhout en steenachtig)
- Gelamineerd hout: dezelfde arcering als gezaagd hout, of lijmverbindingen tussen de lamellen?

## Gepland

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
