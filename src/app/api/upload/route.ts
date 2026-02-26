import { NextResponse } from "next/server";
import { put } from '@vercel/blob';

export async function POST(request: Request) {
    try {
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
            const blob = await put(file.name, file, { access: 'public' });
            urls.push(blob.url);
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
