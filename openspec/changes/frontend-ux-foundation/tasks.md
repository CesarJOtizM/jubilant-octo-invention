# Tasks: Frontend UX Foundation

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | 700–1100 |
| 400-line budget risk | High |
| Chained PRs recommended | Yes |
| Suggested split | PR A → PR B → PR C |
| Delivery strategy | ask-on-risk |
| Chain strategy | feature-branch-chain |

Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High

### Suggested Work Units

| Unit | Goal | Likely PR | Notes |
|------|------|-----------|-------|
| A | Codec+hook+tests; inventory store+4 lists; header/pagination aria-label | PR A | Base `feat/frontend-ux-foundation` tracker |
| B | Migrate remaining lists to URL hook | PR B | Base = PR A branch |
| C | Remaining icon-button a11y (excl. integrations) | PR C | Base = PR B branch |

**Human gate before sdd-apply:** Confirm **feature-branch-chain** (tracker + A→B→C) and approve Unit A. Do not implement until approved. `ready_for_apply: false` until that gate.

---

## Phase 1: Shared codec + hook (PR A)

- [ ] 1.1 RED: `tests/shared/presentation/lib/list-search-params.spec.ts` — CSV arrays; omit defaults/empty; invalid → defaults (no throw)
- [ ] 1.2 GREEN: create `src/shared/presentation/lib/list-search-params.ts` (`parseListParams` / `serializeListParams`)
- [ ] 1.3 RED: `tests/shared/presentation/hooks/use-list-search-params.spec.ts` — debounce; `replace` not push; reset clears QS; skip no-op replace
- [ ] 1.4 GREEN: create `src/shared/presentation/hooks/use-list-search-params.ts`; export from `hooks/index.ts`

## Phase 2: Inventory URL + shell a11y (PR A)

- [ ] 2.1 RED: `tests/modules/inventory/infrastructure/store/inventory.store.spec.ts` — partialize MUST NOT include `*Filters`
- [ ] 2.2 GREEN: strip filter fields/actions from `inventory.store.ts`; `partialize` only `selectedWarehouseId`; remove filter hooks from `use-inventory-store.ts`
- [ ] 2.3 RED: product-list specs — deep link restores; empty URL → defaults; companyId not in URL
- [ ] 2.4 GREEN: `product-list-params.ts` + migrate `product-list.tsx` (+ filters); Suspense on page if needed
- [ ] 2.5 RED→GREEN: same for `warehouse-list`, `stock-table`/stock list, `category-list` (+ per-list params schemas)
- [ ] 2.6 RED: header + table-pagination specs — theme/logout/prev/next have non-empty i18n `aria-label`
- [ ] 2.7 GREEN: `src/ui/layout/header.tsx` + `src/ui/components/table-pagination.tsx` + en/es i18n keys
- [ ] 2.8 Verify PR A: scoped `vitest run` + `tsc --noEmit`

## Phase 3: Remaining lists (PR B)

- [ ] 3.1 RED→GREEN: `sale-list` (+ params) — URL SoT; inject `selectedCompanyId` at query time only
- [ ] 3.2 RED→GREEN: `movement-list`, `transfer-list`, `return-list` (+ params)
- [ ] 3.3 RED→GREEN: `contact-list`, `user-list`, `brand-list`, `company-list` (+ params)
- [ ] 3.4 RED→GREEN: `audit-log-list`, `combo-list`; confirm `role-list` migrate vs a11y-only during apply
- [ ] 3.5 GREEN: Suspense on remaining list page wrappers if missing `useSearchParams` boundary
- [ ] 3.6 Verify PR B: list vitest specs + `tsc --noEmit`

## Phase 4: Icon a11y sweep (PR C)

- [ ] 4.1 RED: component specs for icon-only view/edit/back/row actions (inventory + sales samples)
- [ ] 4.2 GREEN: aria-label sweep on in-scope list/detail/form icon buttons; **skip** `modules/integrations/**`
- [ ] 4.3 Verify PR C: a11y specs + full `vitest run` + `tsc --noEmit`

## Apply readiness

- ready_for_apply: **false** (human gate: feature-branch-chain + Unit A approval)
- next: **sdd-apply** after gate — Unit A only first
