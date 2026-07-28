import { getProductById } from '../../../data/products.ts'
import type {
  BulkCreativeDraft,
  CampaignDraft,
  CampaignOfferDraft,
  NativeCreativeDraft,
} from '../campaignDraft.ts'
import type { CampaignWizardStepId } from '../campaignWizardSteps.ts'
import BulkCreativeForm from './creative/BulkCreativeForm.tsx'
import BulkCreativePreview from './creative/BulkCreativePreview.tsx'
import CampaignOfferForm from './creative/CampaignOfferForm.tsx'
import NativeCreativeForm from './creative/NativeCreativeForm.tsx'
import NativeCreativePreview from './creative/NativeCreativePreview.tsx'

type CreativeStepProps = {
  draft: CampaignDraft
  errors: Record<string, string>
  onChange: (patch: Partial<CampaignDraft>) => void
  onGoToStep: (stepId: CampaignWizardStepId) => void
}

export default function CreativeStep({
  draft,
  errors,
  onChange,
  onGoToStep,
}: CreativeStepProps) {
  const product = draft.productId
    ? getProductById(draft.productId)
    : undefined

  function patchNative(patch: Partial<NativeCreativeDraft>) {
    onChange({
      creative: {
        ...draft.creative,
        native: { ...draft.creative.native, ...patch },
      },
    })
  }

  function patchBulk(patch: Partial<BulkCreativeDraft>) {
    onChange({
      creative: {
        ...draft.creative,
        bulk: { ...draft.creative.bulk, ...patch },
      },
    })
  }

  function patchOffer(patch: Partial<CampaignOfferDraft>) {
    onChange({
      creative: {
        ...draft.creative,
        offer: { ...draft.creative.offer, ...patch },
      },
    })
  }

  if (!draft.campaignType) {
    return (
      <section className="rounded-lg border border-slate-200 bg-white px-6 py-10 text-center">
        <h2 className="text-sm font-semibold text-slate-900">
          Önce kampanya türünü seçin
        </h2>
        <p className="mx-auto mt-2 max-w-md text-xs text-slate-500">
          Kreatif alanları, Native Öneri ve Toplu Mesaj kampanyalarında
          farklıdır.
        </p>
        <button
          type="button"
          onClick={() => onGoToStep('campaign-info')}
          className="mt-4 rounded-md bg-emerald-700 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-800"
        >
          Kampanya Bilgilerine Git
        </button>
      </section>
    )
  }

  return (
    <div className="space-y-4">
      {!product ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-xs font-medium text-amber-900">
            Kreatifi tamamlamadan önce kampanyada kullanılacak ürünü seçmeniz
            önerilir.
          </p>
          <button
            type="button"
            onClick={() => onGoToStep('product')}
            className="mt-2 text-xs font-semibold text-amber-900 underline"
          >
            Ürün Seçimine Git
          </button>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-4">
          {draft.campaignType === 'native' ? (
            <NativeCreativeForm
              value={draft.creative.native}
              product={product}
              errors={errors}
              onChange={patchNative}
            />
          ) : (
            <BulkCreativeForm
              value={draft.creative.bulk}
              product={product}
              errors={errors}
              onChange={patchBulk}
            />
          )}

          <CampaignOfferForm
            offer={draft.creative.offer}
            product={product}
            errors={errors}
            onChange={patchOffer}
          />
        </div>

        <aside className="w-full shrink-0 lg:sticky lg:top-4 lg:w-[380px]">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="text-xs font-semibold text-slate-800">
              Canlı Önizleme
            </h3>
            <p className="mt-0.5 text-[11px] text-slate-500">
              Draft değişiklikleri anlık yansır. Bu bir simülasyondur.
            </p>
            <div className="mt-3">
              {draft.campaignType === 'native' ? (
                <NativeCreativePreview
                  native={draft.creative.native}
                  offer={draft.creative.offer}
                  product={product}
                />
              ) : (
                <BulkCreativePreview
                  bulk={draft.creative.bulk}
                  offer={draft.creative.offer}
                  product={product}
                />
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
