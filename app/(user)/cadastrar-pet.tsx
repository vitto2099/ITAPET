import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function CadastrarPet() {
  const router = useRouter();
  const [fotoCarteira, setFotoCarteira] = useState<string | null>(null);

  const tirarFotoCarteira = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Erro", "Precisamos de permissão para acessar a câmera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFotoCarteira(result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cadastro do Animal</Text>

      <Text style={styles.label}>Nome do Bicho</Text>
      <TextInput style={styles.input} placeholder="Ex: Rex" />

      <Text style={styles.label}>Espécie / Raça</Text>
      <TextInput style={styles.input} placeholder="Ex: Cão - Labrador" />

      <Text style={styles.label}>Bairro (Itaiópolis)</Text>
      <TextInput style={styles.input} placeholder="Ex: Centro" />

      <Text style={styles.label}>Carteira de Vacinação (Foto)</Text>
      <TouchableOpacity style={styles.btnCamera} onPress={tirarFotoCarteira}>
        {fotoCarteira ? (
          <Image source={{ uri: fotoCarteira }} style={styles.preview} />
        ) : (
          <Text style={{color: '#2E7D32'}}>📸 Tirar foto da Carteirinha</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.btnFinalizar} 
        onPress={() => {
          Alert.alert("Enviado", "O veterinário irá analisar o cadastro.");
          router.back();
        }}
      >
        <Text style={{color: '#fff', fontWeight: 'bold'}}>Finalizar Cadastro do Pet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 40, color: '#2E7D32', marginBottom: 20 },
  label: { fontWeight: 'bold', marginTop: 15 },
  input: { backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, marginTop: 5 },
  btnCamera: { height: 150, backgroundColor: '#E8F5E9', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 10, borderStyle: 'dashed', borderWidth: 1, borderColor: '#2E7D32' },
  preview: { width: '100%', height: '100%', borderRadius: 10 },
  btnFinalizar: { backgroundColor: '#2E7D32', padding: 18, borderRadius: 10, marginTop: 30, alignItems: 'center' }
});