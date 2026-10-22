import React, { useState, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';
import { 
  PawPrint, 
  ShieldCheck, 
  Search, 
  QrCode, 
  Syringe, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2, 
  Heart,
  Building2,
  Calendar,
  MapPin,
  ArrowRight,
  Shield,
  Smartphone,
  FileCheck2,
  HelpCircle,
  Award,
  Camera,
  Filter
} from 'lucide-react';
import { BAIRROS_ITAIOPOLIS } from '../constants/bairros';
import { PamphletPetIllustration } from './PamphletPetIllustration';
import { BarcodeScannerModal } from './BarcodeScannerModal';
import { PetRegistration } from '../types';
import { PetCategoryBadge, isPetMutirao } from './PetCategoryBadge';
import { getHistoricalPets } from '../services/petService';
import { getPetAvatarEmoji } from '../utils/petEmoji';

interface LandingPageProps {
  onCadastrarPet: () => void;
  onConsultarMicrochip: () => void;
  onLoginCidadao: () => void;
  onLoginVeterinario: () => void;
  onSearchChipDirectly?: (chip: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onCadastrarPet,
  onConsultarMicrochip,
  onLoginCidadao,
  onLoginVeterinario,
  onSearchChipDirectly
}) => {
  const [directSearchChip, setDirectSearchChip] = useState('');
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isCameraScannerOpen, setIsCameraScannerOpen] = useState(false);
  const [sampleSpecies, setSampleSpecies] = useState<'Todos' | 'Canino' | 'Felino'>('Todos');
  const [sampleOrigem, setSampleOrigem] = useState<'Todos' | 'mutirao' | 'online'>('Todos');
  const [realPets, setRealPets] = useState<PetRegistration[]>([]);
  const [landingQrUrl, setLandingQrUrl] = useState<string>('');

  useEffect(() => {
    getHistoricalPets().then(data => {
      if (data && data.length > 0) {
        setRealPets(data);
      }
    }).catch(console.error);

    // Gerar QR Code Oficial e Escaneável para a página inicial
    QRCode.toDataURL(window.location.origin, {
      width: 220,
      margin: 1,
      color: {
        dark: '#0B4F8A',
        light: '#FFFFFF'
      }
    })
      .then(url => setLandingQrUrl(url))
      .catch(err => console.error("Erro ao gerar QR Code:", err));
  }, []);

  const filteredSamplePets = useMemo(() => {
    // 1. Filtrar pela origem (se selecionado mutirão ou online)
    const baseList = realPets.filter((pet) => {
      if (sampleOrigem === 'mutirao' && !isPetMutirao(pet)) return false;
      if (sampleOrigem === 'online' && isPetMutirao(pet)) return false;
      return true;
    });

    if (sampleSpecies === 'Canino') {
      return baseList
        .filter((p) => {
          const esp = (p.especie || '').toLowerCase();
          return esp.includes('canino') || esp.includes('cão') || esp.includes('cachorro');
        })
        .slice(0, 6);
    }

    if (sampleSpecies === 'Felino') {
      return baseList
        .filter((p) => {
          const esp = (p.especie || '').toLowerCase();
          return esp.includes('felino') || esp.includes('gato');
        })
        .slice(0, 6);
    }

    // Se "Todos", cria uma amostra equilibrada de 3 cães e 3 gatos intercalados
    const caninos = baseList
      .filter((p) => {
        const esp = (p.especie || '').toLowerCase();
        return esp.includes('canino') || esp.includes('cão') || esp.includes('cachorro');
      })
      .slice(0, 3);

    const felinos = baseList
      .filter((p) => {
        const esp = (p.especie || '').toLowerCase();
        return esp.includes('felino') || esp.includes('gato');
      })
      .slice(0, 3);

    const mixed: PetRegistration[] = [];
    const maxLen = Math.max(caninos.length, felinos.length);
    for (let i = 0; i < maxLen; i++) {
      if (caninos[i]) mixed.push(caninos[i]);
      if (felinos[i]) mixed.push(felinos[i]);
    }
    return mixed.slice(0, 6);
  }, [realPets, sampleSpecies, sampleOrigem]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (directSearchChip.trim()) {
      if (onSearchChipDirectly) {
        onSearchChipDirectly(directSearchChip.trim());
      } else {
        onConsultarMicrochip();
      }
    } else {
      onConsultarMicrochip();
    }
  };

  const stepsData = [
    {
      step: 1,
      title: "Acesse o Portal",
      subtitle: "ItaPet / SinPatinhas",
      desc: "Acesse o portal oficial do município no seu celular ou computador diretamente pela web, sem necessidade de baixar aplicativos.",
      url: "sinpatinhas.mma.gov.br",
      icon: <Smartphone className="w-5 h-5 text-[#0B4F8A]" />,
      badgeClass: "bg-blue-50 text-[#0B4F8A] border-blue-200",
      stepNumClass: "bg-[#0B4F8A]"
    },
    {
      step: 2,
      title: "Faça seu Login",
      subtitle: "com CPF ou Gov.br",
      desc: "Autenticação simples e segura com seu CPF. Seus dados e os de seus animais ficam protegidos pelas normas da LGPD.",
      url: "gov.br / CPF Seguro",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-700" />,
      badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
      stepNumClass: "bg-emerald-700"
    },
    {
      step: 3,
      title: "Informe os Dados",
      subtitle: "e o Microchip de 15 Dígitos",
      desc: "Insira nome, espécie, raça, fotos e o número do microchip implantado na castração municipal (ex: 900263003760121).",
      url: "Microchip Oficial",
      icon: <Sparkles className="w-5 h-5 text-amber-700" />,
      badgeClass: "bg-amber-50 text-amber-900 border-amber-200",
      stepNumClass: "bg-amber-700"
    },
    {
      step: 4,
      title: "Emita a Carteirinha",
      subtitle: "com QR Code para Coleira",
      desc: "Receba a Carteira de Identificação Animal digital. Imprima ou fixe o QR Code na coleira do pet para identificação rápida se ele se perder.",
      url: "Carteira Digital",
      icon: <QrCode className="w-5 h-5 text-teal-700" />,
      badgeClass: "bg-teal-50 text-teal-800 border-teal-200",
      stepNumClass: "bg-teal-700"
    }
  ];

  return (
    <div className="space-y-12 py-4 sm:py-6 font-sans">
      
      {/* ========================================================
          HERO BANNER INSTITUCIONAL HARMONIOSO (AZUL + VERDE OFICIAL)
         ======================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B4F8A] via-[#094273] to-[#15803D] text-white shadow-xl shadow-slate-900/10 border border-slate-200/40">
        
        {/* Glows Decorativos de Fundo */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-sky-400/10 blur-3xl pointer-events-none" />

        {/* Cabeçalho do Banner com Selo Oficial */}
        <div className="relative z-10 pt-8 sm:pt-10 px-6 sm:px-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-emerald-100 text-xs sm:text-sm font-bold tracking-wide mb-3 shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Prefeitura Municipal de Itaiópolis • Secretaria de Agricultura e Meio Ambiente</span>
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white drop-shadow-xs">
              ORIENTAÇÃO AOS RESPONSÁVEIS
            </h1>
            <p className="text-emerald-200 font-bold text-xs sm:text-sm md:text-base tracking-wider uppercase mt-2">
              CADASTRO NO SINPATINHAS / ITAPET • CONTROLE ANIMAL MUNICIPAL
            </p>
          </div>
        </div>

        {/* Conteúdo Principal do Banner */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12 pt-4">
          
          {/* Lado Esquerdo: Mensagem Oficial e Busca */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Mensagem Institucional ao Cidadão */}
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 text-slate-100 space-y-3 shadow-inner">
              <div className="flex items-center justify-center lg:justify-start gap-2 text-amber-300">
                <Heart className="w-5 h-5 fill-amber-300 text-amber-300" />
                <h2 className="text-lg sm:text-xl font-bold text-white">Prezado Responsável,</h2>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-slate-100 font-medium">
                Após a realização da <strong>castração</strong> e da <strong>implantação do microchip</strong> em seu animal, é fundamental que o número do microchip seja cadastrado no <strong>ItaPet / SinPatinhas</strong> (Cadastro Nacional de Animais Domésticos), garantindo a correta identificação e segurança do seu cão ou gato.
              </p>
              
              <div className="flex items-center justify-center lg:justify-start gap-2 pt-1 text-xs text-emerald-200 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Serviço público, digital e 100% gratuito para toda a população de Itaiópolis.</span>
              </div>
            </div>

            {/* Barra de Busca Rápida por Microchip */}
            <div className="bg-white p-4 rounded-2xl shadow-lg border border-slate-200/80 text-slate-800 space-y-3">
              <p className="text-xs font-bold text-[#0B4F8A] px-1 flex items-center gap-1.5 uppercase tracking-wide">
                <Search className="w-4 h-4 text-[#0B4F8A]" />
                <span>Consulta Rápida de Identificação (15 dígitos)</span>
              </p>

              <form onSubmit={handleHeroSearch} className="flex flex-col sm:flex-row items-stretch gap-2.5">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Digite os 15 dígitos do microchip do seu pet..."
                    value={directSearchChip}
                    onChange={(e) => setDirectSearchChip(e.target.value)}
                    className="w-full px-4 py-3 min-h-[44px] text-xs sm:text-sm font-mono font-bold text-slate-900 placeholder:text-slate-400 bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:border-[#0B4F8A] focus:ring-2 focus:ring-blue-500/10 outline-none transition-all shadow-xs"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsCameraScannerOpen(true)}
                  className="px-4 py-3 min-h-[44px] rounded-xl font-bold text-xs sm:text-sm text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors shrink-0 flex items-center justify-center gap-1.5 shadow-2xs"
                  title="Escanear QR Code da coleira ou código de barras com a câmera"
                >
                  <Camera className="w-4 h-4 text-emerald-700" />
                  <span className="hidden sm:inline">Câmera / QR</span>
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 min-h-[44px] rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-700 hover:bg-emerald-800 transition-all shadow-xs shrink-0 flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  <span>Consultar Chip</span>
                </button>
              </form>

              {/* Exemplos Rápidos com Animais Reais Cadastrados */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 px-1 text-xs">
                <span className="text-xs font-bold text-slate-500">Exemplos reais:</span>
                <button
                  type="button"
                  onClick={() => {
                    setDirectSearchChip('900263003760121');
                    if (onSearchChipDirectly) onSearchChipDirectly('900263003760121');
                  }}
                  className="px-3 py-1.5 min-h-[36px] rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-800 hover:text-emerald-950 font-bold text-xs border border-slate-200 hover:border-emerald-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Microchip: 900263003760121"
                >
                  <span>🐈 Murisca</span>
                  <span className="font-mono text-[11px] text-slate-500 font-normal">#121</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDirectSearchChip('900263005412592');
                    if (onSearchChipDirectly) onSearchChipDirectly('900263005412592');
                  }}
                  className="px-3 py-1.5 min-h-[36px] rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-800 hover:text-emerald-950 font-bold text-xs border border-slate-200 hover:border-emerald-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Microchip: 900263005412592"
                >
                  <span>🐕 Paçoca</span>
                  <span className="font-mono text-[11px] text-slate-500 font-normal">#592</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDirectSearchChip('900263006840365');
                    if (onSearchChipDirectly) onSearchChipDirectly('900263006840365');
                  }}
                  className="px-3 py-1.5 min-h-[36px] rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-800 hover:text-emerald-950 font-bold text-xs border border-slate-200 hover:border-emerald-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title="Microchip: 900263006840365"
                >
                  <span>🐩 Belinha</span>
                  <span className="font-mono text-[11px] text-slate-500 font-normal">#365</span>
                </button>
              </div>
            </div>

            {/* Botões de Ação Principal */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <button
                onClick={onCadastrarPet}
                className="px-6 py-3.5 min-h-[44px] rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-700 hover:bg-emerald-800 shadow-md hover:shadow-lg transition-all flex items-center gap-2 group cursor-pointer"
              >
                <PawPrint className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Cadastrar Meu Animal no ItaPet</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={onLoginCidadao}
                className="px-5 py-3.5 min-h-[44px] rounded-xl font-bold text-xs sm:text-sm text-white bg-white/15 hover:bg-white/25 border border-white/25 shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Entrar com CPF</span>
              </button>
            </div>

          </div>

          {/* Lado Direito: Ilustração dos Mascotes + Mensagem Amigável */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            
            {/* Pílula Suave: "Seu pet identificado é mais seguro! ♡" */}
            <div className="z-20 -mb-4 px-4 py-2 rounded-full bg-white text-[#0B4F8A] font-bold text-xs shadow-md border border-slate-200 flex items-center gap-1.5">
              <span>Seu pet identificado é mais seguro!</span>
              <span className="text-rose-500 font-black">♡</span>
            </div>

            {/* Ilustração Vetorial dos Mascotes */}
            <div className="relative w-full max-w-sm p-4 bg-white/10 rounded-3xl border border-white/15 backdrop-blur-xs flex items-center justify-center">
              <PamphletPetIllustration className="w-full max-w-[260px] sm:max-w-[300px] drop-shadow-xl" />
            </div>

          </div>

        </div>

      </section>

      {/* ========================================================
          EXPLORAÇÃO RÁPIDA COM GRANDES FILTROS (MÓVEL & INTUITIVO)
         ======================================================== */}
      <section className="p-6 sm:p-8 rounded-[2.5rem] bg-white border-3 border-stone-200 shadow-md space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs tracking-wide uppercase border border-emerald-200 mb-2">
              <PawPrint className="w-3.5 h-3.5" />
              <span>Base Municipal de Animais • Consulta Pública</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              Consulte os Animais Registrados em Itaiópolis
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-medium">
              Filtre por espécie e categoria oficial (Mutirão Municipal ou Novos Cadastros Online)
            </p>
          </div>

          <button
            onClick={onConsultarMicrochip}
            className="px-5 py-3 min-h-[44px] rounded-2xl font-black text-xs sm:text-sm text-white bg-emerald-700 hover:bg-emerald-800 border-b-4 border-emerald-900 active:border-b-0 active:translate-y-1 shadow-md transition-all flex items-center justify-center gap-2 self-start md:self-auto"
          >
            <Search className="w-4 h-4" />
            <span>Abrir Pesquisa Geral (1.363+ Pets)</span>
          </button>
        </div>

        {/* Barra de Filtros Grandes Amigáveis para Toque */}
        <div className="p-5 rounded-3xl bg-[#FAF8F5] border-2 border-stone-200 space-y-4">
          {/* Filtro por Espécie */}
          <div className="space-y-2">
            <span className="text-xs font-black text-stone-600 uppercase tracking-wide flex items-center gap-1.5">
              <span>🐾</span>
              <span>Filtrar por Espécie:</span>
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSampleSpecies('Todos')}
                className={`min-h-[44px] px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 border-2 ${
                  sampleSpecies === 'Todos'
                    ? 'bg-stone-900 text-white border-stone-900 shadow-sm ring-2 ring-stone-900/10'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                }`}
              >
                <span>🐾</span>
                <span>Todos os Pets</span>
              </button>
              <button
                type="button"
                onClick={() => setSampleSpecies('Canino')}
                className={`min-h-[44px] px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 border-2 ${
                  sampleSpecies === 'Canino'
                    ? 'bg-amber-400 text-stone-950 border-amber-500 shadow-sm ring-2 ring-amber-400/20'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-amber-400'
                }`}
              >
                <span className="text-base">🐶🐕</span>
                <span>Cães (Caninos)</span>
              </button>
              <button
                type="button"
                onClick={() => setSampleSpecies('Felino')}
                className={`min-h-[44px] px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 border-2 ${
                  sampleSpecies === 'Felino'
                    ? 'bg-teal-500 text-white border-teal-600 shadow-sm ring-2 ring-teal-500/20'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-teal-400'
                }`}
              >
                <span className="text-base">🐱🐈</span>
                <span>Gatos (Felinos)</span>
              </button>
            </div>
          </div>

          {/* Filtro por Origem / Categoria */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <span className="text-xs font-black text-stone-600 uppercase tracking-wide flex items-center gap-1.5">
              <span>🏛️</span>
              <span>Filtrar por Origem do Cadastro:</span>
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSampleOrigem('Todos')}
                className={`min-h-[44px] px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 border-2 ${
                  sampleOrigem === 'Todos'
                    ? 'bg-stone-900 text-white border-stone-900 shadow-sm ring-2 ring-stone-900/10'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                }`}
              >
                <span>📋</span>
                <span>Todos</span>
              </button>
              <button
                type="button"
                onClick={() => setSampleOrigem('mutirao')}
                className={`min-h-[44px] px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 border-2 ${
                  sampleOrigem === 'mutirao'
                    ? 'bg-amber-100 text-amber-950 border-amber-400 shadow-sm ring-2 ring-amber-300/30'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-amber-300'
                }`}
              >
                <span>🏛️</span>
                <span>Registros Anteriores (Mutirão - 1.363)</span>
              </button>
              <button
                type="button"
                onClick={() => setSampleOrigem('online')}
                className={`min-h-[44px] px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 border-2 ${
                  sampleOrigem === 'online'
                    ? 'bg-emerald-100 text-emerald-950 border-emerald-400 shadow-sm ring-2 ring-emerald-300/30'
                    : 'bg-white text-stone-700 border-stone-200 hover:border-emerald-300'
                }`}
              >
                <span>📱</span>
                <span>Novos Cadastros Online</span>
              </button>
            </div>
          </div>
        </div>

        {/* Amostra dos Animais Filtrados */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSamplePets.map((pet) => (
            <div
              key={pet.id}
              className="p-5 rounded-3xl bg-white border-2 border-stone-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 text-stone-900 flex items-center justify-center font-bold text-2xl shrink-0 shadow-xs select-none">
                      {getPetAvatarEmoji(pet)}
                    </div>
                    <div>
                      <h4 className="font-black text-lg text-stone-900 leading-tight">{pet.nomeAnimal}</h4>
                      <p className="text-xs text-stone-500 font-bold">
                        {pet.especie} • {pet.raca || 'SRD'} • {pet.sexo}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <PetCategoryBadge pet={pet} size="sm" />
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200 space-y-1.5 text-xs font-bold text-stone-700">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Microchip:</span>
                    <span className="font-mono font-black text-emerald-950 bg-white px-2 py-0.5 rounded-lg border border-emerald-200 shadow-2xs select-all">
                      {pet.microchip}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Tutor:</span>
                    <span className="font-bold text-stone-900 truncate max-w-[150px]">{pet.nomeTutor}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-500">Bairro:</span>
                    <span className="text-stone-800 font-medium">
                      📍 {(!pet.bairro || pet.bairro.includes('Não Especificado') || pet.bairro.includes('Migração')) ? 'Itaiópolis (Mutirão Municipal)' : pet.bairro}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (pet.microchip) {
                    setDirectSearchChip(pet.microchip);
                    if (onSearchChipDirectly) {
                      onSearchChipDirectly(pet.microchip);
                    } else {
                      onConsultarMicrochip();
                    }
                  } else {
                    onConsultarMicrochip();
                  }
                }}
                className="w-full py-2.5 min-h-[44px] rounded-xl font-black text-xs text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Consultar Este Registro 🔍</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          PASSO A PASSO 1-2-3-4 INTERATIVO
         ======================================================== */}
      <section className="space-y-6">
        
        {/* Cabeçalho da Seção */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-800 font-bold text-xs tracking-wide uppercase border border-emerald-200">
            <PawPrint className="w-3.5 h-3.5" />
            <span>O Cadastro é Simples, Rápido e Seguro:</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl mx-auto">
            Siga as 4 etapas oficiais para registrar seu animalzinho e ter a documentação completa no seu bolso:
          </p>
        </div>

        {/* Grade dos 4 Passos do Panfleto */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {stepsData.map((s) => {
            const isSelected = activeStep === s.step;
            return (
              <div
                key={s.step}
                onClick={() => {
                  setActiveStep(s.step);
                  if (s.step === 1) {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else if (s.step === 2) {
                    onLoginCidadao();
                  } else if (s.step === 3) {
                    onCadastrarPet();
                  } else if (s.step === 4) {
                    onConsultarMicrochip();
                  }
                }}
                className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-200 border text-left flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-emerald-600 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-white hover:bg-slate-50 border-slate-200/80 shadow-xs hover:shadow-sm'
                }`}
              >
                {/* Indicador do Passo */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-xs ${s.stepNumClass}`}>
                    {s.step}
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                    {s.icon}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border inline-block ${s.badgeClass}`}>
                    Passo {s.step}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 leading-tight">
                    {s.title}
                  </h3>
                  <p className="text-xs font-semibold text-emerald-700">
                    {s.subtitle}
                  </p>
                  <p className="text-xs text-slate-600 font-normal leading-relaxed pt-1">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400">
                  <span className="text-xs truncate text-slate-500">{s.url}</span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'translate-x-1 text-emerald-700' : ''}`} />
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* ========================================================
          DESTAQUE DE SEGURANÇA E REENCONTRO + QR CODE
         ======================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Caixa Informativa */}
        <div className="lg:col-span-7 p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-blue-50 via-slate-50 to-emerald-50 text-slate-800 shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-[#0B4F8A] text-xs font-bold uppercase tracking-wide border border-blue-200">
              <Shield className="w-3.5 h-3.5" />
              <span>Proteção Contra Desaparecimento & Abandono</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              "O cadastro no SinPatinhas / ItaPet contribui para a identificação dos animais e aumenta as chances de reencontro entre responsáveis e seus animais em casos de desaparecimento."
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Com a identificação por microchip associada aos dados atualizados do tutor, qualquer clínica veterinária, servidor municipal ou cidadão munido de leitor ou câmera de celular consegue localizar o dono legítimo em minutos.
            </p>
          </div>

          <div className="pt-5 mt-5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-rose-500 flex items-center justify-center font-bold shadow-xs">
                ♡
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Guarda Responsável</p>
                <p className="text-xs text-slate-500">Itaiópolis mais consciente e segura</p>
              </div>
            </div>

            <button
              onClick={onCadastrarPet}
              className="px-5 py-2.5 min-h-[44px] rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-700 hover:bg-emerald-800 shadow-xs transition-all flex items-center justify-center"
            >
              Registrar Meu Companheiro 🐾
            </button>
          </div>
        </div>

        {/* QR Code de Acesso Rápido */}
        <div className="lg:col-span-5 p-7 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-3.5">
          <div className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs uppercase tracking-wide">
            Aponte a câmera do celular
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs relative">
            <div className="w-40 h-40 rounded-xl bg-white border border-slate-200 flex items-center justify-center p-2 shadow-inner">
              {landingQrUrl ? (
                <img 
                  src={landingQrUrl} 
                  alt="QR Code Oficial ItaPet Itaiópolis" 
                  className="w-36 h-36 rounded-lg object-contain"
                />
              ) : (
                <div className="w-36 h-36 flex items-center justify-center text-xs font-bold text-slate-400">
                  Gerando QR Code...
                </div>
              )}
            </div>
            
            <div className="mt-2 text-center">
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 inline-block">
                itapet.itaiopolis.sc.gov.br
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 max-w-xs font-medium">
            Emita a carteira digital e acompanhe o histórico de vacinas e castração do seu bichinho na tela do celular.
          </p>
        </div>

      </section>

      {/* ========================================================
          MÉTRICAS OFICIAIS DO MUNICÍPIO (ATUALIZADAS)
         ======================================================== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center mb-2.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-emerald-800 tracking-tight">1.363+</p>
          <h4 className="font-bold text-slate-900 text-sm mt-0.5">Animais Registrados</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Cadastros consolidados do mutirão de castração de Itaiópolis.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-amber-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center mb-2.5">
            <QrCode className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-amber-900 tracking-tight">Passaporte</p>
          <h4 className="font-bold text-slate-900 text-sm mt-0.5">Carteira com QR Code</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Identificação digital pronta para imprimir ou colar na coleira.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0B4F8A] border border-blue-200 flex items-center justify-center mb-2.5">
            <Syringe className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-[#0B4F8A] tracking-tight">Saúde Pública</p>
          <h4 className="font-bold text-slate-900 text-sm mt-0.5">Zoonoses e Castração</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Controle de doses antirrábicas e cirurgias de esterilização.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-rose-300 transition-all">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mb-2.5">
            <Heart className="w-5 h-5" />
          </div>
          <p className="text-2xl font-black text-rose-700 tracking-tight">100% Gratuito</p>
          <h4 className="font-bold text-slate-900 text-sm mt-0.5">Serviço ao Cidadão</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Iniciativa da Prefeitura de Itaiópolis por um município pet friendly.
          </p>
        </div>

      </section>

      {/* ========================================================
          BAIRROS DE ITAIÓPOLIS ATENDIDOS
         ======================================================== */}
      <section className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Atendimento em Toda a Região de Itaiópolis - SC
              </h3>
              <p className="text-xs text-slate-500">Mutirão e cadastro disponíveis para área urbana e rural:</p>
            </div>
          </div>

          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full self-start sm:self-auto">
            🌾 Cobertura Municipal Integral
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {BAIRROS_ITAIOPOLIS.map(b => (
            <span 
              key={b}
              className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium transition-colors hover:bg-slate-100 cursor-default"
            >
              📍 {b}
            </span>
          ))}
        </div>
      </section>

      {/* ========================================================
          PORTAIS DE ACESSO: CIDADÃO vs MESA TÉCNICA VETERINÁRIA
         ======================================================== */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Painel do Munícipe (Tutor) */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center">
              <PawPrint className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Área do Cidadão (Tutor) 🐾</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Consulte as carteirinhas digitais dos seus animais, solicite agendamento de castração gratuita ou vincule animais cadastrados nos mutirões de Itaiópolis.
            </p>
          </div>

          <button
            onClick={onLoginCidadao}
            className="mt-5 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex items-center justify-center gap-2"
          >
            <span>Acessar Meus Animais</span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {/* Mesa Técnica da Prefeitura (Veterinário) */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Mesa Técnica da Prefeitura 🩺</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Ambiente restrito aos médicos veterinários da Secretaria de Meio Ambiente para homologar registros, triar pedidos de castração e gerenciar a base de 1.363 animais.
            </p>
          </div>

          <button
            onClick={onLoginVeterinario}
            className="mt-5 py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm text-white bg-emerald-700 hover:bg-emerald-800 shadow-xs transition-all flex items-center justify-center gap-2"
          >
            <span>Painel do Médico Veterinário</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </section>

      {/* Slogan Final */}
      <div className="text-center pt-2 pb-2">
        <p className="text-xs sm:text-sm font-bold text-[#0B4F8A] flex items-center justify-center gap-1.5">
          <span>Juntos por um município mais consciente e pet friendly!</span>
          <span className="text-rose-500">♡</span>
          <span>🐾</span>
        </p>
      </div>

      <BarcodeScannerModal
        isOpen={isCameraScannerOpen}
        onClose={() => setIsCameraScannerOpen(false)}
        onScanSuccess={(chip) => {
          setDirectSearchChip(chip);
          if (onSearchChipDirectly) {
            onSearchChipDirectly(chip);
          } else {
            onConsultarMicrochip();
          }
        }}
      />
    </div>
  );
};
