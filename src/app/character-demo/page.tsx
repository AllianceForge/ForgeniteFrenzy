"use client";

import React from 'react';
import CharacterSelector from '@/components/player/CharacterSelector';
import TapGame from '@/components/game/TapGame';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, GamepadIcon, Settings } from 'lucide-react';

export default function CharacterDemoPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/80 p-4">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="font-headline text-3xl text-primary flex items-center justify-center gap-2">
                            <Users className="h-8 w-8" />
                            Character Selection System Demo
                        </CardTitle>
                        <CardDescription className="text-lg">
                            Showcase of the new character selection context and components with multiplayer synchronization
                        </CardDescription>
                    </CardHeader>
                </Card>

                {/* Demo Tabs */}
                <Tabs defaultValue="selector" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="selector" className="flex items-center gap-2">
                            <Settings className="h-4 w-4" />
                            Character Selector
                        </TabsTrigger>
                        <TabsTrigger value="tapgame" className="flex items-center gap-2">
                            <GamepadIcon className="h-4 w-4" />
                            Tap Game
                        </TabsTrigger>
                        <TabsTrigger value="both" className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Combined View
                        </TabsTrigger>
                    </TabsList>

                    {/* Character Selector Tab */}
                    <TabsContent value="selector" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Full Character Selector</CardTitle>
                                <CardDescription>
                                    Complete character selection interface with filtering and character info
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex justify-center">
                                <CharacterSelector />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Compact Character Selector</CardTitle>
                                <CardDescription>
                                    Compact version suitable for in-game character switching
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CharacterSelector compact={true} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Tap Game Tab */}
                    <TabsContent value="tapgame" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tap Game with Character Integration</CardTitle>
                                <CardDescription>
                                    Main game component with character display, tap mechanics, and character switching
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex justify-center">
                                <TapGame />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Combined View Tab */}
                    <TabsContent value="both" className="space-y-4">
                        <div className="grid lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Character Selection</CardTitle>
                                    <CardDescription>
                                        Choose your character - changes sync across users
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <CharacterSelector compact={true} />
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Game Interface</CardTitle>
                                    <CardDescription>
                                        Your selected character in action
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <TapGame />
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Features Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>System Features</CardTitle>
                        <CardDescription>
                            What this character selection system provides
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="p-4 bg-card/50 rounded-lg border">
                                <h3 className="font-semibold text-primary mb-2">Multiplayer Sync</h3>
                                <p className="text-sm text-muted-foreground">
                                    Character selections are automatically synchronized across all users via Firestore
                                </p>
                            </div>
                            <div className="p-4 bg-card/50 rounded-lg border">
                                <h3 className="font-semibold text-primary mb-2">Reusable Components</h3>
                                <p className="text-sm text-muted-foreground">
                                    CharacterSelector component supports both full and compact modes for different use cases
                                </p>
                            </div>
                            <div className="p-4 bg-card/50 rounded-lg border">
                                <h3 className="font-semibold text-primary mb-2">Game Integration</h3>
                                <p className="text-sm text-muted-foreground">
                                    TapGame component integrates character display with existing game mechanics seamlessly
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}