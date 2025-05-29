
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  User, 
  Mail, 
  Phone, 
  Globe,
  Trophy,
  Edit
} from 'lucide-react';
import TournamentEditForm from './TournamentEditForm';

interface Tournament {
  id: string;
  user_id: string;
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
  description: string | null;
  prize_pool: string | null;
  organizer_name: string;
  organizer_email: string;
  organizer_phone: string;
  website_link: string | null;
  flyer_image_url: string | null;
}

interface TournamentDetailViewProps {
  tournament: Tournament;
  onUpdate: () => void;
}

const TournamentDetailView: React.FC<TournamentDetailViewProps> = ({ tournament, onUpdate }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const isOwner = user?.id === tournament.user_id;

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

  const handleEditSuccess = () => {
    setIsEditing(false);
    onUpdate();
  };

  if (isEditing) {
    return (
      <TournamentEditForm
        tournament={tournament}
        onSuccess={handleEditSuccess}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Main Tournament Info */}
      <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-white text-2xl mb-3">{tournament.name}</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="bg-deadpunch-red/20 text-deadpunch-red border-deadpunch-red">
                  <Trophy className="h-3 w-3 mr-1" />
                  {tournament.game_type}
                </Badge>
                <Badge variant="outline" className="border-deadpunch-gray-dark text-deadpunch-gray-light">
                  <DollarSign className="h-3 w-3 mr-1" />
                  ${tournament.entry_fee} Entry
                </Badge>
                {tournament.prize_pool && (
                  <Badge variant="outline" className="border-green-600 text-green-400">
                    <Trophy className="h-3 w-3 mr-1" />
                    {tournament.prize_pool}
                  </Badge>
                )}
              </div>
            </div>
            
            {isOwner && (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-deadpunch-red hover:bg-deadpunch-red-hover"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Tournament
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center text-deadpunch-gray-light">
              <Calendar className="h-5 w-5 mr-3 text-deadpunch-red" />
              <div>
                <div className="text-white font-medium">{formatDate(tournament.date)}</div>
                <div className="text-sm">{formatTime(tournament.time)}</div>
              </div>
            </div>
            
            <div className="flex items-center text-deadpunch-gray-light">
              <Clock className="h-5 w-5 mr-3 text-deadpunch-red" />
              <div>
                <div className="text-white font-medium">Start Time</div>
                <div className="text-sm">{formatTime(tournament.time)}</div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start text-deadpunch-gray-light">
            <MapPin className="h-5 w-5 mr-3 text-deadpunch-red flex-shrink-0 mt-1" />
            <div>
              <div className="text-white font-medium">{tournament.location_name}</div>
              <div className="text-sm">
                {tournament.address}<br />
                {tournament.city}, {tournament.state} {tournament.zip_code}
              </div>
            </div>
          </div>

          {/* Description */}
          {tournament.description && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
              <p className="text-deadpunch-gray-light leading-relaxed">
                {tournament.description}
              </p>
            </div>
          )}

          {/* Flyer Image */}
          {tournament.flyer_image_url && (
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Tournament Flyer</h3>
              <div className="max-w-md">
                <img 
                  src={tournament.flyer_image_url} 
                  alt="Tournament Flyer"
                  className="w-full rounded-lg border border-deadpunch-gray-dark"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Organizer Info */}
      <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark">
        <CardHeader>
          <CardTitle className="text-white">Organizer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center text-deadpunch-gray-light">
            <User className="h-5 w-5 mr-3 text-deadpunch-red" />
            <div>
              <Link 
                to={`/organizer/${tournament.user_id}`}
                className="text-white font-medium hover:text-deadpunch-red transition-colors"
              >
                {tournament.organizer_name}
              </Link>
            </div>
          </div>
          
          <div className="flex items-center text-deadpunch-gray-light">
            <Mail className="h-5 w-5 mr-3 text-deadpunch-red" />
            <a href={`mailto:${tournament.organizer_email}`} className="hover:text-white">
              {tournament.organizer_email}
            </a>
          </div>
          
          <div className="flex items-center text-deadpunch-gray-light">
            <Phone className="h-5 w-5 mr-3 text-deadpunch-red" />
            <a href={`tel:${tournament.organizer_phone}`} className="hover:text-white">
              {tournament.organizer_phone}
            </a>
          </div>
          
          {tournament.website_link && (
            <div className="flex items-center text-deadpunch-gray-light">
              <Globe className="h-5 w-5 mr-3 text-deadpunch-red" />
              <a 
                href={tournament.website_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Visit Website
              </a>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TournamentDetailView;
