
import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/theme';
import { HoneyContainer } from '../components/HoneyContainer';
import { Input } from '../components/Input';
import { PrimaryButton } from '../components/PrimaryButton';
import { StatusBar } from 'expo-status-bar';

export default function MedicalHistoryScreen() {
    const params = useLocalSearchParams();
    const { fname, lname, email, dob, gender, phoneNumber, district, province, medId, password } = params;

    const [medicalRecords, setMedicalRecords] = useState('');
    const [diseases, setDiseases] = useState('');
    const [allergies, setAllergies] = useState('');
    const [otherInfo, setOtherInfo] = useState('');

    const handleVerifyAndCreate = () => {
        // Here you would typically send all data to your backend
        const completeProfile = {
            basicInfo: { fname, lname, email, dob, gender, phoneNumber, district, province, medId, password },
            medicalHistory: {
                records: medicalRecords,
                diseases: diseases,
                allergies: allergies,
                other: otherInfo
            }
        };

        console.log('Creating Account with Profile:', JSON.stringify(completeProfile, null, 2));

        // Navigate to upload screen
        router.push({
            pathname: '/(tabs)/upload',
            params: {
                // Pass user ID or token if you had real auth
            }
        });
    };

    return (
        <LinearGradient
            colors={['#F8FAFC', '#FFFFFF', '#F8FAFC']}
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
                            <Text style={styles.cardTitle}>Medical History</Text>
                            <Text style={styles.subtitle}>Step 2 of 2</Text>
                        </View>

                        <Input
                            label="Previous Medical Records"
                            placeholder="Any major surgeries, treatments, etc."
                            value={medicalRecords}
                            onChangeText={setMedicalRecords}
                            iconName="document-text-outline"
                            multiline
                            numberOfLines={4}
                        />

                        <Input
                            label="Chronic Diseases"
                            placeholder="e.g., Diabetes, Hypertension"
                            value={diseases}
                            onChangeText={setDiseases}
                            iconName="fitness-outline"
                        />

                        <Input
                            label="Allergies"
                            placeholder="e.g., Peanuts, Penicillin"
                            value={allergies}
                            onChangeText={setAllergies}
                            iconName="warning-outline"
                        />

                        <Input
                            label="Other Information"
                            placeholder="Any other health details..."
                            value={otherInfo}
                            onChangeText={setOtherInfo}
                            iconName="information-circle-outline"
                            multiline
                            numberOfLines={3}
                        />

                        <PrimaryButton
                            title="Verify & Create Account"
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
