import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';

export function EmptyHistoryState() {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[Colors.light.primary + '20', Colors.light.primary + '10']}
                style={styles.iconContainer}
            >
                <Ionicons name="document-text-outline" size={48} color={Colors.light.primary} />
            </LinearGradient>
            <Text style={styles.title}>No Records Yet</Text>
            <Text style={styles.subtitle}>
                Your scanned prescriptions and lab reports{'\n'}will appear here
            </Text>
            <View style={styles.hintContainer}>
                <Ionicons name="arrow-up" size={20} color={Colors.light.primary} />
                <Text style={styles.hintText}>Start by uploading a document</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        paddingHorizontal: 40,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: '#8E8E93',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    hintContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF7ED',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        gap: 8,
        borderWidth: 1,
        borderColor: Colors.light.primary + '30',
    },
    hintText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.primary,
    },
});
