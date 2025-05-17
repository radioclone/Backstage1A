# Sequence Wallet Integration Guide

This guide explains how to integrate Sequence wallet into the Retroverse Festival application.

## Overview

Sequence is a smart contract wallet that provides a seamless Web3 experience. It offers:

- Embedded wallet functionality
- Multi-chain support
- Gasless transactions
- Social login options

## Integration Steps

### 1. Install Required Dependencies

```bash
npm install @0xsequence/kit @0xsequence/provider ethers
```

### 2. Update Authentication Service

The current `authService.ts` file already has a mock implementation. To integrate the actual Sequence SDK:

```typescript
// src/services/authService.ts
import { sequenceConfig } from '@/config/sequenceConfig';
import useStore from '@/lib/stateManager';
import { sequence } from '0xsequence';
import { SequenceIndexerClient } from '@0xsequence/indexer';
import { SequenceMetadata } from '@0xsequence/metadata';

class AuthenticationService {
  private static instance: AuthenticationService;
  private wallet: sequence.Wallet | null = null;
  private indexer: SequenceIndexerClient | null = null;
  private metadata: SequenceMetadata | null = null;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  public static getInstance(): AuthenticationService {
    if (!AuthenticationService.instance) {
      AuthenticationService.instance = new AuthenticationService();
    }
    return AuthenticationService.instance;
  }

  /**
   * Initialize the Sequence wallet
   */
  private async initializeSequence(): Promise<void> {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;

    try {
      // Initialize with project key
      const projectKey = sequenceConfig.projectAccessKey;
      if (!projectKey) {
        throw new Error('Sequence project key not found in environment variables');
      }

      // Configure networks
      const networks = {
        soneium: {
          chainId: 1234, // Replace with actual Soneium Minato chain ID
          name: 'Soneium Minato',
          rpcUrl: 'https://rpc.soneium-minato.network', // Replace with actual RPC URL
        }
      };

      // Initialize wallet
      this.wallet = await sequence.initWallet(projectKey, {
        defaultNetwork: 'soneium',
        networks
      });

      // Initialize indexer and metadata
      this.indexer = new SequenceIndexerClient('https://api.sequence.app');
      this.metadata = new SequenceMetadata();

      console.log('Sequence wallet initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Sequence wallet:', error);
      useStore.getState().setAuth({
        error: 'Failed to initialize wallet',
        loading: false
      });
    }
  }

  /**
   * Connect to the Sequence wallet
   */
  public async connectWallet(): Promise<string | null> {
    try {
      useStore.getState().setAuth({
        loading: true,
        error: null
      });

      if (!this.wallet) {
        await this.initializeSequence();
      }

      if (!this.wallet) {
        throw new Error('Wallet initialization failed');
      }

      // Connect wallet
      const connectDetails = await this.wallet.connect({
        app: 'Retroverse Festival',
        authorize: true,
        // Optional settings for embedded wallet
        settings: {
          theme: 'dark',
          bannerUrl: 'https://your-banner-image.jpg',
          includedPaymentProviders: ['moonpay', 'ramp'],
          defaultFundingCurrency: 'usdc',
          lockFundingCurrencyToDefault: false
        }
      });

      // Check if connected
      if (!connectDetails.connected) {
        throw new Error('Wallet connection failed');
      }

      const address = connectDetails.session?.accountAddress;
      
      if (!address) {
        throw new Error('No address found after connection');
      }

      // Update auth state
      useStore.getState().setAuth({
        isAuthenticated: true,
        address,
        loading: false,
        error: null
      });

      return address;
    } catch (error) {
      console.error('Wallet connection failed:', error);
      
      useStore.getState().setAuth({
        isAuthenticated: false,
        address: null,
        loading: false,
        error: 'Failed to connect wallet'
      });
      
      return null;
    }
  }

  /**
   * Disconnect from the wallet
   */
  public async disconnectWallet(): Promise<void> {
    try {
      if (this.wallet) {
        await this.wallet.disconnect();
      }
      
      useStore.getState().setAuth({
        isAuthenticated: false,
        address: null,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Wallet disconnection failed:', error);
    }
  }

  /**
   * Check if the user has the required token
   */
  public async checkTokenGate(): Promise<boolean> {
    try {
      const { address } = useStore.getState().auth;
      
      if (!address || !this.indexer) return false;
      
      // Example: Check for a specific NFT
      const contractAddress = '0x1234567890123456789012345678901234567890'; // Replace with actual contract
      const tokenId = '1'; // Replace with actual token ID
      
      // Query the indexer
      const balances = await this.indexer.getTokenBalances({
        accountAddress: address,
        contractAddress,
        tokenIds: [tokenId],
      });
      
      // Check if the user has the token
      const hasToken = balances.some(balance => 
        balance.contractAddress.toLowerCase() === contractAddress.toLowerCase() && 
        balance.tokenID === tokenId && 
        parseInt(balance.balance) > 0
      );
      
      return hasToken;
    } catch (error) {
      console.error('Token gate check failed:', error);
      return false;
    }
  }
}

export default AuthenticationService;
```

### 3. Update Configuration

Update the `sequenceConfig.ts` file with the correct chain information:

```typescript
// config/sequenceConfig.ts
export const sequenceConfig = {
  projectAccessKey: process.env.NEXT_PUBLIC_SEQUENCE_PROJECT_KEY,
  supportedChains: ['soneium-minato'],
  securityLevel: 'high',
  networks: {
    soneium: {
      chainId: 1234, // Replace with actual Soneium Minato chain ID
      name: 'Soneium Minato',
      rpcUrl: 'https://rpc.soneium-minato.network', // Replace with actual RPC URL
    }
  }
};
```

### 4. Create a Sequence Provider Component

Create a provider component to wrap your application:

```typescript
// src/components/SequenceProvider.tsx
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { sequence } from '0xsequence';
import { sequenceConfig } from '@/config/sequenceConfig';

interface SequenceProviderProps {
  children: ReactNode;
}

export default function SequenceProvider({ children }: SequenceProviderProps): JSX.Element {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initSequence = async (): Promise<void> => {
      try {
        // Initialize Sequence
        const projectKey = sequenceConfig.projectAccessKey;
        if (!projectKey) {
          console.error('Sequence project key not found');
          return;
        }

        await sequence.initWallet(projectKey);
        setInitialized(true);
      } catch (error) {
        console.error('Failed to initialize Sequence:', error);
      }
    };

    if (typeof window !== 'undefined' && !initialized) {
      initSequence();
    }
  }, [initialized]);

  if (!initialized && typeof window !== 'undefined') {
    return <div>Initializing wallet...</div>;
  }

  return <>{children}</>;
}
```

### 5. Update the Root Layout

Wrap your application with the Sequence provider:

```typescript
// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import SequenceProvider from '@/components/SequenceProvider';

export const metadata: Metadata = {
  title: 'Retroverse Festival',
  description: 'A 3D music festival environment with token gating, multi-user chat, and continuous audio',
  keywords: 'music festival, 3D, web3, token gating, chat, audio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SequenceProvider>
          {children}
        </SequenceProvider>
      </body>
    </html>
  );
}
```

### 6. Get Sequence Project Key and WaaS URL

1. Sign up at [sequence.build](https://sequence.build)
2. Create a new project
3. Get your project key and WaaS URL from the dashboard
4. Add them to your `.env.local` file:

```
NEXT_PUBLIC_SEQUENCE_PROJECT_KEY=your_sequence_project_key
NEXT_PUBLIC_SEQUENCE_WAAS_URL=your_sequence_waas_url
```

The WaaS URL is a base64-encoded JSON object containing the project ID and RPC server URL. This is used to configure the Sequence SDK to use your specific WaaS instance.

### 7. Testing the Integration

To test the integration:

1. Ensure your `.env.local` file has the correct project key
2. Run the development server: `npm run dev`
3. Click the "Connect Wallet" button
4. You should see the Sequence wallet interface
5. Complete the connection process
6. The application should show your connected wallet address

## Advanced Features

### Embedded Wallet Creation

To enable embedded wallet creation for users without existing wallets:

```typescript
// In your authentication service
const connectDetails = await this.wallet.connect({
  app: 'Retroverse Festival',
  authorize: true,
  settings: {
    // Enable email login for embedded wallet creation
    includedLoginMethods: ['email', 'google', 'apple', 'discord'],
    // Other settings...
  }
});
```

### Gasless Transactions

To enable gasless transactions:

```typescript
// Example transaction with gasless support
const signer = wallet.getSigner();
const tx = await signer.sendTransaction({
  to: recipientAddress,
  value: ethers.utils.parseEther('0.001'),
  gasless: true // This enables gasless transactions
});
```

### Multi-Chain Support

To support multiple chains:

```typescript
// In your sequenceConfig.ts
export const sequenceConfig = {
  // ...other config
  networks: {
    soneium: {
      chainId: 1234,
      name: 'Soneium Minato',
      rpcUrl: 'https://rpc.soneium-minato.network',
    },
    polygon: {
      chainId: 137,
      name: 'Polygon',
      rpcUrl: 'https://polygon-rpc.com',
    },
    // Add more networks as needed
  }
};
```

## Resources

- [Sequence Documentation](https://docs.sequence.xyz)
- [Sequence SDK Reference](https://docs.sequence.xyz/sdk)
- [Sequence Embedded Wallet Guide](https://docs.sequence.xyz/embedded-wallet)
- [Sequence Discord](https://discord.gg/sequence)
