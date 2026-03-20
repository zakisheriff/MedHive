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
    REGISTER: `${BASE_URL}/api/auth/register`,
    LOGIN: `${BASE_URL}/api/auth/login`,
    GOOGLE_SIGNUP: `${BASE_URL}/auth/google-signup`,
    GOOGLE_LOGIN: `${BASE_URL}/api/auth/google-login`,
    EXTRACT: `${BASE_URL}/api/extract`,
    EXTRACT_PRESCRIPTION: `${BASE_URL}/api/extract`,
    SUMMARY: `${BASE_URL}/api/summary`,
    HISTORY: `${BASE_URL}/api/history`,
    medical_history:`${BASE_URL}/api/medical_history`,
    SEND_TO_CLINIC: `${BASE_URL}/api/send-to-clinic`,
    GET_CLINICS: `${BASE_URL}/api/clinics`,
    GET_OTP: (med_id: string) => `${BASE_URL}/api/access/active-otp/${med_id}`,
};

export const auth_endpoints = {
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,
    GOOGLESIGNUP: `${BASE_URL}/auth/google-signup`,
    GOOGLE_COMPLETE_PROFILE : `${BASE_URL}/auth/google-complete-profile`
};