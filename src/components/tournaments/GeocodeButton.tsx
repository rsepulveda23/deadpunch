
import React from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2 } from 'lucide-react';
import { useGeocodeTournaments } from '@/hooks/useGeocodeTournaments';

interface GeocodeButtonProps {
  onComplete?: () => void;
}

const GeocodeButton = ({ onComplete }: GeocodeButtonProps) => {
  const { geocodeAllTournaments, isGeocoding } = useGeocodeTournaments();

  const handleGeocode = async () => {
    await geocodeAllTournaments();
    onComplete?.();
  };

  return (
    <Button
      onClick={handleGeocode}
      disabled={isGeocoding}
      variant="outline"
      size="sm"
      className="border-deadpunch-gray-dark text-white hover:bg-deadpunch-dark-lighter"
    >
      {isGeocoding ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <MapPin className="h-4 w-4 mr-2" />
      )}
      {isGeocoding ? 'Adding Coordinates...' : 'Add Map Coordinates'}
    </Button>
  );
};

export default GeocodeButton;
