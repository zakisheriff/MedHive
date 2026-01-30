import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HoneyContainer } from '../../components/HoneyContainer';
import { Colors } from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <View style={[styles.contentWrapper, { paddingTop: insets.top + 20, paddingBottom: 120 }]}>
                <HoneyContainer>
                    <View style={styles.content}>
                        <Text style={styles.title}>Profile</Text>
                        <Text style={styles.subtitle}>Manage your profile here.</Text>
                    </View>
                </HoneyContainer>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    contentWrapper: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: 'center',
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.light.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
    },
});

