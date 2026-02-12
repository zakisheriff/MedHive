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

                    <View style={[
                        styles.buttonContainer,
                        buttons && buttons.length > 2 && styles.verticalButtons
                    ]}>
                        {buttons && buttons.length > 0 ? (
                            buttons.map((btn, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.button,
                                        buttons.length > 2 ? styles.verticalButtonBorder : (index < buttons.length - 1 && styles.buttonBorder),
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
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    alertContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 28,
        width: Math.min(width * 0.82, 340),
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },
    alertContent: {
        paddingTop: 28,
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#1C1C1E',
        textAlign: 'center',
        marginBottom: 8,
    },
    message: {
        fontSize: 15,
        color: '#3A3A3C',
        textAlign: 'center',
        lineHeight: 22,
        opacity: 0.85,
    },
    buttonContainer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#F2F2F7',
    },
    button: {
        flex: 1,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flexButton: {
        flex: 1,
    },
    buttonBorder: {
        borderRightWidth: 1,
        borderRightColor: '#F2F2F7',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.light.primary,
        letterSpacing: 0.3,
    },
    verticalButtons: {
        flexDirection: 'column',
    },
    verticalButtonBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    destructiveText: {
        color: '#FF3B30',
        fontWeight: '700',
    },
    cancelText: {
        color: '#8E8E93',
        fontWeight: '500',
    },
});
