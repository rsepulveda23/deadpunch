
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, X } from 'lucide-react';
import { SearchFilters } from '@/types/tournamentSearch';

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  onClear: () => void;
  loading: boolean;
  searchApplied: boolean;
}

const SearchFiltersComponent = ({ 
  filters, 
  onFiltersChange, 
  onSearch, 
  onClear, 
  loading, 
  searchApplied 
}: SearchFiltersProps) => {
  const updateFilter = (key: keyof SearchFilters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark mb-8">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Search className="h-5 w-5 mr-2" />
          Search Tournaments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Location and Radius */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="location" className="text-white">Location</Label>
            <Input
              id="location"
              placeholder="City, State or ZIP code"
              value={filters.location}
              onChange={(e) => updateFilter('location', e.target.value)}
              className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
            />
          </div>
          <div>
            <Label htmlFor="radius" className="text-white">Search Radius</Label>
            <Select value={filters.radius} onValueChange={(value) => updateFilter('radius', value)}>
              <SelectTrigger className="bg-deadpunch-dark border-deadpunch-gray-dark text-white">
                <SelectValue placeholder="Select radius" />
              </SelectTrigger>
              <SelectContent className="bg-deadpunch-dark border-deadpunch-gray-dark">
                <SelectItem value="10">10 miles</SelectItem>
                <SelectItem value="25">25 miles</SelectItem>
                <SelectItem value="50">50 miles</SelectItem>
                <SelectItem value="100">100 miles</SelectItem>
                <SelectItem value="250">250 miles</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Game Type and Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="gameType" className="text-white">Game Type</Label>
            <Select value={filters.gameType} onValueChange={(value) => updateFilter('gameType', value)}>
              <SelectTrigger className="bg-deadpunch-dark border-deadpunch-gray-dark text-white">
                <SelectValue placeholder="All game types" />
              </SelectTrigger>
              <SelectContent className="bg-deadpunch-dark border-deadpunch-gray-dark">
                <SelectItem value="">All game types</SelectItem>
                <SelectItem value="8-Ball">8-Ball</SelectItem>
                <SelectItem value="9-Ball">9-Ball</SelectItem>
                <SelectItem value="10-Ball">10-Ball</SelectItem>
                <SelectItem value="Straight Pool">Straight Pool</SelectItem>
                <SelectItem value="One Pocket">One Pocket</SelectItem>
                <SelectItem value="Bank Pool">Bank Pool</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="startDate" className="text-white">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={filters.startDate}
              onChange={(e) => updateFilter('startDate', e.target.value)}
              className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
            />
          </div>
          <div>
            <Label htmlFor="endDate" className="text-white">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={filters.endDate}
              onChange={(e) => updateFilter('endDate', e.target.value)}
              className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
            />
          </div>
        </div>

        {/* Entry Fee Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="minEntryFee" className="text-white">Min Entry Fee ($)</Label>
            <Input
              id="minEntryFee"
              type="number"
              placeholder="0"
              value={filters.minEntryFee}
              onChange={(e) => updateFilter('minEntryFee', e.target.value)}
              className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
            />
          </div>
          <div>
            <Label htmlFor="maxEntryFee" className="text-white">Max Entry Fee ($)</Label>
            <Input
              id="maxEntryFee"
              type="number"
              placeholder="No limit"
              value={filters.maxEntryFee}
              onChange={(e) => updateFilter('maxEntryFee', e.target.value)}
              className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <Button
            onClick={onSearch}
            disabled={loading}
            className="bg-deadpunch-red hover:bg-deadpunch-red-hover flex-1"
          >
            {loading ? 'Searching...' : 'Search Tournaments'}
          </Button>
          {searchApplied && (
            <Button
              onClick={onClear}
              variant="outline"
              className="border-deadpunch-gray-dark text-white hover:bg-deadpunch-dark-lighter"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Search
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchFiltersComponent;
