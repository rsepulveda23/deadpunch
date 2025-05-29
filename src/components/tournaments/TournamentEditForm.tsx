
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { X } from 'lucide-react';

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

interface TournamentEditFormProps {
  tournament: Tournament;
  onClose: () => void;
  onUpdate: () => void;
}

const TournamentEditForm = ({ tournament, onClose, onUpdate }: TournamentEditFormProps) => {
  const [formData, setFormData] = useState({
    name: tournament.name,
    date: tournament.date,
    time: tournament.time,
    location_name: tournament.location_name,
    address: tournament.address,
    city: tournament.city,
    state: tournament.state,
    zip_code: tournament.zip_code,
    game_type: tournament.game_type,
    entry_fee: tournament.entry_fee.toString(),
    prize_pool: tournament.prize_pool || '',
    description: tournament.description || '',
    organizer_name: tournament.organizer_name,
    organizer_email: tournament.organizer_email,
    organizer_phone: tournament.organizer_phone,
    website_link: tournament.website_link || '',
    flyer_image_url: tournament.flyer_image_url || '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('tournaments')
        .update({
          name: formData.name,
          date: formData.date,
          time: formData.time,
          location_name: formData.location_name,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip_code,
          game_type: formData.game_type,
          entry_fee: parseFloat(formData.entry_fee) || 0,
          prize_pool: formData.prize_pool || null,
          description: formData.description || null,
          organizer_name: formData.organizer_name,
          organizer_email: formData.organizer_email,
          organizer_phone: formData.organizer_phone,
          website_link: formData.website_link || null,
          flyer_image_url: formData.flyer_image_url || null,
        })
        .eq('id', tournament.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Tournament updated successfully",
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating tournament:', error);
      toast({
        title: "Error",
        description: "Failed to update tournament",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Edit Tournament</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-deadpunch-gray-dark"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-white">Tournament Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="game_type" className="text-white">Game Type *</Label>
              <select
                id="game_type"
                name="game_type"
                value={formData.game_type}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-deadpunch-dark border border-deadpunch-gray-dark rounded-md text-white"
              >
                <option value="">Select game type</option>
                <option value="8-Ball">8-Ball</option>
                <option value="9-Ball">9-Ball</option>
                <option value="10-Ball">10-Ball</option>
                <option value="Straight Pool">Straight Pool</option>
                <option value="One Pocket">One Pocket</option>
                <option value="Bank Pool">Bank Pool</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date" className="text-white">Date *</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="time" className="text-white">Time *</Label>
              <Input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location_name" className="text-white">Venue Name *</Label>
            <Input
              id="location_name"
              name="location_name"
              value={formData.location_name}
              onChange={handleChange}
              required
              className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
            />
          </div>

          <div>
            <Label htmlFor="address" className="text-white">Address *</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city" className="text-white">City *</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="state" className="text-white">State *</Label>
              <Input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="zip_code" className="text-white">ZIP Code *</Label>
              <Input
                id="zip_code"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleChange}
                required
                className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="entry_fee" className="text-white">Entry Fee ($) *</Label>
              <Input
                id="entry_fee"
                name="entry_fee"
                type="number"
                step="0.01"
                min="0"
                value={formData.entry_fee}
                onChange={handleChange}
                required
                className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="prize_pool" className="text-white">Prize Pool</Label>
              <Input
                id="prize_pool"
                name="prize_pool"
                value={formData.prize_pool}
                onChange={handleChange}
                placeholder="e.g., $500 guaranteed"
                className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-white">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Tournament details, rules, etc."
              className="bg-deadpunch-dark border-deadpunch-gray-dark text-white min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="organizer_name" className="text-white">Organizer Name *</Label>
              <Input
                id="organizer_name"
                name="organizer_name"
                value={formData.organizer_name}
                onChange={handleChange}
                required
                className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="organizer_email" className="text-white">Organizer Email *</Label>
              <Input
                id="organizer_email"
                name="organizer_email"
                type="email"
                value={formData.organizer_email}
                onChange={handleChange}
                required
                className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="organizer_phone" className="text-white">Organizer Phone *</Label>
              <Input
                id="organizer_phone"
                name="organizer_phone"
                type="tel"
                value={formData.organizer_phone}
                onChange={handleChange}
                required
                className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="website_link" className="text-white">Website Link</Label>
            <Input
              id="website_link"
              name="website_link"
              type="url"
              value={formData.website_link}
              onChange={handleChange}
              placeholder="https://..."
              className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
            />
          </div>

          <div>
            <Label htmlFor="flyer_image_url" className="text-white">Flyer Image URL</Label>
            <Input
              id="flyer_image_url"
              name="flyer_image_url"
              type="url"
              value={formData.flyer_image_url}
              onChange={handleChange}
              placeholder="https://..."
              className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
            />
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="bg-deadpunch-red hover:bg-deadpunch-red-hover"
            >
              {loading ? 'Updating...' : 'Update Tournament'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-deadpunch-gray-dark text-white hover:bg-deadpunch-dark-lighter"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TournamentEditForm;
