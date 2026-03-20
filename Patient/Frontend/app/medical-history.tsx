
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


import { useTranslation } from 'react-i18next';

export default function MedicalHistoryScreen() {
    const { t } = useTranslation();
    const params = useLocalSearchParams();
    const { fname, lname, email, dob, gender, phoneNumber, district, province, medId, password } = params;

    const [medicalRecords, setMedicalRecords] = useState('');
    const [diseases, setDiseases] = useState('');
    const [allergies, setAllergies] = useState('');
    const [otherInfo, setOtherInfo] = useState('');

    const handleVerifyAndCreate = async () => {
        try {
            // STEP 1: Register the basic info first
            const regResponse = await fetch(auth_endpoints.REGISTER, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fname, lname, email, password, gender, district, province,
                    date_of_birth: dob,
                    phone_number: phoneNumber,
                }),
            });

            const regData = await regResponse.json();

            if (regResponse.ok) {
                const medId = regData.med_id;

                // STEP 2: Update the record with medical history
                const historyResponse = await fetch(API_ENDPOINTS.medical_history, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        medical_records: medicalRecords,
                        diseases: diseases,
                        allergies: allergies,
                        other_info: otherInfo
                    }),
                });

                if (historyResponse.ok) {
                    router.push({
                        pathname: '/(tabs)/upload',
                        params: { medId: medId }
                    });
                }
            } else {
                alert(regData.message || "Registration failed");
            }
        } catch (error) {
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
