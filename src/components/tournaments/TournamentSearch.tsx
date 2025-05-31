
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Filter, X } from 'lucide-react';

interface SearchFilters {
  location: string;
  radius: string;
  gameType: string;
  startDate: string;
  endDate: string;
  minEntryFee: string;
  maxEntryFee: string;
}

interface TournamentSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
  isLoading?: boolean;
}

const TournamentSearch = ({ onSearch, onClear, isLoading = false }: TournamentSearchProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    radius: '25',
    gameType: '',
    startDate: '',
    endDate: '',
    minEntryFee: '',
    maxEntryFee: ''
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleClear = () => {
    setFilters({
      location: '',
      radius: '25',
      gameType: '',
      startDate: '',
      endDate: '',
      minEntryFee: '',
      maxEntryFee: ''
    });
    onClear();
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '' && value !== '25');

  return (
    <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark mb-6">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Basic Search Row */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-deadpunch-gray-light" />
                <Input
                  placeholder="Enter city, state, or ZIP code"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="pl-10 bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                />
              </div>
            </div>
            
            <Select value={filters.radius} onValueChange={(value) => handleFilterChange('radius', value)}>
              <SelectTrigger className="w-full md:w-32 bg-deadpunch-dark border-deadpunch-gray-dark text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 miles</SelectItem>
                <SelectItem value="25">25 miles</SelectItem>
                <SelectItem value="50">50 miles</SelectItem>
                <SelectItem value="100">100 miles</SelectItem>
                <SelectItem value="250">250 miles</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button 
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-deadpunch-red hover:bg-deadpunch-red-hover"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="border-deadpunch-gray-dark text-white hover:bg-deadpunch-dark-lighter"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="space-y-4 pt-4 border-t border-deadpunch-gray-dark">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-deadpunch-gray-light mb-2">
                    Game Type
                  </label>
                  <Select value={filters.gameType} onValueChange={(value) => handleFilterChange('gameType', value)}>
                    <SelectTrigger className="bg-deadpunch-dark border-deadpunch-gray-dark text-white">
                      <SelectValue placeholder="All games" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All games</SelectItem>
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
                  <label className="block text-sm font-medium text-deadpunch-gray-light mb-2">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-deadpunch-gray-light mb-2">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-deadpunch-gray-light mb-2">
                    Min Entry Fee ($)
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minEntryFee}
                    onChange={(e) => handleFilterChange('minEntryFee', e.target.value)}
                    className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-deadpunch-gray-light mb-2">
                    Max Entry Fee ($)
                  </label>
                  <Input
                    type="number"
                    placeholder="1000"
                    value={filters.maxEntryFee}
                    onChange={(e) => handleFilterChange('maxEntryFee', e.target.value)}
                    className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                  />
                </div>
              </div>

              {hasActiveFilters && (
                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-wrap gap-2">
                    {filters.location && (
                      <Badge variant="secondary" className="bg-deadpunch-red/20 text-deadpunch-red">
                        Location: {filters.location}
                      </Badge>
                    )}
                    {filters.gameType && (
                      <Badge variant="secondary" className="bg-deadpunch-red/20 text-deadpunch-red">
                        Game: {filters.gameType}
                      </Badge>
                    )}
                    {(filters.startDate || filters.endDate) && (
                      <Badge variant="secondary" className="bg-deadpunch-red/20 text-deadpunch-red">
                        Date Range
                      </Badge>
                    )}
                    {(filters.minEntryFee || filters.maxEntryFee) && (
                      <Badge variant="secondary" className="bg-deadpunch-red/20 text-deadpunch-red">
                        Entry Fee Range
                      </Badge>
                    )}
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="text-deadpunch-gray-light hover:text-white"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TournamentSearch;
