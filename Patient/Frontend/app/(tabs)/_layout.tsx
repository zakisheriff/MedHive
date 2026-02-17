import React from 'react';
import { Tabs } from 'expo-router';
import { GlassmorphicTabBar } from '../../components/GlassmorphicTabBar';
import { Colors } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

/**
 * Android & Web Tab Layout
 * 
 * Uses a custom GlassmorphicTabBar component for a premium floating dock design.
 * iOS uses a separate _layout.ios.tsx with native tabs for the Liquid Glass effect.
 */
export default function TabLayout() {
    const { t } = useTranslation();
    return (
        <Tabs
            tabBar={(props) => <GlassmorphicTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.light.primary,
                tabBarInactiveTintColor: Colors.light.icon,
                // Hide default tab bar since we use custom GlassmorphicTabBar
                tabBarStyle: { display: 'none' },
            }}
        >
            <Tabs.Screen
                name="history"
                options={{
                    title: t('tabs.history'),
                    tabBarIcon: ({ color, size }) => <Ionicons name="time-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="upload"
                options={{
                    title: t('tabs.upload'),
                    tabBarIcon: ({ color, size }) => <Ionicons name="cloud-upload-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="access"
                options={{
                    title: t('tabs.access'),
                    tabBarIcon: ({ color, size }) => <Ionicons name="key-outline" size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}
