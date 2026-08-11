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
| `src/app/globals.css` | Merkpalet en typografie als Tailwind-theme-tokens |

Next.js 16 (App Router), React 19, Tailwind CSS v4, TypeScript, Vitest.

## Vormgeving

De styling komt uit het Figma-bestand
[VIVE — Brand Guide Assets](https://figma.com/design/EBNuAmD5lYVIL4AsOSGVhA/VIVE---Brand-Guide-Assets).
Wat daarvan is overgenomen:

- **Kleur.** De vijf merkkleuren staan in dat bestand als variabelen
  (`Colors/primary/*`) en zijn hier één-op-één de tokens `orange` `#F05014`,
  `pink` `#FF8CB4`, `purple` `#A096FF`, `blue` `#0096FF` en `green` `#00BE64`.
  Daarnaast het grijsverloop 0–100, waarin `greys/N` staat voor N% zwart.
- **Typografie.** Het merk gebruikt Monument Grotesk. Die licentie hebben we
  hier niet, dus staat Space Grotesk ervoor — dezelfde neo-grotesk inslag, en
  door zijn monospace-afkomst lopen de cijfers van zichzelf al gelijk. Arial is
  de systeemletter die het merk zelf aanwijst en blijft de fallback.
- **Beeldtaal.** De brand guide schrijft voor illustraties en grafieken
  cirkelvormen met vulling en lijnen met een rond uiteinde voor. Vandaar de
  gevulde cirkels als legendamarkering en stapnummer, de ronde uiteinden op de
  staaf en de schuif, en de doorgevoerd ronde vormen op invoervelden en kaarten.
- **Logo.** `public/vive-logo.png`, verkleind uit het 3000px-bestand in de brand
  guide. Daar staat het woordmerk alleen als raster; komt er een SVG, dan kan die
  dit bestand zo vervangen.

### Waarom de kostenstaaf op zwart staat

De vier kostencomponenten krijgen elk een eigen merkkleur, in een vaste volgorde.
Op zwart halen alle vier ruim 3:1 contrast; op wit zakken roze, paars en blauw
daaronder. Daarom staat die staaf op de zwarte kaart en niet op de witte pagina.
Groen blijft buiten de staaf en is gereserveerd voor de werknemerskant.

Het palet is verder gecontroleerd op kleurenblindheid: de zwakste naastgelegen
combinatie (blauw naast roze) houdt ΔE 13,2 onder protanopie, ruim boven de
ondergrens. De vijf merkkleuren zitten wel lichter dan een databand normaal
aanhoudt — het merk levert vijf vlakke kleuren zonder verlooptrappen, dus daar is
niets tussenin te kiezen. De scheiding leunt daarom niet op kleur alleen: de
segmenten staan 2px los van elkaar en alle vier staan met naam en bedrag in de
legenda.

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
