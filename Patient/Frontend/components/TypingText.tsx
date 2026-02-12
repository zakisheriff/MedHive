import React, { useState, useEffect, useRef } from 'react';
import { Text, StyleSheet, TextStyle, View, Animated } from 'react-native';

interface TypingTextProps {
    texts: string[];
    speed?: number;
    delay?: number;
    initialDelay?: number;
    pauseAfterErase?: number;
    style?: TextStyle;
    useCircleCursor?: boolean;
}

export function TypingText({
    texts,
    speed = 100,
    delay = 2000,
    initialDelay = 1000,
    pauseAfterErase = 500,
    style,
    useCircleCursor = false
}: TypingTextProps) {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isReady, setIsReady] = useState(false);

    // Animations for the "liquid" cursor
    const cursorScale = useRef(new Animated.Value(1)).current;
    const morphAnim = useRef(new Animated.Value(0)).current; // 0 = Circle, 1 = Pill

    // Interpolate width for the morphing effect
    const cursorWidth = morphAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [32, 64] // Stretches from 32px to 64px
    });

    // Filter style to remove layout-breaking properties
    const { width: _w, textAlign: _t, ...textStyle } = (style as any) || {};

    // Initial delay effect
    useEffect(() => {
        const timer = setTimeout(() => setIsReady(true), initialDelay);
        return () => clearTimeout(timer);
    }, [initialDelay]);

    useEffect(() => {
        if (!isReady) return;

        let timer: any;
        const currentFullText = texts[currentTextIndex];

        if (isDeleting) {
            // Deleting phase
            if (displayedText.length > 0) {
                timer = setTimeout(() => {
                    // Trigger "sucking" pulse animation - even faster for no-lag feel
                    cursorScale.setValue(1.1);
                    Animated.spring(cursorScale, {
                        toValue: 1,
                        friction: 3,
                        tension: 100,
                        useNativeDriver: false
                    }).start();

                    setDisplayedText(prev => prev.slice(0, -1));
                }, speed / 2);
            } else {
                // DONE ERASING: Immediate, zero-delay Liquid Morph transition
                Animated.spring(morphAnim, {
                    toValue: 1,
                    friction: 4,
                    tension: 160,
                    useNativeDriver: false
                }).start(() => {
                    // Start shrinking back immediately
                    Animated.spring(morphAnim, {
                        toValue: 0,
                        friction: 7,
                        tension: 40,
                        useNativeDriver: false
                    }).start();

                    // AND start typing the new text at the same time
                    setCurrentTextIndex(prev => (prev + 1) % texts.length);
                    setIsDeleting(false);
                });
            }
        } else {
            // Typing phase
            if (displayedText.length < currentFullText.length) {
                // Reduced speed to 50ms for fluid effect, ignoring comma delays
                timer = setTimeout(() => {
                    setDisplayedText(prev => currentFullText.slice(0, prev.length + 1));
                }, 50);
            } else {
                // Wait before starting erasure
                timer = setTimeout(() => {
                    setIsDeleting(true);
                }, delay);
            }
        }

        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, currentTextIndex, texts, speed, delay, isReady, pauseAfterErase]);

    return (
        <View style={styles.container}>
            <View style={styles.textWrapper}>
                <Text style={[styles.text, textStyle]} numberOfLines={1}>
                    {displayedText || ''}
                </Text>
                {useCircleCursor ? (
                    <Animated.View
                        style={[
                            styles.circleCursor,
                            {
                                width: cursorWidth,
                                transform: [{ scale: cursorScale }]
                            }
                        ]}
                    />
                ) : (
                    <Text style={styles.cursor}>|</Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 60, // Solid height anchored to prevent medhive title jumping
        justifyContent: 'center',
        alignItems: 'center',
    },
    textWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: '700',
    },
    cursor: {
        color: '#dca349',
        fontWeight: '200',
    },
    circleCursor: {
        height: 32, // Fixed height to keep it pill-like
        borderRadius: 16, // Fixed radius (half of height) for perfect curves
        backgroundColor: '#dca349',
        marginLeft: 10,
    }
});
