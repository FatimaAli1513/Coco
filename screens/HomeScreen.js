import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radius, shadow } from '../constants/theme';

const TOOLS = [
  { id: 'calculator', name: 'Calculator', desc: 'Basic math: add, subtract, multiply, divide', emoji: '🔢', screen: 'Calculator', tint: colors.dark },
  { id: 'converter', name: 'Unit Converter', desc: 'Length, weight & temperature conversion', emoji: '📐', screen: 'UnitConverter', tint: colors.primary },
  { id: 'stopwatch', name: 'Stopwatch', desc: 'Time elapsed with lap support', emoji: '⏱️', screen: 'Stopwatch', tint: colors.darkCard },
  { id: 'timer', name: 'Countdown Timer', desc: 'Set minutes & seconds, get alerted', emoji: '⏲️', screen: 'Timer', tint: colors.secondary },
  { id: 'password', name: 'Password Generator', desc: 'Secure random passwords with options', emoji: '🔐', screen: 'PasswordGenerator', tint: colors.accent },
  { id: 'notes', name: 'Quick Notes', desc: 'Save notes locally on device', emoji: '📝', screen: 'Notes', tint: colors.secondary },
  { id: 'color', name: 'Color Picker', desc: 'Pick color, get hex & RGB, copy', emoji: '🎨', screen: 'ColorPicker', tint: colors.primary },
];

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, { paddingTop: insets.top + spacing.xl }]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Text style={styles.logoText}>Co</Text>
          <Text style={[styles.logoText, styles.logoAccent]}>Co</Text>
        </View>
        <Text style={styles.title}>Tools</Text>
        <Text style={styles.subtitle}>All-in-one utility kit for daily tasks</Text>
      </View>
      <View style={styles.grid}>
        {TOOLS.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={styles.card}
            onPress={() => navigation.navigate(tool.screen)}
            activeOpacity={0.8}
          >
            <View style={[styles.cardIcon, { backgroundColor: tool.tint + '22' }]}>
              <Text style={styles.emoji}>{tool.emoji}</Text>
            </View>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{tool.name}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>{tool.desc}</Text>
            </View>
            <View style={styles.cardArrow}>
              <Text style={styles.arrowText}>→</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light },
  content: { padding: spacing.xl, paddingBottom: 48 },
  header: { marginBottom: spacing.xxl },
  logoBadge: { flexDirection: 'row', marginBottom: 8 },
  logoText: { fontSize: 36, fontWeight: '800', color: colors.primary, letterSpacing: -1 },
  logoAccent: { color: colors.accent },
  title: { fontSize: 28, fontWeight: '800', color: colors.text, letterSpacing: -0.5 },
  subtitle: { fontSize: 15, color: colors.textMuted, marginTop: 4 },
  grid: { gap: spacing.lg },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(20,184,166,0.08)',
    ...shadow.md,
  },
  cardIcon: { width: 56, height: 56, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginRight: spacing.lg },
  emoji: { fontSize: 28 },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  cardDesc: { fontSize: 13, color: colors.textMuted, lineHeight: 19, marginTop: 3 },
  cardArrow: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary + '18', alignItems: 'center', justifyContent: 'center' },
  arrowText: { fontSize: 16, color: colors.primary, fontWeight: '700' },
});
