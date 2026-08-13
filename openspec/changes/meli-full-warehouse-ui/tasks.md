# Tasks: Frontend fullWarehouseId for MeLi Connection

## Review Workload Forecast

| Field | Value |
|-------|-------|
| Estimated changed lines | ~180 |
| 400-line budget risk | Low |
| Chained PRs recommended | No |
| Single PR | Yes |

## Tasks (Single PR)

- [x] **T-1** — Add `fullWarehouseId: string | null` and `fullWarehouseName: string | null` to `IntegrationConnectionProps` + getters in `integration-connection.entity.ts`. **REQ-1** | ~6 lines
  - `feat(integrations): add fullWarehouseId to IntegrationConnection entity` → `45eff06`

- [x] **T-2** — Add `fullWarehouseId` to `CreateIntegrationConnectionDto`, `UpdateIntegrationConnectionDto`, and `IntegrationConnectionResponseDto` in `integration-connection.dto.ts`. **REQ-2** | ~6 lines
  - `feat(integrations): add fullWarehouseId to connection DTOs` → `a74a9a6`

- [x] **T-3** — Map `fullWarehouseId` and `fullWarehouseName` in `IntegrationConnectionMapper.toDomain()` in `integration-connection.mapper.ts`. **REQ-3** | ~4 lines
  - `feat(integrations): map fullWarehouseId in connection mapper` → `367769f`

- [x] **T-4** — Add `fullWarehouseId: z.string().optional()` to `meliConnectionSchema`. Add to `toMeliCreateConnectionDto()`. Add to update schema/transform if it exists. In `integration-connection.schema.ts`. **REQ-4** | ~6 lines
  - `feat(integrations): add fullWarehouseId to Zod schemas and transforms` → `0631d61`

- [x] **T-5** — Add translations for fulfillment warehouse in `es.json` and `en.json`. **REQ-7** | ~20 lines
  - `feat(i18n): add fulfillment warehouse translations` → `62094ee`

- [x] **T-6** — Add fullWarehouseId Select field to `meli-connection-form.tsx`. Follow exact pattern of `defaultWarehouseId` Select. Use Controller + Select from shadcn. Mark as optional. Include helper description text. **REQ-5** | ~40 lines
  - `feat(integrations): add fullWarehouseId select to MeLi connection form` → `146d954`

- [x] **T-7** — Display fullWarehouseName in `meli-connection-detail.tsx`. Resolve name from warehouses list. Show "Not configured" when null. **REQ-6** | ~15 lines
  - `feat(integrations): show fullWarehouseName in MeLi connection detail` → `ac60347`

- [x] **T-8** — Write unit tests for the form (fullWarehouseId select renders, submits with/without value) and detail (shows name, shows "not configured"). **Scenarios 1-5** | ~80 lines
  - `test(integrations): fullWarehouseId form and detail tests` → `b0d3a13`

## Dependency Graph

T-1 → T-3
T-2 → T-4
T-5 (independent)
T-1, T-2, T-4, T-5 → T-6
T-1, T-2, T-3, T-5 → T-7
T-6, T-7 → T-8
