
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon, Clock } from 'lucide-react';

const TimeIndicator: React.FC = () => {
  const { themeMode } = useTheme();
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return (
    <div className={`fixed top-20 right-4 z-40 flex items-center space-x-2 px-3 py-2 rounded-full backdrop-blur-md ${themeMode === 'day' ? 'bg-white/60 border border-blue-100/40 shadow-[0_0_20px_rgba(100,180,255,0.4)]' : 'bg-background/60 border border-blue-900/20 shadow-[0_0_20px_rgba(140,200,255,0.4)]'}`}>
      {themeMode === 'day' ? (
        <Sun className="h-5 w-5 text-blue-500" />
      ) : (
        <Moon className="h-5 w-5 text-blue-300" />
      )}
      <Clock className="h-4 w-4 mr-1" />
      <span className="text-sm font-medium">{currentTime}</span>
    </div>
  );
};

export default TimeIndicator;
