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
import { Trophy, Loader2 } from 'lucide-react';

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
  description: z.string().optional(),
  prize_pool: z.string().optional(),
  organizer_name: z.string().min(1, 'Organizer name is required'),
  organizer_email: z.string().email('Valid email is required'),
  organizer_phone: z.string().min(1, 'Phone number is required'),
  website_link: z.string().url('Valid URL required').optional().or(z.literal('')),
  flyer_image_url: z.string().url('Valid URL required').optional().or(z.literal('')),
});

type TournamentFormData = z.infer<typeof tournamentSchema>;

interface TournamentSubmissionFormProps {
  onSuccess: () => void;
}

const TournamentSubmissionForm: React.FC<TournamentSubmissionFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

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
      description: '',
      prize_pool: '',
      organizer_name: '',
      organizer_email: user?.email || '',
      organizer_phone: '',
      website_link: '',
      flyer_image_url: '',
    },
  });

  // Load organizer profile data to pre-fill form
  useEffect(() => {
    const loadOrganizerProfile = async () => {
      if (!user?.id) return;

      try {
        const { data: profile, error } = await supabase
          .from('organizer_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error loading organizer profile:', error);
          return;
        }

        if (profile) {
          form.reset({
            ...form.getValues(),
            organizer_name: profile.organizer_name,
            organizer_email: profile.contact_email,
            organizer_phone: profile.contact_phone || '',
          });
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    loadOrganizerProfile();
  }, [user?.id, form]);

  const onSubmit = async (data: TournamentFormData) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a tournament",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const tournamentData = {
        user_id: user.id,
        name: data.name,
        date: data.date,
        time: data.time,
        location_name: data.location_name,
        address: data.address,
        city: data.city,
        state: data.state,
        zip_code: data.zip_code,
        game_type: data.game_type,
        entry_fee: data.entry_fee,
        description: data.description || null,
        prize_pool: data.prize_pool || null,
        organizer_name: data.organizer_name,
        organizer_email: data.organizer_email,
        organizer_phone: data.organizer_phone,
        website_link: data.website_link || null,
        flyer_image_url: data.flyer_image_url || null,
      };

      const { error } = await supabase
        .from('tournaments')
        .insert([tournamentData]);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Tournament submitted successfully",
      });

      form.reset();
      onSuccess();
    } catch (error) {
      console.error('Error submitting tournament:', error);
      toast({
        title: "Error",
        description: "Failed to submit tournament. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Trophy className="h-6 w-6 text-deadpunch-red mr-2" />
          Submit Tournament
        </CardTitle>
        <CardDescription className="text-deadpunch-gray-light">
          Fill out the form below to list your tournament
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Tournament Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        placeholder="Weekly 8-Ball Tournament"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                      <SelectContent className="bg-deadpunch-dark border-deadpunch-gray-dark">
                        <SelectItem value="8-Ball" className="text-white">8-Ball</SelectItem>
                        <SelectItem value="9-Ball" className="text-white">9-Ball</SelectItem>
                        <SelectItem value="10-Ball" className="text-white">10-Ball</SelectItem>
                        <SelectItem value="Straight Pool" className="text-white">Straight Pool</SelectItem>
                        <SelectItem value="One Pocket" className="text-white">One Pocket</SelectItem>
                        <SelectItem value="Bank Pool" className="text-white">Bank Pool</SelectItem>
                        <SelectItem value="Other" className="text-white">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Date, Time, Entry Fee */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                        placeholder="25.00"
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

            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={submitting}
                className="bg-deadpunch-red hover:bg-deadpunch-red-hover flex-1"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Tournament'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TournamentSubmissionForm;
