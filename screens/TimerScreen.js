import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { colors, radius } from '../constants/theme';

function formatTime(sec) {
  const m = Math.floor(Math.max(0, sec) / 60);
  const s = Math.max(0, sec % 60);
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
    if (total <= 0) {
      Alert.alert('Invalid', 'Please enter at least 1 second');
      return;
    }
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
        if (intervalRef.current) clearInterval(intervalRef.current);
        setRunning(false);
        Alert.alert('Time\'s up!', 'Your timer has finished.', [{ text: 'OK' }]);
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
    if (intervalRef.current) clearInterval(intervalRef.current);
    const m = parseInt(minutes, 10) || 0;
    const s = parseInt(seconds, 10) || 0;
    const total = m * 60 + s;
    setTotalSec(total);
    remainingRef.current = total;
  };

  return (
    <View style={styles.container}>
      <View style={styles.displayWrap}>
        <Text style={[styles.display, totalSec === 0 && running === false && styles.displayDone]}>{formatTime(totalSec)}</Text>
      </View>
      {!running && (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={minutes}
            onChangeText={(t) => { setMinutes(t.replace(/\D/g, '').slice(0, 3)); }}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor="#64748b"
            maxLength={3}
          />
          <Text style={styles.colon}>:</Text>
          <TextInput
            style={styles.input}
            value={seconds}
            onChangeText={(t) => { setSeconds(t.replace(/\D/g, '').slice(0, 2)); }}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor="#64748b"
            maxLength={2}
          />
        </View>
      )}
      <View style={styles.buttons}>
        {!running ? (
          <TouchableOpacity style={[styles.btn, styles.btnStart]} onPress={start}>
            <Text style={styles.btnText}>Start</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TouchableOpacity style={[styles.btn, styles.btnStop]} onPress={stop}>
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
  container: { flex: 1, backgroundColor: colors.light, alignItems: 'center', justifyContent: 'center', padding: 20 },
  displayWrap: { marginBottom: 24 },
  display: { fontSize: 72, fontWeight: '200', color: colors.text, fontVariant: ['tabular-nums'], letterSpacing: 4 },
  displayDone: { color: colors.success },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  input: {
    width: 88,
    height: 56,
    borderWidth: 2,
    borderColor: colors.lightMuted,
    borderRadius: radius.md,
    color: colors.text,
    fontSize: 28,
    textAlign: 'center',
  },
  colon: { fontSize: 36, color: colors.textMuted, marginHorizontal: 8 },
  buttons: { flexDirection: 'row', gap: 16 },
  btn: { paddingVertical: 18, paddingHorizontal: 36, borderRadius: radius.lg },
  btnStart: { backgroundColor: '#14b8a6' },
  btnStop: { backgroundColor: colors.error },
  btnReset: { backgroundColor: colors.lightMuted },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  btnTextSec: { color: colors.text, fontSize: 18, fontWeight: '600' },
});
