import React from 'react';

interface CoatOfArmsProps {
  className?: string;
  size?: number;
}

export const ItaiopolisCoatOfArms: React.FC<CoatOfArmsProps> = ({ 
  className = "w-10 h-auto", 
  size = 40 
}) => {
  return (
    <img
      src="/brasao_itaiopolis.png"
      alt="Brasão Oficial do Município de Itaiópolis - SC"
      className={`object-contain shrink-0 drop-shadow-xs ${className}`}
      style={{ width: size, height: 'auto', maxHeight: Math.round(size * 1.3) }}
      loading="lazy"
    />
  );
};
