import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginTop: 40, color: '#2E7D32', marginBottom: 20 },
  label: { fontWeight: 'bold', marginTop: 15, marginBottom: 8 },
  input: { backgroundColor: '#f5f5f5', padding: 12, borderRadius: 8, marginBottom: 5 },
  chipGroup: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 5 },
  chip: { paddingHorizontal: 15, paddingVertical: 10, borderRadius: 20, backgroundColor: '#f0f0f0', marginRight: 10, marginBottom: 10, borderWidth: 1, borderColor: '#e0e0e0' },
  chipSelected: { backgroundColor: '#2E7D32', borderColor: '#2E7D32' },
  chipText: { color: '#666' },
  chipTextSelected: { color: '#fff', fontWeight: 'bold' },
  btnCamera: { height: 150, backgroundColor: '#E8F5E9', borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 10, borderStyle: 'dashed', borderWidth: 1, borderColor: '#2E7D32' },
  preview: { width: '100%', height: '100%', borderRadius: 10 },
  btnFinalizar: { backgroundColor: '#2E7D32', padding: 18, borderRadius: 10, marginTop: 30, alignItems: 'center', minHeight: 60, justifyContent: 'center' }
});
