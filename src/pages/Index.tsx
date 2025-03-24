
import React, { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import Features from "@/components/Features";
import EmailForm from "@/components/EmailForm";
import Navbar from "@/components/Navbar";

const Index = () => {
  useEffect(() => {
    // Immediately set document title
    document.title = "DEADPUNCH";
    
    // Force title to be DEADPUNCH at regular intervals
    const titleInterval = setInterval(() => {
      if (document.title !== "DEADPUNCH") {
        document.title = "DEADPUNCH";
        console.log("Title corrected to DEADPUNCH");
      }
    }, 100); // Check every 100ms
    
    // Create mutation observer to detect title changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        if (document.title !== "DEADPUNCH") {
          document.title = "DEADPUNCH";
          console.log("Title corrected via MutationObserver");
        }
      });
    });
    
    // Start observing the title element
    const titleElement = document.querySelector('title');
    if (titleElement) {
      observer.observe(titleElement, { 
        subtree: true, 
        characterData: true, 
        childList: true,
        attributes: true
      });
    }
    
    // Create a new function to forcefully update title
    const forceUpdateTitle = () => {
      document.title = "DEADPUNCH";
    };
    
    // Apply title update on various window events
    window.addEventListener("load", forceUpdateTitle);
    window.addEventListener("focus", forceUpdateTitle);
    window.addEventListener("blur", forceUpdateTitle);
    window.addEventListener("visibilitychange", forceUpdateTitle);
    
    // Clean up all listeners and intervals on component unmount
    return () => {
      observer.disconnect();
      clearInterval(titleInterval);
      window.removeEventListener("load", forceUpdateTitle);
      window.removeEventListener("focus", forceUpdateTitle);
      window.removeEventListener("blur", forceUpdateTitle);
      window.removeEventListener("visibilitychange", forceUpdateTitle);
    };
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
