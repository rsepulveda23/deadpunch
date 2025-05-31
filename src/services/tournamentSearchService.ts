
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

      // Apply non-location filters
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
      if (filters.location && filteredTournaments.length > 0) {
        filteredTournaments = await this.applyLocationFilter(filteredTournaments, filters);
      }

      console.log('🏁 Final search results:', filteredTournaments.length, 'tournaments');
      
      if (filteredTournaments.length === 0 && (!filters.location || filters.location.trim() === '')) {
        toast({
          title: "No Results",
          description: "No tournaments found matching your search criteria.",
        });
      }

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
    
    const isZipCode = /^\d{5}(-\d{4})?$/.test(locationTerm);
    console.log('📮 Is ZIP code:', isZipCode);
    
    if (isZipCode || locationTerm.includes(',')) {
      return await this.performRadiusSearch(tournaments, locationTerm, radiusMiles);
    } else {
      return this.performTextSearch(tournaments, locationTerm);
    }
  }

  private async performRadiusSearch(tournaments: Tournament[], locationTerm: string, radiusMiles: number): Promise<Tournament[]> {
    console.log('🌐 Attempting to geocode location for radius search...');
    const searchCoords = await geocodeLocation(locationTerm);
    
    if (searchCoords) {
      console.log('✅ Successfully geocoded search location:', searchCoords);
      return this.filterByRadius(tournaments, searchCoords, radiusMiles, locationTerm);
    } else {
      console.log('❌ Geocoding failed, falling back to text/ZIP search');
      return this.performFallbackSearch(tournaments, locationTerm);
    }
  }

  private filterByRadius(tournaments: Tournament[], searchCoords: any, radiusMiles: number, locationTerm: string): Tournament[] {
    console.log(`🎯 Filtering tournaments by radius from coordinates: ${searchCoords.latitude.toFixed(4)}, ${searchCoords.longitude.toFixed(4)}`);
    
    // Only consider tournaments that have valid coordinates for radius search
    const tournamentsWithCoords = tournaments.filter(t => 
      t.latitude !== null && t.longitude !== null && 
      !isNaN(t.latitude) && !isNaN(t.longitude)
    );
    
    const tournamentsWithoutCoords = tournaments.length - tournamentsWithCoords.length;
    
    console.log(`🏟️ ${tournamentsWithCoords.length} of ${tournaments.length} tournaments have valid coordinates`);
    if (tournamentsWithoutCoords > 0) {
      console.log(`⚠️ ${tournamentsWithoutCoords} tournaments missing coordinates will be excluded from radius search`);
    }
    
    const tournamentsWithDistance: Tournament[] = [];
    
    tournamentsWithCoords.forEach(tournament => {
      const distance = calculateDistance(
        searchCoords.latitude,
        searchCoords.longitude,
        tournament.latitude!,
        tournament.longitude!
      );
      
      if (distance !== Infinity && distance <= radiusMiles) {
        console.log(`✅ Tournament "${tournament.name}" included: ${distance.toFixed(1)} miles (${tournament.city}, ${tournament.state})`);
        tournamentsWithDistance.push({ ...tournament, distance });
      } else {
        console.log(`❌ Tournament "${tournament.name}" excluded: ${distance === Infinity ? 'Invalid distance' : distance.toFixed(1) + ' miles'} (> ${radiusMiles}) - ${tournament.city}, ${tournament.state}`);
      }
    });
    
    // Sort by distance, then by date
    const sortedTournaments = tournamentsWithDistance.sort((a, b) => {
      if (a.distance !== undefined && b.distance !== undefined) {
        return a.distance - b.distance;
      }
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    
    console.log(`✅ Final radius search results: ${sortedTournaments.length} tournaments within ${radiusMiles} miles`);
    
    // Enhanced error reporting
    if (sortedTournaments.length === 0) {
      toast({
        title: "No Results Within Radius",
        description: `No tournaments found within ${radiusMiles} miles of ${locationTerm}. Found ${tournaments.length} total tournaments, ${tournamentsWithoutCoords} missing coordinates. Try "Add Map Coordinates" or increase radius.`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Radius Search Complete",
        description: `Found ${sortedTournaments.length} tournament(s) within ${radiusMiles} miles of ${locationTerm}. ${tournamentsWithoutCoords} tournaments excluded due to missing coordinates.`,
      });
    }
    
    return sortedTournaments;
  }

  private performFallbackSearch(tournaments: Tournament[], locationTerm: string): Tournament[] {
    const isZipCode = /^\d{5}(-\d{4})?$/.test(locationTerm);
    
    if (isZipCode) {
      const filteredTournaments = tournaments.filter(tournament => 
        tournament.zip_code === locationTerm.substring(0, 5)
      );
      console.log(`📮 ZIP fallback search results: ${filteredTournaments.length} tournaments`);
      
      if (filteredTournaments.length > 0) {
        toast({
          title: "ZIP Code Search",
          description: `Geocoding failed. Showing ${filteredTournaments.length} tournament(s) with ZIP code ${locationTerm}. Note: This is not a radius search.`,
        });
      } else {
        toast({
          title: "No Results",
          description: `No tournaments found with ZIP code ${locationTerm}. The search location could not be geocoded.`,
          variant: "destructive",
        });
      }
      return filteredTournaments;
    } else {
      return this.performTextSearch(tournaments, locationTerm);
    }
  }

  private performTextSearch(tournaments: Tournament[], locationTerm: string): Tournament[] {
    const filteredTournaments = tournaments.filter(tournament =>
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
    } else {
      toast({
        title: "No Results",
        description: `No tournaments found matching "${locationTerm}".`,
        variant: "destructive",
      });
    }
    
    return filteredTournaments;
  }
}
