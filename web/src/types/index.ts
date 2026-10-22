export type UserRole = 'citizen' | 'admin';

export interface UserProfile {
  uid: string;
  nome: string;
  cpf: string;
  telefone?: string;
  email: string;
  role: UserRole;
  bairro?: string;
  crmv?: string; // Para veterinários
  fotoPerfil?: string;
  criadoEm?: string;
}

export interface VacinaRegistro {
  id?: string;
  nome: string;
  data: string;
  fotoUrl?: string | null;
  observacao?: string;
  veterinarioNome?: string;
  crmv?: string;
}

export interface PetRegistration {
  id: string;
  idOriginal?: string;
  nomeAnimal: string;
  especie: string;
  raca: string;
  sexo: string;
  pesoKg?: number;
  porte?: string;
  bairro?: string;
  microchip?: string;
  status: 'pendente' | 'aprovado' | 'concluido' | 'rejeitado';
  origem?: 'relatorio_consolidado_castracao' | 'cadastro_online' | string;
  codigoHistorico?: string;
  userId?: string;
  nomeTutor: string;
  cpfTutor?: string;
  telefoneTutor?: string;
  fotosPet: string[];
  fotoUrl?: string | null;
  carteiraUrl?: string | null;
  vacinas?: VacinaRegistro[];
  castrado?: boolean;
  senhaAtendimento?: string;
  valorProcedimento?: number;
  dataProcedimento?: string;
  alertaDuplicidadeMicrochip?: boolean;
  motivoRejeicao?: string;
  criadoEm: string;
}

export interface CastrationRequest {
  id: string; // Ticket único, ex: CAST-1234
  nomeAnimal: string;
  especie: 'Canino' | 'Felino';
  sexo: 'Fêmea' | 'Macho';
  pesoAprox?: string;
  bairro: string;
  nis?: string;
  prioridadeCadUnico: boolean;
  telefone: string;
  nomeTutor?: string;
  cpfTutor?: string;
  userId?: string;
  status: 'pendente' | 'aprovado' | 'agendado' | 'concluido' | 'rejeitado';
  motivoRejeicao?: string;
  dataAgendamento?: string;
  observacoes?: string;
  criadoEm: string;
  atualizadoEm?: string;
}
