'use client';

import React, { useState, useEffect } from 'react';
import { Wallet } from '@coinbase/onchainkit/wallet';
import {
  ConnectWallet,
  WalletDropdown,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from '@coinbase/onchainkit/identity';

import { useContractRead, useWriteContract, useChainId, useAccount } from 'wagmi';
import { JUNTA_FACTORY_ADDRESS } from '../lib/constants';
import JuntaFactoryABI from '../lib/abi/JuntaFactory.json';
import { parseEther } from 'viem';

import JuntaItem from './components/JuntaItem';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    viem: unknown;
    JuntaFactoryABI: unknown;
  }
}

export default function App() {
  const chainId = useChainId();
  const { address, isConnected } = useAccount();

  // Estados para el formulario
  const [cuota, setCuota] = useState('');
  const [maxParticipantes, setMaxParticipantes] = useState('');
  const [intervalo, setIntervalo] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [theme, setTheme] = useState('light');

  // Inicializar theme desde localStorage si existe
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
      setTheme(savedTheme);
    }
  }, []);

  // Aplicar clase 'dark' al <html> y persistir en localStorage
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Verificar red
  useEffect(() => {
    if (chainId && chainId !== 11155111) {
      toast.error('Por favor, conéctate a la red Sepolia');
    }
  }, [chainId]);

  // Leer juntas creadas
  const { data: juntas, isLoading, isError, refetch } = useContractRead({
    address: JUNTA_FACTORY_ADDRESS.sepolia as `0x${string}`,
    abi: JuntaFactoryABI.abi,
    functionName: 'obtenerJuntas',
  }) as { data: string[] | undefined, isLoading: boolean, isError: boolean, refetch: () => void };

  // Debug: mostrar juntas detectadas
  console.log('🔍 Juntas desde el contrato:', juntas, 'isError:', isError, 'isLoading:', isLoading);

  // Crear junta
  const { writeContract, isPending: isCreating, error: createError } = useWriteContract();

  // Manejar errores de creación
  useEffect(() => {
    if (createError) {
      console.error('Error al crear junta:', createError);
      toast.error('Error al crear la junta: ' + (createError as Error).message);
    }
  }, [createError]);

  // Validar inputs (solo retorna booleano, no modifica estado)
  const isValidForm = () => {
    const cuotaNum = parseFloat(cuota);
    const participantesNum = parseInt(maxParticipantes);
    const intervaloNum = parseInt(intervalo);

    if (isNaN(cuotaNum) || cuotaNum <= 0) return false;
    if (isNaN(participantesNum) || participantesNum < 2) return false;
    if (isNaN(intervaloNum) || intervaloNum < 3600) return false;

    return true;
  };

  const handleCreateJunta = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      toast.error('Conecta tu wallet antes de crear una junta');
      return;
    }
    const cuotaNum = parseFloat(cuota);
    const participantesNum = parseInt(maxParticipantes);
    const intervaloNum = parseInt(intervalo);

    if (isNaN(cuotaNum) || cuotaNum <= 0) {
      setFormError('La cuota debe ser mayor a 0');
      toast.error('La cuota debe ser mayor a 0');
      return;
    }
    if (isNaN(participantesNum) || participantesNum < 2) {
      setFormError('Debe haber al menos 2 participantes');
      toast.error('Debe haber al menos 2 participantes');
      return;
    }
    if (isNaN(intervaloNum) || intervaloNum < 3600) {
      setFormError('El intervalo mínimo es 1 hora (3600 segundos)');
      toast.error('El intervalo mínimo es 1 hora (3600 segundos)');
      return;
    }

    setFormError(null);

    try {
      console.log('Intentando crear junta con estos datos:', {
        address: JUNTA_FACTORY_ADDRESS.sepolia,
        cuota: parseEther(cuota),
        participantes: participantesNum,
        intervalo: intervaloNum,
        isConnected,
        chainId,
        addressUsuario: address
      });
      await writeContract({
        address: JUNTA_FACTORY_ADDRESS.sepolia as `0x${string}`,
        abi: JuntaFactoryABI.abi,
        functionName: 'crearJunta',
        args: [
          parseEther(cuota),
          BigInt(participantesNum),
          BigInt(intervaloNum),
        ],
      });
      toast.success('¡Junta creada exitosamente!');
      setCuota('');
      setMaxParticipantes('');
      setIntervalo('');
      refetch();
    } catch (err) {
      console.error('Error en la transacción:', err);
      setFormError('Error al crear la junta');
      toast.error('Error al crear la junta: ' + (err as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <header className="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
        <span
          className="text-2xl font-bold tracking-tight cursor-pointer group relative"
          title="Juntas Onchain"
        >
          JO
          <span className="absolute left-1/2 -translate-x-1/2 mt-2 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition pointer-events-none z-10 whitespace-nowrap">
            Juntas Onchain
          </span>
        </span>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label="Toggle theme"
            className="p-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {theme === 'light' ? (
              <span role="img" aria-label="Oscuro">🌙</span>
            ) : (
              <span role="img" aria-label="Claro">☀️</span>
            )}
          </button>
          <Wallet>
            <ConnectWallet>
              <Avatar className="h-6 w-6" />
              <Name />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
                <EthBalance />
              </Identity>
              <WalletDropdownLink
                icon="wallet"
                href="https://keys.coinbase.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Wallet
              </WalletDropdownLink>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-6 max-w-4xl mx-auto w-full bg-white dark:bg-gray-900 text-black dark:text-white">
        <section className="w-full max-w-3xl text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-gray-900 dark:text-white">
            💰 Juntas Onchain 💰
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Ahorra en comunidad con confianza, transparencia y tecnología Web3. Automatiza tus juntas de ahorro como nunca antes.
          </p>
        </section>

        <form
          onSubmit={handleCreateJunta}
          className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl mb-8 transition-colors"
          noValidate
        >
          <h2 className="text-xl font-semibold mb-4">Crear Nueva Junta</h2>
          <label className="block mb-4">
            <span className="text-sm font-medium">Cuota (ETH)</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={cuota}
              onChange={(e) => {
                setCuota(e.target.value);
                setFormError(null);
              }}
              className="mt-1 block w-full rounded border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 0.1"
              required
            />
          </label>
          <label className="block mb-4">
            <span className="text-sm font-medium">Máximo de Participantes</span>
            <input
              type="number"
              min="2"
              value={maxParticipantes}
              onChange={(e) => {
                setMaxParticipantes(e.target.value);
                setFormError(null);
              }}
              className="mt-1 block w-full rounded border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 5"
              required
            />
          </label>
          <label className="block mb-6">
            <span className="text-sm font-medium">Intervalo entre aportes (segundos)</span>
            <input
              type="number"
              min="3600"
              value={intervalo}
              onChange={(e) => {
                setIntervalo(e.target.value);
                setFormError(null);
              }}
              className="mt-1 block w-full rounded border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: 604800 (1 semana)"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Mínimo: 3600 (1 hora)</p>
          </label>
          {formError && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-sm">
              {formError}
            </div>
          )}
          <button
            type="submit"
            disabled={!isValidForm() || isCreating}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded transition-colors"
          >
            {isCreating ? 'Creando junta...' : 'Crear Junta'}
          </button>
        </form>

        <section className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl transition-colors">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Juntas Creadas</h2>
            <button
              onClick={() => refetch()}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Actualizar
            </button>
          </div>

          {isLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 border rounded animate-pulse bg-gray-200 dark:bg-gray-700" />
              ))}
            </div>
          )}

          {isError && (
            <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded">
              Error al cargar juntas
            </div>
          )}

          {juntas?.length === 0 && !isLoading && (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              No hay juntas creadas aún
            </p>
          )}

          {juntas && juntas.length > 0 && (
            <ul className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 pr-2">
              {juntas.map((dir: string) => (
                <JuntaItem key={dir} direccion={dir} onActionComplete={refetch} />
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

// Al final del archivo, SOLO para pruebas manuales:
if (typeof window !== 'undefined') {
  import('viem').then(viem => {
    window.viem = viem;
  });
  import('../lib/abi/JuntaFactory.json').then(mod => {
    window.JuntaFactoryABI = mod.default || mod;
  });
}

