
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

// Lazy load components
const Index = lazy(() => import('./pages/Index'));
const Auth = lazy(() => import('./pages/Auth'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const PoolTools = lazy(() => import('./pages/PoolTools'));
const Tournaments = lazy(() => import('./pages/Tournaments'));
const TournamentDetail = lazy(() => import('./pages/TournamentDetail'));
const Profile = lazy(() => import('./pages/Profile'));
const ProfileEdit = lazy(() => import('./pages/ProfileEdit'));
const OrganizerProfile = lazy(() => import('./pages/OrganizerProfile'));
const ComingSoon = lazy(() => import('./pages/ComingSoon'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Add new lazy imports
const Settings = lazy(() => import('./pages/Settings'));
const SettingsAccount = lazy(() => import('./pages/settings/Account'));
const SettingsSubscription = lazy(() => import('./pages/settings/Subscription'));
const SettingsNotifications = lazy(() => import('./pages/settings/Notifications'));

const queryClient = new QueryClient();

const LoadingSpinner = () => (
  <div className="min-h-screen bg-deadpunch-dark flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-deadpunch-red" />
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/pool-tools" element={<PoolTools />} />
                <Route path="/tournaments" element={<Tournaments />} />
                <Route path="/tournaments/:tournamentId" element={<TournamentDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/edit" element={<ProfileEdit />} />
                <Route path="/organizer/:organizerId" element={<OrganizerProfile />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/settings/account" element={<SettingsAccount />} />
                <Route path="/settings/subscription" element={<SettingsSubscription />} />
                <Route path="/settings/notifications" element={<SettingsNotifications />} />
                <Route path="/settings/tournaments" element={<ComingSoon />} />
                <Route path="/settings/privacy" element={<ComingSoon />} />
                <Route path="/settings/appearance" element={<ComingSoon />} />
                
                {/* Men's category routes */}
                <Route path="/men/hats" element={<ComingSoon />} />
                <Route path="/men/hoodies-jackets" element={<ComingSoon />} />
                <Route path="/men/t-shirts" element={<ComingSoon />} />
                <Route path="/men/accessories" element={<ComingSoon />} />
                <Route path="/men/stickers" element={<ComingSoon />} />
                
                {/* Women's category routes */}
                <Route path="/women/hats" element={<ComingSoon />} />
                <Route path="/women/hoodies-jackets" element={<ComingSoon />} />
                <Route path="/women/t-shirts" element={<ComingSoon />} />
                <Route path="/women/accessories" element={<ComingSoon />} />
                <Route path="/women/stickers" element={<ComingSoon />} />
                
                {/* New Arrivals category routes */}
                <Route path="/new-arrivals/hats" element={<ComingSoon />} />
                <Route path="/new-arrivals/hoodies-jackets" element={<ComingSoon />} />
                <Route path="/new-arrivals/t-shirts" element={<ComingSoon />} />
                <Route path="/new-arrivals/accessories" element={<ComingSoon />} />
                <Route path="/new-arrivals/stickers" element={<ComingSoon />} />
                
                {/* Training Tools category routes */}
                <Route path="/training-tools/journals" element={<ComingSoon />} />
                <Route path="/training-tools/stickers" element={<ComingSoon />} />
                <Route path="/training-tools/accessories" element={<ComingSoon />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
