import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import blogData from "@/data/blog.json";
import { Clock, ArrowLeft, Calendar, Tag, MessageCircle } from "lucide-react";
import type { Metadata } from "next";

interface BlogPostPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
    return blogData.map((post) => ({ slug: post.id }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = blogData.find((p) => p.id === slug);
    if (!post) return { title: "Blog | S3 Remodelaciones Cali" };
    return {
        title: `${post.title} | S3 Remodelaciones Cali`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: "article",
            publishedTime: post.date,
            authors: [post.author],
        },
    };
}

function renderContent(content: string) {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];

    lines.forEach((line, i) => {
        const trimmed = line.trim();
        if (trimmed.startsWith("## ")) {
            elements.push(<h2 key={i} className="blog-post-h2">{trimmed.replace("## ", "")}</h2>);
        } else if (trimmed.startsWith("### ")) {
            elements.push(<h3 key={i} className="blog-post-h3">{trimmed.replace("### ", "")}</h3>);
        } else if (trimmed.startsWith("- **")) {
            const match = trimmed.match(/^- \*\*(.+?)\*\*(.*)$/);
            if (match) {
                elements.push(
                    <li key={i} className="blog-post-li">
                        <strong>{match[1]}</strong>{match[2]}
                    </li>
                );
            }
        } else if (trimmed.match(/^\d+\. \*\*/)) {
            const match = trimmed.match(/^\d+\. \*\*(.+?)\*\*(.*)$/);
            if (match) {
                elements.push(
                    <li key={i} className="blog-post-li blog-post-li-numbered">
                        <strong>{match[1]}</strong>{match[2]}
                    </li>
                );
            }
        } else if (trimmed.startsWith("- ")) {
            elements.push(
                <li key={i} className="blog-post-li">{trimmed.replace("- ", "")}</li>
            );
        } else if (trimmed.match(/^\d+\. /)) {
            elements.push(
                <li key={i} className="blog-post-li blog-post-li-numbered">
                    {trimmed.replace(/^\d+\.\s/, "")}
                </li>
            );
        } else if (trimmed === "") {
            // skip empty lines
        } else {
            // Process bold text within paragraphs
            const parts = trimmed.split(/\*\*(.+?)\*\*/g);
            elements.push(
                <p key={i} className="blog-post-p">
                    {parts.map((part, j) =>
                        j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                    )}
                </p>
            );
        }
    });

    return elements;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = blogData.find((p) => p.id === slug);

    if (!post) notFound();

    const otherPosts = blogData.filter((p) => p.id !== slug).slice(0, 2);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        image: `https://s3remodelacionescali.com.co${post.image}`,
        author: {
            "@type": "Person",
            name: post.author,
        },
        publisher: {
            "@type": "Organization",
            name: "S3 Remodelaciones Cali",
            logo: {
                "@type": "ImageObject",
                url: "https://s3remodelacionescali.com.co/favicon.ico",
            },
        },
        datePublished: post.date,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Navbar />

            <article className="blog-post">
                {/* Hero image */}
                <div className="blog-post-hero">
                    <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        style={{ objectFit: "cover" }}
                        sizes="100vw"
                        priority
                    />
                    <div className="blog-post-hero-overlay" />
                </div>

                <div className="container">
                    <div className="blog-post-wrapper">
                        {/* Back link */}
                        <Link href="/blog" className="blog-post-back">
                            <ArrowLeft size={18} />
                            Volver al blog
                        </Link>

                        {/* Post header */}
                        <div className="blog-post-header">
                            <div className="blog-post-meta-row">
                                <span className="blog-post-category">
                                    <Tag size={14} />
                                    {post.category}
                                </span>
                                <span className="blog-post-date">
                                    <Calendar size={14} />
                                    {new Date(post.date).toLocaleDateString("es-CO", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </span>
                                <span className="blog-post-read-time">
                                    <Clock size={14} />
                                    {post.readTime} min de lectura
                                </span>
                            </div>
                            <h1 className="blog-post-title">{post.title}</h1>
                        </div>

                        {/* Post content */}
                        <div className="blog-post-content">
                            {renderContent(post.content)}
                        </div>

                        {/* CTA */}
                        <div className="blog-post-cta">
                            <h3>¿Necesitas ayuda con tu proyecto?</h3>
                            <p>Contáctanos por WhatsApp para una cotización gratuita</p>
                            <a
                                href={`https://wa.me/573147872392?text=${encodeURIComponent(`Hola, leí su artículo "${post.title}" y me gustaría más información.`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="blog-post-cta-btn"
                            >
                                <MessageCircle size={20} />
                                Escribir por WhatsApp
                            </a>
                        </div>

                        {/* Related posts */}
                        {otherPosts.length > 0 && (
                            <div className="blog-post-related">
                                <h3>Artículos relacionados</h3>
                                <div className="blog-post-related-grid">
                                    {otherPosts.map((p) => (
                                        <Link key={p.id} href={`/blog/${p.id}`} className="blog-card blog-card-sm">
                                            <div className="blog-card-image">
                                                <Image
                                                    src={p.image}
                                                    alt={p.title}
                                                    fill
                                                    style={{ objectFit: "cover" }}
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                    unoptimized
                                                />
                                            </div>
                                            <div className="blog-card-content">
                                                <h4 className="blog-card-title">{p.title}</h4>
                                                <span className="blog-card-meta">
                                                    <Clock size={14} />
                                                    {p.readTime} min
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </article>

            <Footer />
            <WhatsAppButton />
        </>
    );
}
