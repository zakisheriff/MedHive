import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

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
                    toValue: -40,
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

            {/* Background Decoration */}
            <View style={styles.circle1} />
            <View style={styles.circle2} />

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
                <Animated.Text style={[styles.heroMoto, { opacity: contentAnim }]}>
                    Your Health,{'\n'}Unified.
                </Animated.Text>
            </Animated.View>

            <Animated.View style={[styles.bottomContainer, { opacity: contentAnim }]}>
                <Text style={styles.heroSubtitle}>
                    MedHive is Sri Lanka's AI-Powered Healthcare Platform. Unify Medical Records and Access Intelligent Health Insights.
                </Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={handleGetStarted}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={[Colors.light.primary, Colors.light.primaryDark]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradient}
                    >
                        <Text style={styles.buttonText}>Get Started</Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background, // Should be #F8FAFC if matching web exactly, but likely defined in theme
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
        backgroundColor: 'rgba(220, 163, 73, 0.1)', // #dca349 with opacity
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
    // Matches .hero-title
    heroTitle: {
        fontSize: 48, // Scaled down from 90px for mobile
        fontWeight: '900',
        color: '#111',
        letterSpacing: -2,
        marginBottom: 5,
        textAlign: 'center',
    },
    // Matches .hero-moto
    heroMoto: {
        fontSize: 34, // Reduced from 42
        fontWeight: '900',
        color: '#dca349', // The exact golden yellow
        letterSpacing: -1.5,
        lineHeight: 38,
        textAlign: 'center',
        marginBottom: 10,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 50,
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    // Matches .hero-subtitle
    heroSubtitle: {
        fontSize: 16,
        color: '#444',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
        fontWeight: '600',
        maxWidth: 300,
    },
    button: {
        width: '100%',
        borderRadius: 50, // More rounded like web buttons
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
    },
    gradient: {
        paddingVertical: 18,
        borderRadius: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800', // Bolder match
    },
});
