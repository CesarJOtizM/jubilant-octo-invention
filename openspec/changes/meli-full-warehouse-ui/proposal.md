# Proposal: MeLi fullWarehouseId UI Support

## Intent

The backend now supports `fullWarehouseId` on IntegrationConnection for MeLi fulfillment orders. The frontend must expose this optional field so users can designate which warehouse represents MeLi's fulfillment center when creating/editing a MeLi connection.

## Scope

### In Scope
- Add `fullWarehouseId` + `fullWarehouseName` to domain entity, DTOs, and mapper
- Add to `meliConnectionSchema` (Zod) + `toMeliCreateConnectionDto` transform
- Add optional "Full Warehouse" Select in `MeliConnectionForm` (same `useWarehouses()` data source)
- Display `fullWarehouseName` in `MeliConnectionDetail` info card
- Add i18n keys (`es.json` + `en.json`)
- Unit tests for mapper, schema, and transform changes

### Out of Scope
- VTEX connection form (no fulfillment concept)
- Backend changes (done in improved-parakeet)
- Sync logic changes
- Update connection form (separate change if needed)

## Capabilities

### New Capabilities
None

### Modified Capabilities
- `integration-connection`: Add optional `fullWarehouseId`/`fullWarehouseName` fields across domain, DTOs, schema, form, and detail view for MeLi connections

## Approach

Mirror the existing `defaultWarehouseId` pattern exactly:
- Same optional `z.string().optional()` Zod field
- Same `<Select>` component with `useWarehouses()` as data source
- Same warehouse name resolution in detail view (`warehouses.find()` fallback to `fullWarehouseName`)
- Field is OPTIONAL: empty = no fulfillment routing

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/modules/integrations/domain/entities/integration-connection.entity.ts` | Modified | Add `fullWarehouseId`, `fullWarehouseName` props + getters |
| `src/modules/integrations/application/dto/integration-connection.dto.ts` | Modified | Add fields to Response, Create, Update DTOs |
| `src/modules/integrations/application/mappers/integration-connection.mapper.ts` | Modified | Map new fields in `toDomain()` |
| `src/modules/integrations/presentation/schemas/integration-connection.schema.ts` | Modified | Add to `meliConnectionSchema` + `toMeliCreateConnectionDto` |
| `src/modules/integrations/presentation/components/meli-connection-form.tsx` | Modified | Add optional warehouse Select after default warehouse |
| `src/modules/integrations/presentation/components/meli-connection-detail.tsx` | Modified | Display fullWarehouseName in info card |
| `src/lib/messages/es.json` | Modified | Add `form.fullWarehouse*` i18n keys |
| `src/lib/messages/en.json` | Modified | Add `form.fullWarehouse*` i18n keys |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|------------|
| Backend DTO shape mismatch | Low | Verify backend response includes `fullWarehouseId`/`fullWarehouseName` before deploy |
| Existing tests break | Low | Changes are additive; optional fields won't break existing assertions |

## Rollback Plan

Revert the single PR. All changes are additive — removing them restores previous behavior. No data migration involved (backend handles persistence).

## Dependencies

- Backend `fullWarehouseId` support deployed (improved-parakeet)

## Success Criteria

- [ ] MeLi connection form shows optional "Full Warehouse" select
- [ ] Creating a MeLi connection sends `fullWarehouseId` when selected
- [ ] MeLi detail page displays full warehouse name when set
- [ ] All existing integration tests pass (339+ unit tests green)
- [ ] i18n keys present in both `es.json` and `en.json`
- [ ] TypeScript compiles with no errors (`tsc --noEmit`)
