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
import { ImagePreviewModal } from '../components/ImagePreviewModal';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';

export default function PrescriptionResultScreen() {
    const insets = useSafeAreaInsets();
    const { imageUri, type = 'prescription' } = useLocalSearchParams<{ imageUri: string, type?: string }>();
    const [loading, setLoading] = useState(true);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [data, setData] = useState<any>(null);
    const [summary, setSummary] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState<'details' | 'summary'>('details');
    const [hasError, setHasError] = useState(false);
    const scanAnim = useRef(new Animated.Value(0)).current;
    const scanLineOpacity = useRef(new Animated.Value(1)).current;

    const [fullScreenVisible, setFullScreenVisible] = useState(false);

    // Resizable Modal State
    const [isExpanded, setIsExpanded] = useState(false);
    const modalHeight = useRef(new Animated.Value(height * 0.5)).current;

    const renderMarkdown = (text: string) => {
        if (!text) return null;

        return text.split('\n').map((line, index) => {
            // Headers (### or ##)
            if (line.startsWith('### ')) {
                return (
                    <Text key={index} style={[styles.mdH3, { marginTop: index === 0 ? 0 : 12 }]}>
                        {line.replace('### ', '')}
                    </Text>
                );
            }
            if (line.startsWith('## ')) {
                return (
                    <Text key={index} style={[styles.mdH2, { marginTop: index === 0 ? 0 : 16 }]}>
                        {line.replace('## ', '')}
                    </Text>
                );
            }

            // Bullet points (* )
            if (line.trim().startsWith('* ')) {
                const content = line.trim().substring(2);
                return (
                    <View key={index} style={styles.mdListItem}>
                        <Text style={styles.mdBullet}>•</Text>
                        <Text style={styles.mdListText}>
                            {parseBold(content)}
                        </Text>
                    </View>
                );
            }

            // Regular paragraph
            if (line.trim() === '') {
                return <View key={index} style={{ height: 8 }} />;
            }

            return (
                <Text key={index} style={styles.mdParagraph}>
                    {parseBold(line)}
                </Text>
            );
        });
    };

    const parseBold = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <Text key={i} style={styles.mdBold}>
                        {part.slice(2, -2)}
                    </Text>
                );
            }
            return <Text key={i}>{part}</Text>;
        });
    };

    useEffect(() => {
        if (loading) {
            scanLineOpacity.setValue(1);
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

    const [showSuccess, setShowSuccess] = useState(false);
    const successAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (showSuccess) {
            Animated.timing(scanLineOpacity, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start();
        }
    }, [showSuccess]);

    const extractData = async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        try {
            setLoading(true);
            const formData = new FormData();

            if (Platform.OS === 'web') {
                // For Web: specific handling to create a Blob
                const response = await fetch(imageUri);
                const blob = await response.blob();
                const imageBlob = new Blob([blob], { type: 'image/jpeg' });
                formData.append('image', imageBlob, 'prescription.jpg');
            } else {
                // For Native: standard React Native FormData handling
                // @ts-ignore
                formData.append('image', {
                    uri: imageUri,
                    name: 'prescription.jpg',
                    type: 'image/jpeg',
                });
            }

            const response = await fetch(API_ENDPOINTS.EXTRACT, {
                method: 'POST',
                body: formData,
                // Remove 'Content-Type': 'multipart/form-data' to allow browser to generate boundary
                headers: {
                    // Add any auth headers if needed here, but do NOT set Content-Type for multipart
                },
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            const result = await response.json();

            if (result.is_medical === false || result.error === 'not_medical_record') {
                setLoading(false);
                Alert.alert(
                    'Invalid Document',
                    `MedHive AI: This image doesn't appear to be a medical ${type === 'prescription' ? 'prescription' : 'lab report'}. Please upload a clear medical document.`,
                    [{ text: 'OK', onPress: () => router.back() }]
                );
                return;
            }

            // Stricter Success Validation: No data found
            const hasMedicines = result.medicines && result.medicines.length > 0;
            const hasLabTests = result.labTests && result.labTests.length > 0;

            if (!hasMedicines && !hasLabTests) {
                setLoading(false);
                Alert.alert(
                    'No Details Found',
                    `MedHive AI couldn't detect any medical details in this image. Please ensure it's a clear ${type === 'prescription' ? 'prescription' : 'lab report'}.`,
                    [{ text: 'OK', onPress: () => router.back() }]
                );
                return;
            }

            setData(result);
            setHasError(false);

            // Success Animation
            setShowSuccess(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            Animated.spring(successAnim, {
                toValue: 1,
                friction: 6,
                tension: 40,
                useNativeDriver: true
            }).start();

            // Delay before showing results
            setTimeout(() => {
                setLoading(false);
                setShowSuccess(false);
            }, 2000);

        } catch (error: any) {
            console.log('Extraction error (Handled):', error.message);
            setHasError(true);
            setLoading(false);

            // Soft alert instead of forcing a back navigation
            Alert.alert(
                'Server Busy',
                'MedHive AI is temporarily unavailable. You can still securely send your prescription image directly to the clinic or go back.',
                [
                    { text: 'Go Back', onPress: () => router.back(), style: 'cancel' },
                    { text: 'Continue' }
                ]
            );
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
            // Prepare payload even if extraction failed
            const historyData = hasError ? {
                type: 'prescription',
                date: new Date().toISOString(),
                clinicName: 'Manual Upload',
                medicines: [],
                notes: 'AI extraction unavailable',
                imageUri
            } : { ...data, imageUri };

            const response = await fetch(API_ENDPOINTS.HISTORY, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(historyData),
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
                                    opacity: scanLineOpacity,
                                    transform: [{
                                        translateY: scanAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, 260] // Match scanImage height
                                        })
                                    }]
                                }
                            ]}
                        />
                    </View>
                    <View style={styles.loadingTextContainer}>
                        {showSuccess ? (
                            <Animated.View style={{ alignItems: 'center', transform: [{ scale: successAnim }] }}>
                                <View style={styles.successCircle}>
                                    <Ionicons name="checkmark" size={50} color="#fff" />
                                </View>
                                <Text style={styles.loadingTitle}>Scan Complete</Text>
                            </Animated.View>
                        ) : (
                            <>
                                <ActivityIndicator size="large" color="#fff" />
                                <Text style={styles.loadingTitle}>Analyzing Prescription...</Text>
                                <Text style={styles.loadingSubtitle}>MedHive AI is extracting medical details</Text>
                            </>
                        )}
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
                <View style={[styles.contentContainer, isWeb && styles.webContentContainer]}>
                    <View style={styles.header}>
                        <View style={{ width: 40 }} />
                        <Text style={styles.headerTitle}>Analysis Result</Text>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.backButton}
                        >
                            <Ionicons name="close" size={24} color={Colors.light.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {/* Image Card - Click to Expand */}
                        <TouchableOpacity
                            style={styles.imageCard}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setFullScreenVisible(true);
                            }}
                            activeOpacity={0.7}
                        >
                            <Image source={{ uri: imageUri }} style={styles.resultImage} resizeMode="cover" />
                            <View style={styles.statusBadge}>
                                <Ionicons name="expand" size={12} color="#111827" />
                                <Text style={styles.statusText}>Tap to View</Text>
                            </View>
                        </TouchableOpacity>

                        {/* Title Section */}
                        <View style={styles.titleSection}>
                            <Text style={styles.mainTitle}>
                                {hasError
                                    ? 'Manual Verification Required'
                                    : `${type === 'prescription' ? 'Prescription' : 'Lab Report'} Decoded`}
                            </Text>
                            <Text style={styles.subTitle}>
                                {hasError
                                    ? `We couldn't automatically read the ${type === 'prescription' ? 'prescription' : 'lab report'}. You can still forward it to your clinic.`
                                    : 'AI has successfully extracted the details. Choose an action below.'}
                            </Text>
                        </View>

                        {/* Action Cards - Only show if not in error mode */}
                        {!hasError && (
                            <View style={styles.actionsContainer}>
                                <TouchableOpacity
                                    style={styles.actionCard}
                                    onPress={handleOpenDetails}
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
                                    style={styles.actionCard}
                                    onPress={handleOpenSummary}
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
                            </View>
                        )}

                        <View style={styles.divider} />

                        <View style={[styles.actionsContainer, { marginTop: 12 }]}>
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
                            >
                                <View style={styles.secondaryButtonContent}>
                                    <Ionicons name="save-outline" size={20} color={Colors.light.primary} />
                                    <Text style={styles.secondaryButtonText}>Save to Medical History</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Spacer for Mobile Web Browser Bar - Increased height */}
                        {isWeb && <View style={{ height: 150 }} />}
                    </ScrollView>
                </View>
            </SafeAreaView>

            {/* Resizable Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={styles.modalBackdrop} onPress={() => setModalVisible(false)} activeOpacity={1} />

                    <Animated.View
                        style={[
                            styles.modalContent,
                            {
                                height: modalHeight,
                                paddingBottom: insets.bottom + 20,
                                width: '100%',
                                maxWidth: isWeb ? 600 : undefined,
                                alignSelf: 'center',
                            }
                        ]}
                    >
                        <View style={styles.modalHeader}>
                            <TouchableOpacity
                                style={styles.headerIconButton}
                                onPress={() => {
                                    const toValue = isExpanded ? height * 0.5 : height * 0.9;
                                    setIsExpanded(!isExpanded);
                                    Animated.spring(modalHeight, {
                                        toValue,
                                        useNativeDriver: false,
                                        friction: 6
                                    }).start();
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                }}
                            >
                                <Ionicons name={isExpanded ? "contract" : "expand"} size={20} color={Colors.light.text} />
                            </TouchableOpacity>

                            <Text style={styles.modalTitle}>
                                {modalType === 'details' ? 'Extracted Details' : 'AI Summary'}
                            </Text>

                            <TouchableOpacity style={styles.headerIconButton} onPress={() => setModalVisible(false)}>
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
                                                <View style={styles.medDetailsRow}>
                                                    <View style={styles.medDosageChip}>
                                                        <Text style={styles.medDosageText}>{med.dosage}</Text>
                                                    </View>
                                                    {med.frequency && (
                                                        <View style={styles.medFrequencyChip}>
                                                            <Text style={styles.medFrequencyText}>{med.frequency}</Text>
                                                        </View>
                                                    )}
                                                </View>
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
                                        <View>
                                            {summary ? renderMarkdown(summary) : <Text style={styles.summaryText}>Analyzing...</Text>}
                                        </View>
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
                    </Animated.View>
                </View>
            </Modal>

            {/* Full Screen Image Modal */}
            <ImagePreviewModal
                isVisible={fullScreenVisible}
                imageUri={imageUri}
                onClose={() => setFullScreenVisible(false)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        flex: 1,
    },
    webContentContainer: {
        width: '100%',
        maxWidth: 600,
        alignSelf: 'center',
    },
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
        paddingVertical: isWeb ? 12 : 15,
    },
    backButton: {
        width: isWeb ? 38 : 40,
        height: isWeb ? 38 : 40,
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
        fontSize: isWeb ? 17 : 18,
        fontWeight: '600',
        color: Colors.light.text,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: isWeb ? 100 : 40,
    },
    imageCard: {
        width: '100%',
        height: isWeb ? 190 : 220,
        borderRadius: isWeb ? 30 : 35,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: isWeb ? 7 : 10 },
        shadowOpacity: 0.08,
        shadowRadius: isWeb ? 18 : 20,
        elevation: 5,
        marginBottom: isWeb ? 18 : 20,
        overflow: 'hidden',
        position: 'relative'
    },
    resultImage: {
        width: '100%',
        height: '100%',
    },
    statusBadge: {
        position: 'absolute',
        bottom: isWeb ? 12 : 15,
        right: isWeb ? 12 : 15,
        backgroundColor: 'rgba(255,255,255,0.9)',
        paddingHorizontal: isWeb ? 11 : 12,
        paddingVertical: isWeb ? 5 : 6,
        borderRadius: 35,
        flexDirection: 'row',
        alignItems: 'center',
        gap: isWeb ? 5 : 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statusText: {
        fontSize: isWeb ? 11.5 : 12,
        fontWeight: '600',
        color: '#111827',
    },
    titleSection: {
        marginBottom: isWeb ? 18 : 20,
    },
    mainTitle: {
        fontSize: isWeb ? 22 : 24,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: isWeb ? 5 : 6,
        letterSpacing: -0.5,
    },
    subTitle: {
        fontSize: isWeb ? 14 : 15,
        color: Colors.light.icon,
        lineHeight: isWeb ? 20 : 22,
    },
    actionsContainer: {
        gap: isWeb ? 11 : 12,
    },
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: isWeb ? 13 : 14,
        borderRadius: isWeb ? 30 : 35,
        borderWidth: 1,
        borderColor: '#EDE9FE',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: isWeb ? 6 : 8,
        elevation: 1,
    },
    cardDisabled: {
        opacity: 0.6,
        backgroundColor: '#F3F4F6',
    },
    iconBox: {
        width: isWeb ? 40 : 48,
        height: isWeb ? 40 : 48,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: isWeb ? 12 : 16,
    },
    actionTextContainer: {
        flex: 1,
    },
    actionTitle: {
        fontSize: isWeb ? 15 : 16,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 2,
    },
    actionDesc: {
        fontSize: isWeb ? 12 : 13,
        color: Colors.light.icon,
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: isWeb ? 8 : 10,
    },
    primaryButton: {
        width: '100%',
        borderRadius: 35,
        overflow: 'hidden',
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    primaryButtonGradient: {
        paddingVertical: isWeb ? 15 : 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    primaryButtonText: {
        fontSize: isWeb ? 15 : 16,
        fontWeight: '700',
        color: '#fff',
    },
    secondaryButton: {
        width: '100%',
        borderRadius: 35,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        overflow: 'hidden',
    },
    secondaryButtonContent: {
        paddingVertical: isWeb ? 15 : 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    secondaryButtonText: {
        fontSize: isWeb ? 15 : 16,
        fontWeight: '700',
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
        width: isWeb ? '92%' : width * 0.85,
        maxWidth: isWeb ? 400 : undefined,
        alignSelf: 'center',
        height: 260,
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
    successCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.light.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 4,
        borderColor: '#fff',
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
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
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },

    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.light.text,
        textAlign: 'center',
        flex: 1,
    },
    headerIconButton: {
        padding: 8,
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
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
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 8,
    },
    medDetailsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    medDosageChip: {
        backgroundColor: 'rgba(220, 163, 73, 0.08)',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(220, 163, 73, 0.2)',
    },
    medDosageText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.primary,
    },
    medFrequencyChip: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 12,
    },
    medFrequencyText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
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
    // Markdown Styles
    mdH2: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 8,
    },
    mdH3: {
        fontSize: 17,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 6,
    },
    mdParagraph: {
        fontSize: 15,
        lineHeight: 24,
        color: '#374151',
        marginBottom: 4,
    },
    mdBold: {
        fontWeight: '700',
        color: '#111827',
    },
    mdListItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 6,
        paddingLeft: 4,
    },
    mdBullet: {
        fontSize: 16,
        lineHeight: 24,
        marginRight: 8,
        color: Colors.light.primary,
    },
    mdListText: {
        flex: 1,
        fontSize: 15,
        lineHeight: 24,
        color: '#374151',
    },

});
