import type { MetadataRoute } from "next";
import pool from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const { rows: blogData } = await pool.query('SELECT id, date FROM blog_posts');
    const baseUrl = "https://s3remodelacionescali.com.co";

    const blogPages = blogData.map((post) => ({
        url: `${baseUrl}/blog/${post.id}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly" as const,
        priority: 0.7,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${baseUrl}/#servicios`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/#proyectos`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        ...blogPages,
        {
            url: `${baseUrl}/#contacto`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.9,
        },
    ];
}
