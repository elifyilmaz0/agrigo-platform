import { useEffect } from 'react'
import {
  createAllDeliveryDays,
  createWeekdayDeliveryDays,
  createWeekendDeliveryDays,
  deliveryDayOptions,
  formatSelectedDeliveryDays,
  type DeliveryDayKey,
} from '../campaignDeliveryDays.ts'
import type {
  BulkSendMode,
  CampaignDraft,
  DeliveryWindowMode,
  ScheduleDraft,
  ScheduleEndMode,
  ScheduleStartMode,
} from '../campaignDraft.ts'
import { getCampaignTypeLabel } from '../campaignTypes.ts'
import {
  formatScheduleDateTime,
} from '../scheduleDateHelpers.ts'
import { getTimezoneLabel, timezoneOptions } from '../timezoneOptions.ts'

type ScheduleStepProps = {
  draft: CampaignDraft
  errors: Record<string, string>
  onChange: (patch: Partial<CampaignDraft>) => void
}

export default function ScheduleStep({
  draft,
  errors,
  onChange,
}: ScheduleStepProps) {
  const schedule = draft.schedule
  const isBulk = draft.campaignType === 'bulk'
  const isNative = draft.campaignType === 'native'

  useEffect(() => {
    if (isBulk && schedule.endMode === 'no-end-date') {
      onChange({
        schedule: { ...draft.schedule, endMode: 'scheduled' },
      })
    }
    // Only coerce when bulk + no-end-date; avoid looping on full schedule object.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional narrow deps
  }, [isBulk, schedule.endMode])

  function updateSchedule(patch: Partial<ScheduleDraft>) {
    onChange({ schedule: { ...schedule, ...patch } })
  }

  function setStartMode(startMode: ScheduleStartMode) {
    updateSchedule({ startMode })
  }

  function setEndMode(endMode: ScheduleEndMode) {
    if (isBulk && endMode === 'no-end-date') return
    updateSchedule({ endMode })
  }

  function setDeliveryWindowMode(mode: DeliveryWindowMode) {
    updateSchedule({
      deliveryWindow: {
        ...schedule.deliveryWindow,
        mode,
        ...(mode === 'all-day'
          ? { startTime: '00:00', endTime: '23:59' }
          : {}),
      },
    })
  }

  function setBulkSendMode(bulkSendMode: BulkSendMode) {
    updateSchedule({
      bulkSendMode,
      ...(bulkSendMode === 'delivery-window'
        ? { endMode: 'scheduled' as const }
        : {}),
    })
  }

  function toggleDay(key: DeliveryDayKey) {
    updateSchedule({
      deliveryDays: {
        ...schedule.deliveryDays,
        [key]: !schedule.deliveryDays[key],
      },
    })
  }

  const deliveryWindowLabel =
    schedule.deliveryWindow.mode === 'all-day'
      ? '00:00–23:59'
      : schedule.deliveryWindow.startTime && schedule.deliveryWindow.endTime
        ? `${schedule.deliveryWindow.startTime}–${schedule.deliveryWindow.endTime}`
        : 'Henüz belirlenmedi'

  const startSummary =
    schedule.startMode === 'now'
      ? 'Hemen başlat'
      : formatScheduleDateTime(schedule.startDate, schedule.startTime)

  const endSummary =
    schedule.endMode === 'no-end-date'
      ? 'Bitiş tarihi yok'
      : formatScheduleDateTime(schedule.endDate, schedule.endTime)

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
      <div className="space-y-4">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Kampanya Başlangıcı
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Kampanyanın ne zaman başlayacağını planlayın.
            </p>
          </div>

          <div
            role="radiogroup"
            aria-labelledby="schedule-start-mode-label"
            className="grid gap-2 sm:grid-cols-2"
          >
            <span id="schedule-start-mode-label" className="sr-only">
              Başlangıç modu
            </span>
            <ModeOption
              id="wiz-schedule-startMode-now"
              name="schedule-start-mode"
              checked={schedule.startMode === 'now'}
              label="Hemen Başlat"
              onChange={() => setStartMode('now')}
            />
            <ModeOption
              id="wiz-schedule-startMode"
              name="schedule-start-mode"
              checked={schedule.startMode === 'scheduled'}
              label="Tarih ve Saat Planla"
              onChange={() => setStartMode('scheduled')}
            />
          </div>

          {schedule.startMode === 'now' ? (
            <p className="mt-3 rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600">
              Kampanya, yayın simülasyonu tamamlandıktan sonra mümkün olan ilk
              zamanda başlatılacak şekilde ayarlanır.
            </p>
          ) : (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field
                id="wiz-schedule-startDate"
                label="Başlangıç Tarihi"
                error={errors['schedule-startDate']}
              >
                <input
                  id="wiz-schedule-startDate"
                  type="date"
                  value={schedule.startDate}
                  aria-invalid={Boolean(errors['schedule-startDate'])}
                  aria-describedby={
                    errors['schedule-startDate']
                      ? 'err-schedule-startDate'
                      : undefined
                  }
                  onChange={(e) =>
                    updateSchedule({ startDate: e.target.value })
                  }
                  className={inputClass(errors['schedule-startDate'])}
                />
              </Field>
              <Field
                id="wiz-schedule-startTime"
                label="Başlangıç Saati"
                error={errors['schedule-startTime']}
              >
                <input
                  id="wiz-schedule-startTime"
                  type="time"
                  value={schedule.startTime}
                  aria-invalid={Boolean(errors['schedule-startTime'])}
                  aria-describedby={
                    errors['schedule-startTime']
                      ? 'err-schedule-startTime'
                      : undefined
                  }
                  onChange={(e) =>
                    updateSchedule({ startTime: e.target.value })
                  }
                  className={inputClass(errors['schedule-startTime'])}
                />
              </Field>
            </div>
          )}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Kampanya Bitişi
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Kampanyanın ne zaman sonlanacağını belirleyin.
            </p>
          </div>

          <div
            role="radiogroup"
            aria-labelledby="schedule-end-mode-label"
            aria-describedby={
              errors['schedule-endMode'] ? 'err-schedule-endMode' : undefined
            }
            className="grid gap-2 sm:grid-cols-2"
          >
            <span id="schedule-end-mode-label" className="sr-only">
              Bitiş modu
            </span>
            {!isBulk ? (
              <ModeOption
                id="wiz-schedule-endMode-none"
                name="schedule-end-mode"
                checked={schedule.endMode === 'no-end-date'}
                label="Bitiş Tarihi Yok"
                onChange={() => setEndMode('no-end-date')}
              />
            ) : (
              <div
                className="rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-2.5 opacity-70"
                title="Toplu kampanyalar için bitiş tarihi gereklidir"
              >
                <p className="text-sm font-medium text-slate-500">
                  Bitiş Tarihi Yok
                </p>
                <p className="mt-0.5 text-[11px] text-slate-500">
                  Toplu kampanyalar için kullanılamaz.
                </p>
                <span id="wiz-schedule-endMode" className="sr-only">
                  Bitiş tarihi yok seçeneği toplu kampanyalarda devre dışı
                </span>
              </div>
            )}
            <ModeOption
              id="wiz-schedule-endMode"
              name="schedule-end-mode"
              checked={schedule.endMode === 'scheduled'}
              label="Tarih ve Saat Belirle"
              onChange={() => setEndMode('scheduled')}
            />
          </div>
          {errors['schedule-endMode'] ? (
            <p id="err-schedule-endMode" className="mt-2 text-xs text-rose-600">
              {errors['schedule-endMode']}
            </p>
          ) : null}

          {schedule.endMode === 'no-end-date' && !isBulk ? (
            <p className="mt-3 rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-600">
              Kampanya manuel olarak durdurulana kadar aktif kalacak şekilde
              planlanır.
            </p>
          ) : null}

          {schedule.endMode === 'scheduled' ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field
                id="wiz-schedule-endDate"
                label="Bitiş Tarihi"
                error={errors['schedule-endDate']}
              >
                <input
                  id="wiz-schedule-endDate"
                  type="date"
                  value={schedule.endDate}
                  aria-invalid={Boolean(errors['schedule-endDate'])}
                  aria-describedby={
                    errors['schedule-endDate']
                      ? 'err-schedule-endDate'
                      : undefined
                  }
                  onChange={(e) => updateSchedule({ endDate: e.target.value })}
                  className={inputClass(errors['schedule-endDate'])}
                />
              </Field>
              <Field
                id="wiz-schedule-endTime"
                label="Bitiş Saati"
                error={errors['schedule-endTime']}
              >
                <input
                  id="wiz-schedule-endTime"
                  type="time"
                  value={schedule.endTime}
                  aria-invalid={Boolean(errors['schedule-endTime'])}
                  aria-describedby={
                    errors['schedule-endTime']
                      ? 'err-schedule-endTime'
                      : undefined
                  }
                  onChange={(e) => updateSchedule({ endTime: e.target.value })}
                  className={inputClass(errors['schedule-endTime'])}
                />
              </Field>
            </div>
          ) : null}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <Field
            id="wiz-schedule-timezone"
            label="Saat Dilimi"
            error={errors['schedule-timezone']}
            help="Tarih ve saatler seçilen saat dilimine göre uygulanır."
          >
            <select
              id="wiz-schedule-timezone"
              value={schedule.timezone}
              aria-invalid={Boolean(errors['schedule-timezone'])}
              aria-describedby={
                errors['schedule-timezone']
                  ? 'err-schedule-timezone schedule-tz-help'
                  : 'schedule-tz-help'
              }
              onChange={(e) => updateSchedule({ timezone: e.target.value })}
              className={inputClass(errors['schedule-timezone'])}
            >
              {timezoneOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </Field>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Günlük Gösterim ve Teslimat Penceresi
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Reklamın gün içinde hangi saatlerde gösterileceğini belirleyin.
            </p>
          </div>

          <div
            role="radiogroup"
            aria-label="Teslimat penceresi"
            className="grid gap-2 sm:grid-cols-2"
          >
            <ModeOption
              id="wiz-schedule-deliveryWindow"
              name="delivery-window-mode"
              checked={schedule.deliveryWindow.mode === 'all-day'}
              label="Gün Boyunca"
              onChange={() => setDeliveryWindowMode('all-day')}
            />
            <ModeOption
              id="wiz-schedule-deliveryWindow-custom"
              name="delivery-window-mode"
              checked={schedule.deliveryWindow.mode === 'custom'}
              label="Belirli Saatlerde"
              onChange={() => setDeliveryWindowMode('custom')}
            />
          </div>

          {schedule.deliveryWindow.mode === 'custom' ? (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field
                id="wiz-schedule-deliveryWindow-startTime"
                label="Başlangıç Saati"
                error={errors['schedule-deliveryWindow-startTime']}
              >
                <input
                  id="wiz-schedule-deliveryWindow-startTime"
                  type="time"
                  value={schedule.deliveryWindow.startTime}
                  aria-invalid={Boolean(
                    errors['schedule-deliveryWindow-startTime'],
                  )}
                  aria-describedby={
                    errors['schedule-deliveryWindow-startTime']
                      ? 'err-schedule-deliveryWindow-startTime'
                      : undefined
                  }
                  onChange={(e) =>
                    updateSchedule({
                      deliveryWindow: {
                        ...schedule.deliveryWindow,
                        startTime: e.target.value,
                      },
                    })
                  }
                  className={inputClass(
                    errors['schedule-deliveryWindow-startTime'],
                  )}
                />
              </Field>
              <Field
                id="wiz-schedule-deliveryWindow-endTime"
                label="Bitiş Saati"
                error={errors['schedule-deliveryWindow-endTime']}
              >
                <input
                  id="wiz-schedule-deliveryWindow-endTime"
                  type="time"
                  value={schedule.deliveryWindow.endTime}
                  aria-invalid={Boolean(
                    errors['schedule-deliveryWindow-endTime'],
                  )}
                  aria-describedby={
                    errors['schedule-deliveryWindow-endTime']
                      ? 'err-schedule-deliveryWindow-endTime'
                      : undefined
                  }
                  onChange={(e) =>
                    updateSchedule({
                      deliveryWindow: {
                        ...schedule.deliveryWindow,
                        endTime: e.target.value,
                      },
                    })
                  }
                  className={inputClass(
                    errors['schedule-deliveryWindow-endTime'],
                  )}
                />
              </Field>
            </div>
          ) : (
            <p className="mt-3 text-xs text-slate-500">
              Gösterim 00:00–23:59 aralığında planlanır.
            </p>
          )}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-3">
            <h2 className="text-sm font-semibold text-slate-900">Aktif Günler</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Kampanyanın aktif olacağı haftanın günlerini seçin.
            </p>
          </div>

          <div className="mb-3 flex flex-wrap gap-2">
            <QuickAction
              label="Tüm Günleri Seç"
              onClick={() =>
                updateSchedule({ deliveryDays: createAllDeliveryDays(true) })
              }
            />
            <QuickAction
              label="Hafta İçi"
              onClick={() =>
                updateSchedule({ deliveryDays: createWeekdayDeliveryDays() })
              }
            />
            <QuickAction
              label="Hafta Sonu"
              onClick={() =>
                updateSchedule({ deliveryDays: createWeekendDeliveryDays() })
              }
            />
            <QuickAction
              label="Temizle"
              onClick={() =>
                updateSchedule({ deliveryDays: createAllDeliveryDays(false) })
              }
            />
          </div>

          <div
            role="group"
            aria-labelledby="delivery-days-label"
            aria-describedby={
              errors['schedule-deliveryDays']
                ? 'err-schedule-deliveryDays'
                : undefined
            }
            className="flex flex-wrap gap-2"
          >
            <span id="delivery-days-label" className="sr-only">
              Aktif günler
            </span>
            <span id="wiz-schedule-deliveryDays" tabIndex={-1} className="sr-only" />
            {deliveryDayOptions.map((day) => {
              const selected = schedule.deliveryDays[day.key]
              return (
                <label
                  key={day.key}
                  className={[
                    'inline-flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-xs font-medium transition',
                    selected
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300',
                  ].join(' ')}
                >
                  <input
                    type="checkbox"
                    className="h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    checked={selected}
                    onChange={() => toggleDay(day.key)}
                    aria-checked={selected}
                  />
                  {day.label}
                </label>
              )
            })}
          </div>
          {errors['schedule-deliveryDays'] ? (
            <p
              id="err-schedule-deliveryDays"
              className="mt-2 text-xs text-rose-600"
            >
              {errors['schedule-deliveryDays']}
            </p>
          ) : null}
        </section>

        {isNative ? (
          <aside className="rounded-lg border border-sky-100 bg-sky-50/70 p-4">
            <h2 className="text-sm font-semibold text-sky-900">
              Native öneri yayın davranışı
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-sky-800">
              Native öneriler yalnızca çiftçinin sorusu, seçilen hedefleme
              kriterleri ve ürün bağlamı uygun olduğunda gösterilir. Planlanan
              tarih aralığı, kampanyanın gösterime uygun olduğu dönemi tanımlar.
            </p>
            <p className="mt-2 text-xs leading-relaxed text-sky-800">
              Teslimat penceresi dışında gelen uygun kullanıcı sorularında reklam
              önerisi gösterilmez.
            </p>
          </aside>
        ) : null}

        {isBulk ? (
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Gönderim Modeli
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Toplu mesajların nasıl dağıtılacağını seçin.
              </p>
            </div>

            <div
              role="radiogroup"
              aria-label="Gönderim modeli"
              className="grid gap-2 sm:grid-cols-2"
            >
              <ModeOption
                id="wiz-schedule-bulkSendMode"
                name="bulk-send-mode"
                checked={schedule.bulkSendMode === 'single-send'}
                label="Tek Seferlik Gönderim"
                description="Başlangıç tarih ve saati gönderim anı olarak kullanılır."
                onChange={() => setBulkSendMode('single-send')}
              />
              <ModeOption
                id="wiz-schedule-bulkSendMode-window"
                name="bulk-send-mode"
                checked={schedule.bulkSendMode === 'delivery-window'}
                label="Teslimat Penceresine Yay"
                description="Mesajlar seçilen tarih aralığı ve günlük saat penceresine dağıtılır."
                onChange={() => setBulkSendMode('delivery-window')}
              />
            </div>

            <p className="mt-3 rounded-md border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              Toplu mesaj gönderimleri yalnızca pazarlama izni bulunan uygun
              hedef kitleye teslim edilmelidir. Gerçek izin kontrolü bu
              prototipte uygulanmamaktadır.
            </p>
          </section>
        ) : null}
      </div>

      <aside
        aria-label="Planlama özeti"
        className="h-fit rounded-lg border border-slate-200 bg-white p-4 lg:sticky lg:top-4"
      >
        <h2 className="text-sm font-semibold text-slate-900">Planlama Özeti</h2>
        <dl className="mt-3 space-y-2.5 text-xs">
          <SummaryRow label="Başlangıç" value={startSummary} />
          <SummaryRow label="Bitiş" value={endSummary} />
          <SummaryRow
            label="Saat dilimi"
            value={getTimezoneLabel(schedule.timezone) || 'Henüz belirlenmedi'}
          />
          <SummaryRow
            label="Aktif günler"
            value={formatSelectedDeliveryDays(schedule.deliveryDays)}
          />
          <SummaryRow label="Günlük teslimat penceresi" value={deliveryWindowLabel} />
          <SummaryRow
            label="Kampanya tipi"
            value={
              draft.campaignType
                ? getCampaignTypeLabel(draft.campaignType)
                : 'Henüz belirlenmedi'
            }
          />
          {isBulk ? (
            <SummaryRow
              label="Bulk gönderim modeli"
              value={
                schedule.bulkSendMode === 'single-send'
                  ? 'Tek seferlik gönderim'
                  : 'Teslimat penceresine yay'
              }
            />
          ) : null}
        </dl>
      </aside>
    </div>
  )
}

function ModeOption({
  id,
  name,
  checked,
  label,
  description,
  onChange,
}: {
  id: string
  name: string
  checked: boolean
  label: string
  description?: string
  onChange: () => void
}) {
  return (
    <label
      htmlFor={id}
      className={[
        'cursor-pointer rounded-md border px-3 py-2.5 transition',
        checked
          ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500'
          : 'border-slate-200 bg-white hover:border-slate-300',
      ].join(' ')}
    >
      <input
        id={id}
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only"
      />
      <span
        className={[
          'block text-sm font-medium',
          checked ? 'text-emerald-900' : 'text-slate-800',
        ].join(' ')}
      >
        {label}
      </span>
      {description ? (
        <span className="mt-0.5 block text-[11px] text-slate-500">
          {description}
        </span>
      ) : null}
      {checked ? (
        <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
          Seçili
        </span>
      ) : null}
    </label>
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
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-slate-700">
        {label}
      </label>
      {children}
      {help ? (
        <p id="schedule-tz-help" className="mt-1 text-[11px] text-slate-500">
          {help}
        </p>
      ) : null}
      {error ? (
        <p id={`err-${id.replace('wiz-', '')}`} className="mt-1 text-xs text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  )
}

function QuickAction({
  label,
  onClick,
}: {
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-100"
    >
      {label}
    </button>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className="max-w-[58%] text-right font-medium text-slate-800">
        {value || 'Henüz belirlenmedi'}
      </dd>
    </div>
  )
}

function inputClass(error?: string) {
  return [
    'h-9 w-full rounded-md border px-3 text-sm outline-none focus:border-emerald-400',
    error ? 'border-rose-300' : 'border-slate-200',
  ].join(' ')
}
