import { Navigate, Route, Routes } from 'react-router-dom'
import AdvertisementLayout from './components/AdvertisementLayout.tsx'
import AdvertisementDashboardPage from './pages/AdvertisementDashboardPage.tsx'
import AnalyticsPage from './pages/AnalyticsPage.tsx'
import AudiencePage from './pages/AudiencePage.tsx'
import CampaignDetailPage from './pages/CampaignDetailPage.tsx'
import CampaignEditPage from './pages/CampaignEditPage.tsx'
import CampaignWizardPage from './pages/CampaignWizardPage.tsx'
import CampaignsPage from './pages/CampaignsPage.tsx'
import CompanyProfilePage from './pages/CompanyProfilePage.tsx'
import ProductDetailPage from './pages/ProductDetailPage.tsx'
import ProductEditPage from './pages/ProductEditPage.tsx'
import ProductNewPage from './pages/ProductNewPage.tsx'
import ProductsPage from './pages/ProductsPage.tsx'
import { adPaths } from './paths.ts'

/**
 * Nested under /advertisement/* from App.tsx.
 * CampaignProvider wraps this tree only (see App.tsx).
 */
export default function AdvertisementRoutes() {
  return (
    <Routes>
      <Route element={<AdvertisementLayout />}>
        <Route
          index
          element={<Navigate to={adPaths.dashboard} replace />}
        />
        <Route path="dashboard" element={<AdvertisementDashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/new" element={<ProductNewPage />} />
        <Route path="products/:productId" element={<ProductDetailPage />} />
        <Route path="products/:productId/edit" element={<ProductEditPage />} />
        <Route path="campaigns" element={<CampaignsPage />} />
        <Route path="campaigns/new" element={<CampaignWizardPage />} />
        <Route path="campaigns/:campaignId" element={<CampaignDetailPage />} />
        <Route
          path="campaigns/:campaignId/edit"
          element={<CampaignEditPage />}
        />
        <Route path="audience" element={<AudiencePage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="company-profile" element={<CompanyProfilePage />} />
        <Route
          path="*"
          element={<Navigate to={adPaths.dashboard} replace />}
        />
      </Route>
    </Routes>
  )
}
