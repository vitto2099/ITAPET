import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function EditarPet() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Estados com valores mockados (em um app real viriam do Firebase via ID)
  const [nome, setNome] = useState('Rex');
  const [especie, setEspecie] = useState('Cão - Labrador');
  const [bairro, setBairro] = useState('Centro');
  const [microchip, setMicrochip] = useState('900123');

  const handleSalvar = () => {
    Alert.alert("Sucesso", "Dados atualizados com sucesso!", [
      { text: "OK", onPress: () => router.back() }
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>Cancelar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Editar Cadastro</Text>
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
          <Text style={styles.label}>Espécie / Raça</Text>
          <TextInput 
            style={styles.input} 
            value={especie} 
            onChangeText={setEspecie}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Bairro</Text>
          <TextInput 
            style={styles.input} 
            value={bairro} 
            onChangeText={setBairro}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Número do Microchip</Text>
          <TextInput 
            style={styles.input} 
            value={microchip} 
            onChangeText={setMicrochip}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity 
          style={styles.btnDanger}
          onPress={() => Alert.alert("Remover", "Deseja realmente excluir este registro?")}
        >
          <Text style={styles.btnDangerText}>Excluir Registro Permanente</Text>
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
    alignItems: 'center' 
  },
  btnDangerText: { color: '#D32F2F', fontWeight: 'bold' }
});
