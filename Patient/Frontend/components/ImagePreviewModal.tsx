import React from 'react';
import {
    Modal,
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    SafeAreaView,
    StatusBar,
    Platform,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

interface ImagePreviewModalProps {
    isVisible: boolean;
    imageUri: any;
    onClose: () => void;
}

export function ImagePreviewModal({ isVisible, imageUri, onClose }: ImagePreviewModalProps) {
    if (!imageUri) return null;

    const handleClose = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onClose();
    };

    return (
        <Modal
            visible={isVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleClose}
        >
            <StatusBar barStyle="light-content" />
            <View style={styles.container}>
                <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />

                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={handleClose}
                            style={styles.closeButton}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="close" size={28} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.imageContainer}>
                        <Image
                            source={imageUri}
                            style={styles.image}
                            contentFit="contain"
                            transition={200}
                        />
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.9)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    safeArea: {
        flex: 1,
        width: '100%',
        maxWidth: Platform.OS === 'web' ? 500 : '100%',
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    closeButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    image: {
        width: '100%',
        height: '100%',
    },
});
