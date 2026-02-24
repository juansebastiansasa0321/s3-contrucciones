"use client";

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
}

export default function ServiceCard({
    title,
    description,
    icon,
    index,
}: ServiceCardProps) {
    return (
        <div
            className="card"
            style={{ animationDelay: `${index * 0.1}s` }}
        >
            <div className="card-icon">{iconMap[icon] || <Building2 size={26} />}</div>
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
}
