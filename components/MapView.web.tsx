import { useRef, useEffect, useState } from 'react';
import L from 'leaflet';
import { Location } from '@/services/types';

interface MapViewProps {
  locations: Location[];
  selectedLocation: Location | null;
  onSelectLocation: (location: Location | null) => void;
}

const SF_CENTER: L.LatLngExpression = [37.7749, -122.4194];
const DEFAULT_ZOOM = 13;

function createIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:28px;height:28px;
      background:${color};
      border:3px solid #fff;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      box-shadow:0 2px 8px rgba(0,0,0,0.35);
      position:relative;
    "><div style="
      width:8px;height:8px;
      background:#fff;border-radius:50%;
      position:absolute;top:50%;left:50%;
      transform:translate(-50%,-50%);
    "></div></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

const defaultIcon = createIcon('#0A84FF');
const selectedIcon = createIcon('#FF6B6B');

/**
 * Injects Leaflet CSS into the document head at runtime.
 * Metro dev mode ignores +html.tsx so we must do this ourselves.
 */
function ensureLeafletCSS(): Promise<void> {
  return new Promise((resolve) => {
    if (document.querySelector('link[href*="leaflet"]')) {
      resolve();
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.crossOrigin = '';
    document.head.appendChild(link);
    link.onload = () => resolve();
    link.onerror = () => resolve();
  });
}

export default function MapView({
  locations,
  selectedLocation,
  onSelectLocation,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<number, L.Marker>>(new Map());
  const [ready, setReady] = useState(false);

  // 1. Load CSS, then create the map
  useEffect(() => {
    let cancelled = false;

    async function init() {
      await ensureLeafletCSS();
      if (cancelled) return;

      const el = containerRef.current;
      if (!el || mapRef.current) return;

      const map = L.map(el, {
        center: SF_CENTER,
        zoom: DEFAULT_ZOOM,
        zoomControl: true,
        attributionControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      map.on('click', () => onSelectLocation(null));

      mapRef.current = map;
      setReady(true);

      // Let layout settle then recalculate
      requestAnimationFrame(() => map.invalidateSize());
      setTimeout(() => map.invalidateSize(), 300);
    }

    init();

    const handleResize = () => mapRef.current?.invalidateSize();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelled = true;
      window.removeEventListener('resize', handleResize);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // 2. Sync markers when locations load
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current.clear();

    locations.forEach((loc) => {
      const marker = L.marker([loc.latitude, loc.longitude], {
        icon: defaultIcon,
      })
        .addTo(map)
        .bindPopup(
          `<div style="font-family:Inter,system-ui,sans-serif">
            <strong style="font-size:14px">${loc.name}</strong><br/>
            <span style="font-size:12px;color:#636366">${loc.category}</span>
          </div>`
        );

      marker.on('click', () => onSelectLocation(loc));
      markersRef.current.set(loc.id, marker);
    });
  }, [locations, ready]);

  // 3. Update selection
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker, id) => {
      marker.setIcon(
        selectedLocation?.id === id ? selectedIcon : defaultIcon
      );
    });

    if (selectedLocation) {
      map.flyTo(
        [selectedLocation.latitude, selectedLocation.longitude],
        15,
        { duration: 0.8 }
      );
    }
  }, [selectedLocation]);

  return (
    <div
      ref={containerRef}
      id="leaflet-map"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
      }}
    />
  );
}
