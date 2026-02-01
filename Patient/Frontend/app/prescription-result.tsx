import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    ActivityIndicator,
    Alert,
    Dimensions,
    SafeAreaView
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import { API_ENDPOINTS } from '../constants/config';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function PrescriptionResultScreen() {
    const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
    const [loading, setLoading] = useState(true);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [summary, setSummary] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'details' | 'summary'>('details');

    useEffect(() => {
        if (imageUri) {
            extractData();
        }
    }, [imageUri]);

    const extractData = async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

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

            if (result.error === 'not_medical_record') {
                Alert.alert(
                    'Validation Error',
                    'This image does not appear to be a medical prescription or lab report. Please upload a clear medical document.',
                    [{ text: 'OK', onPress: () => router.back() }]
                );
                return;
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
        setViewMode('summary');
        if (summary) return; // Already fetched

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
                <ActivityIndicator size="large" color="#dca349" />
                <Text style={styles.loadingText}>Gemini is analyzing your prescription...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.container}>
                <View style={styles.card}>
                    {/* Image Scroll Section */}
                    <View style={styles.imageSection}>
                        <Image source={{ uri: imageUri }} style={styles.prescriptionImage} resizeMode="cover" />
                    </View>

                    {/* Content Section */}
                    <View style={styles.contentSection}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {viewMode === 'details' ? (
                                <View>
                                    <Text style={styles.sectionTitle}>Medicine Details</Text>
                                    {data?.medicines?.map((med: any, index: number) => (
                                        <View key={index} style={styles.medicineItem}>
                                            <Text style={styles.medName}>{med.name}</Text>
                                            <Text style={styles.medDetails}>
                                                {med.dosage}{med.frequency ? ` • ${med.frequency}` : ''}{med.duration ? ` • ${med.duration}` : ''}
                                            </Text>
                                            {med.instructions ? (
                                                <Text style={styles.medInstructions}>{med.instructions}</Text>
                                            ) : null}
                                        </View>
                                    ))}
                                    {!data?.medicines?.length && (
                                        <Text style={styles.emptyText}>No medicines detected.</Text>
                                    )}
                                </View>
                            ) : (
                                <View>
                                    <Text style={styles.sectionTitle}>Medicine Summary</Text>
                                    {summaryLoading ? (
                                        <ActivityIndicator color="#4B4B4B" style={{ marginTop: 20 }} />
                                    ) : (
                                        <Text style={styles.summaryText}>{summary || 'Click "View Summary" to analyze.'}</Text>
                                    )}
                                </View>
                            )}
                        </ScrollView>

                        {/* Action Buttons */}
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity style={styles.charcoalButton} onPress={() => setViewMode('details')}>
                                <Text style={styles.buttonText}>View Medicine</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.charcoalButton}
                                onPress={handleViewSummary}
                            >
                                <Text style={styles.buttonText}>View Summary</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.sageButton} onPress={handleSendToClinic}>
                                <Text style={styles.buttonText}>Send to Clinic</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.sageButton} onPress={handleAddToHistory}>
                                <Text style={styles.buttonText}>Add to History</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Bottom Close Button */}
                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="close" size={28} color="#fff" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F5B25F', // MedHive Honey/Peach background
    },
    container: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    card: {
        flex: 1,
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 45, // Large rounded corners from Figma
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        marginBottom: 80, // Space for the close button
    },
    imageSection: {
        height: '35%',
        width: '100%',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    prescriptionImage: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        backgroundColor: '#eee',
    },
    contentSection: {
        flex: 1,
        paddingHorizontal: 25,
        paddingBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#4A4A4A',
        marginBottom: 15,
        textAlign: 'left',
    },
    medicineItem: {
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    medName: {
        fontSize: 17,
        fontWeight: '700',
        color: '#dca349', // Primary honey color for titles
    },
    medDetails: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
        fontWeight: '500',
    },
    medInstructions: {
        fontSize: 13,
        color: '#9CA3AF',
        marginTop: 8,
        fontStyle: 'italic',
    },
    summaryText: {
        fontSize: 15,
        color: '#4B5563',
        lineHeight: 22,
    },
    emptyText: {
        textAlign: 'center',
        color: '#9CA3AF',
        marginTop: 20,
    },
    buttonGroup: {
        marginTop: 15,
        gap: 10,
    },
    charcoalButton: {
        backgroundColor: '#4A4A4A', // Dark charcoal/gray from Figma
        paddingVertical: 14,
        borderRadius: 18,
        alignItems: 'center',
    },
    sageButton: {
        backgroundColor: '#ADC178', // Sage green from Figma
        paddingVertical: 14,
        borderRadius: 18,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    closeButton: {
        position: 'absolute',
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#EB5757', // Subtle red for close, or matching theme
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    }
});
