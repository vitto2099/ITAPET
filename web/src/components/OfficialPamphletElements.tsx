import React from 'react';
import { ITAPET_COLORS, ITAPET_COPY } from '../constants/designTokens';
import { Heart, Sparkles, ShieldCheck } from 'lucide-react';

/**
 * 🐶 Mascote Oficial: Cãozinho Simpático com Bandana/Coleira Laranja
 */
export const MascotDog: React.FC<{ className?: string; size?: number }> = ({ 
  className = '', 
  size = 80 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
      aria-label="Cachorrinho Mascote Oficial ItaPet"
    >
      {/* Orelhas */}
      <ellipse cx="26" cy="48" rx="14" ry="24" transform="rotate(-15 26 48)" fill="#D97706" />
      <ellipse cx="94" cy="48" rx="14" ry="24" transform="rotate(15 94 48)" fill="#D97706" />
      <ellipse cx="27" cy="49" rx="8" ry="16" transform="rotate(-15 27 49)" fill="#F59E0B" />
      <ellipse cx="93" cy="49" rx="8" ry="16" transform="rotate(15 93 49)" fill="#F59E0B" />

      {/* Cabeça */}
      <circle cx="60" cy="54" r="38" fill="#FBBF24" />
      
      {/* Mancha Caramelo no Olho Direito */}
      <ellipse cx="72" cy="48" rx="14" ry="16" fill="#F59E0B" opacity="0.6" />

      {/* Focinho Branco */}
      <ellipse cx="60" cy="64" rx="20" ry="16" fill="#FFFFFF" />

      {/* Nariz */}
      <ellipse cx="60" cy="56" rx="7" ry="5" fill="#132E27" />

      {/* Olhos Brilhantes */}
      <circle cx="45" cy="48" r="5" fill="#132E27" />
      <circle cx="43" cy="46" r="2" fill="#FFFFFF" />
      <circle cx="75" cy="48" r="5" fill="#132E27" />
      <circle cx="73" cy="46" r="2" fill="#FFFFFF" />

      {/* Sorriso e Língua Feliz */}
      <path d="M54 63 Q60 68 66 63" stroke="#132E27" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M57 65 C57 73 63 73 63 65" fill="#EF4444" />

      {/* Bochechinhas Rosadas */}
      <circle cx="38" cy="58" r="4" fill="#F87171" opacity="0.4" />
      <circle cx="82" cy="58" r="4" fill="#F87171" opacity="0.4" />

      {/* Bandana / Coleira Laranja do Panfleto */}
      <path d="M30 84 C30 84 60 98 90 84 C84 96 60 114 60 114 C60 114 36 96 30 84 Z" fill="#EA580C" />
      <path d="M30 84 C45 92 75 92 90 84" stroke="#C2410C" strokeWidth="3" />
      <circle cx="60" cy="98" r="4" fill="#F9C72C" />
    </svg>
  );
};

/**
 * 🐱 Mascote Oficial: Gatinho Amarelo/Laranja Sorridente
 */
export const MascotCat: React.FC<{ className?: string; size?: number }> = ({ 
  className = '', 
  size = 80 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 120 120" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
      aria-label="Gatinho Mascote Oficial ItaPet"
    >
      {/* Orelhas Pontudas */}
      <polygon points="24,42 42,12 52,38" fill="#F59E0B" />
      <polygon points="28,39 42,18 48,36" fill="#F87171" opacity="0.6" />

      <polygon points="96,42 78,12 68,38" fill="#F59E0B" />
      <polygon points="92,39 78,18 72,36" fill="#F87171" opacity="0.6" />

      {/* Cabeça */}
      <circle cx="60" cy="56" r="36" fill="#FCD34D" />

      {/* Focinho */}
      <ellipse cx="60" cy="65" rx="16" ry="12" fill="#FFFFFF" />
      <polygon points="56,60 64,60 60,64" fill="#F43F5E" />

      {/* Olhos Sorridentes em Curva */}
      <path d="M42 50 Q48 44 54 50" stroke="#132E27" strokeWidth="3" strokeLinecap="round" />
      <path d="M66 50 Q72 44 78 50" stroke="#132E27" strokeWidth="3" strokeLinecap="round" />

      {/* Bigodinhos */}
      <line x1="30" y1="62" x2="16" y2="60" stroke="#132E27" strokeWidth="2" strokeLinecap="round" />
      <line x1="30" y1="66" x2="18" y2="68" stroke="#132E27" strokeWidth="2" strokeLinecap="round" />
      <line x1="90" y1="62" x2="104" y2="60" stroke="#132E27" strokeWidth="2" strokeLinecap="round" />
      <line x1="90" y1="66" x2="102" y2="68" stroke="#132E27" strokeWidth="2" strokeLinecap="round" />

      {/* Sorriso */}
      <path d="M55 67 Q60 71 65 67" stroke="#132E27" strokeWidth="2.5" strokeLinecap="round" />

      {/* Bochechinhas */}
      <circle cx="36" cy="60" r="4" fill="#FB7185" opacity="0.5" />
      <circle cx="84" cy="60" r="4" fill="#FB7185" opacity="0.5" />

      {/* Patinhas Apoio */}
      <circle cx="46" cy="92" r="9" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2" />
      <circle cx="74" cy="92" r="9" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="2" />
    </svg>
  );
};

/**
 * 🐾 Dupla de Mascotes do Panfleto
 */
export const MascotsDuo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`flex items-end justify-center gap-2 select-none ${className}`}>
      <div className="transform -rotate-6 hover:rotate-0 transition-transform">
        <MascotDog size={90} />
      </div>
      <div className="transform rotate-6 hover:rotate-0 transition-transform">
        <MascotCat size={85} />
      </div>
    </div>
  );
};

/**
 * 1️⃣2️⃣3️⃣4️⃣ Badges Circulares de Passos (Verde Floresta com Borda Amarela)
 */
export const CircularStepBadge: React.FC<{
  number: number | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ number, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm border-2',
    md: 'w-11 h-11 text-lg border-3',
    lg: 'w-14 h-14 text-2xl border-4',
  }[size];

  return (
    <div
      className={`rounded-full bg-[#0D6838] border-[#F9C72C] text-white flex items-center justify-center font-black shadow-md shadow-[#0D6838]/30 shrink-0 ${sizeClasses} ${className}`}
      style={{ fontFamily: "'Fredoka', 'Nunito', system-ui, sans-serif" }}
    >
      {number}
    </div>
  );
};

/**
 * 💬 Pílula / Balão Oficial do Panfleto: "Seu pet identificado é mais seguro! ♡"
 */
export const SafePetPill: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border-2 border-[#BAE6FD] text-[#0369A1] font-bold text-xs sm:text-sm shadow-sm backdrop-blur-xs ${className}`}
    >
      <span>{ITAPET_COPY.safePetPill}</span>
      <Heart className="w-3.5 h-3.5 fill-[#EF4444] text-[#EF4444] inline animate-pulse" />
    </div>
  );
};

/**
 * 🎀 Faixa Dourada do SinPatinhas
 */
export const SinPatinhasRibbon: React.FC<{ text?: string; className?: string }> = ({
  text = ITAPET_COPY.pamphletSubtitle,
  className = '',
}) => {
  return (
    <div
      className={`inline-block px-6 py-2 rounded-2xl bg-gradient-to-r from-[#F9C72C] via-[#FFC107] to-[#F9C72C] text-[#132E27] font-black tracking-wider text-xs sm:text-sm uppercase shadow-md border-2 border-[#E0AC00] ${className}`}
      style={{ fontFamily: "'Fredoka', 'Nunito', system-ui, sans-serif" }}
    >
      {text}
    </div>
  );
};

/**
 * 🏛️ Rodapé Oficial com Assinatura do Panfleto
 */
export const MunicipalOfficialFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#0D6838] text-white border-t-4 border-[#084725] py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Identificação Oficial da Prefeitura */}
        <div className="flex items-center gap-3.5 text-center md:text-left">
          <div className="w-12 h-12 rounded-2xl bg-[#F9C72C] text-[#0D6838] flex items-center justify-center font-black text-xl shadow-inner shrink-0">
            🐾
          </div>
          <div>
            <h4 className="font-black text-sm tracking-wide text-white uppercase">
              {ITAPET_COPY.municipalDepartment}
            </h4>
            <p className="text-xs text-[#EAF7EE] font-medium">
              {ITAPET_COPY.cityHall}
            </p>
          </div>
        </div>

        {/* Assinatura Oficial do Panfleto */}
        <div className="text-center md:text-right space-y-1">
          <p 
            className="text-xs sm:text-sm font-extrabold text-[#F9C72C] tracking-wide"
            style={{ fontFamily: "'Fredoka', 'Nunito', system-ui, sans-serif" }}
          >
            "{ITAPET_COPY.signatureFooter}"
          </p>
          <p className="text-xs text-white/90">
            ItaPet • Sistema Integrado com o SinPatinhas (Ministério do Meio Ambiente)
          </p>
        </div>

      </div>
    </footer>
  );
};
