import { createPool, VercelPool } from '@vercel/postgres';

let poolInstance: VercelPool | null = null;

function getPool() {
    if (!poolInstance) {
        poolInstance = createPool({
            connectionString: process.env.POSTGRES_URL || "postgres://dummy:dummy@dummy/dummy",
        });
    }
    return poolInstance;
}

const pool = {
    query: async (text: string, params?: any[]) => {
        // Prevent crashes during Next.js build trace phase if env is missing
        if (!process.env.POSTGRES_URL) {
            console.warn("Skipping DB query during build phase (POSTGRES_URL not found)");
            return { rows: [], fields: [], rowCount: 0, command: '', oid: 0 };
        }
        return getPool().query(text, params);
    },
    connect: async () => {
        if (!process.env.POSTGRES_URL) {
            throw new Error("Cannot connect to DB: POSTGRES_URL is missing");
        }
        return getPool().connect();
    }
};

export default pool;
