
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../constants/theme';

interface HoneyContainerProps {
    children: React.ReactNode;
    style?: ViewStyle;
}

export function HoneyContainer({ children, style }: HoneyContainerProps) {
    return (
        <View style={[styles.container, style]}>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        maxWidth: 450,
        alignSelf: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)', // Glass-ish
        borderRadius: 20,
        padding: 20,
        shadowColor: Colors.light.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8, // Android shadow
        borderWidth: 1,
        borderColor: Colors.light.border,
    },
});
