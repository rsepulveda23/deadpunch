
export interface SearchFilters {
  location: string;
  radius: string;
  gameType: string;
  startDate: string;
  endDate: string;
  minEntryFee: string;
  maxEntryFee: string;
}

// Type for data coming from Supabase
export interface TournamentFromDB {
  id: string;
  name: string;
  date: string;
  time: string;
  location_name: string;
  city: string;
  state: string;
  zip_code: string;
  game_type: string;
  entry_fee: number;
  prize_pool: string | null;
  created_at: string;
  latitude: number | null;
  longitude: number | null;
}

// Extended type with optional distance for display
export interface Tournament extends TournamentFromDB {
  distance?: number;
}
