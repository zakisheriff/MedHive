import React, { useState, useEffect, useRef } from 'react';
import './TypingText.css';

export const TypingText = ({
    texts,
    speed = 50,
    delay = 2000,
    initialDelay = 1000,
    pauseAfterErase = 500,
}) => {
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [cursorState, setCursorState] = useState('circle'); // 'circle', 'pill', 'shrinking'

    // Initial start delay
    const [hasStarted, setHasStarted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setHasStarted(true), initialDelay);
        return () => clearTimeout(timer);
    }, [initialDelay]);

    useEffect(() => {
        if (!hasStarted) return;

        let timer;
        const currentFullText = texts[currentTextIndex];

        if (isDeleting) {
            // DELETING PHASE
            if (displayedText.length > 0) {
                // Deleting characters
                timer = setTimeout(() => {
                    setDisplayedText((prev) => prev.slice(0, -1));
                }, speed / 2);
            } else {
                // FINISHED DELETING -> Transform to Pill (Expansion)
                setCursorState('pill');

                // Wait briefly in "pill" state if needed, or immediately start shrinking + typing
                // The prompt requested: "transforming into a circle and text it works... while transforming into a circle new text must write."
                // So we transition effectively immediately from "empty text" -> "pill" -> "shrinking + typing"

                // Let the pill expand first (visual pop)
                timer = setTimeout(() => {
                    // START SIMULTANEOUS OP: Shrink + Type Next
                    setCurrentTextIndex((prev) => (prev + 1) % texts.length);
                    setIsDeleting(false);
                    setCursorState('shrinking');

                    // After shrink animation finishes, go back to normal 'circle' state specifically
                    setTimeout(() => {
                        setCursorState('circle');
                    }, 300); // Matches CSS transition time
                }, 200); // Short pause to let pill expand fully
            }
        } else {
            // TYPING PHASE
            if (displayedText.length < currentFullText.length) {
                // Typing characters
                timer = setTimeout(() => {
                    setDisplayedText((prev) => currentFullText.slice(0, prev.length + 1));
                }, speed);
            } else {
                // FINISHED TYPING -> Wait before deleting
                setCursorState('circle'); // Ensure it's circle
                timer = setTimeout(() => {
                    setIsDeleting(true);
                }, delay);
            }
        }

        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, currentTextIndex, texts, speed, delay, hasStarted]);

    return (
        <div className="typing-text-container">
            <span className="typing-content">{displayedText}</span>
            <div className={`liquid-cursor ${cursorState}`}></div>
        </div>
    );
};
