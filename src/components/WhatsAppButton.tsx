"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
    const [showTooltip, setShowTooltip] = useState(false);
    const [pulse, setPulse] = useState(true);

    const phoneNumber = "573147872392";
    const message = encodeURIComponent(
        "Hola, me interesa cotizar un servicio de construcción. ¿Podrían ayudarme?"
    );
    const url = `https://wa.me/${phoneNumber}?text=${message}`;

    useEffect(() => {
        // Show tooltip after 3 seconds
        const tooltipTimer = setTimeout(() => setShowTooltip(true), 3000);
        // Hide tooltip after 10 seconds
        const hideTimer = setTimeout(() => setShowTooltip(false), 10000);
        // Stop pulsing after 15 seconds
        const pulseTimer = setTimeout(() => setPulse(false), 15000);

        return () => {
            clearTimeout(tooltipTimer);
            clearTimeout(hideTimer);
            clearTimeout(pulseTimer);
        };
    }, []);

    return (
        <div className="whatsapp-wrapper">
            {showTooltip && (
                <div className="whatsapp-tooltip">
                    💬 ¡Escríbenos! Cotización gratis
                    <button
                        className="whatsapp-tooltip-close"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowTooltip(false);
                        }}
                    >
                        ×
                    </button>
                </div>
            )}
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className={`whatsapp-float ${pulse ? "pulse" : ""}`}
                aria-label="Contactar por WhatsApp"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                <MessageCircle size={28} />
            </a>
        </div>
    );
}
