import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { useAlert } from '../../context/AlertContext';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '../../constants/theme';
import { ProfileAvatar } from '../../components/ProfileAvatar';

export default function UploadScreen() {
    const insets = useSafeAreaInsets();
    const { showAlert } = useAlert();

    const handleUpload = async (type: 'prescription' | 'labReport') => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Show options
        showAlert({
            title: type === 'prescription' ? 'Upload Prescription' : 'Upload Lab Report',
            message: 'Choose how you want to upload',
            buttons: [
                {
                    text: 'Camera',
                    onPress: async () => {
                        const { status } = await ImagePicker.requestCameraPermissionsAsync();
                        if (status !== 'granted') {
                            showAlert({
                                title: 'Permission Required',
                                message: 'Please allow camera access.',
                                buttons: [{ text: 'OK' }]
                            });
                            return;
                        }
                        const result = await ImagePicker.launchCameraAsync({
                            allowsEditing: true,
                            quality: 0.8,
                        });
                        if (!result.canceled) {
                            router.push({
                                pathname: '/prescription-result',
                                params: { imageUri: result.assets[0].uri }
                            } as any);
                        }
                    }
                },
                {
                    text: 'Gallery',
                    onPress: async () => {
                        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                        if (status !== 'granted') {
                            showAlert({
                                title: 'Permission Required',
                                message: 'Please allow photo library access.',
                                buttons: [{ text: 'OK' }]
                            });
                            return;
                        }
                        const result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            quality: 0.8,
                        });
                        if (!result.canceled) {
                            router.push({
                                pathname: '/prescription-result',
                                params: { imageUri: result.assets[0].uri }
                            } as any);
                        }
                    }
                },
                { text: 'Cancel', style: 'cancel' }
            ]
        });
    };

    return (
        <View style={styles.container}>
            {/* Header with Profile Avatar */}
            <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                <View>
                    <Text style={styles.headerTitle}>Upload</Text>
                    <Text style={styles.headerSubtitle}>AI Scan & Extract</Text>
                </View>
                <ProfileAvatar size={34} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Main Upload Card */}
                <View style={styles.uploadCard}>
                    {/* Header */}
                    <View style={styles.cardHeader}>
                        <View style={styles.iconWrapper}>
                            <Ionicons name="document-text" size={28} color="#fff" />
                        </View>
                        <Text style={styles.cardTitle}>Upload Your Health Record</Text>
                        <Text style={styles.cardSubtitle}>
                            Upload an Image to Extract Medicine Name, Dosage, and Duration
                        </Text>
                    </View>

                    {/* Upload Options */}
                    <View style={styles.optionsContainer}>
                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => handleUpload('prescription')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.optionIcon}>
                                <Ionicons name="receipt-outline" size={22} color={Colors.light.primary} />
                            </View>
                            <View style={styles.optionContent}>
                                <Text style={styles.optionText}>Prescription Reader</Text>
                                <Text style={styles.optionSubtext}>Extract Medicine Details</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.optionButton}
                            onPress={() => handleUpload('labReport')}
                            activeOpacity={0.8}
                        >
                            <View style={styles.optionIcon}>
                                <Ionicons name="flask" size={22} color={Colors.light.primary} />
                            </View>
                            <View style={styles.optionContent}>
                                <Text style={styles.optionText}>Lab Report Analyzer</Text>
                                <Text style={styles.optionSubtext}>Analyze Test Results</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Single Requirement Note for better results */}
                <View style={styles.tipsNote}>
                    <Ionicons name="alert-circle" size={18} color={Colors.light.primary} />
                    <Text style={styles.tipsNoteText}>
                        For better result, ensure good lighting and steady scan.
                    </Text>
                </View>

                {/* Scan Process Guide (Individual pill icons, moved below !) */}
                <View style={styles.processContainer}>
                    <View style={styles.processItem}>
                        <View style={styles.processIcon}>
                            <Ionicons name="camera" size={18} color={Colors.light.primary} />
                        </View>
                        <Text style={styles.processText}>Snap It</Text>
                    </View>
                    <View style={styles.arrowWrapper}>
                        <Ionicons name="arrow-forward" size={14} color="#C7C7CC" />
                    </View>
                    <View style={styles.processItem}>
                        <View style={styles.processIcon}>
                            <Ionicons name="scan" size={18} color={Colors.light.primary} />
                        </View>
                        <Text style={styles.processText}>AI Scan</Text>
                    </View>
                    <View style={styles.arrowWrapper}>
                        <Ionicons name="arrow-forward" size={14} color="#C7C7CC" />
                    </View>
                    <View style={styles.processItem}>
                        <View style={styles.processIcon}>
                            <Ionicons name="save-outline" size={18} color={Colors.light.primary} />
                        </View>
                        <Text style={styles.processText}>Save</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingBottom: 12,
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 2,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#8E8E93',
        fontWeight: '500',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 60,
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
    },
    processContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center',
        gap: 12,
        marginTop: 16, // Space below the ! note
    },
    processItem: {
        alignItems: 'center',
        gap: 8,
    },
    processIcon: {
        width: 44,
        height: 44,
        borderRadius: 22, // Full pill/circle
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrowWrapper: {
        height: 44, // Match icon height for perfect vertical centering
        justifyContent: 'center',
    },
    processText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#8E8E93',
    },
    // Optional: add decorative styles here if needed later
    uploadCard: {
        backgroundColor: Colors.light.primary,
        borderRadius: 32,
        padding: 32,
    },
    cardHeader: {
        alignItems: 'center',
        marginBottom: 28,
    },
    iconWrapper: {
        width: 56,
        height: 56,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
        textAlign: 'center',
    },
    cardSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.85)',
        textAlign: 'center',
        lineHeight: 20,
    },

    // Options
    optionsContainer: {
        gap: 12,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.12)',
        paddingVertical: 16,
        paddingHorizontal: 18,
        borderRadius: 24,
    },
    optionIcon: {
        width: 40,
        height: 40,
        borderRadius: 14,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    optionContent: {
        flex: 1,
    },
    optionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    optionSubtext: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
    },

    // Card Divider
    cardDivider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginVertical: 20,
    },

    // Quick Actions
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 24,
    },
    quickActionBtn: {
        alignItems: 'center',
        gap: 6,
    },
    quickActionText: {
        fontSize: 12,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.9)',
    },

    // Tips
    tipsNote: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 20,
        gap: 10,
        marginTop: 24,
        alignSelf: 'center',
    },
    tipsNoteText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#6B7280',
    },
});


