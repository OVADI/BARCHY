# Vuistregels: aandachtspunten in de bron

Bron: TU Delft Vademecum (TeachBooks), commit `9a2f70a`, map `book/ontwerp/`. Licentie CC BY 4.0.

De tabellen zijn met de hand overgenomen. Elke kolom van een brontabel wordt één set regels met hetzelfde bereik (`when`). Alle regels en grafiekverwijzingen staan op Controleren (`flagged`). De paragraafnummers (§7.1 t/m §7.5) volgen de volgorde in `book/_toc.yml`. Engelse teksten zijn vertaald door BARCHY.

## Hout (hoofdstuk 7), `content/facts/timber.json`

59 regels, 18 groepen en 8 grafiekverwijzingen.

### Te controleren

1. **Portaalspant, h.o.h. 10 tot 40 m.** Dat is hetzelfde bereik als de overspanning l en veel groter dan bij de andere spanten (4 tot 10 m). Waarschijnlijk een fout in de bron. De app neemt het over zoals het er staat.
2. **Hsb-wanden: binnenmuur 140 × 38 mm, buitenmuur 89 × 38 mm.** De binnenmuur heeft hier de zwaardere stijl. Zijn de twee verwisseld? De stabiliteitsregel voor hsb noemt stijlen van 140 × 38 mm.
3. **Zadeldakligger met hellende bovenrand, h1 en h2.** In de tekst staat niet welke hoogte h1 en welke h2 is. Dat staat alleen in de bronfiguur. In de app staat "zie bronfiguur".
4. **Driescharnierenspant met geknikt of gebogen spantbeen, (l+g).** De bron legt g niet uit. Vermoedelijk is het een maat uit de figuur.
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
