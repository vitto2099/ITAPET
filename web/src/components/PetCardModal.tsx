import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import { PetRegistration } from '../types';
import { exportPetCardToPdf } from '../utils/pdfExport';
import { PetCategoryBadge } from './PetCategoryBadge';
import { getPetAvatarEmoji } from '../utils/petEmoji';
import { 
  X, 
  QrCode, 
  ShieldCheck, 
  Heart, 
  Calendar, 
  MapPin, 
  Printer, 
  Share2, 
  Syringe, 
  Award,
  Sparkles,
  PawPrint,
  CheckCircle2,
  Download,
  Info
} from 'lucide-react';

interface PetCardModalProps {
  pet: PetRegistration | null;
  onClose: () => void;
  isPublicView?: boolean;
}

export const PetCardModal: React.FC<PetCardModalProps> = ({
  pet,
  onClose,
  isPublicView = false
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pet?.microchip) {
      const publicUrl = `${window.location.origin}/?consulta=${pet.microchip}`;
      QRCode.toDataURL(publicUrl, {
        width: 240,
        margin: 1,
        color: {
          dark: '#0B4F8A',
          light: '#ffffff'
        }
      }).then(setQrCodeDataUrl).catch(console.error);
    }
  }, [pet]);

  if (!pet) return null;

  const maskName = (name: string) => {
    if (!name) return 'Não informado';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[1]?.charAt(0)}***`;
  };

  const getEmoji = (petOrEspecie?: any) => {
    if (typeof petOrEspecie === 'object' && petOrEspecie !== null) {
      return getPetAvatarEmoji(petOrEspecie);
    }
    return getPetAvatarEmoji({ especie: petOrEspecie });
  };

  const handleShare = () => {
    const url = `${window.location.origin}/?consulta=${pet.microchip}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = async () => {
    if (!cardRef.current || !pet) return;
    setIsExportingPdf(true);
    try {
      await exportPetCardToPdf(pet, cardRef.current);
    } finally {
      setIsExportingPdf(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[95vh]">
        
        {/* Barra Superior Oficial do Modal com Logos Separadas */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#0B4F8A] to-[#15803D] text-white">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl bg-white p-1 shadow-sm shrink-0 flex items-center justify-center">
                <img src="/brasao_itaiopolis.png" alt="Brasão de Itaiópolis" className="h-8 w-auto object-contain" />
              </div>
              <div className="w-10 h-10 rounded-2xl bg-white p-1 shadow-sm shrink-0 flex items-center justify-center">
                <img src="/logo.png" alt="ItaPet Itaiópolis" className="w-8 h-8 object-contain" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-extrabold text-sm sm:text-base tracking-wide text-white uppercase">
                  Carteira de Identificação Animal
                </h3>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 shadow-xs">
                  OFICIAL 🐾
                </span>
              </div>
              <p className="text-xs font-medium text-emerald-100">
                Prefeitura de Itaiópolis - SC • SinPatinhas Municipal
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold transition-transform active:scale-95 no-print"
            title="Fechar Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo Imprimível do Documento */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 bg-slate-50/50">
          
          {/* ========================================================
              A CARTEIRA DE IDENTIFICAÇÃO ANIMAL OFICIAL (PASSO 4)
             ======================================================== */}
          <div ref={cardRef} className="carteira-print-container relative p-5 sm:p-6 rounded-2xl bg-white border-2 border-emerald-700/30 shadow-md overflow-hidden">
            
            {/* Guilloche / Padrão de Fundo de Segurança Sanitária */}
            <div className="absolute inset-0 guilloche-pattern pointer-events-none" />

            {/* Cabeçalho da Carteirinha Oficial com Logos Separadas e com Destaque Único */}
            <div className="relative z-10 border-b border-slate-200 pb-4 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  
                  {/* Brasão Municipal com Moldura Própria */}
                  <div className="p-2 rounded-2xl bg-white border border-slate-200 shadow-2xs shrink-0 flex items-center justify-center">
                    <img 
                      src="/brasao_itaiopolis.png" 
                      alt="Brasão Oficial de Itaiópolis - SC" 
                      className="h-12 sm:h-14 w-auto object-contain shrink-0" 
                    />
                  </div>

                  {/* Logo ItaPet com Moldura Própria */}
                  <div className="p-2 rounded-2xl bg-white border border-emerald-200 shadow-2xs shrink-0 flex items-center justify-center">
                    <img 
                      src="/logo.png" 
                      alt="Logo Oficial ItaPet" 
                      className="w-12 sm:w-14 h-12 sm:h-14 object-contain shrink-0" 
                    />
                  </div>

                  <div>
                    <p className="text-xs font-black tracking-widest text-[#0B4F8A] uppercase">
                      PREFEITURA MUNICIPAL DE ITAIÓPOLIS - SC
                    </p>
                    <h2 className="text-base sm:text-xl font-extrabold text-emerald-800 tracking-tight uppercase">
                      CARTEIRA DE IDENTIFICAÇÃO ANIMAL
                    </h2>
                    <p className="text-xs font-semibold text-slate-500">
                      Secretaria de Agricultura e Meio Ambiente • SinPatinhas / ItaPet
                    </p>
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-start sm:items-end gap-1.5">
                  <PetCategoryBadge pet={pet} size="sm" />
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{pet.status === 'concluido' ? 'Microchipado' : pet.status === 'aprovado' ? 'Homologado' : 'Cadastrado'}</span>
                  </span>
                  <p className="text-xs text-slate-400 font-semibold">Fé Pública Municipal</p>
                </div>
              </div>
            </div>

            {/* Corpo Central: Foto, Dados do Pet, Microchip e QR Code */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
              
              {/* Foto do Pet com Moldura Oficial (4 cols) */}
              <div className="sm:col-span-4 flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden bg-slate-100 border-2 border-slate-200 shadow-xs flex items-center justify-center">
                  {pet.fotoUrl || (pet.fotosPet && pet.fotosPet[0]) ? (
                    <img 
                      src={pet.fotoUrl || pet.fotosPet[0]} 
                      alt={pet.nomeAnimal} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-3 text-center">
                      <span className="text-4xl mb-1">{getEmoji(pet)}</span>
                      <span className="text-xs font-bold text-slate-700">{pet.especie}</span>
                    </div>
                  )}

                  {/* Selo do Chip Oficial no Canto da Foto */}
                  <div className="absolute bottom-1 right-1 px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-black text-xs border border-amber-500 shadow-xs flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>CHIP</span>
                  </div>
                </div>
                <p className="text-xs font-bold text-slate-500 mt-2">Identificação Visual</p>
              </div>

              {/* Informações Centrais do Pet (5 cols) */}
              <div className="sm:col-span-5 text-center sm:text-left space-y-2.5">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {pet.nomeAnimal}
                  </h3>
                  <p className="text-xs sm:text-sm font-bold text-emerald-800 mt-0.5">
                    {pet.especie} • {pet.raca || 'SRD'} • {pet.sexo || 'Não informado'}
                  </p>
                </div>

                {/* Destaque do Número de Microchip em Monospace de Alto Contraste */}
                <div className="p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-left shadow-2xs">
                  <p className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Nº DO MICROCHIP (OFICIAL 15 DÍGITOS)</span>
                  </p>
                  <p className="text-sm sm:text-base font-mono font-black tracking-widest text-slate-950 mt-1 select-all bg-white px-3 py-1.5 rounded-xl border border-emerald-200 shadow-2xs">
                    {pet.microchip || 'Pendente de Implantação'}
                  </p>
                </div>

                <div className="text-xs sm:text-sm text-slate-700 font-medium">
                  {pet.pesoKg && <span>Peso: <strong>{pet.pesoKg} kg</strong> • </span>}
                  <span>Porte: <strong>{(pet as any).porte || (pet.pesoKg ? (pet.pesoKg < 10 ? 'Pequeno' : pet.pesoKg < 25 ? 'Médio' : 'Grande') : 'Não especificado')}</strong></span>
                </div>
              </div>

              {/* QR Code de Leitura Rápida para Coleira (3 cols) */}
              <div className="sm:col-span-3 flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 shadow-xs">
                {qrCodeDataUrl ? (
                  <img src={qrCodeDataUrl} alt="QR Code da Coleira" className="w-22 h-22 rounded-xl shadow-xs" />
                ) : (
                  <QrCode className="w-20 h-20 text-[#0B4F8A]" />
                )}
                <span className="text-xs font-black text-[#0B4F8A] mt-2 uppercase text-center">
                  QR Code para Coleira 📱
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Bipar para Localizar
                </span>
              </div>

            </div>

            {/* Linha de Dados de Cadastro e Tutor */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-4 pt-3 border-t border-slate-200 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="text-slate-500 font-bold text-xs uppercase">Tutor Responsável</p>
                <p className="font-extrabold text-sm text-slate-900 truncate mt-0.5">
                  {isPublicView ? maskName(pet.nomeTutor) : pet.nomeTutor || 'Não informado'}
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="text-slate-500 font-bold text-xs uppercase">Bairro / Localidade</p>
                <p className="font-extrabold text-sm text-slate-900 truncate mt-0.5">
                  {pet.bairro || 'Itaiópolis - SC'}
                </p>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p className="text-slate-500 font-bold text-xs uppercase">Data do Registro</p>
                <p className="font-extrabold text-sm text-slate-900 mt-0.5">
                  {pet.dataProcedimento || new Date(pet.criadoEm).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>

            {/* Aviso Oficial do Mutirão ou Sistema SinPatinhas com Categoria em Destaque */}
            <div className="relative z-10 mt-3 p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-200 text-xs text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <PawPrint className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-semibold text-xs sm:text-sm">
                  {pet.origem?.includes('mutirao') || pet.origem === 'relatorio_consolidado_castracao' 
                    ? 'Animal homologado no Mutirão Municipal de Castração e Microchipagem de Itaiópolis.' 
                    : 'Animal cadastrado no Sistema Municipal de Gestão Animal ItaPet / SinPatinhas.'}
                </span>
              </div>
              <PetCategoryBadge pet={pet} size="sm" />
            </div>

          </div>

          {/* ========================================================
              HISTÓRICO CLÍNICO & VACINAS MUNICIPAIS
             ======================================================== */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900">
                <Syringe className="w-4 h-4 text-emerald-700" />
                <span>Histórico de Vacinas & Procedimentos Sanitários</span>
              </h4>
              <span className="text-xs font-medium text-slate-500">
                Averbação por Médico Veterinário Oficial
              </span>
            </div>

            {pet.vacinas && pet.vacinas.length > 0 ? (
              <div className="space-y-1.5">
                {pet.vacinas.map((vac, i) => (
                  <div 
                    key={i}
                    className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between text-xs sm:text-sm"
                  >
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-900 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{vac.nome}</span>
                      </p>
                      {vac.observacao && (
                        <p className="text-xs text-slate-500 pl-6">{vac.observacao}</p>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-bold text-xs">
                        {vac.data}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-white border border-dashed border-slate-200 text-center text-xs sm:text-sm text-slate-500 font-medium">
                Nenhuma vacina adicional averbada no prontuário digital até o momento.
              </div>
            )}
          </div>

          {/* Galeria de Fotos Adicionais */}
          {pet.fotosPet && pet.fotosPet.length > 1 && (
            <div className="no-print">
              <h4 className="text-xs font-bold text-slate-700 uppercase mb-2">Fotos Adicionais do Animal</h4>
              <div className="grid grid-cols-4 gap-2">
                {pet.fotosPet.map((src, idx) => (
                  <img key={idx} src={src} alt="Pet" className="w-full h-20 object-cover rounded-xl border border-slate-200 shadow-2xs" />
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ========================================================
            RODAPÉ DE AÇÕES MODERNAS COM TOUCH MÍNIMO DE 44PX
           ======================================================== */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 no-print">
          <p className="text-xs font-semibold text-slate-500">
            Documento com fé pública municipal • Imprima e guarde junto à carteira
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleShare}
              className="min-h-[44px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Share2 className="w-4 h-4 text-slate-600" />
              <span>{copiedLink ? '✓ Copiado!' : 'Compartilhar'}</span>
            </button>

            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="min-h-[44px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#15803D] hover:bg-[#116932] transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
              title="Baixar PDF de alta resolução ou enviar no WhatsApp"
            >
              <Download className="w-4 h-4" />
              <span>{isExportingPdf ? 'Gerando...' : 'Baixar / WhatsApp'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="min-h-[44px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#0B4F8A] hover:bg-[#083D6C] transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Carteirinha</span>
            </button>

            <button
              onClick={onClose}
              className="min-h-[44px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
