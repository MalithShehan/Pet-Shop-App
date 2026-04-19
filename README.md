# Pet Shop Mobile

Cross-platform mobile app and backend API for a pet shop sample project. This repository contains a React Native / Expo frontend and a Node.js + Express backend with MongoDB

---

## Table of contents

- [Project structure](#project-structure)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Environment variables](#environment-variables)
- [Quick start](#quick-start)
  - [Backend (API)](#backend-api)
  - [Frontend (Expo)](#frontend-expo)
- [Seeding the database](#seeding-the-database)
- [Scripts](#scripts)
- [Development notes](#development-notes)
- [Contributing](#contributing)
- [License](#license)

---

## Project structure

Top-level folders:

- `backEnd/` — Node.js + Express API (CommonJS)
- `frontEnd/` — Expo / React Native mobile app (expo-router)

Key files:

- `backEnd/src/server.js` — app bootstrap and Socket.IO init
- `backEnd/src/app.js` — Express app and routes
- `frontEnd/app` — Expo Router app routes and screens

## Features

- REST API for products, pets, orders, auth
- Real-time notifications via Socket.IO
- Expo-based mobile app with custom tab bar and animated icons

## Prerequisites

- Node.js >= 18 (Node 22 tested in this workspace)
- npm (or yarn)
- MongoDB instance (local or Atlas)
- Optional: Expo CLI for native testing

## Environment variables

Create a `.env` file in `backEnd/` with the following values (example):

```
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/petshop?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
```

The backend will throw if `MONGODB_URI` is missing.

## Quick start

Run backend and frontend in separate terminals.

### Backend (API)

```bash
cd backEnd
npm install
# start in development (auto-reloads)
npm run dev
# or start production-style
npm start
```

The API listens on `PORT` (default `5000`). Socket.IO is initialized by the server; the frontend connects using `socket.io-client`.

### Frontend (Expo)

```bash
cd frontEnd
npm install
npm run start
# to open on Android/iOS/web
npm run android
npm run ios
npm run web
```

Open the Expo dev tools and scan the QR code or run on an emulator.

## Seeding the database

The backend provides seed scripts to populate sample products and pets. From the `backEnd` folder run:

```bash
npm run seed
# or to seed products only
npm run seed:products
```

This uses `MONGODB_URI` from your `.env`.

## Scripts

Backend scripts are defined in `backEnd/package.json`:

- `npm run dev` — start with `nodemon` (dev)
- `npm start` — start with `node src/server.js`
- `npm run seed` — seed DB

Frontend scripts are in `frontEnd/package.json` (Expo):

- `npm run start` — `expo start`
- `npm run android|ios|web` — platform targets
- `npm run lint` — run ESLint

## Development notes

- The custom tab bar and animated icons are in `frontEnd/app/(tabs)/_layout.tsx`.
- Socket server utilities: `backEnd/src/utils/socket.js` and frontend uses `socket.io-client`.
- DB connection lives in `backEnd/src/config/db.js` (reads `MONGODB_URI`).

If adding new environment values, document them in this README.

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Commit changes and push: `git push origin feat/my-feature`
4. Open a pull request for review

Please run linting and basic manual testing before opening PRs.

## License

This project is provided as-is. Add a license file (`LICENSE`) if you plan to publish.

---

If you'd like, I can also:

- add badges (build / license / dependencies) to the top
- include a `CONTRIBUTING.md` and PR checklist
- commit and push this `README.md` for you now

Feel free to tell me which additions you want.
