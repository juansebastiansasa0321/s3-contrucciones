import pg from 'pg';
import { readFileSync } from 'fs';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '.env.local') });

async function migrate() {
  let client;
  try {
    console.log('Connecting with:', process.env.POSTGRES_URL ? 'URL exists' : 'URL missing');
    client = new Client({
      connectionString: process.env.POSTGRES_URL,
      ssl: { rejectUnauthorized: false }
    });
    await client.connect();

    console.log('Creating tables...');
    await client.query(`
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
    `);

    await client.query(`
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
    `);

    console.log('Tables created. Deleting old data...');
    await client.query(`DELETE FROM projects;`);
    await client.query(`DELETE FROM blog_posts;`);

    console.log('Inserting projects data...');
    const projectsData = JSON.parse(readFileSync(join(__dirname, 'src/data/projects.json'), 'utf8'));
    for (const project of projectsData) {
      await client.query(`
        INSERT INTO projects (id, title, description, location, category, images, image, features, year)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (id) DO NOTHING;
      `, [
        project.id,
        project.title,
        project.description,
        project.location,
        project.category,
        JSON.stringify(project.images),
        project.image,
        JSON.stringify(project.features),
        project.year
      ]);
    }

    console.log('Inserting blog data...');
    const blogData = JSON.parse(readFileSync(join(__dirname, 'src/data/blog.json'), 'utf8'));
    for (const post of blogData) {
      await client.query(`
        INSERT INTO blog_posts (id, title, excerpt, content, author, date, category, tags, "readTime", image)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO NOTHING;
      `, [
        post.id,
        post.title,
        post.excerpt,
        post.content,
        post.author,
        post.date,
        post.category,
        JSON.stringify(post.tags),
        post.readTime,
        post.image
      ]);
    }

    console.log('Migration completed successfully!');
  } catch (err) {
    console.error('Fatal migration error:', err);
  } finally {
    if (client) {
      await client.end();
    }
  }
}

migrate();
