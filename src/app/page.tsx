'use client'

import { useMemo, useState } from 'react'

import { Num, Row, StepTag } from '@/components/ui'
import { berekenKosten, type Basis } from '@/lib/kosten/calc'
import { eur } from '@/lib/kosten/money'

const BASIS_OPTIES: [Basis, string][] = [
  ['pct', '% van salaris'],
  ['fixed', 'Vast bedrag'],
]

export default function Kostenindicator() {
  // — Bedrijfsgegevens
  const [employees, setEmployees] = useState(8)
  const [avgSalary, setAvgSalary] = useState(56764)
  // — Regeling
  const [basis, setBasis] = useState<Basis>('pct')
  const [pct, setPct] = useState(4)
  const [fixedPm, setFixedPm] = useState(250)
  const [lastenPct, setLastenPct] = useState(18)
  const [participation, setParticipation] = useState(100)
  // — Kostenparameters (instelbaar; nu gevuld met concurrent-waarden)
  const [showParams, setShowParams] = useState(false)
  const [afsluit, setAfsluit] = useState(45)
  const [vastPp, setVastPp] = useState(100)
  const [taxPct, setTaxPct] = useState(37)
  // Alleen ter toelichting: verrekend op de pensioenrekening, niet in de
  // werkgeverskosten hieronder.
  const [beheerPct, setBeheerPct] = useState(0.35)

  const r = useMemo(
    () =>
      berekenKosten({
        employees,
        avgSalary,
        basis,
        pct,
        fixedPm,
        lastenPct,
        participation,
        afsluit,
        vastPp,
        taxPct,
      }),
    [
      employees,
      avgSalary,
      basis,
      pct,
      fixedPm,
      lastenPct,
      participation,
      afsluit,
      vastPp,
      taxPct,
    ],
  )

  const segs = [
    { k: 'Eenmalig', v: r.eenmalig, c: 'bg-amber' },
    { k: 'Vaste kosten', v: r.vast, c: 'bg-petrol-soft' },
    { k: 'Pensioenbijdrage', v: r.bijdrage, c: 'bg-petrol' },
    { k: 'Werkgeverslasten', v: r.lasten, c: 'bg-petrol-mid' },
  ]
  const total = Math.max(r.jaar1, 1)
  const deelnemers = Math.round(r.participants)

  return (
    <div className="bg-mist min-h-screen w-full">
      <header className="mx-auto max-w-6xl px-6 pt-10 pb-6">
        <div className="text-petrol mb-2 text-xs uppercase" style={{ letterSpacing: '0.18em' }}>
          Werkgeverspensioen · indicatie 2026
        </div>
        <h1 className="font-display text-4xl leading-tight font-normal md:text-5xl">
          Wat kost pensioen voor <span className="text-petrol">jouw team</span>?
        </h1>
        <p className="text-sub mt-2 max-w-xl text-sm">
          Vul drie stappen in en zie direct wat de regeling de werkgever kost — en wat er
          gemiddeld bij de werknemer terechtkomt.
        </p>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 pb-16 lg:grid-cols-5">
        {/* ——— Invoer ——— */}
        <section className="border-line bg-paper rounded-2xl border p-6 lg:col-span-2">
          <h2 className="mb-1 text-lg font-semibold">Jouw gegevens</h2>
          <p className="text-sub mb-4 text-xs">
            Gemiddelden volstaan voor een eerste indicatie.
          </p>

          <Row label="Aantal werknemers">
            <Num
              label="Aantal werknemers"
              value={employees}
              onChange={setEmployees}
              min={1}
              width={110}
            />
          </Row>
          <Row
            label="Gemiddeld bruto jaarsalaris"
            hint="Incl. vakantiegeld, o.b.v. werkelijke uren"
          >
            <Num
              label="Gemiddeld bruto jaarsalaris in euro"
              value={avgSalary}
              onChange={setAvgSalary}
              prefix="€"
              step={500}
              width={140}
            />
          </Row>

          <div className="border-line my-4 border-t" />

          <Row
            label={
              <span>
                <StepTag n={1} />
                Manier van bijdragen
              </span>
            }
          >
            <div
              role="group"
              aria-label="Manier van bijdragen"
              className="border-line flex overflow-hidden rounded-lg border text-xs font-medium"
            >
              {BASIS_OPTIES.map(([val, lab]) => (
                <button
                  key={val}
                  type="button"
                  aria-pressed={basis === val}
                  onClick={() => setBasis(val)}
                  className={`px-3 py-2 transition-colors ${
                    basis === val ? 'bg-petrol text-white' : 'text-sub bg-white'
                  }`}
                >
                  {lab}
                </button>
              ))}
            </div>
          </Row>

          {basis === 'pct' ? (
            <Row
              label={
                <span>
                  <StepTag n={2} />
                  Bijdrage-percentage
                </span>
              }
              hint="Over het totale brutosalaris"
            >
              <Num
                label="Bijdrage-percentage"
                value={pct}
                onChange={setPct}
                suffix="%"
                step={0.5}
                max={30}
                width={100}
              />
            </Row>
          ) : (
            <Row
              label={
                <span>
                  <StepTag n={2} />
                  Bijdrage per maand
                </span>
              }
              hint="Per werknemer"
            >
              <Num
                label="Bijdrage per werknemer per maand in euro"
                value={fixedPm}
                onChange={setFixedPm}
                prefix="€"
                step={25}
                width={120}
              />
            </Row>
          )}

          <Row
            label={
              <span>
                <StepTag n={3} />
                Verwachte deelname
              </span>
            }
            hint="Percentage werknemers dat meedoet"
          >
            <div className="flex items-center gap-3" style={{ width: 190 }}>
              <input
                type="range"
                aria-label="Verwachte deelname in procenten"
                min={0}
                max={100}
                step={5}
                value={participation}
                onChange={(e) => setParticipation(Number(e.target.value))}
                className="accent-petrol w-full"
              />
              <span className="tnum w-12 text-right text-sm font-semibold">
                {participation}%
              </span>
            </div>
          </Row>

          <Row label="Werkgeverslasten over bijdrage" hint="Sociale lasten, indicatief">
            <Num
              label="Werkgeverslasten over bijdrage in procenten"
              value={lastenPct}
              onChange={setLastenPct}
              suffix="%"
              step={1}
              max={40}
              width={100}
            />
          </Row>

          {/* Kostenparameters */}
          <button
            type="button"
            aria-expanded={showParams}
            onClick={() => setShowParams(!showParams)}
            className="text-petrol mt-4 text-xs font-medium underline underline-offset-2"
          >
            {showParams ? 'Verberg kostenparameters' : 'Kostenparameters aanpassen'}
          </button>
          {showParams && (
            <div className="bg-mist mt-3 rounded-xl p-4">
              <Row label="Afsluitkosten" hint="Eenmalig, per werknemer">
                <Num
                  label="Afsluitkosten per werknemer in euro"
                  value={afsluit}
                  onChange={setAfsluit}
                  prefix="€"
                  width={110}
                />
              </Row>
              <Row label="Vaste kosten" hint="Per werknemer, per jaar">
                <Num
                  label="Vaste kosten per werknemer per jaar in euro"
                  value={vastPp}
                  onChange={setVastPp}
                  prefix="€"
                  width={110}
                />
              </Row>
              <Row label="Beheerkosten" hint="Fonds- en servicekosten p.j.">
                <Num
                  label="Beheerkosten per jaar in procenten"
                  value={beheerPct}
                  onChange={setBeheerPct}
                  suffix="%"
                  step={0.01}
                  width={100}
                />
              </Row>
              <Row label="Loonheffing" hint="Voor netto-berekening werknemer">
                <Num
                  label="Loonheffing in procenten"
                  value={taxPct}
                  onChange={setTaxPct}
                  suffix="%"
                  step={0.5}
                  width={100}
                />
              </Row>
            </div>
          )}
        </section>

        {/* ——— Resultaat ——— */}
        <section className="flex flex-col gap-6 lg:col-span-3">
          {/* Werkgever */}
          <div className="bg-petrol-dark rounded-2xl p-6 text-white">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-semibold">Wat betaalt de werkgever?</h2>
              <div className="text-right">
                <div className="font-display tnum text-3xl">{eur(r.jaar1)}</div>
                <div className="text-xs opacity-70">totaal in jaar 1</div>
              </div>
            </div>

            {/* Kostenopbouw jaar 1 */}
            <div className="mt-5 flex h-5 w-full overflow-hidden rounded-full bg-white/12">
              {segs.map(
                (s) =>
                  s.v > 0 && (
                    <div
                      key={s.k}
                      title={`${s.k}: ${eur(s.v)}`}
                      className={`${s.c} transition-[width] duration-300 ease-out`}
                      style={{ width: `${(s.v / total) * 100}%` }}
                    />
                  ),
              )}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-xs md:grid-cols-4">
              {segs.map((s) => (
                <div key={s.k} className="flex items-start gap-2">
                  <span className={`${s.c} mt-1 size-2.5 shrink-0 rounded-sm`} />
                  <div>
                    <div className="opacity-70">{s.k}</div>
                    <div className="tnum font-semibold">{eur(s.v)}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 border-t border-white/15 pt-4 text-sm">
              <div>
                <span className="opacity-70">Vanaf jaar 2: </span>
                <strong className="tnum">{eur(r.jaarVervolg)}</strong>
                <span className="opacity-70"> per jaar</span>
              </div>
              <div>
                <span className="opacity-70">Per werknemer per maand: </span>
                <strong className="tnum">
                  {eur(employees ? r.jaarVervolg / employees / 12 : 0)}
                </strong>
              </div>
            </div>
          </div>

          {/* Werknemer */}
          <div className="border-line bg-paper rounded-2xl border p-6">
            <h2 className="text-lg font-semibold">Wat krijgt de werknemer gemiddeld?</h2>
            <p className="text-sub mt-1 text-xs">
              Per deelnemende werknemer, per jaar ({deelnemers} deelnemer
              {deelnemers === 1 ? '' : 's'}).
            </p>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              {(
                [
                  ['Bruto bijdrage van werkgever', r.brutoPP, null],
                  ['Netto storting op pensioenrekening', r.nettoStorting, 'na loonheffing'],
                  [
                    'Netto belastingteruggaaf',
                    r.teruggaaf,
                    'via jaarruimte, op betaalrekening',
                  ],
                ] as [string, number, string | null][]
              ).map(([lab, v, sub]) => (
                <div key={lab} className="bg-amber-soft rounded-xl p-4">
                  <div className="text-sub text-xs">{lab}</div>
                  <div className="font-display tnum text-ink mt-1 text-2xl">{eur(v)}</div>
                  {sub && <div className="text-sub mt-1 text-[11px]">{sub}</div>}
                </div>
              ))}
            </div>
            <p className="text-sub mt-4 text-[11px] leading-relaxed">
              Beheerkosten ({beheerPct}% p.j.) worden op de pensioenrekening verrekend; er
              zijn geen stortingskosten. Dit overzicht is uitsluitend een indicatie;
              werkelijke kosten en fiscale ruimte kunnen afwijken. Aan deze berekening
              kunnen geen rechten worden ontleend.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
