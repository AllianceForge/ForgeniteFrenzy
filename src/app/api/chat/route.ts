import { NextRequest, NextResponse } from 'next/server';

/**
 * AI Chat API Route
 * Handles chat messages and provides AI responses outside business hours (9am-6pm)
 * or system messages during business hours
 */

// Business hours configuration (9am-6pm)
const BUSINESS_START_HOUR = 9;
const BUSINESS_END_HOUR = 18;

// Motivational messages for the AI to use
const MOTIVATIONAL_MESSAGES = [
  "Stay strong, Commander! The Alliance needs your leadership.",
  "Every tap brings us closer to victory against the unknown threat.",
  "Your dedication to the mission is inspiring the entire fleet.",
  "Remember, we're not just surviving - we're thriving among the stars.",
  "The future of humanity depends on commanders like you.",
  "Your strategic mind is exactly what the Alliance needs right now.",
  "Keep pushing forward - the galaxy is counting on us!",
  "Excellence is not an act, but a habit. You're proving that every day.",
];

/**
 * Checks if the current time is within business hours
 * @param timezone - User's timezone (defaults to UTC)
 * @returns boolean indicating if it's business hours
 */
function isBusinessHours(timezone: string = 'UTC'): boolean {
  try {
    const now = new Date();
    const currentHour = new Date(now.toLocaleString("en-US", { timeZone: timezone })).getHours();
    return currentHour >= BUSINESS_START_HOUR && currentHour < BUSINESS_END_HOUR;
  } catch (error) {
    // If timezone is invalid, default to UTC
    const currentHour = new Date().getUTCHours();
    return currentHour >= BUSINESS_START_HOUR && currentHour < BUSINESS_END_HOUR;
  }
}

/**
 * Generates AI response using OpenAI API (or fallback if API key not available)
 * @param userMessage - The user's message
 * @returns Promise<string> - AI generated response
 */
async function generateAIResponse(userMessage: string): Promise<string> {
  const openaiApiKey = process.env.OPENAI_API_KEY;
  
  if (!openaiApiKey) {
    // Fallback response if OpenAI API key is not configured
    const randomMotivational = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
    return `C.O.R.E. AI: I understand your message about "${userMessage}". ${randomMotivational} Unfortunately, my full AI capabilities are currently offline for maintenance.`;
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are C.O.R.E., the AI companion for Alliance Forge: Forgeite Frenzy, a sci-fi incremental clicker game. You help commanders (players) who are leading humanity's escape from a doomed Earth. 

Your personality:
- Professional but encouraging military AI
- Knowledgeable about space strategy and fleet management
- Supportive and motivational
- Uses sci-fi terminology appropriately
- Keeps responses concise but helpful

Context: Humanity has discovered that Earth will be destroyed, and players are commanders building fleets to evacuate and find new worlds. They tap to earn points, upgrade their ships, and compete on leaderboards.

Always include a motivational element in your responses. Keep responses under 150 words.`
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 150,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || "C.O.R.E. systems are currently recalibrating. Please try again in a moment.";
    
  } catch (error) {
    console.error('Error generating AI response:', error);
    // Fallback to motivational message if API fails
    const randomMotivational = MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)];
    return `C.O.R.E. AI: ${randomMotivational} (Note: Advanced AI systems temporarily offline)`;
  }
}

/**
 * POST /api/chat
 * Handles incoming chat messages and returns appropriate responses
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, userTimezone, userName } = body;

    // Validate required fields
    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    const timezone = userTimezone || 'UTC';
    const displayName = userName || 'Commander';

    // Check if it's business hours
    const isBusinessTime = isBusinessHours(timezone);

    let responseMessage: string;
    let senderType: 'ai' | 'system';

    if (isBusinessTime) {
      // During business hours: System message indicating human agents are available
      responseMessage = `Alliance Command: Human agents are currently available (9 AM - 6 PM). Your message has been logged and will be reviewed by our support team. For immediate assistance with game mechanics, C.O.R.E. AI will be available after business hours.`;
      senderType = 'system';
    } else {
      // Outside business hours: AI response
      responseMessage = await generateAIResponse(message);
      senderType = 'ai';
    }

    // Create response message object
    const chatResponse = {
      id: crypto.randomUUID(),
      senderId: senderType === 'ai' ? 'core_ai' : 'alliance_command',
      senderName: senderType === 'ai' ? 'C.O.R.E. AI' : 'Alliance Command',
      senderAvatar: senderType === 'ai' ? 'https://i.imgur.com/8D3wW8E.png' : 'https://i.imgur.com/9B2wX1F.png', // Different avatar for system
      content: responseMessage,
      timestamp: Date.now(),
      isPlayer: false,
      senderType: senderType
    };

    return NextResponse.json({
      success: true,
      response: chatResponse,
      isBusinessHours: isBusinessTime
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/chat
 * Returns chat status and configuration
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const timezone = searchParams.get('timezone') || 'UTC';
  
  const isBusinessTime = isBusinessHours(timezone);
  
  return NextResponse.json({
    isBusinessHours: isBusinessTime,
    businessHours: {
      start: BUSINESS_START_HOUR,
      end: BUSINESS_END_HOUR,
      timezone: timezone
    },
    aiAvailable: !isBusinessTime,
    systemMessage: isBusinessTime 
      ? "Human agents are currently available. Messages will be reviewed by our support team."
      : "C.O.R.E. AI is online and ready to assist you."
  });
}