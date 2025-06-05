
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Mail, Phone, MapPin, Globe } from 'lucide-react';

const ProfileSetup = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    organizer_name: '',
    about_bio: '',
    contact_phone: '',
    website_url: '',
    region: '',
  });

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('organizer_profiles')
        .insert({
          user_id: user.id,
          contact_email: user.email || '',
          ...formData,
        });

      if (error) throw error;

      toast({
        title: "Profile Created!",
        description: "Welcome to DEADPUNCH! Your organizer profile has been set up successfully.",
      });

      navigate('/profile');
    } catch (error: any) {
      console.error('Error creating profile:', error);
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-deadpunch-dark text-white">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-deadpunch-dark p-4">
      <div className="container mx-auto max-w-2xl pt-12">
        <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-6">
              <img 
                src="/lovable-uploads/37cea651-5218-4a94-9866-a47b51d4bf2b.png" 
                alt="Deadpunch" 
                className="h-16 object-contain" 
              />
            </div>
            <CardTitle className="text-2xl text-white mb-2">
              Welcome to DEADPUNCH! 🎉
            </CardTitle>
            <p className="text-deadpunch-gray-light">
              Let's set up your organizer profile to get started
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="organizer_name" className="text-white flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Organizer Name *
                </Label>
                <Input
                  id="organizer_name"
                  name="organizer_name"
                  value={formData.organizer_name}
                  onChange={handleInputChange}
                  placeholder="Your name or organization name"
                  required
                  className="bg-deadpunch-dark border-deadpunch-gray text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_email" className="text-white flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Email
                </Label>
                <Input
                  id="contact_email"
                  value={user.email || ''}
                  disabled
                  className="bg-deadpunch-dark border-deadpunch-gray text-deadpunch-gray-light"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_phone" className="text-white flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Phone Number
                </Label>
                <Input
                  id="contact_phone"
                  name="contact_phone"
                  type="tel"
                  value={formData.contact_phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  className="bg-deadpunch-dark border-deadpunch-gray text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="region" className="text-white flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Region/Location
                </Label>
                <Input
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  placeholder="City, State or Region"
                  className="bg-deadpunch-dark border-deadpunch-gray text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website_url" className="text-white flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  Website URL
                </Label>
                <Input
                  id="website_url"
                  name="website_url"
                  type="url"
                  value={formData.website_url}
                  onChange={handleInputChange}
                  placeholder="https://yourwebsite.com"
                  className="bg-deadpunch-dark border-deadpunch-gray text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="about_bio" className="text-white">
                  About You (Optional)
                </Label>
                <Textarea
                  id="about_bio"
                  name="about_bio"
                  value={formData.about_bio}
                  onChange={handleInputChange}
                  placeholder="Tell the community about yourself and your experience organizing tournaments..."
                  rows={4}
                  className="bg-deadpunch-dark border-deadpunch-gray text-white"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-deadpunch-red hover:bg-deadpunch-red-hover"
                disabled={isSubmitting || !formData.organizer_name}
              >
                {isSubmitting ? "Creating Profile..." : "Complete Setup"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;
