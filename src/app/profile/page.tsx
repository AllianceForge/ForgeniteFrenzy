
"use client";
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useGame } from '@/contexts/GameContext';
import PlayerSetup from '@/components/player/PlayerSetup';
import IntroScreen from '@/components/intro/IntroScreen';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, UserCircle, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

/**
 * Avatar configuration for profile editing
 * Each avatar has a 'sex' property that determines the persistent commander gender
 * Changing the avatar in profile edit updates the default gender for all future Tap Tap sessions
 */
const ALL_AVATARS = [
    // Female avatars - selecting any of these sets commanderSex to 'female' in the profile
    { url: "https://picsum.photos/seed/female1/200", sex: 'female' as const, hint: 'female commander' },
    { url: "https://picsum.photos/seed/female2/200", sex: 'female' as const, hint: 'female commander' },
    { url: "https://picsum.photos/seed/female3/200", sex: 'female' as const, hint: 'female commander' },
    { url: "https://picsum.photos/seed/female4/200", sex: 'female' as const, hint: 'female commander' },
    // Male avatars - selecting any of these sets commanderSex to 'male' in the profile  
    { url: "https://picsum.photos/seed/male1/200", sex: 'male' as const, hint: 'male commander' },
    { url: "https://picsum.photos/seed/male2/200", sex: 'male' as const, hint: 'male commander' },
    { url: "https://picsum.photos/seed/male3/200", sex: 'male' as const, hint: 'male commander' },
    { url: "https://picsum.photos/seed/male4/200", sex: 'male' as const, hint: 'male commander' },
];


const ProfilePage: React.FC = () => {
  const { playerProfile, isLoading, isInitialSetupDone, updatePlayerProfile } = useGame();
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');

  useEffect(() => {
    if (playerProfile) {
      setName(playerProfile.name);
      setSelectedAvatar(playerProfile.avatarUrl || ALL_AVATARS[0].url);
    }
  }, [playerProfile]);

  /**
   * Handle saving profile changes
   * This updates the persistent commander gender in the player profile
   * The new gender becomes the default for all future Tap Tap sessions
   */
  const handleSave = () => {
    if (playerProfile) {
      // Find the selected avatar object to determine the sex
      const avatarData = ALL_AVATARS.find(a => a.url === selectedAvatar) || ALL_AVATARS[0];
      // Update the profile with new name, avatar, and commander gender
      // This persists the commander gender as the new default for Tap Tap sessions
      updatePlayerProfile(name, selectedAvatar, avatarData.sex);
    }
  };

  if (isLoading) {
    return <IntroScreen />;
  }

  if (!isInitialSetupDone) {
    return <PlayerSetup />;
  }

  if (!playerProfile) return null;

  return (
    <AppLayout>
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6">
        <header className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-headline text-primary flex items-center">
            <UserCircle className="mr-2 sm:mr-3 h-6 w-6 sm:h-8 sm:w-8" />
            Commander Profile
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Customize your callsign and appearance.
          </p>
        </header>

        <div className="max-w-xl mx-auto space-y-6">
          <Card>
            <CardHeader>
                <CardTitle>Edit Callsign</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                <Label htmlFor="name" className="text-lg">Callsign</Label>
                <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-base h-11"
                />
                </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
                <CardTitle>Select Avatar</CardTitle>
                <CardDescription>Choose an avatar that matches your style. This determines your default commander gender.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                  {ALL_AVATARS.map((avatar) => (
                  <button
                      key={avatar.url}
                      onClick={() => setSelectedAvatar(avatar.url)}
                      className={cn(
                      "rounded-lg overflow-hidden border-2 transition-all",
                      selectedAvatar === avatar.url ? 'border-primary ring-2 ring-primary/50' : 'border-transparent hover:border-primary/50'
                      )}
                  >
                      <Image src={avatar.url} alt="Avatar" width={100} height={100} className="object-cover w-full h-auto aspect-square" data-ai-hint={avatar.hint}/>
                  </button>
                  ))}
              </div>
            </CardContent>
          </Card>
          
          <Button onClick={handleSave} className="w-full text-lg h-12" disabled={!name}>
              <Check className="mr-2 h-5 w-5"/>
              Save All Changes
          </Button>

        </div>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
