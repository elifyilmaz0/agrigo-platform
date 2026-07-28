# Advertisement Multi-Tenant Isolation

## Product decision

- Every **Advertiser** user is bound to **exactly one** company (`companyId`).
- Advertisers **cannot** switch companies and **cannot** see other companies’ names or data.
- Companies **cannot** see each other.
- **Admin** can see all companies and switch between them.
- Frontend filtering is **not** real security. Backend APIs and DB queries must enforce `companyId` scope.

## Mock companies

| companyId | Name | Advertiser user |
|---|---|---|
| `company-isleyen-tarim` | İşleyen Tarım A.Ş. | Elif Kaya |
| `company-bereket-gubre` | Bereket Gübre Sanayi A.Ş. | Mert Demir |
| `company-agronova` | AgroNova Bitki Koruma Ltd. Şti. | Selin Arslan |
| `company-verimli-tohum` | Verimli Tohumculuk A.Ş. | Can Yıldız |
| `company-anadolu-sulama` | Anadolu Sulama Sistemleri Ltd. Şti. | Zeynep Şahin |

Admin mock user: **AgriGO Admin** (`admin@agrigo.ai`) — all companies.

There is **no** multi-company advertiser user (the former “Yetkili Hesap Yöneticisi” scenario was removed).

## Access model

```ts
type PlatformUser =
  | {
      id: string
      name: string
      email: string
      role: 'advertiser'
      companyId: string
    }
  | {
      id: string
      name: string
      email: string
      role: 'admin'
    }
```

- **Advertiser**: `selectedCompanyId = currentUser.companyId` (localStorage company key ignored).
- **Admin**: may use company switcher; `selectedCompanyId` may persist in localStorage; invalid values are cleared and replaced with the first valid company.
- Advertiser filter: `record.companyId === currentUser.companyId`
- Admin filter: `record.companyId === selectedCompanyId`

`accessibleCompanyIds` is **not** used for advertisers.

## Frontend controls (implemented)

1. `TenantProvider` forces advertiser selection to `user.companyId`.
2. Company switcher is **Admin-only** (advertisers see a static company label).
3. Domain records carry required `companyId` (products, campaigns, segments, profiles, dashboard/analytics rows, billing on profile, notifications/search results when modeled).
4. Stores/pages filter by selected company **after** access checks (`canAccessCompany`).
5. Cross-tenant URL/ID access shows: “Bu içeriğe erişim yetkiniz bulunmuyor.” and does not render foreign tenant data.
6. Layout remounts page content on company switch (`Outlet key={selectedCompanyId}`) to prevent brief data leakage.

## Critical backend requirement

**Frontend filtering is not real security.**

When a backend is introduced:

- Authenticate every API request.
- Authorize access server-side: advertiser may only use their `companyId`; admin may access any company.
- Scope **every** API and database query by `companyId`.
- Never include other tenants’ rows in API responses.
- Treat URL / ID / client storage tampering as an authorization failure.

Code references:

- `src/modules/advertisement/types/tenant.ts`
- `src/modules/advertisement/tenant/tenantAccess.ts`
- `src/modules/advertisement/tenant/TenantProvider.tsx`
- `src/modules/advertisement/data/tenant.ts`
