import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Switch,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
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

    const handleLogout = () => {
        Alert.alert(
            'Log Out',
            'Are you sure you want to log out?',
            [
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
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#F8FAFC', '#FFFFFF']}
                style={StyleSheet.absoluteFill}
            />

            {/* Close Button (Done) */}
            <TouchableOpacity
                style={[styles.doneBtn, { top: insets.top + 10 }]}
                onPress={() => router.back()}
            >
                <Text style={styles.doneText}>Close</Text>
            </TouchableOpacity>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: insets.top + 16, paddingBottom: 40 }
                ]}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Header */}
                <View style={styles.header}>
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
                            <Ionicons name="camera" size={14} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.userName}>{USER.name}</Text>
                    <Text style={styles.userEmail}>{USER.email}</Text>

                    {/* Med ID Card */}
                    <View style={styles.medIdCard}>
                        <View style={styles.medIdLeft}>
                            <Text style={styles.medIdLabel}>Med-ID</Text>
                            <Text style={styles.medIdValue}>{USER.medId}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.copyBtn}
                            onPress={() => {
                                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                Alert.alert('Copied!', 'Med-ID copied to clipboard');
                            }}
                        >
                            <Ionicons name="copy-outline" size={18} color={Colors.light.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Quick Stats */}
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
    doneBtn: {
        position: 'absolute',
        right: 20,
        zIndex: 10,
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.8)',
        borderRadius: 20,
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

    // Header
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
        marginTop: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitials: {
        fontSize: 36,
        fontWeight: '700',
        color: '#fff',
    },
    editAvatarBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.light.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 15,
        color: '#8E8E93',
        marginBottom: 16,
    },
    medIdCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
    },
    medIdLeft: {
        flex: 1,
    },
    medIdLabel: {
        fontSize: 12,
        color: '#8E8E93',
        marginBottom: 2,
    },
    medIdValue: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.light.primary,
        letterSpacing: 1,
    },
    copyBtn: {
        padding: 8,
    },

    // Stats
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
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
        fontSize: 13,
        fontWeight: '600',
        color: '#8E8E93',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: 12,
        marginLeft: 4,
    },
    menuCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    menuIcon: {
        width: 36,
        height: 36,
        borderRadius: 10,
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
    },
});
