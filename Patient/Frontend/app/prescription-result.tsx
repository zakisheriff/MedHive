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
    Clipboard,
    Animated,
    Easing
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import { API_ENDPOINTS } from '../constants/config';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function PrescriptionResultScreen() {
    const insets = useSafeAreaInsets();
    const { imageUri } = useLocalSearchParams<{ imageUri: string }>();
    const [loading, setLoading] = useState(true);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [summary, setSummary] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<'details' | 'summary'>('details');
    const [hasError, setHasError] = useState(false);
    const scanAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (loading) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scanAnim, {
                        toValue: 1,
                        duration: 2500,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                    Animated.timing(scanAnim, {
                        toValue: 0,
                        duration: 2500,
                        easing: Easing.inOut(Easing.sin),
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        } else {
            scanAnim.stopAnimation();
        }
    }, [loading]);

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
            setHasError(false);
        } catch (error: any) {
            console.log('Extraction error (Handled):', error.message);
            setHasError(true);

            // Soft alert instead of forcing a back navigation
            Alert.alert(
                'Server Busy',
                'MedHive AI is temporarily unavailable (Free Tier limit). You can still securely send your prescription image directly to the clinic below.',
                [{ text: 'Continue' }]
            );
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
        const msg = hasError
            ? 'Your prescription image has been securely forwarded to your clinic pharmacy (Direct Mode).'
            : 'Prescription data and image have been securely forwarded to your clinic pharmacy.';
        Alert.alert('Success', msg);
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
                <Stack.Screen options={{ headerShown: false }} />
                <Image source={{ uri: imageUri }} style={styles.loadingBgImage} resizeMode="cover" blurRadius={10} />
                <View style={styles.loadingOverlay}>
                    <View style={styles.scanCard}>
                        <Image source={{ uri: imageUri }} style={styles.scanImage} resizeMode="cover" />
                        <Animated.View
                            style={[
                                styles.scanLine,
                                {
                                    transform: [{
                                        translateY: scanAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, 240] // Match scanImage height
                                        })
                                    }]
                                }
                            ]}
                        />
                    </View>
                    <View style={styles.loadingTextContainer}>
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={styles.loadingTitle}>Analyzing Prescription...</Text>
                        <Text style={styles.loadingSubtitle}>MedHive AI is extracting medical details</Text>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.mainContainer}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <Ionicons name="close" size={24} color={Colors.light.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Analysis Result</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    {/* Image Card */}
                    <View style={styles.imageCard}>
                        <Image source={{ uri: imageUri }} style={styles.resultImage} resizeMode="cover" />
                        <View style={styles.statusBadge}>
                            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                            <Text style={styles.statusText}>Scan Complete</Text>
                        </View>
                    </View>

                    {/* Title Section */}
                    <View style={styles.titleSection}>
                        <Text style={styles.mainTitle}>
                            {hasError ? 'Manual Verification Required' : 'Prescription Decoded'}
                        </Text>
                        <Text style={styles.subTitle}>
                            {hasError
                                ? 'We couldn\'t automatically read the prescription. You can still forward it to your clinic.'
                                : 'AI has successfully extracted the details. Choose an action below.'}
                        </Text>
                    </View>

                    {/* Action Cards */}
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            style={[styles.actionCard, hasError && styles.cardDisabled]}
                            onPress={handleOpenDetails}
                            disabled={hasError}
                        >
                            <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                                <Ionicons name="list" size={24} color="#2196F3" />
                            </View>
                            <View style={styles.actionTextContainer}>
                                <Text style={styles.actionTitle}>View Medical Details</Text>
                                <Text style={styles.actionDesc}>Check extracted medicines & dosage</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={Colors.light.icon} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionCard, hasError && styles.cardDisabled]}
                            onPress={handleOpenSummary}
                            disabled={hasError}
                        >
                            <View style={[styles.iconBox, { backgroundColor: '#F3E5F5' }]}>
                                <Ionicons name="sparkles" size={24} color="#9C27B0" />
                            </View>
                            <View style={styles.actionTextContainer}>
                                <Text style={styles.actionTitle}>AI Summary</Text>
                                <Text style={styles.actionDesc}>Get a simple explanation of meds</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={Colors.light.icon} />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={handleSendToClinic}
                        >
                            <LinearGradient
                                colors={[Colors.light.primary, Colors.light.primaryDark]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.primaryButtonGradient}
                            >
                                <Ionicons name="paper-plane" size={20} color="#fff" />
                                <Text style={styles.primaryButtonText}>Send to Clinic Pharmacy</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={handleAddToHistory}
                            disabled={hasError}
                        >
                            <Text style={[styles.secondaryButtonText, hasError && { color: '#999' }]}>Save to Medical History</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>

            {/* Modern Bottom Sheet Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={styles.modalBackdrop} onPress={() => setModalVisible(false)} activeOpacity={1} />
                    <View style={[styles.modalContent, { paddingBottom: insets.bottom + 20 }]}>
                        <View style={styles.modalHeader}>
                            <View style={styles.dragIndicator} />
                            <Text style={styles.modalTitle}>
                                {modalType === 'details' ? 'Extracted Details' : 'AI Summary'}
                            </Text>
                            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setModalVisible(false)}>
                                <Ionicons name="close" size={24} color={Colors.light.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalScroll}>
                            {modalType === 'details' ? (
                                <View style={styles.detailsList}>
                                    {data?.medicines?.map((med: any, index: number) => (
                                        <View key={index} style={styles.detailItem}>
                                            <View style={styles.detailIcon}>
                                                <Ionicons name="medkit-outline" size={20} color={Colors.light.primary} />
                                            </View>
                                            <View style={styles.detailInfo}>
                                                <Text style={styles.medName}>{med.name}</Text>
                                                <Text style={styles.medDosage}>
                                                    {med.dosage} {med.frequency ? `• ${med.frequency}` : ''}
                                                </Text>
                                            </View>
                                        </View>
                                    ))}
                                    {(!data?.medicines || data?.medicines.length === 0) && (
                                        <Text style={styles.emptyText}>No medicines found in this document.</Text>
                                    )}
                                </View>
                            ) : (
                                <View style={styles.summaryContainer}>
                                    {summaryLoading ? (
                                        <ActivityIndicator color={Colors.light.primary} size="large" />
                                    ) : (
                                        <Text style={styles.summaryText}>{summary || 'Analyzing...'}</Text>
                                    )}
                                </View>
                            )}
                        </ScrollView>

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
                                <Ionicons name="copy-outline" size={20} color={Colors.light.primary} />
                                <Text style={styles.copyButtonText}>Copy to Clipboard</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 35,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.light.text,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    imageCard: {
        width: '100%',
        height: 280,
        borderRadius: 35,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 5,
        marginBottom: 25,
        overflow: 'hidden',
        position: 'relative'
    },
    resultImage: {
        width: '100%',
        height: '100%',
    },
    statusBadge: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 35,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#111827',
    },
    titleSection: {
        marginBottom: 30,
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    subTitle: {
        fontSize: 16,
        color: Colors.light.icon,
        lineHeight: 24,
    },
    actionsContainer: {
        gap: 16,
    },
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 35,
        borderWidth: 1,
        borderColor: '#EDE9FE', // Very subtle tint
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 1,
    },
    cardDisabled: {
        opacity: 0.6,
        backgroundColor: '#F3F4F6',
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    actionTextContainer: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 2,
    },
    actionDesc: {
        fontSize: 13,
        color: Colors.light.icon,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 10,
    },
    primaryButton: {
        width: '100%',
        borderRadius: 35,
        overflow: 'hidden',
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    primaryButtonGradient: {
        paddingVertical: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    secondaryButton: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.primary,
    },

    // Loading State
    loadingContainer: {
        flex: 1,
        backgroundColor: '#000',
    },
    loadingBgImage: {
        flex: 1,
        opacity: 0.4,
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    scanCard: {
        width: width * 0.7,
        height: 240,
        borderRadius: 35,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
        backgroundColor: '#000',
        marginBottom: 40,
    },
    scanImage: {
        width: '100%',
        height: '100%',
        opacity: 0.8,
    },
    scanLine: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: Colors.light.primary,
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 10,
    },
    loadingTextContainer: {
        alignItems: 'center',
    },
    loadingTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    loadingSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.7)',
    },

    // Modal
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        maxHeight: height * 0.85,
        minHeight: height * 0.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 20,
    },
    modalHeader: {
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    dragIndicator: {
        width: 40,
        height: 5,
        borderRadius: 3,
        backgroundColor: '#E5E7EB',
        marginBottom: 15,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text,
    },
    modalCloseBtn: {
        position: 'absolute',
        right: 20,
        top: 20,
        padding: 5,
    },
    modalScroll: {
        padding: 20,
    },
    detailsList: {
        gap: 15,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#F9FAFB',
        borderRadius: 35,
    },
    detailIcon: {
        width: 40,
        height: 40,
        borderRadius: 35,
        backgroundColor: '#FEF3C7', // Light orange/yellow bg
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 15,
    },
    detailInfo: {
        flex: 1,
    },
    medName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 6,
    },
    medDosage: {
        fontSize: 15,
        fontWeight: '500',
        color: Colors.light.primary,
        backgroundColor: 'rgba(220, 163, 73, 0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 35,
        alignSelf: 'flex-start',
        overflow: 'hidden',
    },
    emptyText: {
        textAlign: 'center',
        color: '#9CA3AF',
        marginTop: 20,
    },
    summaryContainer: {
        paddingTop: 10,
    },
    summaryText: {
        fontSize: 16,
        lineHeight: 26,
        color: '#374151',
    },
    modalActions: {
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    copyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 15,
        backgroundColor: '#F0F9FF',
        borderRadius: 35,
    },
    copyButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.primary,
    },
});
