import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src/data/blog.json");

export async function GET() {
    try {
        const fileData = await fs.readFile(dataFilePath, "utf-8");
        const data = JSON.parse(fileData);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error reading blog data:", error);
        return NextResponse.json([], { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const fileData = await fs.readFile(dataFilePath, "utf-8");
        const data = JSON.parse(fileData);
        const newPost = await request.json();

        // Generate ID from title if not provided
        if (!newPost.id) {
            newPost.id = newPost.title
                .toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
                .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric with dash
                .replace(/(^-|-$)+/g, ""); // remove leading/trailing dashes
        }

        const newData = [newPost, ...data];

        await fs.writeFile(dataFilePath, JSON.stringify(newData, null, 4));
        return NextResponse.json(newPost);
    } catch (error) {
        console.error("Error saving blog data:", error);
        return NextResponse.json({ error: "Error saving data" }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const updatedData = await request.json();
        await fs.writeFile(dataFilePath, JSON.stringify(updatedData, null, 4));
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error updating blog data:", error);
        return NextResponse.json({ error: "Error updating data" }, { status: 500 });
    }
}
