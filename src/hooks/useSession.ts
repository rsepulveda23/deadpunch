
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setupAuthListener, getSession, checkAdminAccount } from '@/services/authService';

export const useSession = () => {
  const navigate = useNavigate();
  const [adminAccountExists, setAdminAccountExists] = useState<boolean | null>(null);

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = setupAuthListener();
    
    subscription.callback((event, session) => {
      console.log("Auth state changed:", event);
      if (event === 'SIGNED_IN' && session) {
        console.log("User signed in successfully, redirecting to blog admin");
        // Add a small delay to ensure the session is properly set
        setTimeout(() => {
          navigate('/blog-admin');
        }, 100);
      }
    });
    
    // Then check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await getSession();
        
        if (session) {
          console.log("Active session found on load, redirecting to blog admin");
          navigate('/blog-admin');
        } else {
          const exists = await checkAdminAccount();
          setAdminAccountExists(exists);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      }
    };
    
    checkSession();
    
    return () => subscription.unsubscribe();
  }, [navigate]);

  return { adminAccountExists };
};
