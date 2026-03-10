import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { colors, spacing, radius } from '../constants/theme';

const UNITS = {
  length: [
    { key: 'm', label: 'Meter', toBase: (v) => v, fromBase: (v) => v },
    { key: 'km', label: 'Km', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { key: 'cm', label: 'Cm', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { key: 'mi', label: 'Mile', toBase: (v) => v * 1609.34, fromBase: (v) => v / 1609.34 },
    { key: 'ft', label: 'Feet', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { key: 'in', label: 'Inch', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
  ],
  weight: [
    { key: 'kg', label: 'Kg', toBase: (v) => v, fromBase: (v) => v },
    { key: 'g', label: 'Gram', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { key: 'lb', label: 'Pound', toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    { key: 'oz', label: 'Ounce', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
  ],
  temp: [
    { key: 'c', label: '°C', toBase: (v) => v, fromBase: (v) => v },
    { key: 'f', label: '°F', toBase: (v) => (v - 32) * (5 / 9), fromBase: (v) => v * (9 / 5) + 32 },
    { key: 'k', label: 'Kelvin', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ],
};

const CATEGORIES = [
  { key: 'length', label: 'Length', icon: '📏' },
  { key: 'weight', label: 'Weight', icon: '⚖️' },
  { key: 'temp', label: 'Temp', icon: '🌡️' },
];

export default function UnitConverterScreen() {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState(0);
  const [toUnit, setToUnit] = useState(1);
  const [input, setInput] = useState('');

  const units = UNITS[category];

  useEffect(() => {
    const u = UNITS[category];
    const maxIdx = u.length - 1;
    setFromUnit((i) => Math.min(i, maxIdx));
    setToUnit((i) => Math.min(i, maxIdx));
  }, [category]);

  const fromVal = parseFloat(input) || 0;
  const baseVal = units[fromUnit]?.toBase(fromVal) ?? 0;
  const result = units[toUnit]?.fromBase(baseVal) ?? 0;
  const resultStr = isNaN(result) ? '0' : (result >= 1e10 || (result > 0 && result < 1e-4) ? result.toExponential(4) : result.toFixed(4));

  const swap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View style={styles.tabs}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.key}
            style={[styles.tab, category === cat.key && styles.tabActive]}
            onPress={() => setCategory(cat.key)}
          >
            <Text style={styles.tabIcon}>{cat.icon}</Text>
            <Text style={[styles.tabText, category === cat.key && styles.tabTextActive]}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>From</Text>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={colors.textMuted}
        />
        <View style={styles.unitWrap}>
          {units.map((u, i) => (
            <TouchableOpacity
              key={u.key}
              style={[styles.unitBtn, fromUnit === i && styles.unitBtnActive]}
              onPress={() => setFromUnit(i)}
            >
              <Text style={[styles.unitText, fromUnit === i && styles.unitTextActive]}>{u.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.swapBtn} onPress={swap}>
        <Text style={styles.swapText}>⇅ Swap</Text>
      </TouchableOpacity>

      <View style={styles.card}>
        <Text style={styles.label}>To</Text>
        <Text style={styles.result}>{resultStr}</Text>
        <View style={styles.unitWrap}>
          {units.map((u, i) => (
            <TouchableOpacity
              key={u.key}
              style={[styles.unitBtn, toUnit === i && styles.unitBtnActive]}
              onPress={() => setToUnit(i)}
            >
              <Text style={[styles.unitText, toUnit === i && styles.unitTextActive]}>{u.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light },
  content: { padding: spacing.xl, paddingBottom: 48 },
  tabs: { flexDirection: 'row', marginBottom: spacing.xl, gap: spacing.sm },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12, borderRadius: radius.md, backgroundColor: colors.lightMuted },
  tabActive: { backgroundColor: colors.primary, shadowColor: colors.primary, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 3 },
  tabIcon: { fontSize: 16 },
  tabText: { fontSize: 14, fontWeight: '600', color: colors.textMuted },
  tabTextActive: { color: colors.white },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.xl, marginBottom: spacing.md, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  label: { fontSize: 12, color: colors.textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { height: 52, borderWidth: 2, borderColor: colors.lightMuted, borderRadius: radius.md, paddingHorizontal: 16, fontSize: 22, fontWeight: '600', color: colors.text, marginBottom: 12 },
  result: { fontSize: 22, fontWeight: '600', color: colors.text, marginBottom: 12, minHeight: 28 },
  unitWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  unitBtn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: radius.sm, backgroundColor: colors.lightMuted },
  unitBtnActive: { backgroundColor: colors.primary },
  unitText: { fontSize: 13, fontWeight: '600', color: colors.text },
  unitTextActive: { color: colors.white },
  swapBtn: { alignSelf: 'center', paddingVertical: 10, paddingHorizontal: 20, marginVertical: 8 },
  swapText: { fontSize: 14, color: colors.primary, fontWeight: '700' },
});
