import pkg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pkg;

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
});

async function check() {
  try {
    const res = await pool.query("SELECT * FROM projects WHERE title ILIKE '%Diseño%'");
    console.log(res.rows);
  } catch (error) {
    console.error(error);
  } finally {
    pool.end();
  }
}

check();
