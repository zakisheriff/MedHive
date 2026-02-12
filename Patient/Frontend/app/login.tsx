
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/theme';
import { HoneyContainer } from '../components/HoneyContainer';
import { Input } from '../components/Input';
import { PrimaryButton } from '../components/PrimaryButton';
import { SocialButton } from '../components/SocialButton';
import { StatusBar } from 'expo-status-bar';
import { auth_endupoints } from '../constants/config';
import { saveUser } from '../utils/userStore';
import { useAlert } from '../context/AlertContext';

import { useTranslation } from 'react-i18next';

export default function LoginScreen() {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { showAlert } = useAlert();

    const handleLogin = async () => {
        if (!email || !password) {
            showAlert({
                title: t('auth.required'),
                message: t('auth.emailPlaceholder') + " & " + t('auth.passwordPlaceholder'),
                forceCustom: true
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(auth_endupoints.LOGIN, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    password
                })
            });

            const data = await response.json();

            if (response.ok) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

                console.log("Logged in user:", data.user.med_id);

                // Store user data
                await saveUser(data.user);

                // Navigate after successful login
                router.push('/(tabs)/upload');
            } else {
                showAlert({
                    title: t('auth.loginFailed'),
                    message: data.message || t('auth.invalidCreds'),
                    forceCustom: true
                });
            }

        } catch (error) {
            console.error("Login Error:", error);
            showAlert({
                title: t('auth.connError'),
                message: t('auth.connErrorMsg'),
                forceCustom: true
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <LinearGradient
            colors={[Colors.light.background, Colors.light.background]}
            style={{ flex: 1 }}
        >
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <View style={[styles.closeButtonContainer, { marginTop: Math.max(insets.top, 20) }]}>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                router.replace('/');
                            }}
                        >
                            <Ionicons name="close" size={28} color={Colors.light.text} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.header}>
                        <Image
                            source={require('../assets/images/logode.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    </View>

                    <HoneyContainer style={styles.formContainer}>
                        <View style={styles.formHeader}>
                            <Text style={styles.cardTitle}>{t('auth.login')}</Text>
                        </View>

                        <Input
                            label={t('auth.emailLabel')}
                            placeholder={t('auth.emailPlaceholder')}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                            iconName="mail-outline"
                        />

                        <Input
                            secureTextEntry
                            label={t('auth.passwordLabel')}
                            placeholder={t('auth.passwordPlaceholder')}
                            value={password}
                            onChangeText={setPassword}
                            iconName="lock-closed-outline"
                        />

                        <View style={styles.forgotPassword}>
                            <TouchableOpacity
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    router.push('/forgot-password');
                                }}>
                                <Text style={styles.forgotText}>{t('auth.forgotPassword')}</Text>
                            </TouchableOpacity>
                        </View>

                        <PrimaryButton
                            title={t('auth.signIn')}
                            onPress={handleLogin}
                            style={styles.loginBtn}
                            isLoading={isLoading}
                        />

                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>{t('auth.or')}</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <SocialButton
                            title={t('auth.google')}
                            onPress={() => console.log('Google Sign-In')}
                        />

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>{t('auth.noAccount')}</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    router.push('/register');
                                }}>
                                <Text style={styles.linkText}>{t('auth.signUpLink')}</Text>
                            </TouchableOpacity>
                        </View>
                    </HoneyContainer>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    closeButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 10,
    },
    closeButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 16,
    },
    logo: {
        width: 70,
        height: 70,
    },
    formContainer: {
        width: '100%',
    },
    formHeader: {
        marginBottom: 20,
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.light.text,
    },
    forgotPassword: {
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    forgotText: {
        color: Colors.light.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    loginBtn: {
        marginTop: 8,
        marginBottom: 20,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E5E5',
    },
    dividerText: {
        marginHorizontal: 12,
        color: '#999',
        fontSize: 14,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    footerText: {
        color: '#666',
        fontSize: 14,
    },
    linkText: {
        color: Colors.light.primary,
        fontSize: 14,
        fontWeight: '700',
    },
});
