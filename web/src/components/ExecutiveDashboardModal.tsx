import React, { useMemo } from 'react';
import { X, TrendingUp, Users, HeartHandshake, ShieldCheck, Download, Award } from 'lucide-react';
import { PetRegistration } from '../types';

interface ExecutiveDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  pets: PetRegistration[];
}

export const ExecutiveDashboardModal: React.FC<ExecutiveDashboardModalProps> = ({
  isOpen,
  onClose,
  pets
}) => {
  // Métricas extraídas da base real de dados
  const stats = useMemo(() => {
    const total = pets.length;
    let caes = 0;
    let gatos = 0;
    let femeas = 0;
    let machos = 0;
    const bairrosMap: Record<string, number> = {};

    pets.forEach(p => {
      if (p.especie === 'Cachorro') caes++;
      else if (p.especie === 'Gato') gatos++;

      if (p.sexo === 'Fêmea') femeas++;
      else if (p.sexo === 'Macho') machos++;

      const bairro = p.bairro?.trim() || 'Itaiópolis Geral';
      bairrosMap[bairro] = (bairrosMap[bairro] || 0) + 1;
    });

    const topBairros = Object.entries(bairrosMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    // Custo médio particular no Planalto Norte SC (Castração + Microchip + Medicações ~ R$ 550,00)
    const economiaSocialTotal = total * 550;

    return {
      total,
      caes,
      caesPct: total ? Math.round((caes / total) * 100) : 0,
      gatos,
      gatosPct: total ? Math.round((gatos / total) * 100) : 0,
      femeas,
      femeasPct: total ? Math.round((femeas / total) * 100) : 0,
      machos,
      machosPct: total ? Math.round((machos / total) * 100) : 0,
      topBairros,
      economiaSocialTotal
    };
  }, [pets]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#FAF8F5] rounded-3xl overflow-hidden border border-emerald-900/10 shadow-2xl my-8">
        
        {/* Cabeçalho Institucional com Logos Separados */}
        <div className="bg-[#0D6838] px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 shrink-0">
              <div className="h-12 w-12 rounded-2xl bg-white p-1 shadow-md flex items-center justify-center">
                <img src="/brasao_itaiopolis.png" alt="Brasão Itaiópolis" className="h-full w-auto object-contain" />
              </div>
              <div className="h-12 w-12 rounded-2xl bg-white p-1 shadow-md flex items-center justify-center">
                <img src="/logo.png" alt="Logo ItaPet" className="h-full w-full object-contain" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-extrabold bg-[#15803D] text-emerald-100 px-3 py-1 rounded-full border border-emerald-400/30">
                  Gestão Municipal • Zoonoses & Bem-Estar
                </span>
              </div>
              <h2 className="text-xl font-black text-amber-300 mt-0.5">
                Painel Executivo & Indicadores Estratégicos
              </h2>
              <p className="text-xs text-emerald-100 font-medium">
                Prefeitura Municipal de Itaiópolis • Secretaria de Agricultura e Meio Ambiente
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo com os Indicadores */}
        <div className="p-6 md:p-8 space-y-6">

          {/* Cards de Métricas Principais */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Total Castrados */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-emerald-800">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Animais Atendidos</span>
                <Award className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="mt-3">
                <span className="text-3xl font-black text-[#132E27] font-display">{stats.total}</span>
                <span className="text-xs text-emerald-700 font-bold block mt-1">100% Microchipados</span>
              </div>
            </div>

            {/* 2. Economia Social */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-emerald-800">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Economia Social</span>
                <HeartHandshake className="w-5 h-5 text-amber-500" />
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-emerald-800 font-display">
                  {stats.economiaSocialTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </span>
                <span className="text-xs text-stone-500 font-bold block mt-1">Economizados pelas famílias</span>
              </div>
            </div>

            {/* 3. Distribuição Cães vs Gatos */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-emerald-800">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Espécies</span>
                <TrendingUp className="w-5 h-5 text-sky-600" />
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-stone-700">🐶🐕 Cães:</span>
                  <span className="text-emerald-800">{stats.caes} ({stats.caesPct}%)</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden flex">
                  <div className="bg-sky-500 h-full" style={{ width: `${stats.caesPct}%` }} />
                  <div className="bg-amber-400 h-full" style={{ width: `${stats.gatosPct}%` }} />
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-stone-700">🐱🐈 Gatos:</span>
                  <span className="text-amber-700">{stats.gatos} ({stats.gatosPct}%)</span>
                </div>
              </div>
            </div>

            {/* 4. Fêmeas vs Machos */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-emerald-800">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500">Controle Populacional</span>
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-rose-700">Fêmeas (Impacto reprodutivo):</span>
                  <span className="text-stone-900">{stats.femeas} ({stats.femeasPct}%)</span>
                </div>
                <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden flex">
                  <div className="bg-rose-500 h-full" style={{ width: `${stats.femeasPct}%` }} />
                  <div className="bg-indigo-500 h-full" style={{ width: `${stats.machosPct}%` }} />
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-indigo-700">Machos:</span>
                  <span className="text-stone-900">{stats.machos} ({stats.machosPct}%)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Gráfico de Bairros e Comunidades Atendidas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Bairros mais atendidos */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs">
              <h4 className="text-sm font-bold text-[#132E27] flex items-center gap-2 mb-4">
                <Users className="w-4 h-4 text-emerald-600" />
                Comunidades & Bairros com Maior Atendimento
              </h4>
              <div className="space-y-3">
                {stats.topBairros.map(([bairro, count]) => {
                  const pct = Math.round((count / stats.total) * 100);
                  return (
                    <div key={bairro}>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-stone-700">{bairro}</span>
                        <span className="text-stone-500 font-bold">{count} pets ({pct}%)</span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="bg-[#0D6838] h-full rounded-full transition-all duration-500" 
                          style={{ width: `${Math.max(pct, 5)}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Impacto no Plano de Governo */}
            <div className="bg-emerald-50/70 p-6 rounded-2xl border border-emerald-200 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-2.5 py-1 rounded-full">
                  Metas Oficiais Atingidas
                </span>
                <h4 className="text-base font-black text-emerald-950 mt-2">
                  Gestão Humanitária e Saúde Única (One Health)
                </h4>
                <ul className="text-xs text-emerald-900 mt-3 space-y-2 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-black">✓</span>
                    <span><strong>100% dos animais dos mutirões microchipados</strong> conforme a Lei Municipal e o SinPatinhas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-black">✓</span>
                    <span><strong>Prevenção de zoonoses</strong> (raiva, leishmaniose, esporotricose) e diminuição do abandono nas vias públicas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-black">✓</span>
                    <span><strong>Prioridade social CadÚnico/NIS</strong> garantindo acesso para famílias de baixa renda e protetores independentes.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-5 pt-4 border-t border-emerald-200/70 flex items-center justify-between">
                <span className="text-xs text-emerald-800 font-bold">Relatório Oficial Prefeitura de Itaiópolis</span>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-bold text-white bg-emerald-800 hover:bg-emerald-900 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>Imprimir Relatório</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
