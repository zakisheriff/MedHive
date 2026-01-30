
import React from 'react';
import { TextInput, StyleSheet, View, Text, TextInputProps } from 'react-native';
import { Colors } from '../constants/theme';

interface InputProps extends TextInputProps {
    label?: string;
}

export function Input({ label, style, ...props }: InputProps) {
    return (
        <View style={styles.wrapper}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[styles.input, style]}
                placeholderTextColor="#999"
                {...props}
            />
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
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: Colors.light.text,
    },
});
