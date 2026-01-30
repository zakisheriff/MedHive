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
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: insets.top + 20, paddingBottom: 140 }
                ]}
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

                    <View style={styles.tipsCard}>
                        <View style={styles.tipItem}>
                            <View style={styles.tipIcon}>
                                <Ionicons name="sunny" size={16} color={Colors.light.primary} />
                            </View>
                            <Text style={styles.tipText}>Ensure good lighting</Text>
                        </View>
                        <View style={styles.tipItem}>
                            <View style={styles.tipIcon}>
                                <Ionicons name="scan" size={16} color={Colors.light.primary} />
                            </View>
                            <Text style={styles.tipText}>Keep document flat</Text>
                        </View>
                        <View style={styles.tipItem}>
                            <View style={styles.tipIcon}>
                                <Ionicons name="eye" size={16} color={Colors.light.primary} />
                            </View>
                            <Text style={styles.tipText}>Text should be readable</Text>
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
        paddingHorizontal: 20,
    },

    // Upload Card
    uploadCard: {
        backgroundColor: Colors.light.primary,
        borderRadius: 28,
        padding: 28,
        marginBottom: 28,
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8,
    },
    cardHeader: {
        alignItems: 'center',
        marginBottom: 28,
    },
    iconWrapper: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
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
        color: 'rgba(255,255,255,0.8)',
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
        backgroundColor: 'rgba(0,0,0,0.15)',
        paddingVertical: 16,
        paddingHorizontal: 18,
        borderRadius: 16,
    },
    optionIcon: {
        width: 40,
        height: 40,
        borderRadius: 12,
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

    // Section Titles
    sectionTitle: {
        fontSize: 13,
        fontWeight: '600',
        color: '#8E8E93',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
        marginLeft: 4,
    },

    // Tips Section
    tipsSection: {
        marginBottom: 24,
    },
    tipsCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 18,
        flexDirection: 'row',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
    },
    tipItem: {
        alignItems: 'center',
        flex: 1,
    },
    tipIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: 'rgba(220,163,73,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    tipText: {
        fontSize: 11,
        fontWeight: '500',
        color: '#8E8E93',
        textAlign: 'center',
    },
});

