
import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Link, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/theme';
import { HoneyContainer } from '../components/HoneyContainer';
import { Input } from '../components/Input';
import { PrimaryButton } from '../components/PrimaryButton';
import { StatusBar } from 'expo-status-bar';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = () => {
        console.log('Register with:', name, email);
    };

    return (
        <LinearGradient
            colors={['#FFFBF0', '#FFFFFF', '#FFFBF0']}
            style={styles.background}
        >
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <Image
                            source={require('../assets/images/logode.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.appName}>MedHive</Text>
                        <Text style={styles.welcomeText}>Create Account</Text>
                    </View>

                    <HoneyContainer style={styles.formContainer}>
                        <View style={styles.formHeader}>
                            <Text style={styles.cardTitle}>Create Account</Text>
                        </View>

                        <Input
                            label="Full Name"
                            placeholder="John Doe"
                            value={name}
                            onChangeText={setName}
                            iconName="person-outline"
                        />

                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                            iconName="mail-outline"
                        />

                        <Input
                            label="Password"
                            placeholder="Create a password"
                            value={password}
                            onChangeText={setPassword}
                            iconName="lock-closed-outline"
                        />

                        <Input
                            label="Confirm Password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            iconName="lock-closed-outline"
                        />

                        <PrimaryButton
                            title="Sign Up"
                            onPress={handleRegister}
                            style={styles.registerBtn}
                        />

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    router.push('/login');
                                }}>
                                <Text style={styles.linkText}>Sign In</Text>
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
        padding: 20,
        justifyContent: 'center',
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logo: {
        width: 70,
        height: 70,
        marginBottom: 16,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.light.primary,
        marginBottom: 8,
    },
    welcomeText: {
        fontSize: 18,
        fontWeight: '500',
        color: '#666',
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
    registerBtn: {
        marginTop: 10,
        marginBottom: 20,
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
