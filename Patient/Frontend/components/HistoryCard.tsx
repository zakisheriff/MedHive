import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    LayoutAnimation,
    Platform,
    UIManager,
    Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/theme';
import { HistoryItem, Medicine, LabTest } from '../types/history';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface HistoryCardProps {
    item: HistoryItem;
    onPress?: () => void;
}

export function HistoryCard({ item, onPress }: HistoryCardProps) {
    const [expanded, setExpanded] = useState(false);
    const [animation] = useState(new Animated.Value(0));

    const toggleExpand = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);

        Animated.spring(animation, {
            toValue: expanded ? 0 : 1,
            useNativeDriver: false,
            tension: 65,
            friction: 11,
        }).start();
    };

    const handleShare = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        try {
            const medicinesText = item.medicines?.map(m => `- ${m.name} (${m.dosage})`).join('\n') || '';
            const testsText = item.labTests?.map(t => `- ${t.name}: ${t.value} ${t.unit}`).join('\n') || '';

            let message = `MedHive Medical Record\n`;
            message += `-------------------\n`;
            message += `Clinic: ${item.clinicName || 'N/A'}\n`;
            message += `Date: ${item.date.toLocaleDateString()}\n\n`;

            if (medicinesText) message += `Medications:\n${medicinesText}\n\n`;
            if (testsText) message += `Lab Tests:\n${testsText}\n\n`;
            if (item.notes) message += `Notes: ${item.notes}\n`;

            await Share.share({
                message,
                title: 'Share Medical Record',
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const isPrescription = item.type === 'prescription';
    const iconName = isPrescription ? 'receipt' : 'flask';

    const formatDate = (date: Date) => {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const rotateInterpolate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
    });

    return (
        <TouchableOpacity
            activeOpacity={0.95}
            onPress={toggleExpand}
            style={styles.card}
        >
            {/* Card Header */}
            <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                    <LinearGradient
                        colors={[Colors.light.primary, Colors.light.primaryDark]}
                        style={styles.iconContainer}
                    >
                        <Ionicons name={iconName} size={20} color="#fff" />
                    </LinearGradient>
                    <View style={styles.headerText}>
                        {item.clinicName && (
                            <Text style={styles.clinicNamePrimary} numberOfLines={1}>
                                {item.clinicName}
                            </Text>
                        )}
                        <Text style={styles.recordSubtitle} numberOfLines={1}>
                            {item.type === 'prescription' ? 'Prescription' : 'Lab Report'}
                        </Text>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <Text style={styles.dateText}>{formatDate(item.date)}</Text>
                </View>
            </View>

            {/* Quick Info Preview */}
            <View style={styles.previewContainer}>
                {isPrescription && item.medicines && item.medicines.length > 0 && (
                    <View style={styles.previewRow}>
                        <View style={styles.previewIconBadge}>
                            <Ionicons name="medical" size={12} color={Colors.light.primary} />
                        </View>
                        <Text style={styles.previewText} numberOfLines={1}>
                            {item.medicines[0].name}
                            {item.medicines.length > 1 ? ` +${item.medicines.length - 1} more` : ''}
                        </Text>
                    </View>
                )}
                {!isPrescription && item.labTests && item.labTests.length > 0 && (
                    <View style={styles.previewRow}>
                        <View style={styles.previewIconBadge}>
                            <Ionicons name="analytics" size={12} color={Colors.light.primary} />
                        </View>
                        <Text style={styles.previewText} numberOfLines={1}>
                            {item.labTests[0].name}
                            {item.labTests.length > 1 ? ` +${item.labTests.length - 1} more` : ''}
                        </Text>
                    </View>
                )}
            </View>

            {/* Expandable Details */}
            {expanded && (
                <View style={styles.detailsContainer}>
                    {/* Medicines Section */}
                    {isPrescription && item.medicines && item.medicines.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Medications</Text>
                            {item.medicines.map((medicine, index) => (
                                <MedicineItem key={index} medicine={medicine} />
                            ))}
                        </View>
                    )}

                    {/* Lab Tests Section */}
                    {!isPrescription && item.labTests && item.labTests.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Test Results</Text>
                            {item.labTests.map((test, index) => (
                                <LabTestItem key={index} test={test} />
                            ))}
                        </View>
                    )}

                    {/* Prescription Image */}
                    {isPrescription && item.imageUri && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Prescription</Text>
                            <Image
                                source={{ uri: item.imageUri }}
                                style={styles.prescriptionImage}
                                contentFit="cover"
                                transition={1000}
                            />
                        </View>
                    )}

                    {/* Notes */}
                    {item.notes && (
                        <View style={styles.notesContainer}>
                            <Ionicons name="document-text-outline" size={16} color={Colors.light.primary} />
                            <Text style={styles.notesText}>{item.notes}</Text>
                        </View>
                    )}

                    {/* Actions */}
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                onPress?.();
                            }}
                        >
                            <Ionicons name="eye-outline" size={16} color={Colors.light.primary} />
                            <Text style={styles.actionText}>View Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.shareButton]}
                            onPress={handleShare}
                        >
                            <Ionicons name="share-outline" size={16} color="#fff" />
                            <Text style={[styles.actionText, styles.shareText]}>Share</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Expand Indicator */}
            <View style={styles.expandIndicator}>
                <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
                    <Ionicons
                        name="chevron-down"
                        size={18}
                        color={Colors.light.primary}
                    />
                </Animated.View>
            </View>
        </TouchableOpacity>
    );
}

function MedicineItem({ medicine }: { medicine: Medicine }) {
    return (
        <View style={styles.medicineCard}>
            <View style={styles.medicineHeader}>
                <Text style={styles.medicineName}>{medicine.name}</Text>
                <View style={styles.dosageBadge}>
                    <Text style={styles.dosageText}>{medicine.dosage}</Text>
                </View>
            </View>
            <View style={styles.medicineDetails}>
                <View style={styles.detailItem}>
                    <Ionicons name="time-outline" size={14} color="#8E8E93" />
                    <Text style={styles.detailText}>{medicine.frequency}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Ionicons name="calendar-outline" size={14} color="#8E8E93" />
                    <Text style={styles.detailText}>{medicine.duration}</Text>
                </View>
            </View>
        </View>
    );
}

function LabTestItem({ test }: { test: LabTest }) {
    const statusColor =
        test.status === 'normal' ? '#10B981' :
            test.status === 'critical' ? '#EF4444' : '#F59E0B';

    return (
        <View style={styles.labTestCard}>
            <View style={styles.labTestHeader}>
                <Text style={styles.labTestName}>{test.name}</Text>
                <View style={[styles.statusIndicator, { backgroundColor: `${statusColor}15` }]}>
                    <View style={[styles.statusDotSmall, { backgroundColor: statusColor }]} />
                    <Text style={[styles.statusTextSmall, { color: statusColor }]}>
                        {test.status}
                    </Text>
                </View>
            </View>
            <View style={styles.labTestValue}>
                <Text style={styles.valueText}>{test.value}</Text>
                <Text style={styles.unitText}>{test.unit}</Text>
            </View>
            {test.referenceRange && (
                <Text style={styles.referenceText}>Ref: {test.referenceRange}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 18,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F1F5F9',

    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        flex: 1,
        marginRight: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    headerText: {
        flex: 1,
        justifyContent: 'center',
    },
    clinicNamePrimary: {
        fontSize: 18,
        fontWeight: '800',
        color: Colors.light.text,
        letterSpacing: -0.5,
        marginBottom: 2,
    },
    recordSubtitle: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    headerRight: {
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
    },
    dateText: {
        fontSize: 13,
        color: '#8E8E93',
        fontWeight: '500',
    },
    previewContainer: {
        marginTop: 14,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    previewRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 8,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    previewIconBadge: {
        width: 22,
        height: 22,
        borderRadius: 8,
        backgroundColor: 'rgba(220,163,73,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    previewText: {
        fontSize: 13,
        color: '#475569',
        fontWeight: '600',
    },
    detailsContainer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    medicineCard: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        borderLeftWidth: 3,
        borderLeftColor: Colors.light.primary,
    },
    medicineHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    medicineName: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.light.text,
        flex: 1,
    },
    dosageBadge: {
        backgroundColor: Colors.light.primary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 17.5,
    },
    dosageText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
    },
    medicineDetails: {
        flexDirection: 'row',
        gap: 16,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    detailText: {
        fontSize: 12,
        color: '#6B7280',
    },
    labTestCard: {
        backgroundColor: '#F8FAFC',
        borderRadius: 12,
        padding: 14,
        marginBottom: 10,
        borderLeftWidth: 3,
        borderLeftColor: '#10B981',
    },
    labTestHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    labTestName: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.light.text,
        flex: 1,
    },
    statusIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        height: 24,
        borderRadius: 12,
        gap: 4,
    },
    statusDotSmall: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusTextSmall: {
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    labTestValue: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 6,
        marginBottom: 4,
    },
    valueText: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.light.text,
    },
    unitText: {
        fontSize: 14,
        color: '#6B7280',
    },
    referenceText: {
        fontSize: 11,
        color: '#8E8E93',
    },
    notesContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFF7ED',
        borderRadius: 12,
        padding: 12,
        gap: 8,
        marginBottom: 16,
        borderLeftWidth: 3,
        borderLeftColor: Colors.light.primary,
    },
    notesText: {
        flex: 1,
        fontSize: 13,
        color: '#92400E',
        lineHeight: 18,
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 8,
    },
    actionButton: {
        flex: 1,
        height: 35,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 17.5,
        backgroundColor: '#F8FAFC',
        gap: 6,
    },
    shareButton: {
        backgroundColor: Colors.light.primary,
    },
    actionText: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.light.primary,
    },
    shareText: {
        color: '#fff',
    },
    expandIndicator: {
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    prescriptionImage: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginTop: 8,
        backgroundColor: '#F1F5F9',
    },
});
