import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Switch
} from 'react-native';
import { useAlert } from '../context/AlertContext';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { Colors } from '../constants/theme';

// Mock user data
const USER = {
    name: 'John Doe',
    email: 'john.doe@email.com',
    medId: '2000154823',
    avatar: null, // Would be a URI in production
    memberSince: 'January 2024',
};

interface MenuItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value?: string;
    onPress?: () => void;
    showChevron?: boolean;
    iconColor?: string;
    danger?: boolean;
}

const MenuItem = ({ icon, label, value, onPress, showChevron = true, iconColor, danger }: MenuItemProps) => (
    <TouchableOpacity
        style={styles.menuItem}
        onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onPress?.();
        }}
        activeOpacity={0.6}
    >
        <View style={[styles.menuIcon, { backgroundColor: danger ? 'rgba(255,59,48,0.1)' : 'rgba(220,163,73,0.1)' }]}>
            <Ionicons name={icon} size={20} color={danger ? '#FF3B30' : (iconColor || Colors.light.primary)} />
        </View>
        <View style={styles.menuContent}>
            <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
            {value && <Text style={styles.menuValue}>{value}</Text>}
        </View>
        {showChevron && (
            <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        )}
    </TouchableOpacity>
);

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const [notifications, setNotifications] = useState(true);
    const [biometrics, setBiometrics] = useState(false);

    const { showAlert } = useAlert();

    const handleLogout = () => {
        showAlert({
            title: 'Log Out',
            message: 'Are you sure you want to log out?',
            buttons: [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Log Out',
                    style: 'destructive',
                    onPress: () => {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        router.replace('/login');
                    }
                },
            ]
        });
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#F8FAFC', '#FFFFFF']}
                style={StyleSheet.absoluteFill}
            />

            {/* Sticky "Close" Button Unit */}
            <View style={[styles.closeHeader, { top: insets.top + 10, pointerEvents: 'box-none' }]}>
                <View style={[styles.closeHeaderInner, { pointerEvents: 'box-none' }]}>
                    <View style={styles.headerSpacer} />
                    {/* Account Title moved to ScrollView to be non-sticky */}
                    <View style={styles.closeButtonCenterer}>
                        <BlurView intensity={60} tint="light" style={styles.blurWrapper}>
                            <TouchableOpacity
                                style={styles.doneBtn}
                                onPress={() => router.back()}
                            >
                                <Text style={styles.doneText}>Close</Text>
                            </TouchableOpacity>
                        </BlurView>
                    </View>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: insets.top + 10, paddingBottom: 40 }
                ]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.scrollHeader}>
                    <Text style={styles.headerTitleCentered}>Account</Text>
                </View>
                {/* User Identity Card (App Store Style) */}
                <View style={styles.identityCard}>
                    <View style={styles.identityTop}>
                        <View style={styles.avatarContainer}>
                            {USER.avatar ? (
                                <Image source={{ uri: USER.avatar }} style={styles.avatar} />
                            ) : (
                                <LinearGradient
                                    colors={[Colors.light.primary, '#E8A849']}
                                    style={styles.avatarPlaceholder}
                                >
                                    <Text style={styles.avatarInitials}>
                                        {USER.name.split(' ').map(n => n[0]).join('')}
                                    </Text>
                                </LinearGradient>
                            )}
                            <TouchableOpacity
                                style={styles.editAvatarBtn}
                                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                            >
                                <Ionicons name="camera" size={12} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.identityText}>
                            <Text style={styles.userName}>{USER.name}</Text>
                            <Text style={styles.userEmail}>{USER.email}</Text>
                        </View>
                    </View>

                    <View style={styles.identityDivider} />

                    {/* Med ID integrated into Card */}
                    <TouchableOpacity
                        style={styles.identityFooter}
                        onPress={() => {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            showAlert({
                                title: 'Copied!',
                                message: 'Med-ID copied to clipboard',
                                buttons: [{ text: 'OK' }]
                            });
                        }}
                    >
                        <View>
                            <Text style={styles.medIdLabel}>Med-ID</Text>
                            <Text style={styles.medIdValue}>{USER.medId}</Text>
                        </View>
                        <Ionicons name="copy-outline" size={18} color={Colors.light.primary} />
                    </TouchableOpacity>
                </View>

                {/* Quick Stats Section */}
                <Text style={styles.sectionTitle}>Statistics</Text>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>12</Text>
                        <Text style={styles.statLabel}>Uploads</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>3</Text>
                        <Text style={styles.statLabel}>Shared</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>8</Text>
                        <Text style={styles.statLabel}>Months</Text>
                    </View>
                </View>

                {/* Account Section */}
                <Text style={styles.sectionTitle}>Account</Text>
                <View style={styles.menuCard}>
                    <MenuItem
                        icon="person-outline"
                        label="Edit Profile"
                        onPress={() => { }}
                    />
                    <MenuItem
                        icon="shield-checkmark-outline"
                        label="Privacy & Security"
                        onPress={() => { }}
                    />
                    <MenuItem
                        icon="card-outline"
                        label="Subscription"
                        value="Free Plan"
                        onPress={() => { }}
                    />
                </View>

                {/* Preferences Section */}
                <Text style={styles.sectionTitle}>Preferences</Text>
                <View style={styles.menuCard}>
                    <View style={styles.menuItem}>
                        <View style={[styles.menuIcon, { backgroundColor: 'rgba(220,163,73,0.1)' }]}>
                            <Ionicons name="notifications-outline" size={20} color={Colors.light.primary} />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuLabel}>Notifications</Text>
                        </View>
                        <Switch
                            value={notifications}
                            onValueChange={(val) => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setNotifications(val);
                            }}
                            trackColor={{ false: '#E5E5EA', true: Colors.light.primary }}
                            thumbColor="#fff"
                        />
                    </View>
                    <View style={styles.menuItem}>
                        <View style={[styles.menuIcon, { backgroundColor: 'rgba(220,163,73,0.1)' }]}>
                            <Ionicons name="finger-print-outline" size={20} color={Colors.light.primary} />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuLabel}>Face ID / Touch ID</Text>
                        </View>
                        <Switch
                            value={biometrics}
                            onValueChange={(val) => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                setBiometrics(val);
                            }}
                            trackColor={{ false: '#E5E5EA', true: Colors.light.primary }}
                            thumbColor="#fff"
                        />
                    </View>
                    <MenuItem
                        icon="language-outline"
                        label="Language"
                        value="English"
                        onPress={() => { }}
                    />
                </View>

                {/* Support Section */}
                <Text style={styles.sectionTitle}>Support</Text>
                <View style={styles.menuCard}>
                    <MenuItem
                        icon="help-circle-outline"
                        label="Help Center"
                        onPress={() => { }}
                    />
                    <MenuItem
                        icon="chatbubble-outline"
                        label="Contact Us"
                        onPress={() => { }}
                    />
                    <MenuItem
                        icon="star-outline"
                        label="Rate App"
                        onPress={() => { }}
                    />
                </View>

                {/* Logout */}
                <View style={[styles.menuCard, { marginTop: 24 }]}>
                    <MenuItem
                        icon="log-out-outline"
                        label="Log Out"
                        showChevron={false}
                        danger
                        onPress={handleLogout}
                    />
                </View>

                {/* Version */}
                <Text style={styles.version}>MedHive v1.0.0</Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    closeHeader: {
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 10,
        alignItems: 'center', // Centers the inner container
    },
    closeHeaderInner: {
        width: '100%',
        maxWidth: 500,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerSpacer: {
        flex: 1,
    },
    scrollHeader: {
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
    },
    headerTitleCentered: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1C1C1E',
    },
    closeButtonCenterer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    blurWrapper: {
        borderRadius: 22,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
        // @ts-ignore - Web-only blurring
        backdropFilter: 'blur(12px) saturate(180%)',
    },
    doneBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: 'rgba(255,255,255,0.15)', // More translucent
        borderRadius: 22,
    },
    doneText: {
        fontSize: 17,
        fontWeight: '600',
        color: Colors.light.primary,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
    },

    // Identity Card (App Store style)
    identityCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
    },
    identityTop: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 16,
    },
    avatar: {
        width: 72, // Slightly smaller Apple-style
        height: 72,
        borderRadius: 36,
    },
    avatarPlaceholder: {
        width: 72,
        height: 72,
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitials: {
        fontSize: 28,
        fontWeight: '700',
        color: '#fff',
    },
    editAvatarBtn: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: Colors.light.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    identityText: {
        flex: 1,
    },
    userName: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 15,
        color: '#8E8E93',
    },
    identityDivider: {
        height: 1,
        backgroundColor: '#F2F2F7',
        marginVertical: 16,
    },
    identityFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    medIdLabel: {
        fontSize: 11,
        color: '#8E8E93',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    medIdValue: {
        fontSize: 17,
        fontWeight: '600',
        color: Colors.light.primary,
        letterSpacing: 1,
    },

    // Stats
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 35,
        paddingHorizontal: 28,
        paddingVertical: 24,
        marginBottom: 40, // Increased margin for more air
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 28,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 13,
        color: '#8E8E93',
    },
    statDivider: {
        width: 1,
        height: '100%',
        backgroundColor: '#F2F2F7',
    },

    // Sections
    sectionTitle: {
        fontSize: 18, // Bigger App Store style category titles
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 12,
        marginLeft: 4,
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
    },
    menuCard: {
        backgroundColor: '#fff',
        borderRadius: 35,
        marginBottom: 24,
        overflow: 'hidden',
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    menuIcon: {
        width: 36,
        height: 36,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    menuContent: {
        flex: 1,
    },
    menuLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#1C1C1E',
    },
    menuLabelDanger: {
        color: '#FF3B30',
    },
    menuValue: {
        fontSize: 15,
        color: '#8E8E93',
        marginTop: 2,
    },

    // Version
    version: {
        textAlign: 'center',
        fontSize: 13,
        color: '#C7C7CC',
        marginTop: 8,
        marginBottom: 20,
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
    },
});
