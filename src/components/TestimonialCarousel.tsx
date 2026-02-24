"use client";

import { Star } from "lucide-react";

interface Testimonial {
    id: string;
    name: string;
    location: string;
    text: string;
    rating: number;
}

interface TestimonialCarouselProps {
    testimonials: Testimonial[];
}

export default function TestimonialCarousel({
    testimonials,
}: TestimonialCarouselProps) {
    return (
        <div className="testimonials-wrapper">
            {testimonials.map((t) => (
                <div key={t.id} className="testimonial-card">
                    <div className="testimonial-stars">
                        {Array.from({ length: t.rating }).map((_, i) => (
                            <Star key={i} size={16} fill="currentColor" />
                        ))}
                    </div>
                    <p className="testimonial-text">&ldquo;{t.text}&rdquo;</p>
                    <div className="testimonial-author">
                        <div className="testimonial-avatar">
                            {t.name
                                .split(" ")
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join("")}
                        </div>
                        <div className="testimonial-author-info">
                            <h4>{t.name}</h4>
                            <span>{t.location}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
