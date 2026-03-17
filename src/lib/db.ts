import pg from 'pg';
const { Pool } = pg;

let poolInstance: pg.Pool | null = null;

function getPool() {
    if (!poolInstance) {
        // Vercel Edge functions sometimes fail to resolve 'db.prisma.io' (getaddrinfo ENOTFOUND)
        // To bypass DNS completely on Vercel, we can replace the host with its direct IP.
        
        let connString = process.env.POSTGRES_URL || "";
        
        if (connString.includes('db.prisma.io')) {
            connString = connString.replace('db.prisma.io', '66.135.0.131');
        }
        
        poolInstance = new Pool({
            connectionString: connString,
            ssl: { rejectUnauthorized: false },
            connectionTimeoutMillis: 10000,
            idleTimeoutMillis: 30000,
            max: 5 // Limit connections for serverless
        });
    }
    return poolInstance;
}

const pool = {
    query: async (text: string, params?: any[]) => {
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
