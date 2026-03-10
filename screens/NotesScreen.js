import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, radius } from '../constants/theme';

const KEY = '@coco_notes';

export default function NotesScreen() {
  const [text, setText] = useState('');
  const [saved, setSaved] = useState('');
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem(KEY);
        const t = await AsyncStorage.getItem(KEY + '_time');
        if (v) { setSaved(v); setText(v); }
        if (t) setLastSavedAt(new Date(parseInt(t, 10)));
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
      await AsyncStorage.setItem(KEY, text);
      await AsyncStorage.setItem(KEY + '_time', String(Date.now()));
      setSaved(text);
      setLastSavedAt(new Date());
      Alert.alert('Saved', 'Your note has been saved');
    } catch (e) {
      Alert.alert('Error', 'Could not save');
    }
  };

  const clear = () => {
    Alert.alert('Clear note', 'Delete this note permanently?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          setText('');
          setSaved('');
          setLastSavedAt(null);
          await AsyncStorage.removeItem(KEY);
          await AsyncStorage.removeItem(KEY + '_time');
        },
      },
    ]);
  };

  const hasChanges = text !== saved;

  if (loading) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Loading…</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={styles.label}>Your note</Text>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type your notes here…"
          placeholderTextColor={colors.textMuted}
          multiline
          textAlignVertical="top"
        />
        {lastSavedAt && saved ? (
          <Text style={styles.meta}>Last saved: {lastSavedAt.toLocaleTimeString()}</Text>
        ) : null}
        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.saveBtn, !hasChanges && styles.saveBtnDisabled]}
            onPress={save}
            disabled={!hasChanges}
          >
            <Text style={[styles.saveBtnText, !hasChanges && styles.saveBtnTextDisabled]}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.clearBtn} onPress={clear}>
            <Text style={styles.clearBtnText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light },
  scroll: { flex: 1 },
  content: { padding: spacing.xl, paddingBottom: 40 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.light },
  loadingText: { fontSize: 16, color: colors.textMuted },
  label: { fontSize: 12, color: colors.textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: {
    minHeight: 200,
    borderWidth: 2,
    borderColor: colors.lightMuted,
    borderRadius: radius.lg,
    padding: spacing.lg,
    fontSize: 16,
    lineHeight: 24,
    backgroundColor: colors.white,
    color: colors.text,
  },
  meta: { fontSize: 12, color: colors.textMuted, marginTop: 8 },
  buttons: { flexDirection: 'row', gap: 12, marginTop: 20 },
  saveBtn: { flex: 1, backgroundColor: colors.primary, paddingVertical: 16, borderRadius: radius.lg, alignItems: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 6, elevation: 3 },
  saveBtnDisabled: { backgroundColor: colors.lightMuted, opacity: 0.8 },
  saveBtnText: { color: colors.white, fontWeight: '700', fontSize: 16 },
  saveBtnTextDisabled: { color: colors.textMuted },
  clearBtn: { paddingVertical: 16, paddingHorizontal: 24, borderRadius: radius.lg, backgroundColor: colors.lightMuted, justifyContent: 'center' },
  clearBtnText: { color: colors.textMuted, fontWeight: '600', fontSize: 16 },
});
