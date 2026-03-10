import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';

const PRESETS = [
  '#ef4444', '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#3b82f6', '#8b5cf6', '#ec4899', '#64748b', '#000000',
  '#ffffff', '#fef3c7', '#dbeafe', '#fce7f3',
];

function hexToRgb(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return { r, g, b };
}

function getLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export default function ColorPickerScreen() {
  const [selected, setSelected] = useState('#3b82f6');
  const [custom, setCustom] = useState(selected);

  const rgb = hexToRgb(selected);
  const isLight = getLuminance(selected) > 0.5;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={[styles.preview, { backgroundColor: selected }]}>
        <Text style={[styles.hexText, isLight ? styles.hexTextDark : styles.hexTextLight]}>{selected}</Text>
        <Text style={[styles.rgbText, isLight ? styles.hexTextDark : styles.hexTextLight]}>
          rgb({rgb.r}, {rgb.g}, {rgb.b})
        </Text>
      </View>
      <Text style={styles.label}>Presets</Text>
      <View style={styles.presets}>
        {PRESETS.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.swatch,
              { backgroundColor: color },
              selected === color && styles.swatchSelected,
            ]}
            onPress={() => { setSelected(color); setCustom(color); }}
          />
        ))}
      </View>
      <Text style={styles.label}>Custom hex</Text>
      <View style={styles.customRow}>
        <View style={[styles.swatchLarge, { backgroundColor: /^#[0-9A-Fa-f]{6}$/.test(custom) ? custom : '#ccc' }]} />
        <TextInput
          style={styles.customInput}
          value={custom}
          onChangeText={(t) => {
            const val = t.startsWith('#') ? t.slice(0, 7) : '#' + t.slice(0, 6);
            setCustom(val);
            if (/^#[0-9A-Fa-f]{6}$/.test(val)) setSelected(val);
          }}
          placeholder="#000000"
          placeholderTextColor="#94a3b8"
          autoCapitalize="none"
        />
      </View>
      <Text style={styles.hint}>Type or paste a hex code (e.g. #3b82f6). Preview updates when valid.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 20, paddingTop: 60 },
  preview: {
    height: 160,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  hexText: { fontSize: 22, fontWeight: '700', fontVariant: ['tabular-nums'] },
  hexTextLight: { color: '#fff' },
  hexTextDark: { color: '#1e293b' },
  rgbText: { fontSize: 14, marginTop: 4, opacity: 0.9 },
  label: { fontSize: 14, color: '#64748b', marginBottom: 10 },
  presets: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  swatchSelected: { borderColor: '#1e293b' },
  customRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  swatchLarge: { width: 56, height: 56, borderRadius: 12 },
  customInput: { flex: 1, fontSize: 16, fontFamily: 'monospace', color: '#334155', borderWidth: 2, borderColor: '#e2e8f0', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  hint: { fontSize: 12, color: '#94a3b8' },
});
