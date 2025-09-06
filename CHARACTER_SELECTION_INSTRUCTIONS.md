# Character Selection System

This document provides instructions for using the new character selection context and components in the ForgeniteFrenzy game.

## Components Overview

### 1. CharacterContext.js
A React context that manages character selection state and synchronizes it across users via Firestore.

**Features:**
- Maintains selected character state
- Syncs character selection across multiple users
- Provides character management utilities
- Integrates with existing player profile system

### 2. CharacterSelector.js
A reusable component for selecting characters with both compact and full display modes.

**Features:**
- Grid-based character selection interface
- Filter by gender (all/male/female)
- Compact mode for in-game use
- Full mode for setup screens
- Visual feedback for selected character

### 3. TapGame.js
Main game component that integrates character display with tap gameplay mechanics.

**Features:**
- Interactive character display with tap functionality
- Real-time character switching
- Visual feedback for taps and combos
- Energy/stats display
- Integration with existing game mechanics

## Installation & Setup

### 1. The CharacterProvider is already added to the app layout

The `CharacterProvider` has been integrated into `/src/app/layout.tsx` and wraps the entire application:

```jsx
import { CharacterProvider } from '@/contexts/CharacterContext';

// In layout.tsx
<GameProvider>
  <CharacterProvider>
    {children}
    <Toaster />
  </CharacterProvider>
</GameProvider>
```

### 2. Using the Character Selection Components

#### Basic Character Selector
```jsx
import CharacterSelector from '@/components/player/CharacterSelector';

function MyComponent() {
  return (
    <CharacterSelector 
      title="Choose Your Commander"
      description="Select your character for battle"
      showNames={true}
      compact={false}
    />
  );
}
```

#### Compact Character Selector (for in-game use)
```jsx
import CharacterSelector from '@/components/player/CharacterSelector';

function InGameSelector() {
  return (
    <CharacterSelector 
      compact={true}
    />
  );
}
```

#### TapGame Component
```jsx
import TapGame from '@/components/game/TapGame';

function GamePage() {
  return (
    <div className="game-container">
      <TapGame />
    </div>
  );
}
```

### 3. Using the Character Context

```jsx
import { useCharacter } from '@/contexts/CharacterContext';

function MyComponent() {
  const { 
    selectedCharacter, 
    selectCharacter, 
    availableCharacters,
    getCharacterById,
    getCharactersBySex,
    isLoading 
  } = useCharacter();

  // Access selected character
  console.log('Current character:', selectedCharacter);

  // Select a new character
  const handleSelectCharacter = async (character) => {
    await selectCharacter(character);
  };

  // Filter characters by gender
  const femaleCharacters = getCharactersBySex('female');
  const maleCharacters = getCharactersBySex('male');

  return (
    <div>
      <p>Selected: {selectedCharacter.name}</p>
      <p>Loading: {isLoading}</p>
    </div>
  );
}
```

## Multi-User Synchronization

The character selection system automatically syncs across users through:

1. **Local Storage**: For immediate local state persistence
2. **Firestore Integration**: For cross-user synchronization using the existing `syncPlayerProfileInFirestore` function
3. **Real-time Updates**: Character selection changes are immediately reflected across all connected clients

When a user selects a character:
1. The selection is saved to localStorage
2. The player profile is updated with the new character data
3. The updated profile is synced to Firestore
4. Other users see the change in real-time

## Character Data Structure

```javascript
const character = {
  id: 'female1',           // Unique identifier
  url: 'https://...',      // Character image URL
  sex: 'female',           // 'male' or 'female'
  hint: 'female commander', // AI hint for accessibility
  name: 'Commander Nova'   // Display name
};
```

## Props Reference

### CharacterSelector Props
- `title` (string): Header title for the selector
- `description` (string): Description text
- `showNames` (boolean): Whether to show character names
- `compact` (boolean): Use compact grid layout

### useCharacter Hook Returns
- `selectedCharacter`: Currently selected character object
- `selectCharacter(character)`: Function to select a new character
- `availableCharacters`: Array of all available characters
- `getCharacterById(id)`: Get character by ID
- `getCharactersBySex(sex)`: Get characters filtered by gender
- `isLoading`: Boolean indicating if selection is being synced
- `playerProfile`: Current player profile data

## Integration with Existing System

The character selection system is designed to work seamlessly with the existing game infrastructure:

- **PlayerSetup.tsx**: Existing avatar selection continues to work
- **GameContext**: Player profile updates are maintained
- **Firestore**: Uses existing sync mechanisms
- **UI Components**: Consistent with existing design system

## Example Usage Pages

You can integrate these components into existing pages or create new ones:

```jsx
// Example: Character selection page
import CharacterSelector from '@/components/player/CharacterSelector';

export default function CharacterSelectionPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <CharacterSelector />
    </div>
  );
}
```

```jsx
// Example: Main game page with TapGame
import TapGame from '@/components/game/TapGame';

export default function GamePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <TapGame />
    </div>
  );
}
```

## Notes

- The system maintains backward compatibility with existing avatar selection
- Character selection automatically integrates with the player profile system
- All components are styled to match the existing design system
- The context handles loading states and error handling
- Firestore synchronization ensures multiplayer consistency