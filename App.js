import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { colors } from './constants/theme';

import HomeScreen from './screens/HomeScreen';
import CalculatorScreen from './screens/CalculatorScreen';
import UnitConverterScreen from './screens/UnitConverterScreen';
import StopwatchScreen from './screens/StopwatchScreen';
import TimerScreen from './screens/TimerScreen';
import PasswordGeneratorScreen from './screens/PasswordGeneratorScreen';
import NotesScreen from './screens/NotesScreen';
import ColorPickerScreen from './screens/ColorPickerScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: { backgroundColor: colors.white },
            headerTintColor: colors.primaryDark,
            headerTitleStyle: { fontWeight: '700', fontSize: 17, color: colors.text },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: colors.light },
            headerBackTitleVisible: false,
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Calculator" component={CalculatorScreen} options={{ title: 'Calculator' }} />
          <Stack.Screen name="UnitConverter" component={UnitConverterScreen} options={{ title: 'Unit Converter' }} />
          <Stack.Screen name="Stopwatch" component={StopwatchScreen} options={{ title: 'Stopwatch' }} />
          <Stack.Screen name="Timer" component={TimerScreen} options={{ title: 'Timer' }} />
          <Stack.Screen name="PasswordGenerator" component={PasswordGeneratorScreen} options={{ title: 'Password Generator' }} />
          <Stack.Screen name="Notes" component={NotesScreen} options={{ title: 'Quick Notes' }} />
          <Stack.Screen name="ColorPicker" component={ColorPickerScreen} options={{ title: 'Color Picker' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
