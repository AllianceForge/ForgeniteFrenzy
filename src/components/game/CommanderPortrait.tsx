
"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { useGame } from '@/contexts/GameContext'; // Import useGame
import { Hexagon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';


interface CommanderPortraitProps {
  /** Callback function when the commander is tapped */
  onTap: () => void;
  /** 
   * Optional session-specific commander gender override
   * If provided, this gender will be used instead of the profile's commanderSex
   * This allows temporary gender changes during Tap Tap sessions without affecting the profile
   */
  sessionCommanderGender?: 'male' | 'female';
}

const CommanderPortrait: React.FC<CommanderPortraitProps> = ({ onTap, sessionCommanderGender }) => {
  const { playerProfile } = useGame();
  const [isTapped, setIsTapped] = useState(false);
  
  if (!playerProfile) {
    // Render a skeleton or nothing while the profile is loading to prevent server errors
    return (
        <div className="relative w-64 h-80 sm:w-72 sm:h-96 flex items-center justify-center">
            <Skeleton className="w-full h-full" />
        </div>
    );
  }
  
  // Use session gender override if provided, otherwise fall back to profile default
  // This allows temporary gender changes during Tap Tap sessions without affecting the persistent profile
  const effectiveCommanderSex = sessionCommanderGender || playerProfile.commanderSex;
  const { currentTierColor, equippedUniformPieces } = playerProfile;

  /**
   * Get the appropriate commander image based on equipped uniform pieces and gender
   * This function determines which image to display based on:
   * 1. The effective commander gender (session override or profile default)
   * 2. The number of uniform pieces equipped (determines armor stage)
   * 
   * Image stages:
   * - Stage 0: Base commander (no uniform pieces)
   * - Stage 1: Basic gear (gloves + boots, 1-2 pieces)
   * - Stage 2: Combat armor (gloves + boots + belt/rig, 3-4 pieces)
   * - Stage 3: Full uniform (complete set with helmet, 5+ pieces)
   */
  const getCommanderImage = () => {
    const equippedCount = equippedUniformPieces?.length || 0;
    const sex = effectiveCommanderSex; // Use the effective gender (session or profile)

    // Base Images (No uniform pieces)
    if (equippedCount === 0) {
      return sex === 'male' 
        ? { src: "https://i.imgur.com/iuRJVBZ.png", hint: "fullbody male commander" }
        : { src: "https://i.imgur.com/BQHeVWp.png", hint: "fullbody female commander" };
    }
    // Stage 1: Gloves + Boots (2 pieces)
    if (equippedCount <= 2) {
       return sex === 'male' 
        ? { src: "https://i.imgur.com/83pL36g.png", hint: "male commander gloves boots" }
        : { src: "https://i.imgur.com/7L48yPE.png", hint: "female commander gloves boots" };
    }
    // Stage 2: Gloves + Boots + Belt/Rig (4 pieces)
    if (equippedCount <= 4) {
       return sex === 'male' 
        ? { src: "https://i.imgur.com/tQ4zJ2a.png", hint: "male commander armor" }
        : { src: "https://i.imgur.com/26Xn9A8.png", hint: "female commander armor" };
    }
    // Stage 3: Full Uniform (5 pieces)
     return sex === 'male' 
        ? { src: "https://i.imgur.com/iR322b2.png", hint: "male commander full armor helmet" }
        : { src: "https://i.imgur.com/K3tB9gH.png", hint: "female commander full armor helmet" };
  };

  const { src: imageUrl, hint: dataAiHint } = getCommanderImage();
  // Create alt text based on the effective gender (session override or profile default)
  const altText = effectiveCommanderSex === 'male' ? "Male Commander" : "Female Commander";

  /**
   * Handle tap/touch interactions on the commander portrait
   * This triggers the tap callback and provides visual feedback
   */
  const handleInteraction = () => {
    onTap();
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 200);
  };

  const hexagonClipPath = 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)';

  const dynamicStyles = {
    '--dynamic-commander-glow': currentTierColor || '45 100% 50%'
  } as React.CSSProperties;

  return (
    <div 
      style={dynamicStyles}
      className={cn(
        "relative focus:outline-none transition-transform duration-100",
        "w-64 h-80 sm:w-72 sm:h-96",
        "flex items-center justify-center"
      )}
      aria-label="Tap Commander"
    >
      <button 
        onClick={handleInteraction} 
        onTouchStart={(e) => {
          e.preventDefault();
          handleInteraction();
        }}
        className="w-full h-full relative group"
      >
        <Image
          src={imageUrl}
          alt={altText}
          data-ai-hint={dataAiHint}
          width={288}
          height={384}
          className={cn(
            "object-contain w-full h-full transition-all duration-200",
            isTapped ? "animate-tapped-aura" : "animate-pulse-neon-dynamic active:scale-95"
          )}
          priority
          key={imageUrl} // Add key to force re-render on image change
        />
        
        <div className={cn(
          "absolute flex items-center justify-center",
          "w-[34px] h-[38px]",
          "left-1/2 -translate-x-1/2 -translate-y-1/2",
          // Position the AF logo based on effective gender (session override or profile default)
          effectiveCommanderSex === 'male' ? 'top-[31%]' : 'top-[32%]',
          "bg-[hsl(var(--dynamic-commander-glow))] text-primary-foreground",
          "font-headline font-bold text-sm tracking-wider",
           "pointer-events-none"
        )}
        style={{ clipPath: hexagonClipPath }}
        >
            AF
        </div>
      </button>
    </div>
  );
};

export default CommanderPortrait;
