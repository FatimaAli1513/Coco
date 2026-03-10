import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function TimerScreen() {
  const [minutes, setMinutes] = useState('1');
  const [seconds, setSeconds] = useState('0');
  const [totalSec, setTotalSec] = useState(60);
  const [running, setRunning] = useState(false);
  const remainingRef = useRef(60);
  const intervalRef = useRef(null);

  const start = () => {
    const m = parseInt(minutes, 10) || 0;
    const s = parseInt(seconds, 10) || 0;
    const total = m * 60 + s;
    if (total <= 0) return;
    setTotalSec(total);
    remainingRef.current = total;
    setRunning(true);
  };

  useEffect(() => {
    if (!running) return;
    if (remainingRef.current <= 0) {
      setRunning(false);
      return;
    }
    intervalRef.current = setInterval(() => {
      remainingRef.current -= 1;
      setTotalSec(remainingRef.current);
      if (remainingRef.current <= 0) {
        setRunning(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const stop = () => {
    setRunning(false);
    remainingRef.current = 0;
  };

  const reset = () => {
    setRunning(false);
    const m = parseInt(minutes, 10) || 0;
    const s = parseInt(seconds, 10) || 0;
    setTotalSec(m * 60 + s);
    remainingRef.current = m * 60 + s;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.display}>{formatTime(totalSec)}</Text>
      {!running ? (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={minutes}
            onChangeText={setMinutes}
            keyboardType="number-pad"
            placeholder="Min"
          />
          <Text style={styles.colon}>:</Text>
          <TextInput
            style={styles.input}
            value={seconds}
            onChangeText={setSeconds}
            keyboardType="number-pad"
            placeholder="Sec"
          />
        </View>
      ) : null}
      <View style={styles.buttons}>
        {!running ? (
          <TouchableOpacity style={[styles.btn, styles.btnStart]} onPress={start}>
            <Text style={styles.btnText}>Start</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={[styles.btn, styles.btnPause]} onPress={stop}>
              <Text style={styles.btnText}>Stop</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnReset]} onPress={reset}>
              <Text style={styles.btnTextSec}>Reset</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e293b', alignItems: 'center', justifyContent: 'center', padding: 20 },
  display: { fontSize: 64, fontWeight: '300', color: '#fff', fontVariant: ['tabular-nums'], marginBottom: 24 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  input: {
    width: 80,
    height: 56,
    borderWidth: 2,
    borderColor: '#475569',
    borderRadius: 12,
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
  },
  colon: { fontSize: 32, color: '#94a3b8', marginHorizontal: 8 },
  buttons: { flexDirection: 'row', gap: 12 },
  btn: { paddingVertical: 16, paddingHorizontal: 28, borderRadius: 12 },
  btnStart: { backgroundColor: '#22c55e' },
  btnPause: { backgroundColor: '#ef4444' },
  btnReset: { backgroundColor: '#475569' },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  btnTextSec: { color: '#cbd5e1', fontSize: 18 },
});
