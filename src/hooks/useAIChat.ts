import { useState, useEffect, useCallback } from 'react';
import type { ChatMessage } from '@/lib/types';

/**
 * Custom hook for AI Chat functionality
 * Manages chat state, API communication, and business hours detection
 */

interface ChatAPIResponse {
  success: boolean;
  response: ChatMessage;
  isBusinessHours: boolean;
}

interface ChatStatus {
  isBusinessHours: boolean;
  businessHours: {
    start: number;
    end: number;
    timezone: string;
  };
  aiAvailable: boolean;
  systemMessage: string;
}

interface UseAIChatProps {
  /** User's timezone for business hours calculation */
  userTimezone?: string;
  /** User's display name for API calls */
  userName?: string;
  /** Whether to auto-show welcome message on mount */
  showWelcomeMessage?: boolean;
}

export function useAIChat({
  userTimezone = 'UTC',
  userName = 'Commander',
  showWelcomeMessage = true
}: UseAIChatProps = {}) {
  // Chat state management
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatStatus, setChatStatus] = useState<ChatStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches current chat status and business hours information
   */
  const fetchChatStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/chat?timezone=${encodeURIComponent(userTimezone)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch chat status');
      }
      const status: ChatStatus = await response.json();
      setChatStatus(status);
      return status;
    } catch (err) {
      console.error('Error fetching chat status:', err);
      setError('Failed to connect to chat system');
      return null;
    }
  }, [userTimezone]);

  /**
   * Sends a message to the chat API and processes the response
   * @param messageContent - The message content to send
   * @returns Promise<boolean> - Success status
   */
  const sendMessage = useCallback(async (messageContent: string): Promise<boolean> => {
    if (!messageContent.trim()) {
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First, add the user's message to the chat
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        senderId: 'user',
        senderName: userName,
        content: messageContent.trim(),
        timestamp: Date.now(),
        isPlayer: true,
        senderType: 'user'
      };

      setMessages(prev => [...prev, userMessage]);

      // Send message to API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageContent.trim(),
          userTimezone,
          userName
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data: ChatAPIResponse = await response.json();

      if (data.success && data.response) {
        // Add the AI/system response to the chat
        setMessages(prev => [...prev, data.response]);
        
        // Update chat status if it changed
        if (chatStatus?.isBusinessHours !== data.isBusinessHours) {
          await fetchChatStatus();
        }

        return true;
      } else {
        throw new Error('Invalid response from chat API');
      }

    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
      
      // Add error message to chat
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        senderId: 'system_error',
        senderName: 'System',
        content: 'Sorry, there was an error processing your message. Please try again.',
        timestamp: Date.now(),
        isPlayer: false,
        senderType: 'system'
      };
      
      setMessages(prev => [...prev, errorMessage]);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [userTimezone, userName, chatStatus, fetchChatStatus]);

  /**
   * Adds a welcome message to the chat
   */
  const addWelcomeMessage = useCallback(() => {
    const welcomeMessage: ChatMessage = {
      id: crypto.randomUUID(),
      senderId: 'core_system',
      senderName: 'C.O.R.E.',
      senderAvatar: 'https://i.imgur.com/8D3wW8E.png',
      content: 'Welcome to Alliance Strategic Communications, Commander! I\'m C.O.R.E., your AI companion. I\'m here to assist you on your mission to save humanity. Feel free to ask me anything about fleet management, strategy, or just chat about your progress!',
      timestamp: Date.now() - 1000, // Slightly in the past
      isPlayer: false,
      senderType: 'ai'
    };

    setMessages(prev => [welcomeMessage, ...prev]);
  }, []);

  /**
   * Adds a random motivational message from C.O.R.E.
   */
  const addMotivationalMessage = useCallback(() => {
    const motivationalMessages = [
      "Remember Commander, every great journey begins with a single tap. Keep building that fleet!",
      "Your persistence in the face of Earth's doom is truly inspiring. The Alliance is proud to have you.",
      "Strategic tip: Consistent daily progress often yields better results than sporadic intense sessions.",
      "The stars are calling, Commander. Your leadership will guide humanity to a brighter future.",
      "Your dedication to the evacuation mission gives hope to billions. Keep up the excellent work!",
    ];

    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    
    const motivationalMessage: ChatMessage = {
      id: crypto.randomUUID(),
      senderId: 'core_ai',
      senderName: 'C.O.R.E. AI',
      senderAvatar: 'https://i.imgur.com/8D3wW8E.png',
      content: randomMessage,
      timestamp: Date.now(),
      isPlayer: false,
      senderType: 'ai'
    };

    setMessages(prev => [...prev, motivationalMessage]);
  }, []);

  /**
   * Clears all messages from the chat
   */
  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  /**
   * Gets the appropriate CSS classes for message styling based on sender type
   * @param message - The message to get styling for
   * @returns Object with styling information
   */
  const getMessageStyling = useCallback((message: ChatMessage) => {
    const isUser = message.isPlayer || message.senderType === 'user';
    const isAI = message.senderType === 'ai';
    const isSystem = message.senderType === 'system';

    return {
      containerClass: `flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`,
      messageClass: `max-w-[80%] p-3 rounded-lg ${
        isUser 
          ? 'bg-primary text-primary-foreground ml-4' 
          : isAI 
          ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100 mr-4'
          : 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100 mr-4'
      }`,
      senderClass: `text-xs font-medium mb-1 ${
        isUser 
          ? 'text-primary-foreground/80' 
          : isAI 
          ? 'text-blue-700 dark:text-blue-300'
          : 'text-yellow-700 dark:text-yellow-300'
      }`,
      isUser,
      isAI,
      isSystem
    };
  }, []);

  // Initialize chat status and welcome message on mount
  useEffect(() => {
    fetchChatStatus();
    
    if (showWelcomeMessage) {
      // Add welcome message after a short delay
      const timer = setTimeout(addWelcomeMessage, 500);
      return () => clearTimeout(timer);
    }
  }, [fetchChatStatus, showWelcomeMessage, addWelcomeMessage]);

  // Return the hook interface
  return {
    // State
    messages,
    isLoading,
    chatStatus,
    error,
    
    // Actions
    sendMessage,
    addWelcomeMessage,
    addMotivationalMessage,
    clearMessages,
    fetchChatStatus,
    
    // Utilities
    getMessageStyling,
    
    // Computed values
    isBusinessHours: chatStatus?.isBusinessHours ?? false,
    aiAvailable: chatStatus?.aiAvailable ?? true,
    systemMessage: chatStatus?.systemMessage ?? 'Chat system loading...'
  };
}