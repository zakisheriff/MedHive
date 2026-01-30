import React from 'react';
import { TextInput, StyleSheet, View, Text, TextInputProps, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Colors } from '../constants/theme';

import { Ionicons } from '@expo/vector-icons';

interface InputProps extends Omit<TextInputProps, 'style'> {
    label?: string;
    style?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    iconName?: keyof typeof Ionicons.glyphMap;
}

export function Input({ label, style, inputStyle, iconName, ...props }: InputProps) {
    return (
        <View style={styles.wrapper}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputContainer, style]}>
                {iconName && (
                    <View style={styles.iconContainer}>
                        <Ionicons name={iconName} size={20} color={Colors.light.icon} />
                    </View>
                )}
                <TextInput
                    style={[styles.inputField, inputStyle]}
                    placeholderTextColor="#999"
                    {...props}
                />
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
    inputContainer: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 30, // Pill shape
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputField: {
        flex: 1,
        padding: 16,
        fontSize: 16,
        color: Colors.light.text,
    },
    iconContainer: {
        paddingLeft: 16,
        paddingRight: 4,
    },
});
