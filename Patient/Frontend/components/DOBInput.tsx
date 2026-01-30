import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet, Text, TextInputProps } from 'react-native';
import { Colors } from '../constants/theme';

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
        setDay(numericText);
        onDateChange(numericText, month, year);
        if (numericText.length === 2) monthRef.current?.focus();
    };

    const handleMonthChange = (text: string) => {
        const numericText = text.replace(/[^0-9]/g, '');
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
        <View style={styles.container}>
            <Text style={styles.label}>Date of Birth</Text>
            <View style={styles.row}>
                <TextInput
                    ref={dayRef}
                    style={[styles.input, styles.dayMonth]}
                    placeholder="DD"
                    placeholderTextColor="#999"
                    keyboardType="number-pad"
                    maxLength={2}
                    value={day}
                    onChangeText={handleDayChange}
                />
                <TextInput
                    ref={monthRef}
                    style={[styles.input, styles.dayMonth]}
                    placeholder="MM"
                    placeholderTextColor="#999"
                    keyboardType="number-pad"
                    maxLength={2}
                    value={month}
                    onChangeText={handleMonthChange}
                />
                <TextInput
                    ref={yearRef}
                    style={[styles.input, styles.year]}
                    placeholder="YYYY"
                    placeholderTextColor="#999"
                    keyboardType="number-pad"
                    maxLength={4}
                    value={year}
                    onChangeText={handleYearChange}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
        width: '100%',
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        fontWeight: '600',
        marginLeft: 4,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: Colors.light.text,
        textAlign: 'center',
    },
    dayMonth: {
        flex: 1,
    },
    year: {
        flex: 1.5,
    },
});
