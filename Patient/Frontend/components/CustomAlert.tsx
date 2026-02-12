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

    if (!options && !visible) return null;
    const { title, message, buttons } = options || { title: '' };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="none"
            onRequestClose={hideAlert}
        >
            <BlurView intensity={30} tint="light" style={styles.overlay}>
                <Pressable style={styles.backdrop} onPress={hideAlert} />

                <View style={styles.alertContainer}>
                    <View style={styles.alertContent}>
                        <Text style={styles.title}>{title}</Text>
                        {message && <Text style={styles.message}>{message}</Text>}
                    </View>

                    <View style={[
                        styles.buttonContainer,
                        buttons && buttons.length === 2 ? styles.horizontalButtons : styles.verticalButtons
                    ]}>
                        {buttons && buttons.length > 0 ? (
                            buttons.map((btn, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.button,
                                        btn.style === 'cancel' ? styles.cancelButton : styles.primaryActionButton,
                                        buttons.length === 2 ? styles.flexButton : styles.fullWidth
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
                            <TouchableOpacity
                                style={[styles.button, styles.primaryActionButton, styles.fullWidth]}
                                onPress={hideAlert}
                            >
                                <Text style={styles.buttonText}>OK</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </BlurView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    alertContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 35,
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
        paddingHorizontal: 20,
        paddingBottom: 24,
        gap: 12,
    },
    horizontalButtons: {
        flexDirection: 'row',
    },
    verticalButtons: {
        flexDirection: 'column',
    },
    button: {
        height: 52,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
    },
    flexButton: {
        flex: 1,
    },
    fullWidth: {
        width: '100%',
    },
    primaryActionButton: {
        backgroundColor: 'rgba(220, 163, 73, 0.08)',
        borderWidth: 1,
        borderColor: 'rgba(220, 163, 73, 0.15)',
    },
    cancelButton: {
        backgroundColor: '#F2F2F7',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.light.primary,
        letterSpacing: 0.3,
    },
    destructiveText: {
        color: '#FF3B30',
    },
    cancelText: {
        color: '#64748B',
    },
});
