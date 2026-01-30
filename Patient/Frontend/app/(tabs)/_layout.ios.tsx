import React from 'react';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { Colors } from '../../constants/theme';

/**
 * iOS-only Tab Layout using Native Tabs (Liquid Glass)
 * 
 * This layout uses expo-router's NativeTabs API for the iOS 18+ Liquid Glass effect.
 * It provides native tab bar with system translucency, blur effects, SF Symbols,
 * native haptic feedback, and scroll-to-top behavior.
 */
export default function IOSTabLayout() {
    return (
        <NativeTabs
            blurEffect="systemChromeMaterial"
            tintColor={Colors.light.primary}
            iconColor={{
                default: Colors.light.icon,
                selected: Colors.light.primary,
            }}
            labelStyle={{
                default: { color: Colors.light.icon },
                selected: { color: Colors.light.primary },
            }}
        >
            <NativeTabs.Trigger
                name="history"
                options={{
                    title: 'History',
                    icon: { sf: 'clock' },
                    selectedIcon: { sf: 'clock.fill' },
                }}
            />
            <NativeTabs.Trigger
                name="upload"
                options={{
                    title: 'Upload',
                    icon: { sf: 'doc' },
                    selectedIcon: { sf: 'doc.fill' },
                }}
            />
            <NativeTabs.Trigger
                name="access"
                options={{
                    title: 'Access',
                    icon: { sf: 'key' },
                    selectedIcon: { sf: 'key.fill' },
                }}
            />
        </NativeTabs>
    );
}
