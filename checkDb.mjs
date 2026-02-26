import pg from 'pg';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '.env.local') });

async function checkDb() {
    const client = new Client({
        connectionString: process.env.POSTGRES_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const res1 = await client.query('SELECT COUNT(*) FROM blog_posts;');
        const res2 = await client.query('SELECT COUNT(*) FROM projects;');
        const blogRes = await client.query('SELECT id, title FROM blog_posts ORDER BY date DESC LIMIT 3;');
        const projRes = await client.query('SELECT id, title FROM projects ORDER BY year DESC LIMIT 3;');

        console.log('Blog posts count:', res1.rows[0].count);
        console.log('Recent Blogs:', blogRes.rows);
        console.log('Projects count:', res2.rows[0].count);
        console.log('Recent Projects:', projRes.rows);
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await client.end();
    }
}

checkDb();
