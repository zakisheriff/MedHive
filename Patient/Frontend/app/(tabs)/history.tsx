import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { HoneyContainer } from '../../components/HoneyContainer';
import { Colors } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProfileAvatar } from '../../components/ProfileAvatar';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen() {
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <View style={styles.container}>
            {/* Header with Profile Avatar */}
            <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                <Text style={styles.headerTitle}>History</Text>
                <ProfileAvatar size={34} />
            </View>

            {/* Search Bar on History Page */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#8E8E93" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search records..."
                        placeholderTextColor="#8E8E93"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        clearButtonMode="while-editing"
                    />
                </View>
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
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.light.text,
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingBottom: 16,
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E9E9EB',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 12,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 17,
        color: '#000',
        padding: 0, // Remove default platform padding
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 120,
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
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
