# Controleronde staalprofielen en tekenconventies (24-10-2026)

Bronnen: Vademecum (commit `9a2f70a`), ArcelorMittal Sales programme 2024-1 (IPE p. 50–51, HE p. 56–57), de afbeeldingen uit het Vademecum.
Niets hiervan is menselijk geverifieerd (`human_verified`); gecorrigeerde en gecontroleerde records staan op `auto_checked`.

## Staal

| Wat | Rijen | Wat klopte niet | Verbetering | Bron | Resultaat |
|---|---|---|---|---|---|
| HE 360 en HE 400 (AA, A, B, M) | 8 | De bron mist de kolom b; G, h, b, tw en tf staan één plaats verschoven (tw en tf ×10). HE 360 AA wijkt daar nog extra vanaf (G als 837, losse cel 218) | G, h, b, tw, tf en A hersteld | ArcelorMittal p. 56–57 | Alle checks halen |
| HE 400 x107 | 1 | Zelfde verschuiving, b ontbreekt | Niet gecorrigeerd | Staat niet in de catalogus | Blijft Controleren |
| IPE 240, 270, 300 (A, standaard, O) | 9 | iy en iz verschoven: onder iy staat Wpl,z, onder iz staat iy; iz ontbreekt | iy = waarde uit de iz-kolom, iz = √(Iz/A) | ArcelorMittal p. 51 (iy en iz in cm, afgekapt) | Alle checks halen |
| IPE 240 R, 270 R, 300 R | 3 | Zelfde verschuiving | Niet gecorrigeerd | IPE R staat niet in de catalogus | Blijft Controleren |
| RHS 50x30 t/m 100x60 | 21 | A in de bron herhaalt Wz (of een andere kolom) en past niet bij G, iy en iz | A = G/ρ, op 3 significante cijfers | Dezelfde rij: G, iy en iz geven onafhankelijk dezelfde A (afwijking < 2 %) | Alle checks halen |
| Overig staal, hout, beton, UNP, CHS, SHS | – | Geen bevindingen | – | – | Ongewijzigd |

## Tekenen

| Wat | Klopt met de bron? | Verbetering |
|---|---|---|
| Schalen van alle 21 arceringen | Ja, alle 21 komen overeen met de tabel | – |
| Namen en opmerkingen (lood, zink, maaiveld, water, lijmverbinding, staal) | Ja | – |
| Opmerking Steenachtig | Nee: de app schreef "brandwerend", de bron "brand bestendig" | Gewijzigd naar "brandbestendig" |
| Axo, verbindingslijnen (en) | "corners" was een eigen invulling van "uiterste punten" | Gewijzigd naar "outermost points" |
| Lijnsoorten, dikten en kleuren in de plattegrond, axo en detail | Ja, alle dikten en lijnsoorten komen overeen met de tekst | – |
| Beton en beton prefab: volgorde van de schalen | Bron is zo, de volgorde lijkt omgekeerd (detail bij 1:100, grijs vlak bij 1:1). Niet te toetsen: NEN 2302 is niet vrij beschikbaar | Open, blijft Controleren |
| Hout = Metselwerk overige, Hardhout = Steenachtig | Bevestigd: de afbeeldingen zijn identiek op de verschuiving na | Open, blijft Controleren |
| Hartlijn bij details | Bevestigd: de afbeelding is een gewone streeplijn, de tekst zegt gemengde streeplijn (dezelfde afbeelding wordt ook bij "niet zichtbaar" gebruikt) | Open, de app volgt de tekst |
| Schoor | Bevestigd: rode streeplijn, geen dikte in de tekst | Open, de app volgt de afbeelding |

Daarna (24-10-2026): de 10 tekenonderdelen die op Controleren stonden zijn door OVADI op `human_verified` gezet. Alleen HE 400 x107 en IPE 240 R, 270 R, 300 R blijven op Controleren en worden voorlopig niet gebruikt.

Status na de ronde: 18 tekenonderdelen op `auto_checked` (4 lijnsoorten, 13 arceringen, de axo-handleiding), 10 blijven op Controleren (8 arceringen, plattegrond en detail).
