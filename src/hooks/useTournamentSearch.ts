
import { useState, useCallback } from 'react';
import { SearchFilters, Tournament } from '@/types/tournamentSearch';
import { TournamentSearchService } from '@/services/tournamentSearchService';

export const useTournamentSearch = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchApplied, setSearchApplied] = useState(false);
  
  const searchService = new TournamentSearchService();

  const searchTournaments = useCallback(async (filters: SearchFilters) => {
    setLoading(true);
    
    try {
      const results = await searchService.searchTournaments(filters);
      setTournaments(results);
      setSearchApplied(true);
    } catch (error) {
      console.error('Search error:', error);
      setTournaments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearSearch = useCallback(async () => {
    setLoading(true);
    setSearchApplied(false);
    
    try {
      const results = await searchService.getAllTournaments();
      setTournaments(results);
    } catch (error) {
      console.error('Error loading tournaments:', error);
      setTournaments([]);
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
