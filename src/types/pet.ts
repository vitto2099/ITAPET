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
  bairro?: string; // Optional if we want to filter by neighborhood
}
