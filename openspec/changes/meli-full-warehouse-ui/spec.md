# Spec: meli-full-warehouse-ui

## Capability
Expose `fullWarehouseId` field in the MeLi integration connection UI — creation form + detail page.

## Requirements

### REQ-1: Domain Entity Extension
`IntegrationConnectionEntity` MUST include `fullWarehouseId: string | null` and `fullWarehouseName: string | null` in its properties and getters.

### REQ-2: DTO Extension
- `IntegrationConnectionResponseDto` MUST include `fullWarehouseId?: string | null` and `fullWarehouseName?: string | null`
- `CreateIntegrationConnectionDto` MUST include `fullWarehouseId?: string`
- `UpdateIntegrationConnectionDto` MUST include `fullWarehouseId?: string`

### REQ-3: Mapper Extension
`IntegrationConnectionMapper.toDomain()` MUST map `fullWarehouseId` and `fullWarehouseName` from the response DTO to the domain entity.

### REQ-4: Zod Schema Extension
- `meliConnectionSchema` MUST include `fullWarehouseId: z.string().optional()`
- `toMeliCreateConnectionDto()` MUST include `fullWarehouseId` in the output when provided
- Any update schema/transform MUST also include `fullWarehouseId`

### REQ-5: MeLi Connection Form
The MeLi connection form MUST include an OPTIONAL `fullWarehouseId` Select field:
- Same warehouse data source as `defaultWarehouseId` (from `useWarehouses()`)
- Labeled "Almacén Fulfillment" (ES) / "Fulfillment Warehouse" (EN)
- With placeholder "Seleccionar almacén (opcional)" / "Select warehouse (optional)"
- A helper description explaining this is for MeLi Full orders
- NOT required — user can leave empty
- Positioned AFTER the `defaultWarehouseId` field

### REQ-6: MeLi Connection Detail
The MeLi connection detail page MUST display `fullWarehouseName` when configured:
- Show in the Connection Info card alongside `defaultWarehouseId` info
- Resolve name from warehouses list, fallback to `fullWarehouseName` from backend, fallback to raw ID
- When not configured, show "Not configured" / "No configurado"

### REQ-7: Translations
`es.json` and `en.json` MUST include translation keys for:
- `integrations.form.fulfillmentWarehouse` — field label
- `integrations.form.fulfillmentWarehousePlaceholder` — select placeholder
- `integrations.form.fulfillmentWarehouseDescription` — helper text
- `integrations.detail.fulfillmentWarehouse` — detail label
- `integrations.detail.notConfigured` — fallback text

## Test Scenarios

### Scenario 1: Form renders fullWarehouseId select
Given: MeLi connection form is rendered
When: user views the form
Then: a fullWarehouseId select field is visible with warehouse options

### Scenario 2: Form submits with fullWarehouseId
Given: user selects a warehouse for fullWarehouseId
When: form is submitted
Then: the create DTO includes fullWarehouseId

### Scenario 3: Form submits without fullWarehouseId
Given: user leaves fullWarehouseId empty
When: form is submitted
Then: the create DTO does NOT include fullWarehouseId (or includes undefined)

### Scenario 4: Detail shows fullWarehouseName
Given: a connection with fullWarehouseId configured
When: detail page is rendered
Then: the fulfillment warehouse name is displayed

### Scenario 5: Detail shows "Not configured" when empty
Given: a connection without fullWarehouseId
When: detail page is rendered
Then: "Not configured" / "No configurado" is shown

## Traceability

| Requirement | Test Scenarios | PR |
|---|---|---|
| REQ-1 | (Type-level) | PR 1 |
| REQ-2 | (Type-level) | PR 1 |
| REQ-3 | (Type-level) | PR 1 |
| REQ-4 | 2, 3 | PR 1 |
| REQ-5 | 1, 2, 3 | PR 1 |
| REQ-6 | 4, 5 | PR 1 |
| REQ-7 | 1, 4, 5 | PR 1 |
