
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
  latitude?: number;
  longitude?: number;
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
          game_type,
          entry_fee,
          prize_pool,
          created_at
        `)
        .order('date', { ascending: true });

      // Apply filters
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

      // Location-based filtering (simplified for now)
      if (filters.location) {
        const locationTerms = filters.location.toLowerCase().split(/[\s,]+/);
        
        // Create a filter that searches in city, state, or location_name
        const locationFilter = locationTerms.map(term => {
          return `city.ilike.%${term}%,state.ilike.%${term}%,location_name.ilike.%${term}%`;
        }).join(',');
        
        // For now, we'll use a simple text search. In production, you'd want to use geocoding
        query = query.or(`city.ilike.%${filters.location}%,state.ilike.%${filters.location}%,location_name.ilike.%${filters.location}%`);
      }

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

      console.log('Search results:', data);
      setTournaments(data || []);
      setSearchApplied(true);
      
      if (data && data.length === 0) {
        toast({
          title: "No Results",
          description: "No tournaments found matching your search criteria.",
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
          game_type,
          entry_fee,
          prize_pool,
          created_at
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
