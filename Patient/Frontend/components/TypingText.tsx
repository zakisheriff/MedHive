import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, TextStyle, View } from 'react-native';

interface TypingTextProps {
    texts: string[];
    speed?: number;
    delay?: number;
    style?: TextStyle;
    useCircleCursor?: boolean;
}

export function TypingText({ texts, speed = 100, delay = 2000, style, useCircleCursor = false }: TypingTextProps) {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        let timer: any;
        const currentFullText = texts[currentTextIndex];

        if (isDeleting) {
            // Deleting phase
            if (displayedText.length > 0) {
                timer = setTimeout(() => {
                    setDisplayedText(prev => prev.slice(0, -1));
                }, speed / 2);
            } else {
                // Done deleting
                setIsDeleting(false);
                setCurrentTextIndex(prev => (prev + 1) % texts.length);
            }
        } else {
            // Typing phase
            if (displayedText.length < currentFullText.length) {
                timer = setTimeout(() => {
                    setDisplayedText(prev => currentFullText.slice(0, prev.length + 1));
                }, speed);
            } else {
                // Done typing, wait for delay
                timer = setTimeout(() => {
                    setIsDeleting(true);
                }, delay);
            }
        }

        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, currentTextIndex, texts, speed, delay]);

    return (
        <Text style={[styles.text, style]}>
            {displayedText}
            {useCircleCursor ? (
                <View style={styles.circleCursor} />
            ) : (
                <Text style={styles.cursor}>|</Text>
            )}
        </Text>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 24,
        fontWeight: '700',
    },
    cursor: {
        color: '#dca349',
        fontWeight: '200',
    },
    circleCursor: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#dca349',
        marginLeft: 6,
        alignSelf: 'center',
        top: 4,
    }
});
