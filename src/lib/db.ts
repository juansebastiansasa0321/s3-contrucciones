import { createPool } from '@vercel/postgres';

// Create a pool using Vercel's optimized serverless driver
const pool = createPool({
    connectionString: process.env.POSTGRES_URL,
});

export default pool;
