import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, Platform } from 'react-native';
import { HoneyContainer } from '../../components/HoneyContainer';
import { Colors } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProfileAvatar } from '../../components/ProfileAvatar';
import { useAlert } from '../../context/AlertContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { AccessCard } from '../../components/AccessCard';
import { generateMockAccess } from '../../utils/accessUtils';
import { AccessRecord, AccessStatus, AccessDuration } from '../../types/access';
import { useTranslation } from 'react-i18next';

export default function AccessScreen() {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const { showAlert } = useAlert();
    const [accessRecords, setAccessRecords] = useState<AccessRecord[]>(generateMockAccess());

    // User's Med-ID (Mock)
    const MY_MED_ID = "2000 1548 2341";

    const pendingRequests = useMemo(() =>
        accessRecords.filter(r => r.status === 'pending'),
        [accessRecords]);

    const activeAccess = useMemo(() =>
        accessRecords.filter(r => r.status === 'active'),
        [accessRecords]);

    const executeUpdate = (id: string, action: 'approve_1h' | 'approve_full' | 'revoke') => {
        setAccessRecords(prev => prev.map(record => {
            if (record.id !== id) return record;

            if (action === 'revoke') {
                return { ...record, status: 'revoked' as AccessStatus };
            }

            const now = new Date();
            const expiry = action === 'approve_1h'
                ? new Date(now.getTime() + 60 * 60 * 1000)
                : undefined;

            return {
                ...record,
                status: 'active' as AccessStatus,
                duration: (action === 'approve_1h' ? '1h' : 'full') as AccessDuration,
                expiryDate: expiry
            };
        }).filter(r => r.status !== 'revoked'));

        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    const handleUpdateStatus = (id: string, action: 'approve_1h' | 'approve_full' | 'revoke') => {
        const record = accessRecords.find(r => r.id === id);
        if (!record) return;

        let title = "";
        let message = "";
        let confirmText = t('access.alerts.confirm');
        let style: 'default' | 'destructive' = 'default';

        if (action === 'approve_1h') {
            title = t('access.alerts.tempTitle');
            message = t('access.alerts.tempMsg', { name: record.clinicName });
            confirmText = t('access.alerts.tempBtn');
        } else if (action === 'approve_full') {
            title = t('access.alerts.fullTitle');
            message = t('access.alerts.fullMsg', { name: record.clinicName });
            confirmText = t('access.alerts.fullBtn');
        } else if (action === 'revoke') {
            title = t('access.alerts.revokeTitle');
            message = t('access.alerts.revokeMsg', { name: record.clinicName });
            confirmText = t('access.alerts.revokeBtn');
            style = 'destructive';
        }

        showAlert({
            title,
            message,
            buttons: [
                { text: t('access.alerts.cancel'), style: 'cancel' },
                {
                    text: confirmText,
                    style,
                    onPress: () => executeUpdate(id, action)
                },
            ]
        });
    };

    const handleShareMedId = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        try {
            await Share.share({
                message: t('access.shareMessage', { id: MY_MED_ID }),
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header with Profile Avatar */}
            <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 20 : 8) }]}>
                <View>
                    <Text style={styles.headerTitle}>{t('access.title')}</Text>
                    <Text style={styles.headerSubtitle}>{t('access.subtitle')}</Text>
                </View>
                <ProfileAvatar size={34} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Med-ID Section */}
                <View style={styles.idSection}>
                    <LinearGradient
                        colors={[Colors.light.primary, Colors.light.primaryDark]}
                        style={styles.idCard}
                    >
                        <View style={styles.idCardHeader}>
                            <View style={styles.idBrand}>
                                <Ionicons name="shield-checkmark" size={24} color="#fff" />
                                <Text style={styles.idBrandText}>{t('access.medId')}</Text>
                            </View>
                            <TouchableOpacity onPress={handleShareMedId} style={styles.shareButton}>
                                <Ionicons name="share-outline" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.idNumberContainer}>
                            <Text style={styles.idNumber}>{MY_MED_ID}</Text>
                        </View>

                        <View style={styles.idFooter}>
                            <Text style={styles.idFooterText}>{t('access.shareFooter')}</Text>
                        </View>
                    </LinearGradient>
                </View>

                {/* Pending Requests */}
                {pendingRequests.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>{t('access.incoming')}</Text>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{pendingRequests.length}</Text>
                            </View>
                        </View>
                        {pendingRequests.map(record => (
                            <AccessCard
                                key={record.id}
                                record={record}
                                onUpdateStatus={handleUpdateStatus}
                            />
                        ))}
                    </View>
                )}

                {/* Active Permissions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('access.clinics')}</Text>
                    {activeAccess.length > 0 ? (
                        activeAccess.map(record => (
                            <AccessCard
                                key={record.id}
                                record={record}
                                onUpdateStatus={handleUpdateStatus}
                            />
                        ))
                    ) : (
                        <HoneyContainer style={styles.emptyContainer}>
                            <Ionicons name="lock-open-outline" size={40} color="#CBD5E1" />
                            <Text style={styles.emptyText}>{t('access.noAccess')}</Text>
                            <Text style={styles.emptySubtext}>{t('access.noAccessSub')}</Text>
                        </HoneyContainer>
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: Colors.light.background,
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.light.text,
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
        paddingHorizontal: 20,
        paddingBottom: 120,
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
    },
    idSection: {
        marginBottom: 32,
    },
    idCard: {
        borderRadius: 35,
        padding: 24,
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 10,
    },
    idCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    idBrand: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    idBrandText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    shareButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    idNumberContainer: {
        backgroundColor: 'rgba(0,0,0,0.08)',
        paddingVertical: 18,
        paddingHorizontal: 12,
        borderRadius: 24,
        alignItems: 'center',
        marginBottom: 20,
    },
    idNumber: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '800',
        letterSpacing: 2,
        textAlign: 'center',
    },
    idFooter: {
        alignItems: 'center',
    },
    idFooterText: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 13,
        fontWeight: '500',
        textAlign: 'center',
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 16,
    },
    badge: {
        backgroundColor: '#F59E0B',
        paddingHorizontal: 8,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -14,
    },
    badgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '800',
    },
    emptyContainer: {
        paddingVertical: 40,
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: '#E2E8F0',
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.light.text,
        marginTop: 16,
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        paddingHorizontal: 20,
        lineHeight: 20,
    },
});
