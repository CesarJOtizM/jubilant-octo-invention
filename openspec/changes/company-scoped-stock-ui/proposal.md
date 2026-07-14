# Proposal: Company-Scoped Stock UI

## Intent

BE `company-scoped-stock` requires header `companyId` on Sale/Movement/Transfer/Return create and filters by `stock.companyId` / document header — not `product.companyId`. FE omits create `companyId`, under-filters transfers, and can collide stock rows.

## Scope

### In Scope
- Inject `companyId` from `useCompanyStore.selectedCompanyId` on create (DTO + Zod + form)
- Fail-closed UX when company is “All” / `null`
- Expose `Stock.companyId` (entity/DTO/mapper/table); company-aware lookups as needed
- Wire transfer list (+ inventory filter gaps) to BE `companyId`
- Inventory pickers: shared catalog — no `product.companyId` ownership gate
- STOCK import: require selected company; inject into preview/execute
- Unit tests + i18n for guard/import

### Out of Scope
- Cross-company transfers; BE changes; archiving `meli-full-warehouse-ui`
- Duplicate SKUs / `Product.companyId` / `Warehouse.companyId`; per-form company Select

## Capabilities

### New Capabilities
- `company-scoped-stock-ui`: create header inject + null guard; stock `companyId` identity; company list filters; shared-catalog inventory pickers; company-bound STOCK import

### Modified Capabilities
None (no `openspec/specs/` baselines)

## Approach

**Approach 1 (locked):** Require non-null `selectedCompanyId` on create; append to Create DTOs; block “All” with clear copy. List inject-when-non-null + transfer wiring. Map Stock `companyId` into row identity. Inventory search omits ownership filter. STOCK import binds selected company. Consumes existing BE only.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `sales/`, `returns/` create | Modified | Header + guard |
| `inventory/` movement/transfer | Modified | Header + transfer filters |
| `inventory/` stock + product-search | Modified | `companyId` identity; shared pickers |
| `imports/` wizard; store; i18n; tests | Modified | STOCK inject; copy; coverage |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| “All” blocks create | Med | Guard UX + select CTA |
| Picker / stock / import issues | Med | Ops-only pickers; identity; FE inject |
| PR >400 lines | Med | Chained slices |

## Rollback Plan

Revert FE PR(s). No FE migration. After BE enforcement, full rollback reintroduces create failures — keep inject if partially reverting.

## Dependencies

- BE `company-scoped-stock` shipped (`2026-07-13-company-scoped-stock`)
- Leave `meli-full-warehouse-ui` untouched

## Success Criteria

- [ ] Creates send `companyId`; blocked when “All”/null
- [ ] Transfer list filters by selected company
- [ ] Stock exposes/disambiguates by `companyId`
- [ ] Shared-catalog inventory pickers work
- [ ] STOCK import requires + binds company
- [ ] Unit tests + `tsc` + CI green

## Suggested PR slices

1. Stock identity + transfer list filters  
2. Create header inject + null guard  
3. Shared-catalog inventory pickers  
4. STOCK import company bind  

## Locked defaults

Guard over silent fail; shared-catalog inventory pickers; import requires selected company + FE inject; no per-form override in v1.
