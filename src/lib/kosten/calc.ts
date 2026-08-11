/**
 * Rekenmodel voor de kostenindicator werkgeverspensioen.
 *
 * Gebaseerd op reverse-engineering van een concurrent-kostenindicator
 * (Brand New Day, 2026). Alle kostenparameters zijn instelbaar zodat eigen
 * tarieven ingeplugd kunnen worden.
 */

/** Manier waarop de werkgever bijdraagt. */
export type Basis = 'pct' | 'fixed'

export type KostenInput = {
  /** Aantal werknemers in dienst. */
  employees: number
  /** Gemiddeld bruto jaarsalaris incl. vakantiegeld, o.b.v. werkelijke uren. */
  avgSalary: number
  basis: Basis
  /** Bijdrage als percentage van het brutosalaris. Gebruikt bij basis 'pct'. */
  pct: number
  /** Bijdrage per werknemer per maand. Gebruikt bij basis 'fixed'. */
  fixedPm: number
  /** Werkgeverslasten over de bijdrage (sociale lasten, indicatief). */
  lastenPct: number
  /** Percentage werknemers dat verwacht meedoet. */
  participation: number
  /** Afsluitkosten, eenmalig per werknemer. */
  afsluit: number
  /** Vaste kosten per werknemer per jaar. */
  vastPp: number
  /** Loonheffing, voor de netto-berekening bij de werknemer. */
  taxPct: number
}

export type KostenResult = {
  /** Totale pensioenbijdrage per jaar. */
  bijdrage: number
  /** Werkgeverslasten over de bijdrage. */
  lasten: number
  /** Eenmalige afsluitkosten. */
  eenmalig: number
  /** Vaste kosten per jaar. */
  vast: number
  /** Totale werkgeverskosten in jaar 1, inclusief eenmalige kosten. */
  jaar1: number
  /** Terugkerende werkgeverskosten vanaf jaar 2. */
  jaarVervolg: number
  /** Bruto bijdrage per deelnemende werknemer per jaar. */
  brutoPP: number
  /** Netto storting op de pensioenrekening, na loonheffing. */
  nettoStorting: number
  /** Netto belastingteruggaaf via jaarruimte. */
  teruggaaf: number
  /** Aantal deelnemende werknemers. */
  participants: number
}

/**
 * Kosten zijn opzettelijk niet naar het aantal deelnemers geschaald: afsluit-
 * en vaste kosten rekent de aanbieder per werknemer in dienst, ook als die
 * niet meedoet. Alleen de bijdrage zelf loopt mee met de deelname.
 */
export function berekenKosten(input: KostenInput): KostenResult {
  const {
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
  } = input

  const part = participation / 100
  const participants = Math.max(employees * part, 0)

  const bijdrage =
    basis === 'pct'
      ? part * (pct / 100) * employees * avgSalary
      : part * fixedPm * 12 * employees

  const lasten = bijdrage * (lastenPct / 100)
  const eenmalig = afsluit * employees
  const vast = vastPp * employees
  const jaarVervolg = vast + bijdrage + lasten
  const jaar1 = eenmalig + jaarVervolg

  const brutoPP = participants > 0 ? bijdrage / participants : 0
  const nettoStorting = brutoPP * (1 - taxPct / 100)
  const teruggaaf = nettoStorting * (taxPct / 100)

  return {
    bijdrage,
    lasten,
    eenmalig,
    vast,
    jaar1,
    jaarVervolg,
    brutoPP,
    nettoStorting,
    teruggaaf,
    participants,
  }
}
