'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'

import { Dot, Num, Row, Slider } from '@/components/ui'
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

  /*
   * Vaste kleurtoewijzing uit het merkpalet, in tekenvolgorde. Zwart is hier het
   * vlak, en op zwart halen alle vier de ruim 3:1 contrast — op wit zakken roze,
   * paars en blauw daaronder, dus staat deze staaf op de zwarte kaart. Groen
   * blijft vrij en is aan de werknemerskant gereserveerd.
   */
  const segs = [
    { k: 'Eenmalig', v: r.eenmalig, c: 'bg-pink' },
    { k: 'Vaste kosten', v: r.vast, c: 'bg-blue' },
    { k: 'Pensioenbijdrage', v: r.bijdrage, c: 'bg-orange' },
    { k: 'Werkgeverslasten', v: r.lasten, c: 'bg-purple' },
  ]
  const total = Math.max(r.jaar1, 1)
  const deelnemers = Math.round(r.participants)

  return (
    <div className="min-h-screen w-full bg-white">
      <header className="mx-auto max-w-6xl px-6 pt-10 pb-8">
        <Image
          src="/vive-logo.png"
          alt="Vive"
          width={480}
          height={160}
          priority
          className="mb-8 h-8 w-auto"
        />
        <div className="text-grey-60 mb-3 text-xs font-medium tracking-[0.18em] uppercase">
          Werkgeverspensioen · indicatie 2026
        </div>
        <h1 className="text-4xl leading-[1.05] font-bold tracking-tight md:text-6xl">
          Wat kost pensioen voor <span className="text-orange">jouw team</span>?
        </h1>
        <p className="text-grey-60 mt-4 max-w-xl text-sm leading-relaxed">
          Vul drie stappen in en zie direct wat de regeling de werkgever kost — en wat er
          gemiddeld bij de werknemer terechtkomt.
        </p>
      </header>

      <main className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 pb-16 lg:grid-cols-5">
        {/* ——— Invoer ——— */}
        <section className="border-grey-10 rounded-3xl border bg-white p-6 lg:col-span-2">
          <h2 className="text-lg font-bold">Jouw gegevens</h2>
          <p className="text-grey-60 mt-1 mb-4 text-xs">
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
              width={145}
            />
          </Row>

          <div className="border-grey-10 my-4 border-t" />

          <Row label="Manier van bijdragen" step={1}>
            <div
              role="group"
              aria-label="Manier van bijdragen"
              className="border-grey-20 flex overflow-hidden rounded-full border text-xs font-medium"
            >
              {BASIS_OPTIES.map(([val, lab]) => (
                <button
                  key={val}
                  type="button"
                  aria-pressed={basis === val}
                  onClick={() => setBasis(val)}
                  className={`px-3 py-2 whitespace-nowrap transition-colors ${
                    basis === val ? 'bg-ink text-white' : 'text-grey-60 bg-white'
                  }`}
                >
                  {lab}
                </button>
              ))}
            </div>
          </Row>

          {basis === 'pct' ? (
            <Row label="Bijdrage-percentage" step={2} hint="Over het totale brutosalaris">
              <Num
                label="Bijdrage-percentage"
                value={pct}
                onChange={setPct}
                suffix="%"
                step={0.5}
                max={30}
                width={105}
              />
            </Row>
          ) : (
            <Row label="Bijdrage per maand" step={2} hint="Per werknemer">
              <Num
                label="Bijdrage per werknemer per maand in euro"
                value={fixedPm}
                onChange={setFixedPm}
                prefix="€"
                step={25}
                width={125}
              />
            </Row>
          )}

          <Row label="Verwachte deelname" step={3} hint="Percentage werknemers dat meedoet">
            <div className="flex w-[175px] max-w-full min-w-0 items-center gap-3">
              <Slider
                label="Verwachte deelname in procenten"
                value={participation}
                onChange={setParticipation}
                step={5}
              />
              <span className="tnum w-11 text-right text-sm font-bold">{participation}%</span>
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
              width={105}
            />
          </Row>

          {/* Kostenparameters */}
          <button
            type="button"
            aria-expanded={showParams}
            onClick={() => setShowParams(!showParams)}
            className="mt-4 text-xs font-medium underline underline-offset-4"
          >
            {showParams ? 'Verberg kostenparameters' : 'Kostenparameters aanpassen'}
          </button>
          {showParams && (
            <div className="bg-grey-5 mt-3 rounded-2xl p-4">
              <Row label="Afsluitkosten" hint="Eenmalig, per werknemer">
                <Num
                  label="Afsluitkosten per werknemer in euro"
                  value={afsluit}
                  onChange={setAfsluit}
                  prefix="€"
                  width={115}
                />
              </Row>
              <Row label="Vaste kosten" hint="Per werknemer, per jaar">
                <Num
                  label="Vaste kosten per werknemer per jaar in euro"
                  value={vastPp}
                  onChange={setVastPp}
                  prefix="€"
                  width={115}
                />
              </Row>
              <Row label="Beheerkosten" hint="Fonds- en servicekosten p.j.">
                <Num
                  label="Beheerkosten per jaar in procenten"
                  value={beheerPct}
                  onChange={setBeheerPct}
                  suffix="%"
                  step={0.01}
                  width={105}
                />
              </Row>
              <Row label="Loonheffing" hint="Voor netto-berekening werknemer">
                <Num
                  label="Loonheffing in procenten"
                  value={taxPct}
                  onChange={setTaxPct}
                  suffix="%"
                  step={0.5}
                  width={105}
                />
              </Row>
            </div>
          )}
        </section>

        {/* ——— Resultaat ——— */}
        <section className="flex flex-col gap-6 lg:col-span-3">
          {/* Werkgever */}
          <div className="bg-ink rounded-3xl p-6 text-white">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-lg font-bold">Wat betaalt de werkgever?</h2>
              <div className="text-right">
                <div className="tnum text-4xl font-bold tracking-tight">{eur(r.jaar1)}</div>
                <div className="text-grey-40 text-xs">totaal in jaar 1</div>
              </div>
            </div>

            {/*
              Kostenopbouw jaar 1. De segmenten staan 2px los van elkaar zodat de
              scheiding niet van kleur alleen afhangt, en hebben ronde uiteinden —
              de lijnstijl die de brand guide voorschrijft.
            */}
            <div className="mt-6 flex h-5 w-full gap-[2px] overflow-hidden rounded-full bg-white/15">
              {segs.map(
                (s) =>
                  s.v > 0 && (
                    <div
                      key={s.k}
                      title={`${s.k}: ${eur(s.v)}`}
                      className={`${s.c} min-w-0 rounded-full transition-[width] duration-300 ease-out`}
                      style={{ width: `${(s.v / total) * 100}%` }}
                    />
                  ),
              )}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs md:grid-cols-4">
              {segs.map((s) => (
                <div key={s.k} className="flex items-start gap-2">
                  <Dot className={s.c} />
                  <div>
                    <div className="text-grey-40">{s.k}</div>
                    <div className="tnum font-medium">{eur(s.v)}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 border-t border-white/15 pt-4 text-sm">
              <div>
                <span className="text-grey-40">Vanaf jaar 2: </span>
                <strong className="tnum font-medium">{eur(r.jaarVervolg)}</strong>
                <span className="text-grey-40"> per jaar</span>
              </div>
              <div>
                <span className="text-grey-40">Per werknemer per maand: </span>
                <strong className="tnum font-medium">
                  {eur(employees ? r.jaarVervolg / employees / 12 : 0)}
                </strong>
              </div>
            </div>
          </div>

          {/* Werknemer */}
          <div className="border-grey-10 rounded-3xl border bg-white p-6">
            <h2 className="text-lg font-bold">Wat krijgt de werknemer gemiddeld?</h2>
            <p className="text-grey-60 mt-1 text-xs">
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
                <div key={lab} className="bg-grey-5 rounded-2xl p-4">
                  <div className="flex items-start gap-2">
                    <Dot className="bg-green" />
                    <div className="text-grey-60 text-xs">{lab}</div>
                  </div>
                  <div className="tnum text-ink mt-2 text-3xl font-bold tracking-tight">
                    {eur(v)}
                  </div>
                  {sub && <div className="text-grey-60 mt-1 text-[11px]">{sub}</div>}
                </div>
              ))}
            </div>
            <p className="text-grey-60 mt-5 text-[11px] leading-relaxed">
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
