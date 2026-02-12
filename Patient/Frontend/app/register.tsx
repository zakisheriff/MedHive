
import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Link, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/theme';
import { HoneyContainer } from '../components/HoneyContainer';
import { Input } from '../components/Input';
import { DOBInput } from '../components/DOBInput';
import { PickerInput } from '../components/PickerInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { SocialButton } from '../components/SocialButton';
import { StatusBar } from 'expo-status-bar';
import { auth_endupoints } from '../constants/config';
import { saveUser } from '../utils/userStore';
import { useAlert } from '../context/AlertContext';

// Sri Lankan Districts by Province
const SRI_LANKAN_DISTRICTS = [
    'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo',
    'Galle', 'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara',
    'Kandy', 'Kegalle', 'Kilinochchi', 'Kurunegala', 'Mannar',
    'Matale', 'Matara', 'Monaragala', 'Mullaitivu', 'Nuwara Eliya',
    'Polonnaruwa', 'Puttalam', 'Ratnapura', 'Trincomalee', 'Vavuniya'
];

const SRI_LANKAN_PROVINCES = [
    'Central', 'Eastern', 'North Central', 'Northern', 'North Western',
    'Sabaragamuwa', 'Southern', 'Uva', 'Western'
];

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTranslation } from 'react-i18next';

export default function RegisterScreen() {
    const insets = useSafeAreaInsets();
    const { showAlert } = useAlert();
    const { t } = useTranslation();

    const GENDER_OPTIONS = [
        t('auth.genderOptions.male'),
        t('auth.genderOptions.female'),
        t('auth.genderOptions.other')
    ];

    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [email, setEmail] = useState('');
    const [dob, setDob] = useState({ day: '', month: '', year: '' });
    const [gender, setGender] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [district, setDistrict] = useState('');
    const [province, setProvince] = useState('');
    const [medId, setMedId] = useState('');
    const [dobError, setDobError] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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

    const handleRegister = async () => {
        if (!fname || !lname || !email || !password || !medId || !gender || !phoneNumber || !district || !province) {
            showAlert({
                title: t('auth.required'),
                message: t('auth.requiredMsg'),
                forceCustom: true
            });
            return;
        }

        if (password !== confirmPassword) {
            showAlert({
                title: t('auth.regFailed'),
                message: t('auth.passwordMismatch'),
                forceCustom: true
            });
            return;
        }

        setIsLoading(true);
        try {
            // Construct the body based on what your backend expects
            const registrationData = {

                fname,
                lname,
                date_of_birth: `${dob.year}-${dob.month}-${dob.day}`, // Formatting for SQL
                email,
                password,
                gender,
                phone_number: phoneNumber,
                district,
                province
            };

            const response = await fetch(auth_endupoints.REGISTER, { // Use 10.0.2.2 for Android Emulator
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registrationData),
            });

            const result = await response.json();
            //***change the route***
            if (response.ok) {
                showAlert({
                    title: t('auth.regSuccess'),
                    message: t('auth.regSuccess'),
                    forceCustom: true
                });

                // Store user data
                if (result.user) {
                    await saveUser(result.user);
                }

                router.push('/(tabs)/upload');
            } else {
                showAlert({
                    title: t('auth.regFailed'),
                    message: result.message || t('auth.regFailed'),
                    forceCustom: true
                });
            }
        } catch (error) {
            console.error("Connection Error:", error);
            showAlert({
                title: t('auth.connError'),
                message: t('auth.connErrorMsg'),
                forceCustom: true
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDateChange = (day: string, month: string, year: string) => {
        setDob({ day, month, year });
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
                            <Text style={styles.cardTitle}>{t('auth.createAccount')}</Text>
                        </View>

                        <Input
                            label={t('auth.fnameLabel')}
                            placeholder={t('auth.fnamePlaceholder')}
                            value={fname}
                            onChangeText={setFname}
                            iconName="person-outline"
                        />

                        <Input
                            label={t('auth.lnameLabel')}
                            placeholder={t('auth.lnamePlaceholder')}
                            value={lname}
                            onChangeText={setLname}
                            iconName="person-outline"
                        />

                        <DOBInput onDateChange={handleDateChange} />

                        {dobError ? (
                            <Text style={styles.errorText}>{dobError}</Text>
                        ) : null}

                        {medId ? (
                            <Input
                                label={t('access.medId')}
                                value={medId}
                                editable={false}
                                iconName="id-card-outline"
                                style={{ backgroundColor: '#f9f9f9', opacity: 0.8 }}
                            />
                        ) : null}

                        <PickerInput
                            label={t('auth.genderLabel')}
                            value={gender}
                            onValueChange={setGender}
                            options={GENDER_OPTIONS}
                            placeholder={t('auth.genderPlaceholder')}
                            iconName="male-female-outline"
                        />

                        <Input
                            label={t('auth.phoneLabel')}
                            placeholder={t('auth.phonePlaceholder')}
                            keyboardType="phone-pad"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            iconName="call-outline"
                            prefix="+94 "
                            maxLength={9}
                        />

                        <PickerInput
                            label={t('auth.districtLabel')}
                            value={district}
                            onValueChange={setDistrict}
                            options={SRI_LANKAN_DISTRICTS}
                            placeholder={t('auth.districtPlaceholder')}
                            iconName="location-outline"
                        />

                        <PickerInput
                            label={t('auth.provinceLabel')}
                            value={province}
                            onValueChange={setProvince}
                            options={SRI_LANKAN_PROVINCES}
                            placeholder={t('auth.provincePlaceholder')}
                            iconName="map-outline"
                        />

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

                        <Input
                            secureTextEntry
                            label={t('auth.confirmPasswordLabel')}
                            placeholder={t('auth.confirmPasswordPlaceholder')}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            iconName="lock-closed-outline"
                        />

                        <PrimaryButton
                            title={t('auth.next')}
                            onPress={handleRegister}
                            style={styles.registerBtn}
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
                            <Text style={styles.footerText}>{t('auth.haveAccount')}</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    router.push('/login');
                                }}>
                                <Text style={styles.linkText}>{t('auth.signInLink')}</Text>
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
        paddingBottom: 60,
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
