"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * CommanderGenderSwitch Component
 * 
 * This component provides a session-only gender switch for the Tap Tap game.
 * It allows players to temporarily change their commander's gender during the current
 * Tap Tap session without affecting their persistent profile settings.
 * 
 * The switch shows the current session gender and allows toggling between male/female.
 * A reset button is provided to restore the default gender from the player's profile.
 */

interface CommanderGenderSwitchProps {
  /** The current session commander gender */
  sessionGender: 'male' | 'female';
  /** The default gender from the player's profile */
  defaultGender: 'male' | 'female';
  /** Callback to change the session gender */
  onGenderChange: (gender: 'male' | 'female') => void;
  /** Callback to reset to default profile gender */
  onReset: () => void;
  /** Whether the component should be in compact mode for smaller screens */
  compact?: boolean;
}

const CommanderGenderSwitch: React.FC<CommanderGenderSwitchProps> = ({
  sessionGender,
  defaultGender,
  onGenderChange,
  onReset,
  compact = false
}) => {
  /**
   * Handle gender toggle between male and female
   * This only affects the current Tap Tap session
   */
  const handleToggle = () => {
    const newGender = sessionGender === 'male' ? 'female' : 'male';
    onGenderChange(newGender);
  };

  /**
   * Check if the current session gender differs from profile default
   * Used to show/hide the reset button
   */
  const isUsingCustomGender = sessionGender !== defaultGender;

  return (
    <div className={cn(
      "flex flex-col items-center gap-1",
      compact ? "space-y-1" : "space-y-2"
    )}>
      {/* Session Gender Display and Toggle */}
      <div className="text-center">
        <p className={cn(
          "text-xs text-muted-foreground mb-1",
          compact ? "text-[10px]" : "text-xs"
        )}>
          Session Commander
        </p>
        <Button
          onClick={handleToggle}
          variant="outline"
          size={compact ? "sm" : "default"}
          className={cn(
            "min-w-[80px] font-semibold transition-colors",
            sessionGender === 'male' 
              ? "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100" 
              : "bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100"
          )}
        >
          {sessionGender === 'male' ? '♂ Male' : '♀ Female'}
        </Button>
      </div>

      {/* Reset Button - Only shown when using custom gender */}
      {isUsingCustomGender && (
        <Button
          onClick={onReset}
          variant="ghost"
          size="sm"
          className={cn(
            "text-xs text-muted-foreground hover:text-foreground",
            compact ? "h-6 px-2 text-[10px]" : "h-7 px-3 text-xs"
          )}
        >
          <RotateCcw className={cn(
            "mr-1",
            compact ? "h-2 w-2" : "h-3 w-3"
          )} />
          Reset to Default
        </Button>
      )}

      {/* Helper text explaining session-only nature */}
      <p className={cn(
        "text-center text-muted-foreground",
        compact ? "text-[9px] max-w-[120px]" : "text-[10px] max-w-[140px]"
      )}>
        Session only - doesn't change profile
      </p>
    </div>
  );
};

export default CommanderGenderSwitch;