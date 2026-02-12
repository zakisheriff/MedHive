import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Colors } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProfileAvatar } from '../../components/ProfileAvatar';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { HistoryCard } from '../../components/HistoryCard';
import { FilterChips, FilterType } from '../../components/FilterChips';
import { EmptyHistoryState } from '../../components/EmptyHistoryState';
import { HistoryItem } from '../../types/history';
import { groupHistoryByDate, filterHistory, generateMockHistory } from '../../utils/historyUtils';
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next';

export default function HistoryScreen() {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');

    // TODO: Replace with actual data from backend/context
    const historyItems = useMemo(() => generateMockHistory(), []);

    // Filter and group history items
    const filteredItems = useMemo(
        () => filterHistory(historyItems, selectedFilter, searchQuery),
        [historyItems, selectedFilter, searchQuery]
    );

    const groupedHistory = useMemo(
        () => groupHistoryByDate(filteredItems),
        [filteredItems]
    );

    const handleClearSearch = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSearchQuery('');
    };

    return (
        <View style={styles.container}>
            {/* Header with Profile Avatar */}
            <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
                <View>
                    <Text style={styles.headerTitle}>{t('history.title')}</Text>
                    {historyItems.length > 0 && (
                        <Text style={styles.headerSubtitle}>
                            {filteredItems.length} {filteredItems.length === 1 ? t('history.record') : t('history.records')}
                        </Text>
                    )}
                </View>
                <ProfileAvatar size={34} />
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#8E8E93" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder={t('history.searchPlaceholder')}
                        placeholderTextColor="#8E8E93"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        clearButtonMode="never"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity
                            onPress={handleClearSearch}
                            style={styles.clearButton}
                        >
                            <Ionicons name="close-circle" size={20} color="#8E8E93" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Filter Chips */}
            {historyItems.length > 0 && (
                <View style={styles.filterContainer}>
                    <FilterChips
                        selectedFilter={selectedFilter}
                        onFilterChange={setSelectedFilter}
                    />
                </View>
            )}

            {/* History List */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {groupedHistory.length === 0 ? (
                    <EmptyHistoryState />
                ) : (
                    groupedHistory.map((yearGroup) => (
                        <View key={yearGroup.year} style={styles.yearContainer}>
                            <Text style={styles.yearTitle}>{yearGroup.year}</Text>

                            {yearGroup.months.map((monthGroup, monthIndex) => (
                                <View key={`${yearGroup.year}-${monthIndex}`} style={styles.monthContainer}>
                                    <View style={styles.groupHeader}>
                                        <View style={styles.groupHeaderLine} />
                                        <Text style={styles.groupTitle}>{monthGroup.monthLabel}</Text>
                                        <View style={styles.groupHeaderLine} />
                                    </View>

                                    {monthGroup.items.map((item) => (
                                        <HistoryCard
                                            key={item.id}
                                            item={item}
                                            onPress={() => {
                                                router.push(`/history/${item.id}`);
                                            }}
                                        />
                                    ))}
                                </View>
                            ))}
                        </View>
                    ))
                )}
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
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingBottom: 12,
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 2,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#8E8E93',
        fontWeight: '500',
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingBottom: 12,
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
    },
    filterContainer: {
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.light.background,
        height: 35,
        paddingHorizontal: 16,
        borderRadius: 35,
        gap: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: Colors.light.text,
        padding: 0,
        ...Platform.select({
            web: {
                outlineStyle: 'none',
            } as any,
        }),
    },
    clearButton: {
        padding: 2,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 140,
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
    },
    groupContainer: {
        marginBottom: 24,
    },
    groupHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 8,
    },
    groupHeaderLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E2E8F0',
    },
    groupTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: Colors.light.primary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginHorizontal: 12,
    },
    yearContainer: {
        marginBottom: 24,
    },
    yearTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.light.text,
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    monthContainer: {
        marginBottom: 16,
    },
});
