
import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/theme';
import { HoneyContainer } from '../components/HoneyContainer';
import { Input } from '../components/Input';
import { PrimaryButton } from '../components/PrimaryButton';
import { StatusBar } from 'expo-status-bar';
import { API_ENDPOINTS } from '../constants/config';
import { auth_endpoints } from '../constants/config';
import { saveUser } from '../utils/userStore';


import { useTranslation } from 'react-i18next';

export default function MedicalHistoryScreen() {
    const { t } = useTranslation();
    const params = useLocalSearchParams();
    const { fname, lname, email, dob, gender, phoneNumber, district, province, medId, password } = params;

    const [medicalRecords, setMedicalRecords] = useState('');
    const [bloodGroup, setbloodGroup] = useState('');
    const [diseases, setDiseases] = useState('');
    const [allergies, setAllergies] = useState('');
    const [otherInfo, setOtherInfo] = useState('');
    const [emergencyContactName, setemergencyContactName] = useState('');
    
    const [emergencyContactNumber, setemergencyContactNumber] = useState('');
    
    

    const handleVerifyAndCreate = async () => {
        try {
            // STEP 1: Register the full profile (Basic Info + Medical History) in one go
            const response = await fetch(auth_endpoints.REGISTER, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fname,
                    lname,
                    email,
                    password,
                    gender,
                    district,
                    province,
                    phone_number: phoneNumber,
                    date_of_birth: dob, // Already formatted as YYYY-MM-DD from register.tsx
                    medical_records: medicalRecords,
                    diseases: diseases,
                    allergies: allergies,
                    blood_group:bloodGroup,
                    emergency_contact_name:emergencyContactName,
                    emergency_contact_number:emergencyContactNumber,
                    other_info: otherInfo
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store user data locally
                if (data.user) {
                    await saveUser(data.user);
                }

                router.push({
                    pathname: '/(tabs)/upload',
                    params: { medId: data.user.med_id }
                });
            } else {
                alert(data.message || "Registration failed");
            }
        } catch (error) {
            console.error("Registration Error:", error);
            alert("Server error. Please try again.");
        }
    };
    return (
        <LinearGradient
            colors={[Colors.light.background, Colors.light.background]}
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
                    <HoneyContainer style={styles.formContainer}>
                        <View style={styles.formHeader}>
                            <Text style={styles.cardTitle}>{t('medHistory.title')}</Text>
                            <Text style={styles.subtitle}>{t('medHistory.step')}</Text>
                        </View>

                        <Input
                            label={t('medHistory.recordsLabel')}
                            placeholder={t('medHistory.recordsPlaceholder')}
                            value={medicalRecords}
                            onChangeText={setMedicalRecords}
                            iconName="document-text-outline"
                            multiline
                            numberOfLines={4}
                        />

                         <Input
                            label={"blood Group"}
                            placeholder={"Blood group (eg:- O+ , O-,....)"}
                            value={bloodGroup}
                            onChangeText={setbloodGroup}
                            iconName="document-text-outline"
                            multiline
                            numberOfLines={1}
                        />

                        <Input
                            label={t('medHistory.chronicLabel')}
                            placeholder={t('medHistory.chronicPlaceholder')}
                            value={diseases}
                            onChangeText={setDiseases}
                            iconName="fitness-outline"
                        />

                        <Input
                            label={t('medHistory.allergiesLabel')}
                            placeholder={t('medHistory.allergiesPlaceholder')}
                            value={allergies}
                            onChangeText={setAllergies}
                            iconName="warning-outline"
                        />
                        <Input
                            label={"emrgency contact number name "}
                            placeholder={""}
                            value={emergencyContactName}
                            onChangeText={setemergencyContactName}
                            
                        />
                        <Input
                            label={"emrgency contact number number "}
                            placeholder={"(eg:- +94 712 345 6789)"}
                            value={emergencyContactNumber}
                            onChangeText={setemergencyContactNumber}
                            
                        />
                        

                        <Input
                            label={t('medHistory.otherLabel')}
                            placeholder={t('medHistory.otherPlaceholder')}
                            value={otherInfo}
                            onChangeText={setOtherInfo}
                            iconName="information-circle-outline"
                            multiline
                            numberOfLines={3}
                        />

                        <PrimaryButton
                            title={t('medHistory.verifyBtn')}
                            onPress={handleVerifyAndCreate}
                            style={styles.submitBtn}
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
        padding: 20,
        paddingTop: 80,
        paddingBottom: 40,
    },
    formContainer: {
        width: '100%',
    },
    formHeader: {
        marginBottom: 24,
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        backgroundColor: '#F1F5F9',
        borderRadius: 35,
        padding: 16,
        fontSize: 15,
        color: '#334155',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    textArea: {
        minHeight: 100,
    },
    submitBtn: {
        marginTop: 24,
        marginBottom: 10,
    },
});
