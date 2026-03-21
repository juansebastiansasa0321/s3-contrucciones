"use client";

import Image from "next/image";
import {
    Building2,
    Paintbrush,
    Hammer,
    Palette,
    Wrench,
    Fence,
    Home,
    LayoutGrid,
} from "lucide-react";
import type { ReactNode } from "react";

const iconMap: Record<string, ReactNode> = {
    Building2: <Building2 size={26} />,
    Paintbrush: <Paintbrush size={26} />,
    Hammer: <Hammer size={26} />,
    Palette: <Palette size={26} />,
    Wrench: <Wrench size={26} />,
    Fence: <Fence size={26} />,
    Home: <Home size={26} />,
    LayoutGrid: <LayoutGrid size={26} />,
};

interface ServiceCardProps {
    title: string;
    description: string;
    icon: string;
    index: number;
    image?: string;
}

export default function ServiceCard({
    title,
    description,
    icon,
    index,
    image,
}: ServiceCardProps) {
    return (
        <div
            className="service-card card"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            {image && (
                <div className="service-card-image">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="(max-width: 768px) 100vw, 25vw"
                        unoptimized={image.startsWith("http")}
                    />
                    <div className="service-card-image-overlay" />
                </div>
            )}
            
            <div className="service-card-content">
                <div className="card-icon">{iconMap[icon] || <Building2 size={26} />}</div>
                <h3>{title}</h3>
                <p>{description}</p>
            </div>
        </div>
    );
}
