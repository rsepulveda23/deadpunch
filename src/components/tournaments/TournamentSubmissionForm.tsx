
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

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
  onSuccess: () => void;
}

const TournamentSubmissionForm = ({ onSuccess }: TournamentSubmissionFormProps) => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TournamentFormData>({
    resolver: zodResolver(tournamentSchema),
  });

  const onSubmit = async (data: TournamentFormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a tournament",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Submitting tournament data:', data);
      const { error } = await supabase
        .from('tournaments' as any)
        .insert({
          ...data,
          user_id: user.id,
        });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Tournament submitted successfully');
      toast({
        title: "Success",
        description: "Tournament submitted successfully!",
      });
      
      reset();
      onSuccess();
    } catch (error) {
      console.error('Error submitting tournament:', error);
      toast({
        title: "Error",
        description: "Failed to submit tournament. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-deadpunch-dark border-deadpunch-gray-dark">
      <CardHeader>
        <CardTitle className="text-white">Submit Your Tournament</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Tournament Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-white">Tournament Name *</Label>
              <Input
                id="name"
                {...register('name')}
                className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark text-white"
                placeholder="Spring Championship"
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="game_type" className="text-white">Game Type *</Label>
              <Input
                id="game_type"
                {...register('game_type')}
                className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark text-white"
                placeholder="9-Ball, 8-Ball, 10-Ball, etc."
              />
              {errors.game_type && (
                <p className="text-red-400 text-sm mt-1">{errors.game_type.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="date" className="text-white">Date *</Label>
              <Input
                id="date"
                type="date"
                {...register('date')}
                className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark text-white"
              />
              {errors.date && (
                <p className="text-red-400 text-sm mt-1">{errors.date.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="time" className="text-white">Time *</Label>
              <Input
                id="time"
                type="time"
                {...register('time')}
                className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark text-white"
              />
              {errors.time && (
                <p className="text-red-400 text-sm mt-1">{errors.time.message}</p>
              )}
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Location Information</h3>
            
            <div>
              <Label htmlFor="location_name" className="text-white">Venue Name *</Label>
              <Input
                id="location_name"
                {...register('location_name')}
                className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark text-white"
                placeholder="Billiards Palace"
              />
              {errors.location_name && (
                <p className="text-red-400 text-sm mt-1">{errors.location_name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="address" className="text-white">Address *</Label>
              <Input
                id="address"
                {...register('address')}
                className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark text-white"
                placeholder="123 Main Street"
              />
              {errors.address && (
                <p className="text-red-400 text-sm mt-1">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city" className="text-white">City *</Label>
                <Input
                  id="city"
                  {...register('city')}
                  className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark text-white"
                  placeholder="New York"
                />
                {errors.city && (
                  <p className="text-red-400 text-sm mt-1">{errors.city.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="state" className="text-white">State *</Label>
                <Input
                  id="state"
                  {...register('state')}
                  className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark text-white"
                  placeholder="NY"
                />
                {errors.state && (
                  <p className="text-red-400 text-sm mt-1">{errors.state.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="zip_code" className="text-white">ZIP Code *</Label>
                <Input
                  id="zip_code"
                  {...register('zip_code')}
                  className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark text-white"
                  placeholder="10001"
                />
                {errors.zip_code && (
                  <p className="text-red-400 text-sm mt-1">{errors.zip_code.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="entry_fee" className="text-white">Entry Fee *</Label>
              <Input
                id="entry_fee"
                type="number"
                step="0.01"
                {...register('entry_fee', { valueAsNumber: true })}
                className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark text-white"
                placeholder="50.00"
              />
              {errors.entry_fee && (
                <p className="text-red-400 text-sm mt-1">{errors.entry_fee.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="prize_pool" className="text-white">Prize Pool</Label>
              <Input
                id="prize_pool"
                {...register('prize_pool')}
                className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark text-white"
                placeholder="$1000 guaranteed"
              />
            </div>
          </div>

          {/* Organizer Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Organizer Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="organizer_name" className="text-white">Name *</Label>
                <Input
                  id="organizer_name"
                  {...register('organizer_name')}
                  className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark text-white"
                  placeholder="John Smith"
                />
                {errors.organizer_name && (
                  <p className="text-red-400 text-sm mt-1">{errors.organizer_name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="organizer_email" className="text-white">Email *</Label>
                <Input
                  id="organizer_email"
                  type="email"
                  {...register('organizer_email')}
                  className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark text-white"
                  placeholder="john@example.com"
                />
                {errors.organizer_email && (
                  <p className="text-red-400 text-sm mt-1">{errors.organizer_email.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="organizer_phone" className="text-white">Phone *</Label>
                <Input
                  id="organizer_phone"
                  {...register('organizer_phone')}
                  className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark text-white"
                  placeholder="(555) 123-4567"
                />
                {errors.organizer_phone && (
                  <p className="text-red-400 text-sm mt-1">{errors.organizer_phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Optional Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Additional Information</h3>
            
            <div>
              <Label htmlFor="description" className="text-white">Description</Label>
              <textarea
                id="description"
                {...register('description')}
                rows={4}
                className="w-full px-3 py-2 bg-deadpunch-dark-lighter border border-deadpunch-gray-dark rounded-md text-white resize-none"
                placeholder="Tournament format, rules, registration details, etc."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="website_link" className="text-white">Website Link</Label>
                <Input
                  id="website_link"
                  type="url"
                  {...register('website_link')}
                  className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark text-white"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <Label htmlFor="flyer_image_url" className="text-white">Flyer Image URL</Label>
                <Input
                  id="flyer_image_url"
                  type="url"
                  {...register('flyer_image_url')}
                  className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark text-white"
                  placeholder="https://example.com/flyer.jpg"
                />
              </div>
            </div>
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
      </CardContent>
    </Card>
  );
};

export default TournamentSubmissionForm;
