import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Platform,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/theme';
import { generateMockHistory } from '../../utils/historyUtils';
import { HistoryItem, Medicine, LabTest } from '../../types/history';
import { ImagePreviewModal } from '../../components/ImagePreviewModal';

export default function HistoryDetailScreen() {
    const { id } = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    const [previewVisible, setPreviewVisible] = useState(false);

    const item = generateMockHistory().find((i: HistoryItem) => i.id === id);

    if (!item) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Record not found</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={{ color: Colors.light.primary, marginTop: 10 }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const isPrescription = item.type === 'prescription';

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#F8FAFC', '#FFFFFF']}
                style={StyleSheet.absoluteFill}
            />

            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        router.back();
                    }}
                >
                    <Ionicons name="chevron-back" size={24} color={Colors.light.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Details</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.heroCard}>
                    <LinearGradient
                        colors={[Colors.light.primary, Colors.light.primaryDark]}
                        style={styles.heroIconContainer}
                    >
                        <Ionicons name={isPrescription ? 'receipt' : 'flask'} size={32} color="#fff" />
                    </LinearGradient>
                    <Text style={styles.title}>{isPrescription ? 'Prescription' : 'Lab Report'}</Text>
                    <Text style={styles.date}>{item.date.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}</Text>
                </View>

                <View style={[styles.section, { marginBottom: 10 }]}>
                    <View style={styles.clinicHighlightCard}>
                        <View style={styles.clinicIconContainer}>
                            <Ionicons name="medical" size={20} color={Colors.light.primary} />
                        </View>
                        <View>
                            <Text style={styles.infoLabel}>Facility / Clinic</Text>
                            <Text style={styles.clinicNameHighlight}>{item.clinicName || 'Not specified'}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{isPrescription ? 'Medications' : 'Test Results'}</Text>

                    {isPrescription ? (
                        item.medicines?.map((med: Medicine, index: number) => (
                            <View key={index} style={styles.detailCard}>
                                <View style={styles.detailCardHeader}>
                                    <Text style={styles.detailCardTitle}>{med.name}</Text>
                                    <View style={styles.pillBadge}>
                                        <Text style={styles.pillText}>{med.dosage}</Text>
                                    </View>
                                </View>
                                <View style={styles.detailRow}>
                                    <Ionicons name="time-outline" size={16} color="#64748B" />
                                    <Text style={styles.detailSubText}>{med.frequency}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Ionicons name="calendar-outline" size={16} color="#64748B" />
                                    <Text style={styles.detailSubText}>{med.duration}</Text>
                                </View>
                            </View>
                        ))
                    ) : (
                        item.labTests?.map((test: LabTest, index: number) => (
                            <View key={index} style={styles.detailCard}>
                                <View style={styles.detailCardHeader}>
                                    <Text style={styles.detailCardTitle}>{test.name}</Text>
                                    <Text style={[styles.resultValue, { color: test.status === 'normal' ? '#10B981' : '#EF4444' }]}>
                                        {test.value} {test.unit}
                                    </Text>
                                </View>
                                <Text style={styles.referenceRange}>Ref: {test.referenceRange}</Text>
                            </View>
                        ))
                    )}
                </View>

                {item.notes && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Notes</Text>
                        <View style={styles.notesBox}>
                            <Text style={styles.notesText}>{item.notes}</Text>
                        </View>
                    </View>
                )}

                {item.imageUri && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Original Document</Text>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => setPreviewVisible(true)}
                        >
                            <Image
                                source={{ uri: item.imageUri }}
                                style={styles.documentImage}
                                contentFit="contain"
                            />
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>

            <ImagePreviewModal
                isVisible={previewVisible}
                imageUri={item?.imageUri || null}
                onClose={() => setPreviewVisible(false)}
            />
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 15,
        backgroundColor: 'transparent',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.light.text,
    },
    scrollView: {
        flex: 1,
    },
    heroCard: {
        alignItems: 'center',
        padding: 30,
    },
    heroIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: Colors.light.text,
        marginBottom: 8,
    },
    date: {
        fontSize: 15,
        color: '#64748B',
        fontWeight: '500',
    },
    clinicHighlightCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 20,
        gap: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    clinicIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
        justifyContent: 'center',
    },
    clinicNameHighlight: {
        fontSize: 18,
        fontWeight: '800',
        color: Colors.light.text,
        letterSpacing: -0.5,
    },
    infoLabel: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 15,
    },
    detailCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    detailCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    detailCardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.light.text,
        flex: 1,
    },
    pillBadge: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 12,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pillText: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.light.primary,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },
    detailSubText: {
        fontSize: 14,
        color: '#64748B',
    },
    resultValue: {
        fontSize: 17,
        fontWeight: '800',
    },
    referenceRange: {
        fontSize: 12,
        color: '#94A3B8',
        marginTop: 4,
    },
    notesBox: {
        backgroundColor: '#FFF7ED',
        padding: 16,
        borderRadius: 16,
        borderLeftWidth: 4,
        borderLeftColor: Colors.light.primary,
    },
    notesText: {
        fontSize: 15,
        color: '#92400E',
        lineHeight: 22,
    },
    documentImage: {
        width: '100%',
        height: 400,
        backgroundColor: '#F1F5F9',
        borderRadius: 20,
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    errorText: {
        fontSize: 16,
        color: '#64748B',
        fontWeight: '600',
    }
});
