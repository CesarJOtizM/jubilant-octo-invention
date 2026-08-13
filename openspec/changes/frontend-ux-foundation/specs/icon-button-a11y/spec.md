# Delta for icon-button-a11y

## ADDED Requirements

### Requirement: Accessible Names for Icon-Only Controls

Icon-only interactive controls in scope MUST expose an accessible name via `aria-label` (or equivalent accessible name) using i18n strings (`next-intl`). Visible text labels alone do not apply to icon-only buttons. In-scope surfaces include app header actions (e.g. theme toggle, logout), table pagination controls, navigation/back and view/edit icon buttons, and list row action icon buttons.

Affected modules: shared shell/header and table pagination presentation; list/detail/form presentation under `modules/inventory`, `modules/sales`, `modules/returns`, `modules/contacts`, `modules/users`, `modules/brands`, `modules/companies`, `modules/audit`, and other in-scope UI (excluding integrations).

#### Scenario: Header icon buttons named

- GIVEN the authenticated app header renders icon-only actions (theme and logout)
- WHEN assistive technology reads those controls
- THEN each control MUST have a non-empty i18n `aria-label`

#### Scenario: Pagination icon buttons named

- GIVEN a list using shared table pagination with icon-only prev/next (or similar) controls
- WHEN those controls are exposed to the accessibility tree
- THEN each MUST have a non-empty i18n `aria-label`

#### Scenario: List row and view/edit/back icons named

- GIVEN a list row or detail/form toolbar renders icon-only view, edit, back, or similar actions
- WHEN the control is icon-only (no visible text)
- THEN it MUST have a non-empty i18n `aria-label`

---

### Requirement: Integrations Icon A11y Deferred

Icon-only controls under `modules/integrations` MUST remain out of scope for this change until soft dependency `meli-full-warehouse-ui` merges. The system MAY leave those controls unchanged in this change. A follow-up MUST cover integrations icon a11y after that merge.

#### Scenario: Integrations excluded from this change

- GIVEN icon-only buttons exist under `modules/integrations`
- WHEN this change is implemented and verified
- THEN those controls MUST NOT be required to gain `aria-label` as part of this change’s acceptance
