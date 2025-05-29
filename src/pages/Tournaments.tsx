
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import TimeIndicator from '@/components/TimeIndicator';
import TournamentList from '@/components/tournaments/TournamentList';
import TournamentSubmissionForm from '@/components/tournaments/TournamentSubmissionForm';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Calendar, MapPin } from 'lucide-react';

const Tournaments = () => {
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Check if URL has #submit hash to show submission form
    if (location.hash === '#submit') {
      setShowSubmissionForm(true);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-deadpunch-dark text-white">
      <Navbar />
      <TimeIndicator />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="h-12 w-12 text-deadpunch-red mr-4" />
            <h1 className="text-5xl font-bold">
              Pool <span className="text-deadpunch-red">Tournaments</span>
            </h1>
          </div>
          <p className="text-xl text-deadpunch-gray-light max-w-3xl mx-auto">
            Discover and participate in pool tournaments near you. Tournament directors can submit their events to reach players nationwide.
          </p>
        </div>

        {/* Submit Tournament Section */}
        {user && (
          <div className="mb-12">
            <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calendar className="h-6 w-6 text-deadpunch-red mr-2" />
                  Tournament Director?
                </CardTitle>
                <CardDescription className="text-deadpunch-gray-light">
                  Submit your tournament to reach players across the country
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!showSubmissionForm ? (
                  <Button 
                    onClick={() => setShowSubmissionForm(true)}
                    className="bg-deadpunch-red hover:bg-deadpunch-red-hover"
                  >
                    Submit Your Tournament
                  </Button>
                ) : (
                  <div>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowSubmissionForm(false)}
                      className="mb-4 border-deadpunch-gray-dark text-white hover:bg-deadpunch-dark-lighter"
                    >
                      Hide Form
                    </Button>
                    <TournamentSubmissionForm onSuccess={() => setShowSubmissionForm(false)} />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {!user && (
          <div className="mb-12">
            <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <MapPin className="h-6 w-6 text-deadpunch-red mr-2" />
                  Tournament Director?
                </CardTitle>
                <CardDescription className="text-deadpunch-gray-light">
                  Sign in to submit your tournament and reach players nationwide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => window.location.href = '/auth'}
                  className="bg-deadpunch-red hover:bg-deadpunch-red-hover"
                >
                  Sign In to Submit Tournament
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tournament List */}
        <TournamentList />
      </div>
    </div>
  );
};

export default Tournaments;
