# SF Explorer — Technical Writeup

## What Was Built

**SF Explorer** is a cross-platform application that displays an interactive map of notable San Francisco landmarks. Users can:

1. **Browse the Map** — View all locations as pins on an interactive map
2. **Preview Locations** — Tap a pin to see a slide-up card with the location's photo, category, rating, and address
3. **View Full Details** — Navigate to a dedicated detail page with a hero image, description, hours, coordinates, and highlights

The app runs on **three platforms** from a single codebase:
- **iOS** (via React Native)
- **Android** (via React Native)
- **Web** (via React Native Web, deployed on Cloudflare)

---

## Design Decisions

### Architecture: Worker-Hosted SPA + API

The entire application — both the REST API and the static web build — is served from a single **Cloudflare Worker**. This is a deliberate architectural choice:

- **Zero-config hosting**: No separate CDN, no separate API server. One deployment does it all.
- **Edge performance**: Both API responses and static files are served from Cloudflare's edge network (300+ data centers globally), meaning sub-50ms response times for most users.
- **SPA routing fallback**: The worker implements an intelligent fallback — if a requested path doesn't match an API route or static file, it serves `index.html` so that Expo Router handles client-side navigation. This means direct URLs like `/details/3` work correctly even on page refresh.
- **Cost efficiency**: Cloudflare Workers' free tier includes 100,000 requests/day, making this effectively free for a demo.

### Cross-Platform Maps Without API Keys

- **Mobile (iOS/Android)**: Uses `react-native-maps` with Apple Maps (iOS) and Google Maps (Android) — no API key required for Apple Maps on iOS; Android uses the default provider.
- **Web**: Uses **react-leaflet** with **OpenStreetMap** tiles, which is completely free and requires no API key. Custom teardrop-shaped markers are rendered using Leaflet's `DivIcon` for a polished look.

This approach was chosen specifically to avoid requiring Google Maps API keys for the demo while still providing a premium map experience.

### Platform-Specific Components

React Native's `.web.tsx` file extension pattern is used to swap implementations per platform:
- `MapView.tsx` — Used on iOS/Android (react-native-maps)
- `MapView.web.tsx` — Used on Web (react-leaflet)

Metro bundler automatically resolves the correct file based on the target platform, keeping platform logic out of the business logic.

### Premium UI Design

- **Glassmorphism**: Cards use translucent backgrounds with backdrop blur on web for a frosted-glass effect
- **Micro-animations**: Spring animations for card slide-up, fly-to animations on the map
- **Design tokens**: Centralized color palette, typography scale, and spacing system supporting light/dark modes
- **Hero images**: Detail pages feature full-bleed hero images with gradient overlays and category badges

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend Framework | Expo SDK 54 + React Native 0.81 | Cross-platform UI |
| Navigation | Expo Router v6 | File-based routing |
| Mobile Maps | react-native-maps | Native Apple/Google Maps |
| Web Maps | react-leaflet + Leaflet | OpenStreetMap tiles |
| API + Hosting | Cloudflare Workers | Edge-deployed REST API + SPA host |
| Styling | React Native StyleSheet | Platform-adaptive styling with design tokens |

---

## Challenges & Solutions

### Challenge 1: SPA Routing on Cloudflare
**Problem**: Expo Router uses client-side routing. Navigating to `/details/1` and refreshing the page would result in a 404 from the static file server.
**Solution**: The Cloudflare Worker checks if a static file exists for the requested path. If not, it serves `index.html`, allowing Expo Router to handle the route on the client.

### Challenge 2: Map Library Divergence
**Problem**: `react-native-maps` doesn't work on web, and `react-leaflet` doesn't work on native.
**Solution**: Used React Native's platform-specific file extensions (`.web.tsx`) to swap map implementations transparently. Both components share the same props interface.

### Challenge 3: CORS for Local Development
**Problem**: During development, the Expo dev server (port 8081) and the Wrangler dev server (port 8787) run on different ports, triggering CORS issues.
**Solution**: The worker sends `Access-Control-Allow-Origin: *` headers on all API responses, and the client uses `EXPO_PUBLIC_API_URL` to point to the correct server.

---

## Running Locally

```bash
# Install dependencies
cd map-test-app && npm install
cd worker && npm install

# Start the API server
cd worker && npm run dev
# → http://localhost:8787/api/locations

# Start the Expo dev server (web)
cd map-test-app && npx expo start --web
```

## Deploying to Cloudflare

```bash
# Build the web bundle
npm run build:web

# Deploy
cd worker && npm run deploy
```

---

## Links

- **Public Repository**: *(add after pushing to GitHub)*
- **Live Demo**: *(add after Cloudflare deployment)*
