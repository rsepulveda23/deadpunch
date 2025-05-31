
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Crown, 
  Check, 
  ArrowLeft, 
  Calendar,
  CreditCard,
  Download,
  Star
} from 'lucide-react';

const Subscription = () => {
  const currentPlan = {
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "Basic tournament browsing",
      "Join up to 5 tournaments per month",
      "Basic profile"
    ]
  };

  const premiumPlan = {
    name: "Premium",
    price: "$9.99",
    period: "month",
    features: [
      "Unlimited tournament access",
      "Create and organize tournaments",
      "Advanced analytics",
      "Priority support",
      "Custom tournament flyers",
      "Early access to new features"
    ]
  };

  const billing = {
    nextBilling: "N/A",
    paymentMethod: "No payment method",
    invoices: []
  };

  return (
    <div className="min-h-screen bg-deadpunch-dark">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link to="/settings" className="mr-4">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Subscription</h1>
              <p className="text-deadpunch-gray-light">
                Manage your premium membership and billing
              </p>
            </div>
          </div>

          {/* Current Plan */}
          <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Crown className="h-5 w-5 mr-2 text-yellow-400" />
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{currentPlan.name}</h3>
                  <p className="text-deadpunch-gray-light">
                    {currentPlan.price} / {currentPlan.period}
                  </p>
                </div>
                <Badge variant="outline" className="border-deadpunch-gray-dark text-deadpunch-gray-light">
                  Active
                </Badge>
              </div>
              <ul className="space-y-2">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-deadpunch-gray-light">
                    <Check className="h-4 w-4 mr-2 text-green-400" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Upgrade Option */}
          <Card className="bg-gradient-to-r from-deadpunch-red/10 to-yellow-500/10 border-deadpunch-red mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-400" />
                Upgrade to Premium
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">{premiumPlan.name}</h3>
                  <p className="text-deadpunch-gray-light">
                    {premiumPlan.price} / {premiumPlan.period}
                  </p>
                </div>
                <Button className="bg-deadpunch-red hover:bg-deadpunch-red-hover">
                  Upgrade Now
                </Button>
              </div>
              <ul className="space-y-2 mb-4">
                {premiumPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-deadpunch-gray-light">
                    <Check className="h-4 w-4 mr-2 text-green-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <p className="text-sm text-deadpunch-gray-light">
                💡 Cancel anytime. No long-term commitments.
              </p>
            </CardContent>
          </Card>

          {/* Billing Information */}
          <Card className="bg-deadpunch-dark-lighter border-deadpunch-gray-dark">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Billing Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white font-medium mb-2">Next Billing Date</h4>
                  <p className="text-deadpunch-gray-light">{billing.nextBilling}</p>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-2">Payment Method</h4>
                  <p className="text-deadpunch-gray-light">{billing.paymentMethod}</p>
                </div>
              </div>
              
              <Separator className="bg-deadpunch-gray-dark" />
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-white font-medium">Billing History</h4>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download All
                  </Button>
                </div>
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-deadpunch-gray-dark mx-auto mb-4" />
                  <p className="text-deadpunch-gray-light">No billing history available</p>
                  <p className="text-sm text-deadpunch-gray-light mt-1">
                    Your invoices and receipts will appear here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
