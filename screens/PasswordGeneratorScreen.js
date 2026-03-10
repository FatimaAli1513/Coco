import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';

const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

export default function PasswordGeneratorScreen() {
  const [length, setLength] = useState(12);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState('');

  const generate = () => {
    let pool = '';
    if (upper) pool += CHARS.upper;
    if (lower) pool += CHARS.lower;
    if (numbers) pool += CHARS.numbers;
    if (symbols) pool += CHARS.symbols;
    if (!pool) {
      setPassword('Select at least one option');
      return;
    }
    let result = '';
    for (let i = 0; i < length; i++) {
      result += pool[Math.floor(Math.random() * pool.length)];
    }
    setPassword(result);
  };

  const copy = async () => {
    if (password && !password.includes('Select')) {
      try {
        await Clipboard.setStringAsync(password);
        Alert.alert('Copied', 'Password copied to clipboard');
      } catch (e) {
        Alert.alert('Error', 'Could not copy');
      }
    }
  };

  const Toggle = ({ label, value, onPress }) => (
    <TouchableOpacity style={[styles.toggle, value && styles.toggleOn]} onPress={onPress}>
      <Text style={styles.toggleText}>{label}</Text>
      <Text style={styles.toggleVal}>{value ? '✓' : '—'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Length: {length}</Text>
      <View style={styles.lengthRow}>
        <TouchableOpacity style={styles.smallBtn} onPress={() => setLength((l) => Math.max(4, l - 1))}>
          <Text style={styles.smallBtnText}>−</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.lengthInput}
          value={String(length)}
          onChangeText={(t) => setLength(Math.max(4, Math.min(32, parseInt(t, 10) || 8)))}
          keyboardType="number-pad"
        />
        <TouchableOpacity style={styles.smallBtn} onPress={() => setLength((l) => Math.min(32, l + 1))}>
          <Text style={styles.smallBtnText}>+</Text>
        </TouchableOpacity>
      </View>
      <Toggle label="Uppercase" value={upper} onPress={() => setUpper((v) => !v)} />
      <Toggle label="Lowercase" value={lower} onPress={() => setLower((v) => !v)} />
      <Toggle label="Numbers" value={numbers} onPress={() => setNumbers((v) => !v)} />
      <Toggle label="Symbols" value={symbols} onPress={() => setSymbols((v) => !v)} />
      <TouchableOpacity style={styles.generateBtn} onPress={generate}>
        <Text style={styles.generateBtnText}>Generate</Text>
      </TouchableOpacity>
      {password ? (
        <>
          <Text style={styles.resultLabel}>Password</Text>
          <Text selectable style={styles.result}>{password}</Text>
          {!password.includes('Select') && (
            <TouchableOpacity style={styles.copyBtn} onPress={copy}>
              <Text style={styles.copyBtnText}>Copy to clipboard</Text>
            </TouchableOpacity>
          )}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 24, paddingTop: 60 },
  label: { fontSize: 14, color: '#64748b', marginBottom: 8 },
  lengthRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 12 },
  smallBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center' },
  smallBtnText: { fontSize: 20, color: '#334155' },
  lengthInput: { width: 60, height: 44, borderWidth: 2, borderColor: '#e2e8f0', borderRadius: 8, textAlign: 'center', fontSize: 18 },
  toggle: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, paddingHorizontal: 16, backgroundColor: '#fff', borderRadius: 12, marginBottom: 10 },
  toggleOn: { borderWidth: 2, borderColor: '#2563eb' },
  toggleText: { fontSize: 16, color: '#334155' },
  toggleVal: { color: '#2563eb', fontWeight: '600' },
  generateBtn: { backgroundColor: '#2563eb', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 16, marginBottom: 24 },
  generateBtnText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  resultLabel: { fontSize: 12, color: '#64748b', marginBottom: 4 },
  result: { fontSize: 18, fontFamily: 'monospace', color: '#1e293b', marginBottom: 12 },
  copyBtn: { alignSelf: 'flex-start', paddingVertical: 10, paddingHorizontal: 16, backgroundColor: '#e2e8f0', borderRadius: 8 },
  copyBtnText: { fontSize: 14, color: '#475569' },
});
