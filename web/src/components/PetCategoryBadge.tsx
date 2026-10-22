import React from 'react';
import { PetRegistration } from '../types';

export function isPetMutirao(pet: PetRegistration | null | undefined): boolean {
  if (!pet) return false;
  const p = pet as any;
  if (p.codigoHistorico) return true;
  if (typeof p.id === 'string' && p.id.startsWith('hist_')) return true;
  if (p.origem === 'relatorio_consolidado_castracao') return true;
  if (typeof p.origem === 'string' && p.origem.includes('mutirao')) return true;
  if (p.idOriginal) return true;
  return false;
}

interface PetCategoryBadgeProps {
  pet: PetRegistration | null | undefined;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PetCategoryBadge: React.FC<PetCategoryBadgeProps> = ({
  pet,
  className = '',
  size = 'md'
}) => {
  if (!pet) return null;
  const mutirao = isPetMutirao(pet);

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-xs sm:text-sm px-3.5 py-1.5 gap-2 font-bold',
    lg: 'text-sm sm:text-base px-4 py-2 gap-2.5 font-extrabold'
  }[size];

  if (mutirao) {
    return (
      <span
        title="Animal atendido e cadastrado no Mutirão Oficial de Castração de Itaiópolis"
        className={`inline-flex items-center rounded-xl bg-amber-50 text-amber-950 border-2 border-amber-300/80 shadow-2xs font-bold shrink-0 ${sizeClasses} ${className}`}
      >
        <span className="text-base select-none leading-none">🏛️</span>
        <span className="leading-tight">Registro Anterior (Mutirão)</span>
      </span>
    );
  }

  return (
    <span
      title="Animal cadastrado diretamente pelo munícipe no portal digital ItaPet"
      className={`inline-flex items-center rounded-xl bg-emerald-50 text-emerald-950 border-2 border-emerald-300/80 shadow-2xs font-bold shrink-0 ${sizeClasses} ${className}`}
    >
      <span className="text-base select-none leading-none">📱</span>
      <span className="leading-tight">Cadastro Digital</span>
    </span>
  );
};
