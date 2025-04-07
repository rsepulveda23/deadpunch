
import React, { createContext, useContext, useEffect, useState } from 'react';

type ThemeMode = 'day' | 'night';

interface ThemeContextType {
  themeMode: ThemeMode;
  isDayTime: boolean;
  isNightTime: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'day',
  isDayTime: true,
  isNightTime: false,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('day');
  
  useEffect(() => {
    const checkTime = () => {
      const currentHour = new Date().getHours();
      // Consider daytime between 6am and 6pm
      const isDaytime = currentHour >= 6 && currentHour < 18;
      setThemeMode(isDaytime ? 'day' : 'night');
      
      // Apply theme class to document
      document.documentElement.classList.remove('theme-day', 'theme-night');
      document.documentElement.classList.add(isDaytime ? 'theme-day' : 'theme-night');
    };
    
    // Check time immediately
    checkTime();
    
    // Set up an interval to check the time every minute
    const interval = setInterval(checkTime, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  const value = {
    themeMode,
    isDayTime: themeMode === 'day',
    isNightTime: themeMode === 'night'
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
