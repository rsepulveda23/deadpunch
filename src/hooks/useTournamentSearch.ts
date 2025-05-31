
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { geocodeLocation, calculateDistance } from '@/services/geocodingService';

interface SearchFilters {
  location: string;
  radius: string;
  gameType: string;
  startDate: string;
  endDate: string;
  minEntryFee: string;
  maxEntryFee: string;
}

// Type for data coming from Supabase
interface TournamentFromDB {
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
interface Tournament extends TournamentFromDB {
  distance?: number;
}

export const useTournamentSearch = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchApplied, setSearchApplied] = useState(false);

  const searchTournaments = useCallback(async (filters: SearchFilters) => {
    setLoading(true);
    console.log('🔍 Starting tournament search with filters:', filters);
    
    try {
      let query = supabase
        .from('tournaments')
        .select(`
          id,
          name,
          date,
          time,
          location_name,
          city,
          state,
          zip_code,
          game_type,
          entry_fee,
          prize_pool,
          created_at,
          latitude,
          longitude
        `)
        .order('date', { ascending: true });

      // Apply non-location filters first
      if (filters.gameType) {
        query = query.eq('game_type', filters.gameType);
        console.log('🎮 Applied game type filter:', filters.gameType);
      }

      if (filters.startDate) {
        query = query.gte('date', filters.startDate);
        console.log('📅 Applied start date filter:', filters.startDate);
      }

      if (filters.endDate) {
        query = query.lte('date', filters.endDate);
        console.log('📅 Applied end date filter:', filters.endDate);
      }

      if (filters.minEntryFee) {
        query = query.gte('entry_fee', parseFloat(filters.minEntryFee));
        console.log('💰 Applied min entry fee filter:', filters.minEntryFee);
      }

      if (filters.maxEntryFee) {
        query = query.lte('entry_fee', parseFloat(filters.maxEntryFee));
        console.log('💰 Applied max entry fee filter:', filters.maxEntryFee);
      }

      // Get all tournaments that match non-location criteria
      const { data, error } = await query;

      if (error) {
        console.error('❌ Database query error:', error);
        toast({
          title: "Search Error",
          description: "Failed to search tournaments. Please try again.",
          variant: "destructive",
        });
        return;
      }

      let filteredTournaments: Tournament[] = (data || []) as Tournament[];
      console.log(`📊 Found ${filteredTournaments.length} tournaments before location filtering`);

      // Apply location-based filtering if specified
      if (filters.location && filteredTournaments.length > 0) {
        const locationTerm = filters.location.trim();
        const radiusMiles = parseFloat(filters.radius) || 25;
        
        console.log('📍 Location search term:', locationTerm);
        console.log('📏 Search radius:', radiusMiles, 'miles');
        
        // Check if it looks like a ZIP code (5 digits or 5+4 format)
        const isZipCode = /^\d{5}(-\d{4})?$/.test(locationTerm);
        console.log('📮 Is ZIP code:', isZipCode);
        
        if (isZipCode || locationTerm.includes(',')) {
          // Try to geocode the search location for radius search
          console.log('🌐 Attempting to geocode location for radius search...');
          const searchCoords = await geocodeLocation(locationTerm);
          
          if (searchCoords) {
            console.log('✅ Successfully geocoded search location:', searchCoords);
            
            // Count tournaments with coordinates
            const tournamentsWithCoords = filteredTournaments.filter(t => 
              t.latitude !== null && t.longitude !== null
            );
            console.log(`🏟️ ${tournamentsWithCoords.length} of ${filteredTournaments.length} tournaments have coordinates`);
            
            // Filter tournaments within radius and calculate distances
            const tournamentsWithDistance: Tournament[] = [];
            
            filteredTournaments.forEach(tournament => {
              if (tournament.latitude !== null && tournament.longitude !== null) {
                const distance = calculateDistance(
                  searchCoords.latitude,
                  searchCoords.longitude,
                  tournament.latitude,
                  tournament.longitude
                );
                
                if (distance <= radiusMiles && distance !== Infinity) {
                  console.log(`✅ Tournament "${tournament.name}" included: ${distance.toFixed(1)} miles`);
                  tournamentsWithDistance.push({ ...tournament, distance });
                } else {
                  console.log(`❌ Tournament "${tournament.name}" excluded: ${distance.toFixed(1)} miles (> ${radiusMiles})`);
                }
              } else {
                // Fallback: include tournaments that match the exact ZIP code
                if (isZipCode && tournament.zip_code === locationTerm.substring(0, 5)) {
                  console.log(`📮 Tournament "${tournament.name}" included by ZIP match:`, tournament.zip_code);
                  tournamentsWithDistance.push(tournament);
                }
              }
            });
            
            // Sort by distance (tournaments with distance first, then by date)
            filteredTournaments = tournamentsWithDistance.sort((a, b) => {
              if (a.distance !== undefined && b.distance !== undefined) {
                return a.distance - b.distance;
              }
              if (a.distance !== undefined && b.distance === undefined) {
                return -1;
              }
              if (a.distance === undefined && b.distance !== undefined) {
                return 1;
              }
              return new Date(a.date).getTime() - new Date(b.date).getTime();
            });
            
            console.log(`✅ Final radius search results: ${filteredTournaments.length} tournaments`);
            
            if (filteredTournaments.length === 0) {
              toast({
                title: "No Results Within Radius",
                description: `No tournaments found within ${radiusMiles} miles of ${locationTerm}. Try increasing your search radius.`,
              });
            } else {
              toast({
                title: "Radius Search Complete",
                description: `Found ${filteredTournaments.length} tournament(s) within ${radiusMiles} miles of ${locationTerm}.`,
              });
            }
          } else {
            console.log('❌ Geocoding failed, falling back to text/ZIP search');
            // Fallback to exact ZIP code match or text search
            if (isZipCode) {
              filteredTournaments = filteredTournaments.filter(tournament => 
                tournament.zip_code === locationTerm.substring(0, 5)
              );
              console.log(`📮 ZIP fallback search results: ${filteredTournaments.length} tournaments`);
              
              if (filteredTournaments.length > 0) {
                toast({
                  title: "ZIP Code Search",
                  description: `Location geocoding failed. Showing ${filteredTournaments.length} tournament(s) with ZIP code ${locationTerm}.`,
                });
              }
            } else {
              // Text-based search for city/state/location name
              filteredTournaments = filteredTournaments.filter(tournament =>
                tournament.city.toLowerCase().includes(locationTerm.toLowerCase()) ||
                tournament.state.toLowerCase().includes(locationTerm.toLowerCase()) ||
                tournament.location_name.toLowerCase().includes(locationTerm.toLowerCase())
              );
              console.log(`🔤 Text fallback search results: ${filteredTournaments.length} tournaments`);
              
              if (filteredTournaments.length > 0) {
                toast({
                  title: "Text Search",
                  description: `Location geocoding failed. Showing ${filteredTournaments.length} tournament(s) matching "${locationTerm}".`,
                });
              }
            }
          }
        } else {
          // Text-based search for city/state/location name
          filteredTournaments = filteredTournaments.filter(tournament =>
            tournament.city.toLowerCase().includes(locationTerm.toLowerCase()) ||
            tournament.state.toLowerCase().includes(locationTerm.toLowerCase()) ||
            tournament.location_name.toLowerCase().includes(locationTerm.toLowerCase())
          );
          console.log(`🔤 Text search results: ${filteredTournaments.length} tournaments`);
          
          if (filteredTournaments.length > 0) {
            toast({
              title: "Text Search Complete",
              description: `Found ${filteredTournaments.length} tournament(s) matching "${locationTerm}".`,
            });
          }
        }
      }

      console.log('🏁 Final search results:', filteredTournaments.length, 'tournaments');
      setTournaments(filteredTournaments);
      setSearchApplied(true);
      
      if (filteredTournaments.length === 0 && (!filters.location || filters.location.trim() === '')) {
        toast({
          title: "No Results",
          description: "No tournaments found matching your search criteria.",
        });
      }
    } catch (error) {
      console.error('❌ Search error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while searching.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(async () => {
    setLoading(true);
    setSearchApplied(false);
    console.log('🔄 Loading all tournaments...');
    
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select(`
          id,
          name,
          date,
          time,
          location_name,
          city,
          state,
          zip_code,
          game_type,
          entry_fee,
          prize_pool,
          created_at,
          latitude,
          longitude
        `)
        .order('date', { ascending: true });

      if (error) {
        console.error('❌ Error loading tournaments:', error);
        toast({
          title: "Error",
          description: "Failed to load tournaments",
          variant: "destructive",
        });
        return;
      }

      const allTournaments = (data || []) as Tournament[];
      console.log(`✅ Loaded ${allTournaments.length} tournaments`);
      setTournaments(allTournaments);
    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tournaments,
    loading,
    searchApplied,
    searchTournaments,
    clearSearch
  };
};
