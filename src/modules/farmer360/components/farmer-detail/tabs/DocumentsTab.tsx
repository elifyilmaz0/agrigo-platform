import { useEffect, useId, useRef, useState } from 'react'
import { Download, Eye, FileSpreadsheet, FileText, X } from 'lucide-react'
import type { Farmer } from '../../../types/farmer.ts'
import {
  getDocumentsForFarmer,
  type DemoDocument,
} from '../../../data/documents.ts'
import EmptyState from '../../shared/EmptyState.tsx'
import StatusBadge from '../../shared/StatusBadge.tsx'
import { EMPTY_HELP_COPY } from '../../shared/explainabilityCopy.ts'
import { PreviewSkeleton } from '../../shared/SkeletonBlock.tsx'
import { useFarmerToast } from '../../shared/useFarmerToast.ts'

type DocumentsTabProps = {
  farmer: Farmer
  openDocumentId?: string | null
  onOpenDocumentHandled?: () => void
}

function buildDemoFileContent(document: DemoDocument, farmer: Farmer): string {
  if (document.kind === 'xlsx') {
    return [
      'Alan;Değer',
      `Çiftçi;${farmer.fullName}`,
      `Belge;${document.name}`,
      `Tarih;${document.date}`,
      `Durum;${document.status}`,
      `Özet;${document.summary}`,
      'Satır1;Demo veri A',
      'Satır2;Demo veri B',
    ].join('\n')
  }

  return [
    'AgriGO Farmer360 — Demo Belge',
    '==============================',
    `Çiftçi: ${farmer.fullName}`,
    `Kod: ${farmer.farmerCode}`,
    `Belge: ${document.name}`,
    `Tür: ${document.type}`,
    `Tarih: ${document.date}`,
    `Durum: ${document.status}`,
    '',
    document.summary,
    '',
    'Bu dosya yalnızca demo indirilebilir örnektir.',
  ].join('\n')
}

function downloadDemoDocument(document: DemoDocument, farmer: Farmer) {
  const content = buildDemoFileContent(document, farmer)
  const mime =
    document.kind === 'xlsx'
      ? 'text/csv;charset=utf-8'
      : 'text/plain;charset=utf-8'
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const anchor = window.document.createElement('a')
  const downloadName =
    document.kind === 'xlsx'
      ? document.name.replace(/\.xlsx$/i, '.csv')
      : document.name.replace(/\.pdf$/i, '.txt')

  anchor.href = url
  anchor.download = downloadName
  window.document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}

function DocumentPreviewModal({
  document,
  farmer,
  onClose,
  onDownload,
}: {
  document: DemoDocument
  farmer: Farmer
  onClose: () => void
  onDownload: () => void
}) {
  const titleId = useId()
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setReady(false)
    const timer = window.setTimeout(() => setReady(true), 220)
    return () => window.clearTimeout(timer)
  }, [document.id])

  useEffect(() => {
    const previousOverflow = globalThis.document.body.style.overflow
    globalThis.document.body.style.overflow = 'hidden'
    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus()
    }, 40)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      globalThis.document.body.style.overflow = previousOverflow
      window.clearTimeout(focusTimer)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 p-4 sm:p-6"
      role="presentation"
      onClick={onClose}
      style={{ animation: 'f360-fade-in 160ms ease-out' }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
        style={{ animation: 'f360-toast-in 180ms ease-out' }}
      >
        <div className="flex items-start justify-between gap-3 border-b border-gray-100 px-4 py-3">
          <div className="min-w-0">
            <h3 id={titleId} className="truncate text-sm font-semibold text-gray-900">
              {document.name}
            </h3>
            <p className="mt-0.5 truncate text-[11px] text-gray-500">
              {document.type} · {document.date} · {farmer.fullName}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="f360-focus shrink-0 rounded-md border border-gray-200 p-1.5 text-gray-500 hover:bg-gray-50"
            aria-label="Belge önizlemesini kapat"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto scroll-smooth px-4 py-4">
          {!ready ? (
            <PreviewSkeleton />
          ) : (
            <>
              <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center">
                {document.kind === 'xlsx' ? (
                  <FileSpreadsheet
                    className="mx-auto h-10 w-10 text-emerald-700"
                    aria-hidden="true"
                  />
                ) : (
                  <FileText className="mx-auto h-10 w-10 text-emerald-700" aria-hidden="true" />
                )}
                <p className="mt-3 text-sm font-semibold text-gray-900">
                  Demo belge önizlemesi
                </p>
                <p className="mt-1 text-xs leading-relaxed text-gray-500">
                  Gerçek dosya yok; bu ekran demo amaçlı önizleme durumudur.
                </p>
              </div>

              <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-[11px] font-medium text-gray-500">Durum</dt>
                  <dd className="mt-0.5">
                    <StatusBadge label={document.status} />
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-medium text-gray-500">Tür</dt>
                  <dd className="mt-0.5 text-sm font-semibold text-gray-900">
                    {document.type}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[11px] font-medium text-gray-500">Özet</dt>
                  <dd className="mt-0.5 text-sm leading-relaxed text-gray-700">
                    {document.summary}
                  </dd>
                </div>
              </dl>
            </>
          )}
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-gray-100 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="f360-focus rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
          >
            Kapat
          </button>
          <button
            type="button"
            onClick={onDownload}
            className="f360-focus inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 hover:bg-emerald-100"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            İndir
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DocumentsTab({
  farmer,
  openDocumentId = null,
  onOpenDocumentHandled,
}: DocumentsTabProps) {
  const documents = getDocumentsForFarmer(farmer.id, farmer.productionType)
  const [previewDocument, setPreviewDocument] = useState<DemoDocument | null>(null)
  const { showToast } = useFarmerToast()

  useEffect(() => {
    if (!openDocumentId) {
      return
    }

    const currentDocuments = getDocumentsForFarmer(farmer.id, farmer.productionType)
    const match =
      openDocumentId === 'auto'
        ? (currentDocuments[0] ?? null)
        : (currentDocuments.find((document) => document.id === openDocumentId) ??
          currentDocuments[0] ??
          null)

    if (match) {
      setPreviewDocument(match)
    }

    onOpenDocumentHandled?.()
  }, [openDocumentId, farmer.id, farmer.productionType, onOpenDocumentHandled])

  return (
    <>
      {documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Belge bulunmuyor"
          description={EMPTY_HELP_COPY.documents}
        />
      ) : (
        <ul className="space-y-3">
          {documents.map((document) => {
            const Icon = document.kind === 'xlsx' ? FileSpreadsheet : FileText

            return (
              <li key={`${farmer.id}-${document.id}`} id={`document-item-${document.id}`}>
                <article className="f360-card-interactive flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 hover:border-gray-300 hover:shadow-sm">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-gray-50">
                      <Icon className="h-4 w-4 text-emerald-800" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <p className="break-words text-sm font-semibold text-gray-900">
                        {document.name}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-500">
                        <span>{document.type}</span>
                        <span aria-hidden="true">·</span>
                        <span>{document.date}</span>
                        <StatusBadge label={document.status} />
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewDocument(document)}
                      className="f360-focus inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-xs font-medium text-emerald-800 transition-colors hover:bg-emerald-100"
                    >
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      Görüntüle
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        downloadDemoDocument(document, farmer)
                        showToast('Belge indirme başlatıldı')
                      }}
                      className="f360-focus inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50"
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden="true" />
                      İndir
                    </button>
                  </div>
                </article>
              </li>
            )
          })}
        </ul>
      )}

      {previewDocument && (
        <DocumentPreviewModal
          document={previewDocument}
          farmer={farmer}
          onClose={() => setPreviewDocument(null)}
          onDownload={() => downloadDemoDocument(previewDocument, farmer)}
        />
      )}
    </>
  )
}
