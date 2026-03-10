import { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';

const UNITS = {
  length: [
    { key: 'm', label: 'Meter', toBase: (v) => v, fromBase: (v) => v },
    { key: 'km', label: 'Kilometer', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { key: 'cm', label: 'Centimeter', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { key: 'mi', label: 'Mile', toBase: (v) => v * 1609.34, fromBase: (v) => v / 1609.34 },
    { key: 'ft', label: 'Feet', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { key: 'in', label: 'Inch', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
  ],
  weight: [
    { key: 'kg', label: 'Kilogram', toBase: (v) => v, fromBase: (v) => v },
    { key: 'g', label: 'Gram', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { key: 'lb', label: 'Pound', toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    { key: 'oz', label: 'Ounce', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
  ],
  temp: [
    { key: 'c', label: 'Celsius', toBase: (v) => v, fromBase: (v) => v },
    { key: 'f', label: 'Fahrenheit', toBase: (v) => (v - 32) * (5 / 9), fromBase: (v) => v * (9 / 5) + 32 },
    { key: 'k', label: 'Kelvin', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ],
};

export default function UnitConverterScreen() {
  const [category, setCategory] = useState('length');
  const [fromUnit, setFromUnit] = useState(0);
  const [toUnit, setToUnit] = useState(1);
  const [input, setInput] = useState('');

  const units = UNITS[category];
  const fromVal = parseFloat(input) || 0;
  const baseVal = units[fromUnit].toBase(fromVal);
  const result = units[toUnit].fromBase(baseVal);

  return (
    <View style={styles.container}>
      <View style={styles.tabs}>
        {Object.keys(UNITS).map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.tab, category === cat && styles.tabActive]}
            onPress={() => setCategory(cat)}
          >
            <Text style={[styles.tabText, category === cat && styles.tabTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          keyboardType="decimal-pad"
          placeholder="0"
        />
        <View style={styles.pickerWrap}>
          {units.map((u, i) => (
            <TouchableOpacity
              key={u.key}
              style={[styles.pickerOpt, fromUnit === i && styles.pickerOptActive]}
              onPress={() => setFromUnit(i)}
            >
              <Text style={styles.pickerText}>{u.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <Text style={styles.equals}>＝</Text>
      <View style={styles.row}>
        <Text style={styles.result}>{isNaN(result) ? '0' : result.toFixed(4)}</Text>
        <View style={styles.pickerWrap}>
          {units.map((u, i) => (
            <TouchableOpacity
              key={u.key}
              style={[styles.pickerOpt, toUnit === i && styles.pickerOptActive]}
              onPress={() => setToUnit(i)}
            >
              <Text style={styles.pickerText}>{u.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 20, paddingTop: 60 },
  tabs: { flexDirection: 'row', marginBottom: 24, gap: 8 },
  tab: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#e0e0e0' },
  tabActive: { backgroundColor: '#2563eb' },
  tabText: { fontSize: 14, color: '#555' },
  tabTextActive: { color: '#fff', fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  input: {
    width: 120,
    height: 48,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 20,
    marginRight: 12,
  },
  pickerWrap: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pickerOpt: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#fff' },
  pickerOptActive: { backgroundColor: '#2563eb' },
  pickerText: { fontSize: 12 },
  equals: { fontSize: 24, color: '#666', marginVertical: 8 },
  result: { width: 120, fontSize: 20, fontWeight: '600', marginRight: 12 },
});
