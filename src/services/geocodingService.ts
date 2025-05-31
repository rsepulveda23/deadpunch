
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
    console.log('🔍 Geocoding location:', cleanLocation);
    
    if (!cleanLocation) {
      console.log('❌ Empty location provided');
      return null;
    }
    
    // Check if it's a ZIP code
    const isZipCode = /^\d{5}(-\d{4})?$/.test(cleanLocation);
    
    let query = cleanLocation;
    if (isZipCode) {
      // For ZIP codes, add "USA" to get better results
      query = `${cleanLocation}, USA`;
    }
    
    console.log('🌐 Geocoding query:', query);
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=3&countrycodes=us&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'DeadPunch Tournament Finder'
        }
      }
    );
    
    if (!response.ok) {
      console.error('❌ Geocoding request failed:', response.status, response.statusText);
      throw new Error(`Geocoding request failed: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📍 Geocoding API response:', data);
    
    if (data.length > 0) {
      // For ZIP codes, try to find the most specific match
      let result = data[0];
      if (isZipCode && data.length > 1) {
        // Look for a result that includes the ZIP code in the address
        const zipMatch = data.find(item => 
          item.display_name && item.display_name.includes(cleanLocation)
        );
        if (zipMatch) {
          result = zipMatch;
          console.log('🎯 Found better ZIP code match:', result);
        }
      }
      
      const coords = {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        formatted_address: result.display_name
      };
      
      // Validate coordinates
      if (isNaN(coords.latitude) || isNaN(coords.longitude)) {
        console.error('❌ Invalid coordinates received:', coords);
        return null;
      }
      
      console.log('✅ Geocoding successful:', coords);
      return coords;
    }
    
    console.log('❌ No geocoding results found for:', query);
    return null;
  } catch (error) {
    console.error('❌ Geocoding error:', error);
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
  // Validate input coordinates
  if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
    console.error('❌ Invalid coordinates for distance calculation:', { lat1, lon1, lat2, lon2 });
    return Infinity;
  }
  
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in miles
  
  console.log(`📏 Distance: ${distance.toFixed(1)} miles between (${lat1}, ${lon1}) and (${lat2}, ${lon2})`);
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
  console.log('🏟️ Geocoding tournament address:', fullAddress);
  return await geocodeLocation(fullAddress);
};
