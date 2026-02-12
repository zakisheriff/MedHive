import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

import { TypingText } from '../components/TypingText';
import { SocialButton } from '../components/SocialButton';
import { PrimaryButton } from '../components/PrimaryButton';

const { width } = Dimensions.get('window');

const TYPING_PHRASES = [
    "Your Health, Unified.",
    "Read Prescriptions.",
    "Unified Records.",
    "Secure Data.",
    "Know Your Health."
];

export default function Index() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const moveAnim = useRef(new Animated.Value(0)).current;
    const contentAnim = useRef(new Animated.Value(0)).current; // For Moto + Bottom Content

    useEffect(() => {
        // Sequence:
        // 1. Fade In Logo + MedHive Title
        // 2. Move Up
        // 3. Fade In "Your Health, Unified" + Bottom Content
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.delay(300),
            Animated.parallel([
                Animated.timing(moveAnim, {
                    toValue: -60,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(contentAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, []);

    const handleGetStarted = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push('/login');
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" />

            <Animated.View style={[
                styles.logoContainer,
                { opacity: fadeAnim, transform: [{ translateY: moveAnim }] }
            ]}>
                <Image
                    source={require('../assets/images/logode.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.heroTitle}>MedHive</Text>

                {/* Moto fades in later with contentAnim */}
                <Animated.View style={[{ opacity: contentAnim, width: '100%', alignItems: 'center', justifyContent: 'center' }]}>
                    <TypingText
                        texts={TYPING_PHRASES}
                        style={styles.heroMoto}
                        speed={80}
                        delay={2500}
                        useCircleCursor={true}
                    />
                </Animated.View>
            </Animated.View>

            <Animated.View style={[styles.bottomContainer, { opacity: contentAnim }]}>
                <View style={styles.authStack}>
                    <PrimaryButton
                        title="Log in"
                        onPress={() => router.push('/login')}
                    />

                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => router.push('/register')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.secondaryButtonText}>Sign up</Text>
                    </TouchableOpacity>

                    <SocialButton
                        title="Continue with Google"
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            console.log('Google Sign-In');
                        }}
                        style={{ marginBottom: 0 }}
                    />
                </View>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    circle1: {
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(220, 163, 73, 0.1)',
    },
    circle2: {
        position: 'absolute',
        bottom: -50,
        left: -50,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(220, 163, 73, 0.05)',
    },
    logoContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    heroTitle: {
        fontSize: 48,
        fontWeight: '900',
        color: '#111',
        letterSpacing: -2,
        marginBottom: 5,
        textAlign: 'center',
    },
    heroMoto: {
        fontSize: 32,
        fontWeight: '900',
        color: Colors.light.primary,
        letterSpacing: -1.5,
        textAlign: 'center',
        marginBottom: 10,
        width: '100%',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 60,
        width: '100%',
        alignItems: 'center',
    },
    authStack: {
        width: '80%',
        maxWidth: 400,
        gap: 12,
    },
    secondaryButton: {
        width: '100%',
        paddingVertical: 16,
        borderRadius: 35,
        backgroundColor: '#fff',
        borderWidth: 1.5,
        borderColor: 'rgba(220, 163, 73, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        color: Colors.light.primary,
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});
