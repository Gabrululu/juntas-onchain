'use client';

import { WagmiConfig, createConfig, http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { injected } from 'wagmi/connectors';
import { useConnect, useAccount, useDisconnect } from 'wagmi';
import { authConnector } from '@reown/appkit-adapter-wagmi';

const queryClient = new QueryClient();

const sepolia = {
  id: 11155111,
  name: 'Sepolia',
  network: 'sepolia',
  nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.sepolia.org'] },
  },
  blockExplorers: {
    default: { name: 'Etherscan', url: 'https://sepolia.etherscan.io' },
  },
  testnet: true,
};

const baseSepolia = {
  id: 84532,
  name: 'Base Sepolia',
  network: 'base-sepolia',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://sepolia.base.org'] },
  },
  blockExplorers: {
    default: { name: 'Basescan', url: 'https://sepolia.basescan.org' },
  },
  testnet: true,
};

const mantleSepolia = {
  id: 5003,
  name: 'Mantle Sepolia',
  network: 'mantle-sepolia',
  nativeCurrency: { name: 'MNT', symbol: 'MNT', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.sepolia.mantle.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Mantle Explorer', url: 'https://explorer.sepolia.mantle.xyz' },
  },
  testnet: true,
};

const config = createConfig({
  chains: [sepolia, baseSepolia, mantleSepolia],
  transports: {
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/kCBdnDohh6bwHoVB3zYLFAHh5XYeBMUd'),
    [baseSepolia.id]: http('https://base-sepolia.g.alchemy.com/v2/kCBdnDohh6bwHoVB3zYLFAHh5XYeBMUd'),
    [mantleSepolia.id]: http('https://mantle-sepolia.g.alchemy.com/v2/kCBdnDohh6bwHoVB3zYLFAHh5XYeBMUd'),
  },
  connectors: [
    injected(),
    authConnector({
      chains: [sepolia, baseSepolia, mantleSepolia],
      options: {
        projectId: '03743b74014c39f05e63db875fecce3e',
      },
    }),
  ],
});

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>{children}</WagmiConfig>
    </QueryClientProvider>
  );
}

export function WalletButton() {
  const { connect, connectors, status } = useConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (isConnected)
    return (
      <div className="flex items-center space-x-2">
        <span className="font-mono text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <button
          onClick={() => disconnect()}
          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-xs"
        >
          Desconectar
        </button>
      </div>
    );

  return (
    <div>
      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs mr-2 disabled:opacity-50"
        >
          Conectar con {connector.name}
          {status === 'pending' && ' (Conectando...)'}
        </button>
      ))}
    </div>
  );
}

const handleThemeToggle = () => {
  const root = window.document.documentElement;
  const isDark = root.classList.contains('dark');
  if (isDark) {
    root.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    root.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
};

