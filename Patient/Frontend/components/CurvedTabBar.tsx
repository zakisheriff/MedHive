import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const TAB_HEIGHT = 80;

export function CurvedTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const insets = useSafeAreaInsets();
    const height = TAB_HEIGHT + insets.bottom;

    const curvePath = `
    M 0 20
    Q ${width / 2} -20 ${width} 20
    V ${height}
    H 0
    Z
  `;

    return (
        <View style={[styles.container, { height }]}>
            <Svg width={width} height={height} style={styles.svg}>
                {/* Shadow path could go here if needed, but simple filter is easier or just elevation */}
                <Path d={curvePath} fill="#FFFFFF"
                // Add a subtle shadow manually if needed, or rely on View shadow
                />
            </Svg>

            <View style={[styles.content, { paddingBottom: insets.bottom }]}>
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

                    let iconName: keyof typeof Ionicons.glyphMap = 'help-circle-outline';
                    if (route.name === 'upload') iconName = isFocused ? 'cloud-upload' : 'cloud-upload-outline';
                    if (route.name === 'access') iconName = isFocused ? 'key' : 'key-outline';
                    if (route.name === 'history') iconName = isFocused ? 'time' : 'time-outline';
                    if (route.name === 'profile') iconName = isFocused ? 'person' : 'person-outline';

                    // Optional: Special 'Upload' button prominence?
                    // For now, keep them equal as per request unless "Upload" needs to be special.
                    // User list: Profile, Upload, History, Access.
                    // My Plan order: History, Upload, Access, Profile.

                    return (
                        <TouchableOpacity
                            key={route.key}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            onPress={onPress}
                            style={styles.tabItem}
                        >
                            <View style={[styles.iconWrapper, isFocused && styles.activeIconWrapper]}>
                                <Ionicons
                                    name={iconName}
                                    size={24}
                                    color={isFocused ? Colors.light.primary : '#999'}
                                />
                            </View>
                            <Text style={[styles.label, { color: isFocused ? Colors.light.primary : '#999' }]}>
                                {options.title || route.name}
                            </Text>
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
        width: width,
        elevation: 8, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        backgroundColor: 'transparent',
    },
    svg: {
        position: 'absolute',
        top: 0,
        left: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: -3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 5,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
    },
    iconWrapper: {
        marginBottom: 4,
        padding: 8,
        borderRadius: 20,
    },
    activeIconWrapper: {
        backgroundColor: '#FFF8E1', // Very light honey/gold tint optional
    },
    label: {
        fontSize: 10,
        fontWeight: '600',
    }
});
