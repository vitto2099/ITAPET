import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  setDoc,
  doc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  arrayUnion 
} from 'firebase/firestore';
import { db } from './firebase';
import { PetRegistration, VacinaRegistro, CastrationRequest } from '../types';

let cachedHistorical: PetRegistration[] | null = null;

function getLocalVaccinesMap(): Record<string, VacinaRegistro[]> {
  try {
    return JSON.parse(localStorage.getItem('itapet_local_vaccines') || '{}');
  } catch {
    return {};
  }
}

function getLocalOverridesMap(): Record<string, Partial<PetRegistration>> {
  try {
    return JSON.parse(localStorage.getItem('itapet_pet_overrides') || '{}');
  } catch {
    return {};
  }
}

function applyLocalVaccinesToPet(pet: PetRegistration): PetRegistration {
  const map = getLocalVaccinesMap();
  const extra = map[pet.id] || [];
  const overrides = getLocalOverridesMap()[pet.id] || {};

  const existingNames = new Set((pet.vacinas || []).map(v => `${v.nome}_${v.data}`));
  const newVacs = [...(pet.vacinas || [])];
  extra.forEach(v => {
    if (!existingNames.has(`${v.nome}_${v.data}`)) {
      newVacs.push(v);
    }
  });

  return { 
    ...pet, 
    ...overrides,
    vacinas: newVacs, 
    status: extra.length > 0 ? 'concluido' : (overrides.status || pet.status)
  };
}

export async function getHistoricalPets(): Promise<PetRegistration[]> {
  if (cachedHistorical) return cachedHistorical.map(applyLocalVaccinesToPet);
  try {
    const res = await fetch('/data/registros_historicos.json');
    if (res.ok) {
      const data: PetRegistration[] = await res.json();
      cachedHistorical = data;
      return data.map(applyLocalVaccinesToPet);
    }
  } catch (err) {
    console.error("Erro ao carregar dados históricos:", err);
  }
  return [];
}

export async function fetchAllPetsForAdmin(): Promise<PetRegistration[]> {
  let firestorePets: PetRegistration[] = [];
  try {
    const q = query(collection(db, "registrations"), orderBy("criadoEm", "desc"));
    const snap = await getDocs(q);
    firestorePets = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    })) as PetRegistration[];
  } catch (e) {
    console.warn("Firestore não acessível ou sem dados novos, usando fallback:", e);
  }

  const historical = await getHistoricalPets();
  
  // Unifica evitando duplicatas se algum já tiver sido importado
  const existingIds = new Set(firestorePets.map(p => p.idOriginal || p.id));
  const uniqueHistorical = historical.filter(h => !existingIds.has(h.id) && (!h.idOriginal || !existingIds.has(h.idOriginal)));

  const all = [...firestorePets, ...uniqueHistorical];
  return all.map(applyLocalVaccinesToPet);
}

export async function fetchUserPets(userId: string, userCpf?: string, userName?: string): Promise<PetRegistration[]> {
  let userPets: PetRegistration[] = [];
  try {
    const q = query(collection(db, "registrations"), where("userId", "==", userId));
    const snap = await getDocs(q);
    userPets = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    })) as PetRegistration[];

    if (userCpf && userCpf.length >= 11) {
      const clean = userCpf.replace(/\D/g, '');
      const qCpf = query(collection(db, "registrations"), where("cpfTutor", "==", clean));
      const snapCpf = await getDocs(qCpf);
      snapCpf.docs.forEach(d => {
        if (!userPets.some(p => p.id === d.id)) {
          userPets.push({ id: d.id, ...d.data() } as PetRegistration);
        }
      });
    }
  } catch (e) {
    console.warn("Erro ao buscar pets no Firestore:", e);
  }

  // Se o usuário está em modo demo ou cadastrado, permite também ver pets históricos reivindicados por userId
  const claimedLocal = localStorage.getItem(`claimed_pets_${userId}`);
  if (claimedLocal) {
    try {
      const claimedIds: string[] = JSON.parse(claimedLocal);
      const allHist = await getHistoricalPets();
      const claimedPets = allHist.filter(p => claimedIds.includes(p.id));
      claimedPets.forEach(p => {
        if (!userPets.some(existing => existing.id === p.id)) {
          userPets.push(p);
        }
      });
    } catch {}
  }

  // Pets históricos reivindicados via CPF
  if (userCpf) {
    const clean = userCpf.replace(/\D/g, '');
    const claimedCpfKey = `claimed_pets_cpf_${clean}`;
    const claimedCpfLocal = localStorage.getItem(claimedCpfKey);
    if (claimedCpfLocal) {
      try {
        const claimedIds: string[] = JSON.parse(claimedCpfLocal);
        const allHist = await getHistoricalPets();
        const claimedPets = allHist.filter(p => claimedIds.includes(p.id));
        claimedPets.forEach(p => {
          if (!userPets.some(existing => existing.id === p.id)) {
            userPets.push(p);
          }
        });
      } catch {}
    }
  }

  // Pets vinculados ao CPF localmente
  if (userCpf) {
    const clean = userCpf.replace(/\D/g, '');
    const localSaved = localStorage.getItem(`pets_cpf_${clean}`);
    if (localSaved) {
      try {
        const parsed: PetRegistration[] = JSON.parse(localSaved);
        parsed.forEach(p => {
          if (!userPets.some(existing => existing.id === p.id)) {
            userPets.push(p);
          }
        });
      } catch {}
    }
  }

  // Fallback geral de pets salvos localmente pelo usuário atual
  const genLocal = localStorage.getItem('local_pets');
  if (genLocal) {
    try {
      const parsed: PetRegistration[] = JSON.parse(genLocal);
      parsed.filter(p => p.userId === userId || (userCpf && p.cpfTutor?.replace(/\D/g, '') === userCpf.replace(/\D/g, ''))).forEach(p => {
        if (!userPets.some(existing => existing.id === p.id)) {
          userPets.push(p);
        }
      });
    } catch {}
  }

  return userPets.map(applyLocalVaccinesToPet);
}

export async function searchPetByMicrochip(microchip: string): Promise<PetRegistration | null> {
  const cleanChip = microchip.trim();
  if (!cleanChip) return null;

  // 1. Tenta Firestore
  try {
    const q = query(collection(db, "registrations"), where("microchip", "==", cleanChip));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const pet = { id: snap.docs[0].id, ...snap.docs[0].data() } as PetRegistration;
      return applyLocalVaccinesToPet(pet);
    }
  } catch {}

  // 2. Busca na base histórica dos 822 registros
  const historical = await getHistoricalPets();
  const found = historical.find(p => p.microchip === cleanChip || p.id === cleanChip);
  return found ? applyLocalVaccinesToPet(found) : null;
}

export async function searchPetsByCpf(cpf: string): Promise<PetRegistration[]> {
  const cleanCpf = cpf.replace(/\D/g, '');
  if (cleanCpf.length < 3) return [];

  const allPets = await fetchAllPetsForAdmin();
  const claimedKey = `claimed_pets_cpf_${cleanCpf}`;
  const claimedIds: string[] = JSON.parse(localStorage.getItem(claimedKey) || '[]');

  return allPets.filter(p => {
    const petCpf = p.cpfTutor?.replace(/\D/g, '');
    return petCpf === cleanCpf || claimedIds.includes(p.id);
  });
}

export async function createPetRegistration(
  petData: Omit<PetRegistration, 'id' | 'criadoEm' | 'status'>
): Promise<string> {
  const newRecord = {
    ...petData,
    status: 'pendente' as const,
    origem: 'cadastro_online' as const,
    criadoEm: new Date().toISOString()
  };

  const localId = `online_${Date.now()}`;

  // Salva no storage local associado ao CPF para garantir persistência offline
  if (petData.cpfTutor) {
    const clean = petData.cpfTutor.replace(/\D/g, '');
    const key = `pets_cpf_${clean}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.unshift({ ...newRecord, id: localId });
    localStorage.setItem(key, JSON.stringify(existing));
  }

  const localSaved = JSON.parse(localStorage.getItem('local_pets') || '[]');
  localSaved.unshift({ ...newRecord, id: localId });
  localStorage.setItem('local_pets', JSON.stringify(localSaved));

  try {
    const docRef = await addDoc(collection(db, "registrations"), {
      ...newRecord,
      criadoEmFirestore: serverTimestamp()
    });
    return docRef.id;
  } catch (e) {
    console.warn("Firestore offline, registro salvo localmente na sessão:", e);
    return localId;
  }
}

export async function updatePetStatus(
  petId: string, 
  status: 'aprovado' | 'rejeitado' | 'concluido',
  motivo?: string
): Promise<void> {
  // Salva no mapa de overrides
  try {
    const overrides = getLocalOverridesMap();
    overrides[petId] = {
      ...(overrides[petId] || {}),
      status,
      motivoRejeicao: motivo || undefined
    };
    localStorage.setItem('itapet_pet_overrides', JSON.stringify(overrides));
  } catch {}

  // Se não for hist_, atualiza no Firestore
  try {
    if (!petId.startsWith('hist_')) {
      const petRef = doc(db, "registrations", petId);
      await updateDoc(petRef, {
        status,
        motivoRejeicao: motivo || null,
        atualizadoEm: new Date().toISOString()
      });
      return;
    } else {
      const allHist = await getHistoricalPets();
      const histPet = allHist.find(p => p.id === petId);
      if (histPet) {
        const petRef = doc(db, "registrations", petId);
        await setDoc(petRef, {
          ...histPet,
          status,
          motivoRejeicao: motivo || null,
          atualizadoEm: new Date().toISOString()
        }, { merge: true });
      }
    }
  } catch (e) {
    console.warn("Erro ao atualizar no Firestore, aplicando no estado local:", e);
  }
}

export async function addVaccineToPet(
  petId: string,
  vacina: VacinaRegistro
): Promise<void> {
  const vacinaComId: VacinaRegistro = {
    ...vacina,
    id: vacina.id || `vac_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    data: vacina.data || new Date().toLocaleDateString('pt-BR')
  };

  // 1. Salva no mapa de vacinas local para persistir de forma definitiva no navegador
  try {
    const map = getLocalVaccinesMap();
    if (!map[petId]) map[petId] = [];
    map[petId].push(vacinaComId);
    localStorage.setItem('itapet_local_vaccines', JSON.stringify(map));
  } catch (e) {
    console.warn("Aviso ao salvar vacina localmente:", e);
  }

  // 2. Se o animal for histórico (hist_), atualiza no cache em memória e sincroniza no Firestore
  if (petId.startsWith('hist_')) {
    const historical = await getHistoricalPets();
    const petIndex = historical.findIndex(p => p.id === petId);
    if (petIndex !== -1) {
      if (!historical[petIndex].vacinas) historical[petIndex].vacinas = [];
      const vacExists = historical[petIndex].vacinas.some(
        v => v.id === vacinaComId.id || (v.nome === vacinaComId.nome && v.data === vacinaComId.data)
      );
      if (!vacExists) {
        historical[petIndex].vacinas.push(vacinaComId);
      }
      historical[petIndex].status = 'concluido';

      // Salva ou atualiza documento no Firestore na coleção "registrations" para persistência multi-usuário
      try {
        const petRef = doc(db, "registrations", petId);
        await setDoc(petRef, {
          ...historical[petIndex],
          status: 'concluido',
          atualizadoEm: new Date().toISOString()
        }, { merge: true });
      } catch (e) {
        console.warn("Firestore offline para pet histórico:", e);
      }
    }
  } else {
    // 3. Animal cadastrado pelo sistema ou munícipe: atualiza Firestore com arrayUnion
    try {
      const petRef = doc(db, "registrations", petId);
      await updateDoc(petRef, {
        vacinas: arrayUnion(vacinaComId),
        status: 'concluido',
        atualizadoEm: new Date().toISOString()
      });
    } catch (e) {
      console.warn("Erro ao registrar vacina no Firestore:", e);
    }
  }

  // 4. Se estiver salvo em local_pets, atualiza lá também
  try {
    const local = JSON.parse(localStorage.getItem('local_pets') || '[]');
    const idx = local.findIndex((p: any) => p.id === petId);
    if (idx !== -1) {
      local[idx].vacinas = [...(local[idx].vacinas || []), vacinaComId];
      local[idx].status = 'concluido';
      localStorage.setItem('local_pets', JSON.stringify(local));
    }
  } catch {}

  // 5. Atualiza em qualquer lista de pets vinculada a CPF no localStorage
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('pets_cpf_')) {
        const list = JSON.parse(localStorage.getItem(key) || '[]');
        let changed = false;
        const updatedList = list.map((p: PetRegistration) => {
          if (p.id === petId) {
            changed = true;
            return {
              ...p,
              vacinas: [...(p.vacinas || []), vacinaComId],
              status: 'concluido'
            };
          }
          return p;
        });
        if (changed) {
          localStorage.setItem(key, JSON.stringify(updatedList));
        }
      }
    }
  } catch {}
}

// -------------------------------------------------------------
// SERVIÇOS DE CASTRAÇÃO MUNICIPAL COM CADÚNICO/NIS
// -------------------------------------------------------------

export async function createCastrationRequest(
  requestData: Omit<CastrationRequest, 'id' | 'criadoEm' | 'status' | 'prioridadeCadUnico'>
): Promise<string> {
  const hasNis = !!(requestData.nis && requestData.nis.replace(/\D/g, '').length >= 5);
  const ticket = `CAST-${Math.floor(1000 + Math.random() * 9000)}`;
  const newReq: CastrationRequest = {
    ...requestData,
    id: ticket,
    prioridadeCadUnico: hasNis,
    status: 'pendente',
    criadoEm: new Date().toISOString()
  };

  // Salvar no storage local
  try {
    const existing: CastrationRequest[] = JSON.parse(localStorage.getItem('itapet_castration_requests') || '[]');
    existing.unshift(newReq);
    localStorage.setItem('itapet_castration_requests', JSON.stringify(existing));
  } catch {}

  // Salva no storage associado ao CPF se houver
  if (requestData.cpfTutor) {
    try {
      const clean = requestData.cpfTutor.replace(/\D/g, '');
      const cpfKey = `castration_requests_cpf_${clean}`;
      const cpfExisting: CastrationRequest[] = JSON.parse(localStorage.getItem(cpfKey) || '[]');
      cpfExisting.unshift(newReq);
      localStorage.setItem(cpfKey, JSON.stringify(cpfExisting));
    } catch {}
  }

  // Tenta sincronizar com Firestore
  try {
    await addDoc(collection(db, "castration_requests"), {
      ...newReq,
      criadoEmFirestore: serverTimestamp()
    });
  } catch (e) {
    console.warn("Firestore offline, castração salva localmente:", e);
  }

  return ticket;
}

export async function fetchCastrationRequests(): Promise<CastrationRequest[]> {
  let firestoreReqs: CastrationRequest[] = [];
  try {
    const q = query(collection(db, "castration_requests"), orderBy("criadoEm", "desc"));
    const snap = await getDocs(q);
    firestoreReqs = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    })) as CastrationRequest[];
  } catch (e) {
    console.warn("Firestore offline ao buscar solicitações de castração:", e);
  }

  let localReqs: CastrationRequest[] = [];
  try {
    const rawLocal: CastrationRequest[] = JSON.parse(localStorage.getItem('itapet_castration_requests') || '[]');
    // Elimina qualquer resquício de registros fictícios para garantir 100% de dados reais
    const FAKE_MOCK_IDS = new Set(['CAST-8921', 'CAST-4102', 'CAST-1533']);
    localReqs = rawLocal.filter(r => !FAKE_MOCK_IDS.has(r.id));
    if (localReqs.length !== rawLocal.length) {
      localStorage.setItem('itapet_castration_requests', JSON.stringify(localReqs));
    }
  } catch {}

  // Unifica requests evitando duplicação por id
  const map = new Map<string, CastrationRequest>();
  [...localReqs, ...firestoreReqs].forEach(r => {
    if (r.id) map.set(r.id, r);
  });

  const merged = Array.from(map.values());

  // Ordena com triagem de prioridade: CadÚnico / NIS primeiro, depois data de criação mais recente
  return merged.sort((a, b) => {
    if (a.prioridadeCadUnico && !b.prioridadeCadUnico) return -1;
    if (!a.prioridadeCadUnico && b.prioridadeCadUnico) return 1;
    return new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime();
  });
}

export async function updateCastrationStatus(
  requestId: string,
  status: CastrationRequest['status'],
  options?: { motivo?: string; dataAgendamento?: string; observacoes?: string }
): Promise<void> {
  try {
    const local: CastrationRequest[] = JSON.parse(localStorage.getItem('itapet_castration_requests') || '[]');
    const idx = local.findIndex(r => r.id === requestId);
    if (idx !== -1) {
      local[idx].status = status;
      if (options?.motivo) local[idx].motivoRejeicao = options.motivo;
      if (options?.dataAgendamento) local[idx].dataAgendamento = options.dataAgendamento;
      if (options?.observacoes) local[idx].observacoes = options.observacoes;
      local[idx].atualizadoEm = new Date().toISOString();
      localStorage.setItem('itapet_castration_requests', JSON.stringify(local));
    }
  } catch {}

  try {
    const reqRef = doc(db, "castration_requests", requestId);
    await updateDoc(reqRef, {
      status,
      ...(options?.motivo ? { motivoRejeicao: options.motivo } : {}),
      ...(options?.dataAgendamento ? { dataAgendamento: options.dataAgendamento } : {}),
      ...(options?.observacoes ? { observacoes: options.observacoes } : {}),
      atualizadoEm: new Date().toISOString()
    });
  } catch (e) {
    console.warn("Erro ao atualizar status de castração no Firestore:", e);
  }
}

export async function fetchUserCastrationRequests(userId?: string, cpf?: string): Promise<CastrationRequest[]> {
  const all = await fetchCastrationRequests();
  const cleanCpf = cpf ? cpf.replace(/\D/g, '') : '';
  return all.filter(r => 
    (userId && r.userId === userId) ||
    (cleanCpf && r.cpfTutor && r.cpfTutor.replace(/\D/g, '') === cleanCpf)
  );
}
