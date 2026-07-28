import { Navigate, useLocation, useParams } from 'react-router-dom'
import { ADVERTISEMENT_BASE } from '../modules/advertisement/paths.ts'

/**
 * Redirects legacy root-level Advertisement URLs to /advertisement/*
 * while preserving path suffix, query string, and hash.
 *
 * Examples:
 * /campaigns/camp-1?tab=performance → /advertisement/campaigns/camp-1?tab=performance
 * /products/new → /advertisement/products/new
 */
export default function LegacyAdvertisementRedirect({
  legacyRoot,
}: {
  legacyRoot:
    | 'dashboard'
    | 'products'
    | 'campaigns'
    | 'audience'
    | 'analytics'
    | 'company-profile'
}) {
  const location = useLocation()
  const params = useParams()
  const splat = typeof params['*'] === 'string' ? params['*'] : ''

  const suffix = splat ? `/${splat}` : ''
  const target = `${ADVERTISEMENT_BASE}/${legacyRoot}${suffix}${location.search}${location.hash}`

  return <Navigate to={target} replace />
}
