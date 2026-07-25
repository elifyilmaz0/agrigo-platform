import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { CheckCircle2, Info, X } from 'lucide-react'
import { FarmerToastContext, type ToastTone } from './farmerToastContext.ts'

type ToastItemState = {
  id: string
  message: string
  tone: ToastTone
}

export function FarmerToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItemState[]>([])

  const showToast = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    setToasts((prev) => [...prev, { id, message, tone }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 2600)
  }, [])

  const value = useMemo(() => ({ showToast }), [showToast])

  return (
    <FarmerToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((toast) => {
          const Icon = toast.tone === 'success' ? CheckCircle2 : Info
          return (
            <div
              key={toast.id}
              role="status"
              className="pointer-events-auto flex items-start gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2.5 shadow-lg"
              style={{ animation: 'f360-toast-in 160ms ease-out' }}
            >
              <Icon
                className={`mt-0.5 h-4 w-4 shrink-0 ${
                  toast.tone === 'success' ? 'text-emerald-600' : 'text-sky-600'
                }`}
                aria-hidden="true"
              />
              <p className="min-w-0 flex-1 text-sm font-medium text-gray-800">
                {toast.message}
              </p>
              <button
                type="button"
                className="f360-focus rounded-md p-0.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                aria-label="Bildirimi kapat"
                onClick={() =>
                  setToasts((prev) => prev.filter((item) => item.id !== toast.id))
                }
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          )
        })}
      </div>
    </FarmerToastContext.Provider>
  )
}
