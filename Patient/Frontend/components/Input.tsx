import React, { useState } from 'react';
import { TextInput, StyleSheet, View, Text, TextInputProps, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';

interface InputProps extends Omit<TextInputProps, 'style'> {
    label?: string;
    style?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
}

export function Input({ label, style, inputStyle, ...props }: InputProps) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const isPassword = props.secureTextEntry;

    return (
        <View style={styles.wrapper}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.inputContainer, style]}>
                <TextInput
                    style={[styles.inputField, inputStyle]}
                    placeholderTextColor="#999"
                    {...props}
                    secureTextEntry={isPassword && !isPasswordVisible}
                />
                {isPassword && (
                    <TouchableOpacity
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        style={styles.iconContainer}
                    >
                        <Ionicons
                            name={isPasswordVisible ? 'eye-off' : 'eye'}
                            size={24}
                            color="#999"
                        />
                    </TouchableOpacity>
                )}
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
        borderRadius: 12,
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
        padding: 12,
    },
});
