import { Platform } from 'react-native';
import { Location } from './types';

/**
 * API base URL:
 * - In development, we proxy to the local wrangler dev server.
 * - In production, the web app is served by the same Cloudflare Worker,
 *   so we use relative paths (empty string). Native builds use the
 *   EXPO_PUBLIC_API_URL env variable.
 */
function getBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // On web, default to relative path (same-origin)
  if (Platform.OS === 'web') {
    return '';
  }

  // On native in dev, point to local wrangler dev server
  if (__DEV__) {
    return 'http://localhost:8787';
  }

  // Fallback — should be set via env var in production
  return '';
}

const BASE_URL = getBaseUrl();

/**
 * Fetch all locations from the API
 */
export async function fetchLocations(): Promise<Location[]> {
  const response = await fetch(`${BASE_URL}/api/locations`);
  if (!response.ok) {
    throw new Error(`Failed to fetch locations: ${response.status}`);
  }
  return response.json();
}

/**
 * Fetch a single location by ID
 */
export async function fetchLocationById(id: number): Promise<Location> {
  const response = await fetch(`${BASE_URL}/api/locations/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch location ${id}: ${response.status}`);
  }
  return response.json();
}
