import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Text, LayoutChangeEvent } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Colors } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    interpolateColor
} from 'react-native-reanimated';

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

const SPRING_CONFIG = {
    damping: 18,
    stiffness: 150,
    mass: 0.8,
};

export function GlassmorphicTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();
    const [layouts, setLayouts] = useState<Record<number, { x: number, width: number }>>({});

    // Shared values for the indicator
    const indicatorX = useSharedValue(0);
    const indicatorWidth = useSharedValue(0);
    const opacity = useSharedValue(0);

    // Update indicator when state index changes or layouts are captured
    useEffect(() => {
        const layout = layouts[state.index];
        if (layout) {
            indicatorX.value = withSpring(layout.x, SPRING_CONFIG);
            indicatorWidth.value = withSpring(layout.width, SPRING_CONFIG);
            opacity.value = withTiming(1, { duration: 200 });
        }
    }, [state.index, layouts]);

    const animatedIndicatorStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: indicatorX.value }],
        width: indicatorWidth.value,
        opacity: opacity.value,
    }));

    const renderTabItem = (route: typeof state.routes[0], index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const iconConfig = TAB_ICONS[route.name] || { focused: 'help-circle', unfocused: 'help-circle-outline', label: 'Tab' };
        const iconName = isFocused ? iconConfig.focused : iconConfig.unfocused;

        const onLayout = (event: LayoutChangeEvent) => {
            const { x, width } = event.nativeEvent.layout;
            setLayouts(prev => ({
                ...prev,
                [index]: { x, width }
            }));
        };

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

        return (
            <TouchableOpacity
                key={route.key}
                onLayout={onLayout}
                onPress={onPress}
                style={styles.tabItem}
                activeOpacity={0.7}
            >
                <Ionicons
                    name={iconName}
                    size={24}
                    color={isFocused ? Colors.light.primary : '#1C1C1E'}
                />
                <Text style={[styles.label, isFocused && styles.activeLabel]}>
                    {iconConfig.label}
                </Text>
            </TouchableOpacity>
        );
    };

    const isWeb = Platform.OS === 'web';

    const TabContent = () => (
        <View style={styles.pillInner}>
            {/* Smooth Indicator Background */}
            <Animated.View style={[styles.indicator, animatedIndicatorStyle]} />
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
                <BlurView intensity={50} tint="light" style={styles.pill}>
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
        zIndex: 1000,
    },
    pill: {
        borderRadius: 55,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.05)',
    },
    pillBackground: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#FFFFFF',
    },
    pillWeb: {
        backgroundColor: '#FFFFFF',
        // @ts-ignore
        backdropFilter: 'blur(16px)',
        borderWidth: 1,
        borderColor: 'rgba(0, 0, 0, 0.06)',
    },
    pillInner: {
        flexDirection: 'row',
        paddingVertical: 7,
        paddingHorizontal: 12,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 35,
        flexDirection: 'column',
        gap: 4,
        zIndex: 2,
        minWidth: 75,
    },
    label: {
        fontSize: 11,
        fontWeight: '500',
        color: '#1C1C1E',
        marginTop: 2,
    },
    activeLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: Colors.light.primary,
        marginTop: 2,
    },
    indicator: {
        position: 'absolute',
        height: 56,
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
        borderRadius: 35,
        left: 0,
        top: 10,
        zIndex: 1,
    },
});

