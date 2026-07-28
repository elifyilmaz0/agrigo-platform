import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AdvertisementRoutes from '../modules/advertisement/AdvertisementRoutes.tsx'
import { CampaignProvider } from '../modules/advertisement/state/CampaignStore.tsx'
import { TenantProvider } from '../modules/advertisement/tenant/TenantProvider.tsx'
import { adPaths } from '../modules/advertisement/paths.ts'
import Farmer360Routes from './Farmer360Routes.tsx'
import LegacyAdvertisementRedirect from './LegacyAdvertisementRedirect.tsx'
import NotFoundPage from './NotFoundPage.tsx'
import PlatformLandingPage from './PlatformLandingPage.tsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PlatformLandingPage />} />

        <Route path="/farmer360/*" element={<Farmer360Routes />} />

        <Route
          path="/advertisement/*"
          element={
            <TenantProvider>
              <CampaignProvider>
                <AdvertisementRoutes />
              </CampaignProvider>
            </TenantProvider>
          }
        />

        <Route
          path="/dashboard"
          element={<Navigate to={adPaths.dashboard} replace />}
        />
        <Route
          path="/products"
          element={<Navigate to={adPaths.products} replace />}
        />
        <Route
          path="/products/*"
          element={<LegacyAdvertisementRedirect legacyRoot="products" />}
        />
        <Route
          path="/campaigns"
          element={<Navigate to={adPaths.campaigns} replace />}
        />
        <Route
          path="/campaigns/*"
          element={<LegacyAdvertisementRedirect legacyRoot="campaigns" />}
        />
        <Route
          path="/audience"
          element={<Navigate to={adPaths.audience} replace />}
        />
        <Route
          path="/analytics"
          element={<Navigate to={adPaths.analytics} replace />}
        />
        <Route
          path="/company-profile"
          element={<Navigate to={adPaths.companyProfile} replace />}
        />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
