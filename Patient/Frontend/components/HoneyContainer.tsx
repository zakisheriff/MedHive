
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
        backgroundColor: '#FFFFFF',
        borderRadius: 35,
        padding: 24,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
});

