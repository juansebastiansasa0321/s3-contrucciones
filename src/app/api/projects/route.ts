import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const result = await pool.query('SELECT * FROM projects ORDER BY "order" ASC, year DESC');
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json([], { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const id = body.id || `p-${Date.now()}`;
        const newProject = {
            id,
            ...body,
            images: body.images || [],
            features: body.features || [],
            year: body.year || new Date().getFullYear(),
            order: body.order || 0,
        };

        await pool.query(
            `INSERT INTO projects (id, title, description, location, category, images, image, features, year, "order") 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [
                newProject.id, newProject.title, newProject.description, newProject.location, newProject.category,
                JSON.stringify(newProject.images), newProject.image, JSON.stringify(newProject.features), newProject.year, newProject.order
            ]
        );

        return NextResponse.json({ success: true, id: newProject.id });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json({ error: "Error al procesar" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        if (Array.isArray(body)) {
            const client = await pool.connect();
            try {
                await client.query('BEGIN');
                await client.query('DELETE FROM projects');
                for (const p of body) {
                    await client.query(
                        `INSERT INTO projects (id, title, description, location, category, images, image, features, year, "order") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                        [p.id, p.title, p.description, p.location, p.category, JSON.stringify(p.images || []), p.image, JSON.stringify(p.features || []), p.year || new Date().getFullYear(), p.order || 0]
                    );
                }
                await client.query('COMMIT');
            } catch (e) {
                await client.query('ROLLBACK');
                throw e;
            } finally {
                client.release();
            }
            return NextResponse.json({ success: true });
        }
        return NextResponse.json(
            { error: "Se esperaba un array de proyectos" },
            { status: 400 }
        );
    } catch (error) {
        console.error("Error updating projects:", error);
        return NextResponse.json(
            { error: "Error al procesar" },
            { status: 500 }
        );
    }
}
