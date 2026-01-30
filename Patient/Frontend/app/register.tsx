
import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Link, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/theme';
import { HoneyContainer } from '../components/HoneyContainer';
import { Input } from '../components/Input';
import { DOBInput } from '../components/DOBInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { SocialButton } from '../components/SocialButton';
import { StatusBar } from 'expo-status-bar';

export default function RegisterScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState(''); // Keeping email for now as per user instruction
    const [dob, setDob] = useState({ day: '', month: '', year: '' });
    const [medId, setMedId] = useState('');
    const [dobError, setDobError] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Generate Med ID when year changes
    React.useEffect(() => {
        const yearInt = parseInt(dob.year);
        const currentYear = new Date().getFullYear();

        if (dob.year.length === 4) {
            if (yearInt >= 1900 && yearInt <= currentYear) {
                const randomSuffix = Math.floor(10000 + Math.random() * 90000).toString(); // 5 random digits
                const newMedId = `${dob.year}${randomSuffix}`;
                setMedId(newMedId);
                setDobError('');
            } else {
                setMedId('');
                setDobError('Please enter a valid birth year (1900-Present)');
            }
        } else {
            setMedId('');
            setDobError('');
        }
    }, [dob.year]);

    const handleRegister = () => {
        console.log('Register with:', name, medId, email);
    };

    const handleDateChange = (day: string, month: string, year: string) => {
        setDob({ day, month, year });
    };

    return (
        <LinearGradient
            colors={['#F8FAFC', '#FFFFFF', '#F8FAFC']} // Premium Cool Gray -> White -> Gray
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

                        <DOBInput onDateChange={handleDateChange} />

                        {dobError ? (
                            <Text style={styles.errorText}>{dobError}</Text>
                        ) : null}

                        {medId ? (
                            <Input
                                label="Med-ID (Auto-Generated)"
                                value={medId}
                                editable={false}
                                iconName="id-card-outline"
                                style={{ backgroundColor: '#f9f9f9', opacity: 0.8 }}
                            />
                        ) : null}

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

                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        <SocialButton
                            title="Continue with Google"
                            onPress={() => console.log('Google Sign-Up')}
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
        paddingTop: 120,
        paddingBottom: 40,
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
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: -8,
        marginBottom: 16,
        marginLeft: 4,
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
