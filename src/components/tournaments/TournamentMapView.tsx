
import React, { useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
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
  const map = useRef<any>(null);
  const markers = useRef<any[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Clean up existing map
    if (map.current) {
      markers.current.forEach(marker => marker.remove());
      markers.current = [];
      map.current.remove();
    }

    // Create map using Leaflet (free alternative to Mapbox)
    if (typeof window !== 'undefined') {
      import('leaflet').then(L => {
        // Initialize map
        map.current = L.map(mapContainer.current!, {
          center: [39.8283, -98.5795], // Center of USA
          zoom: 4,
          zoomControl: true
        });

        // Add OpenStreetMap tiles (free)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map.current);

        // Add tournament markers
        const tournamentsWithCoords = tournaments.filter(t => 
          t.latitude !== null && t.longitude !== null && 
          t.latitude !== undefined && t.longitude !== undefined
        );

        if (tournamentsWithCoords.length > 0) {
          tournamentsWithCoords.forEach(tournament => {
            const marker = L.marker([tournament.latitude!, tournament.longitude!])
              .addTo(map.current)
              .bindPopup(`
                <div class="p-2">
                  <h3 class="font-semibold text-sm">${tournament.name}</h3>
                  <p class="text-xs text-gray-600">${tournament.city}, ${tournament.state}</p>
                  <p class="text-xs">${new Date(tournament.date).toLocaleDateString()}</p>
                  <p class="text-xs text-green-600">$${tournament.entry_fee}</p>
                </div>
              `)
              .on('click', () => {
                onTournamentSelect(tournament);
              });

            markers.current.push(marker);
          });

          // Fit map to show all tournaments
          const group = new L.featureGroup(markers.current);
          map.current.fitBounds(group.getBounds().pad(0.1));
        }
      });
    }

    return () => {
      if (map.current) {
        markers.current.forEach(marker => marker.remove());
        markers.current = [];
        map.current.remove();
        map.current = null;
      }
    };
  }, [tournaments, onTournamentSelect]);

  const tournamentsWithCoords = tournaments.filter(t => 
    t.latitude !== null && t.longitude !== null && 
    t.latitude !== undefined && t.longitude !== undefined
  );

  const tournamentsWithoutCoords = tournaments.length - tournamentsWithCoords.length;

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
            className="h-96 bg-deadpunch-dark rounded-lg"
          />
        </CardContent>
      </Card>

      {/* Map Statistics */}
      <div className="text-center text-deadpunch-gray-light">
        <p className="text-sm">
          Showing {tournamentsWithCoords.length} of {tournaments.length} tournaments on map
          {tournamentsWithoutCoords > 0 && (
            <span className="text-yellow-400">
              {' '}({tournamentsWithoutCoords} need coordinates)
            </span>
          )}
        </p>
      </div>

      {/* Tournament Summary Cards for tournaments without coordinates */}
      {tournamentsWithoutCoords > 0 && (
        <div>
          <h4 className="text-lg font-medium text-white mb-3">Tournaments without map locations:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tournaments.filter(t => !t.latitude || !t.longitude).slice(0, 6).map((tournament) => (
              <Card
                key={tournament.id}
                className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark hover:border-deadpunch-red cursor-pointer transition-colors"
                onClick={() => onTournamentSelect(tournament)}
              >
                <CardContent className="p-4">
                  <h5 className="text-white text-sm font-medium line-clamp-2 mb-2">
                    {tournament.name}
                  </h5>
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
      )}
    </div>
  );
};

export default TournamentMapView;
