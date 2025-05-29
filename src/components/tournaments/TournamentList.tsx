import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, DollarSign, Trophy, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Tournament {
  id: string;
  name: string;
  date: string;
  time: string;
  location_name: string;
  city: string;
  state: string;
  game_type: string;
  entry_fee: number;
  prize_pool: string;
  created_at: string;
}

const TournamentList = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      console.log('Fetching tournaments...');
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
          game_type,
          entry_fee,
          prize_pool,
          created_at
        `)
        .order('date', { ascending: true });

      if (error) {
        console.error('Error fetching tournaments:', error);
        toast({
          title: "Error",
          description: "Failed to load tournaments",
          variant: "destructive",
        });
        return;
      }

      console.log('Tournaments fetched:', data);
      setTournaments(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load tournaments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-deadpunch-red" />
      </div>
    );
  }

  if (tournaments.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="h-16 w-16 text-deadpunch-gray-light mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">No Tournaments Yet</h3>
        <p className="text-deadpunch-gray-light">
          Be the first to submit a tournament and help build the community!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        Upcoming Tournaments
      </h2>
      
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
    </div>
  );
};

export default TournamentList;
