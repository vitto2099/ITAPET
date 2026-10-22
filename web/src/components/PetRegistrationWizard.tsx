import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BAIRROS_ITAIOPOLIS } from '../constants/bairros';
import { createPetRegistration } from '../services/petService';
import { 
  PawPrint, 
  Upload, 
  X, 
  CheckCircle2, 
  ArrowLeft, 
  Camera, 
  Sparkles,
  Heart,
  HelpCircle
} from 'lucide-react';

interface PetRegistrationWizardProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const PetRegistrationWizard: React.FC<PetRegistrationWizardProps> = ({
  onSuccess,
  onCancel
}) => {
  const { user, userData } = useAuth();
  const [loading, setLoading] = useState(false);

  // Form states
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState<'Canino' | 'Felino' | 'Outro'>('Canino');
  const [outroEspecie, setOutroEspecie] = useState('');
  const [sexo, setSexo] = useState<'Macho' | 'Fêmea'>('Macho');
  const [raca, setRaca] = useState('SRD');
  const [peso, setPeso] = useState('');
  const [bairro, setBairro] = useState(BAIRROS_ITAIOPOLIS[0]);
  const [fotosPet, setFotosPet] = useState<string[]>([]);
  const [fotoCarteira, setFotoCarteira] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, tipo: 'pet' | 'carteira') => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (tipo === 'pet') {
      const remainingSlots = 4 - fotosPet.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      filesToProcess.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            setFotosPet(prev => [...prev, reader.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    } else {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setFotoCarteira(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = (index: number) => {
    setFotosPet(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      alert("Por favor, preencha o nome do animal.");
      return;
    }

    setLoading(true);
    try {
      await createPetRegistration({
        nomeAnimal: nome.trim(),
        especie: especie === 'Outro' ? (outroEspecie.trim() || 'Outro') : especie,
        sexo: sexo,
        raca: raca.trim() || 'SRD',
        pesoKg: peso ? parseFloat(peso.replace(',', '.')) : undefined,
        bairro: bairro,
        userId: user?.uid,
        nomeTutor: userData?.nome || 'Munícipe Responsável',
        cpfTutor: userData?.cpf || '',
        telefoneTutor: userData?.telefone || '',
        fotosPet: fotosPet,
        fotoUrl: fotosPet[0] || null,
        carteiraUrl: fotoCarteira,
        vacinas: []
      });

      alert("🎉 Pet cadastrado com sucesso! O cadastro foi enviado para a homologação do veterinário municipal e já está visível na sua lista.");
      onSuccess();
    } catch (err) {
      console.error(err);
      alert("Ocorreu um erro ao cadastrar o animal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-8 space-y-6">
      
      {/* Botão de Retorno */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-xs font-black text-stone-700 bg-white hover:bg-stone-50 px-3.5 py-2 rounded-2xl border-2 border-stone-200 shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#0D6838]" />
          <span>Voltar para meus bichinhos</span>
        </button>
        <span className="text-xs font-black text-[#0D6838] bg-[#EAF7EE] px-3.5 py-1.5 rounded-full border border-emerald-300 shadow-xs">
          ✨ Cadastro Oficial SinPatinhas / ItaPet
        </span>
      </div>

      {/* Card do Formulário */}
      <div className="bg-white text-stone-800 rounded-[2.5rem] p-6 sm:p-10 border-4 border-[#0D6838] shadow-xl space-y-6 relative overflow-hidden font-sans">
        
        {/* Faixa decorativa no topo */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#0D6838] via-[#F9C72C] to-[#0284C7]" />

        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F9C72C] text-stone-950 border-2 border-[#C69205] shadow-xs flex items-center justify-center font-bold text-2xl select-none">
              {especie === 'Felino' ? '🐱' : '🐶'}
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                Cadastrar Animal de Estimação
              </h2>
              <p className="text-xs sm:text-sm font-bold text-stone-500">
                Gere a Carteira de Identificação Animal emitida pela Prefeitura de Itaiópolis! 🏅
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          
          {/* Nome do Animal */}
          <div>
            <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2">
              Nome do Bichinho *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Rex, Mel, Pipoca, Thor, Bob..."
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border-2 border-stone-200 text-sm font-bold text-stone-900 placeholder-stone-400 focus:border-amber-400 focus:bg-white outline-hidden transition-all shadow-xs"
            />
          </div>

          {/* Espécie */}
          <div>
            <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2">
              O que ele é?
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'Canino', label: '🐶🐕 Cachorro' },
                { key: 'Felino', label: '🐱🐈 Gatinho' },
                { key: 'Outro', label: '🐾 Outro' }
              ].map(item => (
                <button
                  type="button"
                  key={item.key}
                  onClick={() => setEspecie(item.key as any)}
                  className={`py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-black border-2 transition-all ${
                    especie === item.key
                      ? 'bg-amber-400 text-stone-950 border-amber-500 border-b-4 shadow-sm scale-[1.02]'
                      : 'bg-[#FAF7F2] text-stone-700 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            {especie === 'Outro' && (
              <input
                type="text"
                placeholder="Qual é a espécie do animal? (Ex: Coelho, Equino...)"
                value={outroEspecie}
                onChange={(e) => setOutroEspecie(e.target.value)}
                className="mt-3 w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border-2 border-stone-200 text-stone-900 text-sm font-bold outline-hidden focus:border-amber-400 shadow-xs"
              />
            )}
          </div>

          {/* Sexo & Raça & Peso */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2">
                Sexo
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Macho', 'Fêmea'] as const).map(s => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setSexo(s)}
                    className={`py-2.5 px-3 rounded-2xl text-xs font-black border-2 transition-all ${
                      sexo === s
                        ? 'bg-amber-400 text-stone-950 border-amber-500 border-b-4 shadow-xs'
                        : 'bg-[#FAF7F2] text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {s === 'Macho' ? '♂️ Macho' : '♀️ Fêmea'}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2">
                Raça
              </label>
              <input
                type="text"
                placeholder="Ex: SRD, Poodle, Siamês..."
                value={raca}
                onChange={(e) => setRaca(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border-2 border-stone-200 text-stone-900 text-xs sm:text-sm font-bold outline-hidden focus:border-amber-400 shadow-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2">
                Peso Aprox. (kg)
              </label>
              <input
                type="text"
                placeholder="Ex: 8.5"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-[#FAF7F2] border-2 border-stone-200 text-stone-900 text-xs sm:text-sm font-bold outline-hidden focus:border-amber-400 shadow-xs"
              />
            </div>
          </div>

          {/* Bairro em Itaiópolis */}
          <div>
            <label className="block text-xs font-black text-stone-700 uppercase tracking-wider mb-2">
              Bairro / Localidade em Itaiópolis *
            </label>
            <select
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[#FAF7F2] border-2 border-stone-200 text-xs sm:text-sm font-black text-stone-800 focus:border-amber-400 outline-hidden shadow-xs"
            >
              {BAIRROS_ITAIOPOLIS.map(b => (
                <option key={b} value={b}>📍 {b}</option>
              ))}
            </select>
          </div>

          {/* Fotos do Animal */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-black text-stone-700 uppercase tracking-wider">
                Fotos do Bichinho (Até 4 fotos) 📷
              </label>
              <span className="text-xs font-black text-amber-700">{fotosPet.length} de 4 fotos</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
              {fotosPet.map((src, i) => (
                <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border-3 border-amber-300 shadow-sm group">
                  <img src={src} alt={`Pet ${i}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(i)}
                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-500 text-white shadow-md hover:scale-110 transition-transform"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {fotosPet.length < 4 && (
                <label className="relative aspect-square rounded-2xl border-2 border-dashed border-amber-300 hover:border-amber-400 bg-amber-50/50 hover:bg-amber-50 flex flex-col items-center justify-center cursor-pointer transition-colors text-amber-800">
                  <Camera className="w-6 h-6 mb-1 text-amber-600" />
                  <span className="text-xs font-black">Adicionar Foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileUpload(e, 'pet')}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-xs font-bold text-stone-500">
              💡 Fotos do rostinho e do corpinho do pet facilitam a identificação rápida caso ele se perca na rua.
            </p>
          </div>

          {/* Foto de Documento Antigo */}
          <div className="p-4 rounded-2xl bg-[#FAF7F2] border-2 border-amber-200 space-y-2">
            <label className="block text-xs font-black text-stone-700 uppercase tracking-wider">
              Carteirinha de Vacinação ou Comprovante Anterior (Opcional)
            </label>
            <p className="text-xs font-medium text-stone-500">
              Se você tiver foto da carteirinha antiga de vacina ou papel de castração, anexe para os veterinários conferirem.
            </p>

            {fotoCarteira ? (
              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-300">
                <span className="text-xs font-black text-emerald-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Foto do documento anexada com sucesso!
                </span>
                <button
                  type="button"
                  onClick={() => setFotoCarteira(null)}
                  className="text-xs text-rose-600 font-black hover:underline"
                >
                  Remover
                </button>
              </div>
            ) : (
              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black text-stone-800 bg-white border-2 border-stone-200 hover:bg-stone-50 cursor-pointer transition-colors shadow-xs">
                <Upload className="w-4 h-4 text-stone-500" />
                <span>Anexar Foto da Carteira Antiga</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'carteira')}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Botões Finais */}
          <div className="pt-4 border-t-2 border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-3 rounded-2xl text-xs font-black text-stone-600 hover:text-stone-900 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 rounded-2xl font-black text-sm text-[#1C1917] bg-[#F9C72C] hover:bg-[#F8BE12] border-b-4 border-[#C69205] active:border-b-0 active:translate-y-1 shadow-md transition-all disabled:opacity-50"
            >
              {loading ? 'Cadastrando Pet...' : 'Concluir Cadastro Oficial 🐾'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
