/**
 * Manual Test Script for Commander Gender Session Override
 * 
 * This script documents how to manually test the commander gender functionality
 * to ensure it meets the requirements from the problem statement.
 * 
 * Test Cases:
 * 
 * 1. Registration Test:
 *    - Start fresh (clear localStorage)
 *    - Go through player setup
 *    - Select a female avatar
 *    - Complete setup
 *    - Verify profile has commanderSex: 'female'
 *    - Verify Tap Tap game shows female commander
 * 
 * 2. Profile Edit Test:
 *    - Go to profile page
 *    - Change to male avatar
 *    - Save changes
 *    - Return to main game
 *    - Verify Tap Tap game shows male commander
 *    - Verify session switch resets to male as default
 * 
 * 3. Session Override Test:
 *    - On main game page, use gender switch
 *    - Change from male to female (or vice versa)
 *    - Verify commander image changes immediately
 *    - Verify "Reset to Default" button appears
 *    - Tap the commander to ensure tapping still works
 *    - Refresh the page
 *    - Verify commander returns to profile default
 * 
 * 4. Persistence Test:
 *    - Change session gender
 *    - Navigate to another page (e.g., upgrades)
 *    - Return to main page
 *    - Verify session gender is reset to profile default
 * 
 * 5. Reset Test:
 *    - Change session gender
 *    - Click "Reset to Default" button
 *    - Verify commander returns to profile gender
 *    - Verify reset button disappears
 * 
 * Expected Behavior:
 * - Profile commanderSex should only change via registration or profile edit
 * - Session gender should default to profile commanderSex
 * - Session gender changes should be temporary and not affect profile
 * - All changes should be reflected in the commander image immediately
 * - Tapping functionality should work regardless of session override
 */

// This is a documentation file, not executable code
export const MANUAL_TEST_DOCUMENTATION = "See comments above for test procedures";