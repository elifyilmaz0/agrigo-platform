import {
  bidStrategyOptions,
  getBidStrategyLabel,
  type BidStrategyValue,
} from '../bidStrategies.ts'
import {
  budgetModelOptions,
  getBudgetModelLabel,
  MIN_DAILY_BUDGET,
  MIN_TOTAL_BUDGET,
  type BudgetModelValue,
} from '../budgetModels.ts'
import { calculateCampaignBudgetEstimates } from '../calculateCampaignBudgetEstimates.ts'
import type { BudgetDraft, CampaignDraft } from '../campaignDraft.ts'
import type { CampaignWizardStepId } from '../campaignWizardSteps.ts'
import { validateScheduleStep } from '../campaignWizardValidation.ts'
import {
  formatCurrency,
  formatNumber,
} from '../../../utils/formatters.ts'

type BudgetStepProps = {
  draft: CampaignDraft
  errors: Record<string, string>
  onChange: (patch: Partial<CampaignDraft>) => void
  onGoToStep: (stepId: CampaignWizardStepId) => void
}

export default function BudgetStep({
  draft,
  errors,
  onChange,
  onGoToStep,
}: BudgetStepProps) {
  const budget = draft.budget
  const audienceSize = draft.audience.estimatedSize
  const scheduleValid = validateScheduleStep(draft).valid
  const estimates = calculateCampaignBudgetEstimates({
    budget,
    schedule: draft.schedule,
    audienceEstimatedSize: audienceSize,
    campaignType: draft.campaignType,
  })

  const spendLimitInfo =
    budget.spendLimit != null &&
    budget.model === 'total' &&
    budget.totalBudget != null &&
    budget.spendLimit < budget.totalBudget
      ? 'Ek harcama limiti toplam bütçeden düşük olduğu için kampanya bu limite ulaştığında duracak şekilde simüle edilir.'
      : budget.spendLimit != null &&
          budget.model === 'daily' &&
          estimates.estimatedTotalSpend != null &&
          budget.spendLimit < estimates.estimatedTotalSpend
        ? 'Ek harcama limiti tahmini toplam harcamadan düşük olduğu için kampanya bu limite ulaştığında duracak şekilde simüle edilir.'
        : null

  function updateBudget(patch: Partial<BudgetDraft>) {
    onChange({ budget: { ...budget, ...patch } })
  }

  function setModel(model: BudgetModelValue) {
    updateBudget({
      model,
      ...(model === 'total'
        ? { dailyBudget: budget.dailyBudget }
        : { totalBudget: budget.totalBudget }),
    })
  }

  function setBidStrategy(bidStrategy: BidStrategyValue) {
    updateBudget({
      bidStrategy,
      ...(bidStrategy === 'automatic' ? { manualBid: null } : {}),
    })
  }

  function parseOptionalNumber(value: string): number | null {
    if (value === '') return null
    const parsed = Number(value)
    return Number.isNaN(parsed) ? null : parsed
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
      <div className="space-y-4">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-900">Bütçe Modeli</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Kampanya reklam harcamasının nasıl sınırlanacağını seçin.
            </p>
          </div>

          <div
            role="radiogroup"
            aria-labelledby="budget-model-label"
            aria-describedby={
              errors['budget-model'] ? 'err-budget-model' : undefined
            }
            className="grid gap-2 sm:grid-cols-2"
          >
            <span id="budget-model-label" className="sr-only">
              Bütçe modeli
            </span>
            <span id="wiz-budget-model" tabIndex={-1} className="sr-only" />
            {budgetModelOptions.map((option) => {
              const selected = budget.model === option.value
              return (
                <label
                  key={option.value}
                  htmlFor={`wiz-budget-model-${option.value}`}
                  className={[
                    'cursor-pointer rounded-md border px-3 py-3 transition',
                    selected
                      ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500'
                      : 'border-slate-200 bg-white hover:border-slate-300',
                  ].join(' ')}
                >
                  <input
                    id={`wiz-budget-model-${option.value}`}
                    type="radio"
                    name="budget-model"
                    checked={selected}
                    onChange={() => setModel(option.value)}
                    className="sr-only"
                  />
                  <span
                    className={[
                      'block text-sm font-medium',
                      selected ? 'text-emerald-900' : 'text-slate-800',
                    ].join(' ')}
                  >
                    {option.label}
                  </span>
                  <span className="mt-1 block text-[11px] text-slate-500">
                    {option.description}
                  </span>
                  {selected ? (
                    <span className="mt-1.5 block text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                      Seçili
                    </span>
                  ) : null}
                </label>
              )
            })}
          </div>
          {errors['budget-model'] ? (
            <p id="err-budget-model" className="mt-2 text-xs text-rose-600">
              {errors['budget-model']}
            </p>
          ) : null}
        </section>

        <aside className="rounded-lg border border-sky-100 bg-sky-50/70 p-4">
          <p className="text-xs leading-relaxed text-sky-900">
            Kampanya teklifi, ürünün kullanıcıya sunulan fiyat avantajıdır. Reklam
            bütçesi ise kampanyanın gösterimi ve teslimatı için ayrılan
            harcamadır.
          </p>
        </aside>

        {budget.model === 'total' ? (
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <Field
              id="wiz-budget-totalBudget"
              label="Toplam Kampanya Bütçesi"
              error={errors['budget-totalBudget']}
              help="Bu tutar kampanya süresi boyunca kullanılabilecek maksimum mock reklam harcamasıdır."
            >
              <div className="relative">
                <input
                  id="wiz-budget-totalBudget"
                  type="number"
                  min={0}
                  step="1"
                  value={budget.totalBudget ?? ''}
                  aria-invalid={Boolean(errors['budget-totalBudget'])}
                  aria-describedby={
                    errors['budget-totalBudget']
                      ? 'err-budget-totalBudget budget-totalBudget-help'
                      : 'budget-totalBudget-help'
                  }
                  onChange={(e) =>
                    updateBudget({
                      totalBudget: parseOptionalNumber(e.target.value),
                    })
                  }
                  className={inputClass(errors['budget-totalBudget'])}
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-500">
                  ₺
                </span>
              </div>
            </Field>
            <p className="mt-1 text-[11px] text-slate-500">
              Minimum: {MIN_TOTAL_BUDGET.toLocaleString('tr-TR')} ₺
            </p>
          </section>
        ) : null}

        {budget.model === 'daily' ? (
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <Field
              id="wiz-budget-dailyBudget"
              label="Günlük Bütçe"
              error={errors['budget-dailyBudget']}
              help="Her aktif gün için yaklaşık maksimum reklam harcamasıdır."
            >
              <div className="relative">
                <input
                  id="wiz-budget-dailyBudget"
                  type="number"
                  min={0}
                  step="1"
                  value={budget.dailyBudget ?? ''}
                  aria-invalid={Boolean(errors['budget-dailyBudget'])}
                  aria-describedby={
                    errors['budget-dailyBudget']
                      ? 'err-budget-dailyBudget budget-dailyBudget-help'
                      : 'budget-dailyBudget-help'
                  }
                  onChange={(e) =>
                    updateBudget({
                      dailyBudget: parseOptionalNumber(e.target.value),
                    })
                  }
                  className={inputClass(errors['budget-dailyBudget'])}
                />
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-500">
                  ₺
                </span>
              </div>
            </Field>
            <p className="mt-1 text-[11px] text-slate-500">
              Minimum: {MIN_DAILY_BUDGET.toLocaleString('tr-TR')} ₺
            </p>
            {estimates.activeDays != null && budget.dailyBudget != null ? (
              <div className="mt-3 rounded-md border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-700">
                <p>
                  Tahmini aktif gün:{' '}
                  <span className="font-semibold">
                    {formatNumber(estimates.activeDays)}
                  </span>
                </p>
                <p className="mt-1">
                  Tahmini toplam:{' '}
                  <span className="font-semibold">
                    {formatMoney(estimates.estimatedTotalSpend)}
                  </span>
                </p>
              </div>
            ) : null}
          </section>
        ) : null}

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <Field
            id="wiz-budget-spendLimit"
            label="Ek Harcama Limiti"
            error={errors['budget-spendLimit']}
            help="Kampanya bütçe modelinden bağımsız olarak toplam harcamaya ek bir üst sınır koyar. Opsiyoneldir."
          >
            <div className="relative">
              <input
                id="wiz-budget-spendLimit"
                type="number"
                min={0}
                step="1"
                value={budget.spendLimit ?? ''}
                aria-invalid={Boolean(errors['budget-spendLimit'])}
                aria-describedby={
                  errors['budget-spendLimit']
                    ? 'err-budget-spendLimit budget-spendLimit-help'
                    : 'budget-spendLimit-help'
                }
                onChange={(e) =>
                  updateBudget({
                    spendLimit: parseOptionalNumber(e.target.value),
                  })
                }
                className={inputClass(errors['budget-spendLimit'])}
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-500">
                ₺
              </span>
            </div>
          </Field>
          {spendLimitInfo ? (
            <p className="mt-2 rounded-md border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              {spendLimitInfo}
            </p>
          ) : null}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Harcama Stratejisi
            </h2>
          </div>
          <div
            role="radiogroup"
            aria-label="Harcama stratejisi"
            className="grid gap-2"
          >
            <span id="wiz-budget-bidStrategy" tabIndex={-1} className="sr-only" />
            {bidStrategyOptions.map((option) => {
              const selected = budget.bidStrategy === option.value
              return (
                <label
                  key={option.value}
                  htmlFor={`wiz-budget-bidStrategy-${option.value}`}
                  className={[
                    'cursor-pointer rounded-md border px-3 py-3 transition',
                    selected
                      ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500'
                      : 'border-slate-200 bg-white hover:border-slate-300',
                  ].join(' ')}
                >
                  <input
                    id={`wiz-budget-bidStrategy-${option.value}`}
                    type="radio"
                    name="bid-strategy"
                    checked={selected}
                    onChange={() => setBidStrategy(option.value)}
                    className="sr-only"
                  />
                  <span className="block text-sm font-medium text-slate-800">
                    {option.label}
                  </span>
                  <span className="mt-1 block text-[11px] text-slate-500">
                    {option.description}
                  </span>
                  {selected ? (
                    <span className="mt-1.5 block text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
                      Seçili
                    </span>
                  ) : null}
                </label>
              )
            })}
          </div>

          {budget.bidStrategy === 'manual' ? (
            <div className="mt-4">
              <Field
                id="wiz-budget-manualBid"
                label="Maksimum Birim Teklif"
                error={errors['budget-manualBid']}
                help="Gösterim veya etkileşim başına kullanılabilecek mock maksimum teklif değeridir."
              >
                <div className="relative">
                  <input
                    id="wiz-budget-manualBid"
                    type="number"
                    min={0}
                    step="0.01"
                    value={budget.manualBid ?? ''}
                    aria-invalid={Boolean(errors['budget-manualBid'])}
                    aria-describedby={
                      errors['budget-manualBid']
                        ? 'err-budget-manualBid budget-manualBid-help'
                        : 'budget-manualBid-help'
                    }
                    onChange={(e) =>
                      updateBudget({
                        manualBid: parseOptionalNumber(e.target.value),
                      })
                    }
                    className={inputClass(errors['budget-manualBid'])}
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-slate-500">
                    ₺
                  </span>
                </div>
              </Field>
            </div>
          ) : null}
        </section>

        {audienceSize == null ? (
          <aside className="rounded-lg border border-amber-100 bg-amber-50 p-4">
            <p className="text-xs text-amber-900">
              Tahmini sonuçları hesaplamak için önce hedef kitleyi tamamlayın.
            </p>
            <button
              type="button"
              onClick={() => onGoToStep('audience')}
              className="mt-2 text-xs font-semibold text-amber-800 underline underline-offset-2"
            >
              Hedef Kitleye Git
            </button>
          </aside>
        ) : null}

        {!scheduleValid ? (
          <aside className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs text-slate-700">
              Kampanya süresi ve aktif gün sayısı tamamlandığında tahmini toplam
              harcama daha doğru hesaplanacaktır.
            </p>
            <button
              type="button"
              onClick={() => onGoToStep('schedule')}
              className="mt-2 text-xs font-semibold text-slate-800 underline underline-offset-2"
            >
              Zamanlamaya Git
            </button>
          </aside>
        ) : null}

        <section
          aria-labelledby="budget-estimates-heading"
          className="rounded-lg border border-slate-200 bg-white p-5 lg:hidden"
        >
          <h2
            id="budget-estimates-heading"
            className="text-sm font-semibold text-slate-900"
          >
            Tahmini Kampanya Sonuçları
          </h2>
          <EstimateGrid
            estimates={estimates}
            audienceReady={audienceSize != null}
            campaignType={draft.campaignType}
          />
        </section>
      </div>

      <aside
        aria-label="Bütçe özeti"
        className="hidden h-fit space-y-4 lg:sticky lg:top-4 lg:block"
      >
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-900">Bütçe Özeti</h2>
          <dl className="mt-3 space-y-2.5 text-xs">
            <SummaryRow
              label="Bütçe modeli"
              value={getBudgetModelLabel(budget.model) || 'Henüz belirlenmedi'}
            />
            <SummaryRow
              label={
                budget.model === 'daily' ? 'Günlük bütçe' : 'Toplam bütçe'
              }
              value={
                budget.model === 'daily'
                  ? formatMoney(budget.dailyBudget)
                  : formatMoney(budget.totalBudget)
              }
            />
            <SummaryRow
              label="Tahmini aktif gün"
              value={
                estimates.activeDays != null
                  ? formatNumber(estimates.activeDays)
                  : 'Henüz belirlenmedi'
              }
            />
            <SummaryRow
              label="Ek harcama limiti"
              value={formatMoney(budget.spendLimit)}
            />
            <SummaryRow
              label="Harcama stratejisi"
              value={
                getBidStrategyLabel(budget.bidStrategy) || 'Henüz belirlenmedi'
              }
            />
            <SummaryRow
              label="Tahmini toplam harcama"
              value={formatMoney(estimates.estimatedTotalSpend)}
            />
            <SummaryRow
              label="Tahmini erişim"
              value={
                audienceSize == null
                  ? 'Henüz hesaplanmadı'
                  : estimates.estimatedReach != null
                    ? `${formatNumber(estimates.estimatedReach)} kişi`
                    : 'Henüz belirlenmedi'
              }
            />
          </dl>
        </div>

        <div
          aria-labelledby="budget-estimates-aside-heading"
          className="rounded-lg border border-slate-200 bg-white p-4"
        >
          <h2
            id="budget-estimates-aside-heading"
            className="text-sm font-semibold text-slate-900"
          >
            Tahmini Kampanya Sonuçları
          </h2>
          <EstimateGrid
            estimates={estimates}
            audienceReady={audienceSize != null}
            campaignType={draft.campaignType}
          />
        </div>
      </aside>
    </div>
  )
}

function EstimateGrid({
  estimates,
  audienceReady,
  campaignType,
}: {
  estimates: ReturnType<typeof calculateCampaignBudgetEstimates>
  audienceReady: boolean
  campaignType: CampaignDraft['campaignType']
}) {
  return (
    <div className="mt-3 space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <EstimateCard
          title="Tahmini Toplam Harcama"
          value={formatMoney(estimates.estimatedTotalSpend)}
        />
        <EstimateCard
          title="Tahmini Günlük Harcama"
          value={formatMoney(estimates.estimatedDailySpend)}
        />
        <EstimateCard
          title="Tahmini Erişim"
          value={
            !audienceReady
              ? 'Henüz hesaplanmadı'
              : estimates.estimatedReach != null
                ? `${formatNumber(estimates.estimatedReach)} kişi`
                : 'Henüz belirlenmedi'
          }
        />
        <EstimateCard
          title="Tahmini Gösterim"
          value={
            !audienceReady
              ? 'Henüz hesaplanmadı'
              : estimates.estimatedImpressions != null
                ? formatNumber(estimates.estimatedImpressions)
                : 'Henüz belirlenmedi'
          }
        />
      </div>
      <p className="text-[11px] leading-relaxed text-slate-500">
        {campaignType === 'native'
          ? 'Sonuçlar, ihtiyaç anı eşleşmesi gerçekleşen uygun gösterimlerin mock tahminidir.'
          : campaignType === 'bulk'
            ? 'Sonuçlar, uygun hedef kitleye yapılacak mock mesaj teslimat tahminidir.'
            : null}
      </p>
      <p className="text-[11px] leading-relaxed text-slate-500">
        Bu değerler gerçek performans garantisi değildir. Mock hedef kitle,
        planlama ve bütçe bilgileri kullanılarak hesaplanmıştır.
      </p>
    </div>
  )
}

function EstimateCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-md border border-slate-100 bg-slate-50 px-2.5 py-2">
      <h3 className="text-[10px] font-medium uppercase tracking-wide text-slate-500">
        {title}
      </h3>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
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
  const fieldKey = id.replace(/^wiz-/, '')
  const helpId = help ? `${fieldKey}-help` : undefined
  const errorId = error ? `err-${fieldKey}` : undefined

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-slate-700">
        {label}
      </label>
      {children}
      {help && helpId ? (
        <p id={helpId} className="mt-1 text-[11px] text-slate-500">
          {help}
        </p>
      ) : null}
      {error && errorId ? (
        <p id={errorId} className="mt-1 text-xs text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
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

function formatMoney(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return 'Henüz belirlenmedi'
  return formatCurrency(value)
}

function inputClass(error?: string) {
  return [
    'h-9 w-full rounded-md border px-3 pr-8 text-sm outline-none focus:border-emerald-400',
    error ? 'border-rose-300' : 'border-slate-200',
  ].join(' ')
}
