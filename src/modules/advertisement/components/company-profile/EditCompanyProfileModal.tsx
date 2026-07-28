import { useEffect, useId, useRef, useState } from 'react'
import {
  advertiserSectorOptions,
  getCompanyInitials,
} from '../../data/advertiserProfile.ts'
import type {
  AdvertiserCompanyDetails,
  AdvertiserCompanyEditableFields,
} from '../../types/advertiserProfile.ts'
import CompanyLogoAvatar from './CompanyLogoAvatar.tsx'

type EditCompanyProfileModalProps = {
  open: boolean
  company: AdvertiserCompanyDetails
  onCancel: () => void
  onSave: (values: AdvertiserCompanyEditableFields) => void
}

function toFormValues(
  company: AdvertiserCompanyDetails,
): AdvertiserCompanyEditableFields {
  return {
    name: company.name,
    sector: company.sector,
    description: company.description,
    website: company.website,
    logoUrl: company.logoUrl ?? '',
  }
}

export default function EditCompanyProfileModal({
  open,
  company,
  onCancel,
  onSave,
}: EditCompanyProfileModalProps) {
  const titleId = useId()
  const firstFieldRef = useRef<HTMLInputElement>(null)
  const [form, setForm] = useState<AdvertiserCompanyEditableFields>(() =>
    toFormValues(company),
  )
  const [errors, setErrors] = useState<Partial<Record<keyof AdvertiserCompanyEditableFields, string>>>(
    {},
  )

  useEffect(() => {
    if (!open) return
    setForm(toFormValues(company))
    setErrors({})
    window.requestAnimationFrame(() => firstFieldRef.current?.focus())
  }, [open, company])

  useEffect(() => {
    if (!open) return
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onCancel])

  if (!open) return null

  function updateField<K extends keyof AdvertiserCompanyEditableFields>(
    key: K,
    value: AdvertiserCompanyEditableFields[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => {
      if (!current[key]) return current
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  function validate(): boolean {
    const next: Partial<Record<keyof AdvertiserCompanyEditableFields, string>> =
      {}
    if (!form.name.trim()) next.name = 'Şirket adı zorunludur.'
    if (!form.sector.trim()) next.sector = 'Sektör seçilmelidir.'
    if (!form.description.trim()) {
      next.description = 'Şirket açıklaması zorunludur.'
    } else if (form.description.trim().length < 20) {
      next.description = 'Açıklama en az 20 karakter olmalıdır.'
    }
    if (!form.website.trim()) {
      next.website = 'Web sitesi zorunludur.'
    } else {
      try {
        const url = new URL(form.website.trim())
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
          next.website = 'Geçerli bir http veya https adresi girin.'
        }
      } catch {
        next.website = 'Geçerli bir web sitesi adresi girin.'
      }
    }
    if (form.logoUrl.trim()) {
      try {
        const url = new URL(form.logoUrl.trim())
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
          next.logoUrl = 'Logo URL’si http veya https olmalıdır.'
        }
      } catch {
        next.logoUrl = 'Geçerli bir logo URL’si girin veya boş bırakın.'
      }
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!validate()) return
    onSave({
      name: form.name.trim(),
      sector: form.sector.trim(),
      description: form.description.trim(),
      website: form.website.trim(),
      logoUrl: form.logoUrl.trim(),
    })
  }

  const previewInitials = getCompanyInitials(form.name || company.name)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-4 sm:items-center"
      role="presentation"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 id={titleId} className="text-sm font-semibold text-slate-900">
            Şirket Profilini Düzenle
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Reklam hesabınıza ait temel bilgileri güncelleyin.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
          noValidate
        >
          <div className="space-y-4 overflow-y-auto px-5 py-4">
            <div className="flex items-center gap-3 rounded-md border border-slate-100 bg-slate-50/70 px-3 py-3">
              <CompanyLogoAvatar
                name={form.name || company.name}
                initials={previewInitials}
                logoUrl={form.logoUrl || null}
                size="md"
              />
              <div>
                <p className="text-xs font-medium text-slate-800">Logo önizleme</p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  URL yoksa şirket baş harfleri gösterilir.
                </p>
              </div>
            </div>

            <Field
              id="company-name"
              label="Şirket Adı"
              error={errors.name}
            >
              <input
                ref={firstFieldRef}
                id="company-name"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                aria-invalid={Boolean(errors.name)}
                className={inputClass(errors.name)}
              />
            </Field>

            <Field id="company-sector" label="Sektör" error={errors.sector}>
              <select
                id="company-sector"
                value={form.sector}
                onChange={(e) => updateField('sector', e.target.value)}
                aria-invalid={Boolean(errors.sector)}
                className={inputClass(errors.sector)}
              >
                {!advertiserSectorOptions.includes(
                  form.sector as (typeof advertiserSectorOptions)[number],
                ) ? (
                  <option value={form.sector}>{form.sector}</option>
                ) : null}
                {advertiserSectorOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </Field>

            <Field
              id="company-description"
              label="Açıklama"
              error={errors.description}
            >
              <textarea
                id="company-description"
                rows={4}
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                aria-invalid={Boolean(errors.description)}
                className={`${inputClass(errors.description)} min-h-[96px] py-2`}
              />
            </Field>

            <Field
              id="company-website"
              label="Web Sitesi"
              error={errors.website}
            >
              <input
                id="company-website"
                type="url"
                value={form.website}
                onChange={(e) => updateField('website', e.target.value)}
                aria-invalid={Boolean(errors.website)}
                placeholder="https://"
                className={inputClass(errors.website)}
              />
            </Field>

            <Field
              id="company-logo"
              label="Logo URL"
              error={errors.logoUrl}
              help="Opsiyonel. Boş bırakılırsa baş harf avatarı kullanılır."
            >
              <input
                id="company-logo"
                type="url"
                value={form.logoUrl}
                onChange={(e) => updateField('logoUrl', e.target.value)}
                aria-invalid={Boolean(errors.logoUrl)}
                placeholder="https://..."
                className={inputClass(errors.logoUrl)}
              />
            </Field>
          </div>

          <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 px-5 py-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              İptal
            </button>
            <button
              type="submit"
              className="rounded-md bg-emerald-700 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-800"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({
  id,
  label,
  error,
  help,
  children,
}: {
  id: string
  label: string
  error?: string
  help?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-medium text-slate-700"
      >
        {label}
      </label>
      {children}
      {help ? (
        <p className="mt-1 text-[11px] text-slate-500">{help}</p>
      ) : null}
      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}
    </div>
  )
}

function inputClass(error?: string) {
  return [
    'h-9 w-full rounded-md border px-3 text-sm outline-none focus:border-emerald-400',
    error ? 'border-rose-300' : 'border-slate-200',
  ].join(' ')
}
