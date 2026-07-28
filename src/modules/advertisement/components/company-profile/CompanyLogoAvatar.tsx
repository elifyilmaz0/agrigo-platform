type CompanyLogoAvatarProps = {
  name: string
  initials: string
  logoUrl?: string | null
  size?: 'md' | 'lg'
}

const sizeClasses = {
  md: 'h-14 w-14 text-sm',
  lg: 'h-16 w-16 text-base',
}

export default function CompanyLogoAvatar({
  name,
  initials,
  logoUrl,
  size = 'lg',
}: CompanyLogoAvatarProps) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={`${name} logosu`}
        className={`${sizeClasses[size]} rounded-xl border border-slate-200 object-cover shadow-sm`}
      />
    )
  }

  return (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100 font-semibold text-emerald-800 shadow-sm`}
      aria-hidden
    >
      {initials}
    </div>
  )
}
