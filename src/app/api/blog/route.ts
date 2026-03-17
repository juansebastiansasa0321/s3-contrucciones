import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const result = await pool.query('SELECT * FROM blog_posts ORDER BY date DESC');
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error reading blog data:", error);
        return NextResponse.json([], { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const newPost = await request.json();

        // Generate ID from title if not provided
        if (!newPost.id) {
            newPost.id = newPost.title
                .toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
                .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with dash
                .replace(/(^-|-$)+/g, ""); // remove leading/trailing dashes
        }

        await pool.query(
            `INSERT INTO blog_posts (id, title, excerpt, content, author, date, category, tags, "readTime", image)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
                newPost.id, newPost.title, newPost.excerpt, newPost.content, newPost.author,
                newPost.date || new Date().toISOString().split('T')[0], newPost.category, JSON.stringify(newPost.tags || []), newPost.readTime || 5, newPost.image
            ]
        );

        return NextResponse.json(newPost);
    } catch (error) {
        console.error("Error saving blog data:", error);
        return NextResponse.json({ error: "Error saving data" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const updatedData = await request.json();
        if (Array.isArray(updatedData)) {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                await client.query('DELETE FROM blog_posts');
                for (const post of updatedData) {
                    await client.query(
                        `INSERT INTO blog_posts (id, title, excerpt, content, author, date, category, tags, "readTime", image)
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                        [post.id, post.title, post.excerpt, post.content, post.author, post.date, post.category, JSON.stringify(post.tags || []), post.readTime, post.image]
                    );
                }
                await client.query('COMMIT');
            } catch (e) {
                await client.query('ROLLBACK');
                throw e;
            } finally {
                client.release();
            }
            return NextResponse.json({ success: true });
        }
        return NextResponse.json({ error: "Expected array of blog posts" }, { status: 400 });
    } catch (error) {
        console.error("Error updating blog data:", error);
        return NextResponse.json({ error: "Error updating data" }, { status: 500 });
    }
}
