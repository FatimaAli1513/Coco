import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { colors, radius } from '../constants/theme';

function formatTime(ms) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
}

export default function StopwatchScreen() {
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [laps, setLaps] = useState([]);
  const startRef = useRef(0);
  const intervalRef = useRef(null);
  const lapBaseRef = useRef(0);

  useEffect(() => {
    if (running) {
      startRef.current = Date.now() - time;
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startRef.current);
      }, 10);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const reset = () => {
    setRunning(false);
    setTime(0);
    setLaps([]);
    lapBaseRef.current = 0;
  };

  const addLap = () => {
    if (!running) return;
    const now = Date.now() - startRef.current;
    const lapTime = now - lapBaseRef.current;
    lapBaseRef.current = now;
    setLaps((prev) => [{ id: Date.now(), time: lapTime, total: now }, ...prev]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.displayWrap}>
        <Text style={styles.display}>{formatTime(time)}</Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.btn, styles.btnLap, laps.length === 0 && styles.btnDisabled]}
          onPress={addLap}
          disabled={!running}
        >
          <Text style={[styles.btnTextLap, !running && styles.btnTextDisabled]}>Lap</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, running ? styles.btnPause : styles.btnStart]}
          onPress={() => setRunning(!running)}
        >
          <Text style={styles.btnText}>{running ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnReset]} onPress={reset}>
          <Text style={styles.btnTextReset}>Reset</Text>
        </TouchableOpacity>
      </View>
      {laps.length > 0 && (
        <View style={styles.lapsWrap}>
          <Text style={styles.lapsTitle}>Laps</Text>
          <ScrollView style={styles.lapsList} showsVerticalScrollIndicator={false}>
            {laps.map((lap, i) => (
              <View key={lap.id} style={styles.lapRow}>
                <Text style={styles.lapNum}>Lap {laps.length - i}</Text>
                <Text style={styles.lapTime}>{formatTime(lap.time)}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light, padding: 20 },
  displayWrap: { alignItems: 'center', paddingVertical: 40 },
  display: { fontSize: 64, fontWeight: '200', color: colors.text, fontVariant: ['tabular-nums'], letterSpacing: 2 },
  buttons: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginBottom: 32 },
  btn: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  btnStart: { backgroundColor: '#14b8a6' },
  btnPause: { backgroundColor: colors.accent },
  btnLap: { backgroundColor: colors.lightMuted },
  btnReset: { backgroundColor: colors.lightMuted },
  btnDisabled: { opacity: 0.5 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  btnTextLap: { color: colors.text, fontSize: 16, fontWeight: '600' },
  btnTextReset: { color: colors.text, fontSize: 16, fontWeight: '600' },
  btnTextDisabled: { color: colors.textMuted },
  lapsWrap: { flex: 1, backgroundColor: colors.white, borderRadius: radius.lg, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  lapsTitle: { fontSize: 14, fontWeight: '600', color: colors.textMuted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 },
  lapsList: { maxHeight: 200 },
  lapRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.lightMuted },
  lapNum: { fontSize: 15, color: colors.textMuted },
  lapTime: { fontSize: 15, fontWeight: '600', color: colors.text, fontVariant: ['tabular-nums'] },
});
