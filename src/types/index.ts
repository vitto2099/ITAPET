export interface Usuario {
  uid: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  tipo: 'cidadao' | 'admin';
}

export interface Pet {
  id?: string;
  nome: string;
  peso: number;
  pelagem: string;
  sexo: 'Macho' | 'Fêmea';
  especie: 'Cão' | 'Gato';
  vacinas: { nome: string; data: string }[];
  status: 'Ativo' | 'Desaparecido' | 'Adotado' | 'Falecido';
  localizacao: { bairro: string; cidade: string };
  fotos: string[];
  donoId: string;
  aprovado: boolean;
  dataCadastro: string;
}