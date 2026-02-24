"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import Image from "next/image";
import ProjectModal from "./ProjectModal";

interface Project {
    id: string;
    title: string;
    description: string;
    location: string;
    category: string;
    features: string[];
    year: number;
    image?: string;
    images?: string[];
}

interface ProjectGalleryProps {
    projects: Project[];
}

const defaultImages = [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    "https://images.unsplash.com/photo-1600566753376-12c8ab7c79b0?w=800&q=80",
];

export default function ProjectGallery({ projects }: ProjectGalleryProps) {
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    return (
        <>
            <div className="projects-grid">
                {projects.map((project, index) => (
                    <div
                        key={project.id}
                        className="project-card project-card-clickable"
                        onClick={() => setSelectedProject(project)}
                    >
                        <div className="project-card-image" style={{ position: "relative" }}>
                            <Image
                                src={project.image || defaultImages[index % defaultImages.length]}
                                alt={project.title}
                                fill
                                style={{ objectFit: "cover" }}
                                sizes="(max-width: 768px) 100vw, 50vw"
                                unoptimized
                            />
                            <div className="project-card-overlay">
                                <span className="project-card-view-btn">Ver Proyecto →</span>
                            </div>
                        </div>
                        <div className="project-card-body">
                            <div className="location">
                                <MapPin size={14} />
                                <span>{project.location}</span>
                            </div>
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>
                            <div className="project-features">
                                {project.features.map((feat) => (
                                    <span key={feat} className="project-feature-tag">
                                        {feat}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </>
    );
}
