# Vuistregels: aandachtspunten in de bron

Bron: TU Delft Vademecum (TeachBooks), commit `9a2f70a`, map `book/ontwerp/`. Licentie CC BY 4.0.

De tabellen zijn met de hand overgenomen. Elke kolom van een brontabel wordt één set regels met hetzelfde bereik (`when`). Alle regels en grafiekverwijzingen staan op Controleren (`flagged`). De paragraafnummers (§7.1 t/m §7.5 en §8.1 t/m §8.5) volgen de volgorde in `book/_toc.yml`. Engelse teksten zijn vertaald door BARCHY.

## Hout (hoofdstuk 7), `content/facts/timber.json`

59 regels, 18 groepen en 8 grafiekverwijzingen.

### Te controleren

1. **Portaalspant, h.o.h. 10 tot 40 m.** Dat is hetzelfde bereik als de overspanning l en veel groter dan bij de andere spanten (4 tot 10 m). Waarschijnlijk een fout in de bron. De app neemt het over zoals het er staat.
2. **Hsb-wanden: binnenmuur 140 × 38 mm, buitenmuur 89 × 38 mm.** De binnenmuur heeft hier de zwaardere stijl. Zijn de twee verwisseld? De stabiliteitsregel voor hsb noemt stijlen van 140 × 38 mm.
3. **Zadeldakligger met hellende bovenrand, h1 en h2.** De tekst zegt niet welke hoogte h1 en welke h2 is. Volgens de bronfiguur is h1 de hoogte bij de nok en h2 de hoogte bij de oplegging. De app noemt ze nu zo (24-10-2026).
4. **Driescharnierenspant met geknikt of gebogen spantbeen, (l+g).** De tekst legt g niet uit. In de bronfiguur is g de hoogte van het spantbeen, van de voet tot de knik. De toelichting in de app zegt dat nu. In de liggerschatter vul je bij dit spant g apart in; dan worden h_knik, h_nok en h_voet uitgerekend. Of g zo bedoeld is, staat alleen in de figuur: controleren.
5. **Strikte grenzen.** De bron schrijft "< 5 m" (h.o.h.) en "> 6 m" (straal). Voor de rekentools is dat opgeslagen als een bovengrens of ondergrens (≤, ≥). Het verschil van één waarde op de grens is voor een vuistregel niet van belang.
6. **Driescharnierenspant met rechte liggers.** Alle drie de varianten hebben h = l/30 tot l/50, ook het vakwerk. Bij het vakwerk staat geen pijl f.
7. **"Alleen geschikt voor kleine spatkrachten"** (portaalspant en driescharnierenspant) gaat over een van de getoonde voetverbindingen en niet over de vuistregel zelf. Omdat de figuren niet in de app staan, verwijst de toelichting naar de bronfiguur.
8. **Rechte vakwerkligger, type 1.** De toelichting noemt "type 1" maar de tekst legt niet uit welk type dat is. De app verwijst naar de bronfiguur.
9. **Gezaagde balken (rechte ligger).** De bron geeft geen h.o.h.-afstand.

### Niet als waarde overgenomen

- **Ontwerpgrafieken.** Gelamineerde ligger, houten kanaalplaat, houten kolom en gelamineerde kolom staan in de app als verwijzing, met de uitgangspunten en de lijnen uit de tekst, maar zonder afgelezen waarden. Afgelezen punten zouden een eigen regel worden, ook op Controleren.
- **Grafieken van Swedish Wood** (CLT-vloer, CLT-wand 80, 100 en 120 mm) hebben een eigen copyright (© Swedish Wood), los van de CC BY-licentie van het Vademecum. Ze staan alleen als verwijzing in de app.
- **Verbindingen (§7.6)** bestaat alleen uit voorbeeldfiguren, zonder vuistregels. Er staat niets van in de app.
- **Detailtabellen per vorm** (verschijningsvorm en detail van opleggingen en verbindingen) zijn figuren en staan niet in de app.
- **Vormfiguren.** De app toont per vorm een eigen schema (`src/lib/components/BeamDiagram.svelte`), getekend naar de figuren in de bron, met dezelfde maataanduidingen (l, h, a, f, r, g). Het zijn vereenvoudigde schema's, geen kopie van de figuren.

## Beton (hoofdstuk 8), `content/facts/concrete.json`

43 regels, 9 groepen en 1 grafiekverwijzing.

### Te controleren

1. **Liggers, "1/20" en "1/10".** De bron noemt geen symbool. De app leest het als h = l/20 (prefab voorgespannen, B45) en h = l/10 (in het werk gestort, B25), zoals bij staal en hout.
2. **Vloeren, hoogte.** De tabellen voor de ribbenvloer en de breedplaatvloer noemen geen symbool voor de waarde, alleen "L/31" enzovoort. Bij de staalplaatbetonvloer staat "diepte = overspanning/25". De app gebruikt overal h.
3. **Uitkragende vloer.** Bij de ribbenvloer (L/9) en de breedplaatvloer (L/10) staat niet of L hier de lengte van de uitkraging is of de typische overspanning uit dezelfde rij.
4. **Breedplaatvloer, plaatlengte.** De tekst zegt maximaal 8500 mm, maar de productgegevens van Dycore noemen elementlengtes tot ongeveer 10 m. De app neemt 8500 mm over uit de tekst. De productgegevens van de bekistingsplaat (breedte, dikte en massa) staan er niet in.
5. **Betonwand: H/175 bij een verdiepingshoogte < 4 m, H/100 bij een gebouwhoogte > 60 m.** Bij een gebouw hoger dan 60 m met verdiepingen lager dan 4 m gelden beide regels. Welke gaat dan voor? De bron zegt het niet.
6. **Stabiliteitswand: H/100 of H/75** hangt af van de wandlengte ten opzichte van H/6. Dat is geen vast getal, dus het staat alleen in de tekst en niet in `when`.
7. **Betonkolommen.** De tabel geeft alleen waarden bij 1, 6, 11 en 16 verdiepingen. Mag je daartussen interpoleren? De bron zegt het niet.
8. **Prefab kolom, breedte = verdiepingshoogte/10.** Het bijschrift zegt "< 2 vrd." en de tekst "0 tot 2 verdiepingen". Voor de rekentools is maximaal 2 aangehouden.
9. **Kanaalplaat, doorbuiging "0.003 lt".** De app schrijft 0,003 · l. Wat "lt" betekent staat niet in de bron.
10. **Kanaalplaten van Dycore.** Dit zijn productgegevens van één fabrikant. Overgenomen zijn alleen hoogte, gewicht en maximale lengte per type. Voegen, doorsnede A, I_zz, M_br en de maximale lengte van pasplaten staan er niet in.

### Niet als waarde overgenomen

- **Combinatievloer, TT-platen en infra-balken** hebben in de bron geen getallen, alleen een beschrijving en een figuur.
- **Overspanningsgrafiek van Dycore** staat in de app als verwijzing, zonder afgelezen waarden. De figuur "Hoogte" naast de productgegevens staat er niet in.
- **Verbindingen (§8.6)** is in de bron leeg.
- **Links naar fabrikanten** (vbi.nl, dycore.nl, belton.nl enzovoort) staan niet in de app. Een deel ervan is waarschijnlijk verouderd.

## Metselwerk (hoofdstuk 9), `content/facts/masonry.json`

40 regels en 2 groepen: de minimale constructieve wanddikte d van kalkzandsteen in de onderste bouwlaag, voor een enkele eindgevel en een enkele tussenwand. Per aantal bouwlagen (1 t/m 5) en beukmaat (4 t/m 7 m). De bron zegt dat de tabellen gebaseerd zijn op NPR 6791.

### Te controleren

1. **Eindgevel, 5 bouwlagen.** Bij een beukmaat van 4 m staat 150 mm, bij 5 tot 7 m 120 mm. De kleinste beuk vraagt hier dus de dikste wand. Klopt dat, of is het een tikfout?
2. **Tussenwand, 3 bouwlagen.** Bij 6 m staat 150 mm, bij 7 m 120 mm. Ook hier wordt de wand dunner bij een grotere beuk.
3. **214 mm** (tussenwand, 4 en 5 bouwlagen) is geen gangbare dikte voor kalkzandsteen. Is het een spouwwand van 2 × 100 mm met een voeg, of een tikfout voor 214 → 240 of 250?
4. **Beukmaten tussen de kolommen** (bijvoorbeeld 5,4 m). De bron geeft alleen 4, 5, 6 en 7 m. Of je dan de waarde van de volgende grotere beukmaat neemt, staat er niet. Een rekentool moet hier voorzichtig mee omgaan.
5. **Vloerdikte h_t** hoort bij de beukmaat (180 tot 240 mm). Een andere vloerdikte valt buiten de tabel.
6. **Paragraafnummer §9.1** volgt de volgorde in `book/_toc.yml`.
