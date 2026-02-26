import { Pool } from 'pg';

// Create a singleton pool to use throughout the Next.js API routes
const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
    ssl: { rejectUnauthorized: false }
});

export default pool;
