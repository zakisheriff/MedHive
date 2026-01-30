import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors } from '../../constants/theme';
import { ProfileAvatar } from '../../components/ProfileAvatar';

export default function UploadScreen() {
    const insets = useSafeAreaInsets();

    const handleUpload = async (type: 'prescription' | 'labReport') => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Show options
        Alert.alert(
            type === 'prescription' ? 'Upload Prescription' : 'Upload Lab Report',
            'Choose how you want to upload',
            [
                {
                    text: 'Camera',
                    onPress: async () => {
                        const { status } = await ImagePicker.requestCameraPermissionsAsync();
                        if (status !== 'granted') {
                            Alert.alert('Permission Required', 'Please allow camera access.');
                            return;
                        }
                        const result = await ImagePicker.launchCameraAsync({
                            allowsEditing: true,
                            quality: 0.8,
                        });
                        if (!result.canceled) {
                            // Navigate to results or process
                            console.log('Image captured:', result.assets[0].uri);
                        }
                    }
                },
                {
                    text: 'Gallery',
                    onPress: async () => {
                        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                        if (status !== 'granted') {
                            Alert.alert('Permission Required', 'Please allow photo library access.');
                            return;
                        }
                        const result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ImagePicker.MediaTypeOptions.Images,
                            allowsEditing: true,
                            quality: 0.8,
                        });
                        if (!result.canceled) {
                            console.log('Image selected:', result.assets[0].uri);
                        }
                    }
                },
                { text: 'Cancel', style: 'cancel' }
            ]
        );
    };

    return (
        <View style={styles.container}>
            {/* Header with Profile Avatar */}
            <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                <Text style={styles.headerTitle}>Upload</Text>
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

                {/* Tips placed BELOW card as usual */}
                <View style={styles.tipsRow}>
                    <View style={styles.tipChip}>
                        <Ionicons name="sunny" size={16} color={Colors.light.primary} />
                        <Text style={styles.tipText}>Good Lighting</Text>
                    </View>
                    <View style={styles.tipChip}>
                        <Ionicons name="phone-portrait-outline" size={16} color={Colors.light.primary} />
                        <Text style={styles.tipText}>Keep Steady</Text>
                    </View>
                    <View style={styles.tipChip}>
                        <Ionicons name="eye-outline" size={16} color={Colors.light.primary} />
                        <Text style={styles.tipText}>Clear Text</Text>
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
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 8,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.light.text,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 40,
    },
    // Optional: add decorative styles here if needed later
    uploadCard: {
        backgroundColor: Colors.light.primary,
        borderRadius: 32,
        padding: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 4,
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
    tipsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        marginTop: 24,
    },
    tipChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 4,
        elevation: 1,
    },
    tipText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#6B7280',
    },
});


