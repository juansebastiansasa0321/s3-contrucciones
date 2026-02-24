import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "src/data/projects.json");

function readProjects() {
    try {
        const raw = fs.readFileSync(dataPath, "utf-8");
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function saveProjects(projects: unknown[]) {
    fs.writeFileSync(dataPath, JSON.stringify(projects, null, 2));
}

export async function GET() {
    const projects = readProjects();
    return NextResponse.json(projects);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const projects = readProjects();
        const newProject = {
            id: `p-${Date.now()}`,
            ...body,
            images: body.images || [],
            features: body.features || [],
            year: body.year || new Date().getFullYear(),
        };
        projects.push(newProject);
        saveProjects(projects);
        return NextResponse.json({ success: true, id: newProject.id });
    } catch {
        return NextResponse.json(
            { error: "Error al procesar" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        if (Array.isArray(body)) {
            saveProjects(body);
            return NextResponse.json({ success: true });
        }
        return NextResponse.json(
            { error: "Se esperaba un array de proyectos" },
            { status: 400 }
        );
    } catch {
        return NextResponse.json(
            { error: "Error al procesar" },
            { status: 500 }
        );
    }
}
