# Vademecum: bevindingen in de dimensietabellen

Gegenereerd door `scripts/import-vademecum.ts` (BARCHY). Bron: [TeachBooks/vademecum](https://github.com/TeachBooks/vademecum) op commit `9a2f70afd158b7cee533c119bf4c88ae15106d4a`.
Alle waarden hieronder in basiseenheden (mm, mm², mm³, mm⁴, kg/m); de bron gebruikt ×10², ×10³, ×10⁴.

## Samenvatting

| Tabel | Rijen | Met fout (flagged) |
|---|---|---|
| IPE | 67 | 3 |
| HE | 100 | 1 |
| CHS | 62 | 0 |
| SHS | 84 | 0 |
| RHS | 79 | 0 |
| UNP | 16 | 0 |
| Platen | 10 | 0 |
| Hout | 207 | 0 |
| Betonstaal | 8 | 0 |

- 15 fouten (blokkerend: het record krijgt status `flagged` in BARCHY)
- 0 waarschuwingen (geometrie, niet blokkerend)
- 0 rijen niet geïmporteerd

Rijen met drie of meer soorten fouten, vermoedelijk verschoven kolommen: `HE 400 x107`.

## Vraag over herkomst en licentie

De inleiding van `staal.md` noemt de staalprofielen-app van *Bouwen met Staal* als bron. Het Vademecum staat onder CC BY 4.0.
Valt de overgenomen profieldata ook onder die licentie, of geldt voor de tabellen een andere voorwaarde of bronvermelding?

## Gecorrigeerd in BARCHY

Deze rijen zijn in BARCHY gecorrigeerd met een externe bron. De fout zit nog in het Vademecum.

| Tabel | Rij in bron | Veld | In Vademecum | Correctie | Reden | Gecontroleerd tegen |
|---|---|---|---|---|---|---|
| IPE | IPE 240 A | iy | 74,5 mm | 99,4 mm | In de bron staan iy en iz verschoven: onder iy staat Wpl,z (74.5) en onder iz staat iy; iz zelf ontbreekt. iy = 99.4 mm (bron onder iz); catalogus 9.9 cm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, IPE, IPE A en IPE O, eigenschappen p. 51 |
| IPE | IPE 240 A | iz | 99,4 mm | 26,8 mm | In de bron staan iy en iz verschoven: onder iy staat Wpl,z (74.5) en onder iz staat iy; iz zelf ontbreekt. iz = √(Iz/A) = 26.8 mm uit Iz en A uit de bron; de catalogus geeft 2.6 cm (afgekapt op één decimaal). | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, IPE, IPE A en IPE O, eigenschappen p. 51 |
| IPE | IPE 240 | iy | 74,4 mm | 99,7 mm | In de bron staan iy en iz verschoven: onder iy staat Wpl,z (74.4) en onder iz staat iy; iz zelf ontbreekt. iy = 99.7 mm (bron onder iz); catalogus 9.9 cm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, IPE, IPE A en IPE O, eigenschappen p. 51 |
| IPE | IPE 240 | iz | 99,7 mm | 27 mm | In de bron staan iy en iz verschoven: onder iy staat Wpl,z (74.4) en onder iz staat iy; iz zelf ontbreekt. iz = √(Iz/A) = 27.0 mm uit Iz en A uit de bron; de catalogus geeft 2.6 cm (afgekapt op één decimaal). | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, IPE, IPE A en IPE O, eigenschappen p. 51 |
| IPE | IPE 240 O | iy | 82,3 mm | 100 mm | In de bron staan iy en iz verschoven: onder iy staat Wpl,z (82.3) en onder iz staat iy; iz zelf ontbreekt. iy = 100 mm (bron onder iz); catalogus 9.9 cm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, IPE, IPE A en IPE O, eigenschappen p. 51 |
| IPE | IPE 240 O | iz | 100 mm | 27,4 mm | In de bron staan iy en iz verschoven: onder iy staat Wpl,z (82.3) en onder iz staat iy; iz zelf ontbreekt. iz = √(Iz/A) = 27.4 mm uit Iz en A uit de bron; de catalogus geeft 2.7 cm (afgekapt op één decimaal). | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, IPE, IPE A en IPE O, eigenschappen p. 51 |
| IPE | IPE 270 A | iy | 83,2 mm | 112 mm | In de bron staan iy en iz verschoven: onder iy staat Wpl,z (83.2) en onder iz staat iy; iz zelf ontbreekt. iy = 112 mm (bron onder iz); catalogus 11.2 cm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, IPE, IPE A en IPE O, eigenschappen p. 51 |
| IPE | IPE 270 A | iz | 112 mm | 30,3 mm | In de bron staan iy en iz verschoven: onder iy staat Wpl,z (83.2) en onder iz staat iy; iz zelf ontbreekt. iz = √(Iz/A) = 30.3 mm uit Iz en A uit de bron; de catalogus geeft 3.0 cm (afgekapt op één decimaal). | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, IPE, IPE A en IPE O, eigenschappen p. 51 |
| IPE | IPE 270 | iy | 83,5 mm | 112 mm | In de bron staan iy en iz verschoven: onder iy staat Wpl,z (83.5) en onder iz staat iy; iz zelf ontbreekt. iy = 112 mm (bron onder iz); catalogus 11.2 cm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, IPE, IPE A en IPE O, eigenschappen p. 51 |
| IPE | IPE 270 | iz | 112 mm | 30,2 mm | In de bron staan iy en iz verschoven: onder iy staat Wpl,z (83.5) en onder iz staat iy; iz zelf ontbreekt. iz = √(Iz/A) = 30.2 mm uit Iz en A uit de bron; de catalogus geeft 3.0 cm (afgekapt op één decimaal). | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, IPE, IPE A en IPE O, eigenschappen p. 51 |
| IPE | IPE 270 O | iy | 90,5 mm | 114 mm | In de bron staan iy en iz verschoven: onder iy staat Wpl,z (90.5) en onder iz staat iy; iz zelf ontbreekt. iy = 114 mm (bron onder iz); catalogus 11.3 cm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, IPE, IPE A en IPE O, eigenschappen p. 51 |
| IPE | IPE 270 O | iz | 114 mm | 30,9 mm | In de bron staan iy en iz verschoven: onder iy staat Wpl,z (90.5) en onder iz staat iy; iz zelf ontbreekt. iz = √(Iz/A) = 30.9 mm uit Iz en A uit de bron; de catalogus geeft 3.0 cm (afgekapt op één decimaal). | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, IPE, IPE A en IPE O, eigenschappen p. 51 |
| IPE | IPE 300 A | iy | 91,6 mm | 124 mm | In de bron staan iy en iz verschoven: onder iy staat Wpl,z (91.6) en onder iz staat iy; iz zelf ontbreekt. iy = 124 mm (bron onder iz); catalogus 12.4 cm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, IPE, IPE A en IPE O, eigenschappen p. 51 |
| IPE | IPE 300 A | iz | 124 mm | 33,4 mm | In de bron staan iy en iz verschoven: onder iy staat Wpl,z (91.6) en onder iz staat iy; iz zelf ontbreekt. iz = √(Iz/A) = 33.4 mm uit Iz en A uit de bron; de catalogus geeft 3.3 cm (afgekapt op één decimaal). | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, IPE, IPE A en IPE O, eigenschappen p. 51 |
| IPE | IPE 300 | iy | 92,9 mm | 125 mm | In de bron staan iy en iz verschoven: onder iy staat Wpl,z (92.9) en onder iz staat iy; iz zelf ontbreekt. iy = 125 mm (bron onder iz); catalogus 12.4 cm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, IPE, IPE A en IPE O, eigenschappen p. 51 |
| IPE | IPE 300 | iz | 125 mm | 33,5 mm | In de bron staan iy en iz verschoven: onder iy staat Wpl,z (92.9) en onder iz staat iy; iz zelf ontbreekt. iz = √(Iz/A) = 33.5 mm uit Iz en A uit de bron; de catalogus geeft 3.3 cm (afgekapt op één decimaal). | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, IPE, IPE A en IPE O, eigenschappen p. 51 |
| IPE | IPE 300 O | iy |  | 126 mm | In de bron staan iy en iz verschoven: onder iy staat Wpl,z (126.151) en onder iz staat iy; iz zelf ontbreekt. iy = 126 mm (bron onder iz); catalogus 12.6 cm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, IPE, IPE A en IPE O, eigenschappen p. 51 |
| IPE | IPE 300 O | iz | 126 mm | 34,5 mm | In de bron staan iy en iz verschoven: onder iy staat Wpl,z (126.151) en onder iz staat iy; iz zelf ontbreekt. iz = √(Iz/A) = 34.5 mm uit Iz en A uit de bron; de catalogus geeft 3.4 cm (afgekapt op één decimaal). | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, IPE, IPE A en IPE O, eigenschappen p. 51 |
| HE | HE 160 M | iz | 41,1 mm | 42,6 mm | √(Iz/A) met Iz = 1758 cm⁴ en A = 97,1 cm² uit de catalogus geeft 42,55 mm. De catalogus drukt iz af als 4,2 cm (afgekapt op één decimaal, zoals ook bij andere profielen); 41,1 mm uit het Vademecum past daar niet bij. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE M, p. 60–61 |
| HE | HE 1000 A | variant | A | AA | De eerste van de twee rijen 'HE 1000 A' komt overeen met HE 1000 AA in de catalogus (G 222 kg/m, h 970, b 300, tw 16, tf 21 mm, A 282,2 cm², Iy 406 450 cm⁴). De tweede rij is de echte HE 1000 A. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA en HE A, p. 54–55 |
| HE | HE 360 AA | G | 218 kg/m | 83,7 kg/m | Deze bronrij wijkt af: de eerste cel (218) komt niet in de catalogus voor, G staat als 837 (×10), b ontbreekt, en h, tw en tf staan één plaats te laag. G = 83,7 kg/m (bron: 837); catalogus komt overeen. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 360 AA | h | 837 mm | 339 mm | Deze bronrij wijkt af: de eerste cel (218) komt niet in de catalogus voor, G staat als 837 (×10), b ontbreekt, en h, tw en tf staan één plaats te laag. h = 339 mm (bron onder b); catalogus komt overeen. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 360 AA | b | 339 mm | 300 mm | Deze bronrij wijkt af: de eerste cel (218) komt niet in de catalogus voor, G staat als 837 (×10), b ontbreekt, en h, tw en tf staan één plaats te laag. b = 300 mm (ontbreekt in de bron); catalogus komt overeen. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 360 AA | tw | 90 mm | 9 mm | Deze bronrij wijkt af: de eerste cel (218) komt niet in de catalogus voor, G staat als 837 (×10), b ontbreekt, en h, tw en tf staan één plaats te laag. tw = 9 mm (bron: 90); catalogus komt overeen. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 360 AA | tf | 120 mm | 12 mm | Deze bronrij wijkt af: de eerste cel (218) komt niet in de catalogus voor, G staat als 837 (×10), b ontbreekt, en h, tw en tf staan één plaats te laag. tf = 12 mm (bron: 120); catalogus komt overeen. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 360 AA | A | 1.070.000 mm² | 10.660 mm² | Deze bronrij wijkt af: de eerste cel (218) komt niet in de catalogus voor, G staat als 837 (×10), b ontbreekt, en h, tw en tf staan één plaats te laag. A = 106,6 cm² (bron: 107 cm², afgerond); catalogus komt overeen. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 360 A | G | 143 kg/m | 112,1 kg/m | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; G = 112.1 kg/m staat in de bron onder h; catalogus 112 kg/m (afgerond). | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 360 A | h | 112,1 mm | 350 mm | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; h = 350 mm staat in de bron onder b; catalogus 350 mm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 360 A | b | 350 mm | 300 mm | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; b = 300 mm ontbreekt in de bron; catalogus 300 mm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 360 A | tw | 100 mm | 10 mm | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; tw = 10 mm staat in de bron als 100; catalogus 10 mm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 360 A | tf | 175 mm | 17,5 mm | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; tf = 17.5 mm staat in de bron als 175; catalogus 17.5 mm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 360 A | A | 1.430.000 mm² | 14.280 mm² | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; A = 142.8 cm² staat in de bron onder G; catalogus 142.8 cm². | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 360 B | G | 181 kg/m | 141,8 kg/m | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; G = 141.8 kg/m staat in de bron onder h; catalogus 142 kg/m (afgerond). | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 360 B | h | 141,8 mm | 360 mm | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; h = 360 mm staat in de bron onder b; catalogus 360 mm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 360 B | b | 360 mm | 300 mm | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; b = 300 mm ontbreekt in de bron; catalogus 300 mm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 360 B | tw | 125 mm | 12,5 mm | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; tw = 12.5 mm staat in de bron als 125; catalogus 12.5 mm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 360 B | tf | 225 mm | 22,5 mm | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; tf = 22.5 mm staat in de bron als 225; catalogus 22.5 mm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 360 B | A | 1.810.000 mm² | 18.060 mm² | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; A = 180.6 cm² staat in de bron onder G; catalogus 180.6 cm². | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 360 M | G | 319 kg/m | 250,3 kg/m | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; G = 250.3 kg/m staat in de bron onder h; catalogus 250 kg/m (afgerond). | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 360 M | h | 250,3 mm | 395 mm | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; h = 395 mm staat in de bron onder b; catalogus 395 mm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 360 M | b | 395 mm | 308 mm | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; b = 308 mm ontbreekt in de bron; catalogus 308 mm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 360 M | tw | 210 mm | 21 mm | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; tw = 21 mm staat in de bron als 210; catalogus 21 mm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 360 M | tf | 400 mm | 40 mm | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; tf = 40 mm staat in de bron als 400; catalogus 40 mm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 360 M | A | 3.190.000 mm² | 31.880 mm² | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; A = 318.8 cm² staat in de bron onder G; catalogus 318.8 cm². | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 400 AA | G | 118 kg/m | 92,4 kg/m | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; G = 92.4 kg/m staat in de bron onder h; catalogus 92.4 kg/m (afgerond). | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 400 AA | h | 92,4 mm | 378 mm | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; h = 378 mm staat in de bron onder b; catalogus 378 mm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 400 AA | b | 378 mm | 300 mm | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; b = 300 mm ontbreekt in de bron; catalogus 300 mm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 400 AA | tw | 95 mm | 9,5 mm | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; tw = 9.5 mm staat in de bron als 95; catalogus 9.5 mm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 400 AA | tf | 130 mm | 13 mm | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; tf = 13 mm staat in de bron als 130; catalogus 13 mm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 400 AA | A | 1.270.000 mm² | 11.770 mm² | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; A = 117.7 cm² staat in de bron onder G; catalogus 117.7 cm². | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 400 A | G | 159 kg/m | 124,8 kg/m | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; G = 124.8 kg/m staat in de bron onder h; catalogus 125 kg/m (afgerond). | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 400 A | h | 124,8 mm | 390 mm | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; h = 390 mm staat in de bron onder b; catalogus 390 mm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 400 A | b | 390 mm | 300 mm | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; b = 300 mm ontbreekt in de bron; catalogus 300 mm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 400 A | tw | 110 mm | 11 mm | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; tw = 11 mm staat in de bron als 110; catalogus 11 mm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 400 A | tf | 190 mm | 19 mm | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; tf = 19 mm staat in de bron als 190; catalogus 19 mm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 400 A | A | 1.590.000 mm² | 15.900 mm² | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; A = 159.0 cm² staat in de bron onder G; catalogus 159.0 cm². | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 400 B | G | 198 kg/m | 155,3 kg/m | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; G = 155.3 kg/m staat in de bron onder h; catalogus 155 kg/m (afgerond). | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 400 B | h | 155,3 mm | 400 mm | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; h = 400 mm staat in de bron onder b; catalogus 400 mm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 400 B | b | 400 mm | 300 mm | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; b = 300 mm ontbreekt in de bron; catalogus 300 mm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 400 B | tw | 135 mm | 13,5 mm | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; tw = 13.5 mm staat in de bron als 135; catalogus 13.5 mm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 400 B | tf | 240 mm | 24 mm | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; tf = 24 mm staat in de bron als 240; catalogus 24 mm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 400 B | A | 2.180.000 mm² | 19.780 mm² | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; A = 197.8 cm² staat in de bron onder G; catalogus 197.8 cm². | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 400 M | G | 326 kg/m | 255,7 kg/m | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; G = 255.7 kg/m staat in de bron onder h; catalogus 256 kg/m (afgerond). | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 400 M | h | 255,7 mm | 432 mm | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; h = 432 mm staat in de bron onder b; catalogus 432 mm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 400 M | b | 432 mm | 307 mm | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; b = 307 mm ontbreekt in de bron; catalogus 307 mm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 400 M | tw | 210 mm | 21 mm | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; tw = 21 mm staat in de bron als 210; catalogus 21 mm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 400 M | tf | 400 mm | 40 mm | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; tf = 40 mm staat in de bron als 400; catalogus 40 mm. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| HE | HE 400 M | A | 3.350.000 mm² | 32.580 mm² | In de bron ontbreekt de kolom b en staan de kolommen één plaats verschoven: onder G staat A [cm²], onder h staat G, onder b staat h, en tw en tf zijn ×10. De kolomvolgorde is voor alle acht HE 360- en HE 400-rijen gelijk. De waarde is hersteld; A = 325.8 cm² staat in de bron onder G; catalogus 325.8 cm². | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, HE AA, A, B en M, maten p. 56, eigenschappen p. 57 |
| RHS | 50x30 3.2 | A | 413 mm² | 460 mm² | A = 4.13 cm² in de bron is gelijk aan Wz (of een andere kolom) en past niet bij de rest van de rij. Uit G = 3.61 kg/m volgt A = 4.6 cm² (G/ρ); dat komt overeen met √(Iy/A) = iy en √(Iz/A) = iz in dezelfde rij (afwijking < 2 %). | TU Delft Vademecum (TeachBooks), RHS-HF-tabel: A volgt uit G (EN 10210, ρ = 7850 kg/m³) |
| RHS | 60x40 3.0 | A | 695 mm² | 554 mm² | A = 6.95 cm² in de bron is gelijk aan Wz (of een andere kolom) en past niet bij de rest van de rij. Uit G = 4.35 kg/m volgt A = 5.54 cm² (G/ρ); dat komt overeen met √(Iy/A) = iy en √(Iz/A) = iz in dezelfde rij (afwijking < 2 %). | TU Delft Vademecum (TeachBooks), RHS-HF-tabel: A volgt uit G (EN 10210, ρ = 7850 kg/m³) |
| RHS | 60x40 4.0 | A | 852 mm² | 718 mm² | A = 8.52 cm² in de bron is gelijk aan Wz (of een andere kolom) en past niet bij de rest van de rij. Uit G = 5.64 kg/m volgt A = 7.18 cm² (G/ρ); dat komt overeen met √(Iy/A) = iy en √(Iz/A) = iz in dezelfde rij (afwijking < 2 %). | TU Delft Vademecum (TeachBooks), RHS-HF-tabel: A volgt uit G (EN 10210, ρ = 7850 kg/m³) |
| RHS | 60x40 5.0 | A | 977 mm² | 873 mm² | A = 9.77 cm² in de bron is gelijk aan Wz (of een andere kolom) en past niet bij de rest van de rij. Uit G = 6.85 kg/m volgt A = 8.73 cm² (G/ρ); dat komt overeen met √(Iy/A) = iy en √(Iz/A) = iz in dezelfde rij (afwijking < 2 %). | TU Delft Vademecum (TeachBooks), RHS-HF-tabel: A volgt uit G (EN 10210, ρ = 7850 kg/m³) |
| RHS | 80x40 3.2 | A | 946 mm² | 716 mm² | A = 9.46 cm² in de bron is gelijk aan Wz (of een andere kolom) en past niet bij de rest van de rij. Uit G = 5.62 kg/m volgt A = 7.16 cm² (G/ρ); dat komt overeen met √(Iy/A) = iy en √(Iz/A) = iz in dezelfde rij (afwijking < 2 %). | TU Delft Vademecum (TeachBooks), RHS-HF-tabel: A volgt uit G (EN 10210, ρ = 7850 kg/m³) |
| RHS | 80x40 4.0 | A | 1.110 mm² | 879 mm² | A = 11.1 cm² in de bron is gelijk aan Wz (of een andere kolom) en past niet bij de rest van de rij. Uit G = 6.9 kg/m volgt A = 8.79 cm² (G/ρ); dat komt overeen met √(Iy/A) = iy en √(Iz/A) = iz in dezelfde rij (afwijking < 2 %). | TU Delft Vademecum (TeachBooks), RHS-HF-tabel: A volgt uit G (EN 10210, ρ = 7850 kg/m³) |
| RHS | 80x40 5.0 | A | 1.290 mm² | 1.070 mm² | A = 12.9 cm² in de bron is gelijk aan Wz (of een andere kolom) en past niet bij de rest van de rij. Uit G = 8.42 kg/m volgt A = 10.7 cm² (G/ρ); dat komt overeen met √(Iy/A) = iy en √(Iz/A) = iz in dezelfde rij (afwijking < 2 %). | TU Delft Vademecum (TeachBooks), RHS-HF-tabel: A volgt uit G (EN 10210, ρ = 7850 kg/m³) |
| RHS | 80x40 6.3 | A | 1.460 mm² | 1.310 mm² | A = 14.6 cm² in de bron is gelijk aan Wz (of een andere kolom) en past niet bij de rest van de rij. Uit G = 10.3 kg/m volgt A = 13.1 cm² (G/ρ); dat komt overeen met √(Iy/A) = iy en √(Iz/A) = iz in dezelfde rij (afwijking < 2 %). | TU Delft Vademecum (TeachBooks), RHS-HF-tabel: A volgt uit G (EN 10210, ρ = 7850 kg/m³) |
| RHS | 90x50 3.6 | A | 1.550 mm² | 943 mm² | A = 15.5 cm² in de bron is gelijk aan Wz (of een andere kolom) en past niet bij de rest van de rij. Uit G = 7.4 kg/m volgt A = 9.43 cm² (G/ρ); dat komt overeen met √(Iy/A) = iy en √(Iz/A) = iz in dezelfde rij (afwijking < 2 %). | TU Delft Vademecum (TeachBooks), RHS-HF-tabel: A volgt uit G (EN 10210, ρ = 7850 kg/m³) |
| RHS | 90x50 5.0 | A | 1.970 mm² | 1.270 mm² | A = 19.7 cm² in de bron is gelijk aan Wz (of een andere kolom) en past niet bij de rest van de rij. Uit G = 9.99 kg/m volgt A = 12.7 cm² (G/ρ); dat komt overeen met √(Iy/A) = iy en √(Iz/A) = iz in dezelfde rij (afwijking < 2 %). | TU Delft Vademecum (TeachBooks), RHS-HF-tabel: A volgt uit G (EN 10210, ρ = 7850 kg/m³) |
| RHS | 90x50 6.3 | A | 2.280 mm² | 1.570 mm² | A = 22.8 cm² in de bron is gelijk aan Wz (of een andere kolom) en past niet bij de rest van de rij. Uit G = 12.3 kg/m volgt A = 15.7 cm² (G/ρ); dat komt overeen met √(Iy/A) = iy en √(Iz/A) = iz in dezelfde rij (afwijking < 2 %). | TU Delft Vademecum (TeachBooks), RHS-HF-tabel: A volgt uit G (EN 10210, ρ = 7850 kg/m³) |
| RHS | 100x50 3.0 | A | 1.470 mm² | 855 mm² | A = 14.7 cm² in de bron is gelijk aan Wz (of een andere kolom) en past niet bij de rest van de rij. Uit G = 6.71 kg/m volgt A = 8.55 cm² (G/ρ); dat komt overeen met √(Iy/A) = iy en √(Iz/A) = iz in dezelfde rij (afwijking < 2 %). | TU Delft Vademecum (TeachBooks), RHS-HF-tabel: A volgt uit G (EN 10210, ρ = 7850 kg/m³) |
| RHS | 100x50 3.2 | A | 1.550 mm² | 908 mm² | A = 15.5 cm² in de bron is gelijk aan Wz (of een andere kolom) en past niet bij de rest van de rij. Uit G = 7.13 kg/m volgt A = 9.08 cm² (G/ρ); dat komt overeen met √(Iy/A) = iy en √(Iz/A) = iz in dezelfde rij (afwijking < 2 %). | TU Delft Vademecum (TeachBooks), RHS-HF-tabel: A volgt uit G (EN 10210, ρ = 7850 kg/m³) |
| RHS | 100x50 5.0 | A | 2.170 mm² | 1.380 mm² | A = 21.7 cm² in de bron is gelijk aan Wz (of een andere kolom) en past niet bij de rest van de rij. Uit G = 10.8 kg/m volgt A = 13.8 cm² (G/ρ); dat komt overeen met √(Iy/A) = iy en √(Iz/A) = iz in dezelfde rij (afwijking < 2 %). | TU Delft Vademecum (TeachBooks), RHS-HF-tabel: A volgt uit G (EN 10210, ρ = 7850 kg/m³) |
| RHS | 100x50 6.3 | A | 2.520 mm² | 1.690 mm² | A = 25.2 cm² in de bron is gelijk aan Wz (of een andere kolom) en past niet bij de rest van de rij. Uit G = 13.3 kg/m volgt A = 16.9 cm² (G/ρ); dat komt overeen met √(Iy/A) = iy en √(Iz/A) = iz in dezelfde rij (afwijking < 2 %). | TU Delft Vademecum (TeachBooks), RHS-HF-tabel: A volgt uit G (EN 10210, ρ = 7850 kg/m³) |
| RHS | 100x50 8.0 | A | 3.140 mm² | 2.080 mm² | A = 31.4 cm² in de bron is gelijk aan Wz (of een andere kolom) en past niet bij de rest van de rij. Uit G = 16.3 kg/m volgt A = 20.8 cm² (G/ρ); dat komt overeen met √(Iy/A) = iy en √(Iz/A) = iz in dezelfde rij (afwijking < 2 %). | TU Delft Vademecum (TeachBooks), RHS-HF-tabel: A volgt uit G (EN 10210, ρ = 7850 kg/m³) |
| RHS | 100x50 10.0 | A | 3.780 mm² | 2.500 mm² | A = 37.8 cm² in de bron is gelijk aan Wz (of een andere kolom) en past niet bij de rest van de rij. Uit G = 19.6 kg/m volgt A = 25 cm² (G/ρ); dat komt overeen met √(Iy/A) = iy en √(Iz/A) = iz in dezelfde rij (afwijking < 2 %). | TU Delft Vademecum (TeachBooks), RHS-HF-tabel: A volgt uit G (EN 10210, ρ = 7850 kg/m³) |
| RHS | 100x60 3.6 | A | 2.160 mm² | 1.090 mm² | A = 21.6 cm² in de bron is gelijk aan Wz (of een andere kolom) en past niet bij de rest van de rij. Uit G = 8.53 kg/m volgt A = 10.9 cm² (G/ρ); dat komt overeen met √(Iy/A) = iy en √(Iz/A) = iz in dezelfde rij (afwijking < 2 %). | TU Delft Vademecum (TeachBooks), RHS-HF-tabel: A volgt uit G (EN 10210, ρ = 7850 kg/m³) |
| RHS | 100x60 5.0 | A | 2.790 mm² | 1.480 mm² | A = 27.9 cm² in de bron is gelijk aan Wz (of een andere kolom) en past niet bij de rest van de rij. Uit G = 11.6 kg/m volgt A = 14.8 cm² (G/ρ); dat komt overeen met √(Iy/A) = iy en √(Iz/A) = iz in dezelfde rij (afwijking < 2 %). | TU Delft Vademecum (TeachBooks), RHS-HF-tabel: A volgt uit G (EN 10210, ρ = 7850 kg/m³) |
| RHS | 100x60 6.3 | A | 3.270 mm² | 1.810 mm² | A = 32.7 cm² in de bron is gelijk aan Wz (of een andere kolom) en past niet bij de rest van de rij. Uit G = 14.2 kg/m volgt A = 18.1 cm² (G/ρ); dat komt overeen met √(Iy/A) = iy en √(Iz/A) = iz in dezelfde rij (afwijking < 2 %). | TU Delft Vademecum (TeachBooks), RHS-HF-tabel: A volgt uit G (EN 10210, ρ = 7850 kg/m³) |
| RHS | 100x60 8.0 | A | 3.780 mm² | 2.230 mm² | A = 37.8 cm² in de bron is gelijk aan Wz (of een andere kolom) en past niet bij de rest van de rij. Uit G = 17.5 kg/m volgt A = 22.3 cm² (G/ρ); dat komt overeen met √(Iy/A) = iy en √(Iz/A) = iz in dezelfde rij (afwijking < 2 %). | TU Delft Vademecum (TeachBooks), RHS-HF-tabel: A volgt uit G (EN 10210, ρ = 7850 kg/m³) |
| UNP | 150x65 | h | 150 mm | 160 mm | Alle waarden in deze rij (G 18,8 kg/m, A 24,0 cm², Iy 925 cm⁴, Wy 116 cm³, Iz 85,3 cm⁴, Wz 18,3 cm³) horen bij UPN 160; Wy = Iy/(h/2) klopt alleen met h = 160. Een UPN 150 komt in de catalogus niet voor. Alleen de maat is gecorrigeerd, niet de waarden. | ArcelorMittal Europe – Long Products, Sections and Merchant bars, Sales programme 2024-1, UPN, p. 100–101 |

## Fouten

| Tabel | Rij | Check | Veld | Verwacht | Gevonden | Toelichting |
|---|---|---|---|---|---|---|
| IPE | IPE 240 R | i ≈ √(I/A) | iy | 100,8 mm | 82,6 mm | iy wijkt -18.0 % af van √(Iy/A). verwachte iy staat mogelijk in kolom iz (101.0) |
| IPE | IPE 240 R | i ≈ √(I/A) | iz | 26,71 mm | 101 mm | iz wijkt 278.1 % af van √(Iz/A) |
| IPE | IPE 240 R | Iy > Iz, iy > iz | iz |  | 101 mm | iy moet groter zijn dan iz |
| IPE | IPE 270 R | i ≈ √(I/A) | iy | 114,3 mm | 91,1 mm | iy wijkt -20.3 % af van √(Iy/A). verwachte iy staat mogelijk in kolom iz (114.0) |
| IPE | IPE 270 R | i ≈ √(I/A) | iz | 30,36 mm | 114 mm | iz wijkt 275.6 % af van √(Iz/A) |
| IPE | IPE 270 R | Iy > Iz, iy > iz | iz |  | 114 mm | iy moet groter zijn dan iz |
| IPE | IPE 300 R | lege cel | iy |  |  | iy ontbreekt in de bron; berekend als √(Iy/A) |
| IPE | IPE 300 R | i ≈ √(I/A) | iz | 33,24 mm | 126 mm | iz wijkt 279.1 % af van √(Iz/A) |
| HE | HE 400 x107 | plausibele maten | h | 192 mm | 107,2 mm | h moet groter zijn dan b/2 |
| HE | HE 400 x107 | plausibele maten | tf |  | 160 mm | 2·tf moet kleiner zijn dan h |
| HE | HE 400 x107 | G ≈ A·ρ | G | 10.676 kg/m | 136 kg/m | G wijkt -98.7 % af van A × 7850 kg/m³ |
| HE | HE 400 x107 | i ≈ √(I/A) | iy | 16,64 mm | 166 mm | iy wijkt 897.8 % af van √(Iy/A) |
| HE | HE 400 x107 | i ≈ √(I/A) | iz | 7,173 mm | 71,6 mm | iz wijkt 898.1 % af van √(Iz/A) |
| HE | HE 400 x107 | W ≈ I/(h/2) | Wy | 7.022.388 mm³ | 1.960.000 mm³ | Wy wijkt -72.1 % af van Iy/(h/2). verwachte Wy staat mogelijk in kolom Iz (6998) |
| HE | HE 400 x107 | W ≈ I/(h/2) | Wz | 364.479 mm³ | 471.000 mm³ | Wz wijkt 29.2 % af van Iz/(b/2) |

## Waarschuwingen

<details><summary>0 waarschuwingen: tabelwaarde wijkt af van de geïdealiseerde geometrie</summary>

Geen.

</details>

## Niet geïmporteerd

Geen.

## Geprofileerde staalplaten

De kolomkop geeft I<sub>y</sub> in [mm⁴] en W<sub>y;el</sub> als "·10⁴ [mm⁴]". Een weerstandsmoment heeft eenheid mm³, en de getallen (bijv. h = 40, t = 0,88: I = 30, W = 9,1) passen bij I ×10⁴ mm⁴/m en W ×10³ mm³/m. Die lezing is op 24-10-2026 gecontroleerd. De kolom σ [N/mm²] wordt in de bron niet toegelicht.

## Hout (dimensietabellen)

Voor een rechthoek volgen A = b·h, W = b·h²/6 en I = b·h³/12 exact; BARCHY rekent ze zelf uit en gebruikt de tabel alleen voor de lijst met maten.
Van de 612 gevulde cellen passen er 504 bij hun eigen kolom (op een macht van tien na). Opvallend:

- De kolomkoppen zeggen A [mm²], W [mm³], I [mm⁴], maar de getallen zijn geschaald (×10², ×10³, ×10⁶), zonder dat dat erbij staat.
- In de gezaagde tabellen lijken per breedte vijf waarden te staan (A, W<sub>y</sub>, I<sub>y</sub>, W<sub>z</sub>, I<sub>z</sub>) onder een kop met drie kolommen, waardoor alles na de eerste breedte verschuift.
- Een deel van de waarden hoort bij b + 1 mm (bijv. 70 in plaats van 69): mogelijk berekend met de ongeschaafde maat.

Bij 14 maten hoort geen enkele cel in hun rij bij die maat: 58×69, 58×120, 58×133, 58×170, 58×195, 58×220, 95×95, 95×120, 95×170, 95×270, 120×195, 120×220, 120×245, 120×270. Op 24-10-2026 is gecontroleerd dat deze maten wel kloppen; ze krijgen daarom alleen een waarschuwing.

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
