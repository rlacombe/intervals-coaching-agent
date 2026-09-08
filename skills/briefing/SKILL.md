---
description: Create an athlete-owned calendar note
user-invocable: true
---

# Calendar Note

Draft a concise note from verified facts, accepted decisions, and explicitly
labeled estimates. Show its exact date, title, and body. An explicit request to
save a fully specified note authorizes the write; otherwise ask once. Calendar
writes require Intervals.icu: call `create_event` with `category: NOTE`, then
read it back with `get_event` and report its ID. If the result is ambiguous, read
before retrying. Never place secrets,
third-party comments, or unsupported medical claims in a note.
