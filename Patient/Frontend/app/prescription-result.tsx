import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    ActivityIndicator,
    Alert
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import { API_ENDPOINTS } from '../constants/config';
import * as Haptics from 'expo-haptics';

export default function PrescriptionResultScreen() {
    const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
    const [loading, setLoading] = useState(true);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [summary, setSummary] = useState<string | null>(null);

    useEffect(() => {
        if (imageUri) {
            extractData();
        }
    }, [imageUri]);

    const extractData = async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

        try {
            setLoading(true);
            const formData = new FormData();
            // @ts-ignore
            formData.append('image', {
                uri: imageUri,
                name: 'prescription.jpg',
                type: 'image/jpeg',
            });

            console.log('Sending request to:', API_ENDPOINTS.EXTRACT);
            const response = await fetch(API_ENDPOINTS.EXTRACT, {
                method: 'POST',
                body: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || `Server error: ${response.status}`);
            }

            setData(result);
        } catch (error: any) {
            console.error('Extraction error:', error);
            let title = 'Error';
            let msg = error.message;

            if (error.name === 'AbortError') {
                title = 'Connection Timeout';
                msg = 'Request timed out. Is the backend server running?';
            } else if (error.message.includes('Network request failed')) {
                title = 'Connection Failed';
                msg = 'Please check if your computer and phone are on the same WiFi.';
            }

            Alert.alert(title, msg);
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const handleViewSummary = async () => {
        if (!data?.medicines?.[0]?.name) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        try {
            setSummaryLoading(true);
            const response = await fetch(API_ENDPOINTS.SUMMARY, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ medicineName: data.medicines[0].name }),
            });
            const result = await response.json();
            setSummary(result.summary);
        } catch (error) {
            Alert.alert('Error', 'Failed to get summary');
        } finally {
            setSummaryLoading(false);
        }
    };

    const handleSendToClinic = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Success', 'Prescription has been sent to the clinic pharmacy.');
    };

    const handleAddToHistory = async () => {
        try {
            const response = await fetch(API_ENDPOINTS.HISTORY, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, imageUri }),
            });
            if (response.ok) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                Alert.alert('Success', 'Added to your medical history.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to save to history');
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.light.primary} />
                <Text style={styles.loadingText}>Gemini is analyzing your prescription...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Stack.Screen options={{ title: 'Extracted Details', headerBackTitle: 'Back' }} />

            <View style={styles.card}>
                <Image source={{ uri: imageUri }} style={styles.prescriptionImage} resizeMode="contain" />

                <View style={styles.resultsContainer}>
                    <Text style={styles.sectionTitle}>Medicine Details</Text>
                    {data?.medicines?.map((med: any, index: number) => (
                        <View key={index} style={styles.medicineItem}>
                            <Text style={styles.medName}>{med.name}</Text>
                            <Text style={styles.medDetails}>{med.dosage} • {med.frequency} • {med.duration}</Text>
                        </View>
                    ))}
                </View>

                {summary && (
                    <View style={styles.summaryContainer}>
                        <Text style={styles.sectionTitle}>Medical Summary</Text>
                        <Text style={styles.summaryText}>{summary}</Text>
                    </View>
                )}

                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={styles.primaryButton} onPress={() => { }}>
                        <Text style={styles.buttonText}>View Medicine</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={handleViewSummary}
                        disabled={summaryLoading}
                    >
                        {summaryLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>View Summary</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryButton} onPress={handleSendToClinic}>
                        <Text style={styles.buttonText}>Send to Clinic</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryButton} onPress={handleAddToHistory}>
                        <Text style={styles.buttonText}>Add to History</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 24,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    prescriptionImage: {
        width: '100%',
        height: 250,
        backgroundColor: '#eee',
    },
    resultsContainer: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 12,
    },
    medicineItem: {
        backgroundColor: '#F3F4F6',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    medName: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.primary,
    },
    medDetails: {
        fontSize: 14,
        color: '#4B5563',
        marginTop: 4,
    },
    summaryContainer: {
        padding: 20,
        paddingTop: 0,
    },
    summaryText: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
    },
    buttonGroup: {
        padding: 20,
        gap: 12,
    },
    primaryButton: {
        backgroundColor: '#4B4B4B',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    secondaryButton: {
        backgroundColor: '#A3B18A',
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});
