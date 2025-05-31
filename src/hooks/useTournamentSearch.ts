
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

interface Tournament {
  id: string;
  name: string;
  date: string;
  time: string;
  location_name: string;
  city: string;
  state: string;
  game_type: string;
  entry_fee: number;
  prize_pool: string;
  created_at: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
  distance?: number; // Add distance for sorting
}

export const useTournamentSearch = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchApplied, setSearchApplied] = useState(false);

  const searchTournaments = useCallback(async (filters: SearchFilters) => {
    setLoading(true);
    try {
      console.log('Searching tournaments with filters:', filters);
      
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
      }

      if (filters.startDate) {
        query = query.gte('date', filters.startDate);
      }

      if (filters.endDate) {
        query = query.lte('date', filters.endDate);
      }

      if (filters.minEntryFee) {
        query = query.gte('entry_fee', parseFloat(filters.minEntryFee));
      }

      if (filters.maxEntryFee) {
        query = query.lte('entry_fee', parseFloat(filters.maxEntryFee));
      }

      // Get all tournaments that match non-location criteria
      const { data, error } = await query;

      if (error) {
        console.error('Error searching tournaments:', error);
        toast({
          title: "Search Error",
          description: "Failed to search tournaments. Please try again.",
          variant: "destructive",
        });
        return;
      }

      let filteredTournaments = data || [];

      // Apply location-based filtering if specified
      if (filters.location && filteredTournaments.length > 0) {
        const locationTerm = filters.location.trim();
        const radiusMiles = parseFloat(filters.radius) || 25;
        
        // Check if it looks like a ZIP code (5 digits or 5+4 format)
        const isZipCode = /^\d{5}(-\d{4})?$/.test(locationTerm);
        
        if (isZipCode || locationTerm.includes(',')) {
          // Try to geocode the search location for radius search
          console.log('Attempting to geocode location:', locationTerm);
          const searchCoords = await geocodeLocation(locationTerm);
          
          if (searchCoords) {
            console.log('Search coordinates:', searchCoords);
            
            // Filter tournaments within radius and calculate distances
            filteredTournaments = filteredTournaments
              .map(tournament => {
                if (tournament.latitude && tournament.longitude) {
                  const distance = calculateDistance(
                    searchCoords.latitude,
                    searchCoords.longitude,
                    tournament.latitude,
                    tournament.longitude
                  );
                  return { ...tournament, distance };
                }
                return tournament;
              })
              .filter(tournament => {
                // Include tournaments within radius or those without coordinates
                if (tournament.distance !== undefined) {
                  return tournament.distance <= radiusMiles;
                }
                // Fallback: include tournaments that match the exact ZIP code
                return tournament.zip_code === locationTerm.substring(0, 5);
              })
              .sort((a, b) => {
                // Sort by distance if available, otherwise by date
                if (a.distance !== undefined && b.distance !== undefined) {
                  return a.distance - b.distance;
                }
                return new Date(a.date).getTime() - new Date(b.date).getTime();
              });
          } else {
            // Fallback to exact ZIP code match if geocoding fails
            if (isZipCode) {
              filteredTournaments = filteredTournaments.filter(tournament => 
                tournament.zip_code === locationTerm.substring(0, 5)
              );
            } else {
              // Text-based search for city/state
              filteredTournaments = filteredTournaments.filter(tournament =>
                tournament.city.toLowerCase().includes(locationTerm.toLowerCase()) ||
                tournament.state.toLowerCase().includes(locationTerm.toLowerCase()) ||
                tournament.location_name.toLowerCase().includes(locationTerm.toLowerCase())
              );
            }
          }
        } else {
          // Text-based search for city/state/location name
          filteredTournaments = filteredTournaments.filter(tournament =>
            tournament.city.toLowerCase().includes(locationTerm.toLowerCase()) ||
            tournament.state.toLowerCase().includes(locationTerm.toLowerCase()) ||
            tournament.location_name.toLowerCase().includes(locationTerm.toLowerCase())
          );
        }
      }

      console.log('Search results:', filteredTournaments);
      setTournaments(filteredTournaments);
      setSearchApplied(true);
      
      if (filteredTournaments.length === 0) {
        toast({
          title: "No Results",
          description: "No tournaments found matching your search criteria.",
        });
      } else if (filters.location && filteredTournaments[0]?.distance !== undefined) {
        toast({
          title: "Search Complete",
          description: `Found ${filteredTournaments.length} tournament(s) within ${filters.radius} miles.`,
        });
      }
    } catch (error) {
      console.error('Search error:', error);
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
    try {
      console.log('Loading all tournaments...');
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
        console.error('Error loading tournaments:', error);
        toast({
          title: "Error",
          description: "Failed to load tournaments",
          variant: "destructive",
        });
        return;
      }

      setTournaments(data || []);
    } catch (error) {
      console.error('Error:', error);
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
