import React from 'react';
import { Tabs } from 'expo-router';
import { CurvedTabBar } from '../../components/CurvedTabBar';
import { Platform } from 'react-native';
import { Colors } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs
            tabBar={Platform.OS === 'ios' ? undefined : (props) => <CurvedTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: Colors.light.primary,
                // iOS: Native look (system default)
                // Android/Web: Custom tab bar handles rendered content, but we ensure default is hidden/ignored
                tabBarStyle: Platform.OS === 'ios' ? undefined : { display: 'none' },
            }}
        >
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="upload"
                options={{
                    title: 'Upload',
                    tabBarIcon: ({ color, size }) => <Ionicons name="cloud-upload-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="history"
                options={{
                    title: 'History',
                    tabBarIcon: ({ color, size }) => <Ionicons name="time-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="access"
                options={{
                    title: 'Access',
                    tabBarIcon: ({ color, size }) => <Ionicons name="key-outline" size={size} color={color} />,
                }}
            />
        </Tabs>
    );
}
