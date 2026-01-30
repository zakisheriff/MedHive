import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Colors } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Premium Glassmorphic Tab Bar for Android & Web
 * 
 * A floating dock-style navigation bar with:
 * - Glassmorphism effect using BlurView (native) or backdrop-filter (web)
 * - Premium Apple-style floating dock design
 * - Subtle borders, shadows, and active state indicators
 * - Ionicons for cross-platform icon support
 */

type IconName = keyof typeof Ionicons.glyphMap;

interface TabConfig {
    focused: IconName;
    unfocused: IconName;
}

const TAB_ICONS: Record<string, TabConfig> = {
    profile: { focused: 'person', unfocused: 'person-outline' },
    upload: { focused: 'cloud-upload', unfocused: 'cloud-upload-outline' },
    history: { focused: 'time', unfocused: 'time-outline' },
    access: { focused: 'key', unfocused: 'key-outline' },
};

export function GlassmorphicTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();

    const renderTabItem = (route: typeof state.routes[0], index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const iconConfig = TAB_ICONS[route.name] || { focused: 'help-circle', unfocused: 'help-circle-outline' };
        const iconName = isFocused ? iconConfig.focused : iconConfig.unfocused;

        const onPress = () => {
            const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
            }
        };

        const onLongPress = () => {
            navigation.emit({
                type: 'tabLongPress',
                target: route.key,
            });
        };

        return (
            <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tabItem}
                activeOpacity={0.7}
            >
                <View style={[
                    styles.iconContainer,
                    isFocused && styles.iconContainerActive
                ]}>
                    <Ionicons
                        name={iconName}
                        size={22}
                        color={isFocused ? Colors.light.primary : Colors.light.icon}
                    />
                </View>
            </TouchableOpacity>
        );
    };

    // For web, we use CSS backdrop-filter; for native, we use BlurView
    const isWeb = Platform.OS === 'web';

    return (
        <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            <View style={styles.dockWrapper}>
                {isWeb ? (
                    // Web: Use CSS backdrop-filter for glassmorphism
                    <View style={[styles.dock, styles.dockWeb]}>
                        {state.routes.map(renderTabItem)}
                    </View>
                ) : (
                    // Native (Android): Use BlurView for glassmorphism
                    <BlurView
                        intensity={80}
                        tint="light"
                        style={styles.dock}
                    >
                        <View style={styles.dockInner}>
                            {state.routes.map(renderTabItem)}
                        </View>
                    </BlurView>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        backgroundColor: 'transparent',
        pointerEvents: 'box-none',
    },
    dockWrapper: {
        width: '88%',
        maxWidth: 400,
        marginBottom: 4,
    },
    dock: {
        flexDirection: 'row',
        borderRadius: 32,
        paddingVertical: 12,
        paddingHorizontal: 8,
        justifyContent: 'space-around',
        alignItems: 'center',
        overflow: 'hidden',
        // Subtle border for glass effect
        borderWidth: 0.5,
        borderColor: 'rgba(255, 255, 255, 0.35)',
        // Premium shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
        elevation: 12,
    },
    dockWeb: {
        // Web-specific glassmorphism using backdrop-filter
        backgroundColor: 'rgba(255, 255, 255, 0.72)',
        // @ts-ignore - Web-only property
        backdropFilter: 'blur(20px) saturate(180%)',
        // @ts-ignore - Safari fallback
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    },
    dockInner: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    iconContainerActive: {
        backgroundColor: 'rgba(220, 163, 73, 0.15)', // Honey primary with 15% opacity
        // Subtle inner glow effect
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
});
