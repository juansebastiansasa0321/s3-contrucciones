import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import projectsData from '@/data/projects.json';
import blogData from '@/data/blog.json';

export async function GET() {
    try {
        // 1. Create Projects Table
        await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id VARCHAR(255) PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        location VARCHAR(255),
        category VARCHAR(255),
        images JSONB,
        image VARCHAR(1024),
        features JSONB,
        year INTEGER
      );
    `;

        // 2. Create Blog Posts Table
        await sql`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id VARCHAR(255) PRIMARY KEY,
        title TEXT NOT NULL,
        excerpt TEXT,
        content TEXT NOT NULL,
        author VARCHAR(255),
        date VARCHAR(255),
        category VARCHAR(255),
        tags JSONB,
        "readTime" INTEGER,
        image VARCHAR(1024)
      );
    `;

        // 3. Clear existing data (optional, but good for idempotency during migration)
        await sql`DELETE FROM projects;`;
        await sql`DELETE FROM blog_posts;`;

        // 4. Insert initial projects data
        for (const project of projectsData) {
            await sql`
        INSERT INTO projects (id, title, description, location, category, images, image, features, year)
        VALUES (
          ${project.id},
          ${project.title},
          ${project.description},
          ${project.location},
          ${project.category},
          ${JSON.stringify(project.images)}::jsonb,
          ${project.image},
          ${JSON.stringify(project.features)}::jsonb,
          ${project.year}
        )
        ON CONFLICT (id) DO NOTHING;
      `;
        }

        // 5. Insert initial blog data
        for (const post of blogData) {
            await sql`
        INSERT INTO blog_posts (id, title, excerpt, content, author, date, category, tags, "readTime", image)
        VALUES (
          ${post.id},
          ${post.title},
          ${post.excerpt},
          ${post.content},
          ${post.author},
          ${post.date},
          ${post.category},
          ${JSON.stringify(post.tags)}::jsonb,
          ${post.readTime},
          ${post.image}
        )
        ON CONFLICT (id) DO NOTHING;
      `;
        }

        return NextResponse.json({ message: 'Migration completed successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('Migration error:', error);
        return NextResponse.json({ error: 'Migration failed', details: error.message }, { status: 500 });
    }
}
