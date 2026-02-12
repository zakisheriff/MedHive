import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet, Text, Platform } from 'react-native';
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

    const isLeapYear = (year: number) => {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    };

    const getMaxDays = (m: string, y: string) => {
        const monthNum = parseInt(m);
        const yearNum = parseInt(y);

        if (!monthNum) return 31; // Default to max possible if month not entered

        switch (monthNum) {
            case 2: // February
                if (!yearNum) return 29; // Allow 29 before year is entered
                return isLeapYear(yearNum) ? 29 : 28;
            case 4: case 6: case 9: case 11:
                return 30;
            default:
                return 31;
        }
    };

    const handleDayChange = (text: string) => {
        const numericText = text.replace(/[^0-9]/g, '');
        const dayNum = parseInt(numericText);
        const maxDays = getMaxDays(month, year);

        if (numericText && (dayNum < 1 || dayNum > maxDays)) {
            return;
        }

        setDay(numericText);
        onDateChange(numericText, month, year);
        if (numericText.length === 2) monthRef.current?.focus();
    };

    const handleMonthChange = (text: string) => {
        const numericText = text.replace(/[^0-9]/g, '');
        const monthNum = parseInt(numericText);

        if (numericText && (monthNum < 1 || monthNum > 12)) {
            return;
        }

        let newDay = day;
        if (numericText) {
            const maxDays = getMaxDays(numericText, year);
            if (day && parseInt(day) > maxDays) {
                newDay = maxDays.toString();
                setDay(newDay);
            }
        }

        setMonth(numericText);
        onDateChange(newDay, numericText, year);
        if (numericText.length === 2) yearRef.current?.focus();
        if (numericText.length === 0) dayRef.current?.focus();
    };

    const handleYearChange = (text: string) => {
        const numericText = text.replace(/[^0-9]/g, '');

        let newDay = day;
        if (numericText.length === 4) {
            const maxDays = getMaxDays(month, numericText);
            if (day && parseInt(day) > maxDays) {
                newDay = maxDays.toString();
                setDay(newDay);
            }
        }

        setYear(numericText);
        onDateChange(newDay, month, numericText);
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
        color: '#334155',
        marginBottom: 8,
        fontWeight: '600',
        marginLeft: 4,
    },
    container: {
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 35,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    iconContainer: {
        marginRight: 8,
    },
    inputsRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    inputPiece: {
        paddingVertical: 16,
        fontSize: 15,
        color: '#334155',
        textAlign: 'center',
        minWidth: 0,
        ...Platform.select({
            web: {
                outlineStyle: 'none',
            } as any,
        }),
    },
    separator: {
        fontSize: 16,
        color: '#94A3B8',
        marginHorizontal: 2,
    },
});
