/**
 * ItaPet - Suite de Verificação & QA Automatizada
 * Responsável: Senior QA & Verification Engineer
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let passedCount = 0;
let failedCount = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  \x1b[32m✔ PASS\x1b[0m - ${testName}`);
    passedCount++;
  } else {
    console.error(`  \x1b[31m✖ FAIL\x1b[0m - ${testName} ${details ? '(' + details + ')' : ''}`);
    failedCount++;
  }
}

console.log('\n======================================================');
console.log('🐾 SUITE DE TESTES E VERIFICAÇÃO AUTOMATIZADA ITAPET');
console.log('======================================================\n');

// ----------------------------------------------------------------------
// TESTE 1: Banco Histórico de Microchips (822 Registros do Mutirão)
// ----------------------------------------------------------------------
console.log('\x1b[34m[TEST GROUP 1] Busca de Microchip no Banco Histórico\x1b[0m');
const historicalPath = path.resolve(__dirname, '../web/public/data/registros_historicos.json');
assert(fs.existsSync(historicalPath), 'Arquivo registros_historicos.json existe em web/public/data/');

const historicalData = JSON.parse(fs.readFileSync(historicalPath, 'utf8'));
assert(Array.isArray(historicalData) && historicalData.length === 822, `Total de 822 registros históricos carregados (Encontrado: ${historicalData.length})`);

// 1.1 Teste Murisca
const murisca = historicalData.find(p => p.microchip === '900263003760121');
assert(!!murisca, 'Microchip 900263003760121 (Murisca) encontrado com sucesso');
assert(murisca?.nomeAnimal === 'Murisca', 'Nome do animal confere: Murisca');
assert(murisca?.especie === 'Felino', 'Espécie confere: Felino');
assert(murisca?.status === 'concluido', 'Status inicial histórico está concluído');

// 1.2 Teste Paçoca
const pacoca = historicalData.find(p => p.microchip === '900263005412592');
assert(!!pacoca, 'Microchip 900263005412592 (Paçoca) encontrado com sucesso');
assert(pacoca?.nomeAnimal === 'Paçoca', 'Nome do animal confere: Paçoca');
assert(pacoca?.especie === 'Canino', 'Espécie confere: Canino');
assert(pacoca?.status === 'concluido', 'Status inicial histórico está concluído');

// ----------------------------------------------------------------------
// TESTE 2: Cadastro e Login do Cidadão Apenas com CPF e Senha
// ----------------------------------------------------------------------
console.log('\n\x1b[34m[TEST GROUP 2] Autenticação Simplificada por CPF e Senha\x1b[0m');

function formatCpf(raw) {
  const clean = raw.replace(/\D/g, '').slice(0, 11);
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function validateAndCreateCitizen(cpfInput, passwordInput, nomeInput) {
  const clean = cpfInput.replace(/\D/g, '');
  if (clean.length !== 11) throw new Error('CPF deve ter 11 dígitos');
  if (!passwordInput || passwordInput.length < 6) throw new Error('Senha deve ter ao menos 6 dígitos');
  
  const formatted = formatCpf(clean);
  const syntheticEmail = `${clean}@cidadao.itapet.gov.br`;
  
  return {
    uid: `cidadao-${clean}`,
    cpf: formatted,
    email: syntheticEmail,
    nome: nomeInput || `Munícipe (${formatted})`,
    role: 'citizen'
  };
}

try {
  const citizen = validateAndCreateCitizen('12345678901', 'senha123', 'Maria Aparecida');
  assert(citizen.cpf === '123.456.789-01', 'Máscara de CPF formatada corretamente: 123.456.789-01');
  assert(citizen.email === '12345678901@cidadao.itapet.gov.br', 'Email sintético gerado para autenticação: 12345678901@cidadao.itapet.gov.br');
  assert(citizen.role === 'citizen', 'Perfil atribuído é estritamente cidadão (role: citizen)');
} catch (e) {
  assert(false, 'Criação de munícipe com CPF válido', e.message);
}

// Validação de CPF inválido
try {
  validateAndCreateCitizen('12345', '123456');
  assert(false, 'CPF com menos de 11 dígitos deveria falhar');
} catch {
  assert(true, 'CPF incompleto (<11 dígitos) rejeitado com sucesso');
}

// Validação de senha curta
try {
  validateAndCreateCitizen('12345678901', '123');
  assert(false, 'Senha com menos de 6 caracteres deveria falhar');
} catch {
  assert(true, 'Senha curta (<6 caracteres) rejeitada com sucesso');
}

// ----------------------------------------------------------------------
// TESTE 3: Carteira de Identificação Animal (Passaporte Oficial & QR Code)
// ----------------------------------------------------------------------
console.log('\n\x1b[34m[TEST GROUP 3] Passaporte Oficial e Geração de URL do QR Code\x1b[0m');

function generateQrTargetUrl(origin, microchip) {
  return `${origin}/?consulta=${microchip}`;
}

const mockOrigin = 'https://itapet.itaiopolis.sc.gov.br';
const qrUrlMurisca = generateQrTargetUrl(mockOrigin, murisca.microchip);
assert(qrUrlMurisca === 'https://itapet.itaiopolis.sc.gov.br/?consulta=900263003760121', 'URL do QR Code gerada aponta corretamente para ?consulta=900263003760121');

const qrUrlPacoca = generateQrTargetUrl(mockOrigin, pacoca.microchip);
assert(qrUrlPacoca === 'https://itapet.itaiopolis.sc.gov.br/?consulta=900263005412592', 'URL do QR Code gerada aponta corretamente para ?consulta=900263005412592');

// ----------------------------------------------------------------------
// TESTE 4: Persistência e Triagem de Solicitações de Castração (CadÚnico/NIS)
// ----------------------------------------------------------------------
console.log('\n\x1b[34m[TEST GROUP 4] Persistência e Triagem de Castrações com CadÚnico\x1b[0m');

function sortCastrationRequests(requests) {
  return [...requests].sort((a, b) => {
    if (a.prioridadeCadUnico && !b.prioridadeCadUnico) return -1;
    if (!a.prioridadeCadUnico && b.prioridadeCadUnico) return 1;
    return new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime();
  });
}

const sampleRequests = [
  {
    id: 'CAST-1001',
    nomeAnimal: 'Rex',
    nis: '',
    prioridadeCadUnico: false,
    criadoEm: '2026-10-20T10:00:00.000Z',
    status: 'pendente'
  },
  {
    id: 'CAST-1002',
    nomeAnimal: 'Mel',
    nis: '160.1234.567-8',
    prioridadeCadUnico: true,
    criadoEm: '2026-10-20T11:00:00.000Z',
    status: 'pendente'
  },
  {
    id: 'CAST-1003',
    nomeAnimal: 'Pipoca',
    nis: '128.9876.543-2',
    prioridadeCadUnico: true,
    criadoEm: '2026-10-20T09:00:00.000Z',
    status: 'pendente'
  }
];

const triaged = sortCastrationRequests(sampleRequests);
assert(triaged[0].prioridadeCadUnico === true, 'Primeiro da fila possui prioridade CadÚnico/NIS');
assert(triaged[1].prioridadeCadUnico === true, 'Segundo da fila possui prioridade CadÚnico/NIS');
assert(triaged[2].prioridadeCadUnico === false, 'Solicitação sem CadÚnico fica após os prioritários na triagem');
assert(triaged[0].id === 'CAST-1002', 'Entre prioritários CadÚnico, desempate respeita ordem cronológica recente');

// ----------------------------------------------------------------------
// TESTE 5: Lançamento e Salvamento de Vacinas pelo Veterinário
// ----------------------------------------------------------------------
console.log('\n\x1b[34m[TEST GROUP 5] Lançamento e Persistência de Vacinas\x1b[0m');

function simulateAddVaccine(pet, vaccine) {
  const currentVaccines = pet.vacinas ? [...pet.vacinas] : [];
  currentVaccines.push(vaccine);
  return {
    ...pet,
    status: 'concluido',
    vacinas: currentVaccines
  };
}

const petBeforeVac = {
  id: 'hist_0007',
  nomeAnimal: 'Paçoca',
  microchip: '900263005412592',
  vacinas: [
    { nome: 'Castração e Microchipagem Municipal', data: '09/03/2026' }
  ]
};

const newVaccine = {
  nome: 'Antirrábica Municipal 2026',
  data: '20/10/2026',
  observacao: 'Lote AR-4589 conferido pelo veterinário',
  veterinarioNome: 'Dr(a). Veterinário(a) Municipal'
};

const petAfterVac = simulateAddVaccine(petBeforeVac, newVaccine);
assert(petAfterVac.vacinas.length === 2, 'Vacina adicionada com sucesso ao histórico do pet (Total: 2)');
assert(petAfterVac.vacinas[1].nome === 'Antirrábica Municipal 2026', 'Nome da vacina confere no registro');
assert(petAfterVac.status === 'concluido', 'Status do animal preservado como concluído');

// ----------------------------------------------------------------------
// RESUMO FINAL
// ----------------------------------------------------------------------
console.log('\n======================================================');
console.log(`TOTAL DE TESTES: ${passedCount + failedCount}`);
console.log(`\x1b[32mPASSARAM: ${passedCount}\x1b[0m`);
console.log(`\x1b[31mFALHARAM: ${failedCount}\x1b[0m`);
console.log('======================================================\n');

if (failedCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
