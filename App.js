import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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
            headerStyle: { backgroundColor: '#f5f5f5' },
            headerTintColor: '#1a1a1a',
            headerTitleStyle: { fontWeight: '600', fontSize: 18 },
            headerShadowVisible: false,
            contentStyle: { backgroundColor: '#f5f5f5' },
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Coco Tools', headerLargeTitle: false }}
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
