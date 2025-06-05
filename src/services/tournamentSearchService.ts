
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { geocodeLocation, calculateDistance } from '@/services/geocodingService';
import { SearchFilters, Tournament, TournamentFromDB } from '@/types/tournamentSearch';

export class TournamentSearchService {
  async searchTournaments(filters: SearchFilters): Promise<Tournament[]> {
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
      query = this.applyNonLocationFilters(query, filters);

      const { data, error } = await query;

      if (error) {
        console.error('❌ Database query error:', error);
        toast({
          title: "Search Error",
          description: "Failed to search tournaments. Please try again.",
          variant: "destructive",
        });
        return [];
      }

      let filteredTournaments: Tournament[] = (data || []) as Tournament[];
      console.log(`📊 Found ${filteredTournaments.length} tournaments before location filtering`);

      // Apply location-based filtering if specified
      if (filters.location?.trim()) {
        filteredTournaments = await this.applyLocationFilter(filteredTournaments, filters);
      }

      console.log('🏁 Final search results:', filteredTournaments.length, 'tournaments');
      
      return filteredTournaments;
    } catch (error) {
      console.error('❌ Search error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while searching.",
        variant: "destructive",
      });
      return [];
    }
  }

  async getAllTournaments(): Promise<Tournament[]> {
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
        return [];
      }

      const allTournaments = (data || []) as Tournament[];
      console.log(`✅ Loaded ${allTournaments.length} tournaments`);
      return allTournaments;
    } catch (error) {
      console.error('❌ Error:', error);
      return [];
    }
  }

  private applyNonLocationFilters(query: any, filters: SearchFilters) {
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

    return query;
  }

  private async applyLocationFilter(tournaments: Tournament[], filters: SearchFilters): Promise<Tournament[]> {
    const locationTerm = filters.location.trim();
    const radiusMiles = parseFloat(filters.radius) || 25;
    
    console.log('📍 Location search term:', locationTerm);
    console.log('📏 Search radius:', radiusMiles, 'miles');
    
    // Check if it's a ZIP code (5 digits with optional +4)
    const isZipCode = /^\d{5}(-\d{4})?$/.test(locationTerm);
    console.log('📮 Is ZIP code:', isZipCode);
    
    // For ZIP codes or addresses with commas, try radius search first
    if (isZipCode || locationTerm.includes(',')) {
      const radiusResults = await this.performRadiusSearch(tournaments, locationTerm, radiusMiles);
      if (radiusResults.length > 0) {
        return radiusResults;
      }
      // If radius search fails, fall back to text search
      console.log('🔄 Radius search failed, trying text search fallback');
      return this.performTextSearch(tournaments, locationTerm);
    }
    
    // For simple text searches (city/state names), do text search first
    const textResults = this.performTextSearch(tournaments, locationTerm);
    if (textResults.length > 0) {
      return textResults;
    }
    
    // If text search fails, try radius search as fallback
    console.log('🔄 Text search failed, trying radius search fallback');
    return await this.performRadiusSearch(tournaments, locationTerm, radiusMiles);
  }

  private async performRadiusSearch(tournaments: Tournament[], locationTerm: string, radiusMiles: number): Promise<Tournament[]> {
    console.log('🌐 Attempting radius search for:', locationTerm);
    
    try {
      const searchCoords = await geocodeLocation(locationTerm);
      
      if (!searchCoords) {
        console.log('❌ Geocoding failed for:', locationTerm);
        return [];
      }
      
      console.log('✅ Geocoded location:', searchCoords);
      
      // Filter tournaments by radius
      const tournamentsWithCoords = tournaments.filter(t => 
        t.latitude !== null && t.longitude !== null && 
        !isNaN(t.latitude) && !isNaN(t.longitude)
      );
      
      const tournamentsInRadius: Tournament[] = [];
      
      for (const tournament of tournamentsWithCoords) {
        const distance = calculateDistance(
          searchCoords.latitude,
          searchCoords.longitude,
          tournament.latitude!,
          tournament.longitude!
        );
        
        if (distance !== Infinity && distance <= radiusMiles) {
          tournamentsInRadius.push({ ...tournament, distance });
        }
      }
      
      // Sort by distance
      tournamentsInRadius.sort((a, b) => (a.distance || 0) - (b.distance || 0));
      
      console.log(`✅ Radius search found ${tournamentsInRadius.length} tournaments within ${radiusMiles} miles`);
      
      if (tournamentsInRadius.length > 0) {
        toast({
          title: "Location Search",
          description: `Found ${tournamentsInRadius.length} tournament(s) within ${radiusMiles} miles of ${locationTerm}`,
        });
      }
      
      return tournamentsInRadius;
      
    } catch (error) {
      console.error('❌ Radius search error:', error);
      return [];
    }
  }

  private performTextSearch(tournaments: Tournament[], locationTerm: string): Tournament[] {
    console.log('🔤 Performing text search for:', locationTerm);
    
    const searchLower = locationTerm.toLowerCase();
    
    const filteredTournaments = tournaments.filter(tournament => {
      // Check city, state, location name, and ZIP code
      const cityMatch = tournament.city.toLowerCase().includes(searchLower);
      const stateMatch = tournament.state.toLowerCase().includes(searchLower);
      const locationMatch = tournament.location_name.toLowerCase().includes(searchLower);
      const zipMatch = tournament.zip_code.includes(locationTerm);
      
      return cityMatch || stateMatch || locationMatch || zipMatch;
    });
    
    console.log(`🔤 Text search found ${filteredTournaments.length} tournaments`);
    
    if (filteredTournaments.length > 0) {
      toast({
        title: "Text Search",
        description: `Found ${filteredTournaments.length} tournament(s) matching "${locationTerm}"`,
      });
    } else {
      toast({
        title: "No Results",
        description: `No tournaments found matching "${locationTerm}". Try a different search term or check the radius.`,
        variant: "destructive",
      });
    }
    
    return filteredTournaments;
  }
}
