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
import * as ImagePicker from 'expo-image-picker';
import { getUser, clearUser, saveUser, UserData } from '../utils/userStore';
import { useTranslation } from 'react-i18next';
import { LanguagePicker } from '../components/LanguagePicker';
import * as Clipboard from 'expo-clipboard';
import { API_ENDPOINTS } from '../constants/config';
import { PickerInput } from '../components/PickerInput';

const BLOOD_GROUP_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];


interface MenuItemProps {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value?: string;
    onPress?: () => void;
    showChevron?: boolean;
    iconColor?: string;
    danger?: boolean;
    hideBorder?: boolean;
}

const MenuItem = ({ icon, label, value, onPress, showChevron = true, iconColor, danger, hideBorder }: MenuItemProps) => (
    <TouchableOpacity
        style={[
            styles.menuItem,
            hideBorder && {
                borderBottomWidth: 0,
                borderBottomLeftRadius: 35,
                borderBottomRightRadius: 35,
            }
        ]}
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
            fetchStats(user.med_id);
            fetchRecords(user.med_id);
        }
    };

    const fetchStats = async (medId: string) => {
        try {
            const res = await fetch(API_ENDPOINTS.MEDICAL_STATS(medId));
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (e) {}
    };

    const fetchRecords = async (medId: string) => {
        try {
            const res = await fetch(API_ENDPOINTS.MEDICAL_RECORDS(medId));
            if (res.ok) {
                const data = await res.json();
                setMedicalRecords(data.records || []);
            }
        } catch (e) {}
    };

    // Preferences
    const [notifications, setNotifications] = useState(true);

    // Modal States
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editModalTab, setEditModalTab] = useState<'profile' | 'medical'>('profile');
    const [tempName, setTempName] = useState('');
    const [tempEmail, setTempEmail] = useState('');
    const [tempBloodGroup, setTempBloodGroup] = useState('');
    const [tempWeightKg, setTempWeightKg] = useState('');
    const [tempBloodPressure, setTempBloodPressure] = useState('');
    const [tempEmergencyContactName, setTempEmergencyContactName] = useState('');
    const [tempEmergencyContactPhone, setTempEmergencyContactPhone] = useState('');
    const [tempMedicalRecords, setTempMedicalRecords] = useState('');
    const [tempDiseases, setTempDiseases] = useState('');
    const [tempAllergies, setTempAllergies] = useState('');
    const [tempOtherInfo, setTempOtherInfo] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Data States
    const [stats, setStats] = useState({ records: 0, clinics: 0, scans: 0 });

    // New Viewer States
    const [allRecordsVisible, setAllRecordsVisible] = useState(false);
    const [recordViewerVisible, setRecordViewerVisible] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<any>(null);
    const [isEditingRecordTitle, setIsEditingRecordTitle] = useState(false);
    const [editRecordTitleValue, setEditRecordTitleValue] = useState("");

    const handleOpenRecord = (record: any) => {
        setSelectedRecord(record);
        setEditRecordTitleValue(record.title);
        setIsEditingRecordTitle(false);
        setRecordViewerVisible(true);
    };

    const handleSaveRecordTitle = async () => {
        if (!editRecordTitleValue.trim()) {
            Alert.alert("Error", "Title cannot be empty.");
            return;
        }
        setIsSaving(true);
        try {
            const res = await fetch(API_ENDPOINTS.UPDATE_RECORD(selectedRecord.id), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: editRecordTitleValue })
            });

            if (res.ok) {
                const data = await res.json();
                setMedicalRecords(prev => prev.map(r => r.id === selectedRecord.id ? data.record : r));
                setSelectedRecord(data.record);
                setIsEditingRecordTitle(false);
            } else {
                Alert.alert("Error", "Failed to update record title.");
            }
        } catch (e) {
            Alert.alert("Error", "An error occurred while updating.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteRecord = (recordId: string | number) => {
        const proceedToDelete = async () => {
            try {
                const res = await fetch(API_ENDPOINTS.DELETE_RECORD(recordId), { method: 'DELETE' });
                if (res.ok) {
                    setMedicalRecords(prev => prev.filter(r => r.id !== recordId));
                    setRecordViewerVisible(false);
                    if (userData) fetchStats(userData.med_id);
                    if (Platform.OS !== 'web') Alert.alert("Deleted", "Medical record removed.");
                } else {
                    if (Platform.OS !== 'web') Alert.alert("Error", "Failed to delete record.");
                    else window.alert("Failed to delete record.");
                }
            } catch (e) {
                if (Platform.OS !== 'web') Alert.alert("Error", "An error occurred.");
                else window.alert("An error occurred.");
            }
        };

        if (Platform.OS === 'web') {
            const confirmed = window.confirm("Are you sure you want to permanently delete this record?");
            if (confirmed) {
                proceedToDelete();
            }
        } else {
            Alert.alert(
                "Delete Record",
                "Are you sure you want to permanently delete this record?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Delete",
                        style: "destructive",
                        onPress: proceedToDelete
                    }
                ]
            );
        }
    };
    const [medicalRecords, setMedicalRecords] = useState<{ id: number, title: string, image_url: string, created_at: string }[]>([]);
    
    // Upload Modal States
    const [addRecordModalVisible, setAddRecordModalVisible] = useState(false);
    const [newRecordTitle, setNewRecordTitle] = useState('');
    const [newRecordImage, setNewRecordImage] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.5,
            base64: true,
        });

        if (!result.canceled && result.assets[0].base64) {
            setNewRecordImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
        }
    };

    const handleAddRecord = async () => {
        if (!newRecordTitle.trim() || !newRecordImage) {
            Alert.alert('Error', 'Please provide a title and select an image.');
            return;
        }

        if (userData) {
            setIsUploading(true);
            try {
                const res = await fetch(API_ENDPOINTS.MEDICAL_RECORDS(userData.med_id), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: newRecordTitle,
                        image_url: newRecordImage
                    })
                });
                
                if (res.ok) {
                    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    setAddRecordModalVisible(false);
                    setNewRecordTitle('');
                    setNewRecordImage('');
                    fetchRecords(userData.med_id);
                    fetchStats(userData.med_id);
                } else {
                    Alert.alert('Error', 'Failed to upload record');
                }
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'Failed to upload record');
            } finally {
                setIsUploading(false);
            }
        }
    };

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

    const handleSaveProfile = async () => {
        if (!tempName.trim() || !tempEmail.trim()) {
            Alert.alert('Error', t('profile.fieldRequired'));
            return;
        }

        const nameParts = tempName.trim().split(/\s+/);
        const newFname = nameParts[0] || '';
        const newLname = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        if (userData) {
            setIsSaving(true);
            try {
                const response = await fetch(API_ENDPOINTS.UPDATE_HISTORY(userData.med_id), {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        medical_records: tempMedicalRecords,
                        diseases: tempDiseases,
                        allergies: tempAllergies,
                        other_info: tempOtherInfo,
                        blood_group: tempBloodGroup,
                        weight_kg: tempWeightKg,
                        blood_pressure: tempBloodPressure,
                        emergency_contact_name: tempEmergencyContactName,
                        emergency_contact_phone: tempEmergencyContactPhone
                    })
                });

                if (!response.ok) {
                    throw new Error('Failed to update profile');
                }

                const updatedUser = {
                    ...userData,
                    fname: newFname,
                    lname: newLname,
                    email: tempEmail,
                    blood_group: tempBloodGroup,
                    weight_kg: tempWeightKg,
                    blood_pressure: tempBloodPressure,
                    emergency_contact_name: tempEmergencyContactName,
                    emergency_contact_phone: tempEmergencyContactPhone,
                    medical_records: tempMedicalRecords,
                    diseases: tempDiseases,
                    allergies: tempAllergies,
                    other_info: tempOtherInfo
                };

                setUserData(updatedUser);
                await saveUser(updatedUser); 
                setEditModalVisible(false);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
                console.error(error);
                Alert.alert('Error', 'Could not update profile data.');
            } finally {
                setIsSaving(false);
            }
        }
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

    const fullName = `${userData.fname || ''} ${userData.lname || ''}`.trim() || 'MedHive User';
    const initials = (
        (userData.fname?.[0] || '') + 
        (userData.lname?.[0] || '')
    ).toUpperCase() || 'MH';

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
                                onPress={() => {
                                    if (router.canGoBack()) {
                                        router.back();
                                    } else {
                                        router.replace('/(tabs)/history');
                                    }
                                }}
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
                    { paddingTop: insets.top + 10, paddingBottom: 80 }
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
                        onPress={async () => {
                            if (userData.med_id) {
                                await Clipboard.setStringAsync(String(userData.med_id));
                                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                                showAlert({
                                    title: 'Copied!',
                                    message: 'Med-ID copied to clipboard',
                                    buttons: [{ text: 'OK' }]
                                });
                            }
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
                <Text style={styles.sectionTitle}>Performance</Text>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.records}</Text>
                        <Text style={styles.statLabel}>Records</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.clinics}</Text>
                        <Text style={styles.statLabel}>Clinics Visited</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{stats.scans}</Text>
                        <Text style={styles.statLabel}>Scans Done</Text>
                    </View>
                </View>

                {/* Personal Information Section */}
                <Text style={styles.sectionTitle}>Personal Information</Text>
                <View style={styles.menuCard}>
                    <MenuItem
                        icon="person-outline"
                        label={t('profile.editProfile')}
                        onPress={() => {
                            setTempName(fullName);
                            setTempEmail(userData.email);
                            setTempBloodGroup(userData.blood_group || '');
                            setTempWeightKg(userData.weight_kg ? String(userData.weight_kg) : '');
                            setTempBloodPressure(userData.blood_pressure || '');
                            setTempEmergencyContactName(userData.emergency_contact_name || '');
                            setTempEmergencyContactPhone(userData.emergency_contact_phone || '');
                            setTempMedicalRecords(userData.medical_records || '');
                            setTempDiseases(userData.diseases || '');
                            setTempAllergies(userData.allergies || '');
                            setTempOtherInfo(userData.other_info || '');
                            setEditModalTab('profile');
                            setEditModalVisible(true);
                        }}
                    />
                    <MenuItem
                        icon="medical-outline"
                        label="Medical History"
                        onPress={() => {
                            setTempName(fullName);
                            setTempEmail(userData.email);
                            setTempBloodGroup(userData.blood_group || '');
                            setTempWeightKg(userData.weight_kg ? String(userData.weight_kg) : '');
                            setTempBloodPressure(userData.blood_pressure || '');
                            setTempEmergencyContactName(userData.emergency_contact_name || '');
                            setTempEmergencyContactPhone(userData.emergency_contact_phone || '');
                            setTempMedicalRecords(userData.medical_records || '');
                            setTempDiseases(userData.diseases || '');
                            setTempAllergies(userData.allergies || '');
                            setTempOtherInfo(userData.other_info || '');
                            setEditModalTab('medical');
                            setEditModalVisible(true);
                        }}
                    />
                    <MenuItem
                        icon="add-circle-outline"
                        label="Add Medical Record"
                        onPress={() => setAddRecordModalVisible(true)}
                        hideBorder
                        iconColor={Colors.light.primary}
                    />
                </View>

                {/* Uploaded Records Display */}
                {medicalRecords.length > 0 && (
                    <>
                        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Uploaded Records</Text>
                        <View style={styles.menuCard}>
                            {medicalRecords.map((rec, index) => (
                                <TouchableOpacity 
                                    key={rec.id} 
                                    style={[styles.recordItem, { margin: 16, marginBottom: index === medicalRecords.length - 1 ? 16 : 8, borderWidth: 0, borderBottomWidth: index === medicalRecords.length - 1 ? 0 : 1, borderRadius: 35 }]}
                                    onPress={() => handleOpenRecord(rec)}
                                >
                                    <Image source={{ uri: rec.image_url }} style={styles.recordImage} />
                                    <View style={{ flex: 1, marginLeft: 14 }}>
                                        <Text style={styles.recordTitle}>{rec.title}</Text>
                                        <Text style={styles.recordDate}>{new Date(rec.created_at).toLocaleDateString()}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                )}

                {/* Account Section */}
                <Text style={styles.sectionTitle}>{t('profile.account')}</Text>
                <View style={styles.menuCard}>
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
                        hideBorder
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
                    <MenuItem
                        icon="globe-outline"
                        label={t('profile.language')}
                        value={i18n.language === 'en' ? 'English' : i18n.language === 'si' ? 'සිංහල' : 'தமிழ்'}
                        onPress={() => setLangPickerVisible(true)}
                        hideBorder
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
                        hideBorder
                    />
                </View>

                {/* Logout */}
                <View style={styles.menuCard}>
                    <MenuItem
                        icon="log-out-outline"
                        label={t('profile.signOut')}
                        showChevron={false}
                        danger
                        onPress={handleLogout}
                        hideBorder
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
                    <View style={[styles.editCard, { maxHeight: '80%' }]}>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                        <Text style={styles.editTitle}>{editModalTab === 'profile' ? t('profile.editProfile') : 'Medical History'}</Text>

                        {editModalTab === 'profile' && (
                            <>
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
                            </>
                        )}

                        {editModalTab === 'medical' && (
                            <>
                                <PickerInput
                                    label="Blood Group"
                                    value={tempBloodGroup}
                                    onValueChange={setTempBloodGroup}
                                    options={BLOOD_GROUP_OPTIONS}
                                    placeholder="Select Blood Group"
                                    iconName="water-outline"
                                />

                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Weight (kg)</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={tempWeightKg}
                                        onChangeText={(text) => {
                                            let cleaned = text.replace(/[^0-9.]/g, '');
                                            const parts = cleaned.split('.');
                                            if (parts.length > 2) {
                                                cleaned = parts[0] + '.' + parts.slice(1).join('');
                                            }
                                            setTempWeightKg(cleaned);
                                        }}
                                        keyboardType="decimal-pad"
                                        placeholder="Enter weight in kg"
                                        placeholderTextColor="#8E8E93"
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Blood Pressure</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={tempBloodPressure}
                                        onChangeText={(text) => {
                                            let cleaned = text.replace(/[^0-9/]/g, '');
                                            const parts = cleaned.split('/');
                                            if (parts.length > 2) {
                                                cleaned = parts[0] + '/' + parts.slice(1).join('');
                                            }
                                            setTempBloodPressure(cleaned);
                                        }}
                                        placeholder="e.g., 120/80"
                                        placeholderTextColor="#8E8E93"
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Emergency Contact Name</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={tempEmergencyContactName}
                                        onChangeText={setTempEmergencyContactName}
                                        placeholder="Enter emergency contact name"
                                        placeholderTextColor="#8E8E93"
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Emergency Contact Phone</Text>
                                    <View style={[styles.textInput, { flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 0, paddingVertical: 0 }]}>
                                        <Text style={{ fontSize: 16, color: '#1C1C1E', paddingRight: 4, fontWeight: '500' }}>+94</Text>
                                        <TextInput
                                            style={{ flex: 1, fontSize: 16, color: '#1C1C1E', paddingVertical: 14, paddingRight: 16, ...Platform.select({ web: { outlineStyle: 'none' } as any }) }}
                                            value={tempEmergencyContactPhone}
                                            onChangeText={(text) => {
                                                setTempEmergencyContactPhone(text.replace(/[^0-9]/g, ''));
                                            }}
                                            keyboardType="phone-pad"
                                            placeholder="XX XXX XXXX"
                                            placeholderTextColor="#8E8E93"
                                            maxLength={9}
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Medical Records</Text>
                                    <TextInput
                                        style={[styles.textInput, { minHeight: 80, textAlignVertical: 'top' }]}
                                        value={tempMedicalRecords}
                                        onChangeText={setTempMedicalRecords}
                                        multiline
                                        placeholder="Any major surgeries, treatments..."
                                        placeholderTextColor="#8E8E93"
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Chronic Diseases</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={tempDiseases}
                                        onChangeText={setTempDiseases}
                                        placeholder="e.g., Diabetes, Hypertension"
                                        placeholderTextColor="#8E8E93"
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Allergies</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        value={tempAllergies}
                                        onChangeText={setTempAllergies}
                                        placeholder="e.g., Peanuts, Penicillin"
                                        placeholderTextColor="#8E8E93"
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Other Information</Text>
                                    <TextInput
                                        style={[styles.textInput, { minHeight: 60, textAlignVertical: 'top' }]}
                                        value={tempOtherInfo}
                                        onChangeText={setTempOtherInfo}
                                        multiline
                                        placeholder="Any other health details..."
                                        placeholderTextColor="#8E8E93"
                                    />
                                </View>
                            </>
                        )}

                        <TouchableOpacity
                            style={styles.saveBtn}
                            onPress={handleSaveProfile}
                            disabled={isSaving}
                        >
                            <LinearGradient
                                colors={[Colors.light.primary, Colors.light.primaryDark]}
                                style={styles.saveGradient}
                            >
                                <Text style={styles.saveBtnText}>{isSaving ? 'Saving...' : t('profile.saveChanges')}</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => setEditModalVisible(false)}
                            disabled={isSaving}
                        >
                            <Text style={styles.cancelBtnText}>{t('profile.cancel')}</Text>
                        </TouchableOpacity>
                        </ScrollView>
                    </View>
                </BlurView>
            </Modal>

            {/* Add Record Modal */}
            <Modal
                visible={addRecordModalVisible}
                transparent={true}
                onRequestClose={() => setAddRecordModalVisible(false)}
            >
                <BlurView intensity={30} tint="dark" style={styles.modalOverlay}>
                    <Pressable style={StyleSheet.absoluteFill} onPress={() => setAddRecordModalVisible(false)} />
                    <View style={styles.editCard}>
                        <Text style={styles.editTitle}>Add New Record</Text>
                        
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Record Title</Text>
                            <TextInput
                                style={styles.textInput}
                                value={newRecordTitle}
                                onChangeText={setNewRecordTitle}
                                placeholder="e.g., Blood Test Report"
                                placeholderTextColor="#8E8E93"
                            />
                        </View>

                        <TouchableOpacity style={styles.imagePickerBtn} onPress={pickImage}>
                            {newRecordImage ? (
                                <Image source={{ uri: newRecordImage }} style={styles.pickedImage} />
                            ) : (
                                <>
                                    <Ionicons name="image-outline" size={32} color={Colors.light.primary} />
                                    <Text style={styles.imagePickerText}>Tap to select an image</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.saveBtn} onPress={handleAddRecord} disabled={isUploading}>
                            <LinearGradient colors={[Colors.light.primary, Colors.light.primaryDark]} style={styles.saveGradient}>
                                <Text style={styles.saveBtnText}>{isUploading ? 'Uploading...' : 'Upload Record'}</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cancelBtn} onPress={() => setAddRecordModalVisible(false)} disabled={isUploading}>
                            <Text style={styles.cancelBtnText}>{t('profile.cancel')}</Text>
                        </TouchableOpacity>
                    </View>
                </BlurView>
            </Modal>

            {/* All Records Modal */}
            <Modal
                visible={allRecordsVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setAllRecordsVisible(false)}
            >
                <View style={[styles.container, { paddingTop: Platform.OS === 'ios' ? 20 : 20 }]}>
                    <View style={styles.closeHeaderInner}>
                        <Text style={styles.editTitle}>All Medical Records</Text>
                        <TouchableOpacity onPress={() => setAllRecordsVisible(false)} style={{ marginBottom: 24 }}>
                            <Ionicons name="close-circle" size={30} color={Colors.light.icon} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
                        {medicalRecords.map((rec) => (
                            <TouchableOpacity 
                                key={rec.id} 
                                style={styles.recordItem}
                                onPress={() => handleOpenRecord(rec)}
                            >
                                <Image source={{ uri: rec.image_url }} style={styles.recordImage} />
                                <View style={{ flex: 1, marginLeft: 14 }}>
                                    <Text style={styles.recordTitle}>{rec.title}</Text>
                                    <Text style={styles.recordDate}>{new Date(rec.created_at).toLocaleDateString()}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </Modal>

            {/* Record Viewer Modal */}
            <Modal
                visible={recordViewerVisible}
                transparent={true}
                onRequestClose={() => setRecordViewerVisible(false)}
            >
                <BlurView intensity={90} tint="dark" style={styles.modalOverlay}>
                    {selectedRecord && (
                        <View style={{ flex: 1, width: '100%' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 20, paddingTop: Platform.OS === 'ios' ? 60 : 30 }}>
                                <TouchableOpacity onPress={() => setRecordViewerVisible(false)}>
                                    <Ionicons name="close" size={32} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDeleteRecord(selectedRecord.id)}>
                                    <Ionicons name="trash" size={28} color="#FF3B30" />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ marginBottom: 24, alignItems: 'center' }}>
                                    {isEditingRecordTitle ? (
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <TextInput
                                                value={editRecordTitleValue}
                                                onChangeText={setEditRecordTitleValue}
                                                style={[styles.textInput, { color: '#000', width: 200, backgroundColor: '#fff', paddingVertical: 10 }]}
                                                autoFocus
                                            />
                                            <TouchableOpacity onPress={handleSaveRecordTitle} disabled={isSaving} style={{ marginLeft: 12, backgroundColor: Colors.light.primary, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 35 }}>
                                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>{isSaving ? 'Sav...' : 'Save'}</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => setIsEditingRecordTitle(false)} style={{ marginLeft: 12 }}>
                                                <Ionicons name="close-circle" size={36} color="#C7C7CC" />
                                            </TouchableOpacity>
                                        </View>
                                    ) : (
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ color: '#fff', fontSize: 24, fontWeight: '700' }}>{selectedRecord.title}</Text>
                                            <TouchableOpacity onPress={() => setIsEditingRecordTitle(true)} style={{ marginLeft: 12, padding: 4 }}>
                                                <Ionicons name="pencil" size={22} color="#C7C7CC" />
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    <Text style={{ color: '#C7C7CC', fontSize: 16, marginTop: 12 }}>{new Date(selectedRecord.created_at).toLocaleDateString()}</Text>
                                </View>
                                <Image source={{ uri: selectedRecord.image_url }} style={{ width: '90%', height: '70%', resizeMode: 'contain' }} />
                            </View>
                        </View>
                    )}
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
        borderRadius: 35,
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
    noBorder: {
        borderBottomWidth: 0,
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
    // Records
    recordItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#F2F2F7',
    },
    recordImage: {
        width: 50,
        height: 50,
        borderRadius: 35,
        backgroundColor: '#E5E5EA',
    },
    recordTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1C1C1E',
        marginBottom: 4,
    },
    recordDate: {
        fontSize: 13,
        color: '#8E8E93',
    },
    addRecordBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        backgroundColor: 'rgba(220,163,73,0.1)',
        borderRadius: 16,
        marginTop: 10,
        marginBottom: 20,
    },
    addRecordText: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.light.primary,
        marginLeft: 8,
    },
    imagePickerBtn: {
        height: 120,
        backgroundColor: '#F2F2F7',
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#C7C7CC',
        overflow: 'hidden',
    },
    imagePickerText: {
        fontSize: 14,
        color: '#8E8E93',
        marginTop: 8,
    },
    pickedImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
});
