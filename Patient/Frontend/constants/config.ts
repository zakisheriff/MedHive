import Constants from 'expo-constants';

/**
 * For APK development:
 * 1. Find your computer's local IP address (e.g., 192.168.1.5)
 * 2. Update the IP below
 * 3. Make sure your phone and PC are on the same WiFi
 */
const LOCAL_IP = '192.168.1.187'; // Automatically detected IP

export const BASE_URL = __DEV__
    ? `http://${LOCAL_IP}:5001`
    : 'https://your-production-url.com';

export const API_ENDPOINTS = {
    EXTRACT: `${BASE_URL}/api/extract`,
    SUMMARY: `${BASE_URL}/api/summary`,
    HISTORY: `${BASE_URL}/api/history`,
};
