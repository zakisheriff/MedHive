import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import { AccessRecord } from '../types/access';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

interface AccessCardProps {
    record: AccessRecord;
    onUpdateStatus: (id: string, action: 'approve_1h' | 'approve_full' | 'revoke') => void;
}

export function AccessCard({ record, onUpdateStatus }: AccessCardProps) {
    const isPending = record.status === 'pending';
    const isActive = record.status === 'active';

    const handleAction = (action: 'approve_1h' | 'approve_full' | 'revoke') => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onUpdateStatus(record.id, action);
    };

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.clinicInfo}>
                    <View style={styles.logoContainer}>
                        <LinearGradient
                            colors={isPending ? ['#F59E0B', '#D97706'] : ['#10B981', '#059669']}
                            style={styles.logoBackground}
                        >
                            <Ionicons
                                name={isPending ? "notifications-outline" : "checkmark-circle-outline"}
                                size={24}
                                color="#fff"
                            />
                        </LinearGradient>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.clinicName}>{record.clinicName}</Text>
                        <Text style={styles.doctorName}>{record.doctorName}</Text>
                        {record.clinicAddress && (
                            <Text style={styles.address} numberOfLines={1}>{record.clinicAddress}</Text>
                        )}
                    </View>
                </View>
                {isActive && (
                    <View style={[styles.statusBadge, record.duration === '1h' ? styles.limitedBadge : styles.fullBadge]}>
                        <Text style={[styles.statusText, record.duration === '1h' ? styles.limitedText : styles.fullText]}>
                            {record.duration === '1h' ? '1 Hour' : 'Full Access'}
                        </Text>
                    </View>
                )}
            </View>

            {record.expiryDate && isActive && record.duration === '1h' && (
                <View style={styles.expiryContainer}>
                    <Ionicons name="time-outline" size={14} color="#D97706" />
                    <Text style={styles.expiryText}>Expires soon</Text>
                </View>
            )}

            <View style={styles.actionRow}>
                {isPending ? (
                    <>
                        <TouchableOpacity
                            style={[styles.button, styles.approveBtn]}
                            onPress={() => handleAction('approve_1h')}
                        >
                            <Ionicons name="time-outline" size={16} color="#fff" />
                            <Text style={styles.buttonText}>1 Hour</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.approveBtn]}
                            onPress={() => handleAction('approve_full')}
                        >
                            <Ionicons name="shield-checkmark-outline" size={16} color="#fff" />
                            <Text style={styles.buttonText}>Full Access</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.rejectBtn]}
                            onPress={() => handleAction('revoke')}
                        >
                            <Ionicons name="close-outline" size={16} color="#EF4444" />
                            <Text style={[styles.buttonText, styles.rejectText]}>Decline</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity
                        style={[styles.button, styles.revokeBtn]}
                        onPress={() => handleAction('revoke')}
                    >
                        <Ionicons name="stop-circle-outline" size={16} color="#EF4444" />
                        <Text style={[styles.buttonText, styles.rejectText]}>Revoke Access</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 35,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',

    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    clinicInfo: {
        flexDirection: 'row',
        flex: 1,
        gap: 12,
    },
    logoContainer: {
        width: 48,
        height: 48,
        borderRadius: 35,
        overflow: 'hidden',
    },
    logoBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
    },
    clinicName: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 2,
    },
    doctorName: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
        marginBottom: 2,
    },
    address: {
        fontSize: 12,
        color: '#94A3B8',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 35,
    },
    limitedBadge: {
        backgroundColor: '#FFF7ED',
    },
    fullBadge: {
        backgroundColor: '#ECFDF5',
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
    },
    limitedText: {
        color: '#D97706',
    },
    fullText: {
        color: '#059669',
    },
    expiryContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#FFFBEB',
        padding: 8,
        borderRadius: 35,
        marginBottom: 16,
    },
    expiryText: {
        fontSize: 12,
        color: '#D97706',
        fontWeight: '600',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
    },
    button: {
        flex: 1,
        minWidth: '28%',
        height: 40,
        borderRadius: 35,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingHorizontal: 12,
    },
    approveBtn: {
        backgroundColor: Colors.light.primary,
    },
    rejectBtn: {
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    revokeBtn: {
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    buttonText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#fff',
    },
    rejectText: {
        color: '#EF4444',
    },
});
