import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Colors } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/* 
  Floating Pill Design (Android Only)
  - Floating container at the bottom
  - Rounded corners (Pill shape)
  - Cream/Off-white background
  - Icons only (no labels for cleaner look, or small labels if fit)
  - Centered icons
*/

export function CurvedTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();

    // Note: Tab order in _layout.tsx is Profile, Upload, History, Access.

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.pillContainer}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

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

                    let iconName: keyof typeof Ionicons.glyphMap = 'help-circle';
                    // Icons mapping based on the reference or logical choice
                    // Reference: Person, Plus (Upload), Clock (History), Lock (Access)
                    if (route.name === 'profile') iconName = isFocused ? 'person' : 'person-outline';
                    if (route.name === 'upload') iconName = isFocused ? 'add-circle' : 'add-outline'; // Plus icon for upload
                    if (route.name === 'history') iconName = isFocused ? 'time' : 'time-outline';
                    if (route.name === 'access') iconName = isFocused ? 'lock-closed' : 'lock-closed-outline';

                    const isUpload = route.name === 'upload';

                    return (
                        <TouchableOpacity
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            onPress={onPress}
                            style={[styles.tabItem, isFocused && styles.tabItemFocused]}
                        >
                            <View style={[
                                styles.iconWrapper,
                                isFocused && styles.activeIconWrapper,
                                isUpload && styles.uploadWrapper // Optional special styling for +
                            ]}>
                                <Ionicons
                                    name={iconName}
                                    size={24}
                                    color={isFocused ? Colors.light.text : '#000'} // Reference uses black icons
                                />
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    pillContainer: {
        flexDirection: 'row',
        backgroundColor: '#FFF8F0', // Creamy white
        borderRadius: 40,
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: '85%', // Float with margins
        justifyContent: 'space-between',
        alignItems: 'center',

        // Shadow
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 8,
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    tabItemFocused: {
        // scale transform could go here
    },
    iconWrapper: {
        padding: 10,
        borderRadius: 30,
    },
    activeIconWrapper: {
        backgroundColor: '#FFFFFF', // White highlight bubble for active
        // Make it subtle shadow?
        shadowColor: "#dca349",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    uploadWrapper: {
        // If we want the plus to look special
    }
});
