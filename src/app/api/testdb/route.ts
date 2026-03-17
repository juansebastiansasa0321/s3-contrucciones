import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const result = await pool.query('SELECT * FROM projects ORDER BY year DESC');
        return NextResponse.json({ success: true, count: result.rows.length, rows: result.rows });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
    }
}
