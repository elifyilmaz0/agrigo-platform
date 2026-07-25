import { useContext } from 'react'
import { FarmerToastContext } from './farmerToastContext.ts'

export function useFarmerToast() {
  const context = useContext(FarmerToastContext)
  if (!context) {
    throw new Error('useFarmerToast must be used within FarmerToastProvider')
  }
  return context
}
