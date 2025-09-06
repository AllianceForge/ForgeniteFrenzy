"use client";

import React, { useState } from 'react';
import { useCharacter } from '@/contexts/CharacterContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Check, Users, Sparkles } from 'lucide-react';

const CharacterSelector = ({ 
    title = "Select Your Commander", 
    description = "Choose your character to represent you in the battlefield.",
    showNames = true,
    compact = false 
}) => {
    const { 
        selectedCharacter, 
        selectCharacter, 
        availableCharacters, 
        getCharactersBySex,
        isLoading 
    } = useCharacter();
    
    const [filter, setFilter] = useState('all'); // 'all', 'male', 'female'

    const filteredCharacters = filter === 'all' 
        ? availableCharacters 
        : getCharactersBySex(filter);

    const handleCharacterSelect = async (character) => {
        if (character.id !== selectedCharacter.id && !isLoading) {
            await selectCharacter(character);
        }
    };

    if (compact) {
        return (
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Character Selection</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {filteredCharacters.map((character) => (
                        <button
                            key={character.id}
                            onClick={() => handleCharacterSelect(character)}
                            disabled={isLoading}
                            className={cn(
                                "relative rounded-lg p-1 border-2 transition-all duration-300",
                                "hover:scale-105 focus:scale-105 focus:outline-none",
                                selectedCharacter.id === character.id 
                                    ? 'border-primary bg-primary/10 shadow-lg' 
                                    : 'border-transparent opacity-70 hover:opacity-100 hover:border-primary/50',
                                isLoading && 'opacity-50 cursor-not-allowed'
                            )}
                        >
                            <Image 
                                src={character.url} 
                                alt={character.name}
                                width={80} 
                                height={80} 
                                className="rounded-md object-cover w-full h-auto aspect-square" 
                                data-ai-hint={character.hint}
                            />
                            {selectedCharacter.id === character.id && (
                                <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1">
                                    <Check className="h-3 w-3" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
                <CardTitle className="font-headline text-2xl text-primary flex items-center justify-center gap-2">
                    <Sparkles className="h-6 w-6" />
                    {title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                    {description}
                </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
                {/* Filter buttons */}
                <div className="flex justify-center gap-2">
                    <Button
                        variant={filter === 'all' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('all')}
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === 'female' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('female')}
                    >
                        Female
                    </Button>
                    <Button
                        variant={filter === 'male' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setFilter('male')}
                    >
                        Male
                    </Button>
                </div>

                {/* Character grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {filteredCharacters.map((character) => (
                        <div key={character.id} className="text-center">
                            <button
                                onClick={() => handleCharacterSelect(character)}
                                disabled={isLoading}
                                className={cn(
                                    "relative rounded-lg p-2 border-2 transition-all duration-300",
                                    "hover:scale-105 focus:scale-105 focus:outline-none w-full",
                                    selectedCharacter.id === character.id 
                                        ? 'border-primary bg-primary/10 shadow-lg' 
                                        : 'border-transparent opacity-70 hover:opacity-100 hover:border-primary/50',
                                    isLoading && 'opacity-50 cursor-not-allowed'
                                )}
                            >
                                <Image 
                                    src={character.url} 
                                    alt={character.name}
                                    width={120} 
                                    height={120} 
                                    className="rounded-md object-cover w-full h-auto aspect-square" 
                                    data-ai-hint={character.hint}
                                />
                                {selectedCharacter.id === character.id && (
                                    <div className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full p-1">
                                        <Check className="h-4 w-4" />
                                    </div>
                                )}
                            </button>
                            
                            {showNames && (
                                <div className="mt-2 space-y-1">
                                    <p className="text-sm font-medium text-foreground">
                                        {character.name}
                                    </p>
                                    <Badge variant="secondary" className="text-xs">
                                        {character.sex === 'male' ? 'Male' : 'Female'}
                                    </Badge>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Selected character info */}
                <div className="text-center p-4 bg-card/50 rounded-lg border">
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        <span>Selected: {selectedCharacter.name}</span>
                    </div>
                    {isLoading && (
                        <p className="text-xs text-muted-foreground mt-1">
                            Syncing selection across users...
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default CharacterSelector;