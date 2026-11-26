# ENW — Security Notes

## Platform protections (API, `enw/server/src/app.js`)

- **Helmet** with a Content-Security-Policy (default `self`, scripts `self`)
- **CORS** restricted to the configured client origin (`CLIENT_URL`),
  with credentials
- **Rate limiting** on `/api` (100 requests / 15 minutes per IP by default,
  configurable via `RATE_LIMIT_*`)
- **Input validation** via express-validator middleware
- **Body limits** (10 MB) and response compression
- Centralised **error handler**; request logging via Morgan/Winston

## API-key guard

`enw/server/src/middleware/auth.js` exports `requireApiKey`, which compares
the `x-api-key` header against the `API_KEY` environment variable and
returns **401** on mismatch.

Honest status:

- The guard is **not yet wired into the route definitions** — today the API
  routes are effectively public. Wiring it into the admin/internal routes
  (and adding real user authentication) is the top security follow-up.
- If `API_KEY` is not set, the guard **fails open** (allows the request)
  but logs a warning on every call so the misconfiguration is visible.
  Set `API_KEY` in every deployed environment.

## Secrets management

- All secrets come from environment variables — see
  `enw/server/.env.example` for the full list. **Examples contain
  placeholders only**; never put a real connection string or password in
  an example file (a real Atlas credential was previously committed in
  `enw/server/.env.example` and had to be rotated — see git history before
  this cleanup).
- `.env` files are git-ignored.
- The frontend only receives `VITE_API_BASE` (a public URL, no secrets).
