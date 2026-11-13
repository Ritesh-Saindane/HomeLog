# HomeLog

HomeLog is a QR-based household asset and maintenance tracker. The project is being built incrementally for the CPAD lab, beginning with the backend foundation.

## Current phase: Backend B1

This phase provides:

- Node.js, Express, and TypeScript backend initialization
- PostgreSQL configuration through Docker Compose
- Prisma schema for users, assets, service records, and maintenance schedules
- Health-check endpoint with database connectivity verification

Authentication, asset APIs, service APIs, maintenance APIs, and the React Native application are intentionally not implemented yet.

## Backend commands

```powershell
cd backend
npm install
Copy-Item .env.example .env
npx prisma migrate dev --name init
npm run dev
```

The API runs on `http://localhost:3000` by default. Test it with:

```powershell
Invoke-RestMethod http://localhost:3000/health
```

## PostgreSQL with Docker

From the project root:

```powershell
docker compose up -d db
docker compose ps
docker compose logs db
```

The local database is exposed at `localhost:5432`. The credentials are development-only values defined in `docker-compose.yml`; do not use them in production.

