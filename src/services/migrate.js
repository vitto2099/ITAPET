const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, writeBatch, doc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "itapet-xxxxx.firebaseapp.com",
  projectId: "itapet-xxxxx",
  storageBucket: "itapet-xxxxx.appspot.com",
  messagingSenderId: "xxxxxxxx",
  appId: "xxxxxxxx"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function importCSV() {
  const csvPath = path.join(__dirname, '../../relatorio_consolidado.csv');
  const fileContent = fs.readFileSync(csvPath, 'utf8');
  
  const lines = fileContent.split('\n');
  const headers = lines[0].split(';');
  
  console.log(`Iniciando importação de ${lines.length - 1} registros...`);

  let batch = writeBatch(db);
  let count = 0;
  let batchCount = 0;

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = lines[i].split(';');
    const record = {
      id_relatorio: values[0],
      dataProc: values[1],
      senha: values[2],
      microchip: values[3],
      especie: values[4],
      sexo: values[5],
      peso: values[6],
      raca: values[7],
      nomeAnimal: values[8],
      nomeTutor: values[9],
      valor: values[10],
      importadoEm: new Date().toISOString()
    };

    const docRef = doc(collection(db, "registrations"));
    batch.set(docRef, record);
    
    count++;
    batchCount++;

    if (batchCount === 400) {
      await batch.commit();
      console.log(`Enviados ${count} registros...`);
      batch = writeBatch(db);
      batchCount = 0;
    }
  }

  if (batchCount > 0) {
    await batch.commit();
  }

  console.log(`Sucesso! ${count} registros importados.`);
}

importCSV().catch(console.error);
