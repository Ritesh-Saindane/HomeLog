# HomeLog

HomeLog is a QR-based household asset and maintenance tracker. The project is being built incrementally for the CPAD lab, beginning with the backend foundation.

## Current phase: Frontend F2

Backend B1 and Frontend F1 currently provide:

- Node.js, Express, and TypeScript backend initialization
- PostgreSQL configuration through Docker Compose
- Prisma schema for users, assets, service records, and maintenance schedules
- Health-check endpoint with database connectivity verification
- Expo React Native mobile application using JavaScript and Expo Router
- Axios API client with configurable `EXPO_PUBLIC_API_URL`
- AsyncStorage-backed authentication state
- Login and registration screens ready for backend B2 integration
- Dashboard and asset-management screens: list, add, edit, and details

Backend authentication, asset APIs, service APIs, maintenance APIs, and the remaining mobile phases are intentionally not implemented yet.

F2 currently uses an AsyncStorage-backed local demo asset store because the backend asset endpoints are planned for B3. The screens are structured so that the store can be replaced with API calls without changing the route UI.

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

## Mobile commands

```powershell
cd mobile
npm install
$env:EXPO_PUBLIC_API_URL = "http://localhost:3000"
npm start
```

For a physical device, use the computer's LAN IP instead of `localhost`, for example `http://192.168.1.10:3000`.

The login and registration screens call `/auth/login` and `/auth/register`. Those endpoints will be implemented during backend B2, so authentication requests are expected to fail until then.

## PostgreSQL with Docker

From the project root:

```powershell
docker compose up -d db
docker compose ps
docker compose logs db
```

The local database is exposed at `localhost:5432`. The credentials are development-only values defined in `docker-compose.yml`; do not use them in production.

