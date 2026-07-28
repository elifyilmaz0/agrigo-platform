import { useEffect, useState } from 'react'

type ToastState = {
  message: string
  visible: boolean
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    visible: false,
  })

  useEffect(() => {
    if (!toast.visible) return
    const timer = window.setTimeout(() => {
      setToast((current) => ({ ...current, visible: false }))
    }, 2600)
    return () => window.clearTimeout(timer)
  }, [toast])

  function showToast(message: string) {
    setToast({ message, visible: true })
  }

  const toastNode = toast.visible ? (
    <div className="fixed right-4 bottom-4 z-50 rounded-md border border-emerald-200 bg-white px-4 py-3 text-sm font-medium text-emerald-800 shadow-md">
      {toast.message}
    </div>
  ) : null

  return { showToast, toastNode }
}
