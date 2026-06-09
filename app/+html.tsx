import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/**
 * Web-only document head wrapper.
 * Injects Leaflet CSS and Google Fonts for the web build.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="description" content="SF Explorer — Discover San Francisco's most beautiful landmarks on an interactive map." />
        <title>SF Explorer — Discover San Francisco</title>

        {/* Leaflet CSS */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />

        {/* Google Fonts — Inter for premium typography */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

        <ScrollViewStyleReset />

        <style dangerouslySetInnerHTML={{ __html: responsiveCSS }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveCSS = `
html, body, #root {
  height: 100%;
  overflow: hidden;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/*
 * React Native Web applies display:flex and flex-direction:column to ALL divs.
 * This completely breaks Leaflet, which relies on standard block/absolute layout.
 * Override everything inside .leaflet-container back to normal CSS layout.
 */
.leaflet-container,
.leaflet-container * {
  display: block !important;
  flex-direction: unset !important;
  flex-shrink: unset !important;
  align-items: unset !important;
  box-sizing: content-box !important;
}

.leaflet-container {
  width: 100% !important;
  height: 100% !important;
  position: relative !important;
}

.leaflet-pane {
  position: absolute !important;
  left: 0 !important;
  top: 0 !important;
}

.leaflet-tile-pane {
  position: absolute !important;
}

.leaflet-tile-container {
  position: absolute !important;
}

.leaflet-tile {
  position: absolute !important;
}

.leaflet-control-container {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  pointer-events: none;
}

.leaflet-control-container * {
  pointer-events: auto;
}

.leaflet-top, .leaflet-bottom {
  position: absolute !important;
  z-index: 1000;
  pointer-events: none;
}

.leaflet-top { top: 0 !important; }
.leaflet-bottom { bottom: 0 !important; }
.leaflet-left { left: 0 !important; }
.leaflet-right { right: 0 !important; }

.leaflet-control {
  display: block !important;
  pointer-events: auto;
}

/* Fix custom pin markers */
.custom-pin {
  background: none !important;
  border: none !important;
}

.leaflet-popup-content-wrapper,
.leaflet-popup-tip {
  box-sizing: border-box !important;
}
`;
