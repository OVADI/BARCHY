# Tekenen: aandachtspunten in de bron

Bron: TU Delft Vademecum (TeachBooks), commit `9a2f70a`

- `book/instructie/teken_instructies/lijnsoorten_arcering.md` (lijnsoorten en arcering, gebaseerd op NEN 2302)
- `book/instructie/teken_instructies/constructie_tekeningen.md` (stappen met lijnsoort en lijndikte)

De arceringen zijn opnieuw getekend als SVG naar de afbeeldingen in `Images/`. Namen, schalen, opmerkingen en lijndiktes zijn letterlijk overgenomen; de lijnafstand in de arceringen volgt de afbeeldingen en is geen waarde uit de bron. Alles staat in `content/drawing/conventions.json` op Controleren (`flagged`).

## Te controleren

1. **Beton en beton prefab, volgorde van de schalen.** De gedetailleerde arcering (driehoekjes en stippen) staat bij 1:100 en 1:50, het egale grijze vlak bij 1:50 t/m 1:1. Dat lijkt omgekeerd. De app toont het zoals de bron.
2. **Hout en Metselwerk overige** gebruiken dezelfde schuine arcering; de afbeeldingen verschillen alleen in verschuiving.
3. **Hardhout en Steenachtig** gebruiken dezelfde kruisarcering, ook alleen verschoven.
4. **Hartlijn bij constructiedetails.** De tekst zegt gemengde streeplijn 0,3 mm, de afbeelding toont een streeplijn (dezelfde als bij "niet zichtbaar"). De app volgt de tekst.
5. **Schoor in de DC-plattegrond.** De tekst noemt geen lijnsoort of dikte. De app volgt de afbeelding (rode streeplijn) en noemt geen dikte.
6. **Gelamineerd hout.** De bron heeft geen eigen arcering voor gelamineerd hout. Het houtscherm gebruikt nu voor gezaagd en gelamineerd hout dezelfde arcering Hout. Een lijmverbinding tussen de lamellen zou kunnen, maar de lameldikte staat niet in de bron.
7. **Engelse namen** van lijnsoorten en arceringen zijn vertaald door BARCHY, niet uit de bron.
