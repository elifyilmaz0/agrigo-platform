import { AlertTriangle, Bell, Bot, FileText } from 'lucide-react'
import type { Farmer, FarmerNotification } from '../../../types/farmer.ts'
import { getFarmerNotifications } from '../../../utils/getFarmerNotifications.ts'
import { formatRelativeTime } from '../../../utils/formatTimelineDate.ts'
import EmptyState from '../../shared/EmptyState.tsx'
import InfoTooltip from '../../shared/InfoTooltip.tsx'
import {
  EMPTY_HELP_COPY,
  TOOLTIP_COPY,
} from '../../shared/explainabilityCopy.ts'
import SideDrawer from './SideDrawer.tsx'

type NotificationsDrawerProps = {
  open: boolean
  farmer: Farmer
  onClose: () => void
  onSelectNotification: (notification: FarmerNotification) => void
}

const typeVisual = {
  warning: {
    Icon: AlertTriangle,
    surface: 'bg-amber-50 text-amber-700',
  },
  ai: {
    Icon: Bot,
    surface: 'bg-violet-50 text-violet-700',
  },
  document: {
    Icon: FileText,
    surface: 'bg-sky-50 text-sky-700',
  },
} as const

export default function NotificationsDrawer({
  open,
  farmer,
  onClose,
  onSelectNotification,
}: NotificationsDrawerProps) {
  const notifications = getFarmerNotifications(farmer)

  return (
    <SideDrawer
      open={open}
      title="Bildirimler"
      subtitle="Önemli profil olayları"
      icon={Bell}
      onClose={onClose}
    >
      <div className="mb-3 flex items-start gap-1.5">
        <InfoTooltip
          label="Bildirimler hakkında bilgi"
          text={TOOLTIP_COPY.notifications}
        />
        <p className="text-[11px] leading-relaxed text-gray-500">
          Sigorta, AI sinyali ve belge olayları burada görünür.
        </p>
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Bildirim bulunmuyor"
          description={EMPTY_HELP_COPY.notifications}
        />
      ) : (
        <ul className="space-y-3">
          {notifications.map((notification) => {
            const visual = typeVisual[notification.type]
            const Icon = visual.Icon

            return (
              <li key={notification.id}>
                <button
                  type="button"
                  onClick={() => onSelectNotification(notification)}
                  className="f360-focus f360-card-interactive flex w-full min-w-0 items-start gap-3 rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-left hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm"
                >
                  <span
                    className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${visual.surface}`}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold leading-snug text-gray-900">
                      {notification.title}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-gray-500">
                      {notification.description}
                    </span>
                    <span className="mt-2 block text-[11px] text-gray-400">
                      {formatRelativeTime(notification.occurredAt)}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </SideDrawer>
  )
}
