import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

const TOOLS = [
  { id: 'calculator', name: 'Calculator', emoji: '🔢', screen: 'Calculator' },
  { id: 'converter', name: 'Unit Converter', emoji: '📐', screen: 'UnitConverter' },
  { id: 'stopwatch', name: 'Stopwatch', emoji: '⏱️', screen: 'Stopwatch' },
  { id: 'timer', name: 'Timer', emoji: '⏲️', screen: 'Timer' },
  { id: 'password', name: 'Password Generator', emoji: '🔐', screen: 'PasswordGenerator' },
  { id: 'notes', name: 'Quick Notes', emoji: '📝', screen: 'Notes' },
  { id: 'color', name: 'Color Picker', emoji: '🎨', screen: 'ColorPicker' },
];

export default function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Coco Tools</Text>
      <Text style={styles.subtitle}>Select a tool to use</Text>
      <View style={styles.grid}>
        {TOOLS.map((tool) => (
          <TouchableOpacity
            key={tool.id}
            style={styles.card}
            onPress={() => navigation.navigate(tool.screen)}
            activeOpacity={0.7}
          >
            <Text style={styles.emoji}>{tool.emoji}</Text>
            <Text style={styles.cardTitle}>{tool.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  subtitle: { fontSize: 15, color: '#666', marginBottom: 24 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  emoji: { fontSize: 36, marginBottom: 8 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#333' },
});
