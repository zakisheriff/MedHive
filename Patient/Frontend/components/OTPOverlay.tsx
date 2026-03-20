import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Modal } from 'react-native';
import { useAccess } from '../context/AccessContext';
import { Colors } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

export const OTPOverlay = () => {
    const { activeOtp, isOtpDismissed, dismissOtp } = useAccess();
    const [fadeAnim] = React.useState(new Animated.Value(0));

    React.useEffect(() => {
        if (activeOtp && !isOtpDismissed) {
            Animated.spring(fadeAnim, {
                toValue: 1,
                useNativeDriver: true,
                tension: 50,
                friction: 7
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            }).start();
        }
    }, [activeOtp, isOtpDismissed]);

    if (!activeOtp || isOtpDismissed) return null;

    return (
        <Modal transparent animationType="fade" visible={true} onRequestClose={dismissOtp}>
            <View style={styles.container}>
                <Animated.View 
                    style={[
                        styles.modalContent, 
                        { opacity: fadeAnim, transform: [{ scale: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) }] }
                    ]}
                >
                    <View style={styles.solidBackground}>
                        <TouchableOpacity style={styles.closeButton} onPress={dismissOtp}>
                            <Ionicons name="close" size={24} color="#64748B" />
                        </TouchableOpacity>

                        <View style={styles.header}>
                            <View style={styles.iconContainer}>
                                <Ionicons name="shield-checkmark" size={32} color={Colors.light.primary} />
                            </View>
                            <Text style={styles.label}>DOCTOR ACCESS REQUEST</Text>
                        </View>

                        <View style={styles.otpSection}>
                            <Text style={styles.otpValue}>{activeOtp}</Text>
                            <Text style={styles.subtext}>Provide this code to the doctor to share your records</Text>
                        </View>

                        <TouchableOpacity style={styles.footerButton} onPress={dismissOtp}>
                            <Text style={styles.footerButtonText}>Got it</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)', // Slightly darker overlay
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    modalContent: {
        width: '100%',
        maxWidth: 320,
        borderRadius: 32,
        backgroundColor: '#fff', // Use solid white background
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    solidBackground: {
        padding: 32,
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 16,
        right: 16,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: 'rgba(224, 182, 114, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    label: {
        fontSize: 12,
        fontWeight: '800',
        color: Colors.light.primary,
        letterSpacing: 2,
        textAlign: 'center',
    },
    otpSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    otpValue: {
        fontSize: 72,
        fontWeight: '900',
        color: Colors.light.text,
        letterSpacing: 8,
        marginBottom: 12,
    },
    subtext: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 10,
    },
    footerButton: {
        width: '100%',
        height: 56,
        backgroundColor: Colors.light.primary,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    footerButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    }
});
