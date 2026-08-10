> **Note:** This document was drafted with AI assistance and reviewed,
> corrected, and approved by a human maintainer before being merged.

# Shelter Backup Format

> Binary format for `.shelter` files. Defines how a complete data snapshot
> is packaged for export/import. Does NOT define what an Entry or User
> looks like — that lives in `data-schema.md`.

Identified by the magic bytes `SHLT`. It's static: it describes a complete
state at a single point in time, not incremental operations (that's sync,
see `sync-protocol.md`).

`FORMAT_VERSION` lives in this document. It increments when the **binary
layout** of the file changes — the header, how the checksum is computed,
how blocks are delimited. It does not increment because of changes to the
shape of an Entry.

---

## Current FORMAT_VERSION: `1`

## File Structure

```
[HEADER 32 bytes]
[META JSON (variable)]
[BLOCK 1]
[BLOCK 2]
...
[BLOCK N]
```

## Header (32 bytes)

| Offset | Size | Field          | Type       | Description                           |
|--------|------|----------------|------------|---------------------------------------|
| 0–3    | 4    | magic          | `u8[4]`    | Always `SHLT`                         |
| 4      | 1    | FORMAT_VERSION | `u8`       | Binary layout of this file            |
| 5      | 1    | SCHEMA_VERSION | `u8`       | References `data-schema.md`           |
| 6      | 1    | mode           | `u8`       | Export mode (see below)               |
| 7      | 1    | compressed     | `u8`       | `0x00` = none, `0x01` = compressed    |
| 8–15   | 8    | timestamp      | `i64 BE`   | Unix timestamp in milliseconds        |
| 16–19  | 4    | metaLength     | `u32 BE`   | Length of meta JSON in bytes          |
| 20–23  | 4    | totalBlocks    | `u32 BE`   | Number of blocks following meta       |
| 24–27  | 4    | checksum       | `u32 BE`   | CRC32 of all blocks payload           |
| 28–31  | 4    | reserved       | `u8[4]`    | Reserved for future use, set to 0     |

**Important:** `SCHEMA_VERSION` here isn't the backup format's own
counter — it's a direct reference to the number defined in
`data-schema.md`. If the data schema bumps to version 3, a new backup
writes `SCHEMA_VERSION=3` in this byte, regardless of what
`FORMAT_VERSION` the binary layout is currently at.

### Export Modes

| Value  | Name         | Description                        |
|--------|--------------|-------------------------------------|
| `0x01` | Full         | User block + all entry blocks       |
| `0x02` | EntriesOnly  | Entry blocks only, no user block    |

## Meta JSON

Immediately follows the header. Length defined by `metaLength`.

```json
{
  "metaVersion": 1,
  "appVersion": "0.x.x",
  "username": "stageddat",
  "totalEntries": 42,
  "encrypted": true,
  "platform": "web"
}
```

## Blocks

Each block is self-describing; unknown types are skipped, not rejected
(forward compatibility).

| Offset | Size | Field  | Type     | Description             |
|--------|------|--------|----------|--------------------------|
| 0      | 1    | type   | `u8`     | Block type identifier    |
| 1–4    | 4    | length | `u32 BE` | Length of data in bytes  |
| 5+     | N    | data   | `u8[N]`  | JSON-encoded data, shaped per `data-schema.md` for the `SCHEMA_VERSION` declared in the header |

### Block Types

| Value  | Name  | Schema reference          |
|--------|-------|-----------------------------|
| `0x01` | User  | `User` in `data-schema.md`  |
| `0x02` | Entry | `Entry` in `data-schema.md` |

---

## Compatibility

| FORMAT_VERSION | SCHEMA_VERSION | App Version | Notes                            |
|-----------------|-----------------|-------------|------------------------------------|
| 1               | 2               | 0.7.4       | Recovery key fields (schema v2)    |
| 1               | 1               | 0.6.0       | Initial release (schema v1)        |

### Rules

- A client **must reject** files where `FORMAT_VERSION < MIN_SUPPORTED_FORMAT`
  or `FORMAT_VERSION > FORMAT_VERSION` (current).
- A client **must reject** files where `SCHEMA_VERSION < MIN_SUPPORTED_SCHEMA`
  (see compatibility rules in `data-schema.md`).
- A client **should warn** (but not reject) files where `SCHEMA_VERSION` is
  higher than what it supports — the file may come from a newer app
  version.
- Unknown block types **must be skipped**, not rejected.

---

## If you bump ONLY the schema (without touching the binary layout)

This is the exact case you might wonder about. Example: you add a new
field to `Entry` in `data-schema.md`, bump `SCHEMA_VERSION` from 2 to 3,
but the 32-byte header, block ordering, and checksum computation stay
exactly the same.

**What to update here:**
1. Nothing in the header structure — it's still 32 bytes, same offsets.
2. `FORMAT_VERSION` **does not increment**. The binary layout didn't change.
3. When writing a new backup, the `SCHEMA_VERSION` byte in the header
   simply reflects the new number (3).
4. Add a row to the Compatibility table above: same `FORMAT_VERSION`, new
   `SCHEMA_VERSION`.
5. Import logic must keep working for old backups with `SCHEMA_VERSION=2`:
   new schema fields come back as `undefined`.

**What NOT to touch:** the header parser, CRC32 computation, block
delimiting logic. None of that depends on the schema.