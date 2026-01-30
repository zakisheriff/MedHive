
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../constants/theme';

interface PrimaryButtonProps {
    title: string;
    onPress: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export function PrimaryButton({ title, onPress, style, textStyle }: PrimaryButtonProps) {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress} activeOpacity={0.8}>
            <Text style={[styles.text, textStyle]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: Colors.light.primary,
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 50, // Pill shape
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
});
