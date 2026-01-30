
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
        backgroundColor: '#FFFFFF', // Pure, solid white for max contrast
        borderRadius: 24, // Slightly smoother curve
        padding: 24,
        // Premium diffused shadow (Apple Style)
        shadowColor: 'rgba(0, 0, 0, 0.05)', // Extremely subtle black
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1, // Handled by rgba above
        shadowRadius: 20, // Huge blur for softness
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F1F5F9', // Subtle stroke
    },
});
