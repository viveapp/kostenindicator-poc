# Kostenindicator werkgeverspensioen (POC)

Prototype van een kostenindicator voor werkgeverspensioen: vul drie stappen in en
zie direct wat de regeling de werkgever kost — en wat er gemiddeld bij de
werknemer terechtkomt.

Het rekenmodel is gebaseerd op reverse-engineering van een concurrent-indicator
(Brand New Day, 2026). Alle kostenparameters staan in de UI achter
"Kostenparameters aanpassen", zodat eigen tarieven ingeplugd kunnen worden.

Dit is een indicatie, geen aanbod: aan de berekening kunnen geen rechten worden
ontleend.

## Aan de slag

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # rekenmodel
npm run lint
npm run build
```

## Opzet

| Pad | Wat |
| --- | --- |
| `src/lib/kosten/calc.ts` | Het rekenmodel — puur, zonder React, met de invoer- en uitvoertypes |
| `src/lib/kosten/money.ts` | Euro-formattering (nl-NL) |
| `src/components/ui.tsx` | Invoerprimitieven: `Num`, `Row`, `StepTag` |
| `src/app/page.tsx` | De indicator: invoerkolom links, resultaat rechts |
| `src/app/globals.css` | Palet en typografie als Tailwind-theme-tokens |

Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript, Vitest.

## Rekenmodel

Per jaar, bij `employees` werknemers en een deelname van `participation`%:

- **Pensioenbijdrage** — `pct`% van het totale brutosalaris, of `fixedPm` per
  werknemer per maand; schaalt mee met de deelname.
- **Werkgeverslasten** — `lastenPct`% over die bijdrage.
- **Vaste kosten** — `vastPp` per werknemer per jaar.
- **Afsluitkosten** — `afsluit` per werknemer, alleen in jaar 1.

Afsluit- en vaste kosten rekent de aanbieder per werknemer in dienst, ook als die
niet meedoet; alleen de bijdrage volgt de deelname. Aan de werknemerskant wordt
de bruto bijdrage per deelnemer gesplitst in een netto storting (na `taxPct`%
loonheffing) en een belastingteruggaaf via de jaarruimte.

De beheerkosten (`beheerPct`) worden op de pensioenrekening verrekend en zitten
daarom niet in de werkgeverskosten — ze staan alleen in de toelichting.
