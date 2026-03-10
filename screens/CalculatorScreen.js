import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const BTNS = [
  ['C', '±', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
];

export default function CalculatorScreen() {
  const [display, setDisplay] = useState('0');
  const [prev, setPrev] = useState(null);
  const [op, setOp] = useState(null);

  const onPress = (key) => {
    if (key === 'C') {
      setDisplay('0');
      setPrev(null);
      setOp(null);
      return;
    }
    if (key === '±') {
      setDisplay((d) => (d.startsWith('-') ? d.slice(1) : '-' + d));
      return;
    }
    if (['+', '-', '×', '÷', '%'].includes(key)) {
      if (prev !== null && op) {
        const result = calculate(parseFloat(prev), parseFloat(display), op);
        setDisplay(String(result));
        setPrev(String(result));
      } else {
        setPrev(display);
      }
      setOp(key);
      return;
    }
    if (key === '=') {
      if (prev !== null && op) {
        const result = calculate(parseFloat(prev), parseFloat(display), op);
        setDisplay(String(result));
        setPrev(null);
        setOp(null);
      }
      return;
    }
    if (key === '.') {
      if (display.includes('.')) return;
      setDisplay((d) => (d === '0' ? '0.' : d + '.'));
      return;
    }
    setDisplay((d) => (d === '0' ? key : d + key));
  };

  const calculate = (a, b, operation) => {
    switch (operation) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b === 0 ? 0 : a / b;
      case '%': return a % b;
      default: return b;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.display} numberOfLines={1}>{display}</Text>
      <View style={styles.keypad}>
        {BTNS.map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((key) => {
              const isOp = ['+', '-', '×', '÷', '%', '='].includes(key);
              const isZero = key === '0';
              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.btn,
                    isOp && styles.btnOp,
                    key === 'C' && styles.btnClear,
                    isZero && styles.btnZero,
                  ]}
                  onPress={() => onPress(key)}
                >
                  <Text style={[styles.btnText, (isOp || key === 'C') && styles.btnTextOp]}>{key}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a', padding: 16, justifyContent: 'flex-end' },
  display: { fontSize: 48, color: '#fff', textAlign: 'right', marginBottom: 24 },
  keypad: { gap: 12 },
  row: { flexDirection: 'row', gap: 12, justifyContent: 'space-between' },
  btn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnZero: { width: 156 },
  btnOp: { backgroundColor: '#ff9f0a' },
  btnClear: { backgroundColor: '#a5a5a5' },
  btnText: { fontSize: 28, color: '#fff' },
  btnTextOp: { color: '#fff', fontWeight: '600' },
});
