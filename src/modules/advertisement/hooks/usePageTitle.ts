import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { adPaths, ADVERTISEMENT_BASE } from '../paths.ts'

const pageTitles: Record<string, string> = {
  [adPaths.dashboard]: 'Dashboard',
  [adPaths.products]: 'Ürünler',
  [adPaths.productNew]: 'Yeni Ürün',
  [adPaths.campaigns]: 'Kampanyalar',
  [adPaths.campaignNew]: 'Yeni Kampanya',
  [adPaths.audience]: 'Hedef Kitle',
  [adPaths.analytics]: 'Analytics',
  [adPaths.companyProfile]: 'Şirket Profili',
}

export function usePageTitle(): string {
  const { pathname } = useLocation()

  return useMemo(() => {
    if (pageTitles[pathname]) return pageTitles[pathname]

    if (pathname.match(new RegExp(`^${ADVERTISEMENT_BASE}/products/[^/]+/edit$`))) {
      return 'Ürün Düzenle'
    }
    if (pathname.match(new RegExp(`^${ADVERTISEMENT_BASE}/products/[^/]+$`))) {
      return 'Ürün Detayı'
    }
    if (pathname.match(new RegExp(`^${ADVERTISEMENT_BASE}/campaigns/[^/]+/edit$`))) {
      return 'Kampanya Düzenle'
    }
    if (pathname.match(new RegExp(`^${ADVERTISEMENT_BASE}/campaigns/[^/]+$`))) {
      return 'Kampanya Detayı'
    }

    return 'Reklam Yönetimi'
  }, [pathname])
}
