const fs = require('fs');
const path = require('path');

function sanitizeName(str) {
  if (!str) return '';
  return str.trim()
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function parseNumberPtBr(val) {
  if (!val) return 0;
  const cleaned = val.replace(/\./g, '').replace(',', '.').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function parseDateBr(dateStr) {
  if (!dateStr) return { display: '', iso: '' };
  const cleaned = dateStr.replace(/['"\s]/g, '').trim();
  const match = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (match) {
    const d = match[1].padStart(2, '0');
    const m = match[2].padStart(2, '0');
    const y = match[3];
    const iso = `${y}-${m}-${d}`;
    const dateObj = new Date(`${iso}T12:00:00Z`);
    if (!isNaN(dateObj.getTime())) {
      return {
        display: `${d}/${m}/${y}`,
        iso: dateObj.toISOString()
      };
    }
  }
  return { display: dateStr.trim(), iso: new Date().toISOString() };
}

function processCSV() {
  const csvPath = path.join(__dirname, '../relatorio_consolidado.csv');
  console.log('📂 Lendo arquivo CSV:', csvPath);

  let raw = fs.readFileSync(csvPath, 'utf8');
  // Remover BOM se presente
  if (raw.charCodeAt(0) === 0xFEFF) {
    raw = raw.slice(1);
  }

  const lines = raw.split(/\r?\n/).filter(line => line.trim().length > 0);
  console.log(`📊 Total de linhas detectadas: ${lines.length} (Cabeçalho + ${lines.length - 1} registros)`);

  const header = lines[0].split(';').map(h => h.trim());
  console.log('📋 Colunas encontradas:', header.join(' | '));

  // 1ª Passada: Contar frequências de microchips para detectar duplicidades
  const microchipCount = {};
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(';').map(c => c.trim());
    const chip = cols[3];
    if (chip) {
      microchipCount[chip] = (microchipCount[chip] || 0) + 1;
    }
  }

  const sanitizedRecords = [];
  const warnings = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(';').map(c => c.trim());
    if (cols.length < 5) continue;

    const rawId = cols[0];
    const rawData = cols[1];
    const rawSenha = cols[2];
    const rawChip = cols[3];
    let rawEspecie = cols[4];
    let rawSexo = cols[5];
    const rawPeso = cols[6];
    let rawRaca = cols[7] || 'SRD';
    const rawNomeAnimal = cols[8];
    const rawNomeTutor = cols[9];
    const rawValor = cols[10];

    // Correções de dados identificadas
    if (rawEspecie === 'Felin') {
      warnings.push(`Linha ${i + 1} (ID ${rawId}): Corrigida espécie de 'Felin' para 'Felino'`);
      rawEspecie = 'Felino';
    }

    if (rawSexo === 'Felino') {
      warnings.push(`Linha ${i + 1} (ID ${rawId}): Animal '${rawNomeAnimal}' tinha sexo 'Felino'. Corrigido para 'Fêmea'.`);
      rawSexo = 'Fêmea';
    }

    const isDuplicateChip = microchipCount[rawChip] > 1;
    if (isDuplicateChip) {
      warnings.push(`Linha ${i + 1} (ID ${rawId}): Microchip duplicado detectado: ${rawChip} (Animal: ${rawNomeAnimal}, Tutor: ${rawNomeTutor})`);
    }

    const dateParsed = parseDateBr(rawData);

    const record = {
      id: `hist_${rawId.padStart(4, '0')}`,
      idOriginal: rawId,
      senhaAtendimento: rawSenha,
      microchip: rawChip,
      especie: rawEspecie,
      sexo: rawSexo,
      pesoKg: parseNumberPtBr(rawPeso),
      raca: rawRaca.trim() || 'SRD',
      nomeAnimal: sanitizeName(rawNomeAnimal),
      nomeTutor: sanitizeName(rawNomeTutor),
      valorProcedimento: parseNumberPtBr(rawValor),
      dataProcedimento: dateParsed.display,
      dataProcedimentoISO: dateParsed.iso,
      bairro: 'Não Especificado (Migração)',
      status: 'concluido',
      origem: 'relatorio_consolidado_castracao',
      alertaDuplicidadeMicrochip: isDuplicateChip,
      fotosPet: [],
      vacinas: [
        {
          nome: 'Castração e Microchipagem Municipal',
          data: dateParsed.display,
          observacao: `Procedimento realizado sob senha ${rawSenha}. Valor conveniado: R$ ${rawValor}`
        }
      ],
      criadoEm: dateParsed.iso || new Date().toISOString()
    };

    sanitizedRecords.push(record);
  }

  console.log(`✅ Registros higienizados com sucesso: ${sanitizedRecords.length}`);
  console.log(`⚠️ Avisos de inconsistência tratados: ${warnings.length}`);

  const outputPath = path.join(__dirname, 'registros_historicos_higienizados.json');
  fs.writeFileSync(outputPath, JSON.stringify(sanitizedRecords, null, 2), 'utf8');
  console.log(`💾 Arquivo salvo com sucesso em: ${outputPath}`);

  const reportPath = path.join(__dirname, 'relatorio_migracao.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    dataExecucao: new Date().toISOString(),
    totalProcessados: sanitizedRecords.length,
    avisos: warnings
  }, null, 2), 'utf8');

  console.log(`📄 Relatório de migração salvo em: ${reportPath}`);
}

processCSV();
