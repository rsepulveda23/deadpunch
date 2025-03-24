
import React, { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import Features from "@/components/Features";
import EmailForm from "@/components/EmailForm";
import Navbar from "@/components/Navbar";

const Index = () => {
  useEffect(() => {
    // Force document title to be DEADPUNCH
    document.title = "DEADPUNCH";
    
    // Add a more aggressive approach to ensure title stays set
    const observer = new MutationObserver(() => {
      if (document.title !== "DEADPUNCH") {
        document.title = "DEADPUNCH";
      }
    });
    
    observer.observe(document.querySelector('title'), { 
      subtree: true, 
      characterData: true, 
      childList: true 
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="noise-overlay" />
      <main className="container mx-auto px-4">
        <Navbar />
        <HeroSection />
        <Features />
        <EmailForm />
      </main>
    </div>
  );
};

export default Index;
