import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Dimensions,
    Platform,
    Pressable,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';
import { Colors } from '../constants/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface LanguagePickerProps {
    visible: boolean;
    onClose: () => void;
}

export const LANGUAGES = [
    { code: 'en', name: 'English', nativeName: 'English', icon: '🇺🇸' },
    { code: 'si', name: 'Sinhala', nativeName: 'සිංහල', icon: '🇱🇰' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', icon: '🇮🇳' },
];

export function LanguagePicker({ visible, onClose }: LanguagePickerProps) {
    const { i18n, t } = useTranslation();

    const handleSelect = (code: string) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        i18n.changeLanguage(code);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            onRequestClose={onClose}
        >
            <BlurView intensity={30} tint="dark" style={styles.overlay}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
                <View style={styles.card}>
                    <View style={styles.header}>
                        <Text style={styles.title}>{t('profile.language')}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Ionicons name="close" size={24} color="#8E8E93" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.list}>
                        {LANGUAGES.map((lang) => {
                            const isActive = i18n.language === lang.code;
                            return (
                                <TouchableOpacity
                                    key={lang.code}
                                    style={[styles.item, isActive && styles.itemActive]}
                                    onPress={() => handleSelect(lang.code)}
                                >
                                    <View style={styles.itemLeft}>
                                        <Text style={styles.flag}>{lang.icon}</Text>
                                        <View>
                                            <Text style={[styles.name, isActive && styles.textActive]}>
                                                {lang.name}
                                            </Text>
                                            <Text style={styles.nativeName}>{lang.nativeName}</Text>
                                        </View>
                                    </View>
                                    {isActive && (
                                        <Ionicons name="checkmark-circle" size={24} color={Colors.light.primary} />
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </BlurView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    card: {
        width: '100%',
        maxWidth: Platform.OS === 'web' ? 480 : '100%',
        backgroundColor: '#fff',
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 40 : 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1C1C1E',
    },
    closeBtn: {
        padding: 4,
    },
    list: {
        gap: 12,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 35,
        backgroundColor: '#F2F2F7',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    itemActive: {
        backgroundColor: 'rgba(220,163,73,0.08)',
        borderColor: 'rgba(220,163,73,0.2)',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    flag: {
        fontSize: 24,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1C1E',
    },
    nativeName: {
        fontSize: 14,
        color: '#8E8E93',
        marginTop: 2,
    },
    textActive: {
        color: Colors.light.primary,
    },
});
