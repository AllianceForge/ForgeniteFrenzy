
"use client";
import React, { useState, useEffect, useRef } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useGame } from '@/contexts/GameContext';
import type { ChatMessage } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SendHorizonal, UserCircle, Bot, Shield, Sparkles } from 'lucide-react';
import PlayerSetup from '@/components/player/PlayerSetup';
import IntroScreen from '@/components/intro/IntroScreen';
import { cn } from '@/lib/utils';
import { useAIChat } from '@/hooks/useAIChat';

/**
 * Alliance Chat Page - Enhanced with AI Chat Integration
 * Provides real-time chat functionality with AI responses outside business hours
 * and human agent support during business hours (9am-6pm)
 */
const AllianceChatPage: React.FC = () => {
  const { playerProfile, isLoading, isInitialSetupDone } = useGame();
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Initialize AI chat with user's timezone detection
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const {
    messages,
    isLoading: isChatLoading,
    chatStatus,
    error: chatError,
    sendMessage,
    addMotivationalMessage,
    getMessageStyling,
    isBusinessHours,
    systemMessage
  } = useAIChat({
    userTimezone,
    userName: playerProfile?.name || 'Commander',
    showWelcomeMessage: true
  });

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        // Small delay to ensure DOM is updated
        setTimeout(() => {
          scrollViewport.scrollTop = scrollViewport.scrollHeight;
        }, 100);
      }
    }
  }, [messages]);

  /**
   * Handles form submission and sends message to AI chat system
   */
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !playerProfile || isChatLoading) return;

    const success = await sendMessage(newMessage);
    if (success) {
      setNewMessage('');
    }
  };

  /**
   * Gets appropriate avatar source based on message sender
   */
  const getAvatarSrc = (msg: ChatMessage) => {
    if (msg.isPlayer || msg.senderType === 'user') {
      return playerProfile?.commanderSex === 'male' 
        ? "https://i.imgur.com/gB3i4OQ.png" 
        : "https://i.imgur.com/J3tG1e4.png";
    }
    
    // Different avatars for different sender types
    if (msg.senderType === 'system') {
      return "https://i.imgur.com/9B2wX1F.png"; // Shield/command icon for system messages
    }
    
    return msg.senderAvatar || "https://i.imgur.com/8D3wW8E.png"; // AI hexagon icon
  };

  /**
   * Gets avatar accessibility hint for screen readers
   */
  const getAvatarHint = (msg: ChatMessage) => {
    if (msg.isPlayer || msg.senderType === 'user') { 
      return playerProfile?.commanderSex === 'male' ? "male commander" : "female commander";
    }
    
    if (msg.senderType === 'system') return "alliance command shield";
    if (msg.senderType === 'ai') return "ai hexagon";
    
    return "command interface";
  };

  /**
   * Gets appropriate icon for sender type
   */
  const getSenderIcon = (msg: ChatMessage) => {
    if (msg.isPlayer || msg.senderType === 'user') return null;
    if (msg.senderType === 'system') return <Shield className="h-3 w-3" />;
    if (msg.senderType === 'ai') return <Bot className="h-3 w-3" />;
    return null;
  };

  // Loading states
  if (isLoading) {
    return <IntroScreen />;
  }

  if (!isInitialSetupDone) {
    return <PlayerSetup />;
  }

  if (!playerProfile) return null;


  return (
    <AppLayout>
      {/* Main chat container with enhanced status display */}
      <div className="flex flex-col h-full"> 
        {/* Header with chat status indicator */}
        <header className="p-3 sm:p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-headline text-primary">Alliance Chat</h1>
              <p className="text-sm text-muted-foreground">
                {isBusinessHours ? 'Human agents available' : 'AI assistance active'}
              </p>
            </div>
            
            {/* Status indicator */}
            <div className="flex items-center gap-2">
              {isBusinessHours ? (
                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                  <Shield className="h-4 w-4" />
                  <span className="text-xs font-medium">Live Support</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                  <Bot className="h-4 w-4" />
                  <span className="text-xs font-medium">AI Online</span>
                </div>
              )}
            </div>
          </div>
          
          {/* System status message */}
          {chatStatus && (
            <div className="mt-2 text-xs text-muted-foreground bg-muted/50 p-2 rounded">
              {systemMessage}
            </div>
          )}
        </header>

        {/* Messages area with enhanced styling */}
        <ScrollArea className="flex-grow p-2 sm:p-4" ref={scrollAreaRef}>
          <div className="space-y-3 sm:space-y-4">
            {messages.map((msg) => {
              const styling = getMessageStyling(msg);
              const senderIcon = getSenderIcon(msg);
              
              return (
                <div key={msg.id} className={styling.containerClass}>
                  <div className={cn("flex items-start gap-2 sm:gap-3 max-w-[90%] sm:max-w-[75%]",
                    styling.isUser ? "flex-row-reverse" : ""
                  )}>
                    {/* Avatar */}
                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8 border border-primary/50 flex-shrink-0">
                      <AvatarImage 
                        src={getAvatarSrc(msg)} 
                        alt={msg.senderName} 
                        data-ai-hint={getAvatarHint(msg)} 
                      />
                      <AvatarFallback>
                        {msg.senderName ? msg.senderName.substring(0, 1).toUpperCase() : <UserCircle className="h-4 w-4 sm:h-5 sm:w-5"/>}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Message content */}
                    <div className={styling.messageClass}>
                      {/* Sender name with icon */}
                      <div className="flex items-center gap-1 mb-1">
                        <p className={cn("font-semibold text-sm", styling.senderClass)}>
                          {styling.isUser ? "You" : msg.senderName}
                        </p>
                        {senderIcon}
                      </div>
                      
                      {/* Message text */}
                      <p className="text-sm sm:text-base whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </p>
                      
                      {/* Timestamp */}
                      <p className="text-xs opacity-70 mt-2 text-right">
                        {new Date(msg.timestamp).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* Loading indicator for AI response */}
            {isChatLoading && (
              <div className="flex justify-start mb-4">
                <div className="flex items-start gap-2 sm:gap-3 max-w-[75%]">
                  <Avatar className="h-6 w-6 sm:h-8 sm:w-8 border border-primary/50">
                    <AvatarImage src="https://i.imgur.com/8D3wW8E.png" alt="C.O.R.E. AI" />
                    <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                  <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin">
                        <Bot className="h-4 w-4" />
                      </div>
                      <span className="text-sm text-blue-700 dark:text-blue-300">
                        C.O.R.E. is thinking...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Error display */}
            {chatError && (
              <div className="flex justify-center mb-4">
                <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-3 rounded-lg text-sm">
                  {chatError}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Enhanced footer with motivational message button */}
        <footer className="p-2 sm:p-4 border-t border-border">
          {/* Quick action button */}
          <div className="mb-2 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={addMotivationalMessage}
              className="text-xs"
              disabled={isChatLoading}
            >
              <Sparkles className="h-3 w-3 mr-1" />
              Get Motivation
            </Button>
          </div>
          
          {/* Message input form */}
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={isBusinessHours ? "Message human support..." : "Ask C.O.R.E. anything..."}
              className="flex-grow bg-input border-border focus:ring-primary h-9 sm:h-10 text-base"
              autoComplete="off"
              disabled={isChatLoading}
            />
            <Button 
              type="submit" 
              variant="default" 
              size="sm" 
              aria-label="Send Message" 
              disabled={!newMessage.trim() || isChatLoading}
            >
              <SendHorizonal className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </form>
        </footer>
      </div>
    </AppLayout>
  );
};

export default AllianceChatPage;
