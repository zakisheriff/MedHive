import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Animated,
    Dimensions,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type DocumentType = 'prescription' | 'labReport';

interface ExtractedItem {
    name: string;
    value: string;
    subtext?: string;
    status?: 'normal' | 'high' | 'low';
}

// Mock data
const MOCK_PRESCRIPTION: ExtractedItem[] = [
    { name: 'Amoxicillin 500mg', value: '3x daily', subtext: 'After meals • 7 days' },
    { name: 'Paracetamol 650mg', value: 'As needed', subtext: 'Max 4 per day' },
    { name: 'Omeprazole 20mg', value: '1x morning', subtext: 'Before breakfast • 14 days' },
];

const MOCK_LAB_REPORT: ExtractedItem[] = [
    { name: 'Hemoglobin', value: '14.2 g/dL', subtext: 'Reference: 12-16', status: 'normal' },
    { name: 'Blood Glucose', value: '105 mg/dL', subtext: 'Reference: 70-100', status: 'high' },
    { name: 'Cholesterol', value: '185 mg/dL', subtext: 'Reference: <200', status: 'normal' },
    { name: 'Vitamin D', value: '18 ng/mL', subtext: 'Reference: 30-100', status: 'low' },
];

export default function UploadScreen() {
    const insets = useSafeAreaInsets();
    const [docType, setDocType] = useState<DocumentType>('prescription');
    const [image, setImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [results, setResults] = useState<ExtractedItem[] | null>(null);

    // Animations
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    const startPulse = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, { toValue: 1.05, duration: 800, useNativeDriver: true }),
                Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
            ])
        ).start();
    };

    const pickImage = async (source: 'camera' | 'gallery') => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        let result;
        if (source === 'camera') {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') return;
            result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 });
        } else {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') return;
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 0.8
            });
        }

        if (!result.canceled && result.assets[0]) {
            setImage(result.assets[0].uri);
            setResults(null);
        }
    };

    const handleExtract = async () => {
        if (!image) return;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setIsProcessing(true);
        startPulse();

        // Animate progress
        Animated.timing(progressAnim, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: false,
        }).start();

        await new Promise(resolve => setTimeout(resolve, 2500));

        pulseAnim.stopAnimation();
        pulseAnim.setValue(1);
        progressAnim.setValue(0);

        setResults(docType === 'prescription' ? MOCK_PRESCRIPTION : MOCK_LAB_REPORT);
        setIsProcessing(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    const reset = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setImage(null);
        setResults(null);
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'high': return '#FF3B30';
            case 'low': return '#FF9500';
            default: return '#34C759';
        }
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#F8FAFC', '#FFFFFF', '#F8FAFC']}
                style={StyleSheet.absoluteFill}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: insets.top + 16, paddingBottom: 140 }
                ]}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Header */}
                <View style={styles.header}>
                    <Text style={styles.greeting}>Upload</Text>
                    <Text style={styles.title}>Medical Document</Text>
                </View>

                {/* Document Type Selector - Premium Segmented Control */}
                <View style={styles.segmentContainer}>
                    <View style={styles.segmentBackground}>
                        <Animated.View
                            style={[
                                styles.segmentIndicator,
                                { transform: [{ translateX: docType === 'prescription' ? 0 : SCREEN_WIDTH / 2 - 28 }] }
                            ]}
                        />
                        <TouchableOpacity
                            style={styles.segmentButton}
                            onPress={() => { Haptics.selectionAsync(); setDocType('prescription'); }}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name={docType === 'prescription' ? 'document-text' : 'document-text-outline'}
                                size={20}
                                color={docType === 'prescription' ? Colors.light.primary : '#8E8E93'}
                            />
                            <Text style={[styles.segmentText, docType === 'prescription' && styles.segmentTextActive]}>
                                Prescription
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.segmentButton}
                            onPress={() => { Haptics.selectionAsync(); setDocType('labReport'); }}
                            activeOpacity={0.8}
                        >
                            <Ionicons
                                name={docType === 'labReport' ? 'flask' : 'flask-outline'}
                                size={20}
                                color={docType === 'labReport' ? Colors.light.primary : '#8E8E93'}
                            />
                            <Text style={[styles.segmentText, docType === 'labReport' && styles.segmentTextActive]}>
                                Lab Report
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Upload Card */}
                {!image ? (
                    <View style={styles.uploadCard}>
                        <LinearGradient
                            colors={['#FFFFFF', '#FAFAFA']}
                            style={styles.uploadCardGradient}
                        >
                            {/* Decorative circles */}
                            <View style={[styles.decorCircle, styles.decorCircle1]} />
                            <View style={[styles.decorCircle, styles.decorCircle2]} />

                            <View style={styles.uploadIconWrapper}>
                                <LinearGradient
                                    colors={[Colors.light.primary, '#E8A849']}
                                    style={styles.uploadIconGradient}
                                >
                                    <Ionicons name="document-attach" size={32} color="#fff" />
                                </LinearGradient>
                            </View>

                            <Text style={styles.uploadTitle}>
                                {docType === 'prescription' ? 'Upload Prescription' : 'Upload Lab Report'}
                            </Text>
                            <Text style={styles.uploadSubtitle}>
                                Take a photo or select from your gallery
                            </Text>

                            <View style={styles.uploadActions}>
                                <TouchableOpacity
                                    style={styles.uploadActionBtn}
                                    onPress={() => pickImage('camera')}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.uploadActionIcon}>
                                        <Ionicons name="camera" size={24} color={Colors.light.primary} />
                                    </View>
                                    <Text style={styles.uploadActionLabel}>Camera</Text>
                                </TouchableOpacity>

                                <View style={styles.uploadActionDivider} />

                                <TouchableOpacity
                                    style={styles.uploadActionBtn}
                                    onPress={() => pickImage('gallery')}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.uploadActionIcon}>
                                        <Ionicons name="images" size={24} color={Colors.light.primary} />
                                    </View>
                                    <Text style={styles.uploadActionLabel}>Gallery</Text>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </View>
                ) : (
                    /* Preview Card */
                    <View style={styles.previewCard}>
                        <Image source={{ uri: image }} style={styles.previewImage} />

                        {/* Overlay gradient */}
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.6)']}
                            style={styles.previewOverlay}
                        >
                            <View style={styles.previewMeta}>
                                <View style={styles.previewBadge}>
                                    <Ionicons
                                        name={docType === 'prescription' ? 'document-text' : 'flask'}
                                        size={14}
                                        color="#fff"
                                    />
                                    <Text style={styles.previewBadgeText}>
                                        {docType === 'prescription' ? 'Prescription' : 'Lab Report'}
                                    </Text>
                                </View>
                                <TouchableOpacity onPress={reset} style={styles.removeBtn}>
                                    <Ionicons name="trash-outline" size={20} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>

                        {/* Processing Overlay */}
                        {isProcessing && (
                            <BlurView intensity={80} tint="light" style={styles.processingOverlay}>
                                <Animated.View style={[styles.processingIcon, { transform: [{ scale: pulseAnim }] }]}>
                                    <LinearGradient
                                        colors={[Colors.light.primary, '#E8A849']}
                                        style={styles.processingIconGradient}
                                    >
                                        <Ionicons name="scan" size={36} color="#fff" />
                                    </LinearGradient>
                                </Animated.View>
                                <Text style={styles.processingTitle}>Analyzing Document</Text>
                                <Text style={styles.processingSubtitle}>Powered by Gemini AI</Text>

                                {/* Progress bar */}
                                <View style={styles.progressContainer}>
                                    <Animated.View
                                        style={[
                                            styles.progressBar,
                                            {
                                                width: progressAnim.interpolate({
                                                    inputRange: [0, 1],
                                                    outputRange: ['0%', '100%']
                                                })
                                            }
                                        ]}
                                    />
                                </View>
                            </BlurView>
                        )}
                    </View>
                )}

                {/* Extract Button */}
                {image && !results && !isProcessing && (
                    <TouchableOpacity
                        style={styles.extractBtn}
                        onPress={handleExtract}
                        activeOpacity={0.9}
                    >
                        <LinearGradient
                            colors={[Colors.light.primary, '#D4983B']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.extractBtnGradient}
                        >
                            <Ionicons name="sparkles" size={22} color="#fff" />
                            <Text style={styles.extractBtnText}>Extract with AI</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                )}

                {/* Results Section */}
                {results && (
                    <View style={styles.resultsSection}>
                        <View style={styles.resultsHeader}>
                            <View style={styles.resultsHeaderLeft}>
                                <View style={styles.successIcon}>
                                    <Ionicons name="checkmark" size={16} color="#fff" />
                                </View>
                                <Text style={styles.resultsTitle}>Extracted Data</Text>
                            </View>
                            <Text style={styles.resultsCount}>{results.length} items</Text>
                        </View>

                        <View style={styles.resultsCard}>
                            {results.map((item, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.resultItem,
                                        index === results.length - 1 && styles.resultItemLast
                                    ]}
                                >
                                    <View style={styles.resultItemMain}>
                                        <Text style={styles.resultName}>{item.name}</Text>
                                        <Text style={styles.resultSubtext}>{item.subtext}</Text>
                                    </View>
                                    <View style={styles.resultValueContainer}>
                                        {item.status && (
                                            <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
                                        )}
                                        <Text style={[
                                            styles.resultValue,
                                            item.status && { color: getStatusColor(item.status) }
                                        ]}>
                                            {item.value}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.resultActions}>
                            <TouchableOpacity
                                style={styles.primaryActionBtn}
                                activeOpacity={0.9}
                                onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
                            >
                                <LinearGradient
                                    colors={[Colors.light.primary, '#D4983B']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.primaryActionGradient}
                                >
                                    <Ionicons name="bookmark" size={20} color="#fff" />
                                    <Text style={styles.primaryActionText}>Save to History</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.secondaryActionBtn}
                                onPress={reset}
                                activeOpacity={0.7}
                            >
                                <Ionicons name="add-circle-outline" size={20} color={Colors.light.primary} />
                                <Text style={styles.secondaryActionText}>New Upload</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },

    // Header
    header: {
        marginBottom: 24,
    },
    greeting: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.light.primary,
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1C1C1E',
        letterSpacing: -0.5,
    },

    // Segment Control
    segmentContainer: {
        marginBottom: 24,
    },
    segmentBackground: {
        flexDirection: 'row',
        backgroundColor: '#F2F2F7',
        borderRadius: 16,
        padding: 4,
        position: 'relative',
    },
    segmentIndicator: {
        position: 'absolute',
        left: 4,
        top: 4,
        bottom: 4,
        width: '50%',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    segmentButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        gap: 8,
        zIndex: 1,
    },
    segmentText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#8E8E93',
    },
    segmentTextActive: {
        color: Colors.light.primary,
    },

    // Upload Card
    uploadCard: {
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 24,
        elevation: 5,
    },
    uploadCardGradient: {
        padding: 32,
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    decorCircle: {
        position: 'absolute',
        borderRadius: 100,
        backgroundColor: 'rgba(220, 163, 73, 0.08)',
    },
    decorCircle1: {
        width: 200,
        height: 200,
        top: -100,
        right: -50,
    },
    decorCircle2: {
        width: 150,
        height: 150,
        bottom: -50,
        left: -30,
    },
    uploadIconWrapper: {
        marginBottom: 20,
    },
    uploadIconGradient: {
        width: 80,
        height: 80,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
    },
    uploadTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 8,
    },
    uploadSubtitle: {
        fontSize: 15,
        color: '#8E8E93',
        marginBottom: 28,
    },
    uploadActions: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    uploadActionBtn: {
        flex: 1,
        alignItems: 'center',
        gap: 10,
    },
    uploadActionIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: 'rgba(220, 163, 73, 0.12)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadActionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.primary,
    },
    uploadActionDivider: {
        width: 1,
        height: 60,
        backgroundColor: '#E5E5EA',
    },

    // Preview Card
    previewCard: {
        borderRadius: 24,
        overflow: 'hidden',
        height: 280,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 5,
    },
    previewImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#E5E5EA',
    },
    previewOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingVertical: 16,
        paddingHorizontal: 20,
    },
    previewMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    previewBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    previewBadgeText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#fff',
    },
    removeBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Processing
    processingOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24,
    },
    processingIcon: {
        marginBottom: 16,
    },
    processingIconGradient: {
        width: 72,
        height: 72,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    processingTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 4,
    },
    processingSubtitle: {
        fontSize: 14,
        color: '#8E8E93',
        marginBottom: 24,
    },
    progressContainer: {
        width: '60%',
        height: 4,
        backgroundColor: '#E5E5EA',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: Colors.light.primary,
    },

    // Extract Button
    extractBtn: {
        marginTop: 20,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 5,
    },
    extractBtnGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        gap: 10,
    },
    extractBtnText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#fff',
    },

    // Results
    resultsSection: {
        marginTop: 24,
    },
    resultsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    resultsHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    successIcon: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#34C759',
        alignItems: 'center',
        justifyContent: 'center',
    },
    resultsTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1C1C1E',
    },
    resultsCount: {
        fontSize: 14,
        color: '#8E8E93',
        fontWeight: '500',
    },
    resultsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 3,
    },
    resultItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    resultItemLast: {
        borderBottomWidth: 0,
    },
    resultItemMain: {
        flex: 1,
        marginRight: 16,
    },
    resultName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1C1E',
        marginBottom: 4,
    },
    resultSubtext: {
        fontSize: 13,
        color: '#8E8E93',
    },
    resultValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    resultValue: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.light.primary,
    },

    // Action Buttons
    resultActions: {
        marginTop: 20,
        gap: 12,
    },
    primaryActionBtn: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 4,
    },
    primaryActionGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        gap: 10,
    },
    primaryActionText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    secondaryActionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        gap: 8,
    },
    secondaryActionText: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.light.primary,
    },
});
