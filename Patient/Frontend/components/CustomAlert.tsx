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
        borderRadius: 28,
        width: Math.min(width * 0.8, 400),
        overflow: 'hidden',
        // Material/Apple hybrid shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    alertContent: {
        padding: 24,
        alignItems: 'center',
    },
    title: {
        fontSize: 19,
        fontWeight: '700',
        color: '#1C1C1E',
        textAlign: 'center',
        marginBottom: 8,
    },
    message: {
        fontSize: 15,
        color: '#636366',
        textAlign: 'center',
        lineHeight: 22,
    },
    buttonContainer: {
        borderTopWidth: 1,
        borderTopColor: '#F2F2F7',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    button: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '50%',
    },
    flexButton: {
        flex: 1,
        minWidth: 0,
    },
    buttonBorder: {
        borderRightWidth: 1,
        borderRightColor: '#F2F2F7',
    },
    buttonText: {
        fontSize: 17,
        fontWeight: '600',
        color: Colors.light.primary,
    },
    destructiveText: {
        color: '#FF3B30',
    },
    cancelText: {
        color: '#8E8E93',
        fontWeight: '500',
    },
});
