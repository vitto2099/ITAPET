import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';

// Lista de bairros fixa para evitar erros de importação externa
const BAIRROS = ["Todos", "Centro", "Lucena", "Vila Nova", "Alto Paranaíba", "Santo Antônio", "Bom Jesus"];

export default function AdminDashboard() {
  const router = useRouter();
  const [busca, setBusca] = useState('');
  const [bairro, setBairro] = useState('Todos');

  // Dados fictícios para teste
  const PETS = [
    { id: '1', nome: 'Rex', microchip: '900123', bairro: 'Centro' },
    { id: '2', nome: 'Luna', microchip: '900456', bairro: 'Lucena' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Painel do Veterinário 🩺</Text>
      
      <TextInput 
        style={styles.busca} 
        placeholder="🔍 Buscar Microchip ou Nome..." 
        onChangeText={setBusca}
      />

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

      <FlatList
        data={PETS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.petNome}>{item.nome}</Text>
            <Text style={styles.petInfo}>MC: {item.microchip} | {item.bairro}</Text>
            
            <View style={styles.acoes}>
              <TouchableOpacity 
                style={styles.btnEditar}
                onPress={() => Alert.alert("Editar", "Abrindo edição...")}
              >
                <Text style={{color: '#2E7D32'}}>✏️ Editar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.btnVacina}
                onPress={() => router.push('/(user)/cadastrar-pet-admin')}
              >
                <Text style={{color: '#fff'}}>💉 Vacina</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  header: { fontSize: 22, fontWeight: 'bold', marginTop: 40, marginBottom: 15 },
  busca: { backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  chip: { padding: 10, backgroundColor: '#ddd', borderRadius: 20, marginRight: 10, height: 40 },
  chipAtivo: { backgroundColor: '#2E7D32' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 12, elevation: 2 },
  petNome: { fontSize: 18, fontWeight: 'bold' },
  petInfo: { color: '#666' },
  acoes: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  btnEditar: { borderWidth: 1, borderColor: '#2E7D32', padding: 8, borderRadius: 5, width: '48%', alignItems: 'center' },
  btnVacina: { backgroundColor: '#2E7D32', padding: 8, borderRadius: 5, width: '48%', alignItems: 'center' }
});