import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { collection, query, where, getDocs, updateDoc, doc, orderBy } from 'firebase/firestore';
import { db } from '../../src/services/firebaseConfig';
import { Registration } from '../../src/types/pet';
import { styles } from '../../src/styles/aprovar-pets.styles';

export default function AprovarPets() {
  const router = useRouter();
  const [pets, setPets] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendentes = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "registrations"),
        where("status", "==", "pendente"),
        orderBy("criadoEm", "asc")
      );
      
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Registration[];
      
      setPets(data);
    } catch (error) {
      console.error("Erro ao buscar pendentes:", error);
      Alert.alert("Erro", "Não foi possível carregar os cadastros.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendentes();
  }, []);

  const handleDecisao = async (id: string, aprovado: boolean) => {
    const novoStatus = aprovado ? "aprovado" : "rejeitado";
    
    try {
      const petRef = doc(db, "registrations", id);
      await updateDoc(petRef, {
        status: novoStatus,
        aprovadoEm: new Date().toISOString()
      });

      Alert.alert("Sucesso", `O animal foi ${novoStatus} com sucesso!`);
      // Remove da lista visual após a ação
      setPets(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      Alert.alert("Erro", "Falha ao processar decisão.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 30, marginBottom: 20 }}>
        <Text style={styles.title}>Cadastros Pendentes 📋</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: '#2E7D32', fontWeight: 'bold' }}>Voltar</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={pets}
          keyExtractor={item => item.id}
          onRefresh={fetchPendentes}
          refreshing={loading}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.petName}>{item.nomeAnimal} ({item.especie})</Text>
                <Text style={styles.subText}>Tutor: {item.nomeTutor || 'Não informado'}</Text>
                <Text style={styles.subText}>Bairro: {item.bairro || 'Não informado'}</Text>
                <Text style={styles.subText}>Raça: {item.raca}</Text>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity 
                  style={[styles.btn, { backgroundColor: '#f0f0f0', width: 80 }]}
                  onPress={() => router.push({ pathname: '/(user)/detalhes-pet', params: { id: item.id } })}
                >
                  <Text style={{ fontSize: 12, color: '#333' }}>Detalhes</Text>
                </TouchableOpacity>

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
          ListEmptyComponent={
            <View style={{ marginTop: 50, alignItems: 'center' }}>
              <Text style={{ color: '#999' }}>Nenhum pet aguardando aprovação.</Text>
              <TouchableOpacity onPress={fetchPendentes} style={{ marginTop: 15 }}>
                <Text style={{ color: '#2E7D32', fontWeight: 'bold' }}>🔄 Atualizar</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}
