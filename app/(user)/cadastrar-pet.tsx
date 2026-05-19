import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BAIRROS_ITAIOPOLIS } from '../../src/constants/bairros';
import { useAuth } from '../../src/contexts/AuthContext';
import { db } from '../../src/services/firebaseConfig';
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
  const [fotosPet, setFotosPet] = useState<string[]>([]);
  const [fotoCarteira, setFotoCarteira] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selecionarImagem = async (tipo: 'pet' | 'carteira') => {
    if (tipo === 'pet' && fotosPet.length >= 4) {
      Alert.alert("Aviso", "Você já adicionou o limite de 4 fotos para o pet.");
      return;
    }
    Alert.alert(
      "Selecionar Imagem",
      "Escolha de onde deseja pegar a foto",
      [
        { text: "Câmera", onPress: () => abrirCamera(tipo) },
        { text: "Galeria", onPress: () => abrirGaleria(tipo) },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  };

  const abrirCamera = async (tipo: 'pet' | 'carteira') => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Erro", "Precisamos de permissão para acessar a câmera.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      if (tipo === 'pet') {
        setFotosPet(prev => [...prev, result.assets[0].uri]);
      } else {
        setFotoCarteira(result.assets[0].uri);
      }
    }
  };

  const abrirGaleria = async (tipo: 'pet' | 'carteira') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Erro", "Precisamos de permissão para acessar a galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      if (tipo === 'pet') {
        setFotosPet(prev => [...prev, result.assets[0].uri]);
      } else {
        setFotoCarteira(result.assets[0].uri);
      }
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
      let fotosUrls: string[] = [];
      let carteiraUrl = null;

      if (fotosPet.length > 0) {
        for (let i = 0; i < fotosPet.length; i++) {
          const path = `registrations/${user.uid}/pet_${Date.now()}_${i}.jpg`;
          const url = await uploadImage(fotosPet[i], path);
          if (url) fotosUrls.push(url);
        }
      }

      if (fotoCarteira) {
        const path = `registrations/${user.uid}/carteira_${Date.now()}.jpg`;
        carteiraUrl = await uploadImage(fotoCarteira, path);
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
        fotoUrl: fotosUrls.length > 0 ? fotosUrls[0] : null,
        fotosPet: fotosUrls,
        carteiraUrl: carteiraUrl,
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
        {BAIRROS_ITAIOPOLIS.filter(b => b !== 'Sistema Antigo').map(b => (
          <SelectionChip
            key={b}
            label={b}
            selected={bairro === b}
            onSelect={() => setBairro(b)}
          />
        ))}
      </ScrollView>

      <Text style={styles.label}>Fotos do Animal (Até 4 fotos)</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
        {fotosPet.map((uri, index) => (
          <View key={index} style={{ position: 'relative' }}>
            <Image source={{ uri }} style={{ width: 80, height: 80, borderRadius: 10 }} />
            <TouchableOpacity
              style={{ position: 'absolute', top: -5, right: -5, backgroundColor: 'red', borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}
              onPress={() => setFotosPet(prev => prev.filter((_, i) => i !== index))}
            >
              <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
        {fotosPet.length < 4 && (
          <TouchableOpacity
            style={[styles.btnCamera, { width: 80, height: 80, marginTop: 0, marginBottom: 0, alignSelf: 'flex-start' }]}
            onPress={() => selecionarImagem('pet')}
          >
            <Text style={{ color: '#2E7D32', textAlign: 'center', fontSize: 24 }}>+</Text>
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.label}>Carteira de Vacinação (Opcional)</Text>
      <TouchableOpacity style={styles.btnCamera} onPress={() => selecionarImagem('carteira')}>
        {fotoCarteira ? (
          <Image source={{ uri: fotoCarteira }} style={styles.preview} />
        ) : (
          <Text style={{ color: '#2E7D32' }}>📂 Anexar Carteirinha</Text>
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
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Finalizar Cadastro do Pet</Text>
        )}
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}


