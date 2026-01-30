import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { HoneyContainer } from '../../components/HoneyContainer';
import { Colors } from '../../constants/theme';

export default function UploadScreen() {
    return (
        <View style={styles.container}>
            <HoneyContainer>
                <View style={styles.content}>
                    <Text style={styles.title}>Upload</Text>
                    <Text style={styles.subtitle}>Upload medical documents here.</Text>
                </View>
            </HoneyContainer>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
