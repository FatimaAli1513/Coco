import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@coco_notes';

export default function NotesScreen() {
  const [text, setText] = useState('');
  const [saved, setSaved] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem(KEY);
        if (v) { setSaved(v); setText(v); }
      } catch (e) {}
    })();
  }, []);

  const save = async () => {
    try {
      await AsyncStorage.setItem(KEY, text);
      setSaved(text);
      Alert.alert('Saved', 'Note saved.');
    } catch (e) {
      Alert.alert('Error', 'Could not save.');
    }
  };

  const clear = () => {
    Alert.alert('Clear note', 'Delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          setText('');
          setSaved('');
          await AsyncStorage.removeItem(KEY);
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>Quick note</Text>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Type here..."
        placeholderTextColor="#94a3b8"
        multiline
      />
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.saveBtn} onPress={save}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.clearBtn} onPress={clear}>
          <Text style={styles.clearBtnText}>Clear</Text>
        </TouchableOpacity>
      </View>
      {saved ? (
        <View style={styles.savedBox}>
          <Text style={styles.savedLabel}>Last saved</Text>
          <Text style={styles.savedText}>{saved}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 20, paddingTop: 60 },
  label: { fontSize: 14, color: '#64748b', marginBottom: 8 },
  input: {
    minHeight: 160,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
  buttons: { flexDirection: 'row', gap: 12, marginTop: 16 },
  saveBtn: { flex: 1, backgroundColor: '#2563eb', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  saveBtnText: { color: '#fff', fontWeight: '600' },
  clearBtn: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center' },
  clearBtnText: { color: '#64748b' },
  savedBox: { marginTop: 24, padding: 16, backgroundColor: '#f1f5f9', borderRadius: 12 },
  savedLabel: { fontSize: 12, color: '#64748b', marginBottom: 6 },
  savedText: { fontSize: 15, color: '#334155' },
});
