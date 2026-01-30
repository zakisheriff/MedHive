import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, StyleProp, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';

interface SocialButtonProps {
    onPress: () => void;
    title: string;
    style?: StyleProp<ViewStyle>;
}

export function SocialButton({ onPress, title, style }: SocialButtonProps) {
    return (
        <TouchableOpacity
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onPress();
            }}
            activeOpacity={0.8}
            style={[styles.button, style]}
        >
            <Image
                source={require('../assets/images/google-logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        width: '100%',
        marginBottom: 16,
    },
    logo: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333333',
    },
});
