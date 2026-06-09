# SF Explorer — Technical Writeup

**Live Demo:** [sf-explorer-worker.josadegboye.workers.dev](https://sf-explorer-worker.josadegboye.workers.dev)  
**Repository:** [Github](https://github.com/i-mighty/SF-explorer)

---

## Overview

For this project, I built **SF Explorer** — a cross-platform map application that lets users browse notable San Francisco landmarks on an interactive map, preview them via a slide-up card, and navigate to a full detail page. It runs on iOS, Android, and Web from a single Expo codebase, with both the API and web hosting handled by a single Cloudflare Worker.

---

## Why I Made These Choices

### Single Worker for Everything

The biggest architectural decision was serving both the REST API *and* the static web build from a single Cloudflare Worker. I went this route for a few reasons:

1. **Simplicity** — one `wrangler deploy` gives you the entire app. No separate CDN config, no NGINX, no separate API hosting.
2. **Performance** — everything runs at the edge. API responses come back in single-digit milliseconds because the data is inline (no database round-trip), and static assets are cached across 300+ Cloudflare data centers.
3. **SPA routing** — this was the tricky part. Expo Router uses client-side routing, so if a user refreshes on `/details/3`, the worker needs to serve `index.html` instead of returning a 404. I implemented a fallback in the worker's fetch handler: try the static asset first, and if it doesn't exist, return `index.html` so Expo Router can resolve the route on the client.

For a production app, I'd separate these concerns — API in its own service, static assets on a CDN with proper cache headers. But for a self-contained demo that's easy to review, a single deployment felt right.

### Maps Without API Keys

I wanted the app to work out of the box without requiring any API key setup. On mobile, `react-native-maps` uses Apple Maps by default on iOS (no key needed) and Google Maps on Android. On web, I used OpenStreetMap tiles via Leaflet, which are completely free and open.

This meant I needed **two different map implementations** — one for native, one for web. Expo/React Native makes this straightforward with platform-specific file extensions:

- `MapView.tsx` → iOS/Android (react-native-maps)
- `MapView.web.tsx` → Web (vanilla Leaflet)

Metro resolves the right file at build time. Both components share the same props interface, so the parent screen doesn't know or care which platform it's running on.

### Vanilla Leaflet Over react-leaflet

I initially used `react-leaflet`, which wraps Leaflet in React components. It didn't work. React Native Web applies `display: flex` and `flex-direction: column` to every `<div>` element globally, and this completely broke Leaflet's tile positioning — tiles scattered randomly across the screen in a checkerboard pattern.

I tried CSS overrides with `!important`, `invalidateSize()` calls, `ResizeObserver`-based sizing — none of it worked because RNW's styles are injected at runtime and affect Leaflet's internal DOM.

The fix was to drop `react-leaflet` entirely and use Leaflet's vanilla JavaScript API (`L.map()`) with a DOM ref. This renders the map outside of React's component tree, so RNW's styles never touch it. It's a pattern I'd recommend to anyone trying to use DOM-based libraries with React Native Web.

---

## Challenges I Ran Into

### Leaflet CSS Not Loading in Dev Mode

This one took some debugging. The `+html.tsx` file in Expo Router lets you customize the HTML document head — I used it to inject the Leaflet CSS `<link>` tag. It worked in production builds (`expo export`), but in dev mode (`expo start --web`), Metro serves its own HTML template and ignores `+html.tsx` entirely.

The result was Leaflet initializing without any CSS, which caused the tile misalignment I mentioned above. The fix was to inject the CSS dynamically at runtime:

```typescript
function ensureLeafletCSS(): Promise<void> {
  return new Promise((resolve) => {
    if (document.querySelector('link[href*="leaflet"]')) {
      resolve();
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
    link.onload = () => resolve();
    link.onerror = () => resolve();
  });
}
```

The component awaits this promise before calling `L.map()`, so the CSS is always loaded before the map initializes. It works in both dev and production.

### CORS Between Dev Servers

In dev mode, Expo runs on port 8081 and the Wrangler dev server runs on port 8787. The frontend's API calls would fail without CORS headers. I handled this two ways:

- The worker sends `Access-Control-Allow-Origin: *` on all API responses
- The `api.ts` client checks `__DEV__` and points to `http://localhost:8787` in development, and uses relative paths in production (since both API and client are on the same origin)

### TypeScript Across Two Projects

The worker and the Expo app have different TypeScript configurations — the worker needs `@cloudflare/workers-types`, which aren't available in the Expo project. Running `tsc` from the root would fail on worker files. I fixed this by adding `worker/` to the root `tsconfig.json`'s `exclude` array and running type-checking separately for each.

---

## What I'd Improve With More Time

- **Real database** — the 8 landmarks are currently hardcoded in the worker. I'd move them to Cloudflare D1 (SQLite at the edge) or KV storage.
- **Search and filtering** — filter by category, search by name, sort by rating.
- **User location** — show the user's position on the map and calculate distances to each landmark.
- **Images** — the detail page currently references image URLs. I'd add actual hosted images and optimize them for each platform.
- **Testing** — add Jest unit tests for the API logic and React Testing Library tests for the components.
- **Offline support** — cache API responses and map tiles for offline use on mobile.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Expo SDK 54 · React Native 0.81 · React 19.1 |
| Routing | Expo Router v6 (file-based) |
| Mobile Maps | react-native-maps (Apple Maps / Google Maps) |
| Web Maps | Leaflet (vanilla JS) + OpenStreetMap |
| Backend | Cloudflare Workers (API + static hosting) |
| Styling | React Native StyleSheet with design tokens |

---

## Running the Project

```bash
# Install
cd sf-explorer && npm install
cd worker && npm install

# Run (two terminals)
cd sf-explorer/worker && npm run dev     # API on :8787
cd sf-explorer && npx expo start --web   # App on :8081

# Deploy
npm run build:web && cd worker && npm run deploy
```
