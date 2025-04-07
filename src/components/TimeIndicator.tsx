
import React from 'react';
import { Moon, Clock } from 'lucide-react';

const TimeIndicator: React.FC = () => {
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
  return (
    <div className="fixed top-20 right-4 z-40 flex items-center space-x-2 px-3 py-2 rounded-full backdrop-blur-md bg-background/60 border border-blue-900/20 shadow-[0_0_20px_rgba(140,200,255,0.4)]">
      <Moon className="h-5 w-5 text-blue-300" />
      <Clock className="h-4 w-4 mr-1" />
      <span className="text-sm font-medium">{currentTime}</span>
    </div>
  );
};

export default TimeIndicator;
