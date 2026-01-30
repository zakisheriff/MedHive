import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { HoneyContainer } from '../../components/HoneyContainer';
import { Colors } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProfileAvatar } from '../../components/ProfileAvatar';

export default function HistoryScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            {/* Header with Profile Avatar */}
            <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                <Text style={styles.headerTitle}>History</Text>
                <ProfileAvatar size={34} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <HoneyContainer>
                    <View style={styles.content}>
                        <Text style={styles.subtitle}>Your upload history will appear here.</Text>
                    </View>
                </HoneyContainer>
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
        paddingBottom: 8,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.light.text,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingBottom: 120,
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    subtitle: {
        fontSize: 16,
        color: '#8E8E93',
        textAlign: 'center',
    },
});
