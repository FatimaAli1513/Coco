import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

function formatTime(ms) {
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const cs = Math.floor((ms % 1000) / 10);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`;
}

export default function StopwatchScreen() {
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(0);
  const startRef = useRef(0);
  const intervalRef = useRef(null);

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
  };

  return (
    <View style={styles.container}>
      <Text style={styles.display}>{formatTime(time)}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.btn, styles.btnMain]}
          onPress={() => setRunning(!running)}
        >
          <Text style={styles.btnText}>{running ? 'Pause' : 'Start'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnSec]} onPress={reset}>
          <Text style={styles.btnTextSec}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center', padding: 20 },
  display: { fontSize: 56, fontWeight: '300', color: '#fff', fontVariant: ['tabular-nums'], marginBottom: 48 },
  buttons: { flexDirection: 'row', gap: 16 },
  btn: { paddingVertical: 16, paddingHorizontal: 32, borderRadius: 12 },
  btnMain: { backgroundColor: '#22c55e', minWidth: 120 },
  btnSec: { backgroundColor: '#334155' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  btnTextSec: { color: '#94a3b8', fontSize: 18 },
});
