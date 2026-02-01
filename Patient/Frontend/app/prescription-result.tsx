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
    Platform,
    Modal,
    Clipboard
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import { API_ENDPOINTS } from '../constants/config';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function PrescriptionResultScreen() {
    const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
    const [loading, setLoading] = useState(true);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [summary, setSummary] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<'details' | 'summary'>('details');

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

    const handleOpenDetails = () => {
        setModalType('details');
        setModalVisible(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    const handleOpenSummary = async () => {
        if (!data?.medicines?.[0]?.name) {
            Alert.alert('No Data', 'No medicines detected to summarize.');
            return;
        }
        setModalType('summary');
        setModalVisible(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        if (summary) return;

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

    const handleCopy = () => {
        let content = '';
        if (modalType === 'details') {
            content = data?.medicines?.map((m: any) => `${m.name}: ${m.dosage}`).join('\n');
        } else {
            content = summary || '';
        }
        Clipboard.setString(content);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert('Copied', 'Information copied to clipboard.');
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
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={Colors.light.primary} />
                <Text style={styles.loadingText}>MedHive AI analyzing...</Text>
            </View>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <Stack.Screen options={{ headerShown: false }} />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.contentPill}>
                    {/* Header Image */}
                    <View style={styles.imageWrapper}>
                        <Image source={{ uri: imageUri }} style={styles.mainImage} resizeMode="cover" />
                        <BlurView intensity={20} tint="dark" style={styles.imageOverlay}>
                            <Ionicons name="scan-outline" size={24} color="#fff" />
                            <Text style={styles.overlayText}>AI Scanned Document</Text>
                        </BlurView>
                    </View>

                    {/* Action Area */}
                    <View style={styles.resultsArea}>
                        <Text style={styles.welcomeText}>Scan Complete</Text>
                        <Text style={styles.subText}>Select an option below to view extracted data or get a detailed AI summary.</Text>

                        <View style={styles.primaryActionGrid}>
                            <TouchableOpacity style={styles.buttonBase} onPress={handleOpenDetails}>
                                <LinearGradient colors={['#6B7280', '#374151']} style={styles.buttonGradientBase}>
                                    <Ionicons name="list" size={18} color="#fff" />
                                    <Text style={styles.buttonTextBase}>View Details</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.buttonBase} onPress={handleOpenSummary}>
                                <LinearGradient colors={['#818cf8', '#4f46e5']} style={styles.buttonGradientBase}>
                                    <Ionicons name="sparkles" size={18} color="#fff" />
                                    <Text style={styles.buttonTextBase}>AI Summary</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footerActions}>
                            <TouchableOpacity style={styles.buttonBase} onPress={handleSendToClinic}>
                                <LinearGradient colors={['#4A4A4A', '#2D2D2D']} style={styles.buttonGradientBase}>
                                    <Ionicons name="business" size={18} color="#fff" />
                                    <Text style={styles.buttonTextBase}>Send to Clinic</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.buttonBase} onPress={handleAddToHistory}>
                                <LinearGradient colors={['#ADC178', '#8A9A5B']} style={styles.buttonGradientBase}>
                                    <Ionicons name="archive" size={18} color="#fff" />
                                    <Text style={styles.buttonTextBase}>Add to History</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Close Button */}
                <TouchableOpacity style={styles.floatingClose} onPress={() => router.back()}>
                    <LinearGradient colors={['#F5B25F', '#dca349']} style={styles.closeGradient}>
                        <Ionicons name="close-outline" size={34} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            </SafeAreaView>

            {/* Elegant Charcoal Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                    <View style={styles.modalContent}>
                        <Text style={styles.modalBrand}>MedHive's Prescription Reader</Text>

                        <View style={styles.dataContainer}>
                            <Text style={styles.dataTitle}>
                                {modalType === 'details' ? 'Medicine Data' : 'Medicine Summary'}
                            </Text>

                            <ScrollView style={styles.dataScroll} showsVerticalScrollIndicator={false}>
                                {modalType === 'details' ? (
                                    <View>
                                        {data?.medicines?.map((med: any, index: number) => (
                                            <View key={index} style={styles.modalMedItem}>
                                                <Text style={styles.modalMedText}>• {med.name} {med.dosage ? `${med.dosage}` : ''} {med.duration ? `x ${med.duration}` : ''}</Text>
                                            </View>
                                        ))}
                                        {(!data?.medicines || data?.medicines.length === 0) && (
                                            <Text style={styles.modalEmptyText}>No medicines detected.</Text>
                                        )}
                                    </View>
                                ) : (
                                    <View>
                                        {summaryLoading ? (
                                            <ActivityIndicator color="#fff" style={{ marginTop: 20 }} />
                                        ) : (
                                            <Text style={styles.modalSummaryText}>{summary || 'Analyzing...'}</Text>
                                        )}
                                    </View>
                                )}
                            </ScrollView>
                        </View>

                        <TouchableOpacity style={styles.copyBtn} onPress={handleCopy}>
                            <Text style={styles.copyBtnText}>Copy</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.modalBackBtn} onPress={() => setModalVisible(false)}>
                            <Ionicons name="chevron-back" size={24} color="rgba(255,255,255,0.7)" />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    safeArea: {
        flex: 1,
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
    },
    loadingText: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: '600',
        color: '#4A4A4A',
    },
    contentPill: {
        width: width * 0.95,
        height: height * 0.8,
        backgroundColor: '#F5B25F',
        borderRadius: 40,
        padding: 10,
        marginTop: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 15,
        elevation: 10,
    },
    imageWrapper: {
        height: '35%',
        width: '100%',
        borderRadius: 32,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    mainImage: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 15,
        left: 15,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    overlayText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
    },
    resultsArea: {
        flex: 1,
        padding: 20,
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: '900',
        color: '#fff',
        marginBottom: 8,
    },
    subText: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        lineHeight: 20,
        marginBottom: 25,
    },
    primaryActionGrid: {
        gap: 12,
        marginBottom: 20,
    },
    footerActions: {
        gap: 12,
        marginTop: 10,
    },
    buttonBase: {
        borderRadius: 22,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6,
    },
    buttonGradientBase: {
        paddingVertical: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    buttonTextBase: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
        letterSpacing: 0.3,
    },
    floatingClose: {
        marginTop: 25,
        width: 64,
        height: 64,
        borderRadius: 32,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 10,
    },
    closeGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Modal Styles matching design
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: width * 0.92,
        backgroundColor: '#2D2D2A', // Deep charcoal
        borderRadius: 40,
        padding: 25,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.5,
        shadowRadius: 30,
        elevation: 20,
    },
    modalBrand: {
        fontSize: 15,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 20,
        letterSpacing: 0.5,
    },
    dataContainer: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 30,
        padding: 20,
        height: height * 0.45,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    dataTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: 'rgba(255,255,255,0.7)',
        textAlign: 'center',
        marginBottom: 15,
    },
    dataScroll: {
        flex: 1,
    },
    modalMedItem: {
        marginBottom: 12,
    },
    modalMedText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: 26,
    },
    modalSummaryText: {
        color: '#fff',
        fontSize: 17,
        lineHeight: 25,
        textAlign: 'center',
    },
    modalEmptyText: {
        color: 'rgba(255,255,255,0.4)',
        textAlign: 'center',
        marginTop: 20,
    },
    copyBtn: {
        width: '100%',
        backgroundColor: '#243b2b', // Deep green
        paddingVertical: 14,
        borderRadius: 20,
        marginTop: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(46, 75, 55, 0.5)',
    },
    copyBtnText: {
        color: '#4CAF50',
        fontSize: 16,
        fontWeight: '800',
    },
    modalBackBtn: {
        marginTop: 15,
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    }
});
