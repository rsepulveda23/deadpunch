
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, DollarSign, Trophy, User } from 'lucide-react';
import { Tournament } from '@/types/tournamentSearch';

interface TournamentCardProps {
  tournament: Tournament;
}

const TournamentCard = ({ tournament }: TournamentCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
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

  return (
    <Link to={`/tournaments/${tournament.id}`}>
      <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark hover:border-deadpunch-red transition-all duration-300 hover:scale-105 cursor-pointer h-full">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-start">
              <h3 className="text-white font-semibold text-lg line-clamp-2 flex-1 mr-2">
                {tournament.name}
              </h3>
              <Badge 
                variant="secondary" 
                className="bg-deadpunch-red/20 text-deadpunch-red border-deadpunch-red shrink-0"
              >
                {tournament.game_type}
              </Badge>
            </div>

            {/* Date and Time */}
            <div className="flex items-center text-deadpunch-gray-light">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm">
                {formatDate(tournament.date)} at {formatTime(tournament.time)}
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center text-deadpunch-gray-light">
              <MapPin className="h-4 w-4 mr-2" />
              <span className="text-sm line-clamp-1">
                {tournament.location_name}, {tournament.city}, {tournament.state}
              </span>
              {tournament.distance && (
                <span className="ml-auto text-xs bg-deadpunch-dark px-2 py-1 rounded">
                  {tournament.distance.toFixed(1)} mi
                </span>
              )}
            </div>

            {/* Entry Fee and Prize */}
            <div className="flex items-center justify-between">
              <div className="flex items-center text-deadpunch-gray-light">
                <DollarSign className="h-4 w-4 mr-1" />
                <span className="text-sm">${tournament.entry_fee} entry</span>
              </div>
              
              {tournament.prize_pool && (
                <div className="flex items-center text-green-400">
                  <Trophy className="h-4 w-4 mr-1" />
                  <span className="text-sm">{tournament.prize_pool}</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default TournamentCard;
