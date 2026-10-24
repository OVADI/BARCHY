# Bijdragen aan BARCHY

Fijn dat je wilt helpen. BARCHY is een studentenproject; elke correctie maakt het betrouwbaarder.

## Een fout of wens melden

- **Een waarde klopt niet:** open een issue met het formulier _Correctie_. Noem het scherm, de waarde en waar je de juiste waarde vond.
- **Je mist iets:** gebruik het formulier _Ik zocht iets_, of het feedbackformulier op de About-pagina in de app.

## Regels voor inhoud

- **Geen verzonnen waarden.** Elke bouwkundige waarde komt uit een bron: het TU Delft Vademecum of de Bbl. Vermeld de bron (pagina, tabel of artikel).
- Een waarde die nog niet is nagelopen krijgt `status: flagged` en staat in de app op "Controleren".
- `npm run report:status` maakt `reports/controle.md`, met alles wat nog gecontroleerd moet worden.

## Code

```bash
npm install
npm run dev
```

Voordat je een pull request opent, moeten deze slagen: `npm run lint`, `npm run check` en `npm test`.
