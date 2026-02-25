import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import blogData from "@/data/blog.json";
import { Clock, ArrowRight, Tag } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog | S3 Construcciones — Guías y Consejos de Construcción en Cali",
    description:
        "Artículos sobre construcción, remodelación, precios y consejos para tu proyecto en Cali y Jamundí. Guías actualizadas por expertos.",
};

export default function BlogPage() {
    return (
        <>
            <Navbar />

            <section className="blog-hero">
                <div className="container">
                    <span className="label">Blog</span>
                    <h1 className="heading-lg">
                        Guías y consejos de{" "}
                        <span className="text-gradient">construcción</span>
                    </h1>
                    <p className="text-secondary" style={{ maxWidth: 600, margin: "0 auto" }}>
                        Artículos escritos por expertos para ayudarte a tomar las mejores
                        decisiones en tu proyecto de construcción o remodelación.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="blog-grid">
                        {blogData.map((post) => (
                            <Link
                                key={post.id}
                                href={`/blog/${post.id}`}
                                className="blog-card"
                            >
                                <div className="blog-card-image">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        style={{ objectFit: "cover" }}
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        unoptimized
                                    />
                                    <div className="blog-card-category">
                                        <Tag size={12} />
                                        {post.category}
                                    </div>
                                </div>
                                <div className="blog-card-content">
                                    <h2 className="blog-card-title">{post.title}</h2>
                                    <p className="blog-card-excerpt">{post.excerpt}</p>
                                    <div className="blog-card-footer">
                                        <span className="blog-card-meta">
                                            <Clock size={14} />
                                            {post.readTime} min de lectura
                                        </span>
                                        <span className="blog-card-link">
                                            Leer más <ArrowRight size={16} />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
            <WhatsAppButton />
        </>
    );
}
