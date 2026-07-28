type CreativeFieldCounterProps = {
  current: number
  max: number
  id?: string
}

export default function CreativeFieldCounter({
  current,
  max,
  id,
}: CreativeFieldCounterProps) {
  const over = current > max
  return (
    <span
      id={id}
      className={`text-[11px] ${over ? 'text-red-600' : 'text-slate-400'}`}
      aria-live="polite"
    >
      {current}/{max}
    </span>
  )
}
