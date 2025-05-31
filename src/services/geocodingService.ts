
interface GeocodingResult {
  latitude: number;
  longitude: number;
  formatted_address?: string;
}

// Free geocoding service using Nominatim (OpenStreetMap)
export const geocodeLocation = async (location: string): Promise<GeocodingResult | null> => {
  try {
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
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=us&addressdetails=1`,
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
      let result = data[0];
      
      // For ZIP codes, implement intelligent result selection
      if (isZipCode && data.length > 1) {
        console.log('🎯 Analyzing multiple results for ZIP code:', cleanLocation);
        
        // Priority order for ZIP code matching:
        // 1. Exact ZIP code match in display_name with 'postcode' type
        // 2. Exact ZIP code match in display_name with highest importance
        // 3. Result with matching postcode in address details
        // 4. First result that contains the ZIP code
        
        const zipNumber = cleanLocation.substring(0, 5);
        
        // First try to find exact postcode type matches
        const postcodeMatches = data.filter(item => 
          item.type === 'postcode' && 
          (item.display_name?.includes(zipNumber) || item.address?.postcode === zipNumber)
        );
        
        if (postcodeMatches.length > 0) {
          result = postcodeMatches[0];
          console.log('🎯 Found postcode type match:', result);
        } else {
          // Look for ZIP in display name with highest importance
          const displayNameMatches = data
            .filter(item => item.display_name?.includes(zipNumber))
            .sort((a, b) => parseFloat(b.importance || '0') - parseFloat(a.importance || '0'));
          
          if (displayNameMatches.length > 0) {
            result = displayNameMatches[0];
            console.log('🎯 Found display name match with importance:', result.importance, result);
          } else {
            // Fallback to address postcode match
            const addressMatches = data.filter(item => item.address?.postcode === zipNumber);
            if (addressMatches.length > 0) {
              result = addressMatches[0];
              console.log('🎯 Found address postcode match:', result);
            }
          }
        }
        
        console.log('🎯 Selected result for ZIP', zipNumber, ':', {
          lat: result.lat,
          lon: result.lon,
          type: result.type,
          importance: result.importance,
          display_name: result.display_name
        });
      }
      
      const coords = {
        latitude: parseFloat(result.lat),
        longitude: parseFloat(result.lon),
        formatted_address: result.display_name
      };
      
      // Enhanced coordinate validation
      if (isNaN(coords.latitude) || isNaN(coords.longitude)) {
        console.error('❌ Invalid coordinates received:', coords, 'from result:', result);
        return null;
      }
      
      // Validate coordinates are within reasonable bounds for US
      if (coords.latitude < 24 || coords.latitude > 49 || coords.longitude < -125 || coords.longitude > -66) {
        console.error('❌ Coordinates outside US bounds:', coords);
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
  
  console.log(`📏 Distance: ${distance.toFixed(1)} miles between (${lat1.toFixed(4)}, ${lon1.toFixed(4)}) and (${lat2.toFixed(4)}, ${lon2.toFixed(4)})`);
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
