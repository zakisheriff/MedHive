import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Pressable,
    Platform,
    Dimensions
} from 'react-native';
import { BlurView } from 'expo-blur';
import { useAlert } from '../context/AlertContext';
import { Colors } from '../constants/theme';

const { width } = Dimensions.get('window');

export function CustomAlert() {
    const { alertState, hideAlert } = useAlert();
    const { visible, options } = alertState;

    if (!options) return null;

    const { title, message, buttons } = options;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={hideAlert}
        >
            <View style={styles.overlay}>
                {Platform.OS === 'web' ? (
                    <Pressable style={styles.backdrop} onPress={hideAlert} />
                ) : (
                    <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                )}

                <View style={styles.alertContainer}>
                    <View style={styles.alertContent}>
                        <Text style={styles.title}>{title}</Text>
                        {message && <Text style={styles.message}>{message}</Text>}
                    </View>

                    <View style={styles.buttonContainer}>
                        {buttons && buttons.length > 0 ? (
                            buttons.map((btn, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.button,
                                        index < buttons.length - 1 && styles.buttonBorder,
                                        buttons.length === 2 && styles.flexButton
                                    ]}
                                    onPress={() => {
                                        hideAlert();
                                        btn.onPress?.();
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.buttonText,
                                            btn.style === 'destructive' && styles.destructiveText,
                                            btn.style === 'cancel' && styles.cancelText
                                        ]}
                                    >
                                        {btn.text}
                                    </Text>
                                </TouchableOpacity>
                            ))
                        ) : (
                            <TouchableOpacity style={styles.button} onPress={hideAlert}>
                                <Text style={styles.buttonText}>OK</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    alertContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 35,
        width: Math.min(width * 0.85, 360), // Slightly more compact
        overflow: 'hidden',
        // Smoother shadow
    },
    alertContent: {
        paddingTop: 20,
        paddingHorizontal: 24,
        paddingBottom: 16,
        alignItems: 'flex-start', // Standard material alignment
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1C1C1E',
        textAlign: 'left',
        marginBottom: 12,
    },
    message: {
        fontSize: 16,
        color: '#636366',
        textAlign: 'left',
        lineHeight: 22,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end', // Align buttons to right
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 8,
    },
    button: {
        paddingHorizontal: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 35,
    },
    flexButton: {
        // No longer flexing to full width
    },
    buttonBorder: {
        // Removed lines
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.light.primary,
        letterSpacing: 0.5,
    },
    destructiveText: {
        color: '#FF3B30',
    },
    cancelText: {
        color: '#8E8E93',
    },
});
