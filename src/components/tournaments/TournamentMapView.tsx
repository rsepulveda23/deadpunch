
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, List } from 'lucide-react';

interface Tournament {
  id: string;
  name: string;
  date: string;
  time: string;
  location_name: string;
  city: string;
  state: string;
  entry_fee: number;
  latitude?: number;
  longitude?: number;
}

interface TournamentMapViewProps {
  tournaments: Tournament[];
  onTournamentSelect: (tournament: Tournament) => void;
  onToggleView: () => void;
}

const TournamentMapView = ({ tournaments, onTournamentSelect, onToggleView }: TournamentMapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // For now, we'll show a placeholder map until Mapbox is properly integrated
    console.log('Map would display tournaments:', tournaments);
  }, [tournaments]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white">Tournament Map</h3>
        <Button
          variant="outline"
          onClick={onToggleView}
          className="border-deadpunch-gray-dark text-white hover:bg-deadpunch-dark-lighter"
        >
          <List className="h-4 w-4 mr-2" />
          List View
        </Button>
      </div>

      <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark">
        <CardContent className="p-0">
          <div 
            ref={mapContainer}
            className="h-96 bg-deadpunch-dark rounded-lg flex items-center justify-center"
          >
            <div className="text-center">
              <MapPin className="h-12 w-12 text-deadpunch-red mx-auto mb-4" />
              <h4 className="text-lg font-medium text-white mb-2">Map View</h4>
              <p className="text-deadpunch-gray-light max-w-md">
                Interactive map will display tournament locations here. 
                {tournaments.length} tournaments found.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tournament Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tournaments.slice(0, 6).map((tournament) => (
          <Card
            key={tournament.id}
            className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark hover:border-deadpunch-red cursor-pointer transition-colors"
            onClick={() => onTournamentSelect(tournament)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-sm line-clamp-2">
                {tournament.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1 text-xs text-deadpunch-gray-light">
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {tournament.city}, {tournament.state}
                </div>
                <div>
                  {new Date(tournament.date).toLocaleDateString()}
                </div>
                <div className="text-green-400">
                  ${tournament.entry_fee}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TournamentMapView;
