/**
 * Location data types shared between client and worker
 */
export interface Location {
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
