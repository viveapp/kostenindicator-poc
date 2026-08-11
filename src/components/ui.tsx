import type { ReactNode } from 'react'

type NumProps = {
  value: number
  onChange: (value: number) => void
  /** Voorleesnaam; de zichtbare tekst staat in de omliggende Row. */
  label: string
  prefix?: string
  suffix?: string
  step?: number
  min?: number
  max?: number
  /** Vaste breedte in px, zodat de invoerkolom niet verspringt per veld. */
  width?: number
}

export function Num({
  value,
  onChange,
  label,
  prefix,
  suffix,
  step = 1,
  min = 0,
  max,
  width = 130,
}: NumProps) {
  return (
    <div
      className="border-grey-20 focus-within:border-ink flex min-w-0 items-center overflow-hidden rounded-full border bg-white transition-colors"
      // De breedte is een streefbreedte, geen ondergrens: op smalle schermen mag
      // het veld krimpen in plaats van de kaart uit te duwen.
      style={{ width, maxWidth: '100%' }}
    >
      {prefix && <span className="text-grey-60 pl-4 text-sm">{prefix}</span>}
      <input
        type="number"
        aria-label={label}
        value={value}
        step={step}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
        className="text-ink tnum w-full min-w-0 px-2 py-2 text-right text-sm font-medium outline-none"
      />
      {suffix && <span className="text-grey-60 pr-4 text-sm">{suffix}</span>}
    </div>
  )
}

export function Row({
  label,
  hint,
  step,
  children,
}: {
  label: string
  hint?: string
  /** Stapnummer; staat als cirkel naast het label in plaats van erin. */
  step?: number
  children: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      {/* De cirkel staat buiten de tekstkolom, zodat een lang label eronder
          doorloopt in plaats van om het nummer heen te vouwen. */}
      <div className="flex min-w-0 items-start gap-2">
        {step !== undefined && <StepTag n={step} />}
        <div className="min-w-0">
          <div className="text-ink text-sm font-medium">{label}</div>
          {hint && <div className="text-grey-60 mt-0.5 text-xs">{hint}</div>}
        </div>
      </div>
      {children}
    </div>
  )
}

/**
 * Genummerde stap. Een gevulde cirkel in de merkkleur oranje — het merk tekent
 * met cirkelvormen, en zwart op oranje is een combinatie die de brand guide
 * expliciet toestaat.
 */
export function StepTag({ n }: { n: number }) {
  return (
    <span
      aria-hidden
      className="bg-orange text-ink flex size-[22px] shrink-0 items-center justify-center rounded-full text-xs font-bold"
    >
      {n}
    </span>
  )
}

/**
 * Schuif met een gevuld spoor. Native range-inputs kleuren het doorlopen deel
 * niet, dus dat komt hier uit een gradient die op de waarde omslaat.
 */
export function Slider({
  value,
  onChange,
  label,
  min = 0,
  max = 100,
  step = 1,
}: {
  value: number
  onChange: (value: number) => void
  label: string
  min?: number
  max?: number
  step?: number
}) {
  const filled = ((value - min) / (max - min)) * 100

  return (
    <input
      type="range"
      aria-label={label}
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full"
      style={{
        background: `linear-gradient(to right, var(--color-orange) 0 ${filled}%, var(--color-grey-10) ${filled}% 100%)`,
      }}
    />
  )
}

/** Gevulde cirkel als legendamarkering, in de beeldtaal van het merk. */
export function Dot({ className }: { className: string }) {
  return <span aria-hidden className={`${className} mt-1 size-2.5 shrink-0 rounded-full`} />
}
