import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as GoogleAuthSession from 'expo-auth-session/providers/google';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { auth_endupoints } from '../constants/config';
import { saveUser } from '../utils/userStore';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

WebBrowser.maybeCompleteAuthSession();

export function useGoogleAuth(showAlert: any, t: any) {
    const [isLoading, setIsLoading] = useState(false);

    // Initialize Native SDK
    useEffect(() => {
        if (Platform.OS !== 'web') {
            GoogleSignin.configure({
                webClientId: '335178320393-iv304i70q3qo459ea14alsgre42qpmol.apps.googleusercontent.com',
                iosClientId: '335178320393-ro7qi41ur08qfoaeamnf70l268h8vahq.apps.googleusercontent.com',
            });
        }
    }, []);

    // Initialize Web Auth Session
    const [request, response, promptAsync] = GoogleAuthSession.useIdTokenAuthRequest({
        webClientId: '335178320393-iv304i70q3qo459ea14alsgre42qpmol.apps.googleusercontent.com',
    });

    // Handle Web response automatically when popup closes
    useEffect(() => {
        if (Platform.OS === 'web') {
            if (response?.type === 'success') {
                const { id_token } = response.params;
                if (id_token) {
                    processGoogleToken(id_token);
                }
            } else if (response?.type === 'error' || response?.type === 'dismiss') {
                setIsLoading(false); // reset loading state if user cancels popup
            }
        }
    }, [response]);

    const processGoogleToken = async (idToken: string) => {
        try {
            setIsLoading(true);
            const backendResponse = await fetch(
                auth_endupoints.GOOGLESIGNUP,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token: idToken, clientId: '335178320393-iv304i70q3qo459ea14alsgre42qpmol.apps.googleusercontent.com' }),
                }
            );

            const result = await backendResponse.json();
            
            if (backendResponse.ok) {
                if (result.isNewUser) {
                    router.push({
                        pathname: '/complete-profile' as any,
                        params: {
                            email: result.googleProfile?.email,
                            fname: result.googleProfile?.fname,
                            lname: result.googleProfile?.lname
                        }
                    });
                } else {
                    if (Platform.OS !== 'web') {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    }
                    await saveUser(result.user);
                    router.push('/(tabs)/upload');
                }
            } else {
                showAlert({
                    title: t('auth.loginFailed', 'Login Failed'),
                    message: result.message || 'Authentication failed',
                    forceCustom: true
                });
            }
        } catch (error) {
            console.error("Google Web Verification Error:", error);
            showAlert({
                title: 'Error',
                message: 'Google Sign-In failed. Please try again.',
                forceCustom: true
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        if (Platform.OS === 'web') {
            setIsLoading(true);
            promptAsync();
            return;
        }

        try {
            setIsLoading(true);
            await GoogleSignin.hasPlayServices();
            const nativeResponse = await GoogleSignin.signIn();
            
            if (nativeResponse.type !== 'success') {
                setIsLoading(false);
                return;
            }
            
            const idToken = nativeResponse.data?.idToken;
            if (!idToken) {
                throw new Error('No ID token returned');
            }

            await processGoogleToken(idToken);
        } catch (error) {
            console.error("Google Sign-In Native Error:", error);
            showAlert({
                title: 'Error',
                message: 'Google Sign-In failed. Please try again.',
                forceCustom: true
            });
            setIsLoading(false);
        }
    };

    return { handleGoogleSignIn, isGoogleLoading: isLoading };
}
