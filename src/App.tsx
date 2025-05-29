
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Index from './pages/Index';
import PoolTools from './pages/PoolTools';
import ComingSoon from './pages/ComingSoon';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';
import ForgotPassword from './pages/ForgotPassword';
import Tournaments from './pages/Tournaments';
import TournamentDetail from './pages/TournamentDetail';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/tournaments/:tournamentId" element={<TournamentDetail />} />
            <Route path="/training-tools/pool-tools" element={<PoolTools />} />
            
            {/* Redirect routes */}
            <Route path="/men/:category" element={<ComingSoon />} />
            <Route path="/women/:category" element={<ComingSoon />} />
            <Route path="/new-arrivals/:category" element={<ComingSoon />} />
            <Route path="/training-tools/:tool" element={<ComingSoon />} />
            
            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
