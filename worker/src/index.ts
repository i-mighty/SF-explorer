/**
 * SF Explorer — Cloudflare Worker
 *
 * Serves as both the REST API for location data and the static file host
 * for the Expo React Native Web build.
 *
 * Endpoints:
 *   GET /api/locations       → All locations
 *   GET /api/locations/:id   → Single location by ID
 *   *   (fallback)           → Static assets with SPA routing fallback
 */

export interface Env {
  ASSETS: Fetcher;
}

// ─── Location Data ────────────────────────────────────────────────────────────

interface Location {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  category: string;
  address: string;
  image: string;
  rating: number;
  reviewCount: number;
  hours: string;
  highlights: string[];
}

const LOCATIONS: Location[] = [
  {
    id: 1,
    name: 'Golden Gate Bridge',
    description:
      'The Golden Gate Bridge is a suspension bridge spanning the Golden Gate, the one-mile-wide strait connecting San Francisco Bay and the Pacific Ocean. Recognized worldwide as a symbol of San Francisco, the bridge was designed by engineer Joseph Strauss and opened in 1937. Its distinctive International Orange color was chosen to complement the natural surroundings and enhance visibility in fog.',
    latitude: 37.8199,
    longitude: -122.4783,
    category: 'Landmark',
    address: 'Golden Gate Bridge, San Francisco, CA 94129',
    image: 'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=800&q=80',
    rating: 4.8,
    reviewCount: 52483,
    hours: 'Open 24 hours · Pedestrian access 5AM–6:30PM',
    highlights: ['Iconic Views', 'Walking Path', 'Photography', 'Free Entry'],
  },
  {
    id: 2,
    name: 'Alcatraz Island',
    description:
      'Located in the cold waters of San Francisco Bay, Alcatraz Island is home to the infamous former federal penitentiary, a Civil War-era military fortification, and a bird sanctuary. Today it is managed by the National Park Service as part of the Golden Gate National Recreation Area. The audio tour, narrated by former guards and inmates, is one of the most popular attractions in the city.',
    latitude: 37.8267,
    longitude: -122.4230,
    category: 'Historic Site',
    address: 'Alcatraz Island, San Francisco, CA 94133',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
    rating: 4.7,
    reviewCount: 38291,
    hours: 'Ferry departures: 8:45AM–3:50PM daily',
    highlights: ['Audio Tour', 'Bay Views', 'Historic Prison', 'Wildlife'],
  },
  {
    id: 3,
    name: 'Fisherman\'s Wharf',
    description:
      'Fisherman\'s Wharf is a bustling waterfront neighborhood and one of the city\'s most popular tourist destinations. Originally the center of San Francisco\'s fishing industry, it now features seafood restaurants, souvenir shops, street performers, and stunning bay views. Nearby Pier 39 is famous for its colony of California sea lions that have claimed the docks since 1989.',
    latitude: 37.8080,
    longitude: -122.4177,
    category: 'Neighborhood',
    address: 'Fisherman\'s Wharf, San Francisco, CA 94133',
    image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80',
    rating: 4.3,
    reviewCount: 28740,
    hours: 'Open 24 hours · Shops: 10AM–9PM',
    highlights: ['Sea Lions', 'Seafood', 'Shopping', 'Bay Cruises'],
  },
  {
    id: 4,
    name: 'Palace of Fine Arts',
    description:
      'The Palace of Fine Arts is a monumental structure originally constructed for the 1915 Panama-Pacific International Exposition. Designed by architect Bernard Maybeck, the building features a classical Roman rotunda surrounded by a graceful lagoon and lush grounds. It is one of the most photographed landmarks in San Francisco and serves as a popular venue for weddings and cultural events.',
    latitude: 37.8029,
    longitude: -122.4482,
    category: 'Architecture',
    address: '3601 Lyon St, San Francisco, CA 94123',
    image: 'https://images.unsplash.com/photo-1555993539-1732b0258235?w=800&q=80',
    rating: 4.6,
    reviewCount: 19823,
    hours: 'Grounds: 6AM–9PM daily',
    highlights: ['Rotunda', 'Lagoon', 'Free Entry', 'Photography'],
  },
  {
    id: 5,
    name: 'Lombard Street',
    description:
      'Known as the "crookedest street in the world," the one-block section of Lombard Street between Hyde and Leavenworth Streets features eight sharp switchback turns lined with beautiful flower gardens. Built in 1922, the turns were designed to reduce the hill\'s natural 27% grade. Walking down the steps alongside the road offers the best views of the hairpin curves and the bay beyond.',
    latitude: 37.8021,
    longitude: -122.4187,
    category: 'Landmark',
    address: 'Lombard St, San Francisco, CA 94133',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80',
    rating: 4.4,
    reviewCount: 22156,
    hours: 'Open 24 hours',
    highlights: ['Scenic Drive', 'Flower Gardens', 'Walking Steps', 'Photos'],
  },
  {
    id: 6,
    name: 'Chinatown',
    description:
      'San Francisco\'s Chinatown is the oldest and one of the most established Chinatowns in North America. The neighborhood is an enclave that continues to retain its own customs, languages, houses of worship, social clubs, and identity. It is the largest Chinatown outside of Asia and draws more visitors annually than the Golden Gate Bridge.',
    latitude: 37.7941,
    longitude: -122.4078,
    category: 'Neighborhood',
    address: 'Grant Ave & Bush St, San Francisco, CA 94108',
    image: 'https://images.unsplash.com/photo-1548199569-3e1c6aa8f469?w=800&q=80',
    rating: 4.5,
    reviewCount: 15432,
    hours: 'Open 24 hours · Shops vary',
    highlights: ['Dragon Gate', 'Dim Sum', 'Tea Shops', 'Temples'],
  },
  {
    id: 7,
    name: 'Twin Peaks',
    description:
      'Twin Peaks are two prominent hills with an elevation of about 925 feet, offering stunning 360-degree panoramic views of the entire San Francisco Bay Area. They are among the few remaining open spaces in the city where native plants and grassland can be found. The summit is accessible by car or a strenuous hike, and on clear days, you can see all the way to the Farallon Islands.',
    latitude: 37.7544,
    longitude: -122.4477,
    category: 'Nature',
    address: '501 Twin Peaks Blvd, San Francisco, CA 94114',
    image: 'https://images.unsplash.com/photo-1521747116042-5a810fda9664?w=800&q=80',
    rating: 4.6,
    reviewCount: 12890,
    hours: 'Open 24 hours',
    highlights: ['360° Views', 'Hiking', 'Sunset Spot', 'Free Entry'],
  },
  {
    id: 8,
    name: 'SFMOMA',
    description:
      'The San Francisco Museum of Modern Art (SFMOMA) houses an internationally recognized collection of modern and contemporary art. The museum\'s expanded building, redesigned by Snøhetta in 2016, features over 170,000 square feet of gallery space across seven floors. The collection includes works by Andy Warhol, Frida Kahlo, Jackson Pollock, and many other influential artists.',
    latitude: 37.7857,
    longitude: -122.4011,
    category: 'Museum',
    address: '151 Third St, San Francisco, CA 94103',
    image: 'https://images.unsplash.com/photo-1565060169194-19fabf63012c?w=800&q=80',
    rating: 4.5,
    reviewCount: 18234,
    hours: 'Thu–Tue: 10AM–5PM · Closed Wed',
    highlights: ['Modern Art', 'Architecture', 'Rooftop Garden', 'Café'],
  },
];

// ─── CORS & Response Helpers ──────────────────────────────────────────────────

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

// ─── Request Handler ──────────────────────────────────────────────────────────

export default {
  async fetch(
    request: Request,
    env: Env,
    _ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // ── API Routes ──────────────────────────────────────────────────────────

    // GET /api/locations
    if (path === '/api/locations' && request.method === 'GET') {
      return jsonResponse(LOCATIONS);
    }

    // GET /api/locations/:id
    const locationMatch = path.match(/^\/api\/locations\/(\d+)$/);
    if (locationMatch && request.method === 'GET') {
      const id = parseInt(locationMatch[1], 10);
      const location = LOCATIONS.find((loc) => loc.id === id);

      if (!location) {
        return jsonResponse({ error: 'Location not found' }, 404);
      }

      return jsonResponse(location);
    }

    // ── Static Asset Fallback (SPA Routing) ─────────────────────────────────

    // Try to serve the static asset first
    const assetResponse = await env.ASSETS.fetch(request);

    // If the asset was found, serve it
    if (assetResponse.status !== 404) {
      return assetResponse;
    }

    // If not found, it's likely a client-side route (e.g. /details/1).
    // Rewrite to index.html so Expo Router handles it on the client.
    const indexRequest = new Request(
      new URL('/index.html', request.url).toString(),
      request
    );
    return env.ASSETS.fetch(indexRequest);
  },
};
