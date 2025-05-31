
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, MapPin, Database } from 'lucide-react';
import { useGeocodeTournaments } from '@/hooks/useGeocodeTournaments';

interface DiagnosticStats {
  total: number;
  withCoordinates: number;
  withoutCoordinates: number;
  withValidZip: number;
  withInvalidZip: number;
}

const TournamentSearchDiagnostics = () => {
  const [stats, setStats] = useState<DiagnosticStats | null>(null);
  const [loading, setLoading] = useState(false);
  const { geocodeAllTournaments, isGeocoding } = useGeocodeTournaments();

  const loadDiagnostics = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('id, zip_code, latitude, longitude');

      if (error) {
        console.error('Error loading tournament diagnostics:', error);
        return;
      }

      const total = data?.length || 0;
      const withCoordinates = data?.filter(t => t.latitude !== null && t.longitude !== null).length || 0;
      const withoutCoordinates = total - withCoordinates;
      
      const zipCodeRegex = /^\d{5}(-\d{4})?$/;
      const withValidZip = data?.filter(t => zipCodeRegex.test(t.zip_code || '')).length || 0;
      const withInvalidZip = total - withValidZip;

      setStats({
        total,
        withCoordinates,
        withoutCoordinates,
        withValidZip,
        withInvalidZip
      });

      console.log('Tournament diagnostics:', {
        total,
        withCoordinates,
        withoutCoordinates,
        withValidZip,
        withInvalidZip
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiagnostics();
  }, []);

  const getCoordinateStatus = () => {
    if (!stats) return 'unknown';
    const percentage = (stats.withCoordinates / stats.total) * 100;
    if (percentage > 80) return 'good';
    if (percentage > 50) return 'warning';
    return 'poor';
  };

  const coordinateStatus = getCoordinateStatus();

  return (
    <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark mb-4">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Database className="h-5 w-5" />
          Search Diagnostics
        </CardTitle>
        <CardDescription className="text-deadpunch-gray-light">
          Tournament data quality for radius search functionality
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-deadpunch-gray-light">Loading diagnostics...</div>
        ) : stats ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{stats.total}</div>
                <div className="text-sm text-deadpunch-gray-light">Total Tournaments</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{stats.withCoordinates}</div>
                <div className="text-sm text-deadpunch-gray-light">With Coordinates</div>
                <Badge 
                  variant={coordinateStatus === 'good' ? 'default' : coordinateStatus === 'warning' ? 'secondary' : 'destructive'}
                  className="mt-1"
                >
                  {Math.round((stats.withCoordinates / stats.total) * 100)}%
                </Badge>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{stats.withoutCoordinates}</div>
                <div className="text-sm text-deadpunch-gray-light">Missing Coordinates</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{stats.withValidZip}</div>
                <div className="text-sm text-deadpunch-gray-light">Valid ZIP Codes</div>
              </div>
            </div>

            {coordinateStatus !== 'good' && (
              <div className="flex items-start gap-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div className="flex-1">
                  <div className="text-yellow-400 font-medium">Coordinate Data Warning</div>
                  <div className="text-sm text-deadpunch-gray-light mt-1">
                    {stats.withoutCoordinates} tournaments are missing coordinates, which affects radius search accuracy.
                    Run the geocoding process to improve search results.
                  </div>
                  <Button
                    onClick={geocodeAllTournaments}
                    disabled={isGeocoding}
                    size="sm"
                    className="mt-2 bg-yellow-600 hover:bg-yellow-700"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    {isGeocoding ? 'Geocoding...' : 'Geocode Missing Coordinates'}
                  </Button>
                </div>
              </div>
            )}

            <Button 
              onClick={loadDiagnostics}
              variant="outline"
              size="sm"
              className="border-deadpunch-gray-dark text-white hover:bg-deadpunch-dark-lighter"
            >
              Refresh Diagnostics
            </Button>
          </div>
        ) : (
          <div className="text-red-400">Failed to load diagnostics</div>
        )}
      </CardContent>
    </Card>
  );
};

export default TournamentSearchDiagnostics;
