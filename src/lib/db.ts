import pg from 'pg';
const { Pool } = pg;

// Use standard PG on Vercel Node.js Serverless Functions
let poolInstance: pg.Pool | null = null;

function getPool() {
    if (!poolInstance) {
        let connString = process.env.POSTGRES_URL || "postgres://dummy:dummy@dummy/dummy";
        
        // Ensure Prisma Data Proxy connections use pgbouncer if not present
        if (connString.includes('prisma.io') && !connString.includes('pgbouncer')) {
             if (connString.includes('?')) {
                 connString += '&pgbouncer=true';
             } else {
                 connString += '?pgbouncer=true';
             }
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
