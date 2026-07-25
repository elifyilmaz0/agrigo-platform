type DisabledTabPanelProps = {
  title: string
}

export default function DisabledTabPanel({ title }: DisabledTabPanelProps) {
  return (
    <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/60 p-6 text-center">
      <p className="text-sm font-medium text-gray-700">{title} bilgisi henüz mevcut değil</p>
      <p className="mt-1 text-sm leading-relaxed text-gray-500">
        Bu bölüm için veri modeli henüz tanımlanmadı.
      </p>
    </div>
  )
}
