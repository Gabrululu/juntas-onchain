'use client';

import React, { useState } from 'react';
import { useContractRead, useWriteContract } from 'wagmi';
import { formatEther } from 'viem';
import JuntaABI from '../../lib/abi/Junta.json';
import toast from 'react-hot-toast';

interface JuntaItemProps {
  direccion: string;
  onActionComplete?: () => void;
}

export default function JuntaItem({ direccion, onActionComplete }: JuntaItemProps) {
  const [error, setError] = useState<string | null>(null);

  // Leer cuota
  const { data: cuotaData } = useContractRead({
    address: direccion as `0x${string}`,
    abi: JuntaABI.abi,
    functionName: 'cuota',
  });

  // Leer estado
  const { data: estadoData } = useContractRead({
    address: direccion as `0x${string}`,
    abi: JuntaABI.abi,
    functionName: 'estado',
  });

  // Leer participantes
  const { data: participantesData } = useContractRead({
    address: direccion as `0x${string}`,
    abi: JuntaABI.abi,
    functionName: 'verParticipantes',
  });

  // Unirse
  const { writeContract: writeUnirse, isPending: loadingUnirse } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast.success('¡Te has unido a la junta!');
        onActionComplete?.();
      },
      onError: (error: Error) => {
        toast.error('Error al unirse: ' + error.message);
        setError(error.message);
      }
    }
  });

  // Depositar
  const { writeContract: writeDepositar, isPending: loadingDepositar } = useWriteContract({
    mutation: {
      onSuccess: () => {
        toast.success('¡Cuota depositada con éxito!');
        onActionComplete?.();
      },
      onError: (error: Error) => {
        toast.error('Error al depositar: ' + error.message);
        setError(error.message);
      }
    }
  });

  // Debug
  console.log('🧱 Renderizando JuntaItem:', direccion);
  console.log('💵 Cuota:', direccion, cuotaData);
  console.log('📊 Estado:', direccion, estadoData);
  console.log('👥 Participantes:', direccion, participantesData);
  console.log('✍️ writeUnirse:', writeUnirse);

  const cuota = cuotaData ? formatEther(BigInt(cuotaData.toString())) : undefined;
  const estado =
    estadoData === 0
      ? 'Inactiva'
      : estadoData === 1
      ? 'Activa'
      : estadoData === 2
      ? 'Finalizada'
      : 'Cargando...';

  return (
    <li className="break-words mb-6 p-4 border rounded-lg shadow bg-white dark:bg-gray-800 transition-colors">
      <p className="font-mono text-sm mb-2">{direccion}</p>
      <p className="mb-1">
        <strong>Cuota:</strong>{' '}
        {cuota !== undefined ? `${cuota} ETH` : <span className="animate-pulse text-gray-400">Cargando...</span>}
      </p>
      <p className="mb-4">
        <strong>Estado:</strong> {estado}
      </p>
      {error && (
        <div className="mb-2 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded text-sm">
          Error: {error}
        </div>
      )}
      <div className="flex space-x-4">
        <button
          disabled={loadingUnirse || !cuotaData}
          onClick={() => {
            if (!cuotaData) return;
            const cuotaValue = BigInt(cuotaData.toString());
            writeUnirse({
              address: direccion as `0x${string}`,
              abi: JuntaABI.abi,
              functionName: 'unirse',
              args: [],
              value: cuotaValue,
            });
          }}
          className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded transition"
        >
          {loadingUnirse ? 'Uniendo...' : 'Unirse'}
        </button>
        <button
          disabled={loadingDepositar || !cuotaData}
          onClick={() => {
            if (!cuotaData) return;
            const cuotaValue = BigInt(cuotaData.toString());
            writeDepositar({
              address: direccion as `0x${string}`,
              abi: JuntaABI.abi,
              functionName: 'depositar',
              args: [],
              value: cuotaValue,
            });
          }}
          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded transition"
        >
          {loadingDepositar ? 'Depositando...' : 'Depositar cuota'}
        </button>
      </div>
    </li>
  );
}

declare global {
  interface Window {
    viem: unknown;
    JuntaFactoryABI: unknown;
  }
}

if (typeof window !== 'undefined') {
  // Solo cargar si aún no están definidos
  if (!window.viem) {
    import('viem').then(viem => {
      window.viem = viem;
      console.log('viem cargado en window');
    });
  }
  if (!window.JuntaFactoryABI) {
    import('../../lib/abi/JuntaFactory.json').then(mod => {
      window.JuntaFactoryABI = mod.default || mod;
      console.log('ABI cargado en window');
    });
  }
} 