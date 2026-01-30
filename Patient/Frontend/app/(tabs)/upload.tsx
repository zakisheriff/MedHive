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
                            Upload an image to extract medicine name, dosage, and duration
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
                                <Ionicons name="medical" size={22} color={Colors.light.primary} />
                            </View>
                            <Text style={styles.optionText}>Prescription Reader</Text>
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
                            <Text style={styles.optionText}>Lab Report Analyzer</Text>
                            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.5)" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Tips Section */}
                <View style={styles.tipsSection}>
                    <Text style={styles.sectionTitle}>Tips for Best Results</Text>
                    <View style={styles.tipsRow}>
                        <View style={styles.tipItem}>
                            <View style={styles.tipIcon}>
                                <Ionicons name="sunny-outline" size={20} color={Colors.light.primary} />
                            </View>
                            <Text style={styles.tipText}>Good lighting</Text>
                        </View>
                        <View style={styles.tipItem}>
                            <View style={styles.tipIcon}>
                                <Ionicons name="scan-outline" size={20} color={Colors.light.primary} />
                            </View>
                            <Text style={styles.tipText}>Keep flat</Text>
                        </View>
                        <View style={styles.tipItem}>
                            <View style={styles.tipIcon}>
                                <Ionicons name="text-outline" size={20} color={Colors.light.primary} />
                            </View>
                            <Text style={styles.tipText}>Clear text</Text>
                        </View>
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
    },

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
    optionText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },

    // Tips Section
    tipsSection: {
        marginTop: 32,
    },
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#8E8E93',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 16,
        textAlign: 'center',
    },
    tipsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    tipItem: {
        alignItems: 'center',
        flex: 1,
    },
    tipIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(220,163,73,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    tipText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#8E8E93',
        textAlign: 'center',
    },
});


