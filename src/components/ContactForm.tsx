"use client";

import { useState, useRef, type FormEvent } from "react";
import { Send, CheckCircle } from "lucide-react";

const serviceOptions = [
    "Construcción Completa",
    "Acabados",
    "Remodelación",
    "Pintura",
    "Plomería",
    "Ornamentación",
    "Techos y Cubiertas",
    "Pisos y Enchapes",
    "Otro",
];

export default function ContactForm() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const formRef = useRef<HTMLFormElement>(null);
    const successRef = useRef<HTMLDivElement>(null);

    const validatePhone = (phone: string) => {
        const cleaned = phone.replace(/\s/g, "");
        // Only accept exactly 10 digits
        return /^[0-9]{10}$/.test(cleaned);
    };

    const validateEmail = (email: string) => {
        if (!email) return true; // optional
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = (formData.get("name") as string || "").trim();
        const phone = (formData.get("phone") as string || "").trim();
        const email = (formData.get("email") as string || "").trim();
        const service = formData.get("service") as string || "";
        const location = formData.get("location") as string || "";
        const address = (formData.get("address") as string || "").trim();
        const message = (formData.get("message") as string || "").trim();

        // Validate
        const newErrors: Record<string, string> = {};
        if (!name || name.length < 2) newErrors.name = "Ingresa tu nombre completo";
        if (!validatePhone(phone)) newErrors.phone = "Ingresa un número celular de 10 dígitos";
        if (!validateEmail(email)) newErrors.email = "Ingresa un email válido (ej: tu@email.com)";
        if (!service) newErrors.service = "Selecciona un servicio";
        if (!location) newErrors.location = "Selecciona una ciudad o ubicación";
        if (!message || message.length < 10) newErrors.message = "Describe tu proyecto (mínimo 10 caracteres)";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phone, email, service, location, address, message }),
            });
            if (res.ok) {
                setSubmitted(true);
                // Scroll success message into view
                setTimeout(() => {
                    successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                }, 100);
            }
        } catch {
            // silently handle
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="contact-form" ref={successRef}>
                <div style={{
                    padding: 32,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 16,
                }}>
                    <div style={{
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        background: "rgba(37, 211, 102, 0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                        <CheckCircle size={32} color="#25d366" />
                    </div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>
                        ¡Mensaje enviado! ✅
                    </h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6 }}>
                        Gracias por contactarnos. Revisaremos tu solicitud y te responderemos lo antes posible.
                    </p>
                    <button
                        onClick={() => setSubmitted(false)}
                        className="btn btn-secondary"
                        style={{ marginTop: 8 }}
                    >
                        Enviar otra solicitud
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form className="contact-form" onSubmit={handleSubmit} ref={formRef} noValidate>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="contact-name">Nombre completo *</label>
                    <input
                        id="contact-name"
                        name="name"
                        type="text"
                        placeholder="Tu nombre"
                        required
                        minLength={2}
                        onChange={() => errors.name && setErrors({ ...errors, name: "" })}
                        style={errors.name ? { borderColor: "#ef4444" } : {}}
                    />
                    {errors.name && <span style={{ color: "#ef4444", fontSize: "0.78rem", marginTop: 4, display: "block" }}>{errors.name}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="contact-phone">Teléfono / Celular (10 dígitos) *</label>
                    <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        pattern="[0-9]{10}"
                        maxLength={10}
                        placeholder="3001234567"
                        required
                        onChange={() => errors.phone && setErrors({ ...errors, phone: "" })}
                        style={errors.phone ? { borderColor: "#ef4444" } : {}}
                    />
                    {errors.phone && <span style={{ color: "#ef4444", fontSize: "0.78rem", marginTop: 4, display: "block" }}>{errors.phone}</span>}
                </div>
            </div>
            
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="contact-location">Ciudad / Ubicación *</label>
                    <select
                        id="contact-location"
                        name="location"
                        required
                        onChange={() => errors.location && setErrors({ ...errors, location: "" })}
                        style={errors.location ? { borderColor: "#ef4444" } : {}}
                    >
                        <option value="">Selecciona tu ciudad</option>
                        <option value="Cali">Cali</option>
                        <option value="Jamundí">Jamundí</option>
                        <option value="Palmira">Palmira</option>
                        <option value="Yumbo">Yumbo</option>
                        <option value="Candelaria">Candelaria</option>
                        <option value="Puerto Tejada">Puerto Tejada</option>
                        <option value="Santander de Quilichao">Santander de Quilichao</option>
                        <option value="Otro">Otra Ubicación</option>
                    </select>
                    {errors.location && <span style={{ color: "#ef4444", fontSize: "0.78rem", marginTop: 4, display: "block" }}>{errors.location}</span>}
                </div>
                <div className="form-group">
                    <label htmlFor="contact-address">Dirección del Proyecto (Opcional)</label>
                    <input
                        id="contact-address"
                        name="address"
                        type="text"
                        placeholder="Ej: Barrio San Fernando, Carrera 34..."
                    />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="contact-email">Correo electrónico</label>
                <input
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    onChange={() => errors.email && setErrors({ ...errors, email: "" })}
                    style={errors.email ? { borderColor: "#ef4444" } : {}}
                />
                {errors.email && <span style={{ color: "#ef4444", fontSize: "0.78rem", marginTop: 4, display: "block" }}>{errors.email}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="contact-service">Servicio de interés *</label>
                <select
                    id="contact-service"
                    name="service"
                    required
                    onChange={() => errors.service && setErrors({ ...errors, service: "" })}
                    style={errors.service ? { borderColor: "#ef4444" } : {}}
                >
                    <option value="">Selecciona un servicio</option>
                    {serviceOptions.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
                {errors.service && <span style={{ color: "#ef4444", fontSize: "0.78rem", marginTop: 4, display: "block" }}>{errors.service}</span>}
            </div>
            <div className="form-group">
                <label htmlFor="contact-message">Describe tu proyecto detalladamente *</label>
                <textarea
                    id="contact-message"
                    name="message"
                    placeholder="Cuéntanos: ¿Qué tipo de espacio es? ¿Tienes medidas aproximadas? ¿Qué estilo buscas realizar?"
                    rows={4}
                    required
                    minLength={10}
                    onChange={() => errors.message && setErrors({ ...errors, message: "" })}
                    style={errors.message ? { borderColor: "#ef4444" } : {}}
                />
                {errors.message && <span style={{ color: "#ef4444", fontSize: "0.78rem", marginTop: 4, display: "block" }}>{errors.message}</span>}
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%" }}>
                <Send size={18} />
                {loading ? "Enviando..." : "Solicitar Cotización Gratis"}
            </button>
        </form>
    );
}
