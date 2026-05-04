import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function CadastrarPetAdmin() {
  const router = useRouter();
  const [fotoVacina, setFotoVacina] = useState<string | null>(null);

  const tirarFotoVacina = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Erro", "Precisamos de permissão para acessar a câmera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({ quality: 0.5 });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFotoVacina(result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 40, marginBottom: 20 }}>
        <Text style={styles.title}>Área Técnica - Veterinário 🩺</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: '#1976D2', fontWeight: 'bold' }}>Voltar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Registro de Microchip (Obrigatório)</Text>
        <TextInput style={styles.inputAdmin} placeholder="Digite o código do Microchip" keyboardType="numeric" />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Lançar Vacina / Procedimento</Text>
        <TextInput style={styles.inputAdmin} placeholder="Ex: Antirrábica - Lote 2024" />
        
        <TouchableOpacity style={styles.btnCamera} onPress={tirarFotoVacina}>
          {fotoVacina ? (
            <Image source={{ uri: fotoVacina }} style={styles.fotoMini} />
          ) : (
            <Text style={{color: '#FFF'}}>📸 Foto da Vacina ou Comprovante</Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.btnFinalizar}
        onPress={() => {
          Alert.alert("Sucesso", "Registro oficial confirmado!");
          router.back();
        }}
      >
        <Text style={styles.btnFinalizarText}>Confirmar Registro Oficial</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F9', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1976D2' },
  section: { backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 20, elevation: 2 },
  label: { fontWeight: 'bold', marginBottom: 8, color: '#333' },
  inputAdmin: { borderWidth: 1, borderColor: '#CCC', padding: 12, borderRadius: 8, backgroundColor: '#FAFAFA' },
  btnCamera: { backgroundColor: '#444', padding: 15, borderRadius: 8, marginTop: 10, alignItems: 'center', height: 100, justifyContent: 'center' },
  fotoMini: { width: '100%', height: '100%', borderRadius: 8 },
  btnFinalizar: { backgroundColor: '#1976D2', padding: 20, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  btnFinalizarText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});