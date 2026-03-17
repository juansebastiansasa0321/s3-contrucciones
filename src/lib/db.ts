import { sql } from '@vercel/postgres';

const pool = {
    query: async (text: string, params?: any[]) => {
        // Prevent crashes during Next.js build trace phase if env is missing
        if (!process.env.POSTGRES_URL) {
            console.warn("Skipping DB query during build phase (POSTGRES_URL not found)");
            return { rows: [], fields: [], rowCount: 0, command: '', oid: 0 };
        }
        
        // Convert $1, $2 to Vercel Postgres template literal or simply run query
        // Vercel postgres sql uses tagged template literals, so we need to pass parameters correctly
        // Since we are wrapping it, we can use sql.query which acts like standard pg.query
        return sql.query(text, params);
    },
    connect: async () => {
        if (!process.env.POSTGRES_URL) {
            throw new Error("Cannot connect to DB: POSTGRES_URL is missing");
        }
        return sql;
    }
};

export default pool;
