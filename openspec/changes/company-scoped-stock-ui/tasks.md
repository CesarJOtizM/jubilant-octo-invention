# Tasks: Company-Scoped Stock UI

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 550–900 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR1 → PR2 → PR3 → PR4 |
| Delivery strategy | auto-chain (user-approved) |
| Chain strategy | feature-branch-chain |

Decision needed before apply: No
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| 1 | Stock identity + transfer filters | PR 1 | Base `feat/company-scoped-stock-ui` tracker |
| 2 | Create inject + Guard | PR 2 | Base PR1 |
| 3 | Shared-catalog pickers | PR 3 | Base PR2 |
| 4 | STOCK import bind | PR 4 | Base PR3 |

User approved apply with **feature-branch-chain**. Active slice: Unit 1 / PR1.

---

## Phase 1: Stock identity + transfer filters (PR1)

- [x] 1.1 RED: `stock.entity.spec.ts` — Given `companyId`, When create, Then retain; distinct buckets
- [x] 1.2 GREEN: `stock.entity.ts` + `stock.dto.ts` add `companyId`
- [x] 1.3 RED: `stock.mapper.spec.ts` — map `companyId`; composite id includes it
- [x] 1.4 GREEN: `stock.mapper.ts` fallback `${productId}:${warehouseId}:${companyId}:${i}`
- [x] 1.5 RED: `stock-api.adapter.spec.ts` — lookup appends `companyId` query when set
- [x] 1.6 GREEN: `companyId?` on `stock.repository.port.ts` + `stock-api.adapter.ts`; wire `use-stock.ts`
- [x] 1.7 RED: `transfer-list.spec.tsx` — non-null store → filter; null → omit
- [x] 1.8 GREEN: `TransferFilters.companyId?` in `transfer.dto.ts`; inject `transfer-list.tsx` + adapter
- [x] 1.9 Verify: vitest stock/transfer + `tsc --noEmit`

## Phase 2: Create inject + CompanyRequiredGuard (PR2)

- [ ] 2.1 RED: sale/movement/transfer/return schema specs — `toCreate*` includes `companyId`
- [ ] 2.2 GREEN: require Create*Dto.companyId; `toCreate*(data, companyId)` in four schemas
- [ ] 2.3 RED: `company-required-guard.spec.tsx` — null blocks + copy; company enables
- [ ] 2.4 GREEN: create `companies/.../company-required-guard.tsx`
- [ ] 2.5 GREEN: wrap form pages; inject store id into `toCreate*` + adapters
- [ ] 2.6 GREEN: i18n keys in `messages/en.json` + `es.json`
- [ ] 2.7 RED/GREEN: form-page specs for inject + guard
- [ ] 2.8 Verify: vitest create/guard + `tsc --noEmit`

## Phase 3: Product pickers shared catalog (PR3)

- [ ] 3.1 RED: product-search/select specs — inventory picker omits ownership `companyId`
- [ ] 3.2 GREEN: stop passing ownership `companyId` from sale/movement/transfer/return pickers
- [ ] 3.3 Verify product-admin ownership filter unchanged
- [ ] 3.4 Verify: vitest pickers + `tsc --noEmit`

## Phase 4: STOCK import company bind (PR4)

- [ ] 4.1 RED: `import-api.adapter.spec.ts` — FormData company bind + CSV Company Code enrich
- [ ] 4.2 GREEN: `companyId?` on import port + `import-api.adapter.ts` preview/execute
- [ ] 4.3 RED: wizard tests — STOCK+null blocks; company allows
- [ ] 4.4 GREEN: gate `import-wizard-dialog.tsx`; resolve companyCode; reuse guard i18n
- [ ] 4.5 Verify: vitest imports + full `vitest run` + `tsc --noEmit`
