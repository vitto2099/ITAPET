import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';

const PETS_PENDENTES = [
  { id: '1', nome: 'Bidu', especie: 'Cão', bairro: 'Alto Paranaíba', dono: 'Carlos' },
  { id: '2', nome: 'Mingau', especie: 'Gato', bairro: 'Lucena', dono: 'Maria' },
];

export default function AprovarPets() {
  const [pets, setPets] = useState(PETS_PENDENTES);

  const handleDecisao = (id: string, aprovado: boolean) => {
    const acao = aprovado ? "aprovado" : "rejeitado";
    Alert.alert("Sucesso", `O animal foi ${acao} com sucesso!`);
    // Remove da lista visual após a ação
    setPets(prev => prev.filter(p => p.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastros Pendentes 📋</Text>
      
      <FlatList
        data={pets}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.petName}>{item.nome} ({item.especie})</Text>
              <Text style={styles.subText}>Dono: {item.dono}</Text>
              <Text style={styles.subText}>Bairro: {item.bairro}</Text>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity 
                style={[styles.btn, styles.btnCheck]} 
                onPress={() => handleDecisao(item.id, true)}
              >
                <Text style={styles.btnText}>✅</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.btn, styles.btnReject]} 
                onPress={() => handleDecisao(item.id, false)}
              >
                <Text style={styles.btnText}>❌</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>Nenhum pet pendente!</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, marginTop: 30 },
  card: { 
    backgroundColor: '#FFF', 
    padding: 15, 
    borderRadius: 12, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#FFA000' // Alerta de pendência
  },
  petName: { fontSize: 16, fontWeight: 'bold' },
  subText: { fontSize: 13, color: '#666' },
  actions: { flexDirection: 'row' },
  btn: { width: 45, height: 45, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginLeft: 10 },
  btnCheck: { backgroundColor: '#E8F5E9' },
  btnReject: { backgroundColor: '#FFEBEE' },
  btnText: { fontSize: 18 }
});