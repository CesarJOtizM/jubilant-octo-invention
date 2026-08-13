# Exploration: company-scoped-stock-ui

Companion frontend for BE capability `company-scoped-stock` (archived 2026-07-13 in `improved-parakeet`). BE already requires header `companyId` on create for Movement / Sale / Transfer / Return, and filters inventory/sales by `stock.companyId` / document header `companyId` (not `product.companyId`).

## Current State

### Company selection

- Zustand store `useCompanyStore` (`src/modules/companies/infrastructure/store/company.store.ts`): persisted `selectedCompanyId: string | null` + `setSelectedCompany`.
- `GlobalCompanySelector` allows “All companies” (`null`) or a specific company when `multiCompanyEnabled`.
- Pattern across lists: inject `companyId: selectedCompanyId` into query filters **only when non-null**.

### Stock (reads)

- `StockFilters.companyId` + `StockApiAdapter.buildQueryParams` already send `companyId` query param.
- `StockTable` and `warehouse-detail` merge global selection into stock list filters.
- **Gap**: `Stock` entity / `StockApiRawDto` / `StockMapper` do **not** expose `companyId`. With shared SKU at same warehouse, two buckets can collide in UI identity (`id` fallback `${productId}:${warehouseId}:${index}`).
- `findByProductAndWarehouse(productId, warehouseId)` has **no** `companyId` argument — ambiguous after BE split.

### Document creates (writes) — critical gap

BE requires header `companyId` on create. FE **does not send it**:

| Surface | Create DTO | Zod → DTO | Form uses `selectedCompanyId` for |
|---------|------------|-----------|-----------------------------------|
| Sale | `CreateSaleDto` — no `companyId` | `toCreateSaleDto` omits it | Product search only |
| Movement | `CreateStockMovementDto` — no `companyId` | `toCreateMovementDto` omits it | Product search only |
| Transfer | `CreateTransferDto` — no `companyId` | `toCreateTransferDto` omits it | Product search / `useProducts` only |
| Return | `CreateReturnDto` — no `companyId` | `toCreateReturnDto` omits it | Product search + sales search only |

Response DTOs / domain entities for Sale, Movement, Transfer, Return also omit `companyId` (display/list columns not company-aware beyond filters).

### List / dashboard / report filters

| Area | Passes `companyId` from global selector? | Notes |
|------|------------------------------------------|-------|
| Stock list | Yes | Adapter OK; entity missing field |
| Sales list | Yes | Filter-only; create missing |
| Movements list | Yes | Filter-only; create missing |
| Returns list | Yes | Filter-only; create missing |
| Transfer list | **No** | `TransferFilters` has no `companyId`; list not wired to store |
| Dashboard | Yes | `useDashboardMetrics(selectedCompanyId)` |
| Reports | Yes | `ReportFiltersForm` seeds + sends `companyId` |
| Product list | Yes | Catalog ownership via `product.companyId` (allowed for catalog UI) |

### Product search assuming product ownership

- `ProductSearchSelect` / `useProductSearch` / transfer `useProducts` pass `companyId` → product list API (`ProductFilters.companyId` → ownership filter).
- With **shared catalog**, filtering pickers by `product.companyId` can hide valid shared SKUs when metadata is null or owned by another company.
- Closed BE decision: catalog stays shared; inventory dimension is stock/header company, not product ownership.

### Import UI

- Generic wizard: upload → preview → execute; column schema comes from BE.
- Types include `STOCK` / `MOVEMENTS` / `TRANSFERS`.
- FE does **not** inject `selectedCompanyId` into import preview/execute calls. Stock import `companyId` column (if required by BE) is file-driven only; no company-context UX in wizard.

### Concurrent change: `meli-full-warehouse-ui`

- Active under `openspec/changes/meli-full-warehouse-ui/` (proposal, spec, tasks — tasks marked done).
- Scope: MeLi `fullWarehouseId` on integration connection form/detail. **No file overlap** with stock/sales/movements/transfers/returns company headers.
- **Do not archive** as part of this change; no merge conflict expected if both land independently.

### Out of scope (FE)

- Cross-company transfers
- Duplicate SKUs / forced `Product.companyId`
- `Warehouse.companyId`

## Affected Areas

- `src/modules/companies/infrastructure/store/company.store.ts` — source of header company; may need create-time guard when null
- `src/modules/sales/application/dto/sale.dto.ts` + `presentation/schemas/sale.schema.ts` + `sale-form-page.tsx` — add header `companyId` on create
- `src/modules/inventory/application/dto/stock-movement.dto.ts` + `presentation/schemas/movement.schema.ts` + movement forms — same
- `src/modules/inventory/application/dto/transfer.dto.ts` + `presentation/schemas/transfer.schema.ts` + transfer forms — same; **plus** transfer list filters
- `src/modules/returns/application/dto/return.dto.ts` + `presentation/schemas/return.schema.ts` + `return-form-page.tsx` — same
- `src/modules/inventory/application/dto/stock.dto.ts` + `domain/entities/stock.entity.ts` + `mappers/stock.mapper.ts` + adapters/hooks — expose stock `companyId`; optional `findByProductAndWarehouse` company arg
- `src/modules/inventory/presentation/components/shared/product-search-select.tsx` + `use-product-search.ts` (+ combos / swap / transfer product loads) — rethink catalog vs ownership filter
- List components already partially OK; transfer list needs company filter wiring
- Adapters (sale/movement/transfer/return) — pass through create body field; response mappers if displaying company
- Tests mirroring create DTO transforms and list filter injection
- Import wizard (optional / lower priority): document BE schema change; only change FE if UX must bind global company

## Approaches

1. **Header inject from global store (recommended)** — On create submit, require non-null `selectedCompanyId` (block create when “All” selected) and append `companyId` to Create DTOs / Zod transforms. Keep list filters as today. Stop (or make optional) product-picker ownership filter for inventory document forms so shared catalog works. Add `companyId` to Stock domain for display/disambiguation; wire transfer list filters.
   - Pros: Matches BE contract with minimal UX change; reuses existing store; clear fail-closed when company unset.
   - Cons: Forces user to pick a company before creating docs; product search behavior change needs product confirmation.
   - Effort: Medium

2. **Per-form company field** — Explicit company Select on each create form (default from store, overridable).
   - Pros: Clear document identity; works even if global selector is “All”.
   - Cons: More UI/i18n; duplicates global selector mental model; higher effort.
   - Effort: Medium–High

3. **Silent omit / rely on BE inference** — Do nothing on create (or only tighten list filters).
   - Pros: Zero FE work.
   - Cons: **Breaks** BE (`@IsNotEmpty` companyId); creates will fail after BE deploy. Invalid.
   - Effort: N/A (rejected)

## Recommendation

**Approach 1**: Thread `selectedCompanyId` as required header `companyId` on Sale / Movement / Transfer / Return creates (DTO → schema transform → form submit). Fail closed in UI when global company is null. Align read models: Stock (+ optional document responses) expose `companyId`; transfer lists pass company filter. For inventory pickers under shared catalog, **do not** treat `product.companyId` as the inventory gate — prefer unfiltered active catalog search (or soft optional ownership filter only on product admin list). Keep `meli-full-warehouse-ui` untouched.

## Risks

- **Create without company**: Users with “All companies” selected will hit BE 400 until FE blocks or prompts — must ship guard + copy.
- **Product picker vs shared catalog**: Current company-scoped product search may hide shared SKUs; changing this is a behavioral product decision for proposal.
- **Stock row identity**: Missing `companyId` in Stock entity can confuse duplicate SKU rows when viewing “All”.
- **`findByProductAndWarehouse`**: Callers may resolve wrong bucket if BE endpoint becomes company-keyed.
- **Transfer list gap**: Lists remain mixed-company until filter added.
- **Import STOCK**: If BE requires per-row `companyId` and CSV omits it, import fails; FE wizard has no company inject today.
- **Parallel change**: Low overlap with `meli-full-warehouse-ui`, but both touch integrations periphery only at MeLi sync (BE already injects connection companyId) — FE MeLi change unrelated.

## Ready for Proposal

**Yes** — Closed BE decisions are sufficient. Proposal should lock: (1) create header inject from store with null-guard, (2) transfer list company filter, (3) Stock DTO/entity `companyId`, (4) product-picker strategy for shared catalog, (5) import note (file/BE-driven vs optional FE inject). Orchestrator may proceed to `sdd-propose`.
