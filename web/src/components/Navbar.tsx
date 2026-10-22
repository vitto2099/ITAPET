import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PawPrint, LogOut, Search, Stethoscope, Syringe, ShieldCheck, TrendingUp } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenPublicSearch: () => void;
  onOpenCastration: () => void;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
  onOpenExecutiveStats?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenPublicSearch,
  onOpenCastration,
  onOpenAuthModal,
  onOpenExecutiveStats
}) => {
  const { user, userData, role, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brasão Municipal de Itaiópolis & Logo Oficial ItaPet Separados com Destaque Único */}
          <div className="flex items-center gap-2.5 sm:gap-3 select-none">
            
            {/* Brasão Municipal Oficial de Itaiópolis */}
            <div 
              onClick={() => onNavigate('home')} 
              className="flex items-center gap-2.5 p-2 rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-slate-300 transition-all cursor-pointer group shrink-0"
              title="Prefeitura Municipal de Itaiópolis - SC"
            >
              <img 
                src="/brasao_itaiopolis.png" 
                alt="Brasão Oficial de Itaiópolis - SC" 
                className="h-11 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform"
              />
              <div className="hidden xl:block text-left leading-tight pr-1">
                <span className="block text-xs font-extrabold uppercase tracking-wider text-slate-400">Prefeitura</span>
                <span className="block text-xs font-bold text-slate-800">Itaiópolis - SC</span>
              </div>
            </div>

            {/* Separador Visual Discreto */}
            <div className="hidden sm:block h-8 w-px bg-slate-200" />

            {/* Logo Oficial ItaPet / SinPatinhas */}
            <div 
              onClick={() => onNavigate('home')} 
              className="flex items-center gap-2.5 p-2 rounded-2xl bg-white border border-emerald-200/90 shadow-2xs hover:shadow-xs hover:border-emerald-300 transition-all cursor-pointer group shrink-0"
              title="ItaPet - Sistema Municipal de Gestão e Identificação Animal"
            >
              <img 
                src="/logo.png" 
                alt="Logo Oficial ItaPet" 
                className="w-11 sm:w-12 h-11 sm:h-12 object-contain group-hover:scale-105 transition-transform"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-2xl tracking-tight text-[#0B4F8A]">
                    ItaPet
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 tracking-wide">
                    SinPatinhas 🐾
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-semibold">
                  Gestão Animal & Zoonoses
                </p>
              </div>
            </div>

          </div>

          {/* Links Centrais no Desktop */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                currentView === 'home' 
                  ? 'text-emerald-800 bg-emerald-50 border border-emerald-200 shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Início
            </button>

            {/* Apenas Veterinário pode ver a Base Geral com os 1.363 animais */}
            {role === 'admin' ? (
              <button
                onClick={() => onNavigate('explorer')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  currentView === 'explorer'
                    ? 'text-[#0B4F8A] bg-blue-50 border border-blue-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Acesso Técnico Municipal à Base Geral"
              >
                <Search className="w-3.5 h-3.5 text-[#0B4F8A]" />
                <span>Base Geral (1.363 Animais)</span>
              </button>
            ) : (
              <button
                onClick={onOpenPublicSearch}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-[#0B4F8A] hover:bg-slate-100 transition-colors"
                title="Consultar se um animal possui microchip"
              >
                <Search className="w-3.5 h-3.5 text-[#0B4F8A]" />
                <span>Verificar Microchip</span>
              </button>
            )}

            <button
              onClick={onOpenCastration}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-700 hover:bg-rose-50 transition-colors"
            >
              <Syringe className="w-3.5 h-3.5 text-rose-600" />
              <span>Castração Gratuita</span>
            </button>

            {/* Cidadão vê exclusivamente seus próprios pets */}
            <button
              onClick={() => {
                if (user) {
                  onNavigate('citizen');
                } else {
                  onOpenAuthModal('login');
                }
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                currentView === 'citizen'
                  ? 'text-amber-900 bg-amber-50 border border-amber-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <PawPrint className="w-3.5 h-3.5 text-amber-600" />
              <span>Meus Pets</span>
            </button>

            {/* Veterinário tem acesso ao Painel de Triagem e Vacinas */}
            {role === 'admin' && (
              <button
                onClick={() => onNavigate('admin')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  currentView === 'admin'
                    ? 'text-emerald-800 bg-emerald-50 border border-emerald-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
                <span>Mesa Veterinária</span>
              </button>
            )}

            {onOpenExecutiveStats && (
              <button
                onClick={onOpenExecutiveStats}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-emerald-800 hover:bg-emerald-50 transition-colors"
                title="Painel Executivo e Indicadores Estratégicos"
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                <span>Indicadores</span>
              </button>
            )}
          </nav>

          {/* Ações da Direita com Autenticação Real */}
          <div className="flex items-center gap-2 sm:gap-3">

            {user ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-slate-900 leading-tight">
                    {userData?.nome || (userData?.cpf ? `CPF: ${userData.cpf}` : user.email?.split('@')[0])}
                  </p>
                  <p className="text-xs text-emerald-700 font-bold">
                    {role === 'admin' ? '🩺 Médico Veterinário' : '🐾 Tutor Responsável'}
                  </p>
                </div>

                <button
                  onClick={() => logout()}
                  title="Sair"
                  className="min-h-[44px] min-w-[44px] p-2.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors flex items-center justify-center"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="min-h-[44px] px-4 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center"
                >
                  Entrar com CPF
                </button>
                <button
                  onClick={() => onOpenAuthModal('register')}
                  className="min-h-[44px] px-5 py-2.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-all flex items-center justify-center"
                >
                  Cadastrar Pet
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
