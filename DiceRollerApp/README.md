# Dice Roller App - React Native

A mobile dice rolling application built with React Native and Expo.

## Features

- Roll multiple dice types: D4, D6, D8, D10, D12, D20, D100
- Dice notation support (e.g., 2d6, 5d20)
- Exploding dice (open-ended rolls)
- Modifier support (+/- numbers)
- Roll history with scrollable list
- Clean, modern UI with purple gradient theme

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your device:
   - Install the Expo Go app on your phone
   - Scan the QR code shown in the terminal
   - Or press 'a' for Android emulator or 'i' for iOS simulator

## Requirements

- Node.js
- npm or yarn
- Expo CLI (installed automatically with expo package)
- Expo Go app (for running on physical device)
- Android Studio or Xcode (for emulators)

## Usage

### Rolling Dice
- Tap any die button (D4-D100) to select it
- Enter the number of dice to roll
- Tap "Roll" to see results

### Dice Notation
- Enter notation like "2d6" or "5d20" in the input field
- Tap "Roll" button to roll

### Options
- **Exploding Dice**: Enable to make dice that roll their maximum value roll again and add to total
- **Modifier**: Enter +/- number to add/subtract from the total (e.g., +3, -2)

### History
- View all previous rolls at the bottom
- Scroll through history
- Tap "Clear History" to reset

## Project Structure

```
DiceRollerApp/
├── App.js          # Main application component
├── package.json    # Project dependencies
├── app.json        # Expo configuration
└── README.md       # This file
```
