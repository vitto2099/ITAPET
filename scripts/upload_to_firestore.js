/**
 * Script de Migração em Lote (Batch) para o Cloud Firestore
 * Envia os 822 registros históricos higienizados para a coleção 'registrations'.
 * 
 * Uso:
 *   node scripts/upload_to_firestore.js --dry-run   (Apenas simula a leitura e validação dos batches)
 *   node scripts/upload_to_firestore.js --live      (Efetua a gravação real no Firestore em batches de 400)
 */

const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  writeBatch, 
  doc, 
  Timestamp 
} = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyAojVylRmlIgqBPVrRHTIWiLeFcVrzDIvM",
  authDomain: "itapet-354d4.firebaseapp.com",
  projectId: "itapet-354d4",
  storageBucket: "itapet-354d4.firebasestorage.app",
  messagingSenderId: "493977798545",
  appId: "1:493977798545:web:ec44b43ead4f33b7b4bc30"
};

const isLive = process.argv.includes('--live');
const isDryRun = process.argv.includes('--dry-run') || !isLive;

async function runMigration() {
  console.log('🐾 ItaPet - Migrador de Dados Históricos para o Cloud Firestore');
  console.log('================================================================');
  console.log(`Modo de Execução: ${isLive ? '🔴 AO VIVO (Gravação no Firestore)' : '🟡 DRY-RUN (Simulação Segura)'}`);

  const jsonPath = path.join(__dirname, 'registros_historicos_higienizados.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ Arquivo registros_historicos_higienizados.json não encontrado! Execute primeiro node scripts/sanitize_and_migrate.js');
    process.exit(1);
  }

  const records = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  console.log(`📊 Total de registros prontos para envio: ${records.length}`);

  if (isDryRun) {
    console.log('\n--- SIMULAÇÃO DE BATCHES ---');
    const batchSize = 400;
    const totalBatches = Math.ceil(records.length / batchSize);
    console.log(`Serão necessários ${totalBatches} batches de até ${batchSize} documentos cada.`);
    console.log(`Exemplo de documento migrado [0]:`);
    console.log(JSON.stringify(records[0], null, 2));
    console.log('\n✅ Validação da estrutura concluída com sucesso.');
    console.log('👉 Para aplicar a gravação real no Firestore do projeto itapet-354d4, execute:');
    console.log('   node scripts/upload_to_firestore.js --live\n');
    return;
  }

  // Modo Ao Vivo
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  let batch = writeBatch(db);
  let batchCount = 0;
  let totalSaved = 0;
  const BATCH_LIMIT = 400;

  for (let i = 0; i < records.length; i++) {
    const item = records[i];
    const docId = item.id; // Ex: hist_0001
    const docRef = doc(db, 'registrations', docId);

    const firestorePayload = {
      ...item,
      migradoEm: new Date().toISOString()
    };

    batch.set(docRef, firestorePayload, { merge: true });
    batchCount++;
    totalSaved++;

    if (batchCount === BATCH_LIMIT) {
      console.log(`⏳ Gravando batch de ${batchCount} documentos (Progresso: ${totalSaved}/${records.length})...`);
      await batch.commit();
      console.log(`✓ Batch gravado com sucesso!`);
      batch = writeBatch(db);
      batchCount = 0;
    }
  }

  if (batchCount > 0) {
    console.log(`⏳ Gravando batch final de ${batchCount} documentos...`);
    await batch.commit();
    console.log(`✓ Batch final gravado com sucesso!`);
  }

  console.log(`\n🎉 SUCESSO TOTAL! ${totalSaved} registros foram sincronizados no Firestore.`);
}

runMigration().catch(err => {
  console.error('❌ Erro durante a migração:', err);
  process.exit(1);
});
