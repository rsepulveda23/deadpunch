
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { geocodeTournamentLocation } from '@/services/geocodingService';

export const useGeocodeTournaments = () => {
  const [isGeocoding, setIsGeocoding] = useState(false);

  const geocodeAllTournaments = async () => {
    setIsGeocoding(true);
    try {
      // Get tournaments without coordinates
      const { data: tournaments, error } = await supabase
        .from('tournaments')
        .select('id, address, city, state, zip_code, latitude, longitude')
        .or('latitude.is.null,longitude.is.null');

      if (error) {
        throw error;
      }

      if (!tournaments || tournaments.length === 0) {
        toast({
          title: "All Set!",
          description: "All tournaments already have location coordinates.",
        });
        return;
      }

      let successCount = 0;
      let failCount = 0;

      // Process tournaments in batches to avoid rate limiting
      for (let i = 0; i < tournaments.length; i++) {
        const tournament = tournaments[i];
        
        try {
          const coords = await geocodeTournamentLocation(tournament);
          
          if (coords) {
            const { error: updateError } = await supabase
              .from('tournaments')
              .update({
                latitude: coords.latitude,
                longitude: coords.longitude
              })
              .eq('id', tournament.id);

            if (updateError) {
              console.error('Error updating tournament coordinates:', updateError);
              failCount++;
            } else {
              successCount++;
            }
          } else {
            failCount++;
          }

          // Add a small delay to be respectful to the geocoding service
          if (i < tournaments.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.error('Error geocoding tournament:', error);
          failCount++;
        }
      }

      toast({
        title: "Geocoding Complete",
        description: `Successfully geocoded ${successCount} tournaments. ${failCount} failed.`,
        variant: successCount > 0 ? "default" : "destructive",
      });

    } catch (error) {
      console.error('Error geocoding tournaments:', error);
      toast({
        title: "Error",
        description: "Failed to geocode tournaments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeocoding(false);
    }
  };

  return {
    geocodeAllTournaments,
    isGeocoding
  };
};
