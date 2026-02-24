import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const uploadDir = path.join(process.cwd(), "public/uploads");

// Ensure upload directory exists
function ensureDir() {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
}

export async function POST(request: Request) {
    try {
        ensureDir();
        const formData = await request.formData();
        const files = formData.getAll("files") as File[];

        if (files.length === 0) {
            return NextResponse.json(
                { error: "No se enviaron archivos" },
                { status: 400 }
            );
        }

        const urls: string[] = [];

        for (const file of files) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            // Generate unique filename
            const ext = path.extname(file.name) || ".jpg";
            const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
            const filePath = path.join(uploadDir, uniqueName);

            fs.writeFileSync(filePath, buffer);
            urls.push(`/uploads/${uniqueName}`);
        }

        return NextResponse.json({ success: true, urls });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: "Error al subir archivos" },
            { status: 500 }
        );
    }
}
