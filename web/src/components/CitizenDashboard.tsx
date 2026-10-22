import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserPets, getHistoricalPets, fetchUserCastrationRequests } from '../services/petService';
import { PetRegistration, CastrationRequest } from '../types';
import { 
  PlusCircle, 
  PawPrint, 
  QrCode, 
  CheckCircle2, 
  Clock, 
  Search, 
  MapPin, 
  Sparkles, 
  Heart, 
  ArrowRight, 
  ShieldCheck, 
  Calendar, 
  X,
  Syringe,
  Flame
} from 'lucide-react';
import { ItaiopolisCoatOfArms } from './ItaiopolisCoatOfArms';
import { PetCategoryBadge } from './PetCategoryBadge';
import { getPetAvatarEmoji } from '../utils/petEmoji';

interface CitizenDashboardProps {
  onCadastrarNovo: () => void;
  onOpenPetCard: (pet: PetRegistration) => void;
}

export const CitizenDashboard: React.FC<CitizenDashboardProps> = ({
  onCadastrarNovo,
  onOpenPetCard
}) => {
  const { user, userData } = useAuth();
  const [pets, setPets] = useState<PetRegistration[]>([]);
  const [myCastrations, setMyCastrations] = useState<CastrationRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal de Reivindicação de Histórico
  const [showClaimModal, setShowClaimModal] = useState(false);
  const [claimSearch, setClaimSearch] = useState('');
  const [claimResults, setClaimResults] = useState<PetRegistration[]>([]);
  const [claiming, setClaiming] = useState(false);

  const loadPets = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [data, castrations] = await Promise.all([
        fetchUserPets(user.uid, userData?.cpf, userData?.nome),
        fetchUserCastrationRequests(user.uid, userData?.cpf)
      ]);
      setPets(data);
      setMyCastrations(castrations);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPets();
  }, [user, userData]);

  const handleSearchClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimSearch.trim()) return;

    setClaiming(true);
    try {
      const historical = await getHistoricalPets();
      const term = claimSearch.trim().toLowerCase();
      const matches = historical.filter(p => 
        (p.microchip || '').includes(term) ||
        p.nomeAnimal.toLowerCase().includes(term) ||
        p.nomeTutor.toLowerCase().includes(term)
      ).slice(0, 8);
      setClaimResults(matches);
    } finally {
      setClaiming(false);
    }
  };

  const handleClaimPet = (petId: string) => {
    if (!user) return;
    const key = `claimed_pets_${user.uid}`;
    const existing: string[] = JSON.parse(localStorage.getItem(key) || '[]');
    if (!existing.includes(petId)) {
      existing.push(petId);
      localStorage.setItem(key, JSON.stringify(existing));
    }
    if (userData?.cpf) {
      const clean = userData.cpf.replace(/\D/g, '');
      const cpfKey = `claimed_pets_cpf_${clean}`;
      const existingCpf: string[] = JSON.parse(localStorage.getItem(cpfKey) || '[]');
      if (!existingCpf.includes(petId)) {
        existingCpf.push(petId);
        localStorage.setItem(cpfKey, JSON.stringify(existingCpf));
      }
    }
    setShowClaimModal(false);
    setClaimSearch('');
    setClaimResults([]);
    loadPets();
  };

  const getEmoji = (petOrEspecie?: any) => {
    if (typeof petOrEspecie === 'object' && petOrEspecie !== null) {
      return getPetAvatarEmoji(petOrEspecie);
    }
    return getPetAvatarEmoji({ especie: petOrEspecie });
  };

  return (
    <div className="space-y-6 py-6 font-sans">
      
      {/* Banner Superior do Cidadão no Padrão Municipal */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B4F8A] via-[#094273] to-[#15803D] text-white p-6 sm:p-8 shadow-md border border-slate-200/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-emerald-200 text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>MEUS ANIMAIS • ÁREA DO CIDADÃO DE ITAIÓPOLIS</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Olá, {userData?.nome ? userData.nome.split(' ')[0] : 'Tutor'}! 🐶🐱
            </h1>
            
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl leading-relaxed font-normal">
              Aqui você visualiza <strong>exclusivamente os animais vinculados ao seu CPF</strong>. Ninguém mais tem acesso aos seus dados e você cuida da saúde e da carteirinha oficial deles.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1.5">
              <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-xs font-semibold text-white shadow-xs">
                🪪 CPF: {userData?.cpf || 'Cadastrado'}
              </span>
              <span className="px-3 py-1 rounded-lg bg-emerald-700/80 border border-emerald-500/60 text-xs font-bold text-white shadow-xs">
                🐾 {pets.length} {pets.length === 1 ? 'Animal Sob Seus Cuidados' : 'Animais Sob Seus Cuidados'}
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-xs font-semibold text-emerald-200 shadow-xs">
                🔒 Área Protegida LGPD
              </span>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={onCadastrarNovo}
              className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-700 hover:bg-emerald-800 shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Cadastrar Novo Animal</span>
            </button>

            <button
              onClick={() => setShowClaimModal(true)}
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-white/15 hover:bg-white/25 border border-white/25 shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-3.5 h-3.5 text-amber-300" />
              <span>Vincular do Mutirão (Histórico)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Minhas Solicitações de Castração & Mutirão */}
      {myCastrations.length > 0 && (
        <div className="p-6 rounded-[2.5rem] bg-white border-3 border-emerald-200/90 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center font-bold text-base shadow-xs">
                💉
              </div>
              <div>
                <h3 className="font-black text-stone-900 text-base">Minhas Solicitações de Castração & Mutirão</h3>
                <p className="text-xs font-bold text-stone-500">Programa Municipal Gratuito • Secretaria de Meio Ambiente</p>
              </div>
            </div>
            <span className="self-start sm:self-auto px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-black">
              {myCastrations.length} {myCastrations.length === 1 ? 'solicitação' : 'solicitações'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myCastrations.map(req => (
              <div key={req.id} className="p-4 rounded-2xl bg-[#FAF8F5] border-2 border-stone-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-stone-900 px-2 py-0.5 rounded-lg bg-white border border-stone-300">
                    {req.id}
                  </span>
                  {req.prioridadeCadUnico && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-300 text-stone-950 font-black text-xs">
                      <Flame className="w-3 h-3 text-amber-700" />
                      <span>CadÚnico Prioritário</span>
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-black text-stone-900 text-sm">{req.nomeAnimal}</h4>
                  <p className="text-xs text-stone-600 font-medium">
                    {req.especie} • {req.sexo} • {req.bairro}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
                  <span className="text-stone-500 font-bold">Status:</span>
                  {req.status === 'agendado' ? (
                    <span className="font-black text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full border border-teal-300">
                      📅 {req.dataAgendamento || 'Agendado'}
                    </span>
                  ) : req.status === 'concluido' ? (
                    <span className="font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                      ✓ Concluído
                    </span>
                  ) : req.status === 'aprovado' ? (
                    <span className="font-black text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-300">
                      ✓ Aprovado
                    </span>
                  ) : (
                    <span className="font-black text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                      ⏳ Em Análise
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid de Animais */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-black text-stone-900 flex items-center gap-2">
              <PawPrint className="w-5 h-5 text-[#0D6838]" />
              <span>Meus Animais Cadastrados</span>
            </h2>
            <p className="text-xs text-stone-500 font-bold">
              Carteiras Oficiais de Identificação Animal com QR Code emitidas pela Prefeitura
            </p>
          </div>
          <span className="text-xs font-black text-[#0D6838] bg-[#EAF7EE] px-3.5 py-1 rounded-full border border-emerald-300">
            {pets.length} {pets.length === 1 ? 'animal registrado' : 'animais registrados'}
          </span>
        </div>

        {loading ? (
          <div className="p-16 text-center text-stone-500 text-sm bg-white rounded-[2.5rem] border-2 border-stone-200 shadow-md">
            <div className="inline-block w-8 h-8 border-3 border-[#0D6838] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="font-black text-stone-800">Carregando seus animais...</p>
          </div>
        ) : pets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <div 
                key={pet.id}
                className="group relative rounded-[2.5rem] bg-white border-3 border-stone-200 hover:border-[#0D6838] shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                <div>
                  
                  {/* Foto de Capa do Card */}
                  <div className="relative h-48 bg-[#FAF8F5] overflow-hidden flex items-center justify-center border-b-2 border-stone-100">
                    {pet.fotoUrl || (pet.fotosPet && pet.fotosPet[0]) ? (
                      <img 
                        src={pet.fotoUrl || pet.fotosPet[0]} 
                        alt={pet.nomeAnimal} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4">
                        <span className="text-6xl drop-shadow-sm select-none group-hover:scale-110 transition-transform">
                          {getEmoji(pet)}
                        </span>
                        <span className="text-xs font-black text-[#0D6838] mt-2 bg-[#EAF7EE] border border-emerald-300 px-3 py-0.5 rounded-full shadow-xs">
                          {pet.especie}
                        </span>
                      </div>
                    )}

                    {/* Badge de Status Flutuante */}
                    <div className="absolute top-3 right-3">
                      {pet.status === 'concluido' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-black text-[#0D6838] bg-white border-2 border-[#0D6838] px-3 py-1 rounded-full shadow-md">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0D6838]" />
                          <span>Microchipado 🏅</span>
                        </span>
                      ) : pet.status === 'aprovado' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-black text-sky-950 bg-sky-100 border-2 border-sky-300 px-3 py-1 rounded-full shadow-md">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                          <span>Aprovado ✓</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-black text-amber-950 bg-[#FEF9C3] border-2 border-[#F9C72C] px-3 py-1 rounded-full shadow-md">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Em Validação ⏳</span>
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-2 left-3">
                      <span className="text-xs font-black text-stone-800 bg-white/95 border border-stone-200 backdrop-blur-md px-3 py-1 rounded-xl shadow-xs">
                        {pet.raca || 'SRD'} • {pet.sexo || 'Não informado'}
                      </span>
                    </div>
                  </div>

                  {/* Informações Textuais */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-black text-2xl text-stone-900 tracking-tight">{pet.nomeAnimal}</h3>
                      {pet.pesoKg && (
                        <span className="text-xs font-black text-stone-700 bg-stone-100 border border-stone-200 px-2.5 py-1 rounded-xl">
                          {pet.pesoKg} kg
                        </span>
                      )}
                    </div>

                    {/* Categoria Oficial do Animal */}
                    <div>
                      <PetCategoryBadge pet={pet} size="sm" />
                    </div>

                    <div className="p-3 rounded-2xl bg-[#FAF8F5] border-2 border-stone-200 space-y-1.5 text-xs font-bold">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">Microchip:</span>
                        <span className="font-mono font-black text-emerald-950 bg-white px-2.5 py-1 rounded-xl border border-emerald-300 shadow-2xs select-all">
                          {pet.microchip || 'Pendente de Implantação'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">Localização:</span>
                        <span className="font-bold text-stone-800 truncate max-w-[170px]">
                          📍 {pet.bairro || 'Itaiópolis'}
                        </span>
                      </div>
                    </div>

                    {pet.vacinas && pet.vacinas.length > 0 && (
                      <p className="text-xs text-emerald-800 font-black flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#0D6838]" />
                        <span>{pet.vacinas.length} {pet.vacinas.length === 1 ? 'procedimento registrado' : 'procedimentos registrados'}</span>
                      </p>
                    )}
                  </div>

                </div>

                {/* Botão de Ação Destacado com Estilo 3D */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => onOpenPetCard(pet)}
                    className="w-full py-3.5 min-h-[44px] rounded-2xl font-black text-xs sm:text-sm text-[#1C1917] bg-[#F9C72C] hover:bg-[#F8BE12] border-b-4 border-[#C69205] active:border-b-0 active:translate-y-1 shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Ver Carteira de Identificação Animal ✨</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 sm:p-16 text-center rounded-[2.5rem] bg-white border-3 border-dashed border-stone-300 shadow-md space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-[#EAF7EE] border-2 border-[#0D6838] text-stone-900 flex items-center justify-center mx-auto shadow-xs text-3xl">
              🐶🐱
            </div>
            <div className="max-w-sm mx-auto space-y-1">
              <h3 className="font-black text-xl text-stone-900">Nenhum animal cadastrado ainda</h3>
              <p className="text-xs text-stone-600 font-medium leading-relaxed">
                Adicione seu cão ou gato agora mesmo ou pesquise na base do mutirão municipal de Itaiópolis para vinculá-lo.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={onCadastrarNovo}
                className="px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-black text-[#1C1917] bg-[#F9C72C] hover:bg-[#F8BE12] border-b-4 border-[#C69205] active:border-b-0 active:translate-y-1 shadow-md transition-all"
              >
                + Cadastrar Pet Agora 🐾
              </button>
              <button
                onClick={() => setShowClaimModal(true)}
                className="px-5 py-3 rounded-2xl text-xs sm:text-sm font-black text-stone-800 bg-white hover:bg-stone-50 border-2 border-stone-300 border-b-4 border-b-stone-400 active:border-b-2 active:translate-y-0.5 transition-all shadow-xs"
              >
                Buscar Pet no Histórico
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Reivindicação do Histórico */}
      {showClaimModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-[#FAF8F5] text-stone-900 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl border-4 border-[#0D6838] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b-2 border-stone-200">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#0D6838] text-white flex items-center justify-center font-black text-lg">
                  🔍
                </div>
                <div>
                  <h3 className="font-black text-base text-stone-900">Vincular Animal do Mutirão</h3>
                  <p className="text-xs font-bold text-stone-500">Base Histórica Oficial de Itaiópolis (822 Animais)</p>
                </div>
              </div>
              <button 
                onClick={() => { setShowClaimModal(false); setClaimResults([]); setClaimSearch(''); }}
                className="w-8 h-8 rounded-full bg-white hover:bg-stone-100 text-stone-500 hover:text-stone-900 border border-stone-300 flex items-center justify-center font-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-700 font-medium leading-relaxed">
              Seu animal já foi castrado ou microchipado pela Prefeitura? Digite o <strong>nome do animal</strong>, <strong>nome do tutor</strong> ou o <strong>código do microchip</strong>:
            </p>

            <form onSubmit={handleSearchClaim} className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: Murisca, Ana Maria, 90026300..."
                value={claimSearch}
                onChange={(e) => setClaimSearch(e.target.value)}
                className="flex-1 px-4 py-3 rounded-2xl bg-white border-2 border-stone-300 text-stone-900 text-xs font-bold focus:border-[#0D6838] outline-none shadow-xs font-mono"
              />
              <button
                type="submit"
                disabled={claiming || !claimSearch.trim()}
                className="px-5 py-3 rounded-2xl font-black text-xs text-[#1C1917] bg-[#F9C72C] hover:bg-[#F8BE12] border-b-4 border-[#C69205] active:border-b-0 active:translate-y-1 disabled:opacity-50 transition-all shadow-xs"
              >
                {claiming ? 'Buscando...' : 'Buscar'}
              </button>
            </form>

            {claimResults.length > 0 && (
              <div className="max-h-64 overflow-y-auto space-y-2 pt-2">
                <p className="text-xs font-black text-stone-600 uppercase">Selecione seu pet para vincular à sua conta:</p>
                {claimResults.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-2xl bg-white border-2 border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:border-[#0D6838] transition-colors shadow-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-black text-stone-900 text-sm">{item.nomeAnimal} ({item.especie} • {item.raca})</p>
                        <PetCategoryBadge pet={item} size="sm" />
                      </div>
                      <p className="text-xs text-stone-500 font-medium">
                        Tutor: <strong>{item.nomeTutor}</strong> • Chip: <span className="font-mono font-black text-emerald-950 bg-white px-2 py-0.5 rounded-lg border border-emerald-300 select-all">{item.microchip}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleClaimPet(item.id)}
                      className="px-4 py-2 min-h-[40px] rounded-xl font-black text-xs text-[#1C1917] bg-[#F9C72C] hover:bg-[#F8BE12] border-b-2 border-[#C69205] active:border-b-0 active:translate-y-0.5 transition-all shadow-xs shrink-0 flex items-center justify-center gap-1.5"
                    >
                      <span>É Meu Pet ✓</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
