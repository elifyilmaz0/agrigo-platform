type SkeletonBlockProps = {
  className?: string
}

export function SkeletonBlock({ className = '' }: SkeletonBlockProps) {
  return <div className={`f360-skeleton ${className}`} aria-hidden="true" />
}

export function DrawerContentSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Yükleniyor">
      <SkeletonBlock className="h-16 w-full rounded-xl" />
      <SkeletonBlock className="h-16 w-full rounded-xl" />
      <SkeletonBlock className="h-16 w-full rounded-xl" />
    </div>
  )
}

export function PreviewSkeleton() {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Önizleme yükleniyor">
      <SkeletonBlock className="mx-auto h-24 w-24 rounded-xl" />
      <SkeletonBlock className="mx-auto h-3 w-40" />
      <SkeletonBlock className="mx-auto h-3 w-56" />
      <div className="grid grid-cols-2 gap-3 pt-2">
        <SkeletonBlock className="h-12 rounded-lg" />
        <SkeletonBlock className="h-12 rounded-lg" />
      </div>
    </div>
  )
}
