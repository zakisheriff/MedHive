import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import { useTranslation } from 'react-i18next';

export function EmptyHistoryState() {
    const { t } = useTranslation();
    return (
        <View style={styles.container}>
            <View style={styles.iconWrapper}>
                <LinearGradient
                    colors={[Colors.light.primary + '15', Colors.light.primary + '08']}
                    style={styles.iconContainer}
                >
                    <Ionicons name="document-text-outline" size={40} color={Colors.light.primary} />
                </LinearGradient>
            </View>
            <Text style={styles.title}>{t('history.noRecords')}</Text>
            <Text style={styles.subtitle}>
                {t('history.noRecordsSub')}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        paddingHorizontal: 40,
        minHeight: 400,
    },
    iconWrapper: {
        marginBottom: 20,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: '#8E8E93',
        textAlign: 'center',
        lineHeight: 22,
    },
});
