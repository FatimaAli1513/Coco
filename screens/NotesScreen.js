import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, radius } from '../constants/theme';

const KEY = '@coco_notes';

export default function NotesScreen() {
  const [text, setText] = useState('');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              setNotes(parsed);
            } else {
              setNotes([]);
            }
          } catch (_) {
            const oldT = await AsyncStorage.getItem(KEY + '_time');
            const ts = oldT ? parseInt(oldT, 10) : Date.now();
            const arr = [{ id: ts, text: raw, savedAt: ts }];
            setNotes(arr);
            await AsyncStorage.setItem(KEY, JSON.stringify(arr));
            await AsyncStorage.removeItem(KEY + '_time');
          }
        }
      } catch (e) {}
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    if (!text.trim()) {
      Alert.alert('Empty', 'Note is empty');
      return;
    }
    try {
      const newNote = { id: Date.now(), text: text.trim(), savedAt: Date.now() };
      const updated = [newNote, ...notes];
      await AsyncStorage.setItem(KEY, JSON.stringify(updated));
      setNotes(updated);
      setText('');
    } catch (e) {
      Alert.alert('Error', 'Could not save');
    }
  };

  const deleteNote = (id) => {
    Alert.alert('Delete note', 'Delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updated = notes.filter((n) => n.id !== id);
          setNotes(updated);
          await AsyncStorage.setItem(KEY, JSON.stringify(updated));
        },
      },
    ]);
  };

  const clearInput = () => {
    setText('');
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Loading…</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>New note</Text>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type your note here…"
          placeholderTextColor={colors.textMuted}
          multiline
          textAlignVertical="top"
        />
        <View style={styles.buttons}>
          <TouchableOpacity style={[styles.saveBtn, !text.trim() && styles.saveBtnDisabled]} onPress={save} disabled={!text.trim()}>
            <Text style={[styles.saveBtnText, !text.trim() && styles.saveBtnTextDisabled]}>Save note</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearBtn} onPress={clearInput}>
            <Text style={styles.clearBtnText}>Clear</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.savedSection}>
          <Text style={styles.savedLabel}>Saved notes ({notes.length})</Text>
          {notes.length === 0 ? (
            <Text style={styles.emptyText}>No notes yet. Add one above!</Text>
          ) : (
            notes.map((note) => (
              <View key={note.id} style={styles.noteCard}>
                <Text style={styles.noteText}>{note.text}</Text>
                <View style={styles.noteFooter}>
                  <Text style={styles.noteMeta}>{new Date(note.savedAt).toLocaleString()}</Text>
                  <TouchableOpacity onPress={() => deleteNote(note.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Ionicons name="trash-outline" size={22} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light },
  scroll: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 60 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.light },
  loadingText: { fontSize: 16, color: colors.textMuted },
  label: { fontSize: 12, color: colors.textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    minHeight: 120,
    borderWidth: 2,
    borderColor: colors.lightMuted,
    borderRadius: radius.lg,
    padding: spacing.lg,
    fontSize: 16,
    lineHeight: 24,
    backgroundColor: colors.white,
    color: colors.text,
  },
  buttons: { flexDirection: 'row', gap: 12, marginTop: 16 },
  saveBtn: { flex: 1, backgroundColor: colors.primary, paddingVertical: 16, borderRadius: radius.lg, alignItems: 'center' },
  saveBtnDisabled: { backgroundColor: colors.lightMuted, opacity: 0.8 },
  saveBtnText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  saveBtnTextDisabled: { color: colors.textMuted },
  clearBtn: { paddingVertical: 16, paddingHorizontal: 24, borderRadius: radius.lg, backgroundColor: colors.lightMuted, justifyContent: 'center' },
  clearBtnText: { color: colors.textMuted, fontWeight: '600', fontSize: 16 },
  savedSection: { marginTop: 32 },
  savedLabel: { fontSize: 12, color: colors.textMuted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  emptyText: { fontSize: 14, color: colors.textMuted, fontStyle: 'italic' },
  noteCard: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightMuted,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: 12,
  },
  noteText: { fontSize: 16, lineHeight: 24, color: colors.text },
  noteFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.lightMuted },
  noteMeta: { fontSize: 12, color: colors.textMuted },
});
