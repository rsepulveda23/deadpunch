
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
      map.current = null;
    }

    // Create map using Leaflet (free alternative to Mapbox)
    const initializeMap = async () => {
      try {
        const L = await import('leaflet');
        
        // Fix for default markers
        delete (L as any).Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // Initialize map
        map.current = L.map(mapContainer.current!, {
          center: [39.8283, -98.5795], // Center of USA
          zoom: 4,
          zoomControl: true,
          attributionControl: false
        });

        // Add OpenStreetMap tiles (free)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map.current);

        // Add tournament markers
        const tournamentsWithCoords = tournaments.filter(t => 
          t.latitude !== null && t.longitude !== null && 
          t.latitude !== undefined && t.longitude !== undefined &&
          !isNaN(t.latitude) && !isNaN(t.longitude)
        );

        console.log('Adding tournaments to map:', tournamentsWithCoords.length);

        if (tournamentsWithCoords.length > 0) {
          const bounds = L.latLngBounds();

          tournamentsWithCoords.forEach(tournament => {
            const marker = L.marker([tournament.latitude!, tournament.longitude!])
              .addTo(map.current)
              .bindPopup(`
                <div style="padding: 8px; min-width: 150px;">
                  <h3 style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px;">${tournament.name}</h3>
                  <p style="margin: 2px 0; font-size: 12px; color: #666;">${tournament.city}, ${tournament.state}</p>
                  <p style="margin: 2px 0; font-size: 12px;">${new Date(tournament.date).toLocaleDateString()}</p>
                  <p style="margin: 2px 0; font-size: 12px; color: #22c55e;">$${tournament.entry_fee} entry</p>
                </div>
              `)
              .on('click', () => {
                onTournamentSelect(tournament);
              });

            markers.current.push(marker);
            bounds.extend([tournament.latitude!, tournament.longitude!]);
          });

          // Fit map to show all tournaments
          if (bounds.isValid()) {
            map.current.fitBounds(bounds, { padding: [20, 20] });
          }
        }
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();

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
    t.latitude !== undefined && t.longitude !== undefined &&
    !isNaN(t.latitude) && !isNaN(t.longitude)
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
            className="w-full h-96 bg-deadpunch-dark rounded-lg overflow-hidden"
            style={{ minHeight: '400px' }}
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
            {tournaments.filter(t => !t.latitude || !t.longitude || isNaN(t.latitude) || isNaN(t.longitude)).slice(0, 6).map((tournament) => (
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
