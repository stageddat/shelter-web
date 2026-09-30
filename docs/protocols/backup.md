# Shelter Backup Format

> Binary format specification for `.shelter` backup files.

The Shelter backup format is a custom binary format designed for encrypted, versioned, and portable backups of diary entries. It is identified by the magic bytes `SHLT` and supports forward/backward compatibility via versioned headers and schema blocks.

---

## File Structure

```
[HEADER 32 bytes]
[META JSON (variable)]
[BLOCK 1]
[BLOCK 2]
...
[BLOCK N]
```

---

## Header (32 bytes)

| Offset | Size | Field          | Type       | Description                           |
|--------|------|----------------|------------|---------------------------------------|
| 0–3    | 4    | magic          | `u8[4]`    | Always `SHLT` (`0x53 0x48 0x4C 0x54`) |
| 4      | 1    | FORMAT_VERSION | `u8`       | Binary layout version                 |
| 5      | 1    | SCHEMA_VERSION | `u8`       | Content schema version                |
| 6      | 1    | mode           | `u8`       | Export mode (see below)               |
| 7      | 1    | compressed     | `u8`       | `0x00` = none, `0x01` = compressed    |
| 8–15   | 8    | timestamp      | `i64 BE`   | Unix timestamp in milliseconds        |
| 16–19  | 4    | metaLength     | `u32 BE`   | Length of meta JSON in bytes          |
| 20–23  | 4    | totalBlocks    | `u32 BE`   | Number of blocks following meta       |
| 24–27  | 4    | checksum       | `u32 BE`   | CRC32 of all blocks payload           |
| 28–31  | 4    | reserved       | `u8[4]`    | Reserved for future use, set to 0     |

### Export Modes

| Value  | Name         | Description                        |
|--------|--------------|------------------------------------|
| `0x01` | Full         | User block + all entry blocks      |
| `0x02` | EntriesOnly  | Entry blocks only, no user block   |

---

## Meta JSON

Immediately follows the header. Length defined by `metaLength` in the header.

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

---

## Blocks

Each block follows the meta JSON. Blocks are self-describing and can be skipped if the type is unknown.

### Block Layout

| Offset | Size | Field     | Type     | Description              |
|--------|------|-----------|----------|--------------------------|
| 0      | 1    | type      | `u8`     | Block type identifier    |
| 1–4    | 4    | length    | `u32 BE` | Length of data in bytes  |
| 5+     | N    | data      | `u8[N]`  | JSON-encoded block data  |

### Block Types

| Value  | Name  | Description          |
|--------|-------|----------------------|
| `0x01` | User  | User account data    |
| `0x02` | Entry | Diary entry data     |

---

## Block Schemas

### User Block (`0x01`)

```json
{
  "id": "uuid",
  "username": "string",
  "displayName": "string",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601",
  "encryptedMasterKey": [/* Uint8Array as number[] */],
  "salt": [/* Uint8Array as number[] */],
  "iv": [/* Uint8Array as number[] */],
  "recoveryEncryptedMasterKey": [/* Uint8Array as number[], optional */],
  "recoverySalt": [/* Uint8Array as number[], optional */],
  "recoveryIv": [/* Uint8Array as number[], optional */]
}
```

### Entry Block (`0x02`)

```json
{
  "id": "uuid",
  "userId": "uuid",
  "encryptedTitle": [/* Uint8Array as number[] */],
  "titleIv": [/* Uint8Array as number[] */],
  "encryptedContent": [/* Uint8Array as number[] */],
  "contentIv": [/* Uint8Array as number[] */],
  "date": "YYYY-MM-DD",
  "time": "HH:MM",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601",
  "wordCount": 0,
  "charCount": 0
}
```

---

## Legacy Compatibility (Current Implementation)

| FORMAT_VERSION | SCHEMA_VERSION | App Version | Notes                          |
|----------------|----------------|-------------|--------------------------------|
| 1              | 2              | 0.7.4       | Added recovery key fields      |
| 1              | 1              | 0.6.0       | Initial release                |

The current implementation stores `FORMAT_VERSION` and `SCHEMA_VERSION` as separate one-byte
values. This is the legacy versioning scheme; the policy below is proposed for the next backup
format and is not implemented yet.

### Legacy Rules

- A client **must reject** files where `FORMAT_VERSION` is below `MIN_SUPPORTED_FORMAT` or above
  the current supported `FORMAT_VERSION`.
- A client **must reject** files where `SCHEMA_VERSION < MIN_SUPPORTED_SCHEMA`.
- A client **should warn** (but not reject) files where `SCHEMA_VERSION > current`, as they may have been created by a newer version of the app.
- Unknown block types **must be skipped**, not rejected — forward compatibility.

The current codec calculates the CRC32 over the header, not over the blocks payload as described
in the header table below. This is a known mismatch between the legacy implementation and this
format description.

---

## Proposed Versioning Policy

The next backup format should use one version for the complete backup data format, written as
`MAJOR.MINOR` (for example, `1.2`). This replaces the separate `FORMAT_VERSION`,
`SCHEMA_VERSION`, and `metaVersion` compatibility counters. `appVersion` remains informational
and identifies the Shelter release that created the backup.

The version describes the whole backup contract: the header, metadata, block layout, and the data
inside blocks. Its compatibility rules are:

- **Different major:** reject the backup. A major change means an older importer cannot safely
  understand the format.
- **Same major, backup minor is newer:** allow the user to continue after a warning that fields
  unknown to this app may be ignored and lost if the data is exported again.
- **Same major, backup minor is equal or older:** import normally.

This policy depends on strict rules for minor releases. A minor release may add optional fields or
unknown block types, but must not change the meaning or type of existing fields, remove required
fields, or change the binary layout. Importers must ignore unknown optional fields and skip unknown
block types. Any change that breaks those guarantees requires a new major version.

The exact encoding of `MAJOR.MINOR` in the binary header is still to be decided. This proposal
defines the compatibility policy, not a byte-level encoding. On a newer-minor warning, the app
should explain the possible loss before the user proceeds; it must not silently discard data.

### Compatibility Examples

| Importer supports | Backup version | Result |
|-------------------|----------------|--------|
| `1.3`             | `1.2`          | Import normally |
| `1.3`             | `1.7`          | Warn, then allow import; unknown newer fields may be lost |
| `1.3`             | `2.0`          | Reject: unsupported major |
| `2.0`             | `1.7`          | Reject unless explicit support for major `1` is implemented |

---

## Legacy Changelog

The labels below describe the old `metaVersion.schemaVersion` convention. They are historical
labels only; the proposed versioning policy above uses one `MAJOR.MINOR` version for the complete
backup format.

### v1.2 — Recovery Key Fields
**Added in app version:** `0.7.4`

Added optional recovery key fields to the User block:
- `recoveryEncryptedMasterKey` — master key encrypted with the recovery phrase derived key
- `recoverySalt` — PBKDF2 salt used to derive the key from the recovery phrase
- `recoveryIv` — AES-GCM IV used for encryption

These fields are `undefined` if the user has not generated a recovery key. Backups from SCHEMA_VERSION 1 remain fully compatible — missing fields are treated as `undefined` on import.

---

### v1.1 — Initial Format
**Added in app version:** `0.6.0`

Initial binary backup format with:
- 32-byte fixed header with magic `SHLT`
- Variable-length meta JSON block
- Self-describing binary blocks for User and Entry data
- CRC32 checksum over payload
- AES-GCM encrypted content (entries are encrypted, master key is wrapped)
