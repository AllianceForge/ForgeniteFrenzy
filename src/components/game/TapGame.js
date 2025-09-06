"use client";

import React, { useState, useEffect } from 'react';
import { useCharacter } from '@/contexts/CharacterContext';
import { useGame } from '@/contexts/GameContext';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Target, Trophy, Settings } from 'lucide-react';
import CharacterSelector from '../player/CharacterSelector';

const TapGame = () => {
    const { selectedCharacter } = useCharacter();
    const { 
        playerProfile, 
        handleTap, 
        comboCount, 
        comboMultiplier,
        criticalTapChance,
        isInitialSetupDone 
    } = useGame();
    
    const [isTapped, setIsTapped] = useState(false);
    const [showCharacterSelector, setShowCharacterSelector] = useState(false);
    const [tapEffect, setTapEffect] = useState(null);

    // Handle tap with visual feedback
    const onTap = () => {
        if (!playerProfile || playerProfile.currentTaps <= 0) return;
        
        handleTap();
        setIsTapped(true);
        
        // Create tap effect
        const isCritical = Math.random() < criticalTapChance;
        setTapEffect({
            id: Date.now(),
            isCritical,
            multiplier: comboMultiplier
        });
        
        setTimeout(() => setIsTapped(false), 200);
        setTimeout(() => setTapEffect(null), 1000);
    };

    // Get character image - use selected character from context
    const getCharacterImage = () => {
        if (!playerProfile || !selectedCharacter) {
            return selectedCharacter?.url || "https://picsum.photos/seed/default/200";
        }

        const equippedCount = playerProfile.equippedUniformPieces?.length || 0;
        const sex = selectedCharacter.sex;

        // Base Images (No uniform pieces)
        if (equippedCount === 0) {
            return sex === 'male' 
                ? "https://i.imgur.com/iuRJVBZ.png"
                : "https://i.imgur.com/BQHeVWp.png";
        }
        // Stage 1: Gloves + Boots (2 pieces)
        if (equippedCount <= 2) {
            return sex === 'male' 
                ? "https://i.imgur.com/83pL36g.png"
                : "https://i.imgur.com/7L48yPE.png";
        }
        // Stage 2: Gloves + Boots + Belt/Rig (4 pieces)
        if (equippedCount <= 4) {
            return sex === 'male' 
                ? "https://i.imgur.com/tQ4zJ2a.png"
                : "https://i.imgur.com/26Xn9A8.png";
        }
        // Stage 3: Full Uniform (5 pieces)
        return sex === 'male' 
            ? "https://i.imgur.com/iR322b2.png"
            : "https://i.imgur.com/K3tB9gH.png";
    };

    const imageUrl = getCharacterImage();
    const hexagonClipPath = "polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)";
    
    // Calculate tap progress
    const tapProgress = playerProfile ? (playerProfile.currentTaps / playerProfile.maxTaps) * 100 : 0;

    if (!isInitialSetupDone) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Card className="w-full max-w-md">
                    <CardContent className="text-center p-6">
                        <p className="text-muted-foreground">Complete initial setup to start playing</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center space-y-6 p-4">
            {/* Character selector toggle */}
            <div className="flex items-center gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCharacterSelector(!showCharacterSelector)}
                    className="flex items-center gap-2"
                >
                    <Settings className="h-4 w-4" />
                    Change Character
                </Button>
                
                {selectedCharacter && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {selectedCharacter.name}
                    </Badge>
                )}
            </div>

            {/* Character selector */}
            {showCharacterSelector && (
                <div className="w-full max-w-2xl">
                    <CharacterSelector compact={true} />
                    <Button
                        variant="outline"
                        className="w-full mt-4"
                        onClick={() => setShowCharacterSelector(false)}
                    >
                        Close
                    </Button>
                </div>
            )}

            {/* Main tap area */}
            <div className="relative">
                {/* Tap button with character */}
                <div className="relative w-64 h-80 sm:w-72 sm:h-96 flex items-center justify-center">
                    <button
                        onClick={onTap}
                        disabled={!playerProfile || playerProfile.currentTaps <= 0}
                        className={cn(
                            "relative w-full h-full rounded-2xl overflow-hidden",
                            "border-4 border-primary/20 bg-gradient-to-b from-primary/5 to-primary/10",
                            "transition-all duration-200 active:scale-95",
                            isTapped ? "scale-105 shadow-2xl border-primary/60" : "hover:scale-102 hover:shadow-xl",
                            (!playerProfile || playerProfile.currentTaps <= 0) && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <Image
                            src={imageUrl}
                            alt={selectedCharacter?.name || "Commander"}
                            fill
                            className={cn(
                                "object-contain transition-all duration-200",
                                isTapped ? "animate-pulse" : ""
                            )}
                            priority
                            data-ai-hint={selectedCharacter?.hint || "commander portrait"}
                        />
                        
                        {/* Alliance Forge logo overlay */}
                        <div className={cn(
                            "absolute flex items-center justify-center",
                            "w-[34px] h-[38px]",
                            "left-1/2 -translate-x-1/2 -translate-y-1/2",
                            selectedCharacter?.sex === 'male' ? 'top-[31%]' : 'top-[32%]',
                            "bg-primary text-primary-foreground",
                            "font-headline font-bold text-sm tracking-wider",
                            "pointer-events-none"
                        )}
                        style={{ clipPath: hexagonClipPath }}
                        >
                            AF
                        </div>
                    </button>

                    {/* Tap effect */}
                    {tapEffect && (
                        <div className={cn(
                            "absolute inset-0 flex items-center justify-center pointer-events-none",
                            "animate-ping"
                        )}>
                            <div className={cn(
                                "px-4 py-2 rounded-full text-white font-bold",
                                tapEffect.isCritical 
                                    ? "bg-orange-500 text-lg" 
                                    : "bg-blue-500 text-base"
                            )}>
                                {tapEffect.isCritical ? "CRITICAL!" : `+${Math.round(tapEffect.multiplier)}x`}
                            </div>
                        </div>
                    )}
                </div>

                {/* Combo indicator */}
                {comboCount > 0 && (
                    <div className="absolute -top-4 -right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full px-3 py-1 text-sm font-bold animate-bounce">
                        <span className="flex items-center gap-1">
                            <Zap className="h-4 w-4" />
                            {comboCount}x
                        </span>
                    </div>
                )}
            </div>

            {/* Game stats */}
            <Card className="w-full max-w-md">
                <CardContent className="p-4 space-y-4">
                    {/* Tap energy */}
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-1">
                                <Target className="h-4 w-4" />
                                Energy
                            </span>
                            <span>{playerProfile?.currentTaps || 0}/{playerProfile?.maxTaps || 0}</span>
                        </div>
                        <Progress value={tapProgress} className="h-2" />
                    </div>

                    {/* Points */}
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-sm">
                            <Trophy className="h-4 w-4" />
                            Points
                        </span>
                        <span className="font-bold text-lg">{playerProfile?.points?.toLocaleString() || 0}</span>
                    </div>

                    {/* Critical chance */}
                    <div className="flex items-center justify-between text-sm">
                        <span>Critical Chance</span>
                        <span>{Math.round(criticalTapChance * 100)}%</span>
                    </div>

                    {/* Combo multiplier */}
                    <div className="flex items-center justify-between text-sm">
                        <span>Combo Multiplier</span>
                        <span>{comboMultiplier.toFixed(1)}x</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default TapGame;