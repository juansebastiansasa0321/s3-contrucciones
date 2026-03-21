"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Tag } from "lucide-react";

interface Project {
    id: string;
    title: string;
    description: string;
    location: string;
    category: string;
    features: string[];
    year: number;
    order?: number;
    image?: string;
    images?: string[];
}

interface ProjectModalProps {
    project: Project;
    onClose: () => void;
}

const defaultImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
];

const categoryLabels: Record<string, string> = {
    construccion: "Construcción",
    remodelacion: "Remodelación",
    acabados: "Acabados",
    ornamentacion: "Ornamentación",
};

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
    const [currentImg, setCurrentImg] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    // Build gallery images array
    const galleryImages =
        project.images && project.images.length > 0
            ? project.images
            : project.image
                ? [project.image]
                : [defaultImages[0]];

    const nextImg = useCallback(() => {
        setCurrentImg((prev) => (prev + 1) % galleryImages.length);
    }, [galleryImages.length]);

    const prevImg = useCallback(() => {
        setCurrentImg((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
    }, [galleryImages.length]);

    // Touch swipe handlers
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    }, []);

    const handleTouchEnd = useCallback(() => {
        const diff = touchStartX.current - touchEndX.current;
        const minSwipe = 50; // minimum swipe distance in px
        if (Math.abs(diff) > minSwipe) {
            if (diff > 0) nextImg();
            else prevImg();
        }
    }, [nextImg, prevImg]);

    // Keyboard navigation
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") nextImg();
            if (e.key === "ArrowLeft") prevImg();
        };
        window.addEventListener("keydown", handleKey);
        document.body.style.overflow = "hidden";

        // Trigger animation
        requestAnimationFrame(() => setLoaded(true));

        return () => {
            window.removeEventListener("keydown", handleKey);
            document.body.style.overflow = "";
        };
    }, [onClose, nextImg, prevImg]);

    return (
        <div
            className={`project-modal-overlay ${loaded ? "visible" : ""}`}
            onClick={onClose}
        >
            <div
                className={`project-modal ${loaded ? "visible" : ""}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button className="project-modal-close" onClick={onClose}>
                    <X size={22} />
                </button>

                {/* Gallery Section */}
                <div className="project-modal-gallery">
                    <div
                        className="project-modal-image-wrapper"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <Image
                            src={galleryImages[currentImg]}
                            alt={`${project.title} - Imagen ${currentImg + 1}`}
                            fill
                            style={{ objectFit: "cover" }}
                            sizes="(max-width: 768px) 100vw, 60vw"
                            unoptimized
                            priority={currentImg === 0}
                        />

                        {/* Gradient overlay at bottom */}
                        <div className="project-modal-image-gradient" />

                        {/* Navigation arrows */}
                        {galleryImages.length > 1 && (
                            <>
                                <button
                                    className="project-modal-nav project-modal-nav-prev"
                                    onClick={(e) => { e.stopPropagation(); prevImg(); }}
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    className="project-modal-nav project-modal-nav-next"
                                    onClick={(e) => { e.stopPropagation(); nextImg(); }}
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}

                        {/* Image counter */}
                        {galleryImages.length > 1 && (
                            <div className="project-modal-counter">
                                {currentImg + 1} / {galleryImages.length}
                            </div>
                        )}
                    </div>

                    {/* Thumbnail strip */}
                    {galleryImages.length > 1 && (
                        <div className="project-modal-thumbnails">
                            {galleryImages.map((img, i) => (
                                <button
                                    key={i}
                                    className={`project-modal-thumb ${i === currentImg ? "active" : ""}`}
                                    onClick={(e) => { e.stopPropagation(); setCurrentImg(i); }}
                                >
                                    <Image
                                        src={img}
                                        alt={`Miniatura ${i + 1}`}
                                        fill
                                        style={{ objectFit: "cover" }}
                                        sizes="80px"
                                        unoptimized
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="project-modal-info">
                    <div className="project-modal-category">
                        <Tag size={14} />
                        {categoryLabels[project.category] || project.category}
                    </div>

                    <h2 className="project-modal-title">{project.title}</h2>

                    <div className="project-modal-meta">
                        <span className="project-modal-meta-item">
                            <MapPin size={16} />
                            {project.location}
                        </span>
                        <span className="project-modal-meta-item">
                            <Calendar size={16} />
                            {project.year}
                        </span>
                    </div>

                    <p className="project-modal-description">{project.description}</p>

                    {project.features.length > 0 && (
                        <div className="project-modal-features">
                            <h4>Características</h4>
                            <div className="project-modal-features-grid">
                                {project.features.map((feat) => (
                                    <span key={feat} className="project-modal-feature-tag">
                                        {feat}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <a
                        href={`https://wa.me/573147872392?text=${encodeURIComponent(`Hola, me interesa el proyecto "${project.title}". ¿Podrían darme más información?`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-modal-cta"
                    >
                        💬 Cotizar este proyecto por WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
}
