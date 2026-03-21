import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const { rows } = await pool.query('SELECT * FROM services ORDER BY "order" ASC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Error fetching services" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { id, title, description, icon, category, image, order } = data;

    const { rows } = await pool.query(
      `INSERT INTO services (id, title, description, icon, category, image, "order")
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [id, title, description, icon, category, image || null, order || 0]
    );

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json({ error: "Error creating service" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { id, title, description, icon, category, image, order } = data;

    const { rows } = await pool.query(
      `UPDATE services 
       SET title = $1, description = $2, icon = $3, category = $4, image = $5, "order" = $6
       WHERE id = $7 RETURNING *`,
      [title, description, icon, category, image || null, order || 0, id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json({ error: "Error updating service" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await pool.query("DELETE FROM services WHERE id = $1", [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json({ error: "Error deleting service" }, { status: 500 });
  }
}
