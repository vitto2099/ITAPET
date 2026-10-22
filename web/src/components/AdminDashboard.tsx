import React, { useState, useEffect } from 'react';
import { 
  fetchAllPetsForAdmin, 
  updatePetStatus, 
  addVaccineToPet,
  fetchCastrationRequests,
  updateCastrationStatus
} from '../services/petService';
import { PetRegistration, VacinaRegistro, CastrationRequest } from '../types';
import { BAIRROS_ITAIOPOLIS } from '../constants/bairros';
import { ItaiopolisCoatOfArms } from './ItaiopolisCoatOfArms';
import { PetCategoryBadge, isPetMutirao } from './PetCategoryBadge';
import { getPetAvatarEmoji } from '../utils/petEmoji';
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  Syringe, 
  PawPrint, 
  Eye, 
  FileSpreadsheet, 
  Sparkles, 
  Phone, 
  Calendar, 
  ExternalLink, 
  Flame, 
  Check 
} from 'lucide-react';

interface AdminDashboardProps {
  onOpenPetCard: (pet: PetRegistration) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onOpenPetCard }) => {
  // Aba Ativa: 'animais' | 'castracoes'
  const [activeTab, setActiveTab] = useState<'animais' | 'castracoes'>('animais');

  // Base de Animais
  const [pets, setPets] = useState<PetRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros de Animais
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBairro, setSelectedBairro] = useState('Todos');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [selectedEspecie, setSelectedEspecie] = useState('Todos');
  const [selectedOrigem, setSelectedOrigem] = useState<'Todos' | 'mutirao' | 'online'>('Todos');

  // Solicitações de Castração & CadÚnico
  const [castrationRequests, setCastrationRequests] = useState<CastrationRequest[]>([]);
  const [loadingCastrations, setLoadingCastrations] = useState(false);
  const [castrationSearch, setCastrationSearch] = useState('');
  const [castrationFilterNis, setCastrationFilterNis] = useState<'todos' | 'cadunico' | 'sem_nis'>('todos');
  const [castrationFilterStatus, setCastrationFilterStatus] = useState<string>('todos');

  // Modal de Vacina
  const [vaccineModalPet, setVaccineModalPet] = useState<PetRegistration | null>(null);
  const [vacinaNome, setVacinaNome] = useState('Antirrábica Municipal');
  const [vacinaObs, setVacinaObs] = useState('');
  const [savingVaccine, setSavingVaccine] = useState(false);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const loadAllPets = async () => {
    setLoading(true);
    try {
      const data = await fetchAllPetsForAdmin();
      setPets(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadCastrations = async () => {
    setLoadingCastrations(true);
    try {
      const data = await fetchCastrationRequests();
      setCastrationRequests(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCastrations(false);
    }
  };

  useEffect(() => {
    loadAllPets();
    loadCastrations();
  }, []);

  // Métricas de Animais
  const totalPets = pets.length;
  const pendentesCount = pets.filter(p => p.status === 'pendente').length;
  const microchipadosCount = pets.filter(p => p.microchip && p.microchip.length >= 10).length;
  const alertasCount = pets.filter(p => p.alertaDuplicidadeMicrochip).length;

  // Métricas de Castração
  const totalCastracoes = castrationRequests.length;
  const cadUnicoCount = castrationRequests.filter(r => r.prioridadeCadUnico).length;
  const pendentesCastracoesCount = castrationRequests.filter(r => r.status === 'pendente').length;
  const agendadasCastracoesCount = castrationRequests.filter(r => r.status === 'agendado').length;

  // Filtragem de Animais
  const filteredPets = pets.filter(pet => {
    const term = searchTerm.toLowerCase();
    const matchSearch = 
      !term ||
      (pet.microchip && pet.microchip.toLowerCase().includes(term)) ||
      (pet.nomeAnimal && pet.nomeAnimal.toLowerCase().includes(term)) ||
      (pet.nomeTutor && pet.nomeTutor.toLowerCase().includes(term));

    const matchBairro = selectedBairro === 'Todos' || pet.bairro === selectedBairro;
    const matchStatus = selectedStatus === 'Todos' || pet.status === selectedStatus;
    const matchEspecie = 
      selectedEspecie === 'Todos' || 
      pet.especie === selectedEspecie ||
      (selectedEspecie === 'Canino' && ((pet.especie || '').toLowerCase().includes('can') || (pet.especie || '').toLowerCase().includes('cão'))) ||
      (selectedEspecie === 'Felino' && ((pet.especie || '').toLowerCase().includes('fel') || (pet.especie || '').toLowerCase().includes('gato')));

    const isMut = isPetMutirao(pet);
    const matchOrigem = 
      selectedOrigem === 'Todos' ||
      (selectedOrigem === 'mutirao' && isMut) ||
      (selectedOrigem === 'online' && !isMut);

    return matchSearch && matchBairro && matchStatus && matchEspecie && matchOrigem;
  });

  const totalPages = Math.ceil(filteredPets.length / itemsPerPage) || 1;
  const paginatedPets = filteredPets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filtragem de Castrações (com prioridade CadÚnico/NIS)
  const filteredCastrations = castrationRequests.filter(req => {
    const term = castrationSearch.toLowerCase();
    const matchSearch = !term ||
      req.id.toLowerCase().includes(term) ||
      req.nomeAnimal.toLowerCase().includes(term) ||
      (req.nomeTutor || '').toLowerCase().includes(term) ||
      (req.bairro || '').toLowerCase().includes(term) ||
      (req.nis || '').includes(term);

    const matchNis = 
      castrationFilterNis === 'todos' ||
      (castrationFilterNis === 'cadunico' && req.prioridadeCadUnico) ||
      (castrationFilterNis === 'sem_nis' && !req.prioridadeCadUnico);

    const matchStatus = castrationFilterStatus === 'todos' || req.status === castrationFilterStatus;

    return matchSearch && matchNis && matchStatus;
  });

  const handleApprove = async (petId: string) => {
    await updatePetStatus(petId, 'aprovado');
    setPets(prev => prev.map(p => p.id === petId ? { ...p, status: 'aprovado' } : p));
  };

  const handleReject = async (petId: string) => {
    const motivo = prompt("Motivo da rejeição ou solicitação de retificação:");
    if (motivo !== null) {
      await updatePetStatus(petId, 'rejeitado', motivo);
      setPets(prev => prev.map(p => p.id === petId ? { ...p, status: 'rejeitado', motivoRejeicao: motivo } : p));
    }
  };

  const handleSaveVaccine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vaccineModalPet) return;

    setSavingVaccine(true);
    const newVac: VacinaRegistro = {
      nome: vacinaNome,
      data: new Date().toLocaleDateString('pt-BR'),
      observacao: vacinaObs || 'Aplicada em campanha oficial pela Secretaria de Meio Ambiente',
      veterinarioNome: 'Dr(a). Veterinário(a) Municipal'
    };

    try {
      await addVaccineToPet(vaccineModalPet.id, newVac);
      setPets(prev => prev.map(p => {
        if (p.id === vaccineModalPet.id) {
          return {
            ...p,
            status: 'concluido',
            vacinas: [...(p.vacinas || []), newVac]
          };
        }
        return p;
      }));
      alert(`Vacina registrada com sucesso para o animal ${vaccineModalPet.nomeAnimal}! O registro foi salvo e constará no passaporte oficial.`);
      setVaccineModalPet(null);
      setVacinaObs('');
    } finally {
      setSavingVaccine(false);
    }
  };

  // Ações de Castração
  const handleScheduleCastration = async (req: CastrationRequest) => {
    const dataHora = prompt(`Informe a data e horário do mutirão para o animal "${req.nomeAnimal}":`, "Sábado, 08:30");
    if (!dataHora) return;

    await updateCastrationStatus(req.id, 'agendado', { dataAgendamento: dataHora });
    setCastrationRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: 'agendado', dataAgendamento: dataHora } : r));
    alert(`Mutirão agendado com sucesso para ${dataHora}!`);
  };

  const handleApproveCastration = async (reqId: string) => {
    await updateCastrationStatus(reqId, 'aprovado');
    setCastrationRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'aprovado' } : r));
  };

  const handleCompleteCastration = async (reqId: string) => {
    await updateCastrationStatus(reqId, 'concluido');
    setCastrationRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'concluido' } : r));
    alert("Procedimento concluído com sucesso no mutirão!");
  };

  const handleRejectCastration = async (reqId: string) => {
    const motivo = prompt("Motivo da rejeição ou pendência documental:");
    if (motivo !== null) {
      await updateCastrationStatus(reqId, 'rejeitado', { motivo });
      setCastrationRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'rejeitado', motivoRejeicao: motivo } : r));
    }
  };

  return (
    <div className="space-y-6 py-6">
      
      {/* Top Banner Municipal Oficial */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B4F8A] via-[#094273] to-[#15803D] text-white p-6 sm:p-8 shadow-md border border-slate-200/40">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <div className="p-1 rounded-2xl bg-white shadow-sm shrink-0">
              <img src="/logo.png" alt="ItaPet Itaiópolis" className="w-14 h-14 object-contain" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-emerald-200 text-xs font-bold border border-white/20 shadow-xs uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>PAINEL TÉCNICO VETERINÁRIO • ITAIÓPOLIS - SC</span>
              </div>
              
              <h1 className="text-xl sm:text-2xl font-bold text-white">
                Gestão Animal & Controle de Zoonoses 🩺
              </h1>
              
              <p className="text-xs sm:text-sm font-medium text-emerald-100 max-w-xl leading-relaxed">
                Base unificada com <strong>{totalPets} registros consolidados</strong>, triagem prioritária de castrações com <strong>CadÚnico/NIS</strong> e averbação oficial de vacinas.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              if (activeTab === 'animais') {
                const csvData = filteredPets.map(p => `"${p.id}","${p.nomeAnimal}","${p.especie}","${p.microchip || ''}","${p.nomeTutor}","${p.bairro}","${p.status}"`).join('\n');
                const blob = new Blob([`"ID","Animal","Espécie","Microchip","Tutor","Bairro","Status"\n${csvData}`], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `relatorio_itapet_animais_${Date.now()}.csv`;
                a.click();
              } else {
                const csvData = filteredCastrations.map(r => `"${r.id}","${r.nomeAnimal}","${r.especie}","${r.sexo}","${r.nomeTutor || ''}","${r.nis || 'Não informado'}","${r.prioridadeCadUnico ? 'SIM' : 'NÃO'}","${r.bairro}","${r.status}","${r.dataAgendamento || ''}"`).join('\n');
                const blob = new Blob([`"Ticket","Animal","Espécie","Sexo","Tutor","NIS","Prioridade CadÚnico","Bairro","Status","Agendamento"\n${csvData}`], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `relatorio_itapet_castracoes_${Date.now()}.csv`;
                a.click();
              }
            }}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 transition-all shadow-xs flex items-center justify-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Exportar CSV ({activeTab === 'animais' ? 'Animais' : 'Castrações'})</span>
          </button>
        </div>
      </div>

      {/* Seletor de Abas com Estilo Limpo */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <button
          onClick={() => { setActiveTab('animais'); setCurrentPage(1); }}
          className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'animais'
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <PawPrint className="w-4 h-4 text-white" />
          <span>Base de Animais & Microchips ({totalPets})</span>
        </button>

        <button
          onClick={() => { setActiveTab('castracoes'); }}
          className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'castracoes'
              ? 'bg-[#0B4F8A] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-300" />
          <span>Triagem de Castração & CadÚnico ({totalCastracoes})</span>
          {cadUnicoCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950">
              {cadUnicoCount} CadÚnico
            </span>
          )}
        </button>
      </div>

      {/* Conteúdo da Aba Selecionada */}
      {activeTab === 'animais' ? (
        <>
          {/* Métricas do Município em Cards Agradáveis */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <div className="p-5 rounded-[2rem] bg-white border-3 border-stone-200/90 shadow-sm hover:border-amber-300 transition-all">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 border-2 border-amber-200 flex items-center justify-center mb-3 text-lg font-bold">
                🐾
              </div>
              <p className="text-xs font-black text-stone-500 uppercase tracking-wide">Total de Animais</p>
              <p className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">{totalPets}</p>
              <p className="text-xs font-bold text-stone-500 mt-0.5">822 históricos + novos</p>
            </div>

            <div className="p-5 rounded-[2rem] bg-white border-3 border-emerald-200/90 shadow-sm hover:border-emerald-300 transition-all">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 border-2 border-emerald-200 flex items-center justify-center mb-3 text-lg font-bold">
                🏅
              </div>
              <p className="text-xs font-black text-emerald-700 uppercase tracking-wide">Microchipados Oficiais</p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-800 mt-1">{microchipadosCount}</p>
              <p className="text-xs font-bold text-emerald-600 mt-0.5">Rastreamento ativo</p>
            </div>

            <div className="p-5 rounded-[2rem] bg-white border-3 border-amber-200/90 shadow-sm hover:border-amber-400 transition-all">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-800 border-2 border-amber-200 flex items-center justify-center mb-3 text-lg font-bold">
                ⏳
              </div>
              <p className="text-xs font-black text-amber-700 uppercase tracking-wide">Aguardando Validação</p>
              <p className="text-2xl sm:text-3xl font-black text-amber-800 mt-1">{pendentesCount}</p>
              <p className="text-xs font-bold text-amber-600 mt-0.5">Fila de homologação</p>
            </div>

            <div className="p-5 rounded-[2rem] bg-white border-3 border-rose-200/90 shadow-sm hover:border-rose-300 transition-all">
              <div className="w-11 h-11 rounded-2xl bg-rose-100 text-rose-800 border-2 border-rose-200 flex items-center justify-center mb-3 text-lg font-bold">
                ⚠️
              </div>
              <p className="text-xs font-black text-rose-700 uppercase tracking-wide">Alertas de Auditoria</p>
              <p className="text-2xl sm:text-3xl font-black text-rose-800 mt-1">{alertasCount}</p>
              <p className="text-xs font-bold text-rose-600 mt-0.5">Microchips duplicados</p>
            </div>
          </div>

          {/* Barra de Filtros e Busca */}
          <div className="p-5 rounded-[2rem] bg-white border-3 border-stone-200/90 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-600" />
                <input
                  type="text"
                  placeholder="🔍 Buscar por Microchip, Nome do Animal ou Nome do Tutor..."
                  value={searchTerm}
                  onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                  className="w-full min-h-[44px] pl-10 pr-4 py-3 rounded-2xl bg-[#FAF7F2] border-2 border-stone-200 text-stone-900 placeholder-stone-400 text-xs sm:text-sm font-bold focus:border-amber-400 focus:bg-white outline-none transition-all shadow-xs"
                />
              </div>

              <select
                value={selectedBairro}
                onChange={(e) => { setSelectedBairro(e.target.value); setCurrentPage(1); }}
                className="min-h-[44px] px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border-2 border-stone-200 text-xs sm:text-sm font-bold text-stone-800 focus:border-amber-400 outline-none shadow-xs"
              >
                <option value="Todos">Bairro: Todos ({pets.length})</option>
                {BAIRROS_ITAIOPOLIS.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                className="min-h-[44px] px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border-2 border-stone-200 text-xs sm:text-sm font-bold text-stone-800 focus:border-amber-400 outline-none shadow-xs"
              >
                <option value="Todos">Status: Todos</option>
                <option value="pendente">Apenas Pendentes ⏳</option>
                <option value="concluido">Concluídos / Históricos 🏅</option>
                <option value="aprovado">Aprovados ✅</option>
              </select>
            </div>

            {/* Linha 2: Botões Grandes de Filtro de Espécie e Categoria/Origem */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1 border-t-2 border-stone-100">
              
              {/* Filtro de Espécie: Botões Grandes e Claros */}
              <div>
                <p className="text-xs font-black text-stone-700 uppercase tracking-wide mb-1.5">
                  🐾 Espécie:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'Todos', label: '🐾 Todos os Pets' },
                    { key: 'Canino', label: '🐶🐕 Cães (Caninos)' },
                    { key: 'Felino', label: '🐱🐈 Gatos (Felinos)' }
                  ].map(esp => (
                    <button
                      type="button"
                      key={esp.key}
                      onClick={() => { setSelectedEspecie(esp.key); setCurrentPage(1); }}
                      className={`min-h-[44px] px-2.5 py-2 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center text-center shadow-2xs ${
                        selectedEspecie === esp.key
                          ? 'bg-emerald-700 text-white shadow-xs font-black scale-[1.02]'
                          : 'bg-[#FAF7F2] text-stone-700 border-2 border-stone-200 hover:bg-emerald-50 hover:border-emerald-300'
                      }`}
                    >
                      {esp.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtro de Categoria / Origem: Botões Grandes e Claros */}
              <div>
                <p className="text-xs font-black text-stone-700 uppercase tracking-wide mb-1.5">
                  🏛️ Origem do Registro:
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'Todos', label: '📋 Todos' },
                    { key: 'mutirao', label: '🏛️ Registros Anteriores (Mutirão - 1.363)' },
                    { key: 'online', label: '📱 Novos Cadastros Online' }
                  ].map(orig => (
                    <button
                      type="button"
                      key={orig.key}
                      onClick={() => { setSelectedOrigem(orig.key as any); setCurrentPage(1); }}
                      className={`min-h-[44px] px-2 py-2 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center text-center shadow-2xs leading-tight ${
                        selectedOrigem === orig.key
                          ? 'bg-[#0B4F8A] text-white shadow-xs font-black scale-[1.02]'
                          : 'bg-[#FAF7F2] text-stone-700 border-2 border-stone-200 hover:bg-blue-50 hover:border-blue-300'
                      }`}
                    >
                      {orig.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            <div className="flex items-center justify-between text-xs font-bold text-stone-500 pt-2 border-t-2 border-stone-100">
              <span>Exibindo <strong>{filteredPets.length}</strong> animais encontrados</span>
              <span>Página {currentPage} de {totalPages}</span>
            </div>
          </div>

          {/* Tabela de Animais */}
          <div className="bg-white rounded-[2.5rem] border-3 border-stone-200/90 overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-amber-50/80 border-b-2 border-amber-200 text-amber-900 font-black uppercase tracking-wider text-xs">
                    <th className="py-4 px-4">Animal</th>
                    <th className="py-4 px-4">Origem / Categoria</th>
                    <th className="py-4 px-4">Espécie / Raça</th>
                    <th className="py-4 px-4">Microchip</th>
                    <th className="py-4 px-4">Tutor</th>
                    <th className="py-4 px-4">Bairro</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-stone-500 font-bold">
                        <div className="inline-block w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mb-2" />
                        <p>Carregando registros de Itaiópolis...</p>
                      </td>
                    </tr>
                  ) : paginatedPets.length > 0 ? (
                    paginatedPets.map((pet) => (
                      <tr key={pet.id} className="hover:bg-amber-50/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-stone-900">
                          <div className="flex items-center gap-2.5">
                            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-300 text-stone-900 flex items-center justify-center font-bold text-xl shrink-0 shadow-xs select-none">
                              {getPetAvatarEmoji(pet)}
                            </div>
                            <div>
                              <p className="font-black text-stone-900 leading-tight text-sm sm:text-base">{pet.nomeAnimal}</p>
                              {pet.alertaDuplicidadeMicrochip && (
                                <span className="text-xs text-rose-600 font-black">⚠️ Microchip Duplicado</span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <PetCategoryBadge pet={pet} size="sm" />
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-bold text-stone-800 text-xs sm:text-sm">{pet.especie}</span>
                          <span className="text-stone-400"> • </span>
                          <span className="text-stone-500 font-medium text-xs sm:text-sm">{pet.raca || 'SRD'}</span>
                        </td>

                        <td className="py-3 px-4 font-mono font-bold">
                          {pet.microchip ? (
                            <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-950 font-mono font-black border border-slate-300 text-xs sm:text-sm tracking-wider shadow-2xs select-all">
                              {pet.microchip}
                            </span>
                          ) : (
                            <span className="text-amber-700 font-sans font-bold text-xs">Pendente</span>
                          )}
                        </td>

                        <td className="py-3 px-4 font-bold text-stone-800 text-xs sm:text-sm">
                          {pet.nomeTutor || 'Não informado'}
                        </td>

                        <td className="py-3 px-4 text-stone-600 font-medium truncate max-w-[150px] text-xs">
                          {pet.bairro || 'Não informado'}
                        </td>

                        <td className="py-3 px-4">
                          {pet.status === 'concluido' ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-black text-xs shadow-xs">
                              ✓ Microchipado
                            </span>
                          ) : pet.status === 'aprovado' ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-100 text-teal-800 border border-teal-300 font-black text-xs shadow-xs">
                              ✓ Aprovado
                            </span>
                          ) : pet.status === 'rejeitado' ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 font-black text-xs shadow-xs">
                              ✕ Rejeitado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-black text-xs shadow-xs">
                              ⏱ Pendente
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {pet.status === 'pendente' && (
                              <>
                                <button
                                  onClick={() => handleApprove(pet.id)}
                                  title="Homologar Cadastro"
                                  className="min-h-[40px] min-w-[40px] p-2 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 font-black transition-colors flex items-center justify-center"
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleReject(pet.id)}
                                  title="Rejeitar / Solicitar Correção"
                                  className="min-h-[40px] min-w-[40px] p-2 rounded-xl bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200 font-black transition-colors flex items-center justify-center"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => setVaccineModalPet(pet)}
                              title="Lançar Vacina Oficial"
                              className="min-h-[40px] px-3.5 py-2 rounded-xl bg-amber-400 text-stone-950 border border-amber-500 hover:bg-amber-300 font-black flex items-center gap-1.5 transition-all shadow-xs text-xs"
                            >
                              <Syringe className="w-4 h-4" />
                              <span>Vacina</span>
                            </button>

                            <button
                              onClick={() => onOpenPetCard(pet)}
                              title="Ver Carteira Digital"
                              className="min-h-[40px] min-w-[40px] p-2 rounded-xl text-stone-600 hover:text-stone-950 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors flex items-center justify-center"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-stone-500 font-bold">
                        Nenhum animal encontrado com os filtros selecionados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 bg-[#FAF7F2] border-t-2 border-stone-200 text-xs">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-4 py-2 rounded-2xl bg-white border-2 border-stone-200 font-black text-stone-800 hover:bg-stone-50 disabled:opacity-40 shadow-xs"
                >
                  Anterior
                </button>
                <span className="font-black text-stone-600">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="px-4 py-2 rounded-2xl bg-white border-2 border-stone-200 font-black text-stone-800 hover:bg-stone-50 disabled:opacity-40 shadow-xs"
                >
                  Próxima
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        /* ABA DE TRIAGEM DE CASTRAÇÃO COM CADÚNICO/NIS */
        <>
          {/* Métricas de Castração */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            <div className="p-5 rounded-[2rem] bg-white border-3 border-emerald-200 shadow-sm hover:border-emerald-300 transition-all">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-800 border-2 border-emerald-200 flex items-center justify-center mb-3 text-lg font-bold">
                💉
              </div>
              <p className="text-xs font-black text-emerald-700 uppercase tracking-wide">Total de Solicitações</p>
              <p className="text-2xl sm:text-3xl font-black text-emerald-950 mt-1">{totalCastracoes}</p>
              <p className="text-xs font-bold text-emerald-600 mt-0.5">Mutirão Municipal</p>
            </div>

            <div className="p-5 rounded-[2rem] bg-white border-3 border-amber-300 shadow-sm hover:border-amber-400 transition-all">
              <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-900 border-2 border-amber-300 flex items-center justify-center mb-3 text-lg font-bold">
                🔥
              </div>
              <p className="text-xs font-black text-amber-800 uppercase tracking-wide">Prioridade CadÚnico / NIS</p>
              <p className="text-2xl sm:text-3xl font-black text-amber-900 mt-1">{cadUnicoCount}</p>
              <p className="text-xs font-bold text-amber-700 mt-0.5">Atendimento prioritário</p>
            </div>

            <div className="p-5 rounded-[2rem] bg-white border-3 border-stone-200 shadow-sm hover:border-amber-300 transition-all">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-800 border-2 border-amber-200 flex items-center justify-center mb-3 text-lg font-bold">
                ⏳
              </div>
              <p className="text-xs font-black text-stone-500 uppercase tracking-wide">Aguardando Triagem</p>
              <p className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">{pendentesCastracoesCount}</p>
              <p className="text-xs font-bold text-stone-500 mt-0.5">Fila de espera</p>
            </div>

            <div className="p-5 rounded-[2rem] bg-white border-3 border-teal-200 shadow-sm hover:border-teal-300 transition-all">
              <div className="w-11 h-11 rounded-2xl bg-teal-100 text-teal-800 border-2 border-teal-200 flex items-center justify-center mb-3 text-lg font-bold">
                📅
              </div>
              <p className="text-xs font-black text-teal-700 uppercase tracking-wide">Agendadas para Mutirão</p>
              <p className="text-2xl sm:text-3xl font-black text-teal-900 mt-1">{agendadasCastracoesCount}</p>
              <p className="text-xs font-bold text-teal-600 mt-0.5">Com data/hora marcada</p>
            </div>
          </div>

          {/* Filtros da Triagem */}
          <div className="p-5 rounded-[2rem] bg-white border-3 border-stone-200/90 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-600" />
                <input
                  type="text"
                  placeholder="🔍 Buscar por Ticket, Nome do Animal, Tutor ou NIS..."
                  value={castrationSearch}
                  onChange={(e) => setCastrationSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FAF7F2] border-2 border-stone-200 text-stone-900 placeholder-stone-400 text-xs sm:text-sm font-bold focus:border-emerald-500 focus:bg-white outline-none transition-all shadow-xs"
                />
              </div>

              <select
                value={castrationFilterNis}
                onChange={(e) => setCastrationFilterNis(e.target.value as any)}
                className="px-4 py-3 rounded-2xl bg-[#FAF7F2] border-2 border-stone-200 text-xs font-bold text-stone-800 focus:border-emerald-500 outline-none shadow-xs min-h-[44px]"
              >
                <option value="todos">Prioridade: Todas as Fila</option>
                <option value="cadunico">🔥 Apenas com Prioridade CadÚnico/NIS</option>
                <option value="sem_nis">Fila Geral (Sem CadÚnico)</option>
              </select>

              <select
                value={castrationFilterStatus}
                onChange={(e) => setCastrationFilterStatus(e.target.value)}
                className="px-4 py-3 rounded-2xl bg-[#FAF7F2] border-2 border-stone-200 text-xs font-bold text-stone-800 focus:border-emerald-500 outline-none shadow-xs min-h-[44px]"
              >
                <option value="todos">Status: Todos</option>
                <option value="pendente">⏳ Pendente de Triagem</option>
                <option value="agendado">📅 Agendado para Mutirão</option>
                <option value="aprovado">✅ Aprovado</option>
                <option value="concluido">🏅 Concluído / Operado</option>
                <option value="rejeitado">❌ Rejeitado</option>
              </select>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-200 text-xs font-bold text-amber-950 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Critério Legal de Triagem:</strong> As solicitações com NIS (CadÚnico) são ordenadas no topo da fila de atendimento prioritário.
                </span>
              </div>
              <span className="text-amber-800 font-mono font-black">{filteredCastrations.length} na fila</span>
            </div>
          </div>

          {/* Tabela de Triagem */}
          <div className="bg-white rounded-[2.5rem] border-3 border-stone-200/90 overflow-hidden shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-emerald-50 border-b-2 border-emerald-200 text-emerald-950 font-black uppercase tracking-wider text-xs">
                    <th className="py-4 px-4">Ticket</th>
                    <th className="py-4 px-4">Animal & Espécie</th>
                    <th className="py-4 px-4">Tutor & Contato</th>
                    <th className="py-4 px-4">Bairro</th>
                    <th className="py-4 px-4">NIS / CadÚnico</th>
                    <th className="py-4 px-4">Status & Agendamento</th>
                    <th className="py-4 px-4 text-right">Ações Técnicas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-800">
                  {loadingCastrations ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-stone-500 font-bold">
                        <div className="inline-block w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2" />
                        <p>Carregando solicitações de castração...</p>
                      </td>
                    </tr>
                  ) : filteredCastrations.length > 0 ? (
                    filteredCastrations.map((req) => (
                      <tr key={req.id} className={`hover:bg-stone-50/80 transition-colors ${req.prioridadeCadUnico ? 'bg-amber-50/20' : ''}`}>
                        <td className="py-3 px-4 font-mono font-black text-stone-900">
                          <span className="px-2.5 py-1 rounded-xl bg-stone-100 border border-stone-300">
                            {req.id}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-bold text-stone-900">
                          <div className="flex items-center gap-2">
                            <span className="text-xl select-none">{getPetAvatarEmoji(req)}</span>
                            <div>
                              <p className="font-black text-stone-900 leading-tight">{req.nomeAnimal}</p>
                              <p className="text-xs text-stone-500 font-medium">
                                {req.especie} • {req.sexo} {req.pesoAprox ? `• ${req.pesoAprox} kg` : ''}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-bold text-stone-800">
                          <p>{req.nomeTutor || 'Munícipe'}</p>
                          <a
                            href={`https://wa.me/55${req.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${req.nomeTutor || 'Tutor'}, referente à sua solicitação de castração para ${req.nomeAnimal} (Senha: ${req.id}) na Prefeitura de Itaiópolis:`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-emerald-700 hover:text-emerald-900 hover:underline font-mono mt-0.5"
                            title="Conversar no WhatsApp"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                            <span>{req.telefone}</span>
                          </a>
                        </td>

                        <td className="py-3 px-4 text-stone-600 font-medium">
                          {req.bairro}
                        </td>

                        <td className="py-3 px-4">
                          {req.prioridadeCadUnico ? (
                            <div className="inline-flex flex-col gap-1">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-300 text-stone-950 font-black text-xs border border-amber-400 shadow-xs">
                                <Flame className="w-3.5 h-3.5 text-amber-700" />
                                <span>CadÚnico Prioritário</span>
                              </span>
                              <span className="font-mono text-xs font-bold text-stone-600 pl-1">
                                NIS: {req.nis}
                              </span>
                            </div>
                          ) : (
                            <span className="text-stone-400 font-medium text-xs">
                              Sem CadÚnico (Fila Geral)
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          {req.status === 'concluido' ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-black text-xs">
                              ✓ Operado / Concluído
                            </span>
                          ) : req.status === 'agendado' ? (
                            <div className="space-y-0.5">
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-teal-100 text-teal-800 border border-teal-300 font-black text-xs">
                                📅 Agendado
                              </span>
                              {req.dataAgendamento && (
                                <p className="text-xs font-black text-teal-900">
                                  {req.dataAgendamento}
                                </p>
                              )}
                            </div>
                          ) : req.status === 'aprovado' ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-300 font-black text-xs">
                              ✓ Aprovado
                            </span>
                          ) : req.status === 'rejeitado' ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 font-black text-xs">
                              ✕ Rejeitado
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-300 font-black text-xs">
                              ⏱ Pendente
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            <button
                              onClick={() => handleScheduleCastration(req)}
                              title="Agendar Mutirão"
                              className="px-3 py-2 rounded-xl bg-teal-600 text-white hover:bg-teal-700 font-black flex items-center gap-1.5 text-xs shadow-xs min-h-[40px] transition-all"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                              <span>Agendar</span>
                            </button>

                            {req.status !== 'concluido' && (
                              <button
                                onClick={() => handleCompleteCastration(req.id)}
                                title="Concluir Procedimento"
                                className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}

                            {req.status === 'pendente' && (
                              <button
                                onClick={() => handleRejectCastration(req.id)}
                                title="Rejeitar Solicitação"
                                className="p-2.5 rounded-xl bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-stone-500 font-bold">
                        <PawPrint className="w-8 h-8 text-stone-400 mx-auto mb-2 opacity-50" />
                        <p className="text-sm text-stone-700 font-black">Nenhuma solicitação de castração cadastrada no momento.</p>
                        <p className="text-xs text-stone-500 font-medium mt-1">As solicitações reais enviadas pelos munícipes no portal ItaPet serão listadas aqui para triagem e agendamento.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Modal de Lançamento de Vacina Oficial */}
      {vaccineModalPet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#FAF7F2] text-stone-800 rounded-[2.5rem] p-6 sm:p-7 shadow-2xl border-4 border-amber-300 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-amber-200">
              <h3 className="font-black text-base text-stone-900 flex items-center gap-2">
                <Syringe className="w-5 h-5 text-emerald-600" />
                <span>Lançar Vacina / Procedimento</span>
              </h3>
              <button 
                onClick={() => setVaccineModalPet(null)}
                className="w-8 h-8 rounded-xl bg-white text-stone-600 hover:text-stone-900 font-black flex items-center justify-center shadow-xs"
              >
                ✕
              </button>
            </div>

            <p className="text-xs font-bold text-stone-600">
              Animal: <strong className="text-stone-900">{vaccineModalPet.nomeAnimal}</strong> • Microchip: <span className="font-mono font-black text-emerald-700">{vaccineModalPet.microchip}</span>
            </p>

            <form onSubmit={handleSaveVaccine} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-stone-700 uppercase mb-1.5">
                  Nome da Vacina / Procedimento
                </label>
                <select
                  value={vacinaNome}
                  onChange={(e) => setVacinaNome(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-stone-200 text-stone-800 text-xs font-bold focus:border-amber-400 outline-none shadow-xs"
                >
                  <option value="Antirrábica Municipal">Antirrábica Municipal</option>
                  <option value="Polivalente Canina (V8/V10)">Polivalente Canina (V8/V10)</option>
                  <option value="Tríplice/Quádrupla Felina">Tríplice/Quádrupla Felina</option>
                  <option value="Vermifugação Municipal">Vermifugação Municipal</option>
                  <option value="Castração Oficial">Castração Oficial</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-stone-700 uppercase mb-1.5">
                  Observações / Lote / Validade
                </label>
                <textarea
                  rows={3}
                  placeholder="Ex: Lote 4589B, dose conferida pelo médico veterinário."
                  value={vacinaObs}
                  onChange={(e) => setVacinaObs(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-stone-200 text-stone-800 text-xs font-medium focus:border-amber-400 outline-none shadow-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-stone-200">
                <button
                  type="button"
                  onClick={() => setVaccineModalPet(null)}
                  className="px-4 py-2.5 rounded-2xl text-xs font-black text-stone-600 hover:text-stone-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingVaccine}
                  className="px-6 py-2.5 text-xs font-black text-stone-950 bg-amber-400 hover:bg-amber-300 border-b-4 border-amber-600 active:border-b-0 active:translate-y-1 rounded-2xl shadow-md transition-all"
                >
                  {savingVaccine ? 'Salvando...' : 'Confirmar Lançamento 💉'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
