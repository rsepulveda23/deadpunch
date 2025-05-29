
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  DollarSign, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Image as ImageIcon,
  Edit,
  Trash2,
  ArrowLeft
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

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
  onDelete: () => void;
}

const TournamentDetailView = ({ tournament, isOwner, onDelete }: TournamentDetailViewProps) => {
  const navigate = useNavigate();

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

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/tournaments')}
          className="border-deadpunch-gray-dark text-white hover:bg-deadpunch-dark-lighter"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tournaments
        </Button>
        
        {isOwner && (
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              className="border-deadpunch-gray-dark text-white hover:bg-deadpunch-dark-lighter"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-deadpunch-dark border-deadpunch-gray-dark">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-white">Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription className="text-deadpunch-gray-light">
                    This action cannot be undone. This will permanently delete your tournament listing.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="border-deadpunch-gray-dark text-white hover:bg-deadpunch-dark-lighter">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={onDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete Tournament
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>

      {/* Tournament Header */}
      <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark mb-6">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle className="text-3xl font-bold text-white mb-2">
                {tournament.name}
              </CardTitle>
              <Badge variant="secondary" className="bg-deadpunch-red/20 text-deadpunch-red border-deadpunch-red">
                {tournament.game_type}
              </Badge>
            </div>
            {tournament.flyer_image_url && (
              <div className="mt-4 md:mt-0">
                <img 
                  src={tournament.flyer_image_url} 
                  alt="Tournament Flyer"
                  className="w-full md:w-48 h-auto rounded-lg border border-deadpunch-gray-dark"
                />
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Date & Time */}
        <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-deadpunch-red" />
              Date & Time
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center text-white">
              <Calendar className="mr-3 h-4 w-4 text-deadpunch-gray-light" />
              {formatDate(tournament.date)}
            </div>
            <div className="flex items-center text-white">
              <Clock className="mr-3 h-4 w-4 text-deadpunch-gray-light" />
              {formatTime(tournament.time)}
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-deadpunch-red" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-white font-semibold">{tournament.location_name}</div>
            <div className="text-deadpunch-gray-light">
              {tournament.address}<br />
              {tournament.city}, {tournament.state} {tournament.zip_code}
            </div>
          </CardContent>
        </Card>

        {/* Financial Info */}
        <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <DollarSign className="mr-2 h-5 w-5 text-deadpunch-red" />
              Financial Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-deadpunch-gray-light">Entry Fee:</span>
              <span className="text-green-400 font-semibold">${tournament.entry_fee}</span>
            </div>
            {tournament.prize_pool && (
              <div className="flex items-center justify-between">
                <span className="text-deadpunch-gray-light">Prize Pool:</span>
                <span className="text-white font-semibold">{tournament.prize_pool}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Organizer Info */}
        <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <User className="mr-2 h-5 w-5 text-deadpunch-red" />
              Organizer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center text-white">
              <User className="mr-3 h-4 w-4 text-deadpunch-gray-light" />
              {tournament.organizer_name}
            </div>
            <div className="flex items-center text-white">
              <Mail className="mr-3 h-4 w-4 text-deadpunch-gray-light" />
              <a 
                href={`mailto:${tournament.organizer_email}`}
                className="hover:text-deadpunch-red transition-colors"
              >
                {tournament.organizer_email}
              </a>
            </div>
            <div className="flex items-center text-white">
              <Phone className="mr-3 h-4 w-4 text-deadpunch-gray-light" />
              <a 
                href={`tel:${tournament.organizer_phone}`}
                className="hover:text-deadpunch-red transition-colors"
              >
                {tournament.organizer_phone}
              </a>
            </div>
            {tournament.website_link && (
              <div className="flex items-center text-white">
                <Globe className="mr-3 h-4 w-4 text-deadpunch-gray-light" />
                <a 
                  href={tournament.website_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-deadpunch-red transition-colors"
                >
                  Tournament Website
                </a>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      {tournament.description && (
        <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark mt-6">
          <CardHeader>
            <CardTitle className="text-white">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-deadpunch-gray-light whitespace-pre-wrap">
              {tournament.description}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TournamentDetailView;
