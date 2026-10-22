import React, { useState } from 'react';
import { Search, X, QrCode, AlertCircle, CheckCircle2, PawPrint, Camera } from 'lucide-react';
import { searchPetByMicrochip, searchPetsByCpf } from '../services/petService';
import { PetRegistration } from '../types';
import { ItaiopolisCoatOfArms } from './ItaiopolisCoatOfArms';
import { BarcodeScannerModal } from './BarcodeScannerModal';
import { PetCategoryBadge } from './PetCategoryBadge';
import { getPetAvatarEmoji } from '../utils/petEmoji';

interface PublicSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPet: (pet: PetRegistration) => void;
  initialChip?: string;
}

export const PublicSearchModal: React.FC<PublicSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectPet,
  initialChip = ''
}) => {
  const [queryTerm, setQueryTerm] = useState(initialChip);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [results, setResults] = useState<PetRegistration[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  if (!isOpen) return null;

  const executeSearchWithTerm = async (term: string) => {
    const clean = term.trim();
    if (!clean) return;

    setLoading(true);
    setSearched(true);
    try {
      const cleanDigits = clean.replace(/\D/g, '');

      // 1. Se tiver 11 dígitos, tenta buscar por CPF primeiro
      if (cleanDigits.length === 11) {
        const cpfResults = await searchPetsByCpf(cleanDigits);
        if (cpfResults.length > 0) {
          setResults(cpfResults);
          return;
        }
      }

      // 2. Tenta buscar por Microchip
      const pet = await searchPetByMicrochip(clean);
      if (pet) {
        setResults([pet]);
      } else {
        // 3. Fallback: tenta buscar por CPF
        const cpfResults = await searchPetsByCpf(clean);
        setResults(cpfResults);
      }
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    executeSearchWithTerm(queryTerm);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-lg bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header Oficial com Logos Separados */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#0B4F8A] to-[#15803D] text-white">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 shrink-0">
              <div className="h-10 w-10 rounded-2xl bg-white p-1 shadow-md flex items-center justify-center">
                <img src="/brasao_itaiopolis.png" alt="Brasão de Itaiópolis" className="h-full w-auto object-contain" />
              </div>
              <div className="h-10 w-10 rounded-2xl bg-white p-1 shadow-md flex items-center justify-center">
                <img src="/logo.png" alt="ItaPet" className="h-full w-full object-contain" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">Consultar Registro Animal 🔍</h3>
              <p className="text-xs text-emerald-100">Consulta Oficial por Microchip ou CPF • Itaiópolis - SC</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
          <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
            Encontrou um cão ou gato ou quer consultar a carteirinha do seu pet? Digite o <strong>número do microchip</strong> ou o <strong>CPF do tutor</strong>:
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <QrCode className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B4F8A]" />
              <input
                type="text"
                placeholder="Ex: 900263003760121 ou 000.000.000-00"
                value={queryTerm}
                onChange={(e) => setQueryTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 min-h-[44px] rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#0B4F8A] focus:ring-2 focus:ring-blue-500/10 outline-none font-mono text-xs sm:text-sm tracking-wider text-slate-900 font-bold shadow-xs transition-all"
              />
            </div>
            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="px-4 py-3 min-h-[44px] rounded-xl font-bold text-xs sm:text-sm text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors shrink-0 flex items-center justify-center gap-1.5 shadow-2xs"
              title="Escanear com a câmera"
            >
              <Camera className="w-4 h-4 text-emerald-700" />
              <span className="hidden sm:inline">Câmera</span>
            </button>
            <button
              type="submit"
              disabled={loading || !queryTerm.trim()}
              className="px-6 py-3 min-h-[44px] rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 transition-all shadow-xs shrink-0 flex items-center justify-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Buscando...' : 'Consultar'}</span>
            </button>
          </form>

          {/* Dica com chip oficial real */}
          <div className="p-3.5 rounded-2xl bg-[#EAF7EE] border-2 border-emerald-200 text-xs font-bold text-stone-700 flex items-center justify-between shadow-xs">
            <span>Exemplo de Microchip Oficial (Murisca): <strong className="font-mono font-black text-[#0D6838]">900263003760121</strong></span>
            <button
              type="button"
              onClick={() => { setQueryTerm('900263003760121'); }}
              className="text-[#0D6838] font-black hover:underline px-2 py-1"
            >
              Consultar
            </button>
          </div>

          {/* Resultados */}
          {searched && (
            <div className="space-y-3">
              {results.length > 0 ? (
                <>
                  <div className="flex items-center gap-2 text-[#0D6838] font-black text-sm">
                    <CheckCircle2 className="w-5 h-5 text-[#0D6838] shrink-0" />
                    <span>{results.length} {results.length === 1 ? 'Animal Encontrado' : 'Animais Encontrados'} no Sistema Municipal! 🐾</span>
                  </div>

                  {results.map((pet) => (
                    <div key={pet.id} className="p-5 rounded-3xl bg-white border-2 border-[#0D6838] shadow-sm space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2 pb-1 border-b border-stone-100">
                        <span className="text-2xl select-none">{getPetAvatarEmoji(pet)}</span>
                        <PetCategoryBadge pet={pet} size="sm" />
                      </div>

                      <div className="space-y-2 text-xs text-stone-700 font-medium bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-200">
                        <p><strong>Nome:</strong> <span className="text-stone-900 text-sm font-black">{pet.nomeAnimal}</span> ({pet.especie} - {pet.raca})</p>
                        <p><strong>Tutor:</strong> <span className="text-stone-900 font-bold">{pet.nomeTutor || 'Não informado'}</span></p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <strong>Microchip:</strong>
                          <span className="font-mono font-black text-emerald-950 bg-white px-2.5 py-1 rounded-xl border border-emerald-300 shadow-2xs select-all inline-block">
                            {pet.microchip || 'Pendente de Implantação'}
                          </span>
                        </div>
                        <p><strong>Status:</strong> <span className="font-black text-[#0D6838]">Oficialmente Registrado na Prefeitura de Itaiópolis</span></p>
                        {pet.vacinas && pet.vacinas.length > 0 && (
                          <p className="text-xs text-emerald-800 font-bold flex items-center gap-1">
                            <span>💉 {pet.vacinas.length} {pet.vacinas.length === 1 ? 'vacina/procedimento registrado' : 'vacinas/procedimentos registrados'}</span>
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          onClose();
                          onSelectPet(pet);
                        }}
                        className="w-full py-3.5 min-h-[44px] rounded-2xl font-black text-xs sm:text-sm text-white bg-[#0D6838] hover:bg-[#16874E] border-b-4 border-[#084725] active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 shadow-xs"
                      >
                        <PawPrint className="w-4 h-4" />
                        <span>Abrir Carteira de Identificação Animal ({pet.nomeAnimal}) ✨</span>
                      </button>
                    </div>
                  ))}
                </>
              ) : (
                <div className="p-4 rounded-3xl bg-amber-50 border-2 border-amber-300 text-amber-950 text-xs font-bold flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-black">Nenhum registro encontrado para este termo.</p>
                    <p className="text-xs text-amber-800/80 mt-1 font-semibold">
                      Certifique-se de que o microchip ou CPF digitado está correto ou procure a Secretaria Municipal de Meio Ambiente de Itaiópolis.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      <BarcodeScannerModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onScanSuccess={(code) => {
          setQueryTerm(code);
          executeSearchWithTerm(code);
        }}
      />
    </div>
  );
};
