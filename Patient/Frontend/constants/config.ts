import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * For APK development:
 * 1. Find your computer's local IP address (e.g., 192.168.1.5)
 * 2. Update the IP below
 * 3. Make sure your phone and PC are on the same WiFi
 */
const debuggerHost = Constants.expoConfig?.hostUri;
const localhost = debuggerHost?.split(':')[0] || (Platform.OS === 'web' && typeof window !== 'undefined' ? window.location.hostname : 'localhost');

export const BASE_URL = __DEV__
    ? `http://${localhost || 'localhost'}:5001`
    : 'https://medhive-patient-backend-fjaad9afdkc4hvfx.southeastasia-01.azurewebsites.net';

export const API_ENDPOINTS = {
    EXTRACT: `${BASE_URL}/api/extract`,
    SUMMARY: `${BASE_URL}/api/summary`,
    HISTORY: `${BASE_URL}/api/history`,
};
export const auth_endupoints = {
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,
    GOOGLESIGNUP: `${BASE_URL}/auth/google_signup`
}