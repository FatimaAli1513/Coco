import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { colors, spacing, radius } from '../constants/theme';

const PRESETS = [
  '#14b8a6', '#0d9488', '#0891b2', '#eab308', '#f59e0b',
  '#22c55e', '#ef4444', '#8b5cf6', '#94a3b8', '#0f172a',
  '#ffffff', '#fef08a', '#cffafe', '#fef3c7', '#155e75',
];

function expandHex(hex) {
  if (!hex || hex.length < 4) return null;
  const h = hex.startsWith('#') ? hex.slice(1) : hex;
  if (h.length === 3) {
    return '#' + h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  if (h.length === 6 && /^[0-9A-Fa-f]{6}$/.test(h)) return '#' + h;
  return null;
}

function hexToRgb(hex) {
  const full = expandHex(hex) || hex;
  const n = parseInt(full?.slice(1) || '0', 16);
  if (isNaN(n)) return { r: 0, g: 0, b: 0 };
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
  const [selected, setSelected] = useState('#14b8a6');
  const [custom, setCustom] = useState('#14b8a6');

  const fullHex = expandHex(selected) || (expandHex(custom) ?? selected);
  const rgb = hexToRgb(fullHex || selected);
  const isLight = getLuminance(fullHex || selected) > 0.5;

  const copyHex = async () => {
    try {
      await Clipboard.setStringAsync(fullHex || selected);
      Alert.alert('Copied', `${fullHex || selected} copied`);
    } catch (e) {
      Alert.alert('Error', 'Could not copy');
    }
  };

  const copyRgb = async () => {
    const s = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    try {
      await Clipboard.setStringAsync(s);
      Alert.alert('Copied', 'RGB value copied');
    } catch (e) {
      Alert.alert('Error', 'Could not copy');
    }
  };

  const handleCustomChange = (t) => {
    const raw = t.startsWith('#') ? t : '#' + t;
    const limited = raw.slice(0, 8);
    setCustom(limited);
    const expanded = expandHex(limited);
    if (expanded) setSelected(expanded);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={[styles.preview, { backgroundColor: fullHex || selected }]}>
        <Text style={[styles.hexText, isLight ? styles.textDark : styles.textLight]}>{fullHex || selected}</Text>
        <Text style={[styles.rgbText, isLight ? styles.textDark : styles.textLight]}>
          rgb({rgb.r}, {rgb.g}, {rgb.b})
        </Text>
        <View style={styles.copyRow}>
          <TouchableOpacity style={[styles.copyChip, isLight ? styles.copyChipDark : styles.copyChipLight]} onPress={copyHex}>
            <Text style={[styles.copyChipText, isLight ? styles.textDark : styles.textLight]}>Copy Hex</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.copyChip, isLight ? styles.copyChipDark : styles.copyChipLight]} onPress={copyRgb}>
            <Text style={[styles.copyChipText, isLight ? styles.textDark : styles.textLight]}>Copy RGB</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.label}>Preset colors</Text>
      <View style={styles.presets}>
        {PRESETS.map((color) => (
          <TouchableOpacity
            key={color}
            style={[
              styles.swatch,
              { backgroundColor: color },
              (fullHex || selected) === color && styles.swatchSelected,
            ]}
            onPress={() => { setSelected(color); setCustom(color); }}
          />
        ))}
      </View>

      <Text style={styles.label}>Custom hex</Text>
      <View style={styles.customRow}>
        <View style={[styles.swatchLarge, { backgroundColor: expandHex(custom) || '#94a3b8' }]} />
        <TextInput
          style={styles.customInput}
          value={custom}
          onChangeText={handleCustomChange}
          placeholder="#14b8a6 or fff"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <Text style={styles.hint}>Supports #fff and #ffffff formats</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light },
  content: { padding: spacing.xl, paddingBottom: 40 },
  preview: {
    height: 200,
    borderRadius: radius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  hexText: { fontSize: 24, fontWeight: '800', fontVariant: ['tabular-nums'], letterSpacing: 1 },
  rgbText: { fontSize: 14, marginTop: 6, opacity: 0.9 },
  textLight: { color: '#fff' },
  textDark: { color: '#1e293b' },
  copyRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  copyChip: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: radius.full },
  copyChipLight: { backgroundColor: 'rgba(255,255,255,0.3)' },
  copyChipDark: { backgroundColor: 'rgba(0,0,0,0.15)' },
  copyChipText: { fontSize: 14, fontWeight: '600' },
  label: { fontSize: 12, color: colors.textMuted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 },
  presets: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  swatch: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  swatchSelected: { borderColor: colors.primary, borderWidth: 3 },
  customRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  swatchLarge: { width: 60, height: 60, borderRadius: radius.md },
  customInput: { flex: 1, fontSize: 16, fontFamily: 'monospace', color: colors.text, borderWidth: 2, borderColor: colors.lightMuted, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 12 },
  hint: { fontSize: 12, color: colors.textMuted },
});
