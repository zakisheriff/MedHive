import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';
import { Colors } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface DOBInputProps {
    onDateChange: (day: string, month: string, year: string) => void;
}

export function DOBInput({ onDateChange }: DOBInputProps) {
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');

    const dayRef = useRef<TextInput>(null);
    const monthRef = useRef<TextInput>(null);
    const yearRef = useRef<TextInput>(null);

    const handleDayChange = (text: string) => {
        const numericText = text.replace(/[^0-9]/g, '');
        const dayNum = parseInt(numericText);

        // Validate day (1-31)
        if (numericText && (dayNum < 1 || dayNum > 31)) {
            return; // Don't update if invalid
        }

        setDay(numericText);
        onDateChange(numericText, month, year);
        if (numericText.length === 2) monthRef.current?.focus();
    };

    const handleMonthChange = (text: string) => {
        const numericText = text.replace(/[^0-9]/g, '');
        const monthNum = parseInt(numericText);

        // Validate month (1-12)
        if (numericText && (monthNum < 1 || monthNum > 12)) {
            return; // Don't update if invalid
        }

        setMonth(numericText);
        onDateChange(day, numericText, year);
        if (numericText.length === 2) yearRef.current?.focus();
        if (numericText.length === 0) dayRef.current?.focus();
    };

    const handleYearChange = (text: string) => {
        const numericText = text.replace(/[^0-9]/g, '');
        setYear(numericText);
        onDateChange(day, month, numericText);
        if (numericText.length === 0) monthRef.current?.focus();
    };

    return (
        <View style={styles.wrapper}>
            <Text style={styles.label}>Date of Birth</Text>
            <View style={styles.container}>
                <View style={styles.iconContainer}>
                    <Ionicons name="calendar-outline" size={20} color={Colors.light.icon} />
                </View>
                <View style={styles.inputsRow}>
                    <TextInput
                        ref={dayRef}
                        style={[styles.inputPiece, { flex: 1 }]}
                        placeholder="DD"
                        placeholderTextColor="#999"
                        keyboardType="number-pad"
                        maxLength={2}
                        value={day}
                        onChangeText={handleDayChange}
                    />
                    <Text style={styles.separator}>/</Text>
                    <TextInput
                        ref={monthRef}
                        style={[styles.inputPiece, { flex: 1 }]}
                        placeholder="MM"
                        placeholderTextColor="#999"
                        keyboardType="number-pad"
                        maxLength={2}
                        value={month}
                        onChangeText={handleMonthChange}
                    />
                    <Text style={styles.separator}>/</Text>
                    <TextInput
                        ref={yearRef}
                        style={[styles.inputPiece, { flex: 1.5 }]}
                        placeholder="YYYY"
                        placeholderTextColor="#999"
                        keyboardType="number-pad"
                        maxLength={4}
                        value={year}
                        onChangeText={handleYearChange}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontWeight: '600',
        marginLeft: 4,
    },
    container: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 30, // Pill shape
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 16,
        overflow: 'hidden', // Ensure pill shape is maintained
    },
    iconContainer: {
        paddingLeft: 16,
        paddingRight: 8,
    },
    inputsRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // More robust distribution
    },
    inputPiece: {
        paddingVertical: 16,
        fontSize: 16,
        color: Colors.light.text,
        textAlign: 'center',
        minWidth: 0, // CRITICAL: Allows flex items to shrink on Web
    },
    separator: {
        fontSize: 16,
        color: '#999',
        marginHorizontal: 2, // Tighter spacing
    },
});
