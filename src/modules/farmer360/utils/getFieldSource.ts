import type { Farmer, FarmerFieldSourceKey, FieldSource } from '../types/farmer.ts'

export function getFieldSource(
  farmer: Farmer,
  key: FarmerFieldSourceKey,
): FieldSource | undefined {
  return farmer.fieldSources[key]
}
