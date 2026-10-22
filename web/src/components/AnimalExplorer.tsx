import React, { useState, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';
import { PetRegistration } from '../types';
import { fetchAllPetsForAdmin } from '../services/petService';
import { BAIRROS_ITAIOPOLIS } from '../constants/bairros';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  PawPrint, 
  QrCode, 
  CheckCircle2, 
  Calendar, 
  MapPin, 
  Printer, 
  Eye, 
  ShieldCheck, 
  ArrowLeft,
  X,
  Share2,
  Sparkles,
  FileText,
  List,
  Lock,
  Stethoscope,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ItaiopolisCoatOfArms } from './ItaiopolisCoatOfArms';
import { PetCategoryBadge, isPetMutirao } from './PetCategoryBadge';
import { getPetAvatarEmoji } from '../utils/petEmoji';

interface AnimalExplorerProps {
  onOpenPetCard: (pet: PetRegistration) => void;
  onOpenVetLogin?: () => void;
  onGoToCitizen?: () => void;
  initialPetId?: string;
}

export const AnimalExplorer: React.FC<AnimalExplorerProps> = ({
  onOpenPetCard,
  onOpenVetLogin,
  onGoToCitizen,
  initialPetId
}) => {
  const { role } = useAuth();
  const [allPets, setAllPets] = useState<PetRegistration[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros idênticos ao padrão CIGAMVALI / Zoonoses SC + Categoria/Origem
  const [filterNomeAnimal, setFilterNomeAnimal] = useState('');
  const [filterNomeResponsavel, setFilterNomeResponsavel] = useState('');
  const [filterMicrochip, setFilterMicrochip] = useState('');
  const [filterRelacao, setFilterRelacao] = useState<'Todos' | 'Tutor' | 'Temporário' | 'Comunitário'>('Todos');
  const [filterEspecie, setFilterEspecie] = useState<'Todos' | 'Canino' | 'Felino'>('Todos');
  const [filterOrigem, setFilterOrigem] = useState<'Todos' | 'mutirao' | 'online'>('Todos');
  const [filterRaca, setFilterRaca] = useState('Todas');
  const [filterSexo, setFilterSexo] = useState<'Todos' | 'Fêmea' | 'Macho'>('Todos');
  const [filterBairro, setFilterBairro] = useState('Todos');
  const [filterPorte, setFilterPorte] = useState<'Todos' | 'Pequeno' | 'Médio' | 'Grande'>('Todos');

  // Pet selecionado para exibir a Ficha Cadastral
  const [selectedPet, setSelectedPet] = useState<PetRegistration | null>(null);

  // Controle de abas para mobile (Filtros | Animais | Ficha)
  const [mobileTab, setMobileTab] = useState<'filtros' | 'lista' | 'ficha'>('lista');

  // Modal com QR Code Flutuante
  const [showQrModal, setShowQrModal] = useState(false);
  const [floatingQrUrl, setFloatingQrUrl] = useState('');

  // Carregar animais
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const pets = await fetchAllPetsForAdmin();
        setAllPets(pets);
        if (pets.length > 0) {
          const initial = initialPetId 
            ? pets.find(p => p.id === initialPetId || p.microchip === initialPetId) || pets[0]
            : pets[0];
          setSelectedPet(initial);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [initialPetId]);

  // Gerar QR Code
  useEffect(() => {
    if (selectedPet?.microchip) {
      const publicUrl = `${window.location.origin}/?consulta=${selectedPet.microchip}`;
      QRCode.toDataURL(publicUrl, {
        width: 240,
        margin: 1,
        color: {
          dark: '#0D6838',
          light: '#ffffff'
        }
      }).then(setFloatingQrUrl).catch(console.error);
    }
  }, [selectedPet]);

  // Lista de raças extraídas dinamicamente
  const listaRacas = useMemo(() => {
    const set = new Set<string>();
    allPets.forEach(p => {
      if (p.raca && p.raca.trim() && p.raca !== 'SRD') {
        set.add(p.raca.trim());
      }
    });
    return ['Todas', 'SRD', ...Array.from(set).sort()];
  }, [allPets]);

  // Filtragem
  const filteredPets = useMemo(() => {
    return allPets.filter(p => {
      if (filterNomeAnimal && !p.nomeAnimal.toLowerCase().includes(filterNomeAnimal.toLowerCase().trim())) {
        return false;
      }
      if (filterNomeResponsavel && !(p.nomeTutor || '').toLowerCase().includes(filterNomeResponsavel.toLowerCase().trim())) {
        return false;
      }
      if (filterMicrochip && !(p.microchip || '').includes(filterMicrochip.trim())) {
        return false;
      }
      if (filterEspecie !== 'Todos') {
        const esp = (p.especie || '').toLowerCase();
        if (filterEspecie === 'Canino' && !esp.includes('canino') && !esp.includes('cão') && !esp.includes('cachorro')) {
          return false;
        }
        if (filterEspecie === 'Felino' && !esp.includes('felino') && !esp.includes('gato')) {
          return false;
        }
      }
      if (filterOrigem !== 'Todos') {
        const isMut = isPetMutirao(p);
        if (filterOrigem === 'mutirao' && !isMut) return false;
        if (filterOrigem === 'online' && isMut) return false;
      }
      if (filterSexo !== 'Todos') {
        const s = (p.sexo || '').toLowerCase();
        if (filterSexo === 'Fêmea' && !s.includes('fêm') && !s.includes('fem')) {
          return false;
        }
        if (filterSexo === 'Macho' && !s.includes('mach')) {
          return false;
        }
      }
      if (filterRaca !== 'Todas') {
        if ((p.raca || 'SRD').trim().toLowerCase() !== filterRaca.toLowerCase()) {
          return false;
        }
      }
      if (filterBairro !== 'Todos' && p.bairro !== filterBairro) {
        return false;
      }
      if (filterPorte !== 'Todos' && p.pesoKg) {
        if (filterPorte === 'Pequeno' && p.pesoKg > 10) return false;
        if (filterPorte === 'Médio' && (p.pesoKg <= 10 || p.pesoKg > 25)) return false;
        if (filterPorte === 'Grande' && p.pesoKg <= 25) return false;
      }
      return true;
    });
  }, [allPets, filterNomeAnimal, filterNomeResponsavel, filterMicrochip, filterEspecie, filterOrigem, filterSexo, filterRaca, filterBairro, filterPorte]);

  const resetFilters = () => {
    setFilterNomeAnimal('');
    setFilterNomeResponsavel('');
    setFilterMicrochip('');
    setFilterRelacao('Todos');
    setFilterEspecie('Todos');
    setFilterOrigem('Todos');
    setFilterRaca('Todas');
    setFilterSexo('Todos');
    setFilterBairro('Todos');
    setFilterPorte('Todos');
  };

  const getEmoji = (petOrEspecie?: any) => {
    if (typeof petOrEspecie === 'object' && petOrEspecie !== null) {
      return getPetAvatarEmoji(petOrEspecie);
    }
    return getPetAvatarEmoji({ especie: petOrEspecie });
  };

  const formatPetId = (pet: PetRegistration) => {
    if (pet.idOriginal) {
      return `ITA${pet.idOriginal.padStart(4, '0')}BR`;
    }
    return `ITA${pet.id.substring(0, 6).toUpperCase()}`;
  };

  const getPorteDisplay = (pet?: PetRegistration | null) => {
    if (!pet) return 'Não informado';
    if (pet.pesoKg) {
      if (pet.pesoKg <= 6) return 'Mini / Pequeno';
      if (pet.pesoKg <= 12) return 'Pequeno';
      if (pet.pesoKg <= 25) return 'Médio';
      return 'Grande';
    }
    return pet.especie === 'Felino' ? 'Pequeno' : 'Médio';
  };

  // Conta filtros ativos para o badge no celular
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterNomeAnimal) count++;
    if (filterNomeResponsavel) count++;
    if (filterMicrochip) count++;
    if (filterEspecie !== 'Todos') count++;
    if (filterOrigem !== 'Todos') count++;
    if (filterSexo !== 'Todos') count++;
    if (filterRaca !== 'Todas') count++;
    if (filterBairro !== 'Todos') count++;
    if (filterPorte !== 'Todos') count++;
    return count;
  }, [filterNomeAnimal, filterNomeResponsavel, filterMicrochip, filterEspecie, filterOrigem, filterSexo, filterRaca, filterBairro, filterPorte]);

  // Bloqueio de Privacidade: Apenas o veterinário pode ver os animais de todo mundo
  if (role !== 'admin') {
    return (
      <div className="py-10 sm:py-14 px-4 max-w-xl mx-auto text-center space-y-6 font-sans">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-lg space-y-5">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
            <img src="/logo.png" alt="ItaPet Itaiópolis" className="w-12 h-12 object-contain" />
          </div>
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>ÁREA TÉCNICA DO MÉDICO VETERINÁRIO MUNICIPAL</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Base Geral de Animais do Município 🐾
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Por privacidade e segurança dos cidadãos (LGPD), <strong>apenas o Médico Veterinário da Prefeitura tem permissão para consultar a base completa de animais</strong> (1.363 cadastros do mutirão).
            </p>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Como munícipe (tutor), você pode gerenciar <strong>exclusivamente os seus próprios animais</strong> entrando com seu CPF!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
            <button
              onClick={() => {
                if (onOpenVetLogin) onOpenVetLogin();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-xs transition-all flex items-center justify-center gap-2"
            >
              <Stethoscope className="w-4 h-4" />
              <span>Acessar como Veterinário</span>
            </button>
            <button
              onClick={() => {
                if (onGoToCitizen) onGoToCitizen();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex items-center justify-center gap-2"
            >
              <PawPrint className="w-4 h-4 text-amber-600" />
              <span>Ver Meus Próprios Animais</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-4 sm:py-6 font-sans">
      
      {/* Barra de Cabeçalho Institucional do Veterinário */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold shadow-xs shrink-0">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 tracking-tight">ItaPet TÉCNICO 🩺</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                PADRÃO CIGAMVALI / SC • VETERINÁRIO
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Base Geral de Controle Populacional e Microchips • Itaiópolis - SC
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-xs text-slate-800 font-bold bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs">
            Base: <strong className="text-emerald-700 font-mono font-bold">{allPets.length}</strong> animais
          </span>
          {activeFiltersCount > 0 && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl transition-colors shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Limpar ({activeFiltersCount})</span>
            </button>
          )}
        </div>
      </div>

      {/* Seletor de Abas no Celular */}
      <div className="lg:hidden flex items-center bg-white p-1.5 rounded-2xl border-2 border-stone-200 shadow-xs">
        <button
          onClick={() => setMobileTab('filtros')}
          className={`flex-1 py-2.5 px-2 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'filtros'
              ? 'bg-[#0D6838] text-white border-b-2 border-[#084725] shadow-xs'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filtros</span>
          {activeFiltersCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#F9C72C] text-[#1C1917] text-xs flex items-center justify-center font-black">
              {activeFiltersCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setMobileTab('lista')}
          className={`flex-1 py-2.5 px-2 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'lista'
              ? 'bg-[#0D6838] text-white border-b-2 border-[#084725] shadow-xs'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <List className="w-3.5 h-3.5" />
          <span>Lista ({filteredPets.length})</span>
        </button>

        <button
          onClick={() => setMobileTab('ficha')}
          className={`flex-1 py-2.5 px-2 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
            mobileTab === 'ficha'
              ? 'bg-[#0D6838] text-white border-b-2 border-[#084725] shadow-xs'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Ficha</span>
          {selectedPet && (
            <span className="w-2 h-2 rounded-full bg-[#F9C72C] animate-pulse" />
          )}
        </button>
      </div>

      {/* Grid Principal em 3 Colunas (Desktop) ou Abas (Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* ======================================================== */}
        {/* COLUNA 1: PAINEL DE FILTROS LATERAL (3 cols)           */}
        {/* ======================================================== */}
        <div className={`lg:col-span-3 bg-white p-5 rounded-[2rem] border-2 border-stone-200 shadow-sm space-y-4 ${
          mobileTab !== 'filtros' ? 'hidden lg:block' : 'block'
        }`}>
          
          <div className="flex items-center justify-between pb-3 border-b-2 border-stone-100">
            <h3 className="font-black text-sm text-stone-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#0D6838]" />
              <span>Filtros Técnicos</span>
            </h3>
            <span className="text-xs font-black text-[#0D6838] bg-[#EAF7EE] border border-emerald-300 px-2.5 py-1 rounded-lg font-mono">
              {filteredPets.length} pets
            </span>
          </div>

          {/* Filtro de Espécie em Botões Grandes & Claros */}
          <div>
            <label className="block text-xs font-black text-stone-800 uppercase tracking-wide mb-2">
              🐾 Espécie do Animal
            </label>
            <div className="flex flex-col gap-2">
              {[
                { key: 'Todos', label: '🐾 Todos os Pets' },
                { key: 'Canino', label: '🐶🐕 Cães (Caninos)' },
                { key: 'Felino', label: '🐱🐈 Gatos (Felinos)' }
              ].map(esp => (
                <button
                  type="button"
                  key={esp.key}
                  onClick={() => setFilterEspecie(esp.key as any)}
                  className={`min-h-[44px] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-between shadow-2xs ${
                    filterEspecie === esp.key
                      ? 'bg-[#0D6838] text-white border-b-2 border-[#084725] shadow-xs scale-[1.01]'
                      : 'bg-[#FAF8F5] text-stone-700 border-2 border-stone-200 hover:bg-emerald-50 hover:border-emerald-300'
                  }`}
                >
                  <span>{esp.label}</span>
                  {filterEspecie === esp.key && <span>✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Filtro de Categoria / Origem em Botões Grandes */}
          <div>
            <label className="block text-xs font-black text-stone-800 uppercase tracking-wide mb-2">
              🏛️ Categoria / Origem do Registro
            </label>
            <div className="flex flex-col gap-2">
              {[
                { key: 'Todos', label: '📋 Todos' },
                { key: 'mutirao', label: '🏛️ Registros Anteriores (Mutirão - 1.363)' },
                { key: 'online', label: '📱 Novos Cadastros Online' }
              ].map(orig => (
                <button
                  type="button"
                  key={orig.key}
                  onClick={() => setFilterOrigem(orig.key as any)}
                  className={`min-h-[44px] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-between text-left shadow-2xs ${
                    filterOrigem === orig.key
                      ? 'bg-[#0B4F8A] text-white border-b-2 border-[#083D6C] shadow-xs scale-[1.01]'
                      : 'bg-[#FAF8F5] text-stone-700 border-2 border-stone-200 hover:bg-blue-50 hover:border-blue-300'
                  }`}
                >
                  <span className="leading-tight">{orig.label}</span>
                  {filterOrigem === orig.key && <span>✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Nome do animal */}
          <div>
            <label className="block text-xs font-black text-stone-700 uppercase tracking-wide mb-1.5">
              Nome do animal
            </label>
            <input
              type="text"
              placeholder="Ex: Rex, Murisca, Pipoca..."
              value={filterNomeAnimal}
              onChange={(e) => setFilterNomeAnimal(e.target.value)}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border-2 border-stone-200 text-xs sm:text-sm font-bold text-stone-900 placeholder-stone-400 focus:border-[#0D6838] focus:bg-white outline-none transition-all shadow-xs"
            />
          </div>

          {/* Nome do responsável (Tutor) */}
          <div>
            <label className="block text-xs font-black text-stone-700 uppercase tracking-wide mb-1.5">
              Nome do responsável (Tutor)
            </label>
            <input
              type="text"
              placeholder="Ex: Ana Maria, Daniela..."
              value={filterNomeResponsavel}
              onChange={(e) => setFilterNomeResponsavel(e.target.value)}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border-2 border-stone-200 text-xs sm:text-sm font-bold text-stone-900 placeholder-stone-400 focus:border-[#0D6838] focus:bg-white outline-none transition-all shadow-xs"
            />
          </div>

          {/* Número do Microchip */}
          <div>
            <label className="block text-xs font-black text-stone-700 uppercase tracking-wide mb-1.5">
              Número do Microchip
            </label>
            <input
              type="text"
              placeholder="Ex: 90026300..."
              value={filterMicrochip}
              onChange={(e) => setFilterMicrochip(e.target.value)}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border-2 border-stone-200 text-xs sm:text-sm font-mono font-black text-[#0D6838] placeholder-stone-400 focus:border-[#0D6838] focus:bg-white outline-none transition-all shadow-xs"
            />
          </div>

          {/* Sexo (Fêmea / Macho) */}
          <div>
            <label className="block text-xs font-black text-stone-700 uppercase tracking-wide mb-1.5">
              Sexo
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Todos', 'Fêmea', 'Macho'] as const).map(s => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setFilterSexo(s)}
                  className={`min-h-[44px] py-2 px-2 rounded-2xl text-xs font-black transition-all ${
                    filterSexo === s
                      ? 'bg-[#0D6838] text-white border-b-2 border-[#084725] shadow-xs'
                      : 'bg-[#FAF8F5] text-stone-700 border-2 border-stone-200 hover:bg-emerald-50'
                  }`}
                >
                  {s === 'Fêmea' ? '♀ Fêmea' : s === 'Macho' ? '♂ Macho' : 'Todos'}
                </button>
              ))}
            </div>
          </div>

          {/* Raça */}
          <div>
            <label className="block text-xs font-black text-stone-700 uppercase tracking-wide mb-1.5">
              Raça
            </label>
            <select
              value={filterRaca}
              onChange={(e) => setFilterRaca(e.target.value)}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border-2 border-stone-200 text-xs sm:text-sm font-bold text-stone-900 focus:border-[#0D6838] outline-none shadow-xs"
            >
              {listaRacas.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Bairro em Itaiópolis */}
          <div>
            <label className="block text-xs font-black text-stone-700 uppercase tracking-wide mb-1.5">
              Bairro / Localidade
            </label>
            <select
              value={filterBairro}
              onChange={(e) => setFilterBairro(e.target.value)}
              className="w-full min-h-[44px] px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border-2 border-stone-200 text-xs sm:text-sm font-bold text-stone-900 focus:border-[#0D6838] outline-none shadow-xs"
            >
              <option value="Todos">Todos os Bairros</option>
              {BAIRROS_ITAIOPOLIS.map(b => (
                <option key={b} value={b}>📍 {b}</option>
              ))}
            </select>
          </div>

          {/* Botão para celular aplicar e ver lista */}
          <div className="pt-2 lg:hidden">
            <button
              onClick={() => setMobileTab('lista')}
              className="w-full min-h-[44px] py-3.5 rounded-2xl font-black text-xs sm:text-sm text-white bg-[#0D6838] hover:bg-[#16874E] border-b-4 border-[#084725] active:border-b-0 active:translate-y-1 shadow-md flex items-center justify-center gap-2"
            >
              Ver {filteredPets.length} Animais Encontrados
            </button>
          </div>

        </div>

        {/* ======================================================== */}
        {/* COLUNA 2: LISTA DE ANIMAIS (4 cols)                     */}
        {/* ======================================================== */}
        <div className={`lg:col-span-4 bg-white p-5 rounded-[2rem] border-2 border-stone-200 shadow-sm space-y-3 ${
          mobileTab !== 'lista' ? 'hidden lg:block' : 'block'
        }`}>
          
          <div className="flex items-center justify-between pb-3 border-b-2 border-stone-100">
            <h3 className="font-black text-sm text-stone-900 flex items-center gap-2">
              <PawPrint className="w-4 h-4 text-[#0D6838]" />
              <span>Lista de Animais</span>
            </h3>
            <span className="text-xs font-mono font-black text-stone-500">
              {filteredPets.length} resultados
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center text-stone-500 text-xs">
              <div className="inline-block w-6 h-6 border-2 border-[#0D6838] border-t-transparent rounded-full animate-spin mb-2" />
              <p className="font-bold">Carregando animais de Itaiópolis...</p>
            </div>
          ) : filteredPets.length > 0 ? (
            <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
              {filteredPets.map((pet) => {
                const isSelected = selectedPet?.id === pet.id;
                const petIdTag = formatPetId(pet);

                return (
                  <div
                    key={pet.id}
                    onClick={() => {
                      setSelectedPet(pet);
                      setMobileTab('ficha');
                    }}
                    className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-[#EAF7EE] border-[#0D6838] shadow-xs ring-2 ring-[#0D6838]/20 scale-[1.01]'
                        : 'bg-[#FAF8F5] border-stone-200 hover:bg-emerald-50/50 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-2xl bg-white border-2 border-[#0D6838]/40 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
                          {pet.fotoUrl || (pet.fotosPet && pet.fotosPet[0]) ? (
                            <img src={pet.fotoUrl || pet.fotosPet[0]} alt={pet.nomeAnimal} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-2xl select-none">{getEmoji(pet)}</span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="font-black text-base text-stone-900 truncate leading-tight">{pet.nomeAnimal}</p>
                          <p className="text-xs text-stone-500 font-bold mt-0.5">
                            {pet.especie} • {pet.raca || 'SRD'} • {pet.sexo === 'Fêmea' ? '♀ Fêmea' : '♂ Macho'}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-xs font-black text-stone-800 font-mono tracking-wider shadow-xs">
                          {petIdTag}
                        </span>
                      </div>
                    </div>

                    {/* Microchip com alto contraste e Selo de Categoria */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-200/60 flex-wrap">
                      <span className="text-xs font-mono font-black text-slate-950 bg-white px-2.5 py-1 rounded-lg border border-emerald-300 tracking-wider">
                        🔍 {pet.microchip}
                      </span>
                      <PetCategoryBadge pet={pet} size="sm" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center text-stone-500 text-xs">
              <p className="font-bold text-stone-700">Nenhum animal encontrado com esses filtros.</p>
              <button
                onClick={resetFilters}
                className="mt-2 text-[#0D6838] font-black hover:underline"
              >
                Limpar filtros e ver todos
              </button>
            </div>
          )}

        </div>

        {/* ======================================================== */}
        {/* COLUNA 3: FICHA CADASTRAL DETALHADA (5 cols)           */}
        {/* ======================================================== */}
        <div className={`lg:col-span-5 bg-white p-6 sm:p-7 rounded-[2.5rem] border-3 border-stone-200 shadow-md relative ${
          mobileTab !== 'ficha' ? 'hidden lg:block' : 'block'
        }`}>
          
          {selectedPet ? (
            <div className="space-y-6">
              
              {/* Barra de Ações Superiores da Ficha */}
              <div className="flex items-center justify-between pb-3 border-b-2 border-stone-100">
                
                {/* No mobile, botão Voltar para lista */}
                <button
                  onClick={() => setMobileTab('lista')}
                  className="lg:hidden flex items-center gap-1 text-xs font-black text-white bg-[#0D6838] px-3 py-1.5 rounded-2xl"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Voltar à lista</span>
                </button>

                <span className="hidden lg:flex items-center gap-1.5 text-xs font-black text-stone-600">
                  <ShieldCheck className="w-4 h-4 text-[#0D6838]" />
                  <span>Ficha Cadastral Oficial • Padrão CIGAMVALI</span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowQrModal(true)}
                    className="px-4 py-2 rounded-2xl text-xs font-black text-[#1C1917] bg-[#F9C72C] hover:bg-[#F8BE12] border-b-2 border-[#C69205] active:border-b-0 active:translate-y-0.5 transition-all flex items-center gap-1.5 shadow-xs"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Ver QR Code 🏅</span>
                  </button>

                  <button
                    onClick={() => onOpenPetCard(selectedPet)}
                    className="px-3.5 py-2 rounded-2xl text-xs font-bold text-white bg-[#0D6838] hover:bg-[#16874E] rounded-2xl transition-colors flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5 text-white" />
                    <span>Carteirinha</span>
                  </button>
                </div>
              </div>

              {/* Título da Ficha e Selo de Categoria */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-black text-stone-900 tracking-tight">Ficha Cadastral 🐾</h2>
                  <p className="text-xs sm:text-sm text-stone-500 font-bold">Registro oficial do município de Itaiópolis</p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <PetCategoryBadge pet={selectedPet} size="md" />
                  <span className="text-xs font-black font-mono text-[#0D6838] bg-[#EAF7EE] border border-emerald-300 px-2.5 py-1 rounded-xl tracking-wider shadow-2xs">
                    {formatPetId(selectedPet)}
                  </span>
                </div>
              </div>

              {/* Grade de Dados com fundo acolhedor e alta legibilidade */}
              <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-xs sm:text-sm border-t-2 border-stone-100 pt-4">
                
                {/* Prefeitura */}
                <div className="bg-[#FAF8F5] p-3 rounded-2xl border-2 border-stone-200/80">
                  <p className="text-stone-500 font-bold text-xs mb-1">Prefeitura</p>
                  <span className="inline-block px-3 py-0.5 rounded-full bg-[#0D6838] text-white font-black text-xs">
                    Itaiópolis - SC
                  </span>
                </div>

                {/* Responsável (CPF/CNPJ) */}
                <div className="bg-[#FAF8F5] p-3 rounded-2xl border-2 border-stone-200/80">
                  <p className="text-stone-500 font-bold text-xs mb-1">Responsável (Tutor)</p>
                  <div className="inline-block px-3 py-1 rounded-xl bg-[#FEF9C3] text-stone-950 font-black text-xs sm:text-sm border border-[#F9C72C] shadow-xs max-w-full truncate">
                    <p className="truncate font-black">{selectedPet.nomeTutor || 'Tutor Municipal'}</p>
                    <p className="text-xs font-mono text-stone-600">
                      {selectedPet.cpfTutor || 'Cadastro Oficial'}
                    </p>
                  </div>
                </div>

                {/* Relação do responsável */}
                <div className="bg-[#FAF8F5] p-3 rounded-2xl border-2 border-stone-200/80">
                  <p className="text-stone-500 font-bold text-xs">Relação</p>
                  <p className="font-black text-stone-900 mt-0.5 text-xs sm:text-sm">Tutor Responsável</p>
                </div>

                {/* Data da microchipagem */}
                <div className="bg-[#FAF8F5] p-3 rounded-2xl border-2 border-stone-200/80">
                  <p className="text-stone-500 font-bold text-xs">Data da Microchipagem</p>
                  <p className="font-black text-stone-900 mt-0.5 text-xs sm:text-sm">
                    {selectedPet.dataProcedimento || new Date(selectedPet.criadoEm).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                {/* Número do chip com Alto Contraste */}
                <div className="col-span-2 p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 shadow-2xs">
                  <p className="text-stone-700 font-extrabold text-xs">Número Oficial do Chip (15 Dígitos)</p>
                  <p className="font-mono font-black text-base sm:text-lg text-slate-950 tracking-wider mt-1 bg-white px-3 py-1.5 rounded-xl border border-emerald-300 shadow-2xs select-all">
                    {selectedPet.microchip || 'Pendente'}
                  </p>
                </div>

                {/* Nome do animal */}
                <div className="bg-[#FAF8F5] p-3 rounded-2xl border-2 border-stone-200/80">
                  <p className="text-stone-500 font-bold text-xs">Nome do Animal</p>
                  <p className="font-black text-sm sm:text-base text-stone-900 mt-0.5">{selectedPet.nomeAnimal}</p>
                </div>

                {/* Espécie */}
                <div className="bg-[#FAF8F5] p-3 rounded-2xl border-2 border-stone-200/80">
                  <p className="text-stone-500 font-bold text-xs">Espécie</p>
                  <p className="font-black text-stone-900 mt-0.5 text-xs sm:text-sm flex items-center gap-1.5">
                    <span>{getEmoji(selectedPet)}</span>
                    <span>{selectedPet.especie === 'Canino' ? 'Cão' : selectedPet.especie === 'Felino' ? 'Gato' : selectedPet.especie}</span>
                  </p>
                </div>

                {/* Raça */}
                <div className="bg-[#FAF8F5] p-3 rounded-2xl border-2 border-stone-200/80">
                  <p className="text-stone-500 font-bold text-xs">Raça</p>
                  <p className="font-black text-stone-900 mt-0.5 text-xs sm:text-sm">{selectedPet.raca || 'SRD'}</p>
                </div>

                {/* Sexo */}
                <div className="bg-[#FAF8F5] p-3 rounded-2xl border-2 border-stone-200/80">
                  <p className="text-stone-500 font-bold text-xs">Sexo</p>
                  <p className="font-black text-stone-900 mt-0.5 text-xs sm:text-sm">{selectedPet.sexo || 'Não informado'}</p>
                </div>

                {/* Porte */}
                <div className="bg-[#FAF8F5] p-3 rounded-2xl border-2 border-stone-200/80">
                  <p className="text-stone-500 font-bold text-xs">Porte</p>
                  <p className="font-black text-stone-900 mt-0.5 text-xs sm:text-sm">{getPorteDisplay(selectedPet)}</p>
                </div>

                {/* Pelagem */}
                <div className="bg-[#FAF8F5] p-3 rounded-2xl border-2 border-stone-200/80">
                  <p className="text-stone-500 font-bold text-xs">Pelagem</p>
                  <p className="font-black text-stone-900 mt-0.5 text-xs sm:text-sm">Curta / Média</p>
                </div>

                {/* Bairro / Localidade */}
                <div className="bg-[#FAF8F5] p-3 rounded-2xl border-2 border-stone-200/80">
                  <p className="text-stone-500 font-bold text-xs">Bairro / Localidade</p>
                  <p className="font-black text-stone-900 mt-0.5 text-xs sm:text-sm">📍 {selectedPet.bairro || 'Itaiópolis'}</p>
                </div>

                {/* Castrado */}
                <div className="bg-[#FAF8F5] p-3 rounded-2xl border-2 border-stone-200/80">
                  <p className="text-stone-500 font-bold text-xs">Castrado</p>
                  <p className="font-black text-[#0D6838] mt-0.5 text-xs sm:text-sm">✓ Sim (Castração Oficial)</p>
                </div>

                {/* Data de castração */}
                <div className="bg-[#FAF8F5] p-3 rounded-2xl border-2 border-stone-200/80">
                  <p className="text-stone-500 font-bold text-xs">Data de Castração</p>
                  <p className="font-black text-stone-900 mt-0.5 text-xs sm:text-sm">
                    {selectedPet.dataProcedimento || new Date(selectedPet.criadoEm).toLocaleDateString('pt-BR')}
                  </p>
                </div>

                {/* Data de Cadastro */}
                <div className="bg-[#FAF8F5] p-3 rounded-2xl border-2 border-stone-200/80">
                  <p className="text-stone-500 font-bold text-xs">Data de Cadastro</p>
                  <p className="font-black text-stone-900 mt-0.5 text-xs sm:text-sm">
                    {selectedPet.dataProcedimento || new Date(selectedPet.criadoEm).toLocaleDateString('pt-BR')}
                  </p>
                </div>

              </div>

              {/* Seção Histórico */}
              <div className="border-t-2 border-stone-100 pt-4 space-y-1.5">
                <h4 className="font-black text-xs uppercase tracking-wide text-stone-700">Histórico do Mutirão</h4>
                <p className="text-xs sm:text-sm text-stone-600 bg-[#FAF8F5] p-3.5 rounded-2xl border-2 border-stone-200 leading-relaxed font-medium">
                  Registrado por <strong className="text-stone-900">Secretaria de Meio Ambiente de Itaiópolis</strong> sob senha de atendimento <strong className="text-stone-900">{selectedPet.senhaAtendimento || 'Oficial'}</strong>. Procedimento registrado em mutirão oficial de castração e microchipagem animal.
                </p>
              </div>

              {/* Botão de abrir carteirinha completa */}
              <button
                onClick={() => onOpenPetCard(selectedPet)}
                className="w-full min-h-[44px] py-4 rounded-2xl font-black text-xs sm:text-sm text-white bg-[#0D6838] hover:bg-[#16874E] border-b-4 border-[#084725] active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <PawPrint className="w-4 h-4" />
                <span>Emitir Carteira de Identificação Animal ✨</span>
              </button>

            </div>
          ) : (
            <div className="py-24 text-center text-stone-400 text-xs">
              <PawPrint className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="font-bold">Selecione um animal na lista para ver a Ficha Cadastral.</p>
            </div>
          )}

        </div>

      </div>

      {/* MODAL DE QR CODE FLUTUANTE */}
      {showQrModal && selectedPet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-xs bg-[#FAF8F5] rounded-[2.5rem] p-6 sm:p-7 shadow-2xl border-4 border-[#0D6838] text-center space-y-4 text-stone-900">
            
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white hover:bg-stone-100 text-stone-500 hover:text-stone-900 border border-stone-300 flex items-center justify-center font-black"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Cabeçalho do Card Flutuante */}
            <div className="flex items-center justify-center gap-1.5 text-[#0D6838] font-black text-sm pt-1">
              <PawPrint className="w-4 h-4 text-[#0D6838]" />
              <span>itapet.gov.br/{formatPetId(selectedPet)}</span>
            </div>

            {/* O Grande QR Code com Avatar no Centro */}
            <div className="relative inline-block p-4 rounded-2xl bg-white border-2 border-stone-200 shadow-inner">
              {floatingQrUrl ? (
                <img src={floatingQrUrl} alt="QR Code" className="w-48 h-48 mx-auto rounded-lg" />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center bg-stone-50 text-stone-700 font-bold">Carregando...</div>
              )}

              {/* Avatar central no QR Code */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border-2 border-[#0D6838] shadow-md flex items-center justify-center text-xl">
                {getEmoji(selectedPet)}
              </div>
            </div>

            {/* Nome do Animal e Microchip */}
            <div className="space-y-0.5">
              <h3 className="text-xl font-black text-stone-900 tracking-wider uppercase">
                {selectedPet.nomeAnimal} 🐾
              </h3>
              <p className="text-xs font-mono font-black text-[#0D6838]">
                {selectedPet.microchip}
              </p>
            </div>

            <p className="text-xs text-stone-500 font-bold leading-tight">
              Prefeitura de Itaiópolis • Secretaria de Meio Ambiente
            </p>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-3 rounded-2xl font-black text-xs text-[#1C1917] bg-[#F9C72C] hover:bg-[#F8BE12] border-b-4 border-[#C69205] active:border-b-0 active:translate-y-1 transition-all shadow-xs"
            >
              Fechar
            </button>

          </div>
        </div>
      )}

    </div>
  );
};
