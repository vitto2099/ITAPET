import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, query, getDocs, where, limit, orderBy } from 'firebase/firestore';
import { db } from '../../src/services/firebaseConfig';
import { Registration } from '../../src/types/pet';
import REGISTROS_HISTORICOS from '../../src/constants/registros_historicos.json';
import { useAuth } from '../../src/contexts/AuthContext';
import { BAIRROS_ITAIOPOLIS } from '../../src/constants/bairros';

const BAIRROS = ["Todos", ...BAIRROS_ITAIOPOLIS];

export default function AdminDashboard() {
  const router = useRouter();
  const { logout } = useAuth();
  const [busca, setBusca] = useState('');
  const [bairro, setBairro] = useState('Todos');
  const [pets, setPets] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 30;

  const fetchPets = async (isMore = false) => {
    if (!isMore) setLoading(true);
    try {
      let q;
      if (bairro === 'Todos') {
        q = query(collection(db, "registrations"), orderBy("criadoEm", "desc"), limit(ITEMS_PER_PAGE));
      } else if (bairro === 'Sistema Antigo') {
        // Apenas dados históricos
        const start = isMore ? pets.length : 0;
        const localData = REGISTROS_HISTORICOS.slice(start, start + ITEMS_PER_PAGE).map(item => ({ ...item, status: 'concluido' })) as any;
        setPets(prev => isMore ? [...prev, ...localData] : localData);
        setLoading(false);
        return;
      } else {
        q = query(collection(db, "registrations"), where("bairro", "==", bairro), orderBy("criadoEm", "desc"), limit(ITEMS_PER_PAGE));
      }

      const querySnapshot = await getDocs(q);
      const firestoreData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Registration[];

      if (bairro === 'Todos' && firestoreData.length < ITEMS_PER_PAGE) {
        // Se pegou poucos do firestore e está em "Todos", completa com históricos
        const needed = ITEMS_PER_PAGE - firestoreData.length;
        const localData = REGISTROS_HISTORICOS.slice(0, needed).map(item => ({ ...item, status: 'concluido' })) as any;
        setPets([...firestoreData, ...localData]);
      } else {
        setPets(firestoreData);
      }
    } catch (error) {
      console.error("Erro ao buscar pets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [bairro]);

  const handleLoadMore = () => {
    if (!loading && busca === '') {
      fetchPets(true);
    }
  };

  const handleSearch = async () => {
    const termo = busca.trim();
    if (!termo) {
      fetchPets();
      return;
    }

    setLoading(true);
    try {
      const q = query(
        collection(db, "registrations"),
        where("microchip", "==", termo),
        limit(50)
      );
      const querySnapshot = await getDocs(q);
      let results = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Registration[];

      // Busca complementar no histórico local
      const localResults = REGISTROS_HISTORICOS.filter(p => 
        p.microchip === termo || 
        p.nomeAnimal.toLowerCase().includes(termo.toLowerCase()) ||
        p.nomeTutor.toLowerCase().includes(termo.toLowerCase())
      ).map(item => ({ ...item, status: 'concluido' })) as any;

      setPets([...results, ...localResults].slice(0, 50));
    } catch (error) {
      console.error("Erro na busca:", error);
      setPets([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, marginBottom: 15 }}>
        <Text style={styles.header}>Painel do Veterinário 🩺</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.push('/(user)/perfil')} style={{ marginRight: 15 }}>
            <Text style={{ color: '#2E7D32', fontWeight: 'bold' }}>Perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => logout()}>
            <Text style={{ color: '#d32f2f', fontWeight: 'bold' }}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.btnAprovar}
        onPress={() => router.push('/(admin)/aprovar-pets')}
      >
        <Text style={{ color: '#FFF', fontWeight: 'bold' }}>📋 Ver Cadastros Pendentes</Text>
      </TouchableOpacity>
      
      <View style={styles.buscaContainer}>
        <TextInput 
          style={styles.busca} 
          placeholder="🔍 Microchip ou Nome..." 
          value={busca}
          onChangeText={setBusca}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.btnBuscar} onPress={handleSearch}>
          <Text style={{color: '#fff'}}>Buscar</Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 60 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {BAIRROS.map(b => (
            <TouchableOpacity 
              key={b} 
              style={[styles.chip, bairro === b && styles.chipAtivo]} 
              onPress={() => setBairro(b)}
            >
              <Text style={bairro === b ? {color: '#fff'} : {}}>{b}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Text style={styles.infoCount}>Carregados: {pets.length} registros</Text>

      {loading && pets.length === 0 ? (
        <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item, index) => item.id + '-' + index}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: 20, marginRight: 8 }}>
                    {item.especie === 'Canino' ? '🐶' : item.especie === 'Felino' ? '🐱' : '🐾'}
                  </Text>
                  <Text style={styles.petNome}>{item.nomeAnimal}</Text>
                </View>
                {(!item.bairro || item.id.length < 5) && (
                  <View style={styles.badgeIncompleto}>
                    <Text style={styles.badgeIncompletoText}>⚠️ Incompleto</Text>
                  </View>
                )}
              </View>
              <Text style={styles.petInfo}>MC: {item.microchip} | {item.raca}</Text>
              <Text style={styles.petTutor}>Tutor: {item.nomeTutor}</Text>
              {!item.bairro && <Text style={styles.avisoBairro}>📍 Localização não informada (Migração)</Text>}
              
              <View style={styles.acoes}>
                <TouchableOpacity 
                  style={styles.btnEditar}
                  onPress={() => router.push({ pathname: '/(user)/detalhes-pet', params: { id: item.id } })}
                >
                  <Text style={{color: '#2E7D32'}}>✏️ Ver Detalhes</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.btnVacina}
                  onPress={() => router.push({ pathname: '/(admin)/cadastrar-pet-admin' as any, params: { id: item.id } })}
                >
                  <Text style={{color: '#fff'}}>💉 Vacina</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListFooterComponent={loading ? <ActivityIndicator color="#2E7D32" style={{ margin: 20 }} /> : null}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>Nenhum registro encontrado.</Text>
          }
        />
      )}

    </View>

  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  header: { fontSize: 22, fontWeight: 'bold' },
  btnAprovar: { backgroundColor: '#FFA000', padding: 15, borderRadius: 10, marginBottom: 20, alignItems: 'center' },
  buscaContainer: { flexDirection: 'row', marginBottom: 15 },
  busca: { flex: 1, backgroundColor: '#fff', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', marginRight: 10 },
  btnBuscar: { backgroundColor: '#2E7D32', padding: 12, borderRadius: 10, justifyContent: 'center' },
  chip: { padding: 10, backgroundColor: '#ddd', borderRadius: 20, marginRight: 10, height: 40 },
  chipAtivo: { backgroundColor: '#2E7D32' },
  infoCount: { fontSize: 12, color: '#666', marginBottom: 10, fontStyle: 'italic' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 12, elevation: 2 },
  petNome: { fontSize: 18, fontWeight: 'bold' },
  badgeIncompleto: { backgroundColor: '#FFF3E0', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 5, borderWidth: 1, borderColor: '#FFB74D' },
  badgeIncompletoText: { fontSize: 10, color: '#E65100', fontWeight: 'bold' },
  petInfo: { color: '#666', marginTop: 2 },
  petTutor: { color: '#888', fontSize: 12, marginTop: 2 },
  avisoBairro: { fontSize: 11, color: '#E65100', fontStyle: 'italic', marginTop: 4 },
  acoes: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  btnEditar: { borderWidth: 1, borderColor: '#2E7D32', padding: 8, borderRadius: 5, width: '48%', alignItems: 'center' },
  btnVacina: { backgroundColor: '#2E7D32', padding: 8, borderRadius: 5, width: '48%', alignItems: 'center' }
});
