# Bbl-import: controlelijst en open punten

Bron: Besluit bouwwerken leefomgeving (BWBR0041297), geconsolideerde versie geldend vanaf 24-09-2026,
opgehaald van https://wetten.overheid.nl/BWBR0041297/2026-09-24 op 24-10-2026.
Alle 56 feiten in `content/facts/bbl.json` zijn met de hand uit de wettekst overgenomen en staan op `status: flagged`.

## Scope

- Alleen hoofdstuk 4 (Nieuwbouw), gebruiksfunctie **woonfunctie**.
- Waar een tabel per soort woonfunctie verschilt, is de rij **"andere woonfunctie"** gebruikt
  (niet woonwagen, studenten of zorg). Dat staat in `scope` van het feit.
- Welke leden voor de woonfunctie gelden, is afgelezen uit de aansturingstabellen 4.19, 4.24, 4.162, 4.165,
  4.168, 4.171, 4.174 en 4.179.

## Bewust weggelaten

| Wat | Waarom |
|---|---|
| Art. 4.21 lid 4 (afscheiding 0,7 m + bovenregel 1,1 m) | Volgens tabel 4.19 niet van toepassing op woonfunctie |
| Art. 4.21 lid 6 (1,3 m naast langzaam verkeer) | Volgens tabel 4.19 niet van toepassing op woonfunctie |
| Art. 4.26a (trapmarkering) | Volgens tabel 4.24 niet van toepassing op woonfunctie |
| Art. 4.28 lid 2 (leuning aan beide zijden) | Volgens tabel 4.24 niet van toepassing op woonfunctie |
| Trapformule (2 × optrede + aantrede) | Staat niet in de Bbl; hoort bij een vuistregel met eigen bron |
| Afwijkende waarden woonwagen / studenten / zorg | Buiten de afgesproken scope |

## Aandachtspunten bij controle

1. Op wetten.overheid.nl staat bij art. 4.19, 4.21, 4.24, 4.25, 4.28, 4.162, 4.164, 4.171, 4.172, 4.174 en 4.179
   de melding *"Wijziging(en) zonder datum inwerkingtreding aanwezig"*. De waarden kunnen dus binnenkort wijzigen.
2. `validFrom` is de datum van de geconsolideerde versie (24-09-2026), niet de datum waarop elk artikel in werking trad.
3. Art. 4.20 en 4.25 zijn drempels ("meer dan 1 m", "meer dan 0,21 m"); ze hebben geen `bound`, de tekst zit in het label.
4. Art. 4.23 (geen opstap tussen 0,2 en 0,7 m) is een verboden zone, geen toegestane band; daarom geen `bound: range`.
5. Rechthoekmaten ("0,9 m x 1,2 m") staan als `value` + `by`, in de volgorde van de wettekst.
