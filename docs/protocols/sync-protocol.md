> **Note:** This document was drafted with AI assistance and reviewed,
> corrected, and approved by a human maintainer before being merged.

# Shelter Sync Protocol

> Defines how two devices agree on what changed and in what order. Does NOT
> define what an Entry or User looks like ([`data-schema.md`](./data-schema.md)), nor how a
> complete snapshot is packaged ([`backup-format.md`](./backup-format.md)`).

Unlike backup, sync isn't a static snapshot — it's **incremental
operations**: create, update, delete, in order, with a way to detect and
resolve conflicts between devices.

`SYNC_PROTOCOL_VERSION` lives in this document. It increments when the
structure of operations changes, the conflict resolution algorithm
changes, or the envelope format changes. It does not increment because of
changes to the shape of an Entry.

---

## Current SYNC_PROTOCOL_VERSION: `1` (draft)

## Operation Envelope

Each sync operation is a separate object from the data itself. The
`payload` uses the shape defined in `data-schema.md`, with `schemaVersion`
declared explicitly because, unlike backup, sync may have operations of
different `SCHEMA_VERSION` coexisting in the same session (two devices out
of sync on app version).

```json
{
  "opId": "uuid",
  "entityType": "entry",
  "entityId": "uuid",
  "op": "create | update | delete",
  "schemaVersion": 2,
  "clock": {
    "device": "uuid",
    "counter": 42
  },
  "payload": { /* Entry or User shape per data-schema.md, absent if op=delete */ }
}
```

## Envelope Fields

| Field         | Description                                                        |
|---------------|-----------------------------------------------------------------------|
| `opId`        | Unique identifier for this operation (not the entity)                 |
| `entityType`  | `"entry"` or `"user"`                                                  |
| `entityId`    | UUID of the affected Entry/User                                       |
| `op`          | Operation type                                                        |
| `schemaVersion` | Reference to `data-schema.md`, version of the `payload`             |
| `clock`       | Identifies causal order — see Conflict Resolution below               |
| `payload`     | The data itself, absent on deletes (a delete is a tombstone, no payload needed) |

## Why the payload doesn't carry its own internal versioning

The `payload` is exactly the shape of `Entry`/`User` from
`data-schema.md` — unwrapped, no fields added by sync. Everything sync
needs to know (schema version, who and when) lives in the envelope, not
mixed into the data.

---

## Conflict Resolution

*(pending decision: simple LWW using `clock.counter` + `device` as
tie-breaker, or something finer-grained like per-field CRDTs. This
directly affects how `clock` is structured — update this section once
decided.)*

## Tombstones

A `delete` doesn't silently remove the entity — it's propagated as an
operation with `op: "delete"` and no `payload`, so other devices know it
should be removed rather than assuming it never existed.

---

## If you bump ONLY the schema (without touching the sync protocol)

Same case as with backup. You add a field to `Entry`, bump
`SCHEMA_VERSION` from 2 to 3 in `data-schema.md`.

**What to update here:**
1. Nothing in the envelope structure — it stays the same.
2. `SYNC_PROTOCOL_VERSION` **does not increment**. How operations are
   transmitted didn't change.
3. New operations simply carry `schemaVersion: 3` in the envelope.
4. The server/client must keep accepting operations with
   `schemaVersion: 2` from devices that haven't updated the app yet —
   same as backup, fill new fields as `undefined`.

**What NOT to touch:** the envelope structure, `clock` computation,
conflict resolution logic. None of that depends on the internal shape of
the `payload`.

---

## Relationship to backup

A complete backup can be thought of as "the result of applying, in order,
all sync operations from a device since the beginning" — but they're
independent representations. Backup doesn't carry `clock` or `opId`
because it doesn't need to reconstruct causal order between devices, only
represent the final state.