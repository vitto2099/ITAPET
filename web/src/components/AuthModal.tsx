import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { isValidCPF } from '../utils/cpfValidator';
import { X, PawPrint, Lock, UserCheck, Sparkles, AlertCircle, ShieldCheck, Stethoscope, CheckCircle2 } from 'lucide-react';
import { ItaiopolisCoatOfArms } from './ItaiopolisCoatOfArms';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess
}) => {
  const { login, registerWithCpf } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form states: Apenas CPF e Senha
  const [cpf, setCpf] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');

  if (!isOpen) return null;

  const cleanCpfDigits = cpf.replace(/\D/g, '');
  const isCpfComplete = cleanCpfDigits.length === 11;
  const isCpfValid = isCpfComplete && isValidCPF(cpf);

  const formatCpfInput = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    if (raw.length <= 3) return raw;
    if (raw.length <= 6) return `${raw.slice(0, 3)}.${raw.slice(3)}`;
    if (raw.length <= 9) return `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6)}`;
    return `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6, 9)}-${raw.slice(9, 11)}`;
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCpfInput(e.target.value));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validação Oficial do Algoritmo Módulo 11 da Receita Federal
    if (!isValidCPF(cpf)) {
      setErrorMsg('CPF inválido! Por favor, informe um CPF autêntico com os dígitos verificadores corretos segundo a Receita Federal (ex: 000.000.000-00 não é aceito).');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'login') {
        await login(cpf, password);
      } else {
        await registerWithCpf(cpf, password, nome);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Falha ao autenticar com CPF e Senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-md bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col">
        
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
              <span className="font-bold text-sm sm:text-base text-white tracking-tight block">
                {mode === 'login' ? 'Entrar com CPF 🐾' : 'Criar Cadastro com CPF ✨'}
              </span>
              <span className="text-xs text-emerald-100">
                Acesso aos seus bichinhos • Itaiópolis
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Seletor de Modo */}
        <div className="flex p-1.5 bg-slate-100 border-b border-slate-200 text-xs font-bold gap-1">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-white text-slate-900 shadow-xs font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Entrar com CPF
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMsg(''); }}
            className={`flex-1 py-2 rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-white text-slate-900 shadow-xs font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Novo Cadastro (CPF)
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[85vh] space-y-4">
          
          <div className="p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-200 text-xs font-bold text-amber-950 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <span>
              {mode === 'register' 
                ? 'Cadastro focado e rápido: informe apenas seu CPF e crie sua senha de 6 dígitos para cuidar do seu pet!'
                : 'Área segura do munícipe: você vê exclusivamente os bichinhos vinculados ao seu CPF.'}
            </span>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border-2 border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* CPF */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-black text-stone-700 uppercase tracking-wider">
                  Seu CPF *
                </label>
                {isCpfComplete && (
                  <span className={`text-xs font-black flex items-center gap-1 ${isCpfValid ? 'text-emerald-700' : 'text-rose-600'}`}>
                    {isCpfValid ? '✓ CPF Válido (Receita Federal)' : '✕ CPF Inválido'}
                  </span>
                )}
              </div>
              <input
                type="text"
                required
                placeholder="000.000.000-00"
                value={cpf}
                onChange={handleCpfChange}
                maxLength={14}
                className={`w-full px-4 py-3 min-h-[44px] rounded-2xl bg-white border-2 font-mono text-sm tracking-wider text-stone-900 placeholder-stone-400 font-black outline-none shadow-xs transition-all ${
                  isCpfComplete 
                    ? isCpfValid 
                      ? 'border-emerald-500 focus:border-emerald-600 bg-emerald-50/20' 
                      : 'border-rose-400 focus:border-rose-500 bg-rose-50/20'
                    : 'border-stone-300 focus:border-amber-500'
                }`}
              />
              {isCpfComplete && !isCpfValid && (
                <p className="text-xs font-bold text-rose-600 mt-1">
                  O CPF informado não passou no cálculo oficial dos dígitos verificadores.
                </p>
              )}
            </div>

            {/* Nome do Munícipe (Opcional no cadastro) */}
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5">
                  Seu Nome (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Maria Aparecida"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full px-4 py-3 min-h-[44px] rounded-2xl bg-white border-2 border-stone-300 text-xs sm:text-sm font-bold text-stone-900 placeholder-stone-400 focus:border-amber-500 outline-none shadow-xs transition-all"
                />
              </div>
            )}

            {/* Senha */}
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-1.5">
                Senha * (Mínimo 6 dígitos)
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 min-h-[44px] rounded-2xl bg-white border-2 border-stone-300 text-sm font-bold text-stone-900 placeholder-stone-400 focus:border-amber-500 outline-none shadow-xs transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !cpf || !password || (isCpfComplete && !isCpfValid)}
              className="w-full py-4 min-h-[44px] rounded-2xl font-black text-sm text-[#1C1917] bg-[#F9C72C] hover:bg-[#F8BE12] border-b-4 border-[#C69205] active:border-b-0 active:translate-y-1 shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <UserCheck className="w-5 h-5" />
              <span>
                {loading 
                  ? 'Verificando...' 
                  : mode === 'login' 
                    ? 'Acessar Meus Bichinhos 🚀' 
                    : 'Concluir Cadastro com CPF ✨'}
              </span>
            </button>
          </form>

          {/* Atalho alternar modo */}
          <div className="text-center pt-2 border-t-2 border-stone-200 text-xs font-bold text-stone-600">
            {mode === 'login' ? (
              <p>
                Não tem cadastro ainda?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('register'); setErrorMsg(''); }}
                  className="font-black text-amber-700 hover:underline min-h-[44px] inline-flex items-center"
                >
                  Cadastre-se com seu CPF
                </button>
              </p>
            ) : (
              <p>
                Já cadastrou seu CPF?{' '}
                <button
                  type="button"
                  onClick={() => { setMode('login'); setErrorMsg(''); }}
                  className="font-black text-amber-700 hover:underline min-h-[44px] inline-flex items-center"
                >
                  Fazer login aqui
                </button>
              </p>
            )}
          </div>

          {/* Informação Institucional Oficial */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Acesso Oficial com Proteção LGPD • Itaiópolis - SC</span>
            </div>
            <p className="leading-relaxed">
              O acesso por CPF é individual e confidencial: você visualiza e gerencia exclusivamente os seus próprios animais. A equipe técnica da Secretaria de Agricultura e Meio Ambiente gerencia a homologação geral e o agendamento de castrações.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
