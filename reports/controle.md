# Controle-overzicht

Gegenereerd met `npm run report:status`. Niet met de hand bewerken.

- **flagged**: staat in de app op "Controleren"; nog na te lopen
- **auto_checked**: haalt de automatische samenhangcontroles
- **human_verified**: door een persoon gecontroleerd

| Bestand | flagged | auto_checked | human_verified |
| --- | ---: | ---: | ---: |
| `content/concrete/rebar.json` | 0 | 8 | 0 |
| `content/drawing/conventions.json` | 0 | 18 | 10 |
| `content/facts/bbl.json` | 0 | 0 | 56 |
| `content/facts/concrete.json` | 0 | 0 | 44 |
| `content/facts/masonry.json` | 0 | 0 | 40 |
| `content/facts/steel.json` | 0 | 0 | 30 |
| `content/facts/timber.json` | 0 | 0 | 67 |
| `content/steel/chs.json` | 0 | 62 | 0 |
| `content/steel/he.json` | 1 | 99 | 0 |
| `content/steel/ipe.json` | 3 | 64 | 0 |
| `content/steel/rhs.json` | 0 | 79 | 0 |
| `content/steel/sheets.json` | 0 | 0 | 10 |
| `content/steel/shs.json` | 0 | 84 | 0 |
| `content/steel/unp.json` | 0 | 16 | 0 |
| `content/timber/sections.json` | 0 | 207 | 0 |
| **Totaal** | **4** | **637** | **257** |

## Nog te controleren

### `content/steel/he.json` (1)

- [ ] he-400-x107 · HE 400 x 107: h moet groter zijn dan b/2; 2·tf moet kleiner zijn dan h; G wijkt -98.7 % af van A × 7850 kg/m³; iy wijkt 897.8 % af van √(Iy/A); iz wijkt 898.1 % af van √(Iz/A); Wy wijkt -72.1 % af van Iy/(h/2); Wz wijkt 29.2 % af van Iz/(b/2)

### `content/steel/ipe.json` (3)

- [ ] ipe-240-r · IPE R 240: iy wijkt -18.0 % af van √(Iy/A); iz wijkt 278.1 % af van √(Iz/A); iy moet groter zijn dan iz
- [ ] ipe-270-r · IPE R 270: iy wijkt -20.3 % af van √(Iy/A); iz wijkt 275.6 % af van √(Iz/A); iy moet groter zijn dan iz
- [ ] ipe-300-r · IPE R 300: iy ontbreekt in de bron; berekend als √(Iy/A); iz wijkt 279.1 % af van √(Iz/A)
