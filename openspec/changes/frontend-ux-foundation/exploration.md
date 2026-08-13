## Exploration: frontend-ux-foundation

### Current State

Nevada Inventory (Next.js 16 App Router, React 19, Zustand 5, TanStack Query, next-intl, shadcn/ui) has a solid token/i18n/skeleton baseline, but list UX is not deep-linkable and many icon-only controls are inaccessible to screen readers.

**List filter state (no URL sync today)**

| Pattern | Lists | Persistence | Deep-linkable |
|---------|-------|-------------|---------------|
| Zustand `useInventoryStore` (`nevada-inventory-store` localStorage) | products, warehouses, stock, categories | Yes (filters persisted) | No |
| Component `useState({ page: 1, limit: 10 })` | sales, returns, transfers, movements, contacts, users, brands, companies, audit, roles, combos (and similar) | No (reset on navigate away) | No |

Shared filters typically include `search`, status/type arrays, `sortBy`/`sortOrder`, `page`, `limit`. Company scope is usually injected from `useCompanyStore.selectedCompanyId` (not a URL param) via a `filtersWithCompany` memo — keep that as session/global scope, not list query state.

**Existing URL usage (not list filters)**

- `report-catalog.tsx` — reads `?tab=` once into local state (partial precedent; not a full bidirectional sync).
- `movement-form-page.tsx` — `returnTo` query param for post-submit navigation.
- `proxy.ts` — `callbackUrl` on auth redirect.
- **No `nuqs` dependency** in `package.json`.

**Icon-only buttons / a11y**

- ~50 files use `size="icon"`.
- Almost none combine `size="icon"` with `aria-label` (notable exceptions: `webhook-credentials-display.tsx`, `report-viewer.tsx`).
- High-traffic pattern: `title={t("actions.view|edit")}` on products/warehouses/combos — `title` is not a reliable accessible name.
- `header.tsx` theme + logout: `title` only.
- `table-pagination.tsx` prev/next/page number buttons: no `aria-label`.
- Sidebar mobile open/close already use `aria-label` — good local precedent.
- Many row action menus use ghost icon buttons with neither `title` nor `aria-label`.

**Sprint 2–3 inventory (out of primary scope)**

- Typography: `Inter` + `JetBrains_Mono` in `src/app/[locale]/layout.tsx`.
- Brand: Lucide `Package` as logo mark in sidebar.
- Auth layout: `bg-muted/50` + centered card shell (`(auth)/layout.tsx`).
- Nav: Inventory group has **8 flat children** in `sidebar.tsx`.
- Missing: `prefers-reduced-motion`, skip-link, shared `PageHeader`, unsaved navigation guards, table virtualization.

**Active overlapping change**

- `meli-full-warehouse-ui` is still active under `openspec/changes/meli-full-warehouse-ui/` (integrations: MeLi form/detail/entity/DTO/schema/i18n).
- Overlap with this change is **low** for URL filters (no shared list state files). Soft overlap only if an a11y sweep edits `meli-connection-detail.tsx` / other integration icon buttons — prefer excluding integrations until that change merges, or limit Sprint 1 a11y to shared layout + pagination + inventory/sales list actions.

### Affected Areas

**Sprint 1 (in-scope recommendation)**

- `src/modules/inventory/infrastructure/store/inventory.store.ts` — stop/rethink persisting filter slices if URL becomes source of truth.
- `src/modules/inventory/presentation/hooks/use-inventory-store.ts` — filter selector/setter hooks may thin or wrap URL state.
- List consumers of Zustand filters: `product-list.tsx`, `stock-table.tsx`, `warehouse-list.tsx`, `category-list.tsx` (+ their `*-filters` components).
- Local-state lists (at least high-traffic): `sale-list.tsx`, `movement-list.tsx`, `transfer-list.tsx`, `return-list.tsx`, `contact-list.tsx` (others optional in same change if budget allows).
- New shared helper (proposed): e.g. `src/shared/presentation/hooks/use-list-search-params.ts` (or nuqs parsers under `shared/`).
- `src/ui/layout/header.tsx` — theme/logout `aria-label`.
- `src/ui/components/table-pagination.tsx` — prev/next (and preferably numbered page) accessible names.
- Icon action buttons across list/detail/form pages (view/edit/back) — prefer `aria-label` (keep `title` optional for tooltip UX).
- Tests: `inventory.store.spec.ts`, `use-inventory-store.spec.ts`, list component specs; new unit tests for URL parse/serialize helpers.

**Sprint 2–3 (follow-up changes; do not inflate this PR)**

- `src/app/[locale]/layout.tsx` (fonts), `(auth)/layout.tsx`, `sidebar.tsx` (grouping + brand mark).
- New PageHeader, reduced-motion globals, skip-link in dashboard shell, form leave guards, virtualized table wrapper.

### Approaches

1. **nuqs as URL filter source of truth** — Adopt `nuqs` parsers per list (`page`, `limit`, `search`, `sortBy`, `sortOrder`, array params). Lists read/write query params; drop filter persistence from Zustand (keep selection/UI flags in store if still needed).
   - Pros: Typed parsers, App Router–friendly, shared ecosystem pattern, avoids dual-source bugs; easy debounce/throttle helpers.
   - Cons: New dependency; migration cost across many lists; needs Next adapter/`NuqsAdapter` wiring; Strict TDD + learning curve for parsers (arrays, optional enums).
   - Effort: Medium (pilot) → High (all lists)

2. **Shared manual hook (`useSearchParams` + `router.replace`)** — One `useListSearchParams<TFilters>(schema/defaults)` helper using native Next APIs and Zod (already in stack). No new package.
   - Pros: Zero new deps; fits hexagonal “shared presentation” slot; Zod reuse; mirrors existing report-catalog precedent.
   - Cons: Easy to reinvent nuqs edge cases (history spam, SSR, empty defaults, array serialization); more custom code to maintain.
   - Effort: Medium

3. **Keep Zustand/useState + mirror to URL** — On change, write query string; on mount, hydrate store/state from URL.
   - Pros: Minimal call-site change if setters already exist.
   - Cons: Dual source of truth (especially with `persist` localStorage vs URL); race/hydration bugs; filter “memory” fights deep links; highest defect risk.
   - Effort: Medium-High (bugs, not lines)

### Recommendation

**Scope this change as Sprint 1 only:**

1. **URL sync for list filters/pagination/sort** using **Approach 1 (nuqs)** if the team accepts one well-supported dependency; otherwise **Approach 2 (shared manual hook)** to stay dependency-light. **Do not choose Approach 3** while filters remain `persist`ed in localStorage.
2. **Implementation order (budget-aware):**
   - Shared URL helper + unit tests.
   - Migrate the four Zustand inventory lists first; **remove filter fields from `partialize` persist** (URL wins; empty URL → defaults).
   - Migrate high-traffic local-state lists: sales, movements, transfers, returns, contacts.
   - Defer brands/companies/users/roles/audit/combos to a chained PR if the forecast exceeds ~400 lines.
3. **Icon-button a11y in the same change (small, high value):**
   - Fix shared primitives first: `header.tsx`, `table-pagination.tsx`.
   - Replace `title`-only view/edit/back/theme/logout with `aria-label` (i18n keys already exist in many places).
   - Sweep list row actions that are bare icons; **exclude integrations module until `meli-full-warehouse-ui` lands** to avoid file conflicts.
4. **Out of scope → follow-up changes:**
   - Sprint 2: distinctive typography + real brand mark + auth layout atmosphere + Inventory nav sub-grouping.
   - Sprint 3: PageHeader, `prefers-reduced-motion`, skip-link, unsaved-form guards, table virtualization.

**Why Sprint 1-only:** URL sync alone touches many list files + store contracts + tests; folding brand/nav would blow the 400-line review budget and couple styling PRs to behavioral/a11y work. Icon `aria-label` fixes are tiny and reviewable alongside URL work if shared components absorb most of the pagination impact.

**400-line budget note (for propose/tasks):** Forecast **Medium–High** if all lists migrate in one PR → recommend **chained PRs**: (A) shared helper + inventory Zustand lists + header/pagination a11y; (B) remaining local-state lists + remaining icon sweeps.

### Risks

- **Zustand persist vs URL**: Users with saved filters in `localStorage` may surprise on first deploy if URL is empty — define precedence (URL if any list params present, else defaults; optionally one-time migrate). Prefer stopping filter persistence.
- **History noise**: Debounce `search` text input writes (`replace` not `push`) to avoid clogging back button.
- **Array/query encoding**: `categoryIds`, `status[]`, warehouse multi-select need a single serialization convention.
- **Company scope**: Do not put `selectedCompanyId` into list URLs by default (global selector); document that shared links assume viewer’s current company context for company-scoped queries.
- **next-intl routing**: Query sync must use the app’s locale-aware navigation (`@/i18n/navigation` / compatible adapter) so locale prefixes stay intact.
- **meli-full-warehouse-ui**: Avoid editing integration detail icon buttons until that change merges.
- **Strict TDD**: Budget must include parser/hook tests and list-spec updates, not only UI diffs.
- **Scope creep**: Brand/auth/nav/virtualization look “small” but are separate design decisions — keep them out.

### Ready for Proposal

**Yes** — Orchestrator should tell the user: explore recommends a Sprint-1-scoped change (`frontend-ux-foundation`) delivering URL-synced list filters + icon-button `aria-label` coverage, with brand/nav/header polish and advanced a11y (skip-link, reduced-motion, PageHeader, unsaved guards, virtualization) deferred to follow-up changes; next phase `sdd-propose`.
