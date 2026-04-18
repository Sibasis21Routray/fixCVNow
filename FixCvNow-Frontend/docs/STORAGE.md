# Storage Architecture

FixCVNow uses **no server-side database**. All state is stored client-side using the browser's `sessionStorage` API and a small in-memory Map. This makes the product zero-infrastructure for data storage, at the cost of session portability.

---

## Storage Layers

### 1. `sessionStorage` (browser built-in)

Persists across component unmounts and soft navigation within the same browser tab. Cleared when the tab is closed.

All keys are prefixed with the `sessionId` to namespace data per upload session.

| Key | Value | Set by | Read by |
|-----|-------|--------|---------|
| `resume_<sessionId>` | `{ data: ResumeData, extractedAt: ISO string }` | `resumeStorage.saveResumeData()` | `resumeStorage.getResumeData()` |
| `lead_<sessionId>` | `{ name, email, sessionId, createdAt, ... }` | `leadsStorage.updateLead()` | `leadsStorage.getLead()` |
| `payment_<sessionId>` | `'none' \| 'basic' \| 'optimized'` | `ResumePreview` | `ResumePreview` |
| `optimized_<sessionId>` | Full `ResumeData` object (optimized version) | `ResumePreview` | `ResumePreview` |

---

### 2. In-Memory Map (`sessionStorage_util._uploadedFileMap`)

The uploaded `File` object (from the `<input type="file">`) cannot be serialized to `sessionStorage`. It is stored in a module-level `Map` inside `lib/storage.js`.

| Key | Value | Set by | Read by |
|-----|-------|--------|---------|
| `'uploadedFile'` | `File` object | `sessionStorage_util.saveUploadedFile()` | `sessionStorage_util.getUploadedFile()` |

**Important**: This Map is cleared on every page refresh. This is intentional — it's used as the "file is in transit" flag. If the user refreshes `ProcessingPage`, the missing file is detected and the user is redirected to `/` instead of calling the extraction API again.

---

## `lib/storage.js` API

### `resumeStorage`

```js
resumeStorage.saveResumeData(sessionId, resumeData)
// Saves: sessionStorage['resume_<sessionId>'] = JSON.stringify({ data: resumeData, extractedAt: new Date().toISOString() })

resumeStorage.getResumeData(sessionId)
// Returns: { data: ResumeData, extractedAt: string } | null
```

### `leadsStorage`

```js
leadsStorage.updateLead(sessionId, leadData)
// Saves: sessionStorage['lead_<sessionId>'] = JSON.stringify({ ...leadData, sessionId, updatedAt })

leadsStorage.getLead(sessionId)
// Returns: lead object | null

leadsStorage.getAllLeads()
// Returns: array of all lead objects stored in sessionStorage
```

### `sessionStorage_util`

```js
sessionStorage_util.saveUploadedFile(file)
// Saves File to in-memory Map

sessionStorage_util.getUploadedFile()
// Returns: File | null

sessionStorage_util.clearUploadedFile()
// Removes from in-memory Map
```

---

## Limitations

| Limitation | Impact |
|-----------|--------|
| `sessionStorage` is tab-scoped | Sharing a URL in a new tab/browser results in "Session Not Found" |
| In-memory Map is cleared on refresh | Refreshing ProcessingPage redirects to home (by design) |
| No server persistence | Data is permanently lost when the tab is closed |
| `sessionStorage` size limit (~5MB) | Large resumes with extensive data could hit this limit (unlikely in practice) |

---

## Why No Database?

The product was intentionally designed without a database to:

1. **Minimize infrastructure cost** — no DB hosting, no ORM, no migrations
2. **Simplify privacy compliance** — no user data is ever stored on servers
3. **Reduce complexity** — no auth, no user accounts, no data expiry logic
4. **Speed to market** — full product works with just OpenAI API + Next.js hosting

The lead data (`leadsStorage`) is stored in `sessionStorage` for potential future use (e.g., exporting before closing), but it does not persist to a server currently.

---

## Future: Adding Persistence (if needed)

If a database is added in the future, the recommended approach is:

1. Keep `sessionStorage` as the **client-side cache** (fast reads, no auth needed)
2. Add server-side storage for **lead capture** only (name, email, sessionId, timestamp)
3. Never store resume content server-side unless explicitly required and consented to by users
4. Use a lightweight solution: Supabase, PlanetScale, or a simple Postgres instance

The current `sessionId` scheme (UUID-like string) is already suitable as a database primary key.
