import React, { useState } from 'react';
import { Heart, PawPrint, ShieldCheck, Check, Sparkles, MessageCircle } from 'lucide-react';

interface AdoptablePet {
  id: string;
  nome: string;
  especie: 'Canino' | 'Felino';
  sexo: 'Macho' | 'Fêmea';
  idade: string;
  porte: string;
  descricao: string;
  fotoUrl: string;
  castrado: boolean;
  vacinado: boolean;
  microchip: string;
}

const PETS_ADOCAO: AdoptablePet[] = [
  {
    id: 'adote_01',
    nome: 'Paçoca',
    especie: 'Canino',
    sexo: 'Macho',
    idade: '1 ano',
    porte: 'Médio',
    descricao: 'Dócil, brincalhão e convive muito bem com crianças e outros cães. Resgatado no bairro Lucena.',
    fotoUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
    castrado: true,
    vacinado: true,
    microchip: '900263005412592'
  },
  {
    id: 'adote_02',
    nome: 'Amora',
    especie: 'Felino',
    sexo: 'Fêmea',
    idade: '8 meses',
    porte: 'Pequeno',
    descricao: 'Calma, carinhosa e acostumada a ficar dentro de casa. Já vermifugada e castrada pelo mutirão.',
    fotoUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&auto=format&fit=crop&q=80',
    castrado: true,
    vacinado: true,
    microchip: '900263003760331'
  },
  {
    id: 'adote_03',
    nome: 'Thor',
    especie: 'Canino',
    sexo: 'Macho',
    idade: '2 anos',
    porte: 'Grande',
    descricao: 'Excelente companheiro e protetor da casa. Precisa de espaço para correr. Muito fiel e dócil.',
    fotoUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop&q=80',
    castrado: true,
    vacinado: true,
    microchip: '900263005452882'
  }
];

export const AdoptionGallery: React.FC = () => {
  const [filtroEspecie, setFiltroEspecie] = useState<'Todos' | 'Canino' | 'Felino'>('Todos');

  const petsFiltrados = PETS_ADOCAO.filter(p => 
    filtroEspecie === 'Todos' || p.especie === filtroEspecie
  );

  const handleAdoptClick = (pet: AdoptablePet) => {
    const text = encodeURIComponent(
      `Olá! Tenho interesse em adotar o animal ${pet.nome} (${pet.especie}, microchip ${pet.microchip}) divulgado no ItaPet Oficial da Prefeitura de Itaiópolis.`
    );
    window.open(`https://wa.me/554736522211?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6 py-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-900 via-pink-900 to-slate-900 text-white shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-400/30">
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Feira de Adoção Responsável</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">Adote um Amigo em Itaiópolis 🐾</h2>
          <p className="text-xs sm:text-sm text-rose-200">
            Todos os animais resgatados são entregues com microchip, castração e vacinação em dia pela Prefeitura.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 p-1 rounded-2xl backdrop-blur-xs border border-white/15">
          {(['Todos', 'Canino', 'Felino'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFiltroEspecie(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filtroEspecie === f
                  ? 'bg-white text-rose-950 shadow-xs'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {f === 'Todos' ? 'Todos' : f === 'Canino' ? '🐶 Cães' : '🐱 Gatos'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {petsFiltrados.map((pet) => (
          <div 
            key={pet.id} 
            className="group rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div>
              {/* Foto com Badges */}
              <div className="relative h-56 overflow-hidden bg-slate-100">
                <img 
                  src={pet.fotoUrl} 
                  alt={pet.nome} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold bg-white/95 text-slate-800 shadow-xs">
                  {pet.especie === 'Canino' ? '🐶 Cão' : '🐱 Gato'} • {pet.sexo}
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs">
                  ✓ Castrado & Microchipado
                </span>
              </div>

              {/* Detalhes */}
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900">{pet.nome}</h3>
                  <span className="text-xs font-semibold text-slate-500">{pet.idade}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {pet.descricao}
                </p>

                <div className="flex items-center gap-2 pt-2 text-xs text-slate-600 border-t border-slate-100 flex-wrap">
                  <span className="font-mono font-black text-emerald-950 bg-stone-100 px-2 py-0.5 rounded-lg border border-emerald-200 select-all">MC: {pet.microchip}</span>
                  <span>•</span>
                  <span className="font-bold">Porte: {pet.porte}</span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                onClick={() => handleAdoptClick(pet)}
                className="w-full py-3.5 min-h-[44px] rounded-2xl font-bold text-xs sm:text-sm text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Quero Adotar ({pet.nome})
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
