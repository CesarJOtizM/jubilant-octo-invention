# Proposal: Frontend UX Foundation (Sprint 1)

## Intent

List filters/pagination/sort are not deep-linkable (inventory persists in Zustand/localStorage; other lists reset). Icon-only controls often lack accessible names. Deliver **URL as sole SoT for list UI state** and **`aria-label` on icon-only buttons** (exclude integrations until `meli-full-warehouse-ui` merges).

**Locked decisions:** `useSearchParams` + locale-aware `router.replace` (**no `nuqs`**); **all** lists; **stop** filter localStorage (empty URL → defaults); `selectedCompanyId` stays **global**. Sprint 2/3 deferred.

## Scope

### In Scope
- Shared `useListSearchParams` (Zod; debounce search; `replace`; omit defaults).
- Migrate **all** lists (Zustand inventory + all local-state lists across modules).
- Drop inventory filters from Zustand `partialize`.
- `aria-label` on header theme/logout, pagination, view/edit/back, list row actions.
- Unit tests (strict TDD).

### Out of Scope
Brand/typography, auth layout, Inventory nav grouping, PageHeader, reduced-motion, skip-link, unsaved-form guards, virtualization, integrations a11y, backend/API.

## Capabilities

### New Capabilities
- `list-url-state`: URL sole SoT for list filters/pagination/sort; empty → defaults; company global.
- `icon-button-a11y`: Icon-only controls MUST have i18n `aria-label`; integrations deferred.

### Modified Capabilities
- None

## Approach

1. Add shared hook (`@/i18n/navigation` + Zod; one array serialization).
2. Inventory → URL + stop filter persist; other lists replace `useState` with the hook.
3. A11y: header/pagination first, then list/detail/form icons (skip integrations).
4. **Chained PRs (one change):** A) helper + inventory + header/pagination a11y; B) remaining lists; C) remaining icon sweep.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| shared presentation hooks | New | `useListSearchParams` |
| inventory store + lists | Modified | URL filters; no persist |
| Other list pages | Modified | Local state → URL |
| header, pagination, actions | Modified | `aria-label` |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Lost localStorage filters | Med | Empty URL = defaults |
| History spam / SSR | Med | Debounce; `replace` |
| Array encoding drift | Med | Shared serializer + tests |
| Review budget | High | Chained PRs A→B→C |
| Conflict with meli change | Low | Skip integrations a11y |

## Rollback Plan

Revert merged PR slice(s). Restores prior filter persistence/`useState`/a11y. No DB/API migration.

## Backend API Impact

**None expected** — FE-only. API list shapes unchanged; company via global `selectedCompanyId` / headers.

## Dependencies

Soft: defer integrations a11y until `meli-full-warehouse-ui` merges. No new packages.

## Success Criteria

- [ ] Deep link/refresh restores filters, sort, page, limit for all lists
- [ ] Empty URL → defaults; inventory filters not from localStorage
- [ ] Shared links omit company; recipient uses own `selectedCompanyId`
- [ ] In-scope icon-only controls have `aria-label`
- [ ] Hook + list/store tests pass (`vitest run`)
