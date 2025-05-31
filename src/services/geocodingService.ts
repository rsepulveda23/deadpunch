
interface GeocodingResult {
  latitude: number;
  longitude: number;
  formatted_address?: string;
}

// Free geocoding service using Nominatim (OpenStreetMap)
export const geocodeLocation = async (location: string): Promise<GeocodingResult | null> => {
  try {
    // Clean up the location string
    const cleanLocation = location.trim();
    console.log('Geocoding location:', cleanLocation);
    
    // Check if it's a ZIP code
    const isZipCode = /^\d{5}(-\d{4})?$/.test(cleanLocation);
    
    let query = cleanLocation;
    if (isZipCode) {
      // For ZIP codes, add "USA" to get better results
      query = `${cleanLocation}, USA`;
    }
    
    console.log('Geocoding query:', query);
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=us`,
      {
        headers: {
          'User-Agent': 'DeadPunch Tournament Finder'
        }
      }
    );
    
    if (!response.ok) {
      console.error('Geocoding request failed:', response.status, response.statusText);
      throw new Error('Geocoding request failed');
    }
    
    const data = await response.json();
    console.log('Geocoding response:', data);
    
    if (data.length > 0) {
      const result = data[0];
      const coords = {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        formatted_address: result.display_name
      };
      console.log('Geocoding result:', coords);
      return coords;
    }
    
    console.log('No geocoding results found');
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

// Calculate distance between two points using Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in miles
  
  console.log(`Distance calculated: ${distance} miles between (${lat1}, ${lon1}) and (${lat2}, ${lon2})`);
  return distance;
};

// Geocode a tournament's location and update it in the database
export const geocodeTournamentLocation = async (tournament: {
  id: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
}): Promise<GeocodingResult | null> => {
  const fullAddress = `${tournament.address}, ${tournament.city}, ${tournament.state} ${tournament.zip_code}`;
  console.log('Geocoding tournament address:', fullAddress);
  return await geocodeLocation(fullAddress);
};
