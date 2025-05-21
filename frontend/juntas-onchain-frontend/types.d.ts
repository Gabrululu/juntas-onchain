declare module '*.json' {
  const value: {
    abi: Array<{
      inputs: Array<{ internalType: string; name: string; type: string }>;
      name: string;
      outputs: Array<{ internalType: string; name: string; type: string }>;
      stateMutability: string;
      type: string;
    }>;
  };
  export default value;
} 