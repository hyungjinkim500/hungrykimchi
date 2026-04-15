export type City = 'hanoi' | 'hochiminh' | null;

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
  name_ko: string | null;
  primary_type_ko: string | null;
  is_korean_run: boolean;
  registration_type: string | null;
  owner_name: string | null;
  owner_position: string | null;
  owner_email: string | null;
  owner_kakao: string | null;
  owner_contact: string | null;
  pending_approval: boolean;
};