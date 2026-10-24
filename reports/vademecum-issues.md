# Vademecum: bevindingen in de dimensietabellen

Gegenereerd door `scripts/import-vademecum.ts` (BARCHY). Bron: [TeachBooks/vademecum](https://github.com/TeachBooks/vademecum) op commit `9a2f70afd158b7cee533c119bf4c88ae15106d4a`.
Alle waarden hieronder in basiseenheden (mm, mm², mm³, mm⁴, kg/m); de bron gebruikt ×10², ×10³, ×10⁴.

## Samenvatting

| Tabel | Rijen | Met fout (flagged) |
|---|---|---|
| IPE | 67 | 12 |
| HE | 100 | 9 |
| CHS | 62 | 0 |
| SHS | 84 | 0 |
| RHS | 79 | 21 |
| UNP | 16 | 0 |
| Platen | 10 | 10 |
| Hout | 207 | 14 |
| Betonstaal | 8 | 0 |

- 157 fouten (blokkerend: het record krijgt status `flagged` in BARCHY)
- 0 waarschuwingen (geometrie, niet blokkerend)
- 0 rijen niet geïmporteerd

Rijen met drie of meer soorten fouten, vermoedelijk verschoven kolommen: `HE 360 AA`, `HE 360 A`, `HE 360 B`, `HE 360 M`, `HE 400 AA`, `HE 400 x107`, `HE 400 A`, `HE 400 B`, `HE 400 M`.

## Vraag over herkomst en licentie

De inleiding van `staal.md` noemt de staalprofielen-app van *Bouwen met Staal* als bron. Het Vademecum staat onder CC BY 4.0.
Valt de overgenomen profieldata ook onder die licentie, of geldt voor de tabellen een andere voorwaarde of bronvermelding?

## Gecorrigeerd in BARCHY

Deze rijen zijn in BARCHY gecorrigeerd met een externe bron. De fout zit nog in het Vademecum.

| Tabel | Rij in bron | Veld | In Vademecum | Correctie | Reden | Gecontroleerd tegen |
|---|---|---|---|---|---|---|
| HE | HE 160 M | iz | 41,1 mm | 42,6 mm | √(Iz/A) met Iz = 1758 cm⁴ en A = 97,1 cm² uit de catalogus geeft 42,55 mm. De catalogus drukt iz af als 4,2 cm (afgekapt op één decimaal, zoals ook bij andere profielen); 41,1 mm uit het Vademecum past daar niet bij. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE M, p. 60–61 |
| HE | HE 1000 A | variant | A | AA | De eerste van de twee rijen 'HE 1000 A' komt overeen met HE 1000 AA in de catalogus (G 222 kg/m, h 970, b 300, tw 16, tf 21 mm, A 282,2 cm², Iy 406 450 cm⁴). De tweede rij is de echte HE 1000 A. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA en HE A, p. 54–55 |
| UNP | 150x65 | h | 150 mm | 160 mm | Alle waarden in deze rij (G 18,8 kg/m, A 24,0 cm², Iy 925 cm⁴, Wy 116 cm³, Iz 85,3 cm⁴, Wz 18,3 cm³) horen bij UPN 160; Wy = Iy/(h/2) klopt alleen met h = 160. Een UPN 150 komt in de catalogus niet voor. Alleen de maat is gecorrigeerd, niet de waarden. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, UPN, p. 100–101 |

## Fouten

| Tabel | Rij | Check | Veld | Verwacht | Gevonden | Toelichting |
|---|---|---|---|---|---|---|
| IPE | IPE 240 A | i ≈ √(I/A) | iy | 99,4 mm | 74,5 mm | iy wijkt -25.0 % af van √(Iy/A). verwachte iy staat mogelijk in kolom iz (99.4) |
| IPE | IPE 240 A | i ≈ √(I/A) | iz | 26,85 mm | 99,4 mm | iz wijkt 270.3 % af van √(Iz/A) |
| IPE | IPE 240 A | Iy > Iz, iy > iz | iz |  | 99,4 mm | iy moet groter zijn dan iz |
| IPE | IPE 240 | i ≈ √(I/A) | iy | 99,77 mm | 74,4 mm | iy wijkt -25.4 % af van √(Iy/A). verwachte iy staat mogelijk in kolom iz (99.7) |
| IPE | IPE 240 | i ≈ √(I/A) | iz | 26,95 mm | 99,7 mm | iz wijkt 269.9 % af van √(Iz/A) |
| IPE | IPE 240 | Iy > Iz, iy > iz | iz |  | 99,7 mm | iy moet groter zijn dan iz |
| IPE | IPE 240 O | i ≈ √(I/A) | iy | 99,99 mm | 82,3 mm | iy wijkt -17.7 % af van √(Iy/A). verwachte iy staat mogelijk in kolom iz (100.0) |
| IPE | IPE 240 O | i ≈ √(I/A) | iz | 27,44 mm | 100 mm | iz wijkt 264.5 % af van √(Iz/A) |
| IPE | IPE 240 O | Iy > Iz, iy > iz | iz |  | 100 mm | iy moet groter zijn dan iz |
| IPE | IPE 240 R | i ≈ √(I/A) | iy | 100,8 mm | 82,6 mm | iy wijkt -18.0 % af van √(Iy/A). verwachte iy staat mogelijk in kolom iz (101.0) |
| IPE | IPE 240 R | i ≈ √(I/A) | iz | 26,71 mm | 101 mm | iz wijkt 278.1 % af van √(Iz/A) |
| IPE | IPE 240 R | Iy > Iz, iy > iz | iz |  | 101 mm | iy moet groter zijn dan iz |
| IPE | IPE 270 A | i ≈ √(I/A) | iy | 112,1 mm | 83,2 mm | iy wijkt -25.8 % af van √(Iy/A). verwachte iy staat mogelijk in kolom iz (112.0) |
| IPE | IPE 270 A | i ≈ √(I/A) | iz | 30,26 mm | 112 mm | iz wijkt 270.1 % af van √(Iz/A) |
| IPE | IPE 270 A | Iy > Iz, iy > iz | iz |  | 112 mm | iy moet groter zijn dan iz |
| IPE | IPE 270 | i ≈ √(I/A) | iy | 112,3 mm | 83,5 mm | iy wijkt -25.7 % af van √(Iy/A). verwachte iy staat mogelijk in kolom iz (112.0) |
| IPE | IPE 270 | i ≈ √(I/A) | iz | 30,25 mm | 112 mm | iz wijkt 270.3 % af van √(Iz/A) |
| IPE | IPE 270 | Iy > Iz, iy > iz | iz |  | 112 mm | iy moet groter zijn dan iz |
| IPE | IPE 270 O | i ≈ √(I/A) | iy | 113,6 mm | 90,5 mm | iy wijkt -20.4 % af van √(Iy/A). verwachte iy staat mogelijk in kolom iz (114.0) |
| IPE | IPE 270 O | i ≈ √(I/A) | iz | 30,88 mm | 114 mm | iz wijkt 269.2 % af van √(Iz/A) |
| IPE | IPE 270 O | Iy > Iz, iy > iz | iz |  | 114 mm | iy moet groter zijn dan iz |
| IPE | IPE 270 R | i ≈ √(I/A) | iy | 114,3 mm | 91,1 mm | iy wijkt -20.3 % af van √(Iy/A). verwachte iy staat mogelijk in kolom iz (114.0) |
| IPE | IPE 270 R | i ≈ √(I/A) | iz | 30,36 mm | 114 mm | iz wijkt 275.6 % af van √(Iz/A) |
| IPE | IPE 270 R | Iy > Iz, iy > iz | iz |  | 114 mm | iy moet groter zijn dan iz |
| IPE | IPE 300 A | i ≈ √(I/A) | iy | 124,2 mm | 91,6 mm | iy wijkt -26.2 % af van √(Iy/A). verwachte iy staat mogelijk in kolom iz (124.0) |
| IPE | IPE 300 A | i ≈ √(I/A) | iz | 33,41 mm | 124 mm | iz wijkt 271.2 % af van √(Iz/A) |
| IPE | IPE 300 A | Iy > Iz, iy > iz | iz |  | 124 mm | iy moet groter zijn dan iz |
| IPE | IPE 300 | i ≈ √(I/A) | iy | 124,6 mm | 92,9 mm | iy wijkt -25.5 % af van √(Iy/A). verwachte iy staat mogelijk in kolom iz (125.0) |
| IPE | IPE 300 | i ≈ √(I/A) | iz | 33,51 mm | 125 mm | iz wijkt 273.1 % af van √(Iz/A) |
| IPE | IPE 300 | Iy > Iz, iy > iz | iz |  | 125 mm | iy moet groter zijn dan iz |
| IPE | IPE 300 O | lege cel | iy |  |  | iy ontbreekt in de bron; berekend als √(Iy/A) |
| IPE | IPE 300 O | i ≈ √(I/A) | iz | 34,47 mm | 126 mm | iz wijkt 265.6 % af van √(Iz/A) |
| IPE | IPE 300 R | lege cel | iy |  |  | iy ontbreekt in de bron; berekend als √(Iy/A) |
| IPE | IPE 300 R | i ≈ √(I/A) | iz | 33,24 mm | 126 mm | iz wijkt 279.1 % af van √(Iz/A) |
| HE | HE 360 AA | G ≈ A·ρ | G | 8.400 kg/m | 218 kg/m | G wijkt -97.4 % af van A × 7850 kg/m³ |
| HE | HE 360 AA | i ≈ √(I/A) | iy | 14,67 mm | 147 mm | iy wijkt 901.8 % af van √(Iy/A) |
| HE | HE 360 AA | i ≈ √(I/A) | iz | 7,111 mm | 71,2 mm | iz wijkt 901.3 % af van √(Iz/A) |
| HE | HE 360 AA | W ≈ I/(h/2) | Wy | 550.538 mm³ | 1.359.000 mm³ | Wy wijkt 146.8 % af van Iy/(h/2) |
| HE | HE 360 AA | W ≈ I/(h/2) | Wz | 319.174 mm³ | 361.000 mm³ | Wz wijkt 13.1 % af van Iz/(b/2) |
| HE | HE 360 A | plausibele maten | h | 175 mm | 112,1 mm | h moet groter zijn dan b/2. verwachte h staat mogelijk in kolom tf (175.0) |
| HE | HE 360 A | plausibele maten | tf |  | 175 mm | 2·tf moet kleiner zijn dan h |
| HE | HE 360 A | G ≈ A·ρ | G | 11.226 kg/m | 143 kg/m | G wijkt -98.7 % af van A × 7850 kg/m³ |
| HE | HE 360 A | i ≈ √(I/A) | iy | 15,21 mm | 152 mm | iy wijkt 899.2 % af van √(Iy/A) |
| HE | HE 360 A | i ≈ √(I/A) | iz | 7,427 mm | 74,3 mm | iz wijkt 900.5 % af van √(Iz/A) |
| HE | HE 360 A | W ≈ I/(h/2) | Wy | 5.903.657 mm³ | 1.891.000 mm³ | Wy wijkt -68.0 % af van Iy/(h/2) |
| HE | HE 360 A | W ≈ I/(h/2) | Wz | 450.686 mm³ | 526.000 mm³ | Wz wijkt 16.7 % af van Iz/(b/2) |
| HE | HE 360 B | plausibele maten | h | 180 mm | 141,8 mm | h moet groter zijn dan b/2. verwachte h staat mogelijk in kolom G (181.0) |
| HE | HE 360 B | plausibele maten | tf |  | 225 mm | 2·tf moet kleiner zijn dan h |
| HE | HE 360 B | G ≈ A·ρ | G | 14.209 kg/m | 181 kg/m | G wijkt -98.7 % af van A × 7850 kg/m³ |
| HE | HE 360 B | i ≈ √(I/A) | iy | 15,45 mm | 155 mm | iy wijkt 903.4 % af van √(Iy/A) |
| HE | HE 360 B | i ≈ √(I/A) | iz | 7,485 mm | 74,9 mm | iz wijkt 900.7 % af van √(Iz/A) |
| HE | HE 360 B | W ≈ I/(h/2) | Wy | 6.091.678 mm³ | 2.400.000 mm³ | Wy wijkt -60.6 % af van Iy/(h/2) |
| HE | HE 360 B | W ≈ I/(h/2) | Wz | 563.333 mm³ | 676.000 mm³ | Wz wijkt 20.0 % af van Iz/(b/2) |
| HE | HE 360 M | plausibele maten | tf |  | 400 mm | tf moet kleiner zijn dan b |
| HE | HE 360 M | plausibele maten | tf |  | 400 mm | 2·tf moet kleiner zijn dan h |
| HE | HE 360 M | G ≈ A·ρ | G | 25.042 kg/m | 319 kg/m | G wijkt -98.7 % af van A × 7850 kg/m³ |
| HE | HE 360 M | i ≈ √(I/A) | iy | 16,31 mm | 163 mm | iy wijkt 899.3 % af van √(Iy/A) |
| HE | HE 360 M | i ≈ √(I/A) | iz | 7,822 mm | 78,3 mm | iz wijkt 901.0 % af van √(Iz/A) |
| HE | HE 360 M | W ≈ I/(h/2) | Wy | 6.781.462 mm³ | 4.297.000 mm³ | Wy wijkt -36.6 % af van Iy/(h/2) |
| HE | HE 360 M | W ≈ I/(h/2) | Wz | 988.354 mm³ | 1.268.000 mm³ | Wz wijkt 28.3 % af van Iz/(b/2) |
| HE | HE 400 AA | plausibele maten | h | 189 mm | 92,4 mm | h moet groter zijn dan b/2 |
| HE | HE 400 AA | plausibele maten | tf |  | 130 mm | 2·tf moet kleiner zijn dan h |
| HE | HE 400 AA | G ≈ A·ρ | G | 9.970 kg/m | 118 kg/m | G wijkt -98.8 % af van A × 7850 kg/m³ |
| HE | HE 400 AA | i ≈ √(I/A) | iy | 15,69 mm | 163 mm | iy wijkt 939.1 % af van √(Iy/A) |
| HE | HE 400 AA | i ≈ √(I/A) | iz | 6,793 mm | 70,6 mm | iz wijkt 939.3 % af van √(Iz/A) |
| HE | HE 400 AA | W ≈ I/(h/2) | Wy | 6.764.069 mm³ | 1.654.000 mm³ | Wy wijkt -75.5 % af van Iy/(h/2) |
| HE | HE 400 AA | W ≈ I/(h/2) | Wz | 310.106 mm³ | 391.000 mm³ | Wz wijkt 26.1 % af van Iz/(b/2) |
| HE | HE 400 x107 | plausibele maten | h | 192 mm | 107,2 mm | h moet groter zijn dan b/2 |
| HE | HE 400 x107 | plausibele maten | tf |  | 160 mm | 2·tf moet kleiner zijn dan h |
| HE | HE 400 x107 | G ≈ A·ρ | G | 10.676 kg/m | 136 kg/m | G wijkt -98.7 % af van A × 7850 kg/m³ |
| HE | HE 400 x107 | i ≈ √(I/A) | iy | 16,64 mm | 166 mm | iy wijkt 897.8 % af van √(Iy/A) |
| HE | HE 400 x107 | i ≈ √(I/A) | iz | 7,173 mm | 71,6 mm | iz wijkt 898.1 % af van √(Iz/A) |
| HE | HE 400 x107 | W ≈ I/(h/2) | Wy | 7.022.388 mm³ | 1.960.000 mm³ | Wy wijkt -72.1 % af van Iy/(h/2). verwachte Wy staat mogelijk in kolom Iz (6998) |
| HE | HE 400 x107 | W ≈ I/(h/2) | Wz | 364.479 mm³ | 471.000 mm³ | Wz wijkt 29.2 % af van Iz/(b/2) |
| HE | HE 400 A | plausibele maten | h | 195 mm | 124,8 mm | h moet groter zijn dan b/2 |
| HE | HE 400 A | plausibele maten | tf |  | 190 mm | 2·tf moet kleiner zijn dan h |
| HE | HE 400 A | G ≈ A·ρ | G | 12.482 kg/m | 159 kg/m | G wijkt -98.7 % af van A × 7850 kg/m³ |
| HE | HE 400 A | i ≈ √(I/A) | iy | 16,84 mm | 168 mm | iy wijkt 897.8 % af van √(Iy/A) |
| HE | HE 400 A | i ≈ √(I/A) | iz | 7,339 mm | 73,4 mm | iz wijkt 900.1 % af van √(Iz/A) |
| HE | HE 400 A | W ≈ I/(h/2) | Wy | 7.222.756 mm³ | 2.311.000 mm³ | Wy wijkt -68.0 % af van Iy/(h/2) |
| HE | HE 400 A | W ≈ I/(h/2) | Wz | 439.179 mm³ | 571.000 mm³ | Wz wijkt 30.0 % af van Iz/(b/2) |
| HE | HE 400 B | plausibele maten | h | 200 mm | 155,3 mm | h moet groter zijn dan b/2 |
| HE | HE 400 B | plausibele maten | tf |  | 240 mm | 2·tf moet kleiner zijn dan h |
| HE | HE 400 B | G ≈ A·ρ | G | 17.113 kg/m | 198 kg/m | G wijkt -98.8 % af van A × 7850 kg/m³ |
| HE | HE 400 B | i ≈ √(I/A) | iy | 16,27 mm | 171 mm | iy wijkt 951.3 % af van √(Iy/A) |
| HE | HE 400 B | i ≈ √(I/A) | iz | 7,045 mm | 74 mm | iz wijkt 950.4 % af van √(Iz/A) |
| HE | HE 400 B | W ≈ I/(h/2) | Wy | 7.428.203 mm³ | 2.884.000 mm³ | Wy wijkt -61.2 % af van Iy/(h/2) |
| HE | HE 400 B | W ≈ I/(h/2) | Wz | 541.000 mm³ | 721.000 mm³ | Wz wijkt 33.3 % af van Iz/(b/2) |
| HE | HE 400 M | plausibele maten | tf |  | 400 mm | 2·tf moet kleiner zijn dan h |
| HE | HE 400 M | G ≈ A·ρ | G | 26.298 kg/m | 326 kg/m | G wijkt -98.8 % af van A × 7850 kg/m³ |
| HE | HE 400 M | i ≈ √(I/A) | iy | 17,63 mm | 179 mm | iy wijkt 915.4 % af van √(Iy/A) |
| HE | HE 400 M | i ≈ √(I/A) | iz | 7,598 mm | 77 mm | iz wijkt 913.4 % af van √(Iz/A) |
| HE | HE 400 M | W ≈ I/(h/2) | Wy | 8.142.354 mm³ | 4.820.000 mm³ | Wy wijkt -40.8 % af van Iy/(h/2) |
| HE | HE 400 M | W ≈ I/(h/2) | Wz | 895.370 mm³ | 1.260.000 mm³ | Wz wijkt 40.7 % af van Iz/(b/2) |
| RHS | 50x30 3.2 | G ≈ A·ρ | G | 3,242 kg/m | 3,61 kg/m | G wijkt 11.3 % af van A × 7850 kg/m³ |
| RHS | 50x30 3.2 | i ≈ √(I/A) | iy | 18,54 mm | 17,6 mm | iy wijkt -5.1 % af van √(Iy/A) |
| RHS | 50x30 3.2 | i ≈ √(I/A) | iz | 12,25 mm | 11,6 mm | iz wijkt -5.3 % af van √(Iz/A) |
| RHS | 60x40 3.0 | G ≈ A·ρ | G | 5,456 kg/m | 4,35 kg/m | G wijkt -20.3 % af van A × 7850 kg/m³ |
| RHS | 60x40 3.0 | i ≈ √(I/A) | iy | 19,53 mm | 21,8 mm | iy wijkt 11.6 % af van √(Iy/A) |
| RHS | 60x40 3.0 | i ≈ √(I/A) | iz | 14,14 mm | 15,8 mm | iz wijkt 11.7 % af van √(Iz/A) |
| RHS | 60x40 4.0 | G ≈ A·ρ | G | 6,688 kg/m | 5,64 kg/m | G wijkt -15.7 % af van A × 7850 kg/m³ |
| RHS | 60x40 4.0 | i ≈ √(I/A) | iy | 19,62 mm | 21,4 mm | iy wijkt 9.1 % af van √(Iy/A) |
| RHS | 60x40 4.0 | i ≈ √(I/A) | iz | 14,13 mm | 15,4 mm | iz wijkt 9.0 % af van √(Iz/A) |
| RHS | 60x40 5.0 | G ≈ A·ρ | G | 7,669 kg/m | 6,85 kg/m | G wijkt -10.7 % af van A × 7850 kg/m³ |
| RHS | 60x40 5.0 | i ≈ √(I/A) | iy | 19,75 mm | 20,9 mm | iy wijkt 5.8 % af van √(Iy/A) |
| RHS | 60x40 5.0 | i ≈ √(I/A) | iz | 14,13 mm | 15 mm | iz wijkt 6.2 % af van √(Iz/A) |
| RHS | 80x40 3.2 | G ≈ A·ρ | G | 7,426 kg/m | 5,62 kg/m | G wijkt -24.3 % af van A × 7850 kg/m³ |
| RHS | 80x40 3.2 | i ≈ √(I/A) | iy | 24,59 mm | 28,3 mm | iy wijkt 15.1 % af van √(Iy/A) |
| RHS | 80x40 3.2 | i ≈ √(I/A) | iz | 14,13 mm | 16,3 mm | iz wijkt 15.3 % af van √(Iz/A) |
| RHS | 80x40 4.0 | G ≈ A·ρ | G | 8,714 kg/m | 6,9 kg/m | G wijkt -20.8 % af van A × 7850 kg/m³ |
| RHS | 80x40 4.0 | i ≈ √(I/A) | iy | 24,79 mm | 27,9 mm | iy wijkt 12.6 % af van √(Iy/A) |
| RHS | 80x40 4.0 | i ≈ √(I/A) | iz | 14,14 mm | 15,9 mm | iz wijkt 12.4 % af van √(Iz/A) |
| RHS | 80x40 5.0 | G ≈ A·ρ | G | 10,13 kg/m | 8,42 kg/m | G wijkt -16.9 % af van A × 7850 kg/m³ |
| RHS | 80x40 5.0 | i ≈ √(I/A) | iy | 24,95 mm | 27,4 mm | iy wijkt 9.8 % af van √(Iy/A) |
| RHS | 80x40 5.0 | i ≈ √(I/A) | iz | 14,12 mm | 15,5 mm | iz wijkt 9.8 % af van √(Iz/A) |
| RHS | 80x40 6.3 | G ≈ A·ρ | G | 11,46 kg/m | 10,3 kg/m | G wijkt -10.1 % af van A × 7850 kg/m³ |
| RHS | 80x40 6.3 | i ≈ √(I/A) | iy | 25,28 mm | 26,7 mm | iy wijkt 5.6 % af van √(Iy/A) |
| RHS | 80x40 6.3 | i ≈ √(I/A) | iz | 14,14 mm | 14,9 mm | iz wijkt 5.4 % af van √(Iz/A) |
| RHS | 90x50 3.6 | G ≈ A·ρ | G | 12,17 kg/m | 7,4 kg/m | G wijkt -39.2 % af van A × 7850 kg/m³ |
| RHS | 90x50 3.6 | i ≈ √(I/A) | iy | 25,18 mm | 32,3 mm | iy wijkt 28.3 % af van √(Iy/A) |
| RHS | 90x50 3.6 | i ≈ √(I/A) | iz | 15,8 mm | 20,3 mm | iz wijkt 28.5 % af van √(Iz/A) |
| RHS | 90x50 5.0 | G ≈ A·ρ | G | 15,46 kg/m | 9,99 kg/m | G wijkt -35.4 % af van A × 7850 kg/m³ |
| RHS | 90x50 5.0 | i ≈ √(I/A) | iy | 25,39 mm | 31,6 mm | iy wijkt 24.5 % af van √(Iy/A) |
| RHS | 90x50 5.0 | i ≈ √(I/A) | iz | 15,8 mm | 19,7 mm | iz wijkt 24.7 % af van √(Iz/A) |
| RHS | 90x50 6.3 | G ≈ A·ρ | G | 17,9 kg/m | 12,3 kg/m | G wijkt -31.3 % af van A × 7850 kg/m³ |
| RHS | 90x50 6.3 | i ≈ √(I/A) | iy | 25,65 mm | 31 mm | iy wijkt 20.9 % af van √(Iy/A) |
| RHS | 90x50 6.3 | i ≈ √(I/A) | iz | 15,81 mm | 19,1 mm | iz wijkt 20.8 % af van √(Iz/A) |
| RHS | 100x50 3.0 | G ≈ A·ρ | G | 11,54 kg/m | 6,71 kg/m | G wijkt -41.9 % af van A × 7850 kg/m³ |
| RHS | 100x50 3.0 | i ≈ √(I/A) | iy | 27,36 mm | 35,8 mm | iy wijkt 30.9 % af van √(Iy/A) |
| RHS | 100x50 3.0 | i ≈ √(I/A) | iz | 15,82 mm | 20,8 mm | iz wijkt 31.5 % af van √(Iz/A) |
| RHS | 100x50 3.2 | G ≈ A·ρ | G | 12,17 kg/m | 7,13 kg/m | G wijkt -41.4 % af van A × 7850 kg/m³ |
| RHS | 100x50 3.2 | i ≈ √(I/A) | iy | 27,36 mm | 35,7 mm | iy wijkt 30.5 % af van √(Iy/A) |
| RHS | 100x50 3.2 | i ≈ √(I/A) | iz | 15,82 mm | 20,7 mm | iz wijkt 30.8 % af van √(Iz/A) |
| RHS | 100x50 5.0 | G ≈ A·ρ | G | 17,04 kg/m | 10,8 kg/m | G wijkt -36.6 % af van A × 7850 kg/m³ |
| RHS | 100x50 5.0 | i ≈ √(I/A) | iy | 27,74 mm | 34,8 mm | iy wijkt 25.4 % af van √(Iy/A) |
| RHS | 100x50 5.0 | i ≈ √(I/A) | iz | 15,82 mm | 19,9 mm | iz wijkt 25.8 % af van √(Iz/A) |
| RHS | 100x50 6.3 | G ≈ A·ρ | G | 19,78 kg/m | 13,3 kg/m | G wijkt -32.8 % af van A × 7850 kg/m³ |
| RHS | 100x50 6.3 | i ≈ √(I/A) | iy | 27,96 mm | 34,2 mm | iy wijkt 22.3 % af van √(Iy/A) |
| RHS | 100x50 6.3 | i ≈ √(I/A) | iz | 15,81 mm | 19,3 mm | iz wijkt 22.1 % af van √(Iz/A) |
| RHS | 100x50 8.0 | G ≈ A·ρ | G | 24,65 kg/m | 16,3 kg/m | G wijkt -33.9 % af van A × 7850 kg/m³ |
| RHS | 100x50 8.0 | i ≈ √(I/A) | iy | 27,06 mm | 33,3 mm | iy wijkt 23.0 % af van √(Iy/A) |
| RHS | 100x50 8.0 | i ≈ √(I/A) | iz | 15,11 mm | 18,6 mm | iz wijkt 23.1 % af van √(Iz/A) |
| RHS | 100x50 10.0 | G ≈ A·ρ | G | 29,67 kg/m | 19,6 kg/m | G wijkt -33.9 % af van A × 7850 kg/m³ |
| RHS | 100x50 10.0 | i ≈ √(I/A) | iy | 26,18 mm | 32,2 mm | iy wijkt 23.0 % af van √(Iy/A) |
| RHS | 100x50 10.0 | i ≈ √(I/A) | iz | 14,4 mm | 17,7 mm | iz wijkt 22.9 % af van √(Iz/A) |
| RHS | 100x60 3.6 | G ≈ A·ρ | G | 16,96 kg/m | 8,53 kg/m | G wijkt -49.7 % af van A × 7850 kg/m³ |
| RHS | 100x60 3.6 | i ≈ √(I/A) | iy | 25,91 mm | 36,5 mm | iy wijkt 40.9 % af van √(Iy/A) |
| RHS | 100x60 3.6 | i ≈ √(I/A) | iz | 17,32 mm | 24,4 mm | iz wijkt 40.9 % af van √(Iz/A) |
| RHS | 100x60 5.0 | G ≈ A·ρ | G | 21,9 kg/m | 11,6 kg/m | G wijkt -47.0 % af van A × 7850 kg/m³ |
| RHS | 100x60 5.0 | i ≈ √(I/A) | iy | 26,03 mm | 35,8 mm | iy wijkt 37.5 % af van √(Iy/A) |
| RHS | 100x60 5.0 | i ≈ √(I/A) | iz | 17,31 mm | 23,8 mm | iz wijkt 37.5 % af van √(Iz/A) |
| RHS | 100x60 6.3 | G ≈ A·ρ | G | 25,67 kg/m | 14,2 kg/m | G wijkt -44.7 % af van A × 7850 kg/m³ |
| RHS | 100x60 6.3 | i ≈ √(I/A) | iy | 26,23 mm | 35,2 mm | iy wijkt 34.2 % af van √(Iy/A) |
| RHS | 100x60 6.3 | i ≈ √(I/A) | iz | 17,32 mm | 23,3 mm | iz wijkt 34.5 % af van √(Iz/A) |
| RHS | 100x60 8.0 | G ≈ A·ρ | G | 29,67 kg/m | 17,5 kg/m | G wijkt -41.0 % af van A × 7850 kg/m³ |
| RHS | 100x60 8.0 | i ≈ √(I/A) | iy | 26,43 mm | 34,4 mm | iy wijkt 30.2 % af van √(Iy/A) |
| RHS | 100x60 8.0 | i ≈ √(I/A) | iz | 17,29 mm | 22,5 mm | iz wijkt 30.1 % af van √(Iz/A) |

## Waarschuwingen

<details><summary>0 waarschuwingen: tabelwaarde wijkt af van de geïdealiseerde geometrie</summary>

Geen.

</details>

## Niet geïmporteerd

Geen.

## Geprofileerde staalplaten

De kolomkop geeft I<sub>y</sub> in [mm⁴] en W<sub>y;el</sub> als "·10⁴ [mm⁴]". Een weerstandsmoment heeft eenheid mm³, en de getallen (bijv. h = 40, t = 0,88: I = 30, W = 9,1) passen bij I ×10⁴ mm⁴/m en W ×10³ mm³/m. Graag bevestigen. De kolom σ [N/mm²] wordt niet toegelicht: welke spanning is dit?

## Hout (dimensietabellen)

Voor een rechthoek volgen A = b·h, W = b·h²/6 en I = b·h³/12 exact; BARCHY rekent ze zelf uit en gebruikt de tabel alleen voor de lijst met maten.
Van de 612 gevulde cellen passen er 504 bij hun eigen kolom (op een macht van tien na). Opvallend:

- De kolomkoppen zeggen A [mm²], W [mm³], I [mm⁴], maar de getallen zijn geschaald (×10², ×10³, ×10⁶), zonder dat dat erbij staat.
- In de gezaagde tabellen lijken per breedte vijf waarden te staan (A, W<sub>y</sub>, I<sub>y</sub>, W<sub>z</sub>, I<sub>z</sub>) onder een kop met drie kolommen, waardoor alles na de eerste breedte verschuift.
- Een deel van de waarden hoort bij b + 1 mm (bijv. 70 in plaats van 69): mogelijk berekend met de ongeschaafde maat.

14 maten krijgen status `flagged` omdat geen enkele cel in hun rij bij die maat hoort: 58×69, 58×120, 58×133, 58×170, 58×195, 58×220, 95×95, 95×120, 95×170, 95×270, 120×195, 120×220, 120×245, 120×270.

<details><summary>108 cellen die niet bij hun kolom passen</summary>

| Tabel | Kolom (b×h) | Veld | Tabel­waarde | Herkend als |
|---|---|---|---|---|
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 33×69 | A | 2,20 | past bij geen maat in deze rij |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 45×69 | A | 12,5 | past bij Wz van 33×69 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 45×69 | Wy | 0,21 | past bij geen maat in deze rij |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 45×69 | Iy | 3,10 | past bij A van 45×69 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 58×69 | A | 35,7 | past bij Wy van 45×69 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 58×69 | Wy | 1,23 | past bij Iy van 45×69 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 58×69 | Iy | 23,2 | past bij Wz van 45×69 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 33×95 | A | 3,10 | past bij Iz van 34×95 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 45×95 | A | 17,2 | past bij Wz van 33×95 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 45×95 | Wy | 0,28 | past bij geen maat in deze rij |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 45×95 | Iy | 4,20 | past bij Iy van 59×95 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 58×95 | A | 67,6 | past bij Wy van 45×95 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 58×95 | Wy | 3,21 | past bij Iy van 45×95 of Wz van 45×95 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 58×95 | Iy | 32,0 | past bij Iy van 45×95 of Wz van 45×95 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 33×120 | A | 3,90 | past bij Iz van 34×120 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 45×120 | A | 21,7 | past bij Wz van 33×120 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 45×120 | Wy | 0,36 | past bij Iz van 33×120 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 45×120 | Iy | 5,40 | past bij A van 45×120 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 58×120 | A | 108,0 | past bij Wy van 45×120 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 58×120 | Wy | 6,48 | past bij Iy van 45×120 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 58×120 | Iy | 40,5 | past bij Wz van 45×120 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 33×133 | A | 4,30 | past bij geen maat in deze rij |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 45×133 | A | 24,1 | past bij Wz van 33×133 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 45×133 | Wy | 0,40 | past bij Iz van 33×133 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 45×133 | Iy | 5,90 | past bij geen maat in deze rij |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 58×133 | A | 132,6 | past bij Wy van 45×133 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 58×133 | Wy | 8,82 | past bij Iy van 45×133 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 58×133 | Iy | 44,8 | past bij Wz van 45×133 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 33×145 | A | 4,70 | past bij geen maat in deze rij |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 45×145 | A | 26,3 | past bij Wz van 33×145 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 45×145 | Wy | 0,43 | past bij Iz van 33×145 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 45×145 | Iy | 6,50 | past bij A van 45×145 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 58×145 | A | 157,6 | past bij Wy van 45×145 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 58×145 | Wy | 11,43 | past bij Iy van 45×145 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 58×145 | Iy | 48,9 | past bij Wz van 45×145 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 45×170 | A | 30,8 | past bij Wz van 33×170 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 45×170 | Wy | 0,51 | past bij Iz van 33×170 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 45×170 | Iy | 7,60 | past bij A van 45×170 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 58×170 | A | 216,7 | past bij Wy van 45×170 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 58×170 | Wy | 18,42 | past bij Iy van 45×170 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 58×170 | Iy | 57,3 | past bij Wz van 45×170 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 45×195 | A | 35,3 | past bij Wz van 33×195 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 45×195 | Wy | 0,58 | past bij Iz van 33×195 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 45×195 | Iy | 8,70 | past bij A van 45×195 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 58×195 | A | 285,1 | past bij Wy van 45×195 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 58×195 | Wy | 27,80 | past bij Iy van 45×195 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 58×195 | Iy | 65,8 | past bij Wz van 45×195 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 45×220 | A | 39,9 | past bij Wz van 33×220 of Iy van 45×220 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 45×220 | Wy | 0,66 | past bij Iz van 33×220 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 45×220 | Iy | 9,90 | past bij A van 45×220 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 58×220 | A | 363,0 | past bij Wy van 45×220 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 58×220 | Wy | 39,93 | past bij Wz van 33×220 of Iy van 45×220 |
| Gezaagd, tabel 1 (b = 33, 45, 58 mm) | 58×220 | Iy | 74,2 | past bij Wz van 45×220 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 69×95 | Wy | 105,2 | past bij Wy van 70×95 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 69×95 | Iy | 5,00 | past bij Iy van 70×95 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 95×95 | A | 77,5 | past bij Wz van 70×95 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 95×95 | Wy | 2,72 | past bij Iz van 70×95 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 69×120 | A | 8,40 | past bij A van 70×120 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 69×120 | Wy | 168,0 | past bij Wy van 70×120 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 69×120 | Iy | 10,08 | past bij Iy van 70×120 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 95×120 | A | 98,0 | past bij Wz van 70×120 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 95×120 | Wy | 3,43 | past bij Iz van 70×120 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 69×133 | A | 9,30 | past bij A van 70×133 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 69×133 | Wy | 206,3 | past bij Wy van 70×133 of Wz van 96×133 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 69×133 | Iy | 13,72 | past bij Iy van 70×133 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 95×133 | A | 108,6 | past bij Wz van 70×133 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 95×133 | Wy | 3,80 | past bij Iz van 70×133 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 69×145 | Wy | 245,2 | past bij Wy van 70×145 of Iy van 96×145 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 69×145 | Iy | 17,78 | past bij Iy van 70×145 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 95×145 | A | 118,4 | past bij Wz van 70×145 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 95×145 | Wy | 4,14 | past bij Iz van 70×145 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 69×170 | A | 11,90 | past bij A van 70×170 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 69×170 | Wy | 337,1 | past bij Wy van 70×170 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 69×170 | Iy | 28,65 | past bij Iy van 70×170 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 95×170 | A | 138,8 | past bij Wz van 70×170 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 95×170 | Wy | 4,86 | past bij Iz van 70×170 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 69×195 | A | 13,60 | past bij A van 70×195 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 69×195 | Wy | 443,6 | past bij Wy van 70×195 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 69×195 | Iy | 43,25 | past bij Iy van 70×195 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 95×195 | A | 159,2 | past bij Wz van 70×195 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 95×195 | Wy | 5,57 | past bij Iz van 70×195 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 95×195 | Iy | 18,50 | past bij A van 95×195 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 120×195 | A | 602,0 | past bij Wy van 95×195 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 120×195 | Wy | 58,70 | past bij Iy van 95×195 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 69×220 | A | 15,40 | past bij A van 70×220 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 69×220 | Wy | 564,6 | past bij Wy van 70×220 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 69×220 | Iy | 62,11 | past bij Iy van 70×220 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 95×220 | A | 179,6 | past bij Wz van 70×220 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 95×220 | Wy | 6,29 | past bij Iz van 70×220 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 95×220 | Iy | 20,90 | past bij A van 95×220 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 120×220 | A | 766,3 | past bij Wy van 95×220 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 120×220 | Wy | 84,29 | past bij Iy van 95×220 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 69×245 | A | 17,10 | past bij A van 70×245 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 69×245 | Wy | 700,2 | past bij Wy van 70×245 of Iz van 70×245 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 69×245 | Iy | 85,78 | past bij Iy van 70×245 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 95×245 | A | 200,0 | past bij Wz van 70×245 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 95×245 | Wy | 7,06 | past bij Wy van 70×245 of Iz van 70×245 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 95×245 | Iy | 23,30 | past bij A van 95×245 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 120×245 | A | 889,8 | past bij geen maat in deze rij |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 120×245 | Wy | 106,0 | past bij geen maat in deze rij |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 69×270 | A | 18,90 | past bij A van 70×270 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 95×270 | A | 220,2 | past bij Wz van 70×270 |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 95×270 | Wy | 7,84 | past bij geen maat in deze rij |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 95×270 | Iy | 26,50 | past bij geen maat in deze rij |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 120×270 | A | 1.020,0 | past bij geen maat in deze rij |
| Gezaagd, tabel 2 (b = 69, 95, 120 mm) | 120×270 | Wy | 130,2 | past bij geen maat in deze rij |
| Gelamineerd, tabel 3 (b = 55, 85, 110 mm) | 55×200 | Wy | 0,36 | past bij geen maat in deze rij |
| Gelamineerd, tabel 3 (b = 55, 85, 110 mm) | 85×200 | Wy | 0,56 | past bij geen maat in deze rij |

</details>

## Methode

| Check | Regel | Tolerantie | Ernst |
|---|---|---|---|
| G ≈ A·ρ | G = A · 7850 kg/m³ | ±3 % | fout |
| i ≈ √(I/A) | per as | ±3 % | fout |
| W ≈ I/(h/2) | symmetrische assen (UNP alleen y) | ±3 % | fout |
| Iy > Iz | I-, U- en rechthoekige profielen | – | fout |
| plausibele maten | I: tw < tf ≤ b, h > b/2; buis/koker: 2t < maat | – | fout |
| dubbele naam | reeks + maat komt één keer voor | – | fout |
| lege cel | ontbrekende waarde, berekend waar mogelijk | – | fout |
| geometrie I | A, Iy, Wy uit h, b, tw, tf zonder afrondingen | -2 % … +10 % | waarschuwing |
| geometrie CHS | exact uit D, t | ±2 % | waarschuwing |
| geometrie SHS/RHS | A, Iy, Wy met hoekstralen 1.5t / 1t (aanname) | ±3 % | waarschuwing |

De kolom "Toelichting" noemt waar een verwachte waarde in dezelfde rij wél voorkomt (op een andere schaal). Dat is een hint, geen correctie.
