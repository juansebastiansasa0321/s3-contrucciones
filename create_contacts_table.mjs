import pkg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pkg;

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
});

async function createContactsTable() {
  try {
    console.log('Creando tabla de contactos...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        email VARCHAR(255),
        service VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        address TEXT,
        message TEXT,
        status VARCHAR(50) DEFAULT 'nuevo',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabla contacts creada o ya existe correctamente.');
  } catch (error) {
    console.error('Error creando tabla:', error);
  } finally {
    await pool.end();
  }
}

createContactsTable();
