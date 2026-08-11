/** Bedragen in euro's, Nederlandse notatie. Niet-eindige waarden vallen terug op 0. */
export function eur(value: number, decimals = 0): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(Number.isFinite(value) ? value : 0)
}
