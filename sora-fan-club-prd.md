# Sora Fan Club - Product Requirements Document

## 1. Overview

A platform for Sora enthusiasts to browse games and participate in game-specific chat rooms. Access to chats is gated by ownership of game-specific NFTs, creating exclusive communities for genuine fans.

## 2. User Stories

-   As a visitor, I want to browse all games without logging in
-   As a user, I want to log in to access game details
-   As an NFT holder, I want exclusive access to game-specific global chat rooms
-   As a chat participant, I want to message other game enthusiasts in a shared global chat per game

## 3. Functional Requirements

### 3.1 Authentication

-   User login/logout functionality
-   Persistent authentication via context
-   Firebase authentication integration

### 3.2 All Games Page

-   Display all games in a responsive card grid layout
-   Each card shows game image, title, and brief description
-   Viewable by all users, authenticated or not

### 3.3 Game Detail & Chat Access

-   Detailed game information page (accessible to logged-in users)
-   Single global chat room per game (no 1:1 messaging)
-   NFT ownership verification before chat access
-   Real-time chat functionality using Firebase
-   Chat message history persistence
-   Specific Game Page layout:
    -   Left half: Game Information (details, media, description)
    -   Right half: Interactive Panel, split into:
        -   Upper section: Polls / Quizzes / Mini-games
        -   Lower section: Global chat room

### 3.4 NFT Verification

-   Blockchain wallet connection
-   Verification of game-specific NFT ownership
-   Caching verification results to minimize blockchain calls

## 4. Technical Requirements

### 4.1 Frontend

-   React with Next.js
-   Context API for authentication state
-   Responsive design (mobile, tablet, desktop)
-   Wallet connection using viem and Rainbow Kit

### 4.2 Backend/Services

-   Firebase Authentication
-   Firebase Realtime Database/Firestore for chat
-   API endpoints for NFT verification
-   Serverless functions for secure verification

### 4.3 Blockchain Integration

-   Ethereum/Base blockchain interaction via viem
-   NFT contract ABI integration
-   Wallet provider support via Rainbow Kit
-   Alchemy RPC for reliable blockchain access

## 5. Implementation Plan

### Phase 1: Authentication & All Games Page

1. Set up AuthContext with login state management
2. Implement login button and authentication flow
3. Create All Games page with card grid layout
4. Connect to games data source (Firebase or static data)

### Phase 2: Game Detail & NFT Verification

1. Create game detail page template with split layout
    - Left panel for game information
    - Right panel with space for interactive elements and chat
2. Implement wallet connection functionality with viem/Rainbow Kit
3. Build NFT verification service
4. Add access control based on NFT ownership

### Phase 3: Chat Implementation

1. Set up Firebase Realtime Database for global chat rooms
2. Implement global chat UI components in the lower right panel
3. Connect chat to Firebase with real-time updates
4. Add message sending and history loading for shared chat rooms

### Phase 3.5: Interactive Features

1. Design interactive poll/quiz components for upper right panel
2. Implement Firebase data structure for polls and quizzes
3. Create admin interface for managing interactive content
4. Connect interactive components to Firebase

### Phase 4: Testing & Refinement

1. Test authentication flows
2. Verify NFT ownership checks
3. Ensure global chat functionality works properly
4. Test interactive features in the upper right panel
5. Optimize for performance and UX
6. Test responsive layout adaptations for smaller screens

## 6. Technical Architecture

```
Client (React/Next.js)
├── AuthContext (login state)
├── WalletContext (viem/Rainbow Kit)
├── Pages
│   ├── Landing
│   ├── All Games
│   └── Game Detail Page
│       ├── Left Panel (Game Info)
│       └── Right Panel
│           ├── Upper Section (Interactive Features)
│           └── Lower Section (Global Chat)
└── Services
    ├── Firebase Auth
    ├── NFT Verification (viem)
    ├── Firebase Chat
    └── Interactive Features Service

Backend (Serverless)
├── Firebase Authentication
├── Firebase Realtime Database
│   ├── Global Chat Rooms
│   └── Interactive Features (Polls/Quizzes)
└── NFT Verification Endpoints
```

## 7. Acceptance Criteria

-   Users can browse all games without authentication
-   Login/logout functions properly with state persistence
-   NFT ownership correctly gates access to game's global chat room
-   Game page correctly displays split layout with information and interactive panels
-   Interactive features (polls/quizzes) load and function in the upper right panel
-   Global chat messages display in real-time with proper author info in the lower right panel
-   UI is responsive across device sizes (panels stack vertically on mobile)
-   Wallet connection is secure and handles edge cases

## 8. Next Steps

1. Finalize design mockups for All Games and Game Detail page layouts
2. Set up Firebase project and configure authentication
3. Implement authentication context
4. Begin development of All Games page

The implementation should follow the phases outlined above, with regular testing to ensure each component meets requirements before proceeding to the next phase.

## 9. Resources Required

-   Firebase account with Realtime Database enabled
-   Alchemy RPC API key for blockchain access
-   NFT contract addresses and ABIs
-   Game data structure and assets
-   UI design for split-panel layout

### 9.1 Firebase Setup Checklist

-   [ ] Create Firebase project in Firebase Console
-   [ ] Enable Firebase Authentication
    -   [ ] Set up Email/Password authentication
    -   [ ] Configure sign-in methods
-   [ ] Set up Firebase Realtime Database
    -   [ ] Create database
    -   [ ] Configure security rules for chat rooms
    -   [ ] Configure data structure for interactive features
-   [ ] Set up Firebase Cloud Functions (if needed for NFT verification)
-   [ ] Configure Firebase project with our application
    -   [ ] Install Firebase SDK
    -   [ ] Initialize Firebase in the application

### 9.2 Blockchain Integration Checklist

-   [ ] Install viem and Rainbow Kit packages
-   [ ] Set up Alchemy RPC endpoint
-   [ ] Configure Rainbow Kit for wallet connection
-   [ ] Implement NFT ownership verification logic

Blockchain wallet integration and NFT verification will be the most complex aspects of this implementation and should be prioritized for technical investigation.

## 10. Glossary

-   **NFT**: Non-Fungible Token, digital asset that represents ownership
-   **Firebase**: Google's platform for creating web and mobile applications
-   **Context API**: React's built-in state management for cross-component data
-   **Global Chat Room**: A single shared chat space for all authenticated NFT holders of a specific game
-   **viem**: TypeScript interface for Ethereum, providing a modular, lightweight alternative to ethers.js
-   **Rainbow Kit**: React library for wallet connections with beautiful UI components
-   **Alchemy**: Blockchain infrastructure provider offering reliable RPC endpoints
-   **Interactive Panel**: Right half of the Game page containing polls, quizzes, and chat functionality
