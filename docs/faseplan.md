# BARCHY-faseplan

Dit is het vaste overzicht van de fases van BARCHY. Verwijs ernaar met "fase N".

**Werkwijze**

- Na elke fase stopt het werk met een korte samenvatting en een controlelijst.
- Bouwwaarden worden nooit verzonnen. Een onzekere waarde krijgt `verify: true` en [VERIFY].
- Een waarde die gecontroleerd is en in het Vademecum (of de Bbl) staat, is goed genoeg. Een formele controle per persoon is niet nodig.
- Na het afronden van een fase wordt dit bestand bijgewerkt: status en commit.

| Fase | Onderwerp                             | Status                |
| ---- | ------------------------------------- | --------------------- |
| 1    | Fundament                             | Klaar                 |
| 2+3  | Staal en content-basis                | Klaar (zie correctie) |
| 4    | Bbl en ruimte                         | Klaar                 |
| 5    | Hout, beton en staalplaten            | Klaar, ter controle   |
| 6    | Zoeken                                | Klaar, ter controle   |
| 7    | Tekenen                               | Klaar, ter controle   |
| 8    | Vuistregels hout, beton en metselwerk | Klaar, ter controle   |
| 9    | Presentatie-checklist                 | On hold               |
| 10   | Afronding                             | Klaar, ter controle   |

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
- Bronregel hout en beton aangepast naar "Dimensietabellen: Hout" en "Dimensietabellen: Betonstaal". Alleen `staal.md` noemt Bouwen met Staal; `hout.md` en `betonstaal.md` noemen geen oorspronkelijke bron

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

Commits `bb379e0`, feedback verwerkt in `2f30b7c` en `31a808d`

- Bron gevonden in het Vademecum zelf: hoofdstuk Tekeninstructies, "Lijnsoorten en arcering" (gebaseerd op NEN 2302) en "Constructie tekeningen". De arceringstabellen verwijzen naar de Lecture Notes Technical Drawings (CT1052-09). Door de gebruiker bevestigd als bron (24-10-2026)
- Tekenen (`/drawing`) met drie tabbladen:
  - Arcering: 21 arceringen in vier groepen, met per arcering de schalen (1:100 t/m 1:1) en de opmerking uit de bron. Je kunt filteren op schaal
  - Lijnsoorten: getrokken lijn, streeplijn, gemengde streeplijn en stippellijn, met waarvoor en in welke dikte ze in de tekeninstructies gebruikt worden
  - Constructietekeningen: de stappen voor de DC-plattegrond, de geëxplodeerde axonometrie en het constructiedetail, met lijnsoort, lijndikte en kleur
- Inhoud in `content/drawing/conventions.json`. De arceringen zijn opnieuw getekend als SVG naar de afbeeldingen in het Vademecum; lijnafstanden volgen de afbeeldingen en zijn geen waarde uit de bron. Alles staat op Controleren
- De houtdoorsnede gebruikt nu de arcering Hout uit het Vademecum, voor gezaagd en gelamineerd hout
- Zoeken vindt arceringen, lijnsoorten en tekeninstructies, bijvoorbeeld "streeplijn", "hardhout" of "axonometrie". Bij gelijke treffers gaan hele woorden nu voor: "beton" vindt beton voor "betonsteen"
- Rapport `reports/drawing-issues.md`
- Feedback verwerkt: Arcering begint met vier materiaalgroepen, elk met een eigen pagina (`/drawing/hatch/[groep]`). Tekeningen begint met drie blokken, elk met een eigen pagina (`/drawing/guide/[id]`). Daar staan alle stappen onder elkaar in de volgorde van het Vademecum, met een korte titel; tik op een stap voor de volledige instructie. De korte titels zijn eigen tekst van BARCHY, niet uit de bron
- Precache na deze fase: 149 bestanden, 1328 KiB (was 1077 KiB, gemeten op de commit vóór fase 7)

**Te controleren door de gebruiker:**

- Vergelijk de getekende arceringen en lijnen met de afbeeldingen in het Vademecum
- De aandachtspunten 1–7 in `reports/drawing-issues.md`, vooral de volgorde van de schalen bij beton en de arceringen die in de bron gelijk zijn (hout en metselwerk overige, hardhout en steenachtig)
- Gelamineerd hout: dezelfde arcering als gezaagd hout, of lijmverbindingen tussen de lamellen?

### Fase 8: Vuistregels hout, beton en metselwerk

PR #9, merge `1a9485e`

**Doel:** de ontwerp-vuistregels uit de Vademecum opnemen voor hout (hoofdstuk 7), beton (hoofdstuk 8) en metselwerk (hoofdstuk 9), zoals fase 2+3 dat voor staal (hoofdstuk 6) deed.

**Gebruik:** de vuistregels zijn belangrijk voor het ontwerp, vooral die voor overspanningen. Ze komen op handige, overzichtelijke pagina's die makkelijk te gebruiken zijn, zodat ze goed worden toegepast. Wie een overspanning invult of een vorm kiest, ziet direct de bijbehorende regel en waarschuwing, zonder in de bron te hoeven zoeken.

**Bron:** [TeachBooks/vademecum](https://github.com/TeachBooks/vademecum) op dezelfde vaste commit als de staaldata (`9a2f70a…`), map `book/ontwerp/{hout,beton,metselwerk}/`. Licentie CC BY 4.0. Alle waarden blijven `verify: true` tot ze gecontroleerd zijn.

**Inhoud**

- **Liggers:** overspanning `l`, hoogte `h = l/x`, hart-op-hart `h.o.h`, overstek `a` (bijvoorbeeld 0,25·l of 0,4·l), pijl `f` en straal `r`, per vorm: rechte ligger, ligger met overstek, zadeldak, gebogen, op meerdere steunpunten, vakwerk, onderspannen, portaalspant, drie-scharnierenspant en boogspant. Daarbij wanneer een ligger buigt of krom wordt en hoe de vorm de regel verandert
- **Beton-liggers:** prefab voorgespannen (1/20) en in het werk gestort gewapend (1/10)
- **Vloeren, kolommen, wanden, stabiliteit en verbindingen** voor hout en beton, waaronder houten kanaalplaat en CLT, en stabiliteitswanden van HSB en CLT per aantal bouwlagen
- **Metselwerk:** minimale wanddikte kalkzandsteen voor eindgevel en tussenwand, per aantal bouwlagen en beukmaat (gebaseerd op NPR 6791)
- Toelichtingen en waarschuwingen uit de bron horen bij de regel, bijvoorbeeld de zijdelingse steun van bovenranden en de trekspanning loodrecht op de vezel bij gebogen liggers

**Grafieken:** een deel van de regels staat in de bron als ontwerpgrafiek, niet als getal. Waarden die van een grafiek zijn afgelezen krijgen `verify: true` en [VERIFY], met een verwijzing naar de bronfiguur.

**Voorlopige aanpak, af te stemmen bij de start van de fase**

- Het feitenmodel uitbreiden: factor-vormen (`a = 0,25·l`), tabelwaarden, afgelezen grafiekpunten en een toelichting per regel
- Nieuwe `content/facts/timber.json`, `concrete.json` en `masonry.json`
- Een tab Vuistregels bij Hout en Beton, en een plek voor metselwerk
- Een ligger-schatter naar voorbeeld van de trapcalculator: kies materiaal en vorm, vul `l` in, en zie `h`, overstek en een waarschuwing buiten het bereik
- Opnemen in de zoekindex en een rapport `reports/vuistregels-issues.md`

**Open punten**

- ~~Gaan de figuren uit de bron mee?~~ Besloten 24-10-2026: nee. Alleen de waarden, met een verwijzing naar de bronfiguur
- `beton/verbindingen.md` is in de bron leeg (bevestigd: alleen een kop, er is niets overgenomen)

**Voortgang** (bijgewerkt na elke stap, zodat een nieuwe sessie hier verder kan)

- [x] Feitenmodel uitgebreid (`src/lib/schema/fact.ts`): `symbol` (h, a, f …), `factorOf` (a = 0,25 · l), `when` (bereik voor rekentools), `notes` (toelichting en let op), en per bestand `groups` (bijvoorbeeld een liggervorm) en `charts` (verwijzing naar een ontwerpgrafiek, zonder waarden). `formatFact` schrijft nu "h = l/17" en "a = 0,25 · l"
- [x] Hout: `content/facts/timber.json`, 59 regels, 18 groepen, 8 grafiekverwijzingen. Elke kolom van een brontabel is één set regels met hetzelfde bereik. Aandachtspunten in `reports/vuistregels-issues.md`
- [x] Beton: `content/facts/concrete.json`, 43 regels, 9 groepen, 1 grafiekverwijzing. Inclusief de productgegevens van Dycore-kanaalplaten (hoogte, gewicht, maximale lengte). Aandachtspunten in hetzelfde rapport
- [x] Metselwerk: `content/facts/masonry.json`, 40 regels (kalkzandsteen, eindgevel en tussenwand, per aantal bouwlagen en beukmaat). Aandachtspunten in hetzelfde rapport
- [x] Tab Vuistregels bij Hout en Beton: overzicht per onderdeel (liggers en spanten, vloeren, wanden, kolommen, stabiliteit) met per vorm een eigen pagina `/rules/[materiaal]/[groep]` met regels, toelichtingen en grafiekverwijzingen. Metselwerk heeft een eigen pagina `/masonry` (kies wand, aantal bouwlagen en beukmaat; de hele tabel staat eronder) en een tegel op het startscherm. Precache na deze stap: 215 bestanden, 1978 KiB (was 1328 KiB vóór fase 8)
- [x] Liggerschatter (`/tools/beam`): kies staal, hout of beton, een vorm en een uitvoering, vul l in, en zie h (afgerond op 10 mm) met de andere maten van dezelfde tabelkolom (overstek a, pijl f, straal r …) en een waarschuwing als l buiten het bereik van de regel valt. Regels met (l+g) kunnen niet uit l alleen; dat staat erbij. De staal-liggerregels kregen daarvoor `symbol: "h"` en een bereik `when` (zelfde waarden als hun scope-tekst), dus op de staalpagina staat nu "h = l/15 – l/20". Precache 2089 KiB
- [x] Vormschema's: per vorm een eigen SVG-schema (`BeamDiagram.svelte`, `src/lib/facts/shapes.ts`), getekend naar de figuren in het Vademecum, met l, h, a, f, r en g. Klein als pictogram in het overzicht Vuistregels, groot op de groepspagina en in de liggerschatter. Uit de figuren bleek wat h1, h2 en g zijn; labels en rapport zijn bijgewerkt. Precache 2127 KiB
- [x] Liggerschatter: bij het driescharnierenspant met geknikt of gebogen spantbeen vul je ook g in (hoogte spantbeen, van voet tot knik, volgens de bronfiguur). Dan worden h_knik = (l+g)/n, h_nok en h_voet uitgerekend
- [x] Zoekindex: elke vormpagina, elke vuistregel van hout en beton (met de vorm als tweede regel), de grafiekverwijzingen, de metselwerktabel per wandtype en de liggerschatter. Bijvoorbeeld "zadeldakligger", "toog voorspanning", "kalkzandsteen" of "overspanning". Precache 2203 KiB (was 1328 KiB vóór fase 8)

Alle onderdelen van fase 8 zijn gebouwd. Nog te doen: controle door de gebruiker.

**Te controleren door de gebruiker:**

- De aandachtspunten in `reports/vuistregels-issues.md` (hout 1–9, beton 1–10, metselwerk 1–6), vooral het portaalspant (h.o.h. 10–40 m), de hsb-stijlen (binnen- en buitenmuur verwisseld?), 214 mm bij kalkzandsteen en g in (l+g)
- De vormschema's naast de figuren in het Vademecum
- Is de offline-cache van 2203 KiB acceptabel, of moeten de vormpagina's pas laden als je ze opent?

### Fase 10: Afronding

Branch `claude/fase10-afronding`, gebaseerd op main met fase 8

- **About in plaats van Instellingen.** De pagina Instellingen is weg: de taalknop stond al op Home, en het thema blijft altijd donker. Op die plek staat nu een hart-handdruk-icoon dat naar Over BARCHY (`/about`) gaat. Daar staan:
  - waarom BARCHY bestaat, in de ik-vorm (concepttekst)
  - de bronnen met hun licentie
  - de disclaimer, met een knop om hem opnieuw te lezen
  - open source, met links naar de code en de issue-formulieren
  - het feedbackformulier
  - versie en maker
- **Disclaimer bij de eerste keer openen** (`Disclaimer.svelte`, een modale `<dialog>`). Wat je ziet, wordt onthouden in `localStorage` (`barchy.disclaimer`), met een versienummer. Een nieuwe tekst wordt dus weer één keer getoond.
- **Feedback via Web3Forms** (`src/lib/feedback.ts`, `FeedbackForm.svelte`). Op Home staat een tegel "Wil je iets toevoegen of aanvragen?" die naar het formulier op About springt.
  - Versturen werkt alleen online. Offline blijft de tekst staan en verschijnt er een melding.
  - De key komt uit de repo-variabele `WEB3FORMS_KEY`. Zonder key toont About een link naar GitHub Issues.
- **Open source en release:**
  - `LICENSE` (MIT; ontbrak nog), `CONTRIBUTING.md` en `CHANGELOG.md`
  - versie 1.0.0
  - README met live-link, deploy en de licentie van de gegevens (CC BY 4.0)
- **Hosting:** GitHub Pages op `barchy.ovadi.nl`. `static/CNAME` is toegevoegd, de deploy staat weer aan en `BASE_PATH` is leeg.
- **Controleronde:** `npm run report:status` maakt `reports/controle.md`. Daarin staan nu 165 waarden op Controleren: 151 vuistregels en grafiekverwijzingen uit fase 8 (hout 67, beton 44, metselwerk 40), 10 tekenconventies en 4 staalprofielen (HE 1, IPE 3). De kop van `reports/bbl-issues.md` is bijgewerkt.
- Geen extra rekentools in deze fase.
- **Na afloop:** nieuw logo (`static/logo.svg`, `Logo.svelte`, app-icoon met alleen het merkteken) en de uitleg "Zet op beginscherm" (`InstallGuide.svelte`, `src/lib/install.ts`). De uitleg verschijnt na de disclaimer en alleen op telefoon of tablet; op Over BARCHY staat een knop om hem opnieuw te openen.
- Precache na deze fase: 223 bestanden, 2285 KiB (was 2203 KiB na fase 8)

**Te doen door de gebruiker:**

- De About-tekst nalezen (`about.why` in `content/i18n/nl.json` en `en.json`)
- De repo publiek maken. Let op: de commits tonen de e-mailadressen com@ovadi.nl en olivier@ovadi.nl
- Settings → Pages → Source: GitHub Actions; daarna Custom domain `barchy.ovadi.nl` en Enforce HTTPS
- DNS van ovadi.nl: `CNAME` `barchy` → `ovadi.github.io`
- Een access key aanmaken op web3forms.com en die als repo-variabele `WEB3FORMS_KEY` zetten
- `reports/controle.md` nalopen

## On hold

### Fase 9: Presentatie-checklist

> **On hold (24-10-2026):** eerst nagaan of de checklist echt nuttig is voordat hij gebouwd wordt.

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

---

## Doorlopend: controle door de gebruiker

Op 24-10-2026 gecontroleerd met een externe controleronde:

- [x] 56 Bbl-eisen nagelopen (`content/facts/bbl.json`)
- [x] 30 staalfeiten en vuistregels (`content/facts/steel.json`). Vloeirek S235/S275/S355 gecorrigeerd van % naar ‰ (het Vademecum schrijft %)
- [x] Eenheden van I en W bij de staalplaten bevestigd. De bron licht σ niet toe
- [x] 14 houtmaten zonder passende tabelwaarde: de maten kloppen
- [x] Correcties UNP 150 → 160, HE 160 M (iz) en HE 1000 AA
- [x] Bronregel hout en beton aangepast
- [x] 38 van de 42 staalprofielen gecorrigeerd met een bron (zie `content/steel/corrections.json`). Nog op Controleren: IPE 240 R, 270 R, 300 R en HE 400 x107 (geen onafhankelijke bron); zie `reports/vademecum-issues.md`
