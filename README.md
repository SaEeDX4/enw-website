# Elderly Neighbour Watch (ENW)

A community-support platform that connects seniors who need help with trusted
volunteers in their neighbourhoods — promoting independence, safety, and
neighbourly care through technology.

![Node](https://img.shields.io/badge/Node.js-20-339933)
![React](https://img.shields.io/badge/React-18-61DAFB)
![Express](https://img.shields.io/badge/Express-4-000000)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248)
![License](https://img.shields.io/badge/License-MIT-green)

**Live frontend:** https://enw-frontend.onrender.com
**Live API:** https://enw-backend.onrender.com
**Static showcase (GitHub Pages):** https://saeedx4.github.io/elderly-neighbour-watch/
(from the companion repo
[elderly-neighbour-watch](https://github.com/SaEeDX4/elderly-neighbour-watch))

---

## Overview

Seniors (or their families) submit requests for help — errands, groceries,
companionship, check-ins. Volunteers register with their skills and
availability, and the platform manages requests, volunteers, partners, and a
community blog.

## Features

- **Senior support requests** — simple assistance request forms (`/api/seniors`)
- **Volunteer registration** — skills/availability signup with duplicate-email
  protection (`/api/volunteers`)
- **Partners** — community partner organisations (`/api/partners`)
- **Blog** — community, safety, and health articles (`/api/blog`)
- **Tested** — Jest + in-memory MongoDB test suite for the API, Vitest suite
  for the client (including accessibility tests)
- **Docker** — Dockerfiles for client and server plus compose files for
  local/Atlas development

## Project structure

```
enw-website/
├── enw/
│   ├── client/       # React 18 + Vite frontend (Vitest, ESLint, Prettier)
│   └── server/       # Express + MongoDB (Mongoose) API (Jest tests)
├── deployment/       # Deployment scripts
├── docs/             # DEPLOYMENT.md, SECURITY.md
├── Dockerfile.client
├── Dockerfile.server
└── docker-compose*.yml
```

The API is layered as routes → controllers → services → models, with
middleware for error handling, validation, and an API-key guard
(see [docs/SECURITY.md](docs/SECURITY.md)).

## Getting started

### Prerequisites

- Node.js 20+
- MongoDB (local, Docker, or Atlas)

### Configure environment

```bash
cp enw/server/.env.example enw/server/.env   # MONGODB_URI, JWT_SECRET, API_KEY…
cp enw/client/.env.example enw/client/.env   # VITE_API_BASE
```

Never commit real secrets — `.env` files are git-ignored and the examples
contain placeholders only.

### Install & run

From `enw/`:

```bash
npm run install:all   # root + client + server dependencies
npm run dev           # client (Vite) and server (Express) together
```

- Client: http://localhost:5173
- API: http://localhost:3000/api

### Tests

```bash
cd enw/server && npm test          # Jest (uses in-memory MongoDB)
cd enw/client && npx vitest run    # Vitest
```

### Build

```bash
cd enw/client && npm run build
```

## Deployment

Deployed on **Render** (frontend + backend services) with MongoDB Atlas.
See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for details, or use the
included Dockerfiles / compose files.

## Author

**Saeed Sharifzadeh** (Vancouver, BC)

## License

[MIT](LICENSE)
