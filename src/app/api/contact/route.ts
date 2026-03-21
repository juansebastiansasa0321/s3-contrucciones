import { NextResponse } from "next/server";
import pool from "@/lib/db";

const OWNER_EMAIL = "juansebastiansasa@gmail.com";
const WEB3FORMS_KEY = process.env.WEB3FORMS_KEY || "";

async function sendEmailNotification(contact: {
    name: string;
    phone: string;
    email: string;
    service: string;
    location: string;
    address: string;
    message: string;
}) {
    try {
        if (!WEB3FORMS_KEY) {
            console.log("⚠️ WEB3FORMS_KEY no configurado en .env.local");
            return;
        }

        const res = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                access_key: WEB3FORMS_KEY,
                subject: `🏗️ Nueva Cotización: ${contact.service} - ${contact.name}`,
                from_name: "S3 Remodelaciones Cali Web",
                to: OWNER_EMAIL,
                name: contact.name,
                phone: contact.phone,
                email: contact.email || "No proporcionado",
                location: contact.location,
                address: contact.address || "No proporcionada",
                service: contact.service,
                message: contact.message,
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
        const { name, phone, email, service, location, address, message } = body;

        if (!name || !phone || !service || !location || !message) {
            return NextResponse.json(
                { error: "Faltan campos requeridos" },
                { status: 400 }
            );
        }

        const query = `
            INSERT INTO contacts (name, phone, email, service, location, address, message)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        const values = [name, phone, email || "", service, location, address || "", message];
        const result = await pool.query(query, values);
        
        const newContact = result.rows[0];

        // Send email notification (non-blocking)
        sendEmailNotification({ name, phone, email: email || "", service, location, address: address || "", message });

        return NextResponse.json({ success: true, id: newContact.id });
    } catch (error) {
        console.error("Error saving contact:", error);
        return NextResponse.json(
            { error: "Error al procesar la solicitud" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const { rows } = await pool.query("SELECT * FROM contacts ORDER BY created_at DESC");
        // Convert created_at Date object to ISO string matching previous payload format
        const contacts = rows.map(r => ({
            ...r,
            createdAt: r.created_at
        }));
        return NextResponse.json(contacts);
    } catch (error) {
        console.error("Error fetching contacts:", error);
        return NextResponse.json(
            { error: "Error fetching contacts" },
            { status: 500 }
        );
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, status } = body;

        if (!id || !status) {
            return NextResponse.json({ error: "Faltan id o status" }, { status: 400 });
        }

        const query = "UPDATE contacts SET status = $1 WHERE id = $2 RETURNING *;";
        const result = await pool.query(query, [status, id]);

        if (result.rowCount === 0) {
            return NextResponse.json({ error: "Contacto no encontrado" }, { status: 404 });
        }

        return NextResponse.json({ success: true, contact: result.rows[0] });
    } catch (error) {
        console.error("Error updating contact status:", error);
        return NextResponse.json(
            { error: "Error actualizando estado" },
            { status: 500 }
        );
    }
}
