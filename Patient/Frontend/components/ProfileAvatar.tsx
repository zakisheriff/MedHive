import React, { useEffect, useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Colors } from '../constants/theme';
import { getUser } from '../utils/userStore';

interface ProfileAvatarProps {
    name?: string;
    size?: number;
}

export function ProfileAvatar({ name: propName, size = 36 }: ProfileAvatarProps) {
    const [name, setName] = useState(propName || '');

    useEffect(() => {
        if (!propName) {
            loadUserName();
        } else {
            setName(propName);
        }
    }, [propName]);

    const loadUserName = async () => {
        const user = await getUser();
        if (user) {
            setName(`${user.fname} ${user.lname}`);
        }
    };

    const initials = (name || 'JD')
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const handlePress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push('/profile');
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}
        >
            <Text style={[styles.initials, { fontSize: size * 0.4 }]}>{initials}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.light.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    initials: {
        color: '#fff',
        fontWeight: '600',
    },
});
