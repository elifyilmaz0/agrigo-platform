import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { X, type LucideIcon } from 'lucide-react'
import { DrawerContentSkeleton } from '../../shared/SkeletonBlock.tsx'

type SideDrawerProps = {
  open: boolean
  title: string
  subtitle: string
  icon: LucideIcon
  onClose: () => void
  children: ReactNode
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute('disabled') && element.tabIndex !== -1)
}

export default function SideDrawer({
  open,
  title,
  subtitle,
  icon: Icon,
  onClose,
  children,
}: SideDrawerProps) {
  const [rendered, setRendered] = useState(open)
  const [visible, setVisible] = useState(open)
  const [contentReady, setContentReady] = useState(!open)
  const panelRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const titleId = useId()
  const subtitleId = useId()

  useEffect(() => {
    if (open) {
      setRendered(true)
      setContentReady(false)
      const frame = window.requestAnimationFrame(() => setVisible(true))
      const readyTimer = window.setTimeout(() => setContentReady(true), 180)
      return () => {
        window.cancelAnimationFrame(frame)
        window.clearTimeout(readyTimer)
      }
    }

    setVisible(false)
    setContentReady(true)
    const timer = window.setTimeout(() => setRendered(false), 180)
    return () => window.clearTimeout(timer)
  }, [open])

  useEffect(() => {
    if (!rendered || !visible) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus()
    }, 40)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !panelRef.current) {
        return
      }

      const focusable = getFocusableElements(panelRef.current)
      if (focusable.length === 0) {
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      const active = document.activeElement as HTMLElement | null

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [rendered, visible, onClose])

  if (!rendered) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        className="absolute inset-0 bg-gray-900/35"
        style={{
          animation: visible
            ? 'f360-fade-in 160ms ease-out'
            : 'f360-fade-out 160ms ease-in forwards',
        }}
        onClick={onClose}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={subtitleId}
        className="relative flex h-full w-full max-w-md flex-col border-l border-gray-200 bg-white shadow-xl xl:max-w-lg"
        style={{
          animation: visible
            ? 'f360-slide-in-right 180ms ease-out'
            : 'f360-slide-out-right 180ms ease-in forwards',
        }}
      >
        <header className="shrink-0 border-b border-gray-100 px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-700">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 id={titleId} className="text-base font-bold text-gray-900">
                  {title}
                </h2>
                <p id={subtitleId} className="mt-0.5 text-xs text-gray-500">
                  {subtitle}
                </p>
              </div>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="f360-focus rounded-md border border-gray-200 p-1.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
              aria-label={`${title} panelini kapat`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain scroll-smooth px-5 py-4">
          {contentReady ? children : <DrawerContentSkeleton />}
        </div>
      </aside>
    </div>
  )
}
