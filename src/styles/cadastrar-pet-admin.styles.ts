import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F4F9', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#1976D2' },
  section: { backgroundColor: '#FFF', padding: 15, borderRadius: 10, marginBottom: 20, elevation: 2 },
  label: { fontWeight: 'bold', marginBottom: 8, color: '#333' },
  inputAdmin: { borderWidth: 1, borderColor: '#CCC', padding: 12, borderRadius: 8, backgroundColor: '#FAFAFA' },
  btnCamera: { backgroundColor: '#444', padding: 15, borderRadius: 8, marginTop: 10, alignItems: 'center', height: 100, justifyContent: 'center' },
  fotoMini: { width: '100%', height: '100%', borderRadius: 8 },
  btnFinalizar: { backgroundColor: '#1976D2', padding: 20, borderRadius: 10, alignItems: 'center', marginTop: 10, minHeight: 60, justifyContent: 'center' },
  btnFinalizarText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});
