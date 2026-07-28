type ConfirmDialogProps = {
  open: boolean
  title: string
  description: string
  footnote?: string
  confirmLabel: string
  cancelLabel?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({
  open,
  title,
  description,
  footnote,
  confirmLabel,
  cancelLabel = 'Vazgeç',
  danger = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-lg"
      >
        <h3
          id="confirm-dialog-title"
          className="text-sm font-semibold text-slate-900"
        >
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {description}
        </p>
        {footnote ? (
          <p className="mt-2 text-xs leading-relaxed text-slate-500">{footnote}</p>
        ) : null}
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-md px-3 py-2 text-xs font-medium text-white ${
              danger
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-emerald-700 hover:bg-emerald-800'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
