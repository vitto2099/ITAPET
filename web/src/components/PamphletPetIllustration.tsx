import React from 'react';

interface PamphletPetIllustrationProps {
  className?: string;
}

export const PamphletPetIllustration: React.FC<PamphletPetIllustrationProps> = ({ 
  className = "w-64 h-64" 
}) => {
  return (
    <svg
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Ilustração oficial de cão e gato amigáveis do panfleto SinPatinhas / ItaPet"
    >
      <defs>
        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FEF9C3" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FAF8F5" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Brilho Solar Suave de Fundo */}
      <circle cx="160" cy="140" r="130" fill="url(#sunGlow)" />

      {/* Corações Flutuantes */}
      <g className="animate-float">
        <path
          d="M70 70 C70 60 85 55 92 68 C100 55 114 60 114 70 C114 85 92 98 92 98 C92 98 70 85 70 70 Z"
          fill="#F43F5E"
          opacity="0.85"
        />
        <path
          d="M235 50 C235 42 247 38 252 48 C258 38 270 42 270 50 C270 62 252 72 252 72 C252 72 235 62 235 50 Z"
          fill="#FB7185"
          opacity="0.9"
        />
        <path
          d="M152 25 C152 18 162 14 167 23 C172 14 182 18 182 25 C182 35 167 44 167 44 C167 44 152 35 152 25 Z"
          fill="#F43F5E"
          opacity="0.75"
        />
      </g>

      {/* ================= GATINHO (Lado Direito) ================= */}
      <g id="gatinho">
        {/* Corpo do Gatinho */}
        <path
          d="M175 160 C175 120 255 120 255 160 V240 H175 Z"
          fill="#1E293B"
          stroke="#0F172A"
          strokeWidth="3.5"
        />

        {/* Orelhas do Gatinho */}
        <path
          d="M178 120 L195 72 L215 110 Z"
          fill="#1E293B"
          stroke="#0F172A"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path d="M185 112 L196 84 L208 108 Z" fill="#FDA4AF" />

        <path
          d="M225 110 L248 72 L262 120 Z"
          fill="#1E293B"
          stroke="#0F172A"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path d="M232 108 L246 84 L255 112 Z" fill="#FDA4AF" />

        {/* Cabeça do Gato */}
        <ellipse
          cx="220"
          cy="135"
          rx="44"
          ry="38"
          fill="#334155"
          stroke="#0F172A"
          strokeWidth="3.5"
        />

        {/* Bochechas brancas do gato */}
        <ellipse cx="206" cy="148" rx="14" ry="10" fill="#F8FAFC" />
        <ellipse cx="234" cy="148" rx="14" ry="10" fill="#F8FAFC" />

        {/* Olhos do Gatinho (Grandes e Brilhantes) */}
        <circle cx="205" cy="130" r="7.5" fill="#0F172A" />
        <circle cx="203" cy="128" r="2.5" fill="#FFFFFF" />
        <circle cx="235" cy="130" r="7.5" fill="#0F172A" />
        <circle cx="233" cy="128" r="2.5" fill="#FFFFFF" />

        {/* Focinho e Boca */}
        <polygon points="220,142 216,138 224,138" fill="#FB7185" />
        <path
          d="M216 145 C218 149 220 149 220 145 C220 149 224 149 226 145"
          stroke="#0F172A"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Bigodes do Gato */}
        <path d="M185 142 L165 138 M184 147 L162 148 M185 152 L166 156" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        <path d="M255 142 L275 138 M256 147 L278 148 M255 152 L274 156" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />

        {/* Coleira Azul do Gato com Medalha QR */}
        <path d="M190 170 Q220 178 250 170" stroke="#0284C7" strokeWidth="8" strokeLinecap="round" />
        <circle cx="220" cy="180" r="7" fill="#F9C72C" stroke="#D97706" strokeWidth="2" />
        <rect x="217.5" y="177.5" width="5" height="5" fill="#1C1917" rx="0.5" />
      </g>

      {/* ================= CACHORRINHO (Lado Esquerdo) ================= */}
      <g id="cachorrinho">
        {/* Corpo do Cãozinho */}
        <path
          d="M75 155 C75 110 170 110 170 155 V240 H75 Z"
          fill="#D97706"
          stroke="#78350F"
          strokeWidth="3.5"
        />

        {/* Peito Claro */}
        <path d="M100 170 C100 140 145 140 145 170 V240 H100 Z" fill="#FEF3C7" />

        {/* Orelhas Caídas Fofinhas */}
        <ellipse
          cx="80"
          cy="125"
          rx="16"
          ry="32"
          transform="rotate(18 80 125)"
          fill="#B45309"
          stroke="#78350F"
          strokeWidth="3.5"
        />
        <ellipse
          cx="165"
          cy="125"
          rx="16"
          ry="32"
          transform="rotate(-18 165 125)"
          fill="#B45309"
          stroke="#78350F"
          strokeWidth="3.5"
        />

        {/* Cabeça do Cachorrinho */}
        <ellipse
          cx="122"
          cy="125"
          rx="45"
          ry="40"
          fill="#F59E0B"
          stroke="#78350F"
          strokeWidth="3.5"
        />

        {/* Focinho Claro */}
        <ellipse cx="122" cy="140" rx="22" ry="16" fill="#FEF3C7" stroke="#78350F" strokeWidth="2" />

        {/* Nariz Grandinho Preto */}
        <path d="M114 133 C114 130 130 130 130 133 C130 139 122 143 122 143 C122 143 114 139 114 133 Z" fill="#1C1917" />
        <ellipse cx="118" cy="133" rx="2" ry="1.5" fill="#FFFFFF" />

        {/* Boquinha Feliz / Linguinha */}
        <path
          d="M116 143 C118 147 122 147 122 143 C122 147 126 147 128 143"
          stroke="#78350F"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path d="M120 146 Q122 153 124 146 Z" fill="#F43F5E" />

        {/* Olhos do Cachorrinho */}
        <circle cx="104" cy="118" r="8" fill="#1C1917" />
        <circle cx="102" cy="116" r="2.8" fill="#FFFFFF" />
        <circle cx="106" cy="121" r="1.2" fill="#FFFFFF" />

        <circle cx="140" cy="118" r="8" fill="#1C1917" />
        <circle cx="138" cy="116" r="2.8" fill="#FFFFFF" />
        <circle cx="142" cy="121" r="1.2" fill="#FFFFFF" />

        {/* Sobrancelhas Amigáveis */}
        <path d="M96 106 Q104 102 110 106" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M134 106 Q140 102 148 106" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />

        {/* Bochechinhas Rosadas */}
        <ellipse cx="94" cy="132" rx="7" ry="4" fill="#F87171" opacity="0.45" />
        <ellipse cx="150" cy="132" rx="7" ry="4" fill="#F87171" opacity="0.45" />

        {/* Coleira Verde Floresta Oficial */}
        <path d="M90 162 Q122 172 154 162" stroke="#0D6838" strokeWidth="9" strokeLinecap="round" />
        <circle cx="122" cy="173" r="8" fill="#F9C72C" stroke="#C69205" strokeWidth="2" />
        {/* Ícone de Microchip na Medalha */}
        <rect x="119" y="170" width="6" height="6" fill="#0D6838" rx="1" />
      </g>

      {/* Pata Amiga que o Cachorrinho abraça o Gatinho */}
      <ellipse
        cx="168"
        cy="176"
        rx="14"
        ry="9"
        transform="rotate(15 168 176)"
        fill="#F59E0B"
        stroke="#78350F"
        strokeWidth="2.5"
      />
      <circle cx="164" cy="174" r="2" fill="#78350F" />
      <circle cx="168" cy="173" r="2" fill="#78350F" />
      <circle cx="172" cy="174" r="2" fill="#78350F" />

      {/* Graminha decorativa na base */}
      <g stroke="#0D6838" strokeWidth="3" strokeLinecap="round">
        <path d="M50 240 Q55 228 62 240" />
        <path d="M58 240 Q64 224 70 240" />
        <path d="M260 240 Q266 226 272 240" />
        <path d="M270 240 Q276 230 282 240" />
      </g>
    </svg>
  );
};
