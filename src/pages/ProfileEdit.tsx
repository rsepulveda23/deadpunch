
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import TimeIndicator from '@/components/TimeIndicator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { User, ArrowLeft, Loader2 } from 'lucide-react';

const profileSchema = z.object({
  organizer_name: z.string().min(1, 'Organizer name is required'),
  contact_email: z.string().email('Valid email is required'),
  contact_phone: z.string().optional(),
  website_url: z.string().url('Valid URL required').optional().or(z.literal('')),
  profile_image_url: z.string().url('Valid URL required').optional().or(z.literal('')),
  about_bio: z.string().optional(),
  region: z.string().optional(),
  social_media_links: z.object({
    facebook: z.string().optional(),
    twitter: z.string().optional(),
    instagram: z.string().optional(),
  }).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfileEdit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      organizer_name: '',
      contact_email: user?.email || '',
      contact_phone: '',
      website_url: '',
      profile_image_url: '',
      about_bio: '',
      region: '',
      social_media_links: {
        facebook: '',
        twitter: '',
        instagram: '',
      },
    },
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchProfile();
  }, [user, navigate]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('organizer_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setHasProfile(true);
        
        // Handle the social_media_links conversion from Json to our expected type
        const socialLinks = typeof data.social_media_links === 'object' && data.social_media_links !== null
          ? data.social_media_links as Record<string, string>
          : { facebook: '', twitter: '', instagram: '' };

        form.reset({
          organizer_name: data.organizer_name,
          contact_email: data.contact_email,
          contact_phone: data.contact_phone || '',
          website_url: data.website_url || '',
          profile_image_url: data.profile_image_url || '',
          about_bio: data.about_bio || '',
          region: data.region || '',
          social_media_links: {
            facebook: socialLinks.facebook || '',
            twitter: socialLinks.twitter || '',
            instagram: socialLinks.instagram || '',
          },
        });
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    setSubmitting(true);
    try {
      const profileData = {
        user_id: user.id,
        organizer_name: data.organizer_name,
        contact_email: data.contact_email,
        contact_phone: data.contact_phone || null,
        website_url: data.website_url || null,
        profile_image_url: data.profile_image_url || null,
        about_bio: data.about_bio || null,
        region: data.region || null,
        social_media_links: data.social_media_links || {},
      };

      if (hasProfile) {
        const { error } = await supabase
          .from('organizer_profiles')
          .update(profileData)
          .eq('user_id', user.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('organizer_profiles')
          .insert([profileData]);

        if (error) throw error;

        setHasProfile(true);
        toast({
          title: "Success",
          description: "Profile created successfully",
        });
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

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

  return (
    <div className="min-h-screen bg-deadpunch-dark text-white">
      <Navbar />
      <TimeIndicator />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-deadpunch-gray-light hover:text-white mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center">
              <User className="h-8 w-8 text-deadpunch-red mr-3" />
              <h1 className="text-3xl font-bold">
                {hasProfile ? 'Edit' : 'Create'} Organizer Profile
              </h1>
            </div>
          </div>

          <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark">
            <CardHeader>
              <CardTitle className="text-white">Profile Information</CardTitle>
              <CardDescription className="text-deadpunch-gray-light">
                {hasProfile 
                  ? 'Update your organizer profile information'
                  : 'Create your organizer profile to build trust with tournament participants'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="organizer_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Organizer/Business Name *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                              placeholder="Your name or business name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contact_email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Contact Email *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                              placeholder="contact@example.com"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="contact_phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Contact Phone</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                              placeholder="(555) 123-4567"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="region"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Region/Primary Location</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                              placeholder="e.g., East Coast, New England"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="website_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Website URL</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                              placeholder="https://yourwebsite.com"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="profile_image_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Profile Image URL</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                              placeholder="https://example.com/image.jpg"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="about_bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">About/Bio</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            className="bg-deadpunch-dark border-deadpunch-gray-dark text-white min-h-24"
                            placeholder="Tell players about yourself or your organization..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Social Media Links</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="social_media_links.facebook"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Facebook</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                                placeholder="Facebook URL"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="social_media_links.twitter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Twitter/X</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                                placeholder="Twitter/X URL"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="social_media_links.instagram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Instagram</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                                placeholder="Instagram URL"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-deadpunch-red hover:bg-deadpunch-red-hover flex-1"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {hasProfile ? 'Updating...' : 'Creating...'}
                        </>
                      ) : (
                        hasProfile ? 'Update Profile' : 'Create Profile'
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(-1)}
                      className="border-deadpunch-gray-dark text-white hover:bg-deadpunch-dark-lighter"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
