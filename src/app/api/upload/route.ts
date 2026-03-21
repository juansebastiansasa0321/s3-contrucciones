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

        if (!process.env.BLOB_READ_WRITE_TOKEN) {
            throw new Error("El sistema no detecta el BLOB_READ_WRITE_TOKEN. Si lo acabas de añadir a tu archivo .env.local, DEBES apagar el servidor de desarrollo en tu consola y volver a iniciar 'npm run dev'.");
        }

        for (const file of files) {
            // Buffer explicitly to prevent stream issues
            const buffer = Buffer.from(await file.arrayBuffer());
            const blob = await put(file.name, buffer, { 
                access: 'public',
                contentType: file.type || 'application/octet-stream',
                token: process.env.BLOB_READ_WRITE_TOKEN,
                addRandomSuffix: true,
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
