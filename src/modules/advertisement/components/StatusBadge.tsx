import type { CampaignStatus } from '../types/advertisement.ts'
import {
  campaignStatusBadgeStyles,
  campaignStatusLabels,
} from '../utils/formatters.ts'

type StatusBadgeProps = {
  status: CampaignStatus
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${campaignStatusBadgeStyles[status]}`}
    >
      {campaignStatusLabels[status]}
    </span>
  )
}
