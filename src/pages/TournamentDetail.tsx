import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import TimeIndicator from '@/components/TimeIndicator';
import TournamentDetailView from '@/components/tournaments/TournamentDetailView';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface Tournament {
  id: string;
  name: string;
  date: string;
  time: string;
  location_name: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  game_type: string;
  entry_fee: number;
  prize_pool: string;
  description: string;
  organizer_name: string;
  organizer_email: string;
  organizer_phone: string;
  website_link: string;
  flyer_image_url: string;
  user_id: string;
  created_at: string;
}

const TournamentDetail = () => {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tournamentId) {
      fetchTournament();
    }
  }, [tournamentId]);

  const fetchTournament = async () => {
    try {
      console.log('Fetching tournament with ID:', tournamentId);
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .eq('id', tournamentId)
        .single();

      if (error) {
        console.error('Error fetching tournament:', error);
        toast({
          title: "Error",
          description: "Failed to load tournament details",
          variant: "destructive",
        });
        navigate('/tournaments');
        return;
      }

      console.log('Tournament fetched:', data);
      setTournament(data);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load tournament details",
        variant: "destructive",
      });
      navigate('/tournaments');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!tournament || !user || tournament.user_id !== user.id) {
      return;
    }

    try {
      console.log('Deleting tournament:', tournament.id);
      const { error } = await supabase
        .from('tournaments')
        .delete()
        .eq('id', tournament.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Tournament deleted successfully",
      });
      navigate('/tournaments');
    } catch (error) {
      console.error('Error deleting tournament:', error);
      toast({
        title: "Error",
        description: "Failed to delete tournament",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deadpunch-dark text-white">
        <Navbar />
        <TimeIndicator />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-deadpunch-red" />
          </div>
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-deadpunch-dark text-white">
        <Navbar />
        <TimeIndicator />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Tournament Not Found</h1>
            <p className="text-deadpunch-gray-light mb-8">
              The tournament you're looking for doesn't exist or has been removed.
            </p>
            <button 
              onClick={() => navigate('/tournaments')}
              className="bg-deadpunch-red hover:bg-deadpunch-red-hover px-6 py-2 rounded-full text-white"
            >
              Back to Tournaments
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user && tournament.user_id === user.id;

  return (
    <div className="min-h-screen bg-deadpunch-dark text-white">
      <Navbar />
      <TimeIndicator />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <TournamentDetailView 
          tournament={tournament} 
          onUpdate={fetchTournament}
        />
      </div>
    </div>
  );
};

export default TournamentDetail;
