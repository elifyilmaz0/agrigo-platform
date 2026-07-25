import type { ReactNode } from 'react'
import {
  Bell,
  Building2,
  CalendarDays,
  ClipboardList,
  Clock,
  Globe,
  House,
  Languages,
  MapPin,
  Phone,
  Radio,
  RefreshCw,
  Tag,
} from 'lucide-react'
import type { Farmer } from '../../types/farmer.ts'
import { TOOLTIP_COPY } from '../shared/explainabilityCopy.ts'
import StatusBadge from '../shared/StatusBadge.tsx'

type FarmerProfileHeaderProps = {
  farmer: Farmer
  notificationCount?: number
  operationCount?: number
  onOpenNotifications?: () => void
  onOpenOperations?: () => void
}

function getInitials(fullName: string) {
  return fullName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, '')

  if (digits.length < 10) {
    return phone
  }

  return `+90 5•• ••• ${digits.slice(-4, -2)} ${digits.slice(-2)}`
}

function ProductionTypeBadge({ productionType }: { productionType: Farmer['productionType'] }) {
  const styles: Record<Farmer['productionType'], string> = {
    Bitkisel: 'border-green-200 bg-green-50 text-green-700',
    Hayvansal: 'border-blue-200 bg-blue-50 text-blue-700',
    Arıcılık: 'border-amber-200 bg-amber-50 text-amber-700',
    Karma: 'border-purple-200 bg-purple-50 text-purple-700',
  }

  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md border px-2 py-0.5 text-xs font-medium leading-none ${styles[productionType]}`}
    >
      {productionType}
    </span>
  )
}

type InfoFieldProps = {
  icon: ReactNode
  label: string
  value: string
}

function InfoField({ icon, label, value }: InfoFieldProps) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="mt-0.5 shrink-0 text-gray-400">{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
          {label}
        </p>
        <p className="mt-0.5 break-words text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  )
}

export default function FarmerProfileHeader({
  farmer,
  notificationCount = 0,
  operationCount = 0,
  onOpenNotifications,
  onOpenOperations,
}: FarmerProfileHeaderProps) {
  const infoFields: InfoFieldProps[] = [
    {
      icon: <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />,
      label: 'Telefon',
      value: maskPhone(farmer.phone),
    },
    {
      icon: <Globe className="h-4 w-4 shrink-0" aria-hidden="true" />,
      label: 'Ülke',
      value: farmer.country,
    },
    {
      icon: <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />,
      label: 'İl / İlçe',
      value: `${farmer.province} / ${farmer.district}`,
    },
    {
      icon: <House className="h-4 w-4 shrink-0" aria-hidden="true" />,
      label: 'Köy / Mahalle',
      value: farmer.village,
    },
    {
      icon: <Tag className="h-4 w-4 shrink-0" aria-hidden="true" />,
      label: 'Kullanıcı Tipi',
      value: farmer.userType,
    },
    {
      icon: <Languages className="h-4 w-4 shrink-0" aria-hidden="true" />,
      label: 'Tercih Edilen Dil',
      value: farmer.preferredLanguage,
    },
    {
      icon: <Radio className="h-4 w-4 shrink-0" aria-hidden="true" />,
      label: 'Tercih Edilen Kanal',
      value: farmer.preferredChannel,
    },
    {
      icon: <Building2 className="h-4 w-4 shrink-0" aria-hidden="true" />,
      label: 'CRM Kaynağı',
      value: farmer.crmSource,
    },
    {
      icon: <CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />,
      label: 'Kayıt Tarihi',
      value: farmer.registrationDate,
    },
    {
      icon: <RefreshCw className="h-4 w-4 shrink-0" aria-hidden="true" />,
      label: 'Son Güncelleme',
      value: farmer.lastUpdated,
    },
    {
      icon: <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />,
      label: 'Son Etkileşim',
      value: farmer.lastInteraction,
    },
  ]

  return (
    <section className="min-w-0 rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6 md:p-8">
      <div className="flex flex-wrap items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-lg font-semibold text-white">
          {getInitials(farmer.fullName)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h2 className="break-words text-xl font-semibold text-gray-900">
                {farmer.fullName}
              </h2>
              <StatusBadge label={farmer.status} className="text-xs" />
              <ProductionTypeBadge productionType={farmer.productionType} />
              <span className="shrink-0 text-sm font-medium text-gray-500">
                {farmer.farmerCode}
              </span>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={onOpenNotifications}
                aria-label={
                  notificationCount > 0
                    ? `Bildirimleri aç, ${notificationCount} bildirim`
                    : 'Bildirimleri aç'
                }
                title={TOOLTIP_COPY.notifications}
                className="f360-focus relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-100"
              >
                <Bell className="h-4 w-4" aria-hidden="true" />
                {notificationCount > 0 && (
                  <span
                    className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500 px-1 text-[10px] font-semibold text-white"
                    aria-hidden="true"
                  >
                    {notificationCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={onOpenOperations}
                aria-label={
                  operationCount > 0
                    ? `Operasyon merkezini aç, ${operationCount} bekleyen işlem`
                    : 'Operasyon merkezini aç'
                }
                title={TOOLTIP_COPY.operationsCenter}
                className="f360-focus relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-100"
              >
                <ClipboardList className="h-4 w-4" aria-hidden="true" />
                {operationCount > 0 && (
                  <span
                    className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-semibold text-white"
                    aria-hidden="true"
                  >
                    {operationCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {infoFields.map((field) => (
          <InfoField key={field.label} {...field} />
        ))}
      </div>
    </section>
  )
}
