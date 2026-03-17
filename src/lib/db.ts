import pg from 'pg';
const { Pool } = pg;

let poolInstance: pg.Pool | null = null;

function getPool() {
    if (!poolInstance) {
        poolInstance = new Pool({
            connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 10000,
            idleTimeoutMillis: 30000,
            max: 10 // Safe limit for Vercel edge/serverless overlapping
        });
    }
    return poolInstance;
}

const pool = {
    query: async (text: string, params?: any[]) => {
        if (!process.env.POSTGRES_URL && !process.env.DATABASE_URL) {
            console.warn("Skipping DB query during build phase (POSTGRES_URL not found)");
            return { rows: [], fields: [], rowCount: 0, command: '', oid: 0 };
        }
        return getPool().query(text, params);
    },
    connect: async () => {
        if (!process.env.POSTGRES_URL && !process.env.DATABASE_URL) {
            throw new Error("Cannot connect to DB: POSTGRES_URL is missing");
        }
        return getPool().connect();
    }
};

export default pool;
