"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
            
            if (scrollWidth <= 0) {
                setActiveIndex(0);
                return;
            }
            
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

    const scrollPrev = () => {
        const container = document.getElementById(containerId);
        if (container && container.firstElementChild) {
            const cardWidth = container.firstElementChild.getBoundingClientRect().width;
            const gap = 24; 
            container.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
        }
    };

    const scrollNext = () => {
        const container = document.getElementById(containerId);
        if (container && container.firstElementChild) {
            const cardWidth = container.firstElementChild.getBoundingClientRect().width;
            const gap = 24; 
            container.scrollBy({ left: cardWidth + gap, behavior: 'smooth' });
        }
    };

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", marginTop: "32px", width: "100%" }}>
            <button 
                onClick={scrollPrev}
                disabled={activeIndex === 0}
                style={{ 
                    width: "44px", height: "44px", borderRadius: "50%", 
                    background: activeIndex === 0 ? "rgba(255,255,255,0.03)" : "var(--bg-card)", 
                    border: "1px solid var(--border-color)", 
                    color: activeIndex === 0 ? "var(--text-muted)" : "var(--text-primary)", 
                    cursor: activeIndex === 0 ? "default" : "pointer", 
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s"
                }}
                aria-label="Anterior"
            >
                <ChevronLeft size={24} />
            </button>
            
            <div className="swipe-indicator" style={{ display: "flex", gap: "8px", margin: 0, marginTop: 0 }}>
                {Array.from({ length: itemCount }).map((_, i) => (
                    <div
                        key={i}
                        className={`swipe-dot ${i === activeIndex ? "active" : ""}`}
                        onClick={() => {
                            const container = document.getElementById(containerId);
                            if (container) {
                                const scrollWidth = container.scrollWidth - container.clientWidth;
                                const target = (i / (itemCount - 1)) * scrollWidth;
                                container.scrollTo({ left: target, behavior: 'smooth' });
                            }
                        }}
                        style={{ cursor: "pointer", transition: "all 0.3s" }}
                    />
                ))}
            </div>

            <button 
                onClick={scrollNext}
                disabled={activeIndex === itemCount - 1}
                style={{ 
                    width: "44px", height: "44px", borderRadius: "50%", 
                    background: activeIndex === itemCount - 1 ? "rgba(255,255,255,0.03)" : "var(--bg-card)", 
                    border: "1px solid var(--border-color)", 
                    color: activeIndex === itemCount - 1 ? "var(--text-muted)" : "var(--text-primary)", 
                    cursor: activeIndex === itemCount - 1 ? "default" : "pointer", 
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "all 0.2s"
                }}
                aria-label="Siguiente"
            >
                <ChevronRight size={24} />
            </button>
        </div>
    );
}
