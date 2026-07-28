type ProfileSectionCardProps = {
  title: string
  description?: string
  actions?: React.ReactNode
  children: React.ReactNode
  footnote?: string
}

export default function ProfileSectionCard({
  title,
  description,
  actions,
  children,
  footnote,
}: ProfileSectionCardProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          {description ? (
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        ) : null}
      </div>
      <div className="mt-5">{children}</div>
      {footnote ? (
        <p className="mt-4 border-t border-slate-100 pt-3 text-[11px] leading-relaxed text-slate-500">
          {footnote}
        </p>
      ) : null}
    </section>
  )
}
