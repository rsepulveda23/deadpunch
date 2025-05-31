
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, DollarSign, Trophy, Loader2, Map, List } from 'lucide-react';
import TournamentSearch from './TournamentSearch';
import TournamentMapView from './TournamentMapView';
import { useTournamentSearch } from '@/hooks/useTournamentSearch';

interface SearchFilters {
  location: string;
  radius: string;
  gameType: string;
  startDate: string;
  endDate: string;
  minEntryFee: string;
  maxEntryFee: string;
}

const TournamentList = () => {
  const { tournaments, loading, searchApplied, searchTournaments, clearSearch } = useTournamentSearch();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  useEffect(() => {
    // Load all tournaments on initial mount
    clearSearch();
  }, [clearSearch]);

  const handleSearch = (filters: SearchFilters) => {
    searchTournaments(filters);
  };

  const handleClearSearch = () => {
    clearSearch();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDistance = (distance?: number) => {
    if (distance === undefined) return null;
    return distance < 1 ? '< 1 mile' : `${distance.toFixed(1)} miles`;
  };

  const handleTournamentSelect = (tournament: any) => {
    // Navigate to tournament detail or show in sidebar
    console.log('Selected tournament:', tournament);
  };

  if (loading) {
    return (
      <div>
        <TournamentSearch 
          onSearch={handleSearch} 
          onClear={handleClearSearch}
          isLoading={loading}
        />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-deadpunch-red" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <TournamentSearch 
        onSearch={handleSearch} 
        onClear={handleClearSearch}
        isLoading={loading}
      />

      {/* View Toggle */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white">
          {searchApplied ? 'Search Results' : 'Upcoming Tournaments'}
          <span className="text-lg font-normal text-deadpunch-gray-light ml-2">
            ({tournaments.length} found)
          </span>
        </h2>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
            size="sm"
            className={viewMode === 'list' ? 'bg-deadpunch-red hover:bg-deadpunch-red-hover' : 'border-deadpunch-gray-dark text-white hover:bg-deadpunch-dark-lighter'}
          >
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            onClick={() => setViewMode('map')}
            size="sm"
            className={viewMode === 'map' ? 'bg-deadpunch-red hover:bg-deadpunch-red-hover' : 'border-deadpunch-gray-dark text-white hover:bg-deadpunch-dark-lighter'}
          >
            <Map className="h-4 w-4 mr-2" />
            Map
          </Button>
        </div>
      </div>

      {/* Content based on view mode */}
      {viewMode === 'map' ? (
        <TournamentMapView 
          tournaments={tournaments}
          onTournamentSelect={handleTournamentSelect}
          onToggleView={() => setViewMode('list')}
        />
      ) : (
        <>
          {tournaments.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-deadpunch-gray-light mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">
                {searchApplied ? 'No Tournaments Found' : 'No Tournaments Yet'}
              </h3>
              <p className="text-deadpunch-gray-light">
                {searchApplied 
                  ? 'Try adjusting your search criteria or expanding your search radius.'
                  : 'Be the first to submit a tournament and help build the community!'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tournaments.map((tournament) => (
                <Link key={tournament.id} to={`/tournaments/${tournament.id}`}>
                  <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark hover:border-deadpunch-red transition-all duration-300 hover:scale-105 cursor-pointer h-full">
                    <CardHeader>
                      <CardTitle className="text-white text-lg line-clamp-2">
                        {tournament.name}
                      </CardTitle>
                      <CardDescription className="text-deadpunch-gray-light">
                        <div className="flex items-center mb-2">
                          <Calendar className="h-4 w-4 mr-2" />
                          {formatDate(tournament.date)}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {tournament.city}, {tournament.state}
                          {tournament.distance !== undefined && (
                            <span className="ml-2 text-deadpunch-red font-medium">
                              ({formatDistance(tournament.distance)})
                            </span>
                          )}
                        </div>
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="secondary" className="bg-deadpunch-red/20 text-deadpunch-red border-deadpunch-red">
                            {tournament.game_type}
                          </Badge>
                          <span className="text-sm text-deadpunch-gray-light">
                            {formatTime(tournament.time)}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-green-400">
                            <DollarSign className="h-4 w-4 mr-1" />
                            Entry: ${tournament.entry_fee}
                          </div>
                          {tournament.prize_pool && (
                            <div className="text-deadpunch-gray-light">
                              Prize: {tournament.prize_pool}
                            </div>
                          )}
                        </div>
                        
                        <p className="text-xs text-deadpunch-gray-light">
                          {tournament.location_name}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TournamentList;
