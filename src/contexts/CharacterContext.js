"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { syncPlayerProfileInFirestore } from '@/lib/firestore';

// Character data - same as used in PlayerSetup for consistency
const AVAILABLE_CHARACTERS = [
    // Female
    { id: 'female1', url: "https://picsum.photos/seed/female1/200", sex: 'female', hint: 'female commander', name: 'Commander Nova' },
    { id: 'female2', url: "https://picsum.photos/seed/female2/200", sex: 'female', hint: 'female commander', name: 'Commander Aria' },
    { id: 'female3', url: "https://picsum.photos/seed/female3/200", sex: 'female', hint: 'female commander', name: 'Commander Luna' },
    { id: 'female4', url: "https://picsum.photos/seed/female4/200", sex: 'female', hint: 'female commander', name: 'Commander Zara' },
    // Male
    { id: 'male1', url: "https://picsum.photos/seed/male1/200", sex: 'male', hint: 'male commander', name: 'Commander Rex' },
    { id: 'male2', url: "https://picsum.photos/seed/male2/200", sex: 'male', hint: 'male commander', name: 'Commander Kane' },
    { id: 'male3', url: "https://picsum.photos/seed/male3/200", sex: 'male', hint: 'male commander', name: 'Commander Orion' },
    { id: 'male4', url: "https://picsum.photos/seed/male4/200", sex: 'male', hint: 'male commander', name: 'Commander Atlas' },
];

const CharacterContext = createContext(undefined);

export const CharacterProvider = ({ children }) => {
    const [selectedCharacter, setSelectedCharacter] = useState(AVAILABLE_CHARACTERS[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [playerProfile, setPlayerProfile] = useState(null);

    // Load character selection from localStorage on mount
    useEffect(() => {
        const savedProfile = localStorage.getItem('playerProfile');
        if (savedProfile) {
            try {
                const profile = JSON.parse(savedProfile);
                setPlayerProfile(profile);
                
                // Find matching character based on saved profile
                const character = AVAILABLE_CHARACTERS.find(c => 
                    c.url === profile.avatarUrl || 
                    c.sex === profile.commanderSex
                ) || AVAILABLE_CHARACTERS[0];
                
                setSelectedCharacter(character);
            } catch (error) {
                console.error('Error loading saved character:', error);
            }
        }
    }, []);

    // Select a character and sync across users
    const selectCharacter = useCallback(async (character) => {
        setIsLoading(true);
        try {
            setSelectedCharacter(character);
            
            // Update the player profile if it exists
            if (playerProfile) {
                const updatedProfile = {
                    ...playerProfile,
                    avatarUrl: character.url,
                    commanderSex: character.sex
                };
                
                setPlayerProfile(updatedProfile);
                localStorage.setItem('playerProfile', JSON.stringify(updatedProfile));
                
                // Sync with Firestore for multiplayer synchronization
                await syncPlayerProfileInFirestore(updatedProfile);
            }
        } catch (error) {
            console.error('Error selecting character:', error);
        } finally {
            setIsLoading(false);
        }
    }, [playerProfile]);

    // Get character by ID
    const getCharacterById = useCallback((id) => {
        return AVAILABLE_CHARACTERS.find(character => character.id === id);
    }, []);

    // Get characters by sex
    const getCharactersBySex = useCallback((sex) => {
        return AVAILABLE_CHARACTERS.filter(character => character.sex === sex);
    }, []);

    const value = {
        selectedCharacter,
        selectCharacter,
        availableCharacters: AVAILABLE_CHARACTERS,
        getCharacterById,
        getCharactersBySex,
        isLoading,
        playerProfile
    };

    return (
        <CharacterContext.Provider value={value}>
            {children}
        </CharacterContext.Provider>
    );
};

export const useCharacter = () => {
    const context = useContext(CharacterContext);
    if (context === undefined) {
        throw new Error('useCharacter must be used within a CharacterProvider');
    }
    return context;
};