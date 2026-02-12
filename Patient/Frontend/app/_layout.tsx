import { Stack } from 'expo-router';
import Head from 'expo-router/head';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AlertProvider } from '../context/AlertContext';
import { CustomAlert } from '../components/CustomAlert';
import { Colors } from '../constants/theme';
import '../constants/i18n';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Head>
        <title>MedHive Patient App</title>
        <meta name="theme-color" content={Colors.light.background} />
        <meta name="msapplication-TileColor" content={Colors.light.background} />
        {/* Force Safari toolbar background color on web */}
        {Platform.OS === 'web' && (
          <style>{`
            html, body {
              background-color: ${Colors.light.background} !important;
            }
          `}</style>
        )}
      </Head>
      <AlertProvider>
        <View style={styles.root}>
          <View style={styles.container}>
            <Stack screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: Colors.light.background }
            }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="register" />
              <Stack.Screen name="medical-history" />

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
        </View>
      </AlertProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    width: '100%',
    backgroundColor: Platform.OS === 'web' ? Colors.light.background : Colors.light.background,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 480 : '100%',
    backgroundColor: Colors.light.background,
    // Add shadow/border on web to look like a phone
    ...Platform.select({
      web: {
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 0 },
        // shadowOpacity: 0.08,
        // shadowRadius: 30,
        // borderLeftWidth: 1,
        // borderRightWidth: 1,
        // borderColor: '#E2E8F0',
      },
      default: {},
    }),
  },
});
