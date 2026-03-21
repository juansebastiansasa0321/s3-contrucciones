import 'dotenv/config'; // Make sure dotenv is loaded to read .env
import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

async function main() {
    try {
        console.log("Connecting to the database...");
        await pool.query(`ALTER TABLE projects ADD COLUMN IF NOT EXISTS "order" integer DEFAULT 0;`);
        console.log('Successfully added the "order" column to the projects table.');
    } catch (e) {
        console.error("Error migrating DB:", e);
    } finally {
        await pool.end();
    }
}

main();
