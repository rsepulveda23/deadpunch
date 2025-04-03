
import React from 'react';
import TikTokIcon from '../icons/TikTokIcon';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Button } from "@/components/ui/button";

interface TikTokFollowButtonProps {
  size?: 'small' | 'normal';
}

const TikTokFollowButton = ({ size = 'normal' }: TikTokFollowButtonProps) => {
  const isSmall = size === 'small';
  
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <a 
          href="https://www.tiktok.com/@deadpunch.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-white hover:text-deadpunch-red transition-colors duration-300"
          aria-label="TikTok"
        >
          <TikTokIcon size={isSmall ? 40 : 64} />
          <span className={`${isSmall ? "ml-1 text-sm" : "ml-2"} font-medium`}>Follow Us</span>
        </a>
      </HoverCardTrigger>
      <HoverCardContent 
        className={`${isSmall ? 'w-72' : 'w-80'} p-0 bg-deadpunch-dark-lighter border-deadpunch-gray-dark rounded-lg overflow-hidden`} 
        sideOffset={12}
      >
        <div className="flex flex-col">
          <div className="relative w-full aspect-[1/1] overflow-hidden">
            <img 
              src="/lovable-uploads/37cea651-5218-4a94-9866-a47b51d4bf2b.png" 
              alt="Deadpunch TikTok" 
              className="w-full h-full object-contain bg-deadpunch-dark p-6"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
              <TikTokIcon size={isSmall ? 24 : 32} />
              <span className="text-white text-xs font-medium ml-1">@deadpunch.com</span>
            </div>
          </div>
          <div className={`p-${isSmall ? '3' : '4'}`}>
            <h4 className="text-white text-sm font-medium mb-1">DEADPUNCH on TikTok</h4>
            <p className="text-deadpunch-gray-light text-xs mb-2">
              Check out our latest videos and updates{isSmall ? '' : ' on TikTok'}
            </p>
            <Button 
              variant="default" 
              size={isSmall ? "sm" : "default"}
              className="w-full bg-deadpunch-red hover:bg-deadpunch-red-hover"
              onClick={() => window.open('https://www.tiktok.com/@deadpunch.com', '_blank')}
            >
              Visit our TikTok
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default TikTokFollowButton;
