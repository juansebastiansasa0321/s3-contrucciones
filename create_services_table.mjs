import pkg from "pg";
import dotenv from "dotenv";
import fs from "fs";

const { Pool } = pkg;
dotenv.config({ path: ".env.local" });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
});

async function migrate() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS services (
        id VARCHAR(255) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        icon VARCHAR(100) NOT NULL,
        category VARCHAR(100),
        image VARCHAR(500),
        "order" INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Services table created successfully.");

    // Check if table is empty
    const { rows } = await pool.query("SELECT COUNT(*) FROM services");
    if (parseInt(rows[0].count) === 0) {
      console.log("Seeding services from local JSON...");
      const rawData = fs.readFileSync("./src/data/services.json", "utf-8");
      const services = JSON.parse(rawData);

      let order = 1;
      for (const svc of services) {
        await pool.query(
          `INSERT INTO services (id, title, description, icon, category, image, "order")
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [svc.id, svc.title, svc.description, svc.icon, svc.category, svc.image || null, order]
        );
        order++;
      }
      console.log(`Seeded ${services.length} services successfully.`);
    } else {
      console.log("Services table already contains data. Skipping seed.");
    }
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await pool.end();
  }
}

migrate();
