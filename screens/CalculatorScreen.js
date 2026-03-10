import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const GAP = 12;
const BTN_SIZE = (width - 16 * 2 - GAP * 3) / 4;
const BTN_ZERO_W = BTN_SIZE * 2 + GAP;

const BTNS = [
  ['C', '±', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
];

function formatResult(val) {
  if (val === 'Error') return val;
  const n = Number(val);
  if (isNaN(n)) return 'Error';
  if (Math.abs(n) >= 1e10 || (n !== 0 && Math.abs(n) < 1e-6)) return n.toExponential(4);
  const r = Math.round(n * 1e10) / 1e10;
  const s = String(r);
  return s.length > 12 ? r.toExponential(4) : s;
}

export default function CalculatorScreen() {
  const [display, setDisplay] = useState('0');
  const [firstValue, setFirstValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [enteringSecond, setEnteringSecond] = useState(false);

  const onPress = (key) => {
    if (key === 'C') {
      setDisplay('0');
      setFirstValue(null);
      setOperator(null);
      setEnteringSecond(false);
      return;
    }

    if (key === '±') {
      if (display === 'Error') return;
      setDisplay((d) => (d.startsWith('-') ? d.slice(1) : d === '0' ? '0' : '-' + d));
      return;
    }

    if (['+', '-', '×', '÷', '%'].includes(key)) {
      if (display === 'Error') return;
      setFirstValue(display);
      setOperator(key);
      setEnteringSecond(true);
      return;
    }

    if (key === '=') {
      if (!firstValue || !operator) return;
      if (display === 'Error') return;
      const result = calculate(parseFloat(firstValue), parseFloat(display), operator);
      setDisplay(formatResult(result));
      setFirstValue(null);
      setOperator(null);
      setEnteringSecond(false);
      return;
    }

    if (key === '.') {
      if (display === 'Error') return;
      if (enteringSecond) {
        setDisplay('0.');
        setEnteringSecond(false);
        return;
      }
      if (display.includes('.')) return;
      setDisplay((d) => (d === '0' ? '0.' : d + '.'));
      return;
    }

    // Digit
    if (display === 'Error') return;
    if (enteringSecond) {
      setDisplay(key === '0' ? '0' : key);
      setEnteringSecond(false);
      return;
    }
    setDisplay((d) => {
      if (d === '0' && key === '0') return '0';
      if (d === '0' && key !== '.') return key;
      if (d.length >= 15) return d;
      return d + key;
    });
  };

  const calculate = (a, b, op) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b === 0 ? 'Error' : a / b;
      case '%': return b === 0 ? 'Error' : a % b;
      default: return b;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.displayWrap}>
        <Text style={styles.display} numberOfLines={1} adjustsFontSizeToFit>
          {display}
        </Text>
      </View>
      <View style={styles.keypad}>
        {BTNS.map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((key) => {
              const isOp = ['+', '-', '×', '÷', '%'].includes(key);
              const isEquals = key === '=';
              const isZero = key === '0';
              const isGray = key === 'C' || key === '±';
              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.btn,
                    { width: isZero ? BTN_ZERO_W : BTN_SIZE, height: BTN_SIZE, borderRadius: BTN_SIZE / 2 },
                    isOp && styles.btnOp,
                    isEquals && styles.btnEquals,
                    isGray && styles.btnGray,
                  ]}
                  onPress={() => onPress(key)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.btnText, (isOp || isEquals) && styles.btnTextAlt, isGray && styles.btnTextGray]}>
                    {key}
                  </Text>
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
  container: { flex: 1, backgroundColor: '#f1f5f9', padding: 16, paddingBottom: 24, justifyContent: 'flex-end' },
  displayWrap: { marginBottom: 28, minHeight: 64, justifyContent: 'flex-end', alignItems: 'flex-end' },
  display: { fontSize: 56, fontWeight: '300', color: '#0f172a', fontVariant: ['tabular-nums'] },
  keypad: { gap: GAP },
  row: { flexDirection: 'row', gap: GAP },
  btn: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  btnOp: { backgroundColor: '#0d9488' },
  btnEquals: { backgroundColor: '#eab308' },
  btnGray: { backgroundColor: '#e2e8f0' },
  btnText: { fontSize: 26, color: '#0f172a', fontWeight: '500' },
  btnTextAlt: { color: '#fff', fontWeight: '600', fontSize: 24 },
  btnTextGray: { color: '#64748b', fontWeight: '600' },
});
