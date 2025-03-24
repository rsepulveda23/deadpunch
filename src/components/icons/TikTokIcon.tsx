
import React from 'react';

interface TikTokIconProps {
  size?: number;
  className?: string;
}

const TikTokIcon: React.FC<TikTokIconProps> = ({ size = 32, className = '' }) => {
  return (
    <img 
      src="/lovable-uploads/f9fbf7bd-93bc-4855-baf2-1e35ee37b1bb.png" 
      alt="TikTok" 
      width={size} 
      height={size}
      className={className}
      style={{ 
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle'
      }}
    />
  );
};

export default TikTokIcon;
