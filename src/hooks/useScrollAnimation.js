import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for scroll-triggered fade-in animations
 * Uses Intersection Observer for performance
 */
export const useScrollAnimation = (options = {}) => {
    const ref = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                // Once visible, stay visible (don't animate out)
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            {
                threshold: options.threshold || 0.1,
                rootMargin: options.rootMargin || '0px 0px -50px 0px',
            }
        );

        observer.observe(element);

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [options.threshold, options.rootMargin]);

    return { ref, isVisible };
};

/**
 * Hook for staggered animations on multiple items
 */
export const useStaggerAnimation = (itemCount, baseDelay = 100) => {
    const getDelay = (index) => index * baseDelay;
    return { getDelay };
};

export default useScrollAnimation;
