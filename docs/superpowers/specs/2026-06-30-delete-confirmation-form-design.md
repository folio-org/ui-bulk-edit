# Delete confirmation form — banner, title & subtitle

**Ticket:** UIBULKED-26 (Bulk delete user records)
**Date:** 2026-06-30

## Goal

On the bulk **delete** confirmation form, show a delete-specific success banner, pane
title, and pane subtitle. Today these strings are worded for the update ("changed")
flow. The confirmation form is the `COMMIT` step of a bulk operation whose
`operationType === DELETE`.

The body headline ("Query: (…)" / "Filename: …") already renders correctly and is out
of scope.

### Mockup reference

For a query-based user delete where 88 records matched and 85 were deleted:

- Pane title: `Bulk edit query (groups.group ==undergrad)`
- Pane subtitle: `88 user records match • 85 user records deleted`
- Green success banner: `85 user records have been successfully deleted.`

## Decisions

- **Pane title:** always append the query text / filename whenever present (all steps and
  both update + delete operations), not delete-only.
- **Scope:** apply the delete banner + subtitle to **both** the Query and Identifier
  delete flows.
- **Subtitle:** two-part format combining the matched total and the deleted count.

## Changes

### 1. Green banner — `PreviewContainer.js`

Currently always renders `ui-bulk-edit.recordsSuccessfullyChanged`
("{value} records have been successfully changed").

When `bulkDetails.operationType === DELETE`, render a new key that includes the record
type:

- New key **`recordsSuccessfullyDeleted`** =
  `"{value, number} {recordType} records have been successfully deleted."`
- `value` = `committedNumOfRecords` (the deleted count, e.g. 85).
- `recordType` = `RECORD_TYPES_MAPPING[currentRecordType]` (e.g. `user`), read from
  `useSearchParams()`.

Non-delete operations keep the existing `recordsSuccessfullyChanged` banner unchanged.

### 2. Pane subtitle — `BulkEditQuery.js` and `BulkEditIdentifiers.js`

Currently both build the subtitle as
`ui-bulk-edit.list.logSubTitle.${step === UPLOAD ? 'matched' : 'changed'}` with a single
`count`.

When `operationType === DELETE` **and** the step is `COMMIT`, render a new two-part key:

- New key **`list.logSubTitle.delete`** =
  `"{matchedCount, number} {recordType} records match • {deletedCount, number} {recordType} records deleted"`
- `matchedCount` = `matchedNumOfRecords` (e.g. 88) — at COMMIT this is the `totalCount`
  returned by `getBulkOperationStatsByStep`.
- `deletedCount` = `committedNumOfRecords` (e.g. 85) — the `countOfRecords` at COMMIT.

UPLOAD step and non-delete operations keep the existing `matched` / `changed` strings.

Both components currently duplicate this subtitle logic. Extract a shared helper
**`getPaneSubtitle`** into `PreviewLayout/helpers.js` that, given the bulk details +
step, returns the correct `FormattedMessage` (handling the `matched` / `changed` /
`delete` / default `logSubTitle` cases). Both panes call this helper, so the delete
branch lives in one place.

### 3. Pane title — `BulkEditQuery.js`

Currently `paneTitle` renders `ui-bulk-edit.meta.query.title` ("Bulk edit query") with no
query text.

Append the query text when a query is present:

- **`meta.query.title`** → `"Bulk edit query {queryText}"`
- **`meta.query.title.marc`** → `"Bulk edit MARC fields query {queryText}"`
- `queryText` = `bulkDetails.userFriendlyQuery` (already includes surrounding parens, e.g.
  `(groups.group == undergrad)`).

The Identifier pane title already appends the filename via
`meta.title.uploadedFile` / `meta.title.uploadedFile.marc`, so no title change is needed
there.

## Translations

Add the new English strings to `translations/ui-bulk-edit/en.json`:

- `recordsSuccessfullyDeleted`
- `list.logSubTitle.delete`
- (modify) `meta.query.title`, `meta.query.title.marc` to accept `{queryText}`

Run `yarn formatjs-compile` after editing source strings.

## Testing

- `BulkEditListResult.test.js` (covers `PreviewContainer`): delete banner wording +
  record type; non-delete banner unchanged.
- `BulkEditQuery.test.js`: title includes query text; subtitle two-part on COMMIT+DELETE;
  `matched`/`changed` preserved otherwise.
- `BulkEditIdentifiers.test.js`: subtitle two-part on COMMIT+DELETE; existing title +
  subtitle preserved otherwise.
- `helpers.test.js`: unit-test the new `getPaneSubtitle` helper for each branch.

## Out of scope

- Error & warnings accordion behavior (scenarios 1–3 are existing behavior).
- "Download errors (CSV)" action (existing behavior).
- The body headline ("Query:" / "Filename:").
