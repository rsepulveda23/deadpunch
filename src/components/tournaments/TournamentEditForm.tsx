
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Save, X } from 'lucide-react';

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

export interface TournamentEditFormProps {
  tournament: {
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
    description: string | null;
    prize_pool: string | null;
    organizer_name: string;
    organizer_email: string;
    organizer_phone: string;
    website_link: string | null;
    flyer_image_url: string | null;
  };
  onSuccess: () => void;
  onCancel: () => void;
}

const TournamentEditForm: React.FC<TournamentEditFormProps> = ({ tournament, onSuccess, onCancel }) => {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<TournamentFormData>({
    resolver: zodResolver(tournamentSchema),
    defaultValues: {
      name: tournament.name,
      date: tournament.date,
      time: tournament.time,
      location_name: tournament.location_name,
      address: tournament.address,
      city: tournament.city,
      state: tournament.state,
      zip_code: tournament.zip_code,
      game_type: tournament.game_type,
      entry_fee: tournament.entry_fee,
      description: tournament.description || '',
      prize_pool: tournament.prize_pool || '',
      organizer_name: tournament.organizer_name,
      organizer_email: tournament.organizer_email,
      organizer_phone: tournament.organizer_phone,
      website_link: tournament.website_link || '',
      flyer_image_url: tournament.flyer_image_url || '',
    },
  });

  const onSubmit = async (data: TournamentFormData) => {
    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('tournaments')
        .update({
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
        })
        .eq('id', tournament.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tournament updated successfully",
      });
      onSuccess();
    } catch (error) {
      console.error('Error updating tournament:', error);
      toast({
        title: "Error",
        description: "Failed to update tournament",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark">
      <CardHeader>
        <CardTitle className="text-white">Edit Tournament</CardTitle>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          placeholder="e.g., $500 Winner Takes All"
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
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Update Tournament
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="border-deadpunch-gray-dark text-white hover:bg-deadpunch-dark-lighter"
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TournamentEditForm;
