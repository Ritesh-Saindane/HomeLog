# HomeLog

HomeLog helps households organize appliances by room, record repairs, schedule maintenance, and review service costs and history. The mobile app is built with Expo React Native (JavaScript); the API uses Express, TypeScript, Prisma, and PostgreSQL.

## App workflow

| Step | Screen | Step | Screen |
|---|---|---|---|
| 1. Sign in or create an account | ![Sign in](docs/screenshots/Screenshot_20261117_201536.jpg) | 2. View the home dashboard and rooms | ![Home dashboard](docs/screenshots/Screenshot_20261117_205320.jpg) |
| 3. Open the add asset form | ![Add asset](docs/screenshots/Screenshot_20261117_201803.jpg) | 4. Enter appliance information | ![Asset details form](docs/screenshots/01-add-asset-details.jpeg) |
| 5. Add a photo, choose a room, and save | ![Save asset](docs/screenshots/02-save-asset.jpeg) | 6. Browse or filter saved assets | ![Browse assets](docs/screenshots/04-browse-all-assets.jpeg) |
| 7. Filter assets by room and type | ![Filtered assets](docs/screenshots/03-assets-filtered.jpeg) | 8. Open an appliance | ![Appliance details](docs/screenshots/08-asset-details-and-history.jpeg) |
| 9. Ask appliance specific AI advice | ![Appliance advice](docs/screenshots/Screenshot_20261117_202346.jpg) | 10. View and print its QR code | ![QR code](docs/screenshots/05-asset-qr-and-ai.jpeg) |
| 11. Review service history | ![Service history](docs/screenshots/Screenshot_20261117_202321.jpg) | 12. Add or edit a service record | ![Edit service record](docs/screenshots/Screenshot_20261117_202105.jpg) |
| 13. Manage maintenance schedules | ![Maintenance schedules](docs/screenshots/06-maintenance-reminder.jpeg) | 14. Set a reminder date and time | ![Reminder form](docs/screenshots/Screenshot_20261117_203743.jpg) |
| 15. Receive scheduled notifications | ![Notifications](docs/screenshots/Screenshot_20261117_205310.jpg) | 16. Review analytics and timeline | ![Analytics and timeline](docs/screenshots/07-analytics-timeline.jpeg) |
| 17. Manage home to-dos | ![Home to-dos](docs/screenshots/09-home-todos.jpeg) | 18. Update profile and dark mode | ![Settings](docs/screenshots/Screenshot_20261117_205743.jpg) |

### Dark mode

| Home dashboard | Asset list | Asset details and QR | Analytics timeline |
|---|---|---|---|
| ![Dark home](docs/screenshots/Screenshot_20261117_205808.jpg) | ![Dark assets](docs/screenshots/Screenshot_20261117_205823.jpg) | ![Dark asset and QR](docs/screenshots/Screenshot_20261117_205827.jpg) | ![Dark timeline](docs/screenshots/Screenshot_20261117_205810.jpg) |

| To-dos | Settings |
|---|---|
| ![Dark to-dos](docs/screenshots/Screenshot_20261117_205811.jpg) | ![Dark mode settings](docs/screenshots/Screenshot_20261117_205743.jpg) |

## Architecture

![HomeLog architecture](docs/architecture.svg)

The mobile app calls the authenticated REST API over HTTP. The API validates requests, applies ownership checks, and uses Prisma to read and write PostgreSQL. QR service-history lookup is read-only for visitors. Maintenance reminders are scheduled locally on the device; optional AI advice is requested through the backend, which keeps the Groq key off the app.

## Features

- JWT account registration and sign-in
- Room-based asset catalog with photos, search, and filters
- Asset QR codes, camera scanning, printing, and read-only recent service history
- Service records including cost, provider, description, and replaced parts
- Per-asset maintenance schedules and device-local reminders
- Home to-dos, service spending charts, and an event timeline
- Appliance-specific AI advice using saved service history (optional)
- Light and dark themes

## Requirements

- Node.js and npm
- Docker Desktop with Docker Compose, or a local PostgreSQL server
- Expo Go for basic app development; a development build is recommended for testing native notifications

## Run locally

Start PostgreSQL from the repository root:

```bash
docker compose up -d db
```

Configure and start the backend:

```bash
cd backend
npm install
```

Copy `backend/.env.example` to `backend/.env`, then set `DATABASE_URL` and `JWT_SECRET`. Run migrations and start the API:

```bash
npx prisma generate
npx prisma migrate dev
npm run dev
```

The API listens on port `3000`. Check it at `http://localhost:3000/health`.

In another terminal, configure and start the mobile app:

```bash
cd mobile
npm install
```

Set `EXPO_PUBLIC_API_URL` in `mobile/.env` (copy from `.env.example`) to the backend address reachable from the device, then run:

```bash
npx expo start
```

Use `http://10.0.2.2:3000` for the Android emulator. For a physical phone, use the computer's LAN IP address; `localhost` on the phone refers to the phone itself.

## Optional AI advice

Set `GROQ_API_KEY` in `backend/.env` and restart the backend. The key remains on the server. Without it, the rest of the application remains usable.

## API overview

| Area | Endpoints |
|---|---|
| Health | `GET /health` |
| Authentication | `POST /auth/register`, `POST /auth/login`, `GET /auth/me` |
| Assets | `GET/POST /assets`, `GET/PUT /assets/:id`, `GET /assets/qr/:qrCodeId` |
| Public QR history | `GET /public/assets/qr/:qrCodeId` (read-only) |
| Services | `GET/POST /assets/:assetId/services`, `PUT/DELETE /services/:id` |
| Maintenance | `GET/POST /assets/:assetId/maintenance`, `PUT /maintenance/:id` |
| AI advice | `POST /advice` (authenticated; requires Groq key) |

Protected routes require `Authorization: Bearer <token>`.

## Notes

- Never commit `.env` files or production secrets. Use `.env.example` as a template.
- PostgreSQL development credentials in Docker Compose are for local use only.
- Asset image references currently use the device's selected URI; shared cloud photo storage is not configured.
- Expo Go may show a notifications support warning. Local notification behavior depends on the Expo runtime and device permissions.
