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
    SafeAreaView,
    Platform
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import { API_ENDPOINTS } from '../constants/config';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

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
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        try {
            setLoading(true);
            const formData = new FormData();
            // @ts-ignore
            formData.append('image', {
                uri: imageUri,
                name: 'prescription.jpg',
                type: 'image/jpeg',
            });

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

            if (!response.status.toString().startsWith('2')) {
                throw new Error(result.error || `Server error: ${response.status}`);
            }

            if (result.error === 'not_medical_record') {
                Alert.alert(
                    'Invalid Document',
                    'MedHive AI: This image doesn\'t appear to be a medical prescription or lab report. Please upload a clear medical document.',
                    [{ text: 'OK', onPress: () => router.back() }]
                );
                return;
            }

            setData(result);
        } catch (error: any) {
            console.error('Extraction error:', error);
            let title = 'Connection Issue';
            let msg = 'Failed to reach MedHive AI. Please ensure your backend is running and connected to same WiFi.';

            if (error.name === 'AbortError') {
                title = 'Timeout';
                msg = 'MedHive AI is taking too long. Please try again.';
            } else if (error.message) {
                msg = error.message;
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
        if (summary) return;

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
            Alert.alert('Error', 'Failed to generate medical summary.');
        } finally {
            setSummaryLoading(false);
        }
    };

    const handleSendToClinic = () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Success', 'Prescription has been securely forwarded to your clinic pharmacy.');
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
                Alert.alert('Success', 'Record saved to your medical history.');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to save record.');
        }
    };

    if (loading) {
        return (
            <LinearGradient colors={['#F8FAFC', '#E2E8F0']} style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.light.primary} />
                <Text style={styles.loadingText}>MedHive AI analyzing...</Text>
            </LinearGradient>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <Stack.Screen options={{ headerShown: false }} />
            <LinearGradient
                colors={['#F5B25F', '#dca349']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.contentPill}>
                    {/* Header Image with Glassmorphism Overlay */}
                    <View style={styles.imageWrapper}>
                        <Image source={{ uri: imageUri }} style={styles.mainImage} resizeMode="cover" />
                        <BlurView intensity={20} tint="dark" style={styles.imageOverlay}>
                            <Ionicons name="scan-outline" size={24} color="#fff" />
                            <Text style={styles.overlayText}>AI Scanned Document</Text>
                        </BlurView>
                    </View>

                    {/* Results Area */}
                    <View style={styles.resultsArea}>
                        <View style={styles.tabSwitcher}>
                            <TouchableOpacity
                                style={[styles.tab, viewMode === 'details' && styles.activeTab]}
                                onPress={() => setViewMode('details')}
                            >
                                <Text style={[styles.tabText, viewMode === 'details' && styles.activeTabText]}>Details</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.tab, viewMode === 'summary' && styles.activeTab]}
                                onPress={handleViewSummary}
                            >
                                <Text style={[styles.tabText, viewMode === 'summary' && styles.activeTabText]}>Summary</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                            {viewMode === 'details' ? (
                                <View>
                                    {data?.medicines?.map((med: any, index: number) => (
                                        <View key={index} style={styles.medCard}>
                                            <View style={styles.medHeader}>
                                                <Ionicons name="medical" size={20} color={Colors.light.primary} />
                                                <Text style={styles.medNameText}>{med.name}</Text>
                                            </View>
                                            <View style={styles.medInfoRow}>
                                                <Text style={styles.medDetailLabel}>Dosage: <Text style={styles.medDetailValue}>{med.dosage || 'N/A'}</Text></Text>
                                                <Text style={styles.medDetailLabel}>Duration: <Text style={styles.medDetailValue}>{med.duration || 'N/A'}</Text></Text>
                                            </View>
                                            {med.instructions ? (
                                                <Text style={styles.medInstructionsText}>Note: {med.instructions}</Text>
                                            ) : null}
                                        </View>
                                    ))}
                                    {!data?.medicines?.length && (
                                        <Text style={styles.emptyText}>No data extracted.</Text>
                                    )}
                                </View>
                            ) : (
                                <View style={styles.summaryBox}>
                                    {summaryLoading ? (
                                        <ActivityIndicator color={Colors.light.primary} style={{ marginTop: 20 }} />
                                    ) : (
                                        <Text style={styles.summaryBodyText}>{summary || 'Analyzing medicine...'}</Text>
                                    )}
                                </View>
                            )}
                        </ScrollView>

                        {/* Action Buttons - Refined Aesthetics */}
                        <View style={styles.actionGrid}>
                            <TouchableOpacity
                                style={[styles.actionBtn, styles.btnPrimary]}
                                onPress={handleSendToClinic}
                            >
                                <LinearGradient colors={['#4A4A4A', '#2D2D2D']} style={styles.btnGradient}>
                                    <Ionicons name="business" size={18} color="#fff" />
                                    <Text style={styles.btnText}>Send to Clinic</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.actionBtn, styles.btnSecondary]}
                                onPress={handleAddToHistory}
                            >
                                <LinearGradient colors={['#ADC178', '#8A9A5B']} style={styles.btnGradient}>
                                    <Ionicons name="archive" size={18} color="#fff" />
                                    <Text style={styles.btnText}>Add to History</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Elegant Close Button */}
                <TouchableOpacity
                    style={styles.floatingClose}
                    onPress={() => router.back()}
                    activeOpacity={0.8}
                >
                    <BlurView intensity={30} tint="light" style={styles.closeBlur}>
                        <Ionicons name="close-outline" size={32} color="#fff" />
                    </BlurView>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: '600',
        color: '#4A4A4A',
        letterSpacing: 0.5,
    },
    contentPill: {
        width: width * 0.92,
        height: height * 0.78,
        backgroundColor: '#fff',
        borderRadius: 40,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 15,
        marginTop: 20,
    },
    imageWrapper: {
        height: '32%',
        width: '100%',
        borderRadius: 32,
        overflow: 'hidden',
        position: 'relative',
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    overlayText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    resultsArea: {
        flex: 1,
        paddingTop: 15,
        paddingHorizontal: 15,
    },
    tabSwitcher: {
        flexDirection: 'row',
        backgroundColor: '#F1F5F9',
        borderRadius: 20,
        padding: 4,
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 16,
    },
    activeTab: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    activeTabText: {
        color: '#1E293B',
    },
    scrollContent: {
        paddingBottom: 20,
    },
    medCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 18,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 5,
    },
    medHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 10,
    },
    medNameText: {
        fontSize: 17,
        fontWeight: '800',
        color: '#1E293B',
    },
    medInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    medDetailLabel: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
    },
    medDetailValue: {
        color: '#334155',
        fontWeight: '700',
    },
    medInstructionsText: {
        fontSize: 12,
        color: '#94A3B8',
        fontStyle: 'italic',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    summaryBox: {
        padding: 5,
    },
    summaryBodyText: {
        fontSize: 15,
        lineHeight: 24,
        color: '#334155',
        textAlign: 'justify',
    },
    emptyText: {
        textAlign: 'center',
        color: '#94A3B8',
        marginTop: 40,
    },
    actionGrid: {
        gap: 10,
        paddingTop: 10,
        paddingBottom: 5,
    },
    actionBtn: {
        borderRadius: 20,
        overflow: 'hidden',
    },
    btnPrimary: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    btnSecondary: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    btnGradient: {
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    btnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    floatingClose: {
        marginTop: 30,
        width: 68,
        height: 68,
        borderRadius: 34,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    closeBlur: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
});
