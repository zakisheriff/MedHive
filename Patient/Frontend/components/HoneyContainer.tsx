
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
        flex: 1,
        width: '100%',
        maxWidth: 450,
        alignSelf: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        marginTop: 60,
        marginBottom: 100,
        marginHorizontal: 16,
        // Premium diffused shadow (Apple Style)
        shadowColor: 'rgba(0, 0, 0, 0.05)',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
});

