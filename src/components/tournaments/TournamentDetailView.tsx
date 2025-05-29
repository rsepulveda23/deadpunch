
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import TournamentEditForm from './TournamentEditForm';
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Trophy,
  User,
  Mail,
  Phone,
  Globe,
  Edit,
  Trash2,
  Image,
  FileText,
  ArrowLeft,
  ExternalLink
} from 'lucide-react';

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

interface TournamentDetailViewProps {
  tournament: Tournament;
  isOwner?: boolean;
  onDelete?: () => void;
  onUpdate?: () => void;
}

const TournamentDetailView = ({ tournament, isOwner, onDelete, onUpdate }: TournamentDetailViewProps) => {
  const [isEditing, setIsEditing] = useState(false);

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
    onUpdate?.();
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Edit Tournament</h1>
          <Button
            variant="outline"
            onClick={() => setIsEditing(false)}
            className="border-deadpunch-gray-dark text-white hover:bg-deadpunch-dark-lighter"
          >
            Cancel
          </Button>
        </div>
        <TournamentEditForm 
          tournament={tournament} 
          onSuccess={handleEditSuccess}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Badge variant="secondary" className="bg-deadpunch-red/20 text-deadpunch-red border-deadpunch-red mb-2">
            {tournament.game_type}
          </Badge>
          <h1 className="text-3xl font-bold text-white">{tournament.name}</h1>
        </div>

        {isOwner && (
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="border-deadpunch-gray-dark text-white hover:bg-deadpunch-dark-lighter"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button 
              variant="destructive"
              onClick={onDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Tournament Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Flyer Image */}
          {tournament.flyer_image_url && (
            <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Image className="h-5 w-5 text-deadpunch-red mr-2" />
                  <h3 className="text-lg font-semibold text-white">Tournament Flyer</h3>
                </div>
                <img 
                  src={tournament.flyer_image_url} 
                  alt="Tournament Flyer"
                  className="w-full rounded-lg border border-deadpunch-gray-dark"
                />
              </CardContent>
            </Card>
          )}

          {/* Event Details */}
          <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Calendar className="h-6 w-6 text-deadpunch-red mr-2" />
                Event Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center text-deadpunch-gray-light">
                  <Calendar className="h-4 w-4 mr-2 text-deadpunch-red" />
                  <span>{formatDate(tournament.date)}</span>
                </div>
                <div className="flex items-center text-deadpunch-gray-light">
                  <Clock className="h-4 w-4 mr-2 text-deadpunch-red" />
                  <span>{formatTime(tournament.time)}</span>
                </div>
                <div className="flex items-center text-green-400">
                  <DollarSign className="h-4 w-4 mr-2" />
                  <span>Entry Fee: ${tournament.entry_fee}</span>
                </div>
                {tournament.prize_pool && (
                  <div className="flex items-center text-yellow-400">
                    <Trophy className="h-4 w-4 mr-2" />
                    <span>Prize: {tournament.prize_pool}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <MapPin className="h-6 w-6 text-deadpunch-red mr-2" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="text-lg font-semibold text-white">{tournament.location_name}</h4>
                <p className="text-deadpunch-gray-light">
                  {tournament.address}<br />
                  {tournament.city}, {tournament.state} {tournament.zip_code}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Description */}
          {tournament.description && (
            <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <FileText className="h-6 w-6 text-deadpunch-red mr-2" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-deadpunch-gray-light whitespace-pre-wrap">
                  {tournament.description}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar - Organizer Info */}
        <div className="space-y-6">
          <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="h-6 w-6 text-deadpunch-red mr-2" />
                Organizer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Link 
                  to={`/organizer/${tournament.user_id}`}
                  className="text-lg font-semibold text-white hover:text-deadpunch-red transition-colors flex items-center"
                >
                  {tournament.organizer_name}
                  <ExternalLink className="h-4 w-4 ml-1" />
                </Link>
              </div>

              <Separator className="bg-deadpunch-gray-dark" />

              <div className="space-y-3">
                <div className="flex items-center text-deadpunch-gray-light">
                  <Mail className="h-4 w-4 mr-2 text-deadpunch-red" />
                  <a 
                    href={`mailto:${tournament.organizer_email}`}
                    className="hover:text-white transition-colors"
                  >
                    {tournament.organizer_email}
                  </a>
                </div>

                {tournament.organizer_phone && (
                  <div className="flex items-center text-deadpunch-gray-light">
                    <Phone className="h-4 w-4 mr-2 text-deadpunch-red" />
                    <a 
                      href={`tel:${tournament.organizer_phone}`}
                      className="hover:text-white transition-colors"
                    >
                      {tournament.organizer_phone}
                    </a>
                  </div>
                )}

                {tournament.website_link && (
                  <div className="flex items-center text-deadpunch-gray-light">
                    <Globe className="h-4 w-4 mr-2 text-deadpunch-red" />
                    <a 
                      href={tournament.website_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full border-deadpunch-gray-dark text-white hover:bg-deadpunch-dark-lighter"
                onClick={() => {
                  const subject = encodeURIComponent(`Inquiry about ${tournament.name}`);
                  const body = encodeURIComponent(`Hi ${tournament.organizer_name},\n\nI'm interested in participating in ${tournament.name} on ${formatDate(tournament.date)}.\n\nCould you please provide more information?\n\nThanks!`);
                  window.location.href = `mailto:${tournament.organizer_email}?subject=${subject}&body=${body}`;
                }}
              >
                <Mail className="mr-2 h-4 w-4" />
                Contact Organizer
              </Button>

              {tournament.organizer_phone && (
                <Button 
                  variant="outline" 
                  className="w-full border-deadpunch-gray-dark text-white hover:bg-deadpunch-dark-lighter"
                  onClick={() => window.location.href = `tel:${tournament.organizer_phone}`}
                >
                  <Phone className="mr-2 h-4 w-4" />
                  Call Organizer
                </Button>
              )}

              <Button 
                variant="outline" 
                className="w-full border-deadpunch-gray-dark text-white hover:bg-deadpunch-dark-lighter"
                onClick={() => {
                  const address = `${tournament.address}, ${tournament.city}, ${tournament.state} ${tournament.zip_code}`;
                  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
                  window.open(mapsUrl, '_blank');
                }}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Get Directions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TournamentDetailView;
