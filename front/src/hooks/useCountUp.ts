'use client';

import { useEffect, useRef, useState } from 'react';

interface UseCountUpProps {
    end: number;
    duration?: number;
    startOnInView?: boolean;
}

export function useCountUp({ end, duration = 2000, startOnInView = true }: UseCountUpProps) {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!startOnInView) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            {
                threshold: 0.3, // Start when 30% of the element is visible
                rootMargin: '0px 0px -100px 0px' // Start 100px before the element enters viewport
            }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => observer.disconnect();
    }, [startOnInView]);

    useEffect(() => {
        if (!isVisible || hasAnimated) return;

        let startTime: number;
        let animationFrame: number;

        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentCount = Math.floor(easeOutQuart * end);

            setCount(currentCount);

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setHasAnimated(true);
            }
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [isVisible, end, duration, hasAnimated]);

    return { count, elementRef };
}
