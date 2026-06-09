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

  // In dev, both web and native need to hit the local wrangler dev server
  if (__DEV__) {
    return 'http://localhost:8787';
  }

  // In production on web, the Worker serves everything from the same origin
  // so relative paths work. For native prod, set EXPO_PUBLIC_API_URL.
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
