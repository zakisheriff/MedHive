import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/theme';
import { useTranslation } from 'react-i18next';
import { HistoryItemType } from '../types/history';

export type FilterType = 'all' | HistoryItemType | 'active' | 'completed';

interface FilterChipsProps {
    selectedFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
}

export function FilterChips({ selectedFilter, onFilterChange }: FilterChipsProps) {
    const { t } = useTranslation();

    const filters: { id: FilterType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
        { id: 'all', label: t('history.filters.all'), icon: 'grid-outline' },
        { id: 'prescription', label: t('history.filters.prescription'), icon: 'receipt-outline' },
        { id: 'labReport', label: t('history.filters.labReport'), icon: 'flask-outline' },
    ];

    const handleFilterPress = (filterId: FilterType) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onFilterChange(filterId);
    };

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            {filters.map((filter) => {
                const isSelected = selectedFilter === filter.id;
                return (
                    <TouchableOpacity
                        key={filter.id}
                        style={[styles.chip, isSelected && styles.chipSelected]}
                        onPress={() => handleFilterPress(filter.id)}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={filter.icon}
                            size={14}
                            color={isSelected ? '#fff' : Colors.light.primary}
                        />
                        <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                            {filter.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        gap: 8,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 35,
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: Colors.light.primary,
        gap: 6,
        marginRight: 8,
        height: 35,
    },
    chipSelected: {
        backgroundColor: Colors.light.primary,
        borderColor: Colors.light.primary,
    },
    chipText: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.light.primary,
    },
    chipTextSelected: {
        color: '#fff',
    },
});
