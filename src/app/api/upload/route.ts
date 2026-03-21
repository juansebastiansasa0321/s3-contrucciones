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
            // Buffer explicitly to prevent stream issues
            const buffer = Buffer.from(await file.arrayBuffer());
            const blob = await put(file.name, buffer, { 
                access: 'public',
                contentType: file.type || 'application/octet-stream',
            });
            urls.push(blob.url);
        }

        return NextResponse.json({ success: true, urls });
    } catch (error: any) {
        console.error("Upload error detallado:", error);
        return NextResponse.json(
            { error: `Detalle del Servidor Vercel Blob: ${error.message || String(error)}` },
            { status: 500 }
        );
    }
}
