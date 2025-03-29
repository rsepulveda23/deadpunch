
import React from 'react';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const { 
    isLoading, 
    email, 
    password, 
    adminAccountExists, 
    isAdminEmailAuthorized,
    setEmail,
    setPassword,
    handleSignIn,
    handleSignUp
  } = useAuth();
  
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="noise-overlay"></div>
      
      <Navbar />
      
      <section className="pt-32 pb-20 md:py-40 flex items-center justify-center">
        <div className="w-full max-w-md px-4">
          <div className="glass p-8 rounded-xl">
            <h1 className="text-3xl font-display font-bold mb-6 text-center">Account Access</h1>
            
            {adminAccountExists === false && (
              <div className="bg-amber-800/30 p-4 rounded-lg mb-6">
                <p className="text-amber-200 text-sm">
                  It looks like this is your first time. Please create your admin account.
                </p>
              </div>
            )}
            
            {isAdminEmailAuthorized && (
              <div className="bg-green-800/30 p-4 rounded-lg mb-6">
                <p className="text-green-200 text-sm">
                  Your admin email has been pre-filled as it's authorized in the system.
                </p>
              </div>
            )}
            
            <Tabs defaultValue={adminAccountExists === false ? "signup" : "signin"} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <SignInForm
                  email={email}
                  password={password}
                  isLoading={isLoading}
                  setEmail={setEmail}
                  setPassword={setPassword}
                  handleSignIn={handleSignIn}
                />
              </TabsContent>
              
              <TabsContent value="signup">
                <SignUpForm
                  email={email}
                  password={password}
                  isLoading={isLoading}
                  isAdminEmailAuthorized={isAdminEmailAuthorized}
                  setEmail={setEmail}
                  setPassword={setPassword}
                  handleSignUp={handleSignUp}
                />
              </TabsContent>
            </Tabs>
            
            <Separator className="my-6 bg-deadpunch-dark-lighter" />
            
            <p className="text-center text-sm text-deadpunch-gray-light">
              Admin access is restricted to authorized users only.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
