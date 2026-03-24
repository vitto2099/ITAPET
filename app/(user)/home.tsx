import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';

// Dados mockados para o teste visual
const MEUS_PETS = [
  { id: '1', nome: 'Rex', status: 'Aprovado', especie: 'Cão' },
  { id: '2', nome: 'Luna', status: 'Pendente', especie: 'Gato' },
];

export default function HomeUser() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Olá, Cidadão! 👋</Text>
        <Text style={styles.sub}>Itaiópolis - SC</Text>
      </View>

      <Text style={styles.sectionTitle}>Meus Animais</Text>

      <FlatList
        data={MEUS_PETS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.petCard}>
            <View>
              <Text style={styles.petName}>{item.nome}</Text>
              <Text style={item.status === 'Aprovado' ? styles.statusOk : styles.statusWait}>
                {item.status}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.editBtn}
              onPress={() => alert('Em breve: Detalhes do Pet')}
            >
              <Text style={{ color: '#2E7D32' }}>Ver</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => router.push('/(user)/cadastrar-pet')}
      >
        <Text style={styles.fabText}>+ Cadastrar Novo Pet</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA', padding: 20 },
  header: { marginTop: 40, marginBottom: 30 },
  greeting: { fontSize: 26, fontWeight: 'bold', color: '#1A1A1A' },
  sub: { fontSize: 14, color: '#666' },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 15 },
  petCard: { 
    backgroundColor: '#FFF', 
    padding: 15, 
    borderRadius: 12, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2
  },
  petName: { fontSize: 18, fontWeight: 'bold' },
  statusOk: { color: 'green', fontSize: 12, fontWeight: '600' },
  statusWait: { color: 'orange', fontSize: 12, fontWeight: '600' },
  editBtn: { padding: 8, borderWidth: 1, borderColor: '#2E7D32', borderRadius: 6 },
  fab: { 
    backgroundColor: '#2E7D32', 
    padding: 18, 
    borderRadius: 30, 
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    elevation: 5
  },
  fabText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' }
});