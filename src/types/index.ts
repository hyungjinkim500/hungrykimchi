export type Business = {
  id: string;
  name: string;
  category: string | null;
  subcategory: string | null;
  phone: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  city: string | null;
  google_place_id: string | null;
  google_rating: number | null;
  ok_score: number;
  ok_level: number;
  is_verified: boolean;
  created_at: string;
};