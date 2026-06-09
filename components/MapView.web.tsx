import { useRef, useCallback, useMemo } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import L from 'leaflet';
import { Location } from '@/services/types';

interface MapViewProps {
  locations: Location[];
  selectedLocation: Location | null;
  onSelectLocation: (location: Location | null) => void;
}

// San Francisco center
const SF_CENTER: [number, number] = [37.7749, -122.4194];
const DEFAULT_ZOOM = 13;

/**
 * Custom pin icons for Leaflet
 */
function createIcon(color: string): L.DivIcon {
  return L.divIcon({
    className: 'custom-pin',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        position: relative;
      ">
        <div style="
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

const defaultIcon = createIcon('#0A84FF');
const selectedIcon = createIcon('#FF6B6B');

/**
 * Helper component to fly to a selected location
 */
function FlyToSelected({ location }: { location: Location | null }) {
  const map = useMap();

  if (location) {
    map.flyTo([location.latitude, location.longitude], 15, {
      duration: 0.8,
    });
  }

  return null;
}

/**
 * Web map component using react-leaflet with OpenStreetMap tiles.
 * No API key required. Renders custom pin icons and flies to selection.
 */
export default function MapView({
  locations,
  selectedLocation,
  onSelectLocation,
}: MapViewProps) {
  const handleMarkerClick = useCallback(
    (location: Location) => {
      onSelectLocation(location);
    },
    [onSelectLocation]
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <MapContainer
        center={SF_CENTER}
        zoom={DEFAULT_ZOOM}
        style={{ width: '100%', height: '100%' }}
        zoomControl={true}
        attributionControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FlyToSelected location={selectedLocation} />

        {locations.map((location) => (
          <Marker
            key={location.id}
            position={[location.latitude, location.longitude]}
            icon={
              selectedLocation?.id === location.id ? selectedIcon : defaultIcon
            }
            eventHandlers={{
              click: () => handleMarkerClick(location),
            }}
          >
            <Popup>
              <div style={{ fontFamily: 'Inter, sans-serif' }}>
                <strong style={{ fontSize: 14 }}>{location.name}</strong>
                <br />
                <span style={{ fontSize: 12, color: '#636366' }}>
                  {location.category}
                </span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
