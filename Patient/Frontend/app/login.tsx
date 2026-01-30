
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { Colors } from '../constants/theme';
import { HoneyContainer } from '../components/HoneyContainer';
import { Input } from '../components/Input';
import { PrimaryButton } from '../components/PrimaryButton';
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // TODO: Implement actual login logic
        console.log('Login with:', email, password);
    };

    return (
        <View style={styles.background}>
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <Text style={styles.appName}>MedHive</Text>
                        <Text style={styles.welcomeText}>Welcome Back!</Text>
                    </View>

                    <HoneyContainer style={styles.formContainer}>
                        <View style={styles.formHeader}>
                            <Text style={styles.cardTitle}>Login</Text>
                        </View>

                        <Input
                            label="Email"
                            placeholder="Enter your email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />

                        <Input
                            label="Password"
                            placeholder="Enter your password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />

                        <View style={styles.forgotPassword}>
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </View>

                        <PrimaryButton
                            title="Sign In"
                            onPress={handleLogin}
                            style={styles.loginBtn}
                        />

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account? </Text>
                            <Link href="/register" asChild>
                                <Text style={styles.linkText}>Sign Up</Text>
                            </Link>
                        </View>
                    </HoneyContainer>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
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
        marginBottom: 40,
    },
    appName: {
        fontSize: 32,
        fontWeight: '900',
        color: Colors.light.primary,
        marginBottom: 10,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.text,
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
