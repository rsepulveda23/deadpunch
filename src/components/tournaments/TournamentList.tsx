import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, DollarSign, Trophy, Loader2, Map, List } from 'lucide-react';
import TournamentSearch from './TournamentSearch';
import TournamentMapView from './TournamentMapView';
import TournamentSearchDiagnostics from './TournamentSearchDiagnostics';
import TournamentCard from './TournamentCard';
import GeocodeButton from './GeocodeButton';
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
  const [showDiagnostics, setShowDiagnostics] = useState(false);

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

  const handleGeocodeComplete = () => {
    // Refresh the tournament list after geocoding
    if (searchApplied) {
      // Re-run the last search to update results with new coordinates
      window.location.reload();
    } else {
      clearSearch();
    }
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

      {/* Diagnostics and Geocoding Controls */}
      <div className="mb-4 flex gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDiagnostics(!showDiagnostics)}
          className="text-deadpunch-gray-light hover:text-white"
        >
          {showDiagnostics ? 'Hide' : 'Show'} Search Diagnostics
        </Button>
        <GeocodeButton onComplete={handleGeocodeComplete} />
      </div>

      {/* Diagnostics Panel */}
      {showDiagnostics && <TournamentSearchDiagnostics />}

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
              <div className="h-16 w-16 text-deadpunch-gray-light mx-auto mb-4">🏆</div>
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
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TournamentList;
