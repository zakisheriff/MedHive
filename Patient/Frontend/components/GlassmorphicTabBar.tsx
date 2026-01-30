import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Colors } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Premium Pill Tab Bar for Android & Web
 * 
 * A floating pill-style navigation bar with:
 * - Clean white background with soft shadows
 * - Active tab shows horizontal pill with icon + label
 * - Inactive tabs show icon only
 * - Matches the reference "One Atom" design
 */

type IconName = keyof typeof Ionicons.glyphMap;

interface TabConfig {
    focused: IconName;
    unfocused: IconName;
    label: string;
}

const TAB_ICONS: Record<string, TabConfig> = {
    profile: { focused: 'person', unfocused: 'person-outline', label: 'Profile' },
    upload: { focused: 'document-text', unfocused: 'document-text-outline', label: 'Upload' },
    history: { focused: 'time', unfocused: 'time-outline', label: 'History' },
    access: { focused: 'key', unfocused: 'key-outline', label: 'Access' },
};

export function GlassmorphicTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();

    const renderTabItem = (route: typeof state.routes[0], index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const iconConfig = TAB_ICONS[route.name] || { focused: 'help-circle', unfocused: 'help-circle-outline', label: 'Tab' };
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
                style={[
                    styles.tabItem,
                    isFocused && styles.tabItemActive
                ]}
                activeOpacity={0.7}
            >
                <Ionicons
                    name={iconName}
                    size={22}
                    color={isFocused ? Colors.light.primary : '#1C1C1E'}
                />
                {isFocused && (
                    <Text style={styles.activeLabel}>{iconConfig.label}</Text>
                )}
            </TouchableOpacity>
        );
    };

    const isWeb = Platform.OS === 'web';

    const TabContent = () => (
        <View style={styles.pillInner}>
            {state.routes.map(renderTabItem)}
        </View>
    );

    return (
        <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 20) }]}>
            {isWeb ? (
                <View style={[styles.pill, styles.pillWeb]}>
                    <TabContent />
                </View>
            ) : (
                <BlurView
                    intensity={50}
                    tint="light"
                    style={styles.pill}
                >
                    <View style={styles.pillBackground} />
                    <TabContent />
                </BlurView>
            )}
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
    pill: {
        borderRadius: 40,
        overflow: 'hidden',
        // Subtle shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 4,
    },
    pillBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#FFFFFF',
    },
    pillWeb: {
        backgroundColor: '#FFFFFF',
        // @ts-ignore - Web-only properties
        backdropFilter: 'blur(16px)',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.06)',
    },
    pillInner: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 30,
        flexDirection: 'row',
        gap: 6,
    },
    tabItemActive: {
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
        paddingHorizontal: 20,
    },
    activeLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.primary,
        marginLeft: 4,
    },
});
