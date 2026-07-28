type PageHeaderProps = {
  title: string
  description?: string
  context?: string
  actions?: React.ReactNode
}

export default function PageHeader({
  title,
  description,
  context,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        {context ? (
          <p className="mb-1 text-xs font-medium text-emerald-700">{context}</p>
        ) : null}
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  )
}
