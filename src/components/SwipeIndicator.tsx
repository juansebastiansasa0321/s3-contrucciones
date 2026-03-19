"use client";

import { useEffect, useState } from "react";

interface SwipeIndicatorProps {
    containerId: string;
    itemCount: number;
}

export default function SwipeIndicator({ containerId, itemCount }: SwipeIndicatorProps) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const container = document.getElementById(containerId);
        if (!container) return;

        const handleScroll = () => {
            const scrollLeft = container.scrollLeft;
            const scrollWidth = container.scrollWidth - container.clientWidth;
            
            if (scrollWidth <= 0) return;
            
            const progress = scrollLeft / scrollWidth;
            const index = Math.min(
                Math.max(Math.round(progress * (itemCount - 1)), 0),
                itemCount - 1
            );
            
            setActiveIndex(index);
        };

        container.addEventListener("scroll", handleScroll, { passive: true });
        // Initial setup
        setTimeout(handleScroll, 100);

        return () => container.removeEventListener("scroll", handleScroll);
    }, [containerId, itemCount]);

    if (itemCount <= 1) return null;

    return (
        <div className="swipe-indicator">
            {Array.from({ length: itemCount }).map((_, i) => (
                <div
                    key={i}
                    className={`swipe-dot ${i === activeIndex ? "active" : ""}`}
                />
            ))}
        </div>
    );
}
