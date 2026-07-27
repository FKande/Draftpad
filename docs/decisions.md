## Phase 2: Notes CRUD

### 404 instead of 403 when a note isn't yours
All ownership-scoped queries filter on both `notes.id` and `notes.userId`, so a
note belonging to another user returns `undefined`, indistinguishable from a note
that never existed. Both cases return 404.

403 would confirm the id is real, letting an authenticated attacker enumerate
uuids and map which notes exist without reading any of them. 404 leaks nothing.
Same information-hiding principle as the generic "Wrong email or password" on login.

### 204 with no body on DELETE
The client already holds the note in state when it fires the delete, so returning
the deleted row would be redundant. 204 (no content) matches what the endpoint
actually communicates: it worked.

Returning 200 with the note would only matter for an undo affordance, and a real
undo needs soft deletes (a `deletedAt` column) rather than re-inserting a
hard-deleted row, since re-inserting would break any foreign keys pointing at the
old id. Revisit if undo is added.

### UUID validation as middleware, not inline
`GET`, `PATCH`, and `DELETE` on `/notes/:id` all take a uuid path param. Passing a
malformed string straight to Postgres raises `invalid input syntax for type uuid`,
which surfaces as a 500 through the error handler. That is a client error, not a
server error.

`validateUuidParam` runs a zod uuid schema against `req.params` and returns 400
before any database work happens. Written once as middleware rather than repeated
in three route bodies.

It is mounted *after* `requireAuth` deliberately: an unauthenticated request gets
401 and learns nothing about the id format or which routes exist.

Known limitation: the middleware reads `req.params.id` by name, so it won't cover
nested params like `/notes/:noteId/blocks/:blockId`. Fine today, revisit if the
route shape changes.

### `sql\`now()\`` instead of `new Date()` for updatedAt
`createdAt` and `updatedAt` are set by Postgres via `defaultNow()` on insert, but
`updateNote` was setting `updatedAt: new Date()` from the Node process.

That put two different clocks on one column. The clock-skew test failed with the
new `updatedAt` landing 447ms *before* the original, meaning the row appeared to
have been updated before it was created. Neon's clock and the local machine simply
disagreed.

Fixed by having Postgres own the column on both paths: `.set({ updatedAt: sql\`now()\` })`.
One clock, no skew, correct regardless of which machine runs the app.

Caught by a test, not by manual verification. The manual PowerShell run passed
because the two timestamps happened to fall in a favorable order that time.