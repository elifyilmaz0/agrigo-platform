import type { Farmer, ProductionType } from '../types/farmer.ts'

/** Crop-oriented land fields that do not apply to pure livestock / beekeeping. */
export function usesCropLandFields(productionType: ProductionType): boolean {
  return productionType === 'Bitkisel' || productionType === 'Karma'
}

export function requiresIrrigationSystem(farmer: Farmer): boolean {
  return usesCropLandFields(farmer.productionType)
}

export function requiresSoilType(farmer: Farmer): boolean {
  return usesCropLandFields(farmer.productionType)
}
