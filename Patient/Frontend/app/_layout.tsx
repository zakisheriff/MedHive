import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { AlertProvider } from '../context/AlertContext';
import { CustomAlert } from '../components/CustomAlert';

export default function RootLayout() {
  return (
    <AlertProvider>
      <View style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen
            name="profile"
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom'
            }}
          />
        </Stack>
        <StatusBar style="dark" />
        <CustomAlert />
      </View>
    </AlertProvider>
  );
}
