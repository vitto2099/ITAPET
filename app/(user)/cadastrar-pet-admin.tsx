import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../src/services/firebaseConfig';
import { uploadImage } from '../../src/services/uploadImage';
import { useAuth } from '../../src/contexts/AuthContext';
import { styles } from '../../src/styles/cadastrar-pet-admin.styles';

export default function CadastrarPetAdmin() {
  const router = useRouter();
  const { user } = useAuth();
  const [microchip, setMicrochip] = useState('');
  const [procedimento, setProcedimento] = useState('');
  const [fotoVacina, setFotoVacina] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  const handleSalvar = async () => {
    if (!microchip) {
      Alert.alert("Aviso", "O código do Microchip é obrigatório.");
      return;
    }

    setLoading(true);
    try {
      let fotoUrl = null;
      if (fotoVacina && user) {
        const path = `vaccines/${user.uid}/${Date.now()}.jpg`;
        fotoUrl = await uploadImage(fotoVacina, path);
      }

      await addDoc(collection(db, "registrations"), {
        microchip: microchip,
        procedimento: procedimento,
        fotoVacinaUrl: fotoUrl,
        status: 'Concluido',
        tipoRegistro: 'Admin',
        criadoEm: serverTimestamp(),
      });

      Alert.alert("Sucesso", "Registro oficial confirmado!");
      router.back();
    } catch (error) {
      console.error("Erro ao salvar registro admin:", error);
      Alert.alert("Erro", "Não foi possível salvar o registro.");
    } finally {
      setLoading(false);
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
        <TextInput 
          style={styles.inputAdmin} 
          placeholder="Digite o código do Microchip" 
          keyboardType="numeric" 
          value={microchip}
          onChangeText={setMicrochip}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Lançar Vacina / Procedimento</Text>
        <TextInput 
          style={styles.inputAdmin} 
          placeholder="Ex: Antirrábica - Lote 2024" 
          value={procedimento}
          onChangeText={setProcedimento}
        />
        
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
        onPress={handleSalvar}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnFinalizarText}>Confirmar Registro Oficial</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}
