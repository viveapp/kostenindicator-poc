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
      className="border-line flex items-center overflow-hidden rounded-lg border bg-white"
      style={{ width }}
    >
      {prefix && <span className="text-sub pl-3 text-sm">{prefix}</span>}
      <input
        type="number"
        aria-label={label}
        value={value}
        step={step}
        min={min}
        max={max}
        onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
        className="text-ink tnum w-full px-2 py-2 text-right text-sm outline-none"
      />
      {suffix && <span className="text-sub pr-3 text-sm">{suffix}</span>}
    </div>
  )
}

export function Row({
  label,
  hint,
  children,
}: {
  label: ReactNode
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div>
        <div className="text-ink text-sm font-medium">{label}</div>
        {hint && <div className="text-sub mt-0.5 text-xs">{hint}</div>}
      </div>
      {children}
    </div>
  )
}

/** Genummerde stap in de invoerkolom. */
export function StepTag({ n }: { n: number }) {
  return (
    <span
      aria-hidden
      className="bg-petrol mr-2 inline-flex size-[22px] shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
    >
      {n}
    </span>
  )
}
