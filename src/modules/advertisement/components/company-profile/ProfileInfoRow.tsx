type ProfileInfoRowProps = {
  label: string
  value: React.ReactNode
}

export default function ProfileInfoRow({ label, value }: ProfileInfoRowProps) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <dt className="shrink-0 text-xs font-medium text-slate-500">{label}</dt>
      <dd className="min-w-0 text-sm font-medium text-slate-900 sm:text-right">
        {value}
      </dd>
    </div>
  )
}
