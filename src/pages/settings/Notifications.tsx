
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  Bell, 
  Mail, 
  Smartphone,
  Trophy,
  Calendar,
  Users
} from 'lucide-react';

const Notifications = () => {
  const emailNotifications = [
    {
      id: "tournament-reminders",
      title: "Tournament Reminders",
      description: "Get reminded about upcoming tournaments you've joined",
      icon: Calendar,
      enabled: true
    },
    {
      id: "new-tournaments",
      title: "New Tournaments",
      description: "Notifications when new tournaments are posted in your area",
      icon: Trophy,
      enabled: false
    },
    {
      id: "organizer-updates",
      title: "Organizer Updates",
      description: "Updates from tournament organizers you follow",
      icon: Users,
      enabled: true
    }
  ];

  const pushNotifications = [
    {
      id: "tournament-starting",
      title: "Tournament Starting Soon",
      description: "Push notification 30 minutes before tournament start",
      enabled: true
    },
    {
      id: "results-posted",
      title: "Results Posted",
      description: "When tournament results are published",
      enabled: false
    }
  ];

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
              <h1 className="text-3xl font-bold text-white mb-2">Notification Settings</h1>
              <p className="text-deadpunch-gray-light">
                Control how and when you receive notifications
              </p>
            </div>
          </div>

          {/* Email Notifications */}
          <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Email Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {emailNotifications.map((notification, index) => (
                <div key={notification.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-3">
                      <notification.icon className="h-5 w-5 text-deadpunch-red mt-1" />
                      <div className="flex-1">
                        <Label htmlFor={notification.id} className="text-white font-medium">
                          {notification.title}
                        </Label>
                        <p className="text-sm text-deadpunch-gray-light mt-1">
                          {notification.description}
                        </p>
                      </div>
                    </div>
                    <Switch 
                      id={notification.id}
                      checked={notification.enabled}
                    />
                  </div>
                  {index < emailNotifications.length - 1 && (
                    <Separator className="bg-deadpunch-gray-dark mt-6" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Push Notifications */}
          <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Smartphone className="h-5 w-5 mr-2" />
                Push Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {pushNotifications.map((notification, index) => (
                <div key={notification.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label htmlFor={notification.id} className="text-white font-medium">
                        {notification.title}
                      </Label>
                      <p className="text-sm text-deadpunch-gray-light mt-1">
                        {notification.description}
                      </p>
                    </div>
                    <Switch 
                      id={notification.id}
                      checked={notification.enabled}
                    />
                  </div>
                  {index < pushNotifications.length - 1 && (
                    <Separator className="bg-deadpunch-gray-dark mt-6" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button className="bg-deadpunch-red hover:bg-deadpunch-red-hover">
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
