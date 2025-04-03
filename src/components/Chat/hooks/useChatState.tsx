
import { useState, useEffect } from 'react';

/**
 * Custom hook to manage chat interface state
 */
export const useChatState = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showHint, setShowHint] = useState(() => {
    // Check localStorage to see if hint has been dismissed before
    return localStorage.getItem('chatHintDismissed') !== 'true';
  });
  
  // Email collection state
  const [hasProvidedEmail, setHasProvidedEmail] = useState(() => {
    // Check localStorage to see if user has already provided email
    return localStorage.getItem('chatEmailProvided') === 'true';
  });

  /**
   * Auto-hide hint after 5 seconds
   * Removes the hint bubble if user doesn't interact with it
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);

  /**
   * Toggles the chat window open/closed
   */
  const toggleChat = () => {
    setIsOpen(!isOpen);
    
    // If opening chat for the first time, mark hint as dismissed
    if (!isOpen && showHint) {
      setShowHint(false);
      localStorage.setItem('chatHintDismissed', 'true');
    }
  };

  /**
   * Marks that user has provided email
   */
  const markEmailProvided = () => {
    setHasProvidedEmail(true);
    localStorage.setItem('chatEmailProvided', 'true');
  };

  return {
    isOpen,
    showHint,
    hasProvidedEmail,
    toggleChat,
    markEmailProvided
  };
};
