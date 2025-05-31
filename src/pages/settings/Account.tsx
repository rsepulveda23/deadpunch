
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Camera
} from 'lucide-react';

const Account = () => {
  return (
    <div className="min-h-screen bg-deadpunch-dark">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link to="/settings" className="mr-4">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
              <p className="text-deadpunch-gray-light">
                Manage your personal information and preferences
              </p>
            </div>
          </div>

          {/* Profile Picture */}
          <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark mb-6">
            <CardHeader>
              <CardTitle className="text-white">Profile Picture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20 bg-deadpunch-red">
                  <AvatarFallback className="text-white text-xl">JD</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Button variant="outline" className="mb-2">
                    <Camera className="h-4 w-4 mr-2" />
                    Upload New Picture
                  </Button>
                  <p className="text-sm text-deadpunch-gray-light">
                    JPG, PNG or GIF. Max size 5MB.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-deadpunch-gray-light">First Name</Label>
                  <Input 
                    id="firstName" 
                    placeholder="John"
                    className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-deadpunch-gray-light">Last Name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Doe"
                    className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-deadpunch-gray-light">Email Address</Label>
                <Input 
                  id="email" 
                  type="email"
                  placeholder="john@example.com"
                  className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-deadpunch-gray-light">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                />
              </div>
              <div>
                <Label htmlFor="location" className="text-deadpunch-gray-light">Location</Label>
                <Input 
                  id="location" 
                  placeholder="City, State"
                  className="bg-deadpunch-dark border-deadpunch-gray-dark text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button className="bg-deadpunch-red hover:bg-deadpunch-red-hover">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
