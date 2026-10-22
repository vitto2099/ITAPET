import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BAIRROS_ITAIOPOLIS } from '../constants/bairros';
import { createCastrationRequest } from '../services/petService';
import { X, CheckCircle2, ShieldCheck, Heart } from 'lucide-react';
import { ItaiopolisCoatOfArms } from './ItaiopolisCoatOfArms';

interface CastrationRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (ticketNumber: string) => void;
}

export const CastrationRequestModal: React.FC<CastrationRequestModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user, userData } = useAuth();
  const [nomeAnimal, setNomeAnimal] = useState('');
  const [especie, setEspecie] = useState<'Canino' | 'Felino'>('Canino');
  const [sexo, setSexo] = useState<'Fêmea' | 'Macho'>('Fêmea');
  const [pesoAprox, setPesoAprox] = useState('');
  const [bairro, setBairro] = useState(BAIRROS_ITAIOPOLIS[0]);
  const [nis, setNis] = useState('');
  const [telefone, setTelefone] = useState(userData?.telefone || '');
  const [nomeTutor, setNomeTutor] = useState(userData?.nome || '');
  const [enviando, setEnviando] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!nomeAnimal.trim()) {
      setErrorMsg("Por favor, informe o nome do animal.");
      return;
    }

    if (!telefone.trim() || telefone.replace(/\D/g, '').length < 8) {
      setErrorMsg("Por favor, informe um número de WhatsApp válido para contato.");
      return;
    }

    setEnviando(true);
    try {
      const generatedTicket = await createCastrationRequest({
        nomeAnimal: nomeAnimal.trim(),
        especie,
        sexo,
        pesoAprox: pesoAprox.trim() || undefined,
        bairro,
        nis: nis.trim() || undefined,
        telefone: telefone.trim(),
        nomeTutor: nomeTutor.trim() || userData?.nome || 'Munícipe Responsável',
        cpfTutor: userData?.cpf || '',
        userId: user?.uid
      });
      onSuccess(generatedTicket);
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Ocorreu um erro ao enviar a solicitação. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-lg bg-white text-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
        
        {/* Header Oficial com Logos Separados */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#0B4F8A] to-[#15803D] text-white">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 shrink-0">
              <div className="h-10 w-10 rounded-2xl bg-white p-1 shadow-md flex items-center justify-center">
                <img src="/brasao_itaiopolis.png" alt="Brasão de Itaiópolis" className="h-full w-auto object-contain" />
              </div>
              <div className="h-10 w-10 rounded-2xl bg-white p-1 shadow-md flex items-center justify-center">
                <img src="/logo.png" alt="ItaPet Itaiópolis" className="h-full w-full object-contain" />
              </div>
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">Solicitação de Castração Municipal</h3>
              <p className="text-xs text-emerald-100">Controle Populacional • Prefeitura de Itaiópolis - SC</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
          
          <div className="p-3.5 rounded-2xl bg-emerald-100/90 border-2 border-emerald-300 text-xs text-emerald-950 font-bold leading-relaxed flex items-start gap-2.5 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              A castração e a microchipagem são procedimentos <strong>100% gratuitos</strong> ofertados pela Prefeitura de Itaiópolis aos munícipes cadastrados! 🐾
            </span>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-800 text-xs font-bold">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-stone-700 uppercase mb-1.5">Nome do Bichinho *</label>
            <input
              type="text"
              required
              placeholder="Ex: Princesa, Thor, Belinha, Pipoca..."
              value={nomeAnimal}
              onChange={(e) => setNomeAnimal(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-stone-200 text-stone-800 placeholder-stone-400 text-xs font-bold focus:border-amber-400 focus:bg-amber-50/20 outline-hidden transition-all shadow-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase mb-1.5">Espécie</label>
              <select
                value={especie}
                onChange={(e) => setEspecie(e.target.value as any)}
                className="w-full px-3 py-3 rounded-2xl bg-white border-2 border-stone-200 text-stone-800 text-xs font-bold focus:border-amber-400 outline-hidden transition-all shadow-xs"
              >
                <option value="Canino">🐶🐕 Cachorro (Cão)</option>
                <option value="Felino">🐱🐈 Gatinho (Gato)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-stone-700 uppercase mb-1.5">Sexo</label>
              <select
                value={sexo}
                onChange={(e) => setSexo(e.target.value as any)}
                className="w-full px-3 py-3 rounded-2xl bg-white border-2 border-stone-200 text-stone-800 text-xs font-bold focus:border-amber-400 outline-hidden transition-all shadow-xs"
              >
                <option value="Fêmea">♀️ Fêmea (Menina)</option>
                <option value="Macho">♂️ Macho (Menino)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase mb-1.5">Peso Estimado (kg)</label>
              <input
                type="text"
                placeholder="Ex: 5.5"
                value={pesoAprox}
                onChange={(e) => setPesoAprox(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-stone-200 text-stone-800 placeholder-stone-400 text-xs font-bold outline-hidden focus:border-amber-400 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-stone-700 uppercase mb-1.5">WhatsApp para Contato *</label>
              <input
                type="text"
                required
                placeholder="(47) 99999-9999"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-stone-200 text-stone-800 placeholder-stone-400 text-xs font-bold outline-hidden focus:border-amber-400 shadow-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-stone-700 uppercase mb-1.5">Nome do Tutor / Responsável *</label>
            <input
              type="text"
              required
              placeholder="Seu nome completo"
              value={nomeTutor}
              onChange={(e) => setNomeTutor(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-stone-200 text-stone-800 placeholder-stone-400 text-xs font-bold focus:border-amber-400 outline-hidden shadow-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-stone-700 uppercase mb-1.5">Bairro em Itaiópolis *</label>
            <select
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-stone-200 text-stone-800 text-xs font-bold focus:border-amber-400 outline-hidden shadow-xs"
            >
              {BAIRROS_ITAIOPOLIS.map(b => (
                <option key={b} value={b}>📍 {b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-stone-700 uppercase mb-1.5">
              Número do NIS / CadÚnico (Opcional para prioridade)
            </label>
            <input
              type="text"
              placeholder="Ex: 12345678900"
              value={nis}
              onChange={(e) => setNis(e.target.value)}
              className="w-full px-4 py-3 min-h-[44px] rounded-2xl bg-white border-2 border-stone-200 text-stone-800 placeholder-stone-400 text-xs sm:text-sm font-bold outline-hidden focus:border-amber-400 shadow-xs"
            />
            <p className="text-xs font-bold text-stone-500 mt-1">💡 Famílias cadastradas no CadÚnico têm atendimento prioritário no mutirão.</p>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t-2 border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 min-h-[44px] rounded-2xl text-xs font-black text-stone-600 hover:text-stone-900 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="px-6 py-3 min-h-[44px] rounded-2xl text-xs sm:text-sm font-black text-[#1C1917] bg-[#F9C72C] hover:bg-[#F8BE12] border-b-4 border-[#C69205] active:border-b-0 active:translate-y-1 shadow-md transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {enviando ? 'Enviando Solicitação...' : 'Confirmar Solicitação 🐾'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
