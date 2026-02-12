import React, { useState, useMemo, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    Switch,
    Linking,
    TextInput,
    Modal,
    Alert,
    Platform,
    Pressable
} from 'react-native';
import { useAlert } from '../context/AlertContext';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { Colors } from '../constants/theme';
import { generateMockHistory } from '../utils/historyUtils';
import { generateMockAccess } from '../utils/accessUtils';
import { getUser, clearUser, saveUser, UserData } from '../utils/userStore';
import { useTranslation } from 'react-i18next';
import { LanguagePicker } from '../components/LanguagePicker';


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
    const { t, i18n } = useTranslation();
    const insets = useSafeAreaInsets();
    const { showAlert } = useAlert();
    const [langPickerVisible, setLangPickerVisible] = useState(false);

    // User State
    const [userData, setUserData] = useState<UserData | null>(null);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        const user = await getUser();
        if (user) {
            setUserData(user);
            setTempName(`${user.fname} ${user.lname}`);
            setTempEmail(user.email);
        }
    };

    // Preferences
    const [notifications, setNotifications] = useState(true);
    const [biometrics, setBiometrics] = useState(true);

    // Modal States
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [tempName, setTempName] = useState('');
    const [tempEmail, setTempEmail] = useState('');

    // Dynamic Statistics
    const historyItems = useMemo(() => generateMockHistory(), []);
    const accessRecords = useMemo(() => generateMockAccess(), []);

    const stats = useMemo(() => ({
        uploads: historyItems.length,
        shared: accessRecords.filter(r => r.status === 'active').length,
        months: 8 // Mock 
    }), [historyItems, accessRecords]);

    const handleLogout = () => {
        showAlert({
            title: t('profile.signOut'),
            message: t('profile.signOutConfirm'),
            buttons: [
                { text: t('profile.cancel'), style: 'cancel' },
                {
                    text: t('profile.signOut'),
                    style: 'destructive',
                    onPress: async () => {
                        await clearUser();
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        router.replace('/login');
                    }
                },
            ]
        });
    };

    const handleSaveProfile = () => {
        if (!tempName.trim() || !tempEmail.trim()) {
            Alert.alert('Error', t('profile.fieldRequired'));
            return;
        }

        const nameParts = tempName.trim().split(/\s+/);
        const newFname = nameParts[0] || '';
        const newLname = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        if (userData) {
            const updatedUser = {
                ...userData,
                fname: newFname,
                lname: newLname,
                email: tempEmail
            };
            setUserData(updatedUser);
            saveUser(updatedUser); // Persist changes
        }

        setEditModalVisible(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    const handleContactUs = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Linking.openURL('mailto:reachmedhive@gmail.com?subject=Support%20Request');
    };

    const handleHelpCenter = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        Linking.openURL('https://medhive.lk');
    };

    const handleRateApp = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Alert.alert('Rate MedHive', 'Thank you for your feedback! This would open the App Store in production.', [{ text: 'Cancel' }, { text: '5 Stars ⭐', onPress: () => { } }]);
    };

    if (!userData) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={styles.userName}>Loading profile...</Text>
            </View>
        );
    }

    const fullName = `${userData.fname} ${userData.lname}`;
    const initials = `${userData.fname[0]}${userData.lname[0]}`.toUpperCase();

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
                    <View style={styles.closeButtonCenterer}>
                        <BlurView intensity={60} tint="light" style={styles.blurWrapper}>
                            <TouchableOpacity
                                style={styles.doneBtn}
                                onPress={() => router.back()}
                            >
                                <Text style={styles.doneText}>{t('profile.close')}</Text>
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
                    <Text style={styles.headerTitleCentered}>{t('profile.account')}</Text>
                </View>

                {/* User Identity Card (App Store Style) */}
                <View style={styles.identityCard}>
                    <View style={styles.identityTop}>
                        <View style={styles.avatarContainer}>
                            <LinearGradient
                                colors={[Colors.light.primary, '#E8A849']}
                                style={styles.avatarPlaceholder}
                            >
                                <Text style={styles.avatarInitials}>
                                    {initials}
                                </Text>
                            </LinearGradient>
                            <TouchableOpacity
                                style={styles.editAvatarBtn}
                                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                            >
                                <Ionicons name="camera" size={12} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.identityText}>
                            <Text style={styles.userName}>{fullName}</Text>
                            <Text style={styles.userEmail}>{userData.email}</Text>
                        </View>
                    </View>

                    <View style={styles.identityDivider} />

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
                            <Text style={styles.medIdValue}>{userData.med_id}</Text>
                        </View>
                        <Ionicons name="copy-outline" size={18} color={Colors.light.primary} />
                    </TouchableOpacity>
                </View>

                {/* Statistics Section */}
                <Text style={styles.sectionTitle}>{t('profile.performance')}</Text>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.uploads}</Text>
                        <Text style={styles.statLabel}>{t('history.title')}</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.shared}</Text>
                        <Text style={styles.statLabel}>{t('access.clinics')}</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.months}</Text>
                        <Text style={styles.statLabel}>{t('profile.healthAge')}</Text>
                    </View>
                </View>

                {/* Account Section */}
                <Text style={styles.sectionTitle}>{t('profile.account')}</Text>
                <View style={styles.menuCard}>
                    <MenuItem
                        icon="person-outline"
                        label={t('profile.editProfile')}
                        onPress={() => {
                            setTempName(fullName);
                            setTempEmail(userData.email);
                            setEditModalVisible(true);
                        }}
                    />
                    <MenuItem
                        icon="shield-checkmark-outline"
                        label={t('profile.security')}
                        onPress={() => Linking.openURL('https://medhive.lk')}
                    />
                    <MenuItem
                        icon="card-outline"
                        label={t('profile.subscription')}
                        value={t('profile.premiumPlan')}
                        onPress={() => Alert.alert('MedHive Premium', t('profile.earlyAdopter'))}
                    />
                </View>

                {/* Preferences Section */}
                <Text style={styles.sectionTitle}>{t('profile.settings')}</Text>
                <View style={styles.menuCard}>
                    <View style={styles.menuItem}>
                        <View style={[styles.menuIcon, { backgroundColor: 'rgba(220,163,73,0.1)' }]}>
                            <Ionicons name="notifications-outline" size={20} color={Colors.light.primary} />
                        </View>
                        <View style={styles.menuContent}>
                            <Text style={styles.menuLabel}>{t('profile.notifications')}</Text>
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
                            <Text style={styles.menuLabel}>{t('profile.biometrics')}</Text>
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
                        icon="globe-outline"
                        label={t('profile.language')}
                        value={i18n.language === 'en' ? 'English' : i18n.language === 'si' ? 'සිංහල' : 'தமிழ்'}
                        onPress={() => setLangPickerVisible(true)}
                    />
                </View>

                {/* Support Section */}
                <Text style={styles.sectionTitle}>{t('profile.support')}</Text>
                <View style={styles.menuCard}>
                    <MenuItem
                        icon="help-circle-outline"
                        label={t('profile.knowledgeBase')}
                        onPress={handleHelpCenter}
                    />
                    <MenuItem
                        icon="mail-outline"
                        label={t('profile.contactSupport')}
                        onPress={handleContactUs}
                    />
                    <MenuItem
                        icon="star-outline"
                        label={t('profile.rateApp')}
                        onPress={handleRateApp}
                    />
                </View>

                {/* Logout */}
                <View style={[styles.menuCard, { marginTop: 24, marginBottom: 12 }]}>
                    <MenuItem
                        icon="log-out-outline"
                        label={t('profile.signOut')}
                        showChevron={false}
                        danger
                        onPress={handleLogout}
                    />
                </View>

                <Text style={styles.version}>{t('profile.version')}</Text>

                <LanguagePicker
                    visible={langPickerVisible}
                    onClose={() => setLangPickerVisible(false)}
                />
            </ScrollView>

            {/* Edit Profile Modal */}
            <Modal
                visible={editModalVisible}
                transparent={true}
                onRequestClose={() => setEditModalVisible(false)}
            >
                <BlurView intensity={30} tint="dark" style={styles.modalOverlay}>
                    <Pressable style={StyleSheet.absoluteFill} onPress={() => setEditModalVisible(false)} />
                    <View style={styles.editCard}>
                        <Text style={styles.editTitle}>{t('profile.editProfile')}</Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>{t('profile.fullName')}</Text>
                            <TextInput
                                style={styles.textInput}
                                value={tempName}
                                onChangeText={setTempName}
                                placeholder={t('auth.fnamePlaceholder')}
                                placeholderTextColor="#8E8E93"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>{t('profile.emailAddress')}</Text>
                            <TextInput
                                style={styles.textInput}
                                value={tempEmail}
                                onChangeText={setTempEmail}
                                placeholder={t('auth.emailPlaceholder')}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                placeholderTextColor="#8E8E93"
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.saveBtn}
                            onPress={handleSaveProfile}
                        >
                            <LinearGradient
                                colors={[Colors.light.primary, Colors.light.primaryDark]}
                                style={styles.saveGradient}
                            >
                                <Text style={styles.saveBtnText}>{t('profile.saveChanges')}</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => setEditModalVisible(false)}
                        >
                            <Text style={styles.cancelBtnText}>{t('profile.cancel')}</Text>
                        </TouchableOpacity>
                    </View>
                </BlurView>
            </Modal>
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
    // Modal Styles
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    editCard: {
        width: '100%',
        maxWidth: 400,
        backgroundColor: '#fff',
        borderRadius: 35,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    editTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1C1C1E',
        marginBottom: 24,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#8E8E93',
        marginBottom: 8,
        marginLeft: 4,
    },
    textInput: {
        backgroundColor: '#F2F2F7',
        borderRadius: 18,
        paddingVertical: 14,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#1C1C1E',
        borderWidth: 1,
        borderColor: '#E5E5EA',
        ...Platform.select({
            web: {
                outlineStyle: 'none',
            } as any,
        }),
    },
    saveBtn: {
        borderRadius: 35,
        overflow: 'hidden',
        marginTop: 10,
    },
    saveGradient: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    saveBtnText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: '700',
    },
    cancelBtn: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    cancelBtnText: {
        color: '#8E8E93',
        fontSize: 16,
        fontWeight: '600',
    },
});
