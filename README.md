# AgriGO Platform

Tek repository içinde iki ürün modülü:

- **Farmer360** — AI destekli Çiftçi CRM
- **Advertisement Platform** — Reklamveren kampanya yönetimi (ara milestone)

Bu depo, yönetici incelemesi için hazırlanmış çalışan bir ara sürümdür. Backend yoktur; tüm veri mock dataset’lerdir.

---

## Technology Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React
- React Router

---

## Setup

```bash
npm install
npm run dev
npm run build
npm run lint
```

| Command | Description |
| --- | --- |
| `npm run dev` | Local development server |
| `npm run build` | Typecheck + production build (`dist/`) |
| `npm run lint` | Oxlint |

Default app entry redirects to Advertisement Dashboard (`/advertisement`). Farmer360 remains at `/farmer360`.

---

## Advertisement Platform

**Status:** Working intermediate milestone for manager review (not a final release).

### Included modules

- Dashboard
- Products / Ürün Yönetimi
- Campaigns / Kampanya Yönetimi
- Campaign Wizard
- Audience / Hedef Kitle
- Analytics
- Company Profile / Şirket Profili

### Campaign types

- Native Recommendation (Doğal AI Önerisi)
- Bulk Message (Toplu Mesaj)

### Multi-tenant model

- **Advertiser:** bound to exactly one `companyId`; cannot switch companies or see other tenants.
- **Admin:** can view all five mock advertiser companies and switch between them.
- Frontend filters and access checks are enforced for the demo UI.
- Frontend tenant filtering is **not** real backend security. Future APIs and DB queries must authenticate the user, authorize `companyId`, and never return other tenants’ rows.

See `src/modules/advertisement/TENANT_ISOLATION.md` for the full access model.

### Demo notes

- Mock data only (companies, users, products, campaigns, audiences, analytics, billing).
- No backend, authentication service, or real API integrations in this milestone.
- Continue development on the same GitHub repository and the same Vercel project after deploy.

### Key routes

- `/advertisement`
- `/advertisement/products`
- `/advertisement/campaigns`
- `/advertisement/audience`
- `/advertisement/analytics`
- `/advertisement/company-profile`

---

## Farmer360

AgriGO Farmer360 is an AI-powered Farmer CRM MVP developed to centralize farmer information, monitor field activities, organize AI-assisted insights, and support operational decision making.

Route: `/farmer360`

### Implemented features

- Farmer List
- Farmer Search
- Farmer Profile
- Profile Completeness Analysis
- Critical Missing Information Detection
- Production Information
- Land Information
- Livestock Information
- Beekeeping Information
- Finance Information
- Insurance Information
- Consent Management
- Documents
- Conversations
- Timeline
- AI Memory
- Notifications
- Operations Center

### AI Workflow

```text
Conversation / Document / Image
              │
              ▼
          Timeline
              │
              ▼
       AI Inference
              │
              ▼
          AI Memory
              │
              ▼
        Human Review
              │
              ▼
       Farmer Profile
```

### Farmer360 status

**Farmer360 MVP v1.0 RC** — prepared for internal demonstration. Scope for this module remains unchanged in the Advertisement milestone work.

---

## Quality Checks

- ✅ TypeScript
- ✅ Oxlint
- ✅ Production Build

Known non-blocking warnings may appear (React Fast Refresh export hints, Vite chunk size).

---

## Notes

This platform MVP intentionally excludes:

- Backend
- Authentication
- Database
- Real API integrations

All data is currently provided through mock datasets for demonstration purposes.

SPA hosting on Vercel uses `vercel.json` rewrites so React Router deep links and page refresh work for `/advertisement/*` and `/farmer360/*`.
