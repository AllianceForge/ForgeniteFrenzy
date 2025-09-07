# AI + Human Agent Chat System

## Overview

The AI + Human Agent Chat System provides a seamless communication experience for Alliance Forge: Forgeite Frenzy players, combining AI-powered assistance with human agent support based on business hours.

## Features

- **Business Hours Detection**: Automatically detects whether it's business hours (9 AM - 6 PM) based on user timezone
- **AI Chat Outside Business Hours**: OpenAI-powered C.O.R.E. AI companion provides helpful responses
- **Human Agent Support During Business Hours**: System messages indicate when human agents are available
- **Smart Message Styling**: Different visual styles for user, AI, and system messages
- **Motivational Messages**: Built-in motivational messaging system
- **Real-time Status Display**: Shows current chat mode (AI vs Human Agent)
- **Timezone Support**: Automatically detects user timezone for accurate business hours calculation

## Architecture

### Backend (`/api/chat`)

The chat API endpoint handles all message processing and routing:

```typescript
// GET /api/chat - Get chat status
// POST /api/chat - Send message and receive response
```

**Key Components:**
- Business hours detection logic
- OpenAI API integration
- Fallback responses when API is unavailable
- Timezone-aware scheduling

### Frontend Hook (`useAIChat`)

The custom React hook manages chat state and API communication:

```typescript
const {
  messages,          // Array of chat messages
  isLoading,         // Loading state for API calls
  sendMessage,       // Function to send messages
  chatStatus,        // Current chat system status
  isBusinessHours,   // Boolean for current time status
  addMotivationalMessage, // Add motivational message
  getMessageStyling  // Get styling for message types
} = useAIChat();
```

### Chat Component

Enhanced alliance chat page with:
- Real-time message display
- Sender type differentiation (user/AI/system)
- Loading states and error handling
- Business hours status indicator

## Setup Instructions

### 1. Environment Configuration

Create a `.env.local` file in the project root:

```bash
# Optional: OpenAI API key for enhanced AI responses
OPENAI_API_KEY=your_openai_api_key_here
```

**Note**: The system works without an OpenAI API key by using fallback responses with motivational messages.

### 2. Install Dependencies

All required dependencies are already included in the project's `package.json`. The chat system uses:

- `next` - API routes and React framework
- `react` - Frontend functionality
- TypeScript interfaces from existing codebase

### 3. Verify Installation

1. Start the development server:
```bash
npm run dev
```

2. Navigate to `/alliance-chat` in your browser
3. Test sending a message - you should see appropriate responses based on current time

## Configuration

### Business Hours

Default business hours are 9 AM - 6 PM. To modify:

```typescript
// In src/app/api/chat/route.ts
const BUSINESS_START_HOUR = 9;  // Change start hour
const BUSINESS_END_HOUR = 18;   // Change end hour
```

### Motivational Messages

Add or modify motivational messages in two locations:

1. **API Route** (`src/app/api/chat/route.ts`):
```typescript
const MOTIVATIONAL_MESSAGES = [
  "Your custom motivational message here...",
  // Add more messages
];
```

2. **Chat Hook** (`src/hooks/useAIChat.ts`):
```typescript
const motivationalMessages = [
  "Your custom hook message here...",
  // Add more messages
];
```

### Message Styling

Customize message appearance by modifying the `getMessageStyling` function in `useAIChat.ts`:

```typescript
// User messages (blue theme)
isUser ? 'bg-primary text-primary-foreground' 
// AI messages (blue theme)
: isAI ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100'
// System messages (yellow theme)
: 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-100'
```

## Extension Guide

### Adding New Message Types

1. **Extend the ChatMessage interface** in `src/lib/types.ts`:
```typescript
export interface ChatMessage {
  // ... existing fields
  senderType?: 'user' | 'ai' | 'system' | 'admin' | 'announcement';
  priority?: 'low' | 'normal' | 'high';
  // Add other custom fields
}
```

2. **Update styling logic** in `useAIChat.ts`:
```typescript
const getMessageStyling = (message: ChatMessage) => {
  // Add cases for new message types
  const isAdmin = message.senderType === 'admin';
  // ... styling logic
};
```

### Integrating with External Services

1. **Add new API integrations** in the chat route:
```typescript
// src/app/api/chat/route.ts
async function integrateWithService(message: string) {
  // Your integration logic here
  const response = await fetch('external-service-url', {
    // API call configuration
  });
  return response;
}
```

2. **Update the POST handler** to use new services:
```typescript
if (shouldUseExternalService(message)) {
  responseMessage = await integrateWithService(message);
}
```

### Adding Chat History Persistence

1. **Database Integration**:
```typescript
// Add to API route
import { saveChatMessage, getChatHistory } from '@/lib/database';

export async function POST(request: NextRequest) {
  // ... existing logic
  
  // Save message to database
  await saveChatMessage(userMessage);
  await saveChatMessage(responseMessage);
}
```

2. **Load History in Hook**:
```typescript
// Add to useAIChat.ts
const loadChatHistory = useCallback(async () => {
  const history = await fetch('/api/chat/history').then(r => r.json());
  setMessages(history);
}, []);
```

### Custom AI Personalities

1. **Add personality selection** in the API route:
```typescript
const AI_PERSONALITIES = {
  'commander': 'You are a military commander...',
  'scientist': 'You are a research scientist...',
  'engineer': 'You are a fleet engineer...'
};

// Use personality in OpenAI system prompt
const systemPrompt = AI_PERSONALITIES[selectedPersonality] || AI_PERSONALITIES['commander'];
```

2. **Add personality selector** in the chat component:
```tsx
<select onChange={(e) => setPersonality(e.target.value)}>
  <option value="commander">Commander</option>
  <option value="scientist">Scientist</option>
  <option value="engineer">Engineer</option>
</select>
```

### Advanced Features

#### Message Threading
- Add `threadId` to ChatMessage interface
- Group messages by thread in UI
- Add thread creation/management endpoints

#### File Attachments
- Extend ChatMessage with `attachments` field
- Add file upload endpoints
- Handle file display in chat UI

#### Real-time Updates
- Integrate WebSocket support
- Add real-time message synchronization
- Handle multiple concurrent users

#### Analytics and Monitoring
- Add message analytics tracking
- Monitor AI response quality
- Track user engagement metrics

## Troubleshooting

### Common Issues

1. **AI responses not working**:
   - Check if `OPENAI_API_KEY` is set correctly
   - Verify API key has sufficient credits
   - Check browser console for API errors

2. **Business hours not detecting correctly**:
   - Verify user's timezone detection
   - Check browser's timezone settings
   - Test with different timezone values

3. **Messages not displaying correctly**:
   - Check message styling in browser dev tools
   - Verify ChatMessage interface compatibility
   - Ensure all required message fields are present

4. **API route not responding**:
   - Check Next.js development server logs
   - Verify API route file is in correct location
   - Test API endpoint directly via Postman/curl

### Debug Mode

Add debug logging to troubleshoot issues:

```typescript
// In useAIChat.ts
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('Chat status:', chatStatus);
  console.log('Message sent:', messageContent);
  console.log('Response received:', data);
}
```

## Security Considerations

- **API Key Protection**: OpenAI API key is only accessible server-side
- **Input Validation**: All user inputs are validated before processing
- **Rate Limiting**: Consider implementing rate limiting for API endpoints
- **Content Filtering**: Add content moderation for user messages
- **Authentication**: Integrate with existing player authentication system

## Performance Optimization

- **Message Pagination**: Implement message loading for large chat histories
- **Response Caching**: Cache common AI responses to reduce API calls
- **Lazy Loading**: Load chat components only when needed
- **Image Optimization**: Optimize avatar images and assets

## Contributing

When contributing to the chat system:

1. Follow existing TypeScript patterns
2. Add comprehensive comments in English
3. Test both business hours and off-hours scenarios
4. Ensure mobile responsiveness
5. Update this README with any new features

## License

This chat system is part of Alliance Forge: Forgeite Frenzy and follows the same license terms as the main project.