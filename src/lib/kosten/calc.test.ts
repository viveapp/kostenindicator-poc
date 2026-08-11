import { describe, expect, it } from 'vitest'

import { berekenKosten, type KostenInput } from '@/lib/kosten/calc'

/** De waarden waarmee de indicator opent. */
const base: KostenInput = {
  employees: 8,
  avgSalary: 56764,
  basis: 'pct',
  pct: 4,
  fixedPm: 250,
  lastenPct: 18,
  participation: 100,
  afsluit: 45,
  vastPp: 100,
  taxPct: 37,
}

describe('berekenKosten', () => {
  it('rekent de bijdrage over het totale brutosalaris bij basis pct', () => {
    const r = berekenKosten(base)

    // 4% van 8 × 56.764
    expect(r.bijdrage).toBeCloseTo(18164.48, 2)
    expect(r.lasten).toBeCloseTo(3269.6064, 4)
    expect(r.eenmalig).toBe(360)
    expect(r.vast).toBe(800)
  })

  it('telt eenmalige kosten alleen mee in jaar 1', () => {
    const r = berekenKosten(base)

    expect(r.jaar1 - r.jaarVervolg).toBe(r.eenmalig)
    expect(r.jaarVervolg).toBeCloseTo(r.vast + r.bijdrage + r.lasten, 6)
  })

  it('rekent bij basis fixed per werknemer per maand', () => {
    const r = berekenKosten({ ...base, basis: 'fixed' })

    expect(r.bijdrage).toBe(250 * 12 * 8)
  })

  it('schaalt de bijdrage met de deelname, maar de vaste kosten niet', () => {
    const vol = berekenKosten(base)
    const half = berekenKosten({ ...base, participation: 50 })

    expect(half.bijdrage).toBeCloseTo(vol.bijdrage / 2, 6)
    expect(half.vast).toBe(vol.vast)
    expect(half.eenmalig).toBe(vol.eenmalig)
    expect(half.participants).toBe(4)
  })

  it('houdt de bruto bijdrage per deelnemer gelijk als de deelname daalt', () => {
    const vol = berekenKosten(base)
    const half = berekenKosten({ ...base, participation: 50 })

    expect(half.brutoPP).toBeCloseTo(vol.brutoPP, 6)
  })

  it('splitst de bijdrage per deelnemer in netto storting en teruggaaf', () => {
    const r = berekenKosten(base)

    expect(r.nettoStorting).toBeCloseTo(r.brutoPP * 0.63, 6)
    expect(r.teruggaaf).toBeCloseTo(r.nettoStorting * 0.37, 6)
  })

  it('deelt niet door nul als niemand meedoet', () => {
    const r = berekenKosten({ ...base, participation: 0 })

    expect(r.participants).toBe(0)
    expect(r.brutoPP).toBe(0)
    expect(r.nettoStorting).toBe(0)
    expect(r.teruggaaf).toBe(0)
    // Afsluit- en vaste kosten lopen wél door.
    expect(r.jaar1).toBe(360 + 800)
  })
})
