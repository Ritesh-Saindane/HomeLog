# HomeLog

HomeLog is a QR-based household asset and maintenance tracker. The project is being built incrementally for the CPAD lab, beginning with the backend foundation.

## Current phase: Backend B6 / Frontend F6

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
- JWT authentication with bcrypt password hashing
- Ownership-protected asset, QR lookup, service-history, and maintenance APIs
- QR display and camera scanning in the mobile app
- Service-history and maintenance screens
- Local maintenance reminders using `expo-notifications`

The backend and mobile feature phases are now implemented. The app still needs real-device QA and production hardening before deployment.

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

## API surface

- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`
- `GET|POST /assets`
- `GET|PUT /assets/:id`
- `GET /assets/qr/:qrCodeId`
- `GET|POST /assets/:assetId/services`
- `PUT|DELETE /services/:id`
- `GET|POST /assets/:assetId/maintenance`
- `PUT /maintenance/:id`

Protected endpoints require `Authorization: Bearer <token>`.

## Mobile commands

```powershell
cd mobile
npm install
$env:EXPO_PUBLIC_API_URL = "http://localhost:3000"
npm start
```

For an Android emulator, use `http://10.0.2.2:3000`. For a physical device, use the computer's LAN IP instead of `localhost`, for example `http://192.168.1.10:3000`. A template is available at `mobile/.env.example`.

The login and registration screens call `/auth/login` and `/auth/register`.

The mobile app requests camera permission for QR scanning and notification permission before scheduling local maintenance reminders. Notification times use the device's local timezone; past dates are skipped.

## PostgreSQL with Docker

From the project root:

```powershell
docker compose up -d db
docker compose ps
docker compose logs db
```

The local database is exposed at `localhost:5432`. The credentials are development-only values defined in `docker-compose.yml`; do not use them in production.

