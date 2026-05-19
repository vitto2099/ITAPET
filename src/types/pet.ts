export interface Registration {
  id: string;
  dataProc: string;
  senha: string;
  microchip: string;
  especie: string;
  sexo: string;
  peso: string;
  raca: string;
  nomeAnimal: string;
  nomeTutor: string;
  valor: string;
  status?: 'pendente' | 'aprovado' | 'concluido';
  bairro?: string;
  fotoUrl?: string; // Mantido para compatibilidade
  fotosPet?: string[]; // Array de até 4 fotos
  carteiraUrl?: string;
  userId?: string; // Para vincular ao usuário dono
  vacinas?: {
    nome: string;
    data: string;
    fotoUrl: string | null;
  }[];
}
