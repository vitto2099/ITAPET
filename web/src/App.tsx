import React, { useState, useEffect, Suspense, lazy } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { searchPetByMicrochip, fetchAllPetsForAdmin } from './services/petService';
import { PetRegistration } from './types';
import { PawPrint, MapPin, Phone, Home, Search, Syringe, UserCheck, Stethoscope, Loader2, TrendingUp } from 'lucide-react';
import { ItaiopolisCoatOfArms } from './components/ItaiopolisCoatOfArms';

// Lazy loading de módulos pesados e modais
const CitizenDashboard = lazy(() => import('./components/CitizenDashboard').then(m => ({ default: m.CitizenDashboard })));
const AdminDashboard = lazy(() => import('./components/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const PetRegistrationWizard = lazy(() => import('./components/PetRegistrationWizard').then(m => ({ default: m.PetRegistrationWizard })));
const AnimalExplorer = lazy(() => import('./components/AnimalExplorer').then(m => ({ default: m.AnimalExplorer })));
const PetCardModal = lazy(() => import('./components/PetCardModal').then(m => ({ default: m.PetCardModal })));
const PublicSearchModal = lazy(() => import('./components/PublicSearchModal').then(m => ({ default: m.PublicSearchModal })));
const AuthModal = lazy(() => import('./components/AuthModal').then(m => ({ default: m.AuthModal })));
const CastrationRequestModal = lazy(() => import('./components/CastrationRequestModal').then(m => ({ default: m.CastrationRequestModal })));
const ExecutiveDashboardModal = lazy(() => import('./components/ExecutiveDashboardModal').then(m => ({ default: m.ExecutiveDashboardModal })));

function ComponentFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-emerald-800">
      <Loader2 className="w-8 h-8 animate-spin text-[#0D6838] mb-3" />
      <p className="text-xs font-bold text-stone-600 tracking-wide uppercase">Carregando módulo ItaPet...</p>
    </div>
  );
}

function AppContent() {
  const { user, role } = useAuth();
  const [currentView, setCurrentView] = useState<'home' | 'citizen' | 'admin' | 'cadastrar-pet' | 'explorer'>('home');
  
  // Modais
  const [cardModalPet, setCardModalPet] = useState<PetRegistration | null>(null);
  const [isPublicSearchOpen, setIsPublicSearchOpen] = useState(false);
  const [isCastrationModalOpen, setIsCastrationModalOpen] = useState(false);
  const [isExecutiveStatsOpen, setIsExecutiveStatsOpen] = useState(false);
  const [allPetsForStats, setAllPetsForStats] = useState<PetRegistration[]>([]);
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'login' | 'register' }>({
    isOpen: false,
    mode: 'login'
  });

  // Carregar animais para métricas e indicadores
  useEffect(() => {
    fetchAllPetsForAdmin().then(pets => {
      if (pets && pets.length > 0) {
        setAllPetsForStats(pets);
      }
    }).catch(console.warn);
  }, []);

  // Checar URL param para consulta de QR Code ao abrir a página
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const chipParam = params.get('consulta');
    if (chipParam) {
      searchPetByMicrochip(chipParam).then(pet => {
        if (pet) {
          setCardModalPet(pet);
        } else {
          setIsPublicSearchOpen(true);
        }
      });
    }
  }, []);

  // Se o usuário logar, direciona para o painel correspondente
  useEffect(() => {
    if (user) {
      if (role === 'admin' && currentView === 'home') {
        setCurrentView('admin');
      } else if (role === 'citizen' && currentView === 'home') {
        setCurrentView('citizen');
      }
    }
  }, [user, role]);

  const handleCastrationSuccess = (ticket: string) => {
    alert(`Solicitação de castração enviada com sucesso!\nSua senha de agendamento é: ${ticket}\nA Secretaria de Meio Ambiente entrará em contato via WhatsApp com a data e horário.`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-800 selection:bg-[#F9C72C] selection:text-stone-900 font-sans">
      
      {/* Navbar Superior */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view as any)}
        onOpenPublicSearch={() => setIsPublicSearchOpen(true)}
        onOpenCastration={() => setIsCastrationModalOpen(true)}
        onOpenAuthModal={(mode) => setAuthModal({ isOpen: true, mode })}
        onOpenExecutiveStats={() => setIsExecutiveStatsOpen(true)}
      />

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-24 lg:pb-16">
        <Suspense fallback={<ComponentFallback />}>
          {currentView === 'home' && (
            <LandingPage
              onCadastrarPet={() => {
                if (user) {
                  setCurrentView('cadastrar-pet');
                } else {
                  setAuthModal({ isOpen: true, mode: 'register' });
                }
              }}
              onConsultarMicrochip={() => setIsPublicSearchOpen(true)}
              onLoginCidadao={() => {
                if (user && role === 'citizen') {
                  setCurrentView('citizen');
                } else {
                  setAuthModal({ isOpen: true, mode: 'login' });
                }
              }}
              onLoginVeterinario={() => {
                if (user && role === 'admin') {
                  setCurrentView('admin');
                } else {
                  setAuthModal({ isOpen: true, mode: 'login' });
                }
              }}
              onSearchChipDirectly={(chip) => {
                searchPetByMicrochip(chip).then(pet => {
                  if (pet) {
                    setCardModalPet(pet);
                  } else {
                    setIsPublicSearchOpen(true);
                  }
                });
              }}
            />
          )}

          {currentView === 'explorer' && (
            <AnimalExplorer
              onOpenPetCard={(pet) => setCardModalPet(pet)}
              onOpenVetLogin={() => {
                if (user && role === 'admin') {
                  setCurrentView('admin');
                } else {
                  setAuthModal({ isOpen: true, mode: 'login' });
                }
              }}
              onGoToCitizen={() => {
                if (user) {
                  setCurrentView('citizen');
                } else {
                  setAuthModal({ isOpen: true, mode: 'login' });
                }
              }}
            />
          )}

          {currentView === 'citizen' && (
            <CitizenDashboard
              onCadastrarNovo={() => setCurrentView('cadastrar-pet')}
              onOpenPetCard={(pet) => setCardModalPet(pet)}
            />
          )}

          {currentView === 'admin' && (
            <AdminDashboard
              onOpenPetCard={(pet) => setCardModalPet(pet)}
            />
          )}

          {currentView === 'cadastrar-pet' && (
            <PetRegistrationWizard
              onSuccess={() => setCurrentView('citizen')}
              onCancel={() => setCurrentView(user ? 'citizen' : 'home')}
            />
          )}
        </Suspense>
      </main>

      {/* Barra de Navegação Inferior Fixa para Celulares (Ergonômica & Fiel ao Design System) */}
      <nav aria-label="Navegação Rápida no Celular" className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t-2 border-stone-200 px-3 py-2 flex items-center justify-around shadow-[0_-6px_25px_rgba(0,0,0,0.08)]">
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-2xl transition-all ${
            currentView === 'home'
              ? 'text-[#0D6838] bg-[#EAF7EE] border-2 border-[#0D6838] font-black shadow-xs scale-105'
              : 'text-stone-500 hover:text-stone-800 font-bold'
          }`}
        >
          <Home className="w-5 h-5 text-[#0D6838]" />
          <span className="text-[11px]">Início</span>
        </button>

        {role === 'admin' ? (
          <button
            onClick={() => setCurrentView('explorer')}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-2xl transition-all ${
              currentView === 'explorer'
                ? 'text-[#0284C7] bg-[#E0F2FE] border-2 border-[#0284C7] font-black shadow-xs scale-105'
                : 'text-stone-500 hover:text-stone-800 font-bold'
            }`}
          >
            <Search className="w-5 h-5 text-[#0284C7]" />
            <span className="text-[11px]">Base 822</span>
          </button>
        ) : (
          <button
            onClick={() => setIsPublicSearchOpen(true)}
            className="flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-2xl text-stone-500 hover:text-[#0284C7] font-bold transition-all"
          >
            <Search className="w-5 h-5 text-[#0284C7]" />
            <span className="text-[11px]">Buscar Chip</span>
          </button>
        )}

        <button
          onClick={() => setIsCastrationModalOpen(true)}
          className="flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-2xl text-stone-600 hover:text-rose-600 font-bold transition-all"
        >
          <Syringe className="w-5 h-5 text-rose-500" />
          <span className="text-[11px]">Castração</span>
        </button>

        <button
          onClick={() => {
            if (user) {
              setCurrentView('citizen');
            } else {
              setAuthModal({ isOpen: true, mode: 'login' });
            }
          }}
          className={`flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-2xl transition-all ${
            currentView === 'citizen'
              ? 'text-amber-950 bg-[#FEF9C3] border-2 border-[#F9C72C] font-black shadow-xs scale-105'
              : 'text-stone-500 hover:text-stone-800 font-bold'
          }`}
        >
          <PawPrint className="w-5 h-5 text-[#D97706]" />
          <span className="text-[11px]">Meus Pets</span>
        </button>

        {role === 'admin' ? (
          <button
            onClick={() => setCurrentView('admin')}
            className={`flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-2xl transition-all ${
              currentView === 'admin'
                ? 'text-[#0D6838] bg-[#EAF7EE] border-2 border-[#0D6838] font-black shadow-xs scale-105'
                : 'text-stone-500 hover:text-stone-800 font-bold'
            }`}
          >
            <Stethoscope className="w-5 h-5 text-[#0D6838]" />
            <span className="text-xs">Mesa Vet</span>
          </button>
        ) : (
          <button
            onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
            className="flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-2xl text-stone-500 hover:text-[#0D6838] font-bold transition-all"
            title="Acesso Técnico Municipal (Secretaria de Meio Ambiente)"
          >
            <UserCheck className="w-5 h-5 text-stone-400" />
            <span className="text-xs">Entrar</span>
          </button>
        )}
      </nav>

      {/* Rodapé Oficial da Prefeitura de Itaiópolis */}
      <footer className="mt-auto bg-[#F4EFEA] text-stone-600 py-12 border-t-2 border-stone-200 text-xs mb-16 lg:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 text-stone-900 font-black text-lg mb-2">
              <ItaiopolisCoatOfArms size={36} />
              <div>
                <span>ItaPet • SinPatinhas</span>
                <p className="text-[11px] font-bold text-[#0D6838]">Prefeitura de Itaiópolis - SC</p>
              </div>
            </div>
            <p className="text-stone-600 leading-relaxed font-medium">
              Amor, proteção e cidadania para os animais de Itaiópolis. Sistema de Identificação e Controle de Zoonoses da Secretaria de Agricultura e Meio Ambiente.
            </p>
          </div>

          <div>
            <p className="text-stone-900 font-extrabold text-sm mb-2">Secretaria de Agricultura e Meio Ambiente</p>
            <p className="flex items-center gap-2 text-stone-600 mb-1 font-medium">
              <MapPin className="w-4 h-4 text-[#0D6838] shrink-0" />
              <span>Praça Roberto Ehlke, Centro - Itaiópolis - SC</span>
            </p>
            <p className="flex items-center gap-2 text-stone-600 font-medium">
              <Phone className="w-4 h-4 text-[#0D6838] shrink-0" />
              <span>(47) 3652-2211 • Atendimento Oficial</span>
            </p>
          </div>

          <div>
            <p className="text-stone-900 font-extrabold text-sm mb-2">Segurança & Privacidade LGPD</p>
            <p className="text-stone-600 leading-relaxed font-medium">
              Todos os dados dos munícipes e animais são protegidos e tratados conforme a Lei nº 13.709/2018 (LGPD), assegurando privacidade total aos cidadãos.
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-stone-300 text-center text-stone-500 text-xs font-semibold">
          🌲 Feito com carinho para os animais de Itaiópolis • © {new Date().getFullYear()} ItaPet / SinPatinhas Municipal
        </div>
      </footer>

      {/* Modais Globais Carregados Sob Demanda */}
      <Suspense fallback={null}>
        {cardModalPet && (
          <PetCardModal
            pet={cardModalPet}
            onClose={() => setCardModalPet(null)}
          />
        )}

        {isPublicSearchOpen && (
          <PublicSearchModal
            isOpen={isPublicSearchOpen}
            onClose={() => setIsPublicSearchOpen(false)}
            onSelectPet={(pet) => setCardModalPet(pet)}
          />
        )}

        {isCastrationModalOpen && (
          <CastrationRequestModal
            isOpen={isCastrationModalOpen}
            onClose={() => setIsCastrationModalOpen(false)}
            onSuccess={handleCastrationSuccess}
          />
        )}

        {authModal.isOpen && (
          <AuthModal
            isOpen={authModal.isOpen}
            initialMode={authModal.mode}
            onClose={() => setAuthModal({ isOpen: false, mode: 'login' })}
            onSuccess={() => {
              if (role === 'admin') setCurrentView('admin');
              else setCurrentView('citizen');
            }}
          />
        )}

        {isExecutiveStatsOpen && (
          <ExecutiveDashboardModal
            isOpen={isExecutiveStatsOpen}
            onClose={() => setIsExecutiveStatsOpen(false)}
            pets={allPetsForStats}
          />
        )}
      </Suspense>

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
