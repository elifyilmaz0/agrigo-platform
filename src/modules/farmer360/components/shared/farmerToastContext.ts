import { createContext } from 'react'

export type ToastTone = 'success' | 'info'

export type FarmerToastContextValue = {
  showToast: (message: string, tone?: ToastTone) => void
}

export const FarmerToastContext = createContext<FarmerToastContextValue | null>(
  null,
)
