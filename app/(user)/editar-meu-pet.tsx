import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../src/services/firebaseConfig';
import { Registration } from '../../src/types/pet';
import { useAuth } from '../../src/contexts/AuthContext';

export default function EditarMeuPet() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState('');
  const [raca, setRaca] = useState('');

  useEffect(() => {
    const fetchPet = async () => {
      if (!id || !user) return;
      try {
        const docRef = doc(db, "registrations", id.toString());
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Registration;
          
          // Verifica se o usuário é o dono do pet
          if (data.userId !== user.uid) {
            Alert.alert("Acesso Negado", "Você não tem permissão para editar este animal.");
            router.back();
            return;
          }

          setNome(data.nomeAnimal || '');
          setEspecie(data.especie || '');
          setRaca(data.raca || '');
        }
      } catch (error) {
        console.error("Erro ao buscar pet para edição:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id, user]);

  const handleSalvar = async () => {
    if (!id) return;
    try {
      const docRef = doc(db, "registrations", id.toString());
      await updateDoc(docRef, {
        nomeAnimal: nome,
        especie: especie,
        raca: raca,
      });
      Alert.alert("Sucesso", "Dados atualizados com sucesso!", [
        { text: "OK", onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error("Erro ao atualizar pet:", error);
      Alert.alert("Erro", "Não foi possível atualizar os dados.");
    }
  };

  const handleExcluir = () => {
    Alert.alert(
      "Remover Cadastro",
      "Deseja realmente remover o cadastro deste animal? Esta ação não pode ser desfeita.",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Remover", 
          style: "destructive",
          onPress: async () => {
            try {
              if (id) {
                await deleteDoc(doc(db, "registrations", id.toString()));
                Alert.alert("Removido", "O cadastro foi removido.");
                router.replace('/(user)/home');
              }
            } catch (error) {
              console.error("Erro ao excluir pet:", error);
              Alert.alert("Erro", "Falha ao remover o cadastro.");
            }
          }
        }
      ]
    );
  };

  if (loading) return <View style={styles.container}><ActivityIndicator size="large" color="#2E7D32" style={{marginTop: 50}} /></View>;

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Editar Meu Pet</Text>
        <TouchableOpacity onPress={handleSalvar}>
          <Text style={styles.saveText}>Salvar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome do Animal</Text>
          <TextInput 
            style={styles.input} 
            value={nome} 
            onChangeText={setNome}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Espécie</Text>
          <TextInput 
            style={styles.input} 
            value={especie} 
            onChangeText={setEspecie}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Raça</Text>
          <TextInput 
            style={styles.input} 
            value={raca} 
            onChangeText={setRaca}
          />
        </View>

        <TouchableOpacity 
          style={styles.btnDanger}
          onPress={handleExcluir}
        >
          <Text style={styles.btnDangerText}>🗑️ Remover Animal</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    paddingHorizontal: 20, 
    paddingTop: 60, 
    paddingBottom: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    backgroundColor: '#FFF' 
  },
  backText: { color: '#666', fontSize: 16 },
  saveText: { color: '#2E7D32', fontSize: 16, fontWeight: 'bold' },
  title: { fontSize: 18, fontWeight: 'bold' },
  form: { padding: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  input: { 
    backgroundColor: '#FFF', 
    padding: 15, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#E0E0E0',
    fontSize: 16
  },
  btnDanger: { 
    marginTop: 40, 
    padding: 18, 
    borderRadius: 12, 
    borderWidth: 1, 
    borderColor: '#FFCDD2',
    backgroundColor: '#FFEBEE',
    alignItems: 'center' 
  },
  btnDangerText: { color: '#D32F2F', fontWeight: 'bold' }
});
