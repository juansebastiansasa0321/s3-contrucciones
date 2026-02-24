import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataPath = path.join(process.cwd(), "src/data/contacts.json");

const OWNER_EMAIL = "juansebastiansasa@gmail.com";
const WEB3FORMS_KEY = process.env.WEB3FORMS_KEY || "";

function readContacts() {
    try {
        const raw = fs.readFileSync(dataPath, "utf-8");
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function saveContacts(contacts: unknown[]) {
    fs.writeFileSync(dataPath, JSON.stringify(contacts, null, 2));
}

async function sendEmailNotification(contact: {
    name: string;
    phone: string;
    email: string;
    service: string;
    message: string;
}) {
    try {
        if (!WEB3FORMS_KEY) {
            console.log("⚠️ WEB3FORMS_KEY no configurado en .env.local");
            console.log("📋 Nueva solicitud recibida:");
            console.log(`   Nombre: ${contact.name}`);
            console.log(`   Teléfono: ${contact.phone}`);
            console.log(`   Email: ${contact.email}`);
            console.log(`   Servicio: ${contact.service}`);
            console.log(`   Mensaje: ${contact.message}`);
            return;
        }

        const res = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                access_key: WEB3FORMS_KEY,
                subject: `🏗️ Nueva Cotización: ${contact.service} - ${contact.name}`,
                from_name: "S3 Construcciones Web",
                to: OWNER_EMAIL,
                name: contact.name,
                phone: contact.phone,
                email: contact.email || "No proporcionado",
                service: contact.service,
                message: contact.message,
                // Optional: redirect or webhook
                botcheck: false,
            }),
        });

        const data = await res.json();
        if (data.success) {
            console.log("✅ Email de notificación enviado a", OWNER_EMAIL);
        } else {
            console.error("❌ Error Web3Forms:", data.message);
        }
    } catch (error) {
        console.error("❌ Error enviando email:", error);
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, email, service, message } = body;

        if (!name || !phone || !service || !message) {
            return NextResponse.json(
                { error: "Faltan campos requeridos" },
                { status: 400 }
            );
        }

        const contacts = readContacts();
        const newContact = {
            id: `c-${Date.now()}`,
            name,
            phone,
            email: email || "",
            service,
            message,
            status: "nuevo",
            createdAt: new Date().toISOString(),
        };
        contacts.push(newContact);
        saveContacts(contacts);

        // Send email notification (non-blocking)
        sendEmailNotification({ name, phone, email: email || "", service, message });

        return NextResponse.json({ success: true, id: newContact.id });
    } catch {
        return NextResponse.json(
            { error: "Error al procesar la solicitud" },
            { status: 500 }
        );
    }
}

export async function GET() {
    const contacts = readContacts();
    return NextResponse.json(contacts);
}
