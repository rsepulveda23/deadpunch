
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  CreditCard, 
  Bell, 
  Shield, 
  Palette, 
  Download,
  Trash2,
  Crown,
  Calendar,
  Trophy
} from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();

  const settingsCategories = [
    {
      title: "Account",
      description: "Manage your profile and account settings",
      icon: User,
      path: "/settings/account",
      color: "text-blue-400"
    },
    {
      title: "Subscription",
      description: "Manage your premium membership",
      icon: Crown,
      path: "/settings/subscription",
      color: "text-yellow-400",
      badge: "Premium"
    },
    {
      title: "Tournament Preferences",
      description: "Configure tournament notifications and preferences",
      icon: Trophy,
      path: "/settings/tournaments",
      color: "text-green-400"
    },
    {
      title: "Notifications",
      description: "Control email and push notifications",
      icon: Bell,
      path: "/settings/notifications",
      color: "text-purple-400"
    },
    {
      title: "Privacy & Security",
      description: "Manage privacy settings and security options",
      icon: Shield,
      path: "/settings/privacy",
      color: "text-red-400"
    },
    {
      title: "Appearance",
      description: "Customize the app's look and feel",
      icon: Palette,
      path: "/settings/appearance",
      color: "text-pink-400"
    }
  ];

  const dangerZone = [
    {
      title: "Export Data",
      description: "Download all your data",
      icon: Download,
      action: () => console.log("Export data"),
      variant: "outline" as const
    },
    {
      title: "Delete Account",
      description: "Permanently delete your account and all data",
      icon: Trash2,
      action: () => console.log("Delete account"),
      variant: "destructive" as const
    }
  ];

  return (
    <div className="min-h-screen bg-deadpunch-dark">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
            <p className="text-deadpunch-gray-light">
              Manage your account preferences and settings
            </p>
          </div>

          {/* Settings Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {settingsCategories.map((category) => (
              <Card 
                key={category.title}
                className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark hover:border-deadpunch-red/50 transition-colors cursor-pointer"
                onClick={() => navigate(category.path)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <category.icon className={`h-6 w-6 ${category.color}`} />
                    {category.badge && (
                      <Badge variant="secondary" className="bg-deadpunch-red/20 text-deadpunch-red">
                        {category.badge}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {category.title}
                  </h3>
                  <p className="text-deadpunch-gray-light text-sm">
                    {category.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Danger Zone */}
          <Card className="bg-deadpunch-dark-lighter border-red-900">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {dangerZone.map((item) => (
                <div key={item.title}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <item.icon className="h-5 w-5 text-deadpunch-gray-light" />
                      <div>
                        <h4 className="text-white font-medium">{item.title}</h4>
                        <p className="text-deadpunch-gray-light text-sm">{item.description}</p>
                      </div>
                    </div>
                    <Button 
                      variant={item.variant}
                      onClick={item.action}
                      size="sm"
                    >
                      {item.title}
                    </Button>
                  </div>
                  <Separator className="bg-deadpunch-gray-dark mt-4" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
