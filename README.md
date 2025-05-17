# Backspace Festival

A 3D music festival environment with token gating, multi-user chat, agentic entertainment, and continuous audio via Web Audio API.

## Project Overview

Retroverse Festival is a web-based 3D environment representing a token-gated music festival with multi-user chat capabilities and AI-powered agents that provide entertainment and interaction. The application features continuous audio streaming via the Web Audio API and is optimized for performance with a loading screen.

## Features

- **3D Environment**: Immersive festival stage using Spline for 3D rendering
- **Token Gating**: Access control via Web3 wallet authentication
- **Multi-User Chat**: Real-time chat system with agent interactions
- **Agentic Entertainment**: AI-powered agents that interact with users
- **Continuous Audio**: Web Audio API integration for music streaming
- **Performance Optimization**: Loading screen and optimized asset loading

## Project Structure

```
retroverse_1_a/
├── app/                  # Next.js app directory
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main page
├── config/               # Configuration files
│   └── sequenceConfig.ts # Sequence wallet configuration
├── public/               # Static assets
│   ├── 3d-models/        # 3D model assets
│   └── audio/            # Audio files
├── src/                  # Source code
│   ├── agents/           # Agent implementations
│   │   ├── agentFactory.ts # Factory for creating agents
│   │   ├── baseAgent.ts    # Base agent class
│   │   └── djAgent.ts      # DJ agent implementation
│   ├── components/       # React components
│   │   ├── AudioPlayer.tsx     # Audio player component
│   │   ├── ChatInterface.tsx   # Chat interface component
│   │   ├── FestivalLayout.tsx  # Main layout component
│   │   ├── FestivalStage.tsx   # 3D stage component
│   │   ├── LoadingScreen.tsx   # Loading screen component
│   │   └── WalletConnection.tsx # Wallet connection component
│   ├── hooks/            # Custom React hooks
│   │   ├── useAgents.ts  # Hook for agent interactions
│   │   ├── useAudio.ts   # Hook for audio functionality
│   │   └── useAuth.ts    # Hook for authentication
│   ├── lib/              # Utility functions
│   │   └── stateManager.ts # Global state management
│   ├── services/         # Service implementations
│   │   ├── audioService.ts # Audio service
│   │   └── authService.ts  # Authentication service
│   └── types/            # TypeScript type definitions
│       └── global.d.ts   # Global type definitions
├── .env.local            # Environment variables
├── .eslintrc.json        # ESLint configuration
├── next.config.js        # Next.js configuration
├── package.json          # Project dependencies
└── tsconfig.json         # TypeScript configuration
```

## Architecture

The application follows a modular architecture with clear separation of concerns:

1. **Core Services**: Singleton services for authentication, audio, and agent management
2. **State Management**: Centralized state using Zustand
3. **UI Components**: React components for different parts of the UI
4. **Hooks**: Custom hooks for accessing services and state
5. **Agents**: Agent system for AI-powered interactions

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/retroverse-festival.git
   cd retroverse-festival
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Fill in the required values, especially `NEXT_PUBLIC_SEQUENCE_PROJECT_KEY`

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Running with Sequence Integration

To run the application with Sequence wallet integration:

1. On Linux/Mac:
   ```bash
   ./scripts/start-with-sequence.sh
   ```

2. On Windows:
   ```bash
   scripts\start-with-sequence.bat
   ```

This will:
- Check if Sequence dependencies are installed and install them if needed
- Create `.env.local` from the example file if it doesn't exist
- Start the development server

## Integration with Agent-ChatRoom

This project integrates with [Agent-ChatRoom](https://github.com/LittleLittleCloud/Agent-ChatRoom) to provide multi-agent chat capabilities. The integration allows for:

- Dynamic agent interactions
- Context-aware responses
- Realistic chat experiences

## Sequence Wallet Integration

The project uses Sequence Wallet for authentication and token gating. Sequence provides a smart contract wallet with:

- Embedded wallet functionality
- Multi-chain support
- Gasless transactions
- Social login options

### Integration Details

The integration is implemented through:

1. **Authentication Service**: `src/services/authService.ts` handles wallet connection and token verification
2. **Sequence Provider**: `src/components/SequenceProvider.tsx` initializes the Sequence SDK
3. **Configuration**: `config/sequenceConfig.ts` contains chain-specific settings

### Setting Up Sequence

1. Get a Sequence project key:
   - Sign up at [sequence.build](https://sequence.build)
   - Create a new project
   - Copy your project key

2. Add the key to your `.env.local` file:
   ```
   NEXT_PUBLIC_SEQUENCE_PROJECT_KEY=your_sequence_project_key
   ```

3. Install Sequence dependencies:
   ```bash
   npm run install:sequence
   ```

For more detailed information, see the [Sequence Integration Guide](docs/sequence-integration.md).

## Development Guidelines

- **State Management**: Use the global state manager for shared state
- **Component Structure**: Keep components focused and modular
- **Type Safety**: Ensure proper TypeScript types for all code
- **Performance**: Optimize for performance, especially in the 3D environment

## License

This project is licensed under the MIT License - see the LICENSE file for details.
