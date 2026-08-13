# Company-Scoped Stock UI Specification

## Purpose

FE companion to BE `company-scoped-stock`. Creates and inventory reads MUST use selected company (`stock`/`header` `companyId`), not `product.companyId`. Modules: `sales`, `returns`, `inventory`, `imports`, `companies`.

## Requirements

### Requirement: Create Header Company Injection

On Sale, Movement, Transfer, or Return create, the system MUST inject header `companyId` from `useCompanyStore.selectedCompanyId` into DTO / Zod transform / submit body. The system MUST NOT offer a per-form company override.

#### Scenario: Selected company sent on create

- GIVEN non-null `selectedCompanyId`
- WHEN user submits Sale, Movement, Transfer, or Return create
- THEN request body SHALL include that `companyId`

#### Scenario: Transform includes companyId

- GIVEN create data transforms to a create DTO with selected company available
- WHEN transform runs
- THEN DTO MUST contain non-empty `companyId`

### Requirement: Fail-Closed Guard When Company Is All or Null

Create flows MUST NOT submit when `selectedCompanyId` is `null` (“All companies”). UI MUST block submit and SHOULD show copy to select a specific company.

#### Scenario: Create blocked on All

- GIVEN `selectedCompanyId` is `null`
- WHEN user opens or submits create for Sale, Movement, Transfer, or Return
- THEN submit MUST be prevented
- AND messaging MUST require a specific company

#### Scenario: Create enabled after company select

- GIVEN create was blocked for All/null
- WHEN user selects a specific company globally
- THEN submit MUST become available via store reactivity

### Requirement: Stock Company Identity

Stock entity, DTO, and mapper MUST expose `companyId`. Row identity and product+warehouse lookups MUST disambiguate by `companyId`.

#### Scenario: Stock row exposes companyId

- GIVEN API stock rows include `companyId`
- WHEN mapped to FE stock models
- THEN each row MUST retain `companyId`

#### Scenario: Same SKU buckets stay distinct

- GIVEN two buckets share product+warehouse but differ in `companyId`
- WHEN shown in stock table/detail
- THEN UI MUST treat them as distinct rows

#### Scenario: Product+warehouse lookup is company-aware

- GIVEN resolve stock for product at warehouse under selected company
- WHEN lookup runs
- THEN it MUST use `companyId` (MUST NOT return the wrong company bucket)

### Requirement: Transfer List Company Filter

Transfer list MUST pass `companyId` from the global selector when non-null, matching other inventory/sales lists. When null, MUST NOT inject a company filter (All behavior).

#### Scenario: Transfer list filtered by company

- GIVEN non-null `selectedCompanyId`
- WHEN transfer list loads
- THEN request MUST include that `companyId` filter

#### Scenario: Transfer list unfiltered when All

- GIVEN `selectedCompanyId` is `null`
- WHEN transfer list loads
- THEN request MUST omit company filter from global selector

### Requirement: Shared-Catalog Inventory Product Pickers

Inventory document pickers (movement, transfer, sale, return, related selects) MUST NOT gate by `product.companyId`. Shared/active catalog products MUST remain selectable. Product-admin ownership filters are out of scope.

#### Scenario: Shared SKU selectable in inventory picker

- GIVEN active shared-catalog product
- WHEN user searches in an inventory document picker
- THEN product MUST be selectable even if `product.companyId` is null or another company

#### Scenario: Product admin list unchanged

- GIVEN product admin uses ownership filters
- WHEN this change ships
- THEN admin ownership filtering MAY stay unchanged

### Requirement: STOCK Import Company Bind

STOCK import preview/execute MUST require non-null `selectedCompanyId` and MUST bind it into the import request. All/null MUST block with clear copy.

#### Scenario: STOCK preview/execute injects company

- GIVEN specific company selected and STOCK import open
- WHEN preview or execute runs
- THEN FE MUST send selected `companyId` with the call

#### Scenario: STOCK import blocked without company

- GIVEN `selectedCompanyId` is `null`
- WHEN user attempts STOCK preview or execute
- THEN action MUST be blocked
- AND UI MUST require a specific company
