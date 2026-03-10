import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { colors, spacing, radius } from '../constants/theme';

const CHARS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function getStrength(pwd) {
  if (!pwd) return { level: 0, label: '', color: colors.textMuted };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  if (score <= 2) return { level: 1, label: 'Weak', color: colors.error };
  if (score <= 4) return { level: 2, label: 'Fair', color: colors.warning };
  return { level: 3, label: 'Strong', color: colors.success };
}

export default function PasswordGeneratorScreen() {
  const [length, setLength] = useState(12);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const len = length < 4 ? 4 : length > 32 ? 32 : length;
    if (length < 4 || length === 0) setLength(4);
    let pool = '';
    if (upper) pool += CHARS.upper;
    if (lower) pool += CHARS.lower;
    if (numbers) pool += CHARS.numbers;
    if (symbols) pool += CHARS.symbols;
    if (!pool) {
      Alert.alert('Options', 'Select at least one character type');
      return;
    }
    let result = '';
    for (let i = 0; i < len; i++) {
      result += pool[Math.floor(Math.random() * pool.length)];
    }
    setPassword(result);
  };

  const copy = () => {
    if (!password) return;
    try {
      Clipboard.setString(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {}
  };

  const strength = getStrength(password);

  const Toggle = ({ label, value, onPress }) => (
    <TouchableOpacity
      style={[styles.toggle, value && styles.toggleOn]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: value }}
    >
      <Text style={[styles.toggleText, value && styles.toggleTextOn]}>{label}</Text>
      <View style={[styles.check, value && styles.checkOn]}>
        <Text style={styles.checkText}>{value ? '✓' : ''}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.label}>Length (4–32)</Text>
      <View style={styles.lengthRow}>
        <TouchableOpacity style={styles.smallBtn} onPress={() => setLength((l) => Math.max(4, l - 1))} activeOpacity={0.8}>
          <Text style={styles.smallBtnText}>−</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.lengthInput}
          value={length > 0 ? String(length) : ''}
          onChangeText={(t) => {
            const num = parseInt(t.replace(/\D/g, ''), 10);
            if (t === '') setLength(0);
            else if (!isNaN(num)) setLength(num <= 32 ? num : 32);
          }}
          onBlur={() => {
            if (length < 4 || length === 0) setLength(4);
            if (length > 32) setLength(32);
          }}
          keyboardType="number-pad"
          maxLength={2}
          placeholder="12"
          placeholderTextColor={colors.textMuted}
          selectTextOnFocus
        />
        <TouchableOpacity style={styles.smallBtn} onPress={() => setLength((l) => Math.min(32, l + 1))} activeOpacity={0.8}>
          <Text style={styles.smallBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Include</Text>
      <View style={styles.toggles}>
        <Toggle label="Uppercase (A-Z)" value={upper} onPress={() => setUpper((v) => !v)} />
        <Toggle label="Lowercase (a-z)" value={lower} onPress={() => setLower((v) => !v)} />
        <Toggle label="Numbers (0-9)" value={numbers} onPress={() => setNumbers((v) => !v)} />
        <Toggle label="Symbols (!@#...)" value={symbols} onPress={() => setSymbols((v) => !v)} />
      </View>

      <TouchableOpacity style={styles.generateBtn} onPress={generate} activeOpacity={0.85}>
        <Text style={styles.generateBtnText}>Generate Password</Text>
      </TouchableOpacity>

      {password ? (
        <View style={styles.resultCard}>
          <Text style={styles.resultLabel}>Generated Password</Text>
          <Text selectable style={styles.result}>{password}</Text>
          <View style={styles.strengthRow}>
            <View style={[styles.strengthBar, { width: `${(strength.level / 3) * 100}%`, backgroundColor: strength.color }]} />
          </View>
          <Text style={[styles.strengthText, { color: strength.color }]}>{strength.label}</Text>
          <TouchableOpacity style={styles.copyBtn} onPress={copy}>
            <Text style={styles.copyBtnText}>{copied ? 'Copied' : 'Copy to clipboard'}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light },
  content: { padding: spacing.xl, paddingBottom: 40 },
  label: { fontSize: 12, color: colors.textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  lengthRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 14 },
  smallBtn: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', shadowColor: colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 3 },
  smallBtnText: { fontSize: 26, color: colors.white, fontWeight: '600' },
  lengthInput: { flex: 1, minWidth: 72, maxWidth: 88, height: 52, borderWidth: 2, borderColor: colors.lightMuted, borderRadius: radius.md, textAlign: 'center', fontSize: 22, fontWeight: '600', color: colors.text, backgroundColor: colors.white },
  toggles: { marginBottom: 24, gap: 10 },
  toggle: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 18, backgroundColor: colors.white, borderRadius: radius.md, marginBottom: 10, borderWidth: 2, borderColor: colors.lightMuted, minHeight: 56 },
  toggleOn: { borderColor: colors.primary, backgroundColor: colors.primary + '0a' },
  toggleText: { fontSize: 16, color: colors.text, flex: 1 },
  toggleTextOn: { color: colors.primaryDark, fontWeight: '600' },
  check: { width: 26, height: 26, borderRadius: 13, borderWidth: 2, borderColor: colors.lightMuted, alignItems: 'center', justifyContent: 'center', marginLeft: 12 },
  checkOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkText: { color: colors.white, fontSize: 12, fontWeight: '700' },
  generateBtn: { backgroundColor: colors.primary, paddingVertical: 18, borderRadius: radius.lg, alignItems: 'center', marginBottom: 24 },
  generateBtnText: { color: colors.white, fontSize: 17, fontWeight: '700' },
  resultCard: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.xl, borderWidth: 1, borderColor: colors.lightMuted },
  resultLabel: { fontSize: 12, color: colors.textMuted, marginBottom: 8 },
  result: { fontSize: 18, fontFamily: 'monospace', color: colors.text, marginBottom: 12, letterSpacing: 2 },
  strengthRow: { height: 4, backgroundColor: colors.lightMuted, borderRadius: 2, overflow: 'hidden', marginBottom: 6 },
  strengthBar: { height: '100%', borderRadius: 2 },
  strengthText: { fontSize: 12, fontWeight: '600', marginBottom: 16 },
  copyBtn: { alignSelf: 'flex-start', paddingVertical: 12, paddingHorizontal: 20, backgroundColor: colors.lightMuted, borderRadius: radius.md },
  copyBtnText: { fontSize: 14, color: colors.text, fontWeight: '600' },
});
