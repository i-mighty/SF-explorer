# SF Explorer 🗺️

A cross-platform map application showcasing San Francisco's most iconic landmarks. Built with **Expo SDK 54** and deployed on **Cloudflare Workers**.

**Live Demo:** [sf-explorer-worker.josadegboye.workers.dev](https://sf-explorer-worker.josadegboye.workers.dev)

---

## Features

- 🗺️ **Interactive Map** — Browse SF landmarks as pins on a full-screen map
- 📍 **Location Preview** — Tap a pin to see a slide-up card with photo, rating, and category
- 📄 **Detail Pages** — Full detail view with hero image, hours, coordinates, and highlights
- 🌐 **Cross-Platform** — Runs on iOS, Android, and Web from a single codebase
- ⚡ **Edge-Deployed** — API + static hosting on Cloudflare's global network (~50ms responses)
- 🔑 **No API Keys** — Uses OpenStreetMap tiles (web) and Apple Maps (iOS) — completely free

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Expo SDK 54 · React Native 0.81 · React 19.1 |
| Routing | Expo Router v6 (file-based) |
| Mobile Maps | react-native-maps |
| Web Maps | Leaflet (vanilla JS) + OpenStreetMap |
| Backend | Cloudflare Workers |
| Styling | React Native StyleSheet + design tokens |

---

## Project Structure

```
sf-explorer/
├── app/                    # File-based routes (Expo Router)
│   ├── +html.tsx           # Web document head (Leaflet CSS, fonts)
│   ├── _layout.tsx         # Root Stack navigator
│   ├── index.tsx           # Map screen
│   └── details/[id].tsx    # Location detail screen
├── components/
│   ├── MapView.tsx         # Native map (iOS/Android)
│   ├── MapView.web.tsx     # Web map (Leaflet)
│   └── LocationCard.tsx    # Slide-up preview card
├── services/
│   ├── api.ts              # API client
│   └── types.ts            # Shared types
├── constants/
│   └── Colors.ts           # Design system tokens
├── worker/                 # Cloudflare Worker
│   ├── src/index.ts        # REST API + SPA fallback
│   ├── wrangler.toml       # Worker config
│   └── package.json
├── WRITEUP.md              # Technical writeup
└── app.json                # Expo config
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
# Frontend dependencies
cd sf-explorer
npm install

# Worker dependencies
cd worker
npm install
```

### Run Locally

You need **two terminals**:

```bash
# Terminal 1 — API server (port 8787)
cd sf-explorer/worker
npm run dev

# Terminal 2 — Expo dev server
cd sf-explorer
npx expo start --web      # Web
npx expo start --ios       # iOS Simulator
npx expo start --android   # Android Emulator
```

### Deploy to Cloudflare

```bash
# Build the web bundle
npm run build:web

# Deploy worker + static assets
cd worker
npm run deploy
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/locations` | All locations (8 SF landmarks) |
| GET | `/api/locations/:id` | Single location by ID |
| * | `/*` | Static assets + SPA fallback |

---

## Architecture

The Cloudflare Worker serves dual roles:

1. **REST API** — Returns location data as JSON with CORS headers
2. **Static Host** — Serves the Expo web build from the `dist/` directory
3. **SPA Fallback** — Routes like `/details/3` that don't match a static file get rewritten to `index.html`, so Expo Router handles client-side navigation

This means a single `wrangler deploy` gives you both the API and the frontend, served from 300+ edge locations worldwide.

---

## License

MIT
