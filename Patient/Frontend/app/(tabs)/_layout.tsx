import React from 'react';
import { Tabs } from 'expo-router';
import { CurvedTabBar } from '../../components/CurvedTabBar';

export default function TabLayout() {
    return (
        <Tabs
            tabBar={(props) => <CurvedTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="history"
                options={{
                    title: 'History',
                }}
            />
            <Tabs.Screen
                name="upload"
                options={{
                    title: 'Upload',
                }}
            />
            <Tabs.Screen
                name="access"
                options={{
                    title: 'Access',
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                }}
            />
        </Tabs>
    );
}
