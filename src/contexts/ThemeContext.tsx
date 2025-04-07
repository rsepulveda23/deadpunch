
import React, { createContext, useContext } from 'react';

interface ThemeContextType {
  themeMode: 'night';
  isDayTime: boolean;
  isNightTime: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'night',
  isDayTime: false,
  isNightTime: true,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Fixed night mode
  const value = {
    themeMode: 'night' as const,
    isDayTime: false,
    isNightTime: true
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
