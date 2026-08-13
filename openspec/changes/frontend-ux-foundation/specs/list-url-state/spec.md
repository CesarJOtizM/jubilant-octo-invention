# Delta for list-url-state

## ADDED Requirements

### Requirement: URL Sole Source of Truth for List UI State

List pages MUST treat the URL query string as the sole source of truth for filters, pagination, and sort. The system MUST sync this state via a shared client hook based on `useSearchParams` and locale-aware `router.replace` (`@/i18n/navigation`). The system MUST NOT introduce `nuqs` or another URL-state library. Filter values MUST NOT be persisted in `localStorage` or Zustand persistence.

Affected modules: `modules/inventory`, `modules/sales`, `modules/returns`, `modules/contacts`, `modules/users`, `modules/brands`, `modules/companies`, `modules/audit`, and other in-scope list presentation surfaces; shared codec/hook under `shared/presentation`.

#### Scenario: Deep link restores list state

- GIVEN a user opens a list URL with non-default filter, sort, page, and limit query params
- WHEN the list page loads
- THEN the list UI and data query MUST reflect those parsed values

#### Scenario: Refresh preserves state

- GIVEN a user has changed filters, sort, or pagination so the URL reflects them
- WHEN the browser refreshes
- THEN the same list UI state MUST be restored from the URL

#### Scenario: Empty URL applies defaults

- GIVEN a list URL with no (or only empty) query params
- WHEN the list page loads
- THEN filters, sort, page, and limit MUST equal the list’s declared defaults

#### Scenario: Inventory filters not restored from localStorage

- GIVEN prior inventory filter values existed only in persisted Zustand/`localStorage`
- WHEN the user opens an inventory list with an empty query string
- THEN those persisted filters MUST NOT apply and defaults MUST be used

---

### Requirement: Shared List Search Params Behavior

All in-scope lists MUST use the shared list search-params hook/codec. Writes that change URL state MUST use `router.replace` (MUST NOT `push` for ordinary filter/pagination/sort updates). Search-like keys MUST be debounced before replace. Serialization MUST omit keys whose values equal defaults or are empty. Array values MUST use one shared encoding (CSV). Invalid param values MUST fall back to defaults for that key without throwing. `companyId` / selected company MUST NOT appear in list URLs; company scope MUST remain global (`selectedCompanyId`) and be injected at query time.

#### Scenario: Debounced search replace

- GIVEN a list with a search field marked as a debounced key
- WHEN the user types into search
- THEN the URL MUST update via `replace` only after the debounce interval
- AND intermediate keystrokes MUST NOT create history entries

#### Scenario: Default params omitted from URL

- GIVEN list values equal the declared defaults after a reset or change
- WHEN the hook serializes to the URL
- THEN default-valued keys MUST be omitted from the query string

#### Scenario: Company excluded from shared list links

- GIVEN a user copies or shares a list URL with filters applied
- WHEN another user opens that URL under their own session
- THEN the link MUST NOT encode company id
- AND list data MUST use the recipient’s global `selectedCompanyId`

#### Scenario: All in-scope lists migrated

- GIVEN any in-scope business list that previously used local `useState` or Zustand filter state for filters/pagination/sort
- WHEN this change is complete
- THEN that list MUST read and write those fields through the shared URL hook
