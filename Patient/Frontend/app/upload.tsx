
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/theme';
import { HoneyContainer } from '../components/HoneyContainer';
import { PrimaryButton } from '../components/PrimaryButton';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function UploadScreen() {
    const handleUpload = () => {
        // Implement document picker logic here
        console.log('Open document picker');
    };

    const handleFinish = () => {
        // Navigate to login or home
        router.replace('/login');
    };

    return (
        <LinearGradient
            colors={['#F8FAFC', '#FFFFFF', '#F8FAFC']}
            style={styles.background}
        >
            <StatusBar style="dark" />
            <View style={styles.container}>
                <HoneyContainer style={styles.contentContainer}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Upload Documents</Text>
                        <Text style={styles.subtitle}>
                            Please upload any relevant medical records, prescriptions, or reports.
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.uploadBox} onPress={handleUpload}>
                        <View style={styles.iconContainer}>
                            <Ionicons name="cloud-upload-outline" size={48} color={Colors.light.primary} />
                        </View>
                        <Text style={styles.uploadText}>Tap to Upload</Text>
                        <Text style={styles.uploadSubtext}>PDF, JPG, PNG (Max 5MB)</Text>
                    </TouchableOpacity>

                    <View style={styles.buttonContainer}>
                        <PrimaryButton
                            title="Finish"
                            onPress={handleFinish}
                            style={styles.finishBtn}
                        />

                        <TouchableOpacity onPress={handleFinish} style={styles.skipButton}>
                            <Text style={styles.skipText}>Skip for now</Text>
                        </TouchableOpacity>
                    </View>
                </HoneyContainer>
            </View>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    contentContainer: {
        width: '100%',
        paddingVertical: 32,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        paddingHorizontal: 16,
        lineHeight: 20,
    },
    uploadBox: {
        borderWidth: 2,
        borderColor: '#E2E8F0',
        borderStyle: 'dashed',
        borderRadius: 20,
        padding: 32,
        alignItems: 'center',
        marginBottom: 32,
        backgroundColor: '#F8FAFC',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FEF3C7',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    uploadText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 4,
    },
    uploadSubtext: {
        fontSize: 13,
        color: '#94A3B8',
    },
    buttonContainer: {
        gap: 16,
    },
    finishBtn: {
        marginBottom: 0,
    },
    skipButton: {
        alignItems: 'center',
        padding: 12,
    },
    skipText: {
        color: '#64748B',
        fontSize: 14,
        fontWeight: '500',
    },
});
