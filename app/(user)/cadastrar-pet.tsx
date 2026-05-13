import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../src/services/firebaseConfig';
import { BAIRROS_ITAIOPOLIS } from '../../src/constants/bairros';
import { useAuth } from '../../src/contexts/AuthContext';
import { uploadImage } from '../../src/services/uploadImage';
import { styles } from '../../src/styles/cadastrar-pet.styles';

export default function CadastrarPet() {
  const router = useRouter();
  const { user, userData } = useAuth();
  const [nome, setNome] = useState('');
  const [especie, setEspecie] = useState<'Canino' | 'Felino' | 'Outro'>('Canino');
  const [outroEspecie, setOutroEspecie] = useState('');
  const [sexo, setSexo] = useState<'Macho' | 'Fêmea'>('Macho');
  const [raca, setRaca] = useState('');
  const [bairro, setBairro] = useState(BAIRROS_ITAIOPOLIS[0]);
  const [fotoCarteira, setFotoCarteira] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  const handleSalvar = async () => {
    if (!nome || !raca || (especie === 'Outro' && !outroEspecie)) {
      Alert.alert("Aviso", "Preencha todos os campos obrigatórios.");
      return;
    }

    if (!user) {
      Alert.alert("Erro", "Você precisa estar logado.");
      return;
    }

    setLoading(true);
    try {
      let fotoUrl = null;
      if (fotoCarteira) {
        const path = `registrations/${user.uid}/${Date.now()}.jpg`;
        fotoUrl = await uploadImage(fotoCarteira, path);
      }

      await addDoc(collection(db, "registrations"), {
        nomeAnimal: nome,
        especie: especie === 'Outro' ? outroEspecie : especie,
        sexo: sexo,
        raca: raca,
        bairro: bairro,
        status: 'pendente',
        userId: user.uid,
        nomeTutor: userData?.nome || 'Cidadão',
        fotoUrl: fotoUrl,
        criadoEm: serverTimestamp(),
      });

      Alert.alert("Sucesso", "O veterinário irá analisar o cadastro.");
      router.back();
    } catch (error) {
      console.error("Erro ao salvar pet:", error);
      Alert.alert("Erro", "Não foi possível salvar o pet.");
    } finally {
      setLoading(false);
    }
  };

  const SelectionChip = ({ label, selected, onSelect }: { label: string, selected: boolean, onSelect: () => void }) => (
    <TouchableOpacity 
      style={[styles.chip, selected && styles.chipSelected]} 
      onPress={onSelect}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cadastro do Animal</Text>

      <Text style={styles.label}>Nome do Bicho</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Ex: Rex" 
        value={nome}
        onChangeText={setNome}
      />

      <Text style={styles.label}>O que ele é?</Text>
      <View style={styles.chipGroup}>
        <SelectionChip label="🐶 Cachorro" selected={especie === 'Canino'} onSelect={() => setEspecie('Canino')} />
        <SelectionChip label="🐱 Gato" selected={especie === 'Felino'} onSelect={() => setEspecie('Felino')} />
        <SelectionChip label="🐾 Outro" selected={especie === 'Outro'} onSelect={() => setEspecie('Outro')} />
      </View>
      {especie === 'Outro' && (
        <TextInput 
          style={styles.input} 
          placeholder="Qual espécie?" 
          value={outroEspecie}
          onChangeText={setOutroEspecie}
        />
      )}

      <Text style={styles.label}>Sexo</Text>
      <View style={styles.chipGroup}>
        <SelectionChip label="♂️ Macho" selected={sexo === 'Macho'} onSelect={() => setSexo('Macho')} />
        <SelectionChip label="♀️ Fêmea" selected={sexo === 'Fêmea'} onSelect={() => setSexo('Fêmea')} />
      </View>

      <Text style={styles.label}>Raça</Text>
      <TextInput 
        style={styles.input} 
        placeholder="Ex: SRD ou Labrador" 
        value={raca}
        onChangeText={setRaca}
      />

      <Text style={styles.label}>Seu Bairro (Itaiópolis)</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipGroup}>
        {BAIRROS_ITAIOPOLIS.map(b => (
          <SelectionChip 
            key={b} 
            label={b} 
            selected={bairro === b} 
            onSelect={() => setBairro(b)} 
          />
        ))}
      </ScrollView>

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
        onPress={handleSalvar}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{color: '#fff', fontWeight: 'bold'}}>Finalizar Cadastro do Pet</Text>
        )}
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

