import { ScrollView, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function Ajuda() {
  const router = useRouter();
  return (
    <ScrollView style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
        <Text style={styles.title}>Informações ItaPet 🐾</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ color: '#2E7D32', fontWeight: 'bold' }}>Voltar</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoBox}>
        <Text style={styles.topic}>🗓️ Calendário de Vacinação</Text>
        <Text style={styles.text}>A campanha de vacinação anti-rábica acontece anualmente no Centro de Eventos.</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.topic}>✂️ Castração Gratuita</Text>
        <Text style={styles.text}>Para solicitar castração, seu pet precisa estar com o cadastro "Aprovado" neste app.</Text>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.topic}>📢 Meu Pet Sumiu!</Text>
        <Text style={styles.text}>Mude o status do seu animal para "Desaparecido" no seu perfil para alertar a comunidade.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2E7D32', marginBottom: 25 },
  infoBox: { marginBottom: 20, padding: 15, backgroundColor: '#F9F9F9', borderRadius: 10, borderWidth: 1, borderColor: '#EEE' },
  topic: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  text: { fontSize: 14, color: '#666', lineHeight: 20 }
});