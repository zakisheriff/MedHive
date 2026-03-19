import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/theme';
import { HoneyContainer } from '../components/HoneyContainer';
import { Input } from '../components/Input';
import { DOBInput } from '../components/DOBInput';
import { PickerInput } from '../components/PickerInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { StatusBar } from 'expo-status-bar';
import { auth_endupoints } from '../constants/config';
import { saveUser } from '../utils/userStore';
import { useAlert } from '../context/AlertContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

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

export default function CompleteProfileScreen() {
    const insets = useSafeAreaInsets();
    const { showAlert } = useAlert();
    const { t } = useTranslation();
    const params = useLocalSearchParams();

    const GENDER_OPTIONS = [
        t('auth.genderOptions.male'),
        t('auth.genderOptions.female'),
        t('auth.genderOptions.other')
    ];

    const [fname, setFname] = useState((params.fname as string) || '');
    const [lname, setLname] = useState((params.lname as string) || '');
    const email = (params.email as string) || '';
    
    const [dob, setDob] = useState({ day: '', month: '', year: '' });
    const [gender, setGender] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [district, setDistrict] = useState('');
    const [province, setProvince] = useState('');
    const [medId, setMedId] = useState('');
    const [dobError, setDobError] = useState('');
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

    const handleCompleteProfile = async () => {
        if (!fname || !lname || !dob.year || !dob.month || !dob.day || !gender || !phoneNumber || !district || !province) {
            showAlert({
                title: t('auth.required'),
                message: t('auth.requiredMsg'),
                forceCustom: true
            });
            return;
        }

        setIsLoading(true);
        try {
            const profileData = {
                fname,
                lname,
                date_of_birth: `${dob.year}-${dob.month}-${dob.day}`,
                email,
                gender,
                phone_number: phoneNumber,
                district,
                province
            };

            const response = await fetch(auth_endupoints.GOOGLE_COMPLETE_PROFILE, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(profileData),
            });

            const result = await response.json();

            if (response.ok) {
                showAlert({
                    title: t('auth.regSuccess'),
                    message: "Profile completed successfully!",
                    forceCustom: true
                });

                if (result.user) {
                    await saveUser(result.user);
                }

                router.push('/(tabs)/upload');
            } else {
                showAlert({
                    title: 'Registration Failed',
                    message: result.message || 'Could not complete profile',
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
                                router.replace({ pathname: '/', params: { skipAnimation: 'true' } });
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
                            <Text style={styles.cardTitle}>Complete Profile</Text>
                        </View>

                        <Input
                            label="Email Address"
                            value={email}
                            editable={false}
                            iconName="mail-outline"
                            style={{ backgroundColor: '#f9f9f9', opacity: 0.8 }}
                        />

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

                        <PrimaryButton
                            title={t('auth.next') || "Complete Profile"}
                            onPress={handleCompleteProfile}
                            style={styles.registerBtn}
                            isLoading={isLoading}
                        />

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
    }
});
