export const sequenceConfig = {
  projectAccessKey: process.env.NEXT_PUBLIC_SEQUENCE_PROJECT_KEY,
  waasUrl: process.env.NEXT_PUBLIC_SEQUENCE_WAAS_URL,
  supportedChains: ['polygon', 'ethereum', 'soneium-minato'],
  securityLevel: 'high',
  networks: {
    soneium: {
      chainId: 1234, // Replace with actual Soneium Minato chain ID
      name: 'Soneium Minato',
      rpcUrl: 'https://rpc.soneium-minato.network', // Replace with actual RPC URL
    }
  }
};
