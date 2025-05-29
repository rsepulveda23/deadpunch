
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import TimeIndicator from '@/components/TimeIndicator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  MapPin, 
  Calendar,
  Trophy,
  Loader2,
  ExternalLink,
  Facebook,
  Twitter,
  Instagram
} from 'lucide-react';

interface OrganizerProfile {
  user_id: string;
  organizer_name: string;
  profile_image_url: string | null;
  about_bio: string | null;
  contact_email: string;
  contact_phone: string | null;
  website_url: string | null;
  social_media_links: Record<string, string> | null;
  region: string | null;
  created_at: string;
}

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
  prize_pool: string | null;
}

const OrganizerProfile = () => {
  const { organizerId } = useParams<{ organizerId: string }>();
  const [profile, setProfile] = useState<OrganizerProfile | null>(null);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (organizerId) {
      fetchOrganizerData();
    }
  }, [organizerId]);

  const fetchOrganizerData = async () => {
    try {
      // Fetch organizer profile
      const { data: profileData, error: profileError } = await supabase
        .from('organizer_profiles')
        .select('*')
        .eq('user_id', organizerId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        toast({
          title: "Error",
          description: "Organizer profile not found",
          variant: "destructive",
        });
        return;
      }

      setProfile(profileData);

      // Fetch organizer's tournaments
      const { data: tournamentsData, error: tournamentsError } = await supabase
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
          prize_pool
        `)
        .eq('user_id', organizerId)
        .order('date', { ascending: true });

      if (tournamentsError) {
        console.error('Error fetching tournaments:', tournamentsError);
      } else {
        setTournaments(tournamentsData || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load organizer data",
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

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().substring(0, 2);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      default:
        return <ExternalLink className="h-4 w-4" />;
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-deadpunch-dark text-white">
        <Navbar />
        <TimeIndicator />
        <div className="container mx-auto px-4 pt-24 pb-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Organizer Not Found</h1>
            <p className="text-deadpunch-gray-light mb-8">
              The organizer profile you're looking for doesn't exist.
            </p>
            <Link to="/tournaments">
              <Button className="bg-deadpunch-red hover:bg-deadpunch-red-hover">
                Back to Tournaments
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deadpunch-dark text-white">
      <Navbar />
      <TimeIndicator />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Header */}
          <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark">
            <CardHeader>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.profile_image_url || undefined} />
                  <AvatarFallback className="bg-deadpunch-red text-white text-xl">
                    {getInitials(profile.organizer_name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <CardTitle className="text-white text-2xl mb-2">
                    {profile.organizer_name}
                  </CardTitle>
                  
                  <div className="space-y-2 text-deadpunch-gray-light">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      <a href={`mailto:${profile.contact_email}`} className="hover:text-white">
                        {profile.contact_email}
                      </a>
                    </div>
                    
                    {profile.contact_phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        <a href={`tel:${profile.contact_phone}`} className="hover:text-white">
                          {profile.contact_phone}
                        </a>
                      </div>
                    )}
                    
                    {profile.region && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {profile.region}
                      </div>
                    )}
                    
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      Organizing since {new Date(profile.created_at).getFullYear()}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  {profile.website_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-deadpunch-gray-dark text-white hover:bg-deadpunch-dark-lighter"
                      onClick={() => window.open(profile.website_url!, '_blank')}
                    >
                      <Globe className="h-4 w-4 mr-2" />
                      Website
                    </Button>
                  )}
                  
                  {profile.social_media_links && Object.entries(profile.social_media_links).filter(([_, url]) => url).length > 0 && (
                    <div className="flex gap-2">
                      {Object.entries(profile.social_media_links)
                        .filter(([_, url]) => url)
                        .map(([platform, url]) => (
                          <Button
                            key={platform}
                            variant="outline"
                            size="sm"
                            className="border-deadpunch-gray-dark text-white hover:bg-deadpunch-dark-lighter p-2"
                            onClick={() => window.open(url, '_blank')}
                          >
                            {getSocialIcon(platform)}
                          </Button>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            
            {profile.about_bio && (
              <CardContent>
                <h3 className="text-lg font-semibold text-white mb-3">About</h3>
                <p className="text-deadpunch-gray-light leading-relaxed">
                  {profile.about_bio}
                </p>
              </CardContent>
            )}
          </Card>

          {/* Tournaments Section */}
          <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Trophy className="h-6 w-6 text-deadpunch-red mr-2" />
                Tournaments ({tournaments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tournaments.length === 0 ? (
                <p className="text-deadpunch-gray-light text-center py-8">
                  No tournaments found for this organizer.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tournaments.map((tournament) => (
                    <Link key={tournament.id} to={`/tournaments/${tournament.id}`}>
                      <Card className="bg-deadpunch-dark border-deadpunch-gray-dark hover:border-deadpunch-red transition-all duration-300 hover:scale-105 cursor-pointer">
                        <CardContent className="p-4">
                          <h4 className="text-white font-semibold mb-2 line-clamp-2">
                            {tournament.name}
                          </h4>
                          
                          <div className="space-y-2 text-sm text-deadpunch-gray-light">
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="bg-deadpunch-red/20 text-deadpunch-red border-deadpunch-red">
                                {tournament.game_type}
                              </Badge>
                              <span>${tournament.entry_fee}</span>
                            </div>
                            
                            <div>
                              {formatDate(tournament.date)} at {formatTime(tournament.time)}
                            </div>
                            
                            <div>
                              {tournament.location_name}, {tournament.city}, {tournament.state}
                            </div>
                            
                            {tournament.prize_pool && (
                              <div className="text-green-400">
                                Prize: {tournament.prize_pool}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrganizerProfile;
