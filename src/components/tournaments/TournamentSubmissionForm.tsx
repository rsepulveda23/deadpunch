import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Trophy } from 'lucide-react';

const tournamentSchema = z.object({
  name: z.string().min(1, 'Tournament name is required'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  location_name: z.string().min(1, 'Location name is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip_code: z.string().min(1, 'ZIP code is required'),
  game_type: z.string().min(1, 'Game type is required'),
  entry_fee: z.number().min(0, 'Entry fee must be 0 or greater'),
  prize_pool: z.string().optional(),
  description: z.string().optional(),
  organizer_name: z.string().min(1, 'Organizer name is required'),
  organizer_email: z.string().email('Valid email is required'),
  organizer_phone: z.string().min(1, 'Phone number is required'),
  website_link: z.string().optional(),
  flyer_image_url: z.string().optional(),
});

type TournamentFormData = z.infer<typeof tournamentSchema>;

interface TournamentSubmissionFormProps {
  onSuccess?: () => void;
}

const TournamentSubmissionForm = ({ onSuccess }: TournamentSubmissionFormProps) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const form = useForm<TournamentFormData>({
    resolver: zodResolver(tournamentSchema),
    defaultValues: {
      name: '',
      date: '',
      time: '',
      location_name: '',
      address: '',
      city: '',
      state: '',
      zip_code: '',
      game_type: '',
      entry_fee: 0,
      prize_pool: '',
      description: '',
      organizer_name: '',
      organizer_email: user?.email || '',
      organizer_phone: '',
      website_link: '',
      flyer_image_url: '',
    },
  });

  useEffect(() => {
    if (user) {
      loadOrganizerProfile();
    }
  }, [user]);

  const loadOrganizerProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('organizer_profiles')
        .select('organizer_name, contact_email, contact_phone, website_url')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (data) {
        // Pre-fill form with profile data, but allow overrides
        form.setValue('organizer_name', data.organizer_name);
        form.setValue('organizer_email', data.contact_email);
        if (data.contact_phone) {
          form.setValue('organizer_phone', data.contact_phone);
        }
        if (data.website_url) {
          form.setValue('website_link', data.website_url);
        }
      }
    } catch (error) {
      console.error('Error loading organizer profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const onSubmit = async (data: TournamentFormData) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a tournament.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Submitting tournament data:', data);
      
      const tournamentData = {
        ...data,
        user_id: user.id,
        entry_fee: Number(data.entry_fee),
      };

      const { error } = await supabase
        .from('tournaments')
        .insert([tournamentData]);

      if (error) {
        console.error('Error submitting tournament:', error);
        throw error;
      }

      toast({
        title: "Success!",
        description: "Your tournament has been submitted successfully.",
      });

      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to submit tournament. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-deadpunch-red" />
      </div>
    );
  }

  return (
    <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Trophy className="h-6 w-6 text-deadpunch-red mr-2" />
          Submit Tournament
        </CardTitle>
        <CardDescription className="text-deadpunch-gray-light">
          Fill out the form below to submit your tournament for listing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Tournament Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Tournament Information</h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Tournament Name *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                        placeholder="Enter tournament name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Date *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="date"
                          className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Time *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="time"
                          className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="game_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Game Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-deadpunch-dark border-deadpunch-gray-dark text-white">
                            <SelectValue placeholder="Select game type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark">
                          <SelectItem value="8-ball">8-Ball</SelectItem>
                          <SelectItem value="9-ball">9-Ball</SelectItem>
                          <SelectItem value="10-ball">10-Ball</SelectItem>
                          <SelectItem value="straight-pool">Straight Pool</SelectItem>
                          <SelectItem value="one-pocket">One Pocket</SelectItem>
                          <SelectItem value="bank-pool">Bank Pool</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="entry_fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Entry Fee ($) *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="0"
                          step="0.01"
                          className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                          placeholder="0.00"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="prize_pool"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Prize Pool</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                        placeholder="e.g., $500 added, 80% payout, etc."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Location Information</h3>
              
              <FormField
                control={form.control}
                name="location_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Venue Name *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                        placeholder="Enter venue name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Address *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                        placeholder="Enter street address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">City *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                          placeholder="Enter city"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">State *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                          placeholder="Enter state"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="zip_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">ZIP Code *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                          placeholder="Enter ZIP"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Organizer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Organizer Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="organizer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Organizer Name *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                          placeholder="Enter organizer name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="organizer_email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Contact Email *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                          placeholder="Enter contact email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="organizer_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Contact Phone *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                          placeholder="Enter phone number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website_link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Website</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                          placeholder="https://example.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Additional Information</h3>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="bg-deadpunch-dark border-deadpunch-gray-dark text-white min-h-24"
                        placeholder="Enter tournament description, rules, or additional information..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="flyer_image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Flyer Image URL</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                        placeholder="https://example.com/flyer.jpg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-deadpunch-red hover:bg-deadpunch-red-hover"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Tournament'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TournamentSubmissionForm;
