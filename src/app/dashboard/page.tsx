"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import {
    Building2,
    Users,
    Mail,
    BarChart3,
    ArrowLeft,
    Eye,
    Clock,
    CheckCircle,
    Plus,
    Trash2,
    Edit3,
    X,
    Save,
    FolderOpen,
    MapPin,
    Upload,
} from "lucide-react";

interface Contact {
    id: string;
    name: string;
    phone: string;
    email: string;
    service: string;
    message: string;
    status: string;
    createdAt: string;
}

interface Project {
    id: string;
    title: string;
    description: string;
    location: string;
    category: string;
    features: string[];
    year: number;
    image?: string;
    images?: string[];
}

const PREDEFINED_FEATURES = [
    "Cocina Integral",
    "Cielo Raso",
    "Porcelanato",
    "Iluminación LED",
    "Pintura General",
    "Fachada",
    "Obra Gris",
    "Obra Blanca",
    "Redes Eléctricas",
    "Redes Hidráulicas",
    "Carpintería",
    "Mobiliario",
    "Jardín",
    "Piscina",
    "Zona BBQ",
];

export default function DashboardPage() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"contacts" | "projects">("contacts");
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    // Form state
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [customFeature, setCustomFeature] = useState("");
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        Promise.all([
            fetch("/api/contact").then((res) => res.json()),
            fetch("/api/projects").then((res) => res.json()),
        ])
            .then(([contactsData, projectsData]) => {
                setContacts(contactsData);
                setProjects(projectsData);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (editingProject) {
            setSelectedFeatures(editingProject.features || []);
            setImageUrls(editingProject.images || (editingProject.image ? [editingProject.image] : []));
        } else {
            setSelectedFeatures([]);
            setImageUrls([]);
        }
    }, [editingProject]);

    const totalNew = contacts.filter((c) => c.status === "nuevo").length;

    const handleAddImage = () => {
        setImageUrls([...imageUrls, ""]);
    };

    const handleImageChange = (index: number, value: string) => {
        const newImages = [...imageUrls];
        newImages[index] = value;
        setImageUrls(newImages);
    };

    const handleRemoveImage = (index: number) => {
        const newImages = imageUrls.filter((_, i) => i !== index);
        setImageUrls(newImages);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        setUploading(true);
        try {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append("files", files[i]);
            }
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.urls) {
                setImageUrls([...imageUrls, ...data.urls]);
            }
        } catch (err) {
            console.error("Error uploading files:", err);
            alert("Error al subir las imágenes. Intenta de nuevo.");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const toggleFeature = (feature: string) => {
        if (selectedFeatures.includes(feature)) {
            setSelectedFeatures(selectedFeatures.filter((f) => f !== feature));
        } else {
            setSelectedFeatures([...selectedFeatures, feature]);
        }
    };

    const addCustomFeature = () => {
        if (customFeature.trim() && !selectedFeatures.includes(customFeature.trim())) {
            setSelectedFeatures([...selectedFeatures, customFeature.trim()]);
            setCustomFeature("");
        }
    };

    const handleSaveProject = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);

        // Filter out empty image URLs
        const validImages = imageUrls.filter(url => url.trim() !== "");

        // Use the first image as the main image for backward compatibility
        const mainImage = validImages.length > 0 ? validImages[0] : "";

        const projectData = {
            title: form.get("title") as string,
            description: form.get("description") as string,
            location: form.get("location") as string,
            category: form.get("category") as string,
            features: selectedFeatures,
            year: parseInt(form.get("year") as string) || new Date().getFullYear(),
            image: mainImage,
            images: validImages,
        };

        if (editingProject) {
            // Update existing
            const updatedProjects = projects.map((p) =>
                p.id === editingProject.id ? { ...p, ...projectData } : p
            );
            setProjects(updatedProjects);
            // Save all projects
            await fetch("/api/projects", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedProjects),
            });
        } else {
            // Create new
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(projectData),
            });
            const result = await res.json();
            setProjects([...projects, { id: result.id, ...projectData }]);
        }

        setShowProjectForm(false);
        setEditingProject(null);
        setSelectedFeatures([]);
        setImageUrls([]);
    };

    const handleDeleteProject = async (id: string) => {
        if (!confirm("¿Estás seguro de eliminar este proyecto?")) return;
        const updated = projects.filter((p) => p.id !== id);
        setProjects(updated);
        await fetch("/api/projects", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated),
        });
    };

    const handleEditProject = (project: Project) => {
        setEditingProject(project);
        setShowProjectForm(true);
    };

    const styles = {
        page: {
            minHeight: "100vh",
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
            fontFamily: "var(--font-body)",
            padding: "32px",
        } as React.CSSProperties,
        container: { maxWidth: 1200, margin: "0 auto" } as React.CSSProperties,
        header: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 40,
            flexWrap: "wrap" as const,
            gap: 16,
        } as React.CSSProperties,
        statCard: {
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            padding: "24px",
            display: "flex",
            alignItems: "center",
            gap: 16,
        } as React.CSSProperties,
        statIcon: {
            width: 48,
            height: 48,
            background: "var(--accent-subtle)",
            border: "1px solid var(--border-accent)",
            borderRadius: "var(--radius-sm)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent)",
            flexShrink: 0,
        } as React.CSSProperties,
        tabs: {
            display: "flex",
            gap: 4,
            marginBottom: 24,
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            padding: 4,
            width: "fit-content",
        } as React.CSSProperties,
        tab: (active: boolean) =>
        ({
            padding: "10px 24px",
            borderRadius: "var(--radius-sm)",
            fontSize: "0.88rem",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s",
            background: active ? "var(--gradient-gold)" : "transparent",
            color: active ? "#050507" : "var(--text-secondary)",
            border: "none",
        } as React.CSSProperties),
        tableWrapper: {
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
        } as React.CSSProperties,
        tableHeader: {
            padding: "20px 24px",
            borderBottom: "1px solid var(--border-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
        } as React.CSSProperties,
        badge: (color: string) =>
        ({
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            padding: "3px 10px",
            background: color === "gold" ? "rgba(212,168,67,0.1)" : "rgba(37,211,102,0.1)",
            border: `1px solid ${color === "gold" ? "var(--border-accent)" : "rgba(37,211,102,0.3)"}`,
            borderRadius: 100,
            fontSize: "0.75rem",
            color: color === "gold" ? "var(--accent)" : "#25d366",
            fontWeight: 600,
        } as React.CSSProperties),
        formOverlay: {
            position: "fixed" as const,
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 24,
        } as React.CSSProperties,
        formCard: {
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-lg)",
            padding: 36,
            width: "100%",
            maxWidth: 800,
            maxHeight: "90vh",
            overflowY: "auto" as const,
        } as React.CSSProperties,
        input: {
            width: "100%",
            padding: "12px 16px",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-sm)",
            color: "var(--text-primary)",
            fontSize: "0.95rem",
            fontFamily: "inherit",
        } as React.CSSProperties,
        label: {
            display: "block",
            fontSize: "0.85rem",
            fontWeight: 500,
            color: "var(--text-secondary)",
            marginBottom: 8,
        } as React.CSSProperties,
        projectCard: {
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: "var(--radius-md)",
            padding: 24,
            display: "flex",
            gap: 20,
            alignItems: "flex-start",
            transition: "all 0.2s",
        } as React.CSSProperties,
        featureChip: (selected: boolean) => ({
            padding: "6px 14px",
            borderRadius: 100,
            fontSize: "0.8rem",
            background: selected ? "var(--accent)" : "var(--bg-secondary)",
            color: selected ? "#000" : "var(--text-secondary)",
            border: selected ? "1px solid var(--accent)" : "1px solid var(--border-color)",
            cursor: "pointer",
            transition: "all 0.2s",
            fontWeight: 500,
        } as React.CSSProperties),
        imageInputRow: {
            display: "flex",
            gap: 8,
            marginBottom: 8,
            alignItems: "center",
        } as React.CSSProperties,
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                {/* Header */}
                <div style={styles.header}>
                    <div>
                        <a
                            href="/"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                color: "var(--accent)",
                                fontSize: "0.85rem",
                                marginBottom: 8,
                            }}
                        >
                            <ArrowLeft size={16} /> Volver al sitio
                        </a>
                        <h1
                            style={{
                                fontFamily: "var(--font-heading)",
                                fontSize: "1.8rem",
                                fontWeight: 800,
                            }}
                        >
                            Panel <span className="text-gradient">Administrativo</span>
                        </h1>
                    </div>
                </div>

                {/* Stats */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                        gap: 20,
                        marginBottom: 32,
                    }}
                >
                    {[
                        { icon: <Mail size={22} />, label: "Solicitudes", value: contacts.length },
                        { icon: <Eye size={22} />, label: "Nuevas", value: totalNew },
                        { icon: <FolderOpen size={22} />, label: "Proyectos", value: projects.length },
                        {
                            icon: <BarChart3 size={22} />,
                            label: "Este mes",
                            value: contacts.filter(
                                (c) => new Date(c.createdAt).getMonth() === new Date().getMonth()
                            ).length,
                        },
                    ].map((stat) => (
                        <div key={stat.label} style={styles.statCard}>
                            <div style={styles.statIcon}>{stat.icon}</div>
                            <div>
                                <div
                                    style={{
                                        fontFamily: "var(--font-heading)",
                                        fontSize: "1.5rem",
                                        fontWeight: 800,
                                        color: "var(--accent)",
                                    }}
                                >
                                    {stat.value}
                                </div>
                                <div style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
                                    {stat.label}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div style={styles.tabs}>
                    <button
                        style={styles.tab(activeTab === "contacts")}
                        onClick={() => setActiveTab("contacts")}
                    >
                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <Mail size={16} /> Solicitudes
                        </span>
                    </button>
                    <button
                        style={styles.tab(activeTab === "projects")}
                        onClick={() => setActiveTab("projects")}
                    >
                        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <FolderOpen size={16} /> Proyectos
                        </span>
                    </button>
                </div>

                {/* ===== CONTACTS TAB ===== */}
                {activeTab === "contacts" && (
                    <div style={styles.tableWrapper}>
                        <div style={styles.tableHeader}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <Users size={20} style={{ color: "var(--accent)" }} />
                                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 700 }}>
                                    Solicitudes de Cotización
                                </h2>
                            </div>
                        </div>

                        {loading ? (
                            <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
                                Cargando...
                            </div>
                        ) : contacts.length === 0 ? (
                            <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)" }}>
                                No hay solicitudes aún. Las solicitudes del formulario aparecerán aquí.
                            </div>
                        ) : (
                            <div style={{ overflowX: "auto" }}>
                                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                                    <thead>
                                        <tr
                                            style={{
                                                background: "var(--bg-secondary)",
                                                color: "var(--text-muted)",
                                                textTransform: "uppercase",
                                                fontSize: "0.75rem",
                                                letterSpacing: "0.05em",
                                            }}
                                        >
                                            <th style={{ padding: "12px 16px", textAlign: "left" }}>Estado</th>
                                            <th style={{ padding: "12px 16px", textAlign: "left" }}>Nombre</th>
                                            <th style={{ padding: "12px 16px", textAlign: "left" }}>Teléfono</th>
                                            <th style={{ padding: "12px 16px", textAlign: "left" }}>Servicio</th>
                                            <th style={{ padding: "12px 16px", textAlign: "left" }}>Mensaje</th>
                                            <th style={{ padding: "12px 16px", textAlign: "left" }}>Fecha</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contacts
                                            .slice()
                                            .reverse()
                                            .map((c) => (
                                                <tr key={c.id} style={{ borderTop: "1px solid var(--border-color)" }}>
                                                    <td style={{ padding: "14px 16px" }}>
                                                        <span style={styles.badge(c.status === "nuevo" ? "gold" : "green")}>
                                                            {c.status === "nuevo" ? <Clock size={12} /> : <CheckCircle size={12} />}
                                                            {c.status === "nuevo" ? " Nuevo" : " Contactado"}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: "14px 16px", fontWeight: 500 }}>{c.name}</td>
                                                    <td style={{ padding: "14px 16px", color: "var(--text-secondary)" }}>
                                                        {c.phone}
                                                    </td>
                                                    <td style={{ padding: "14px 16px" }}>
                                                        <span
                                                            style={{
                                                                padding: "3px 10px",
                                                                background: "var(--accent-subtle)",
                                                                borderRadius: 100,
                                                                fontSize: "0.78rem",
                                                                color: "var(--accent)",
                                                            }}
                                                        >
                                                            {c.service}
                                                        </span>
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "14px 16px",
                                                            color: "var(--text-secondary)",
                                                            maxWidth: 250,
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        {c.message}
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "14px 16px",
                                                            color: "var(--text-muted)",
                                                            fontSize: "0.8rem",
                                                            whiteSpace: "nowrap",
                                                        }}
                                                    >
                                                        {new Date(c.createdAt).toLocaleDateString("es-CO", {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        })}
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* ===== PROJECTS TAB ===== */}
                {activeTab === "projects" && (
                    <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 700 }}>
                                Proyectos del Portafolio
                            </h2>
                            <button
                                onClick={() => {
                                    setEditingProject(null);
                                    setShowProjectForm(true);
                                }}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    padding: "10px 24px",
                                    background: "var(--gradient-gold)",
                                    color: "#050507",
                                    borderRadius: 100,
                                    fontWeight: 700,
                                    fontSize: "0.88rem",
                                    border: "none",
                                    cursor: "pointer",
                                    boxShadow: "var(--shadow-glow)",
                                }}
                            >
                                <Plus size={18} /> Nuevo Proyecto
                            </button>
                        </div>

                        {projects.length === 0 ? (
                            <div
                                style={{
                                    background: "var(--bg-card)",
                                    border: "1px solid var(--border-color)",
                                    borderRadius: "var(--radius-lg)",
                                    padding: 60,
                                    textAlign: "center",
                                    color: "var(--text-muted)",
                                }}
                            >
                                <FolderOpen size={48} style={{ marginBottom: 16, opacity: 0.3 }} />
                                <p>No hay proyectos. Agrega tu primer proyecto para mostrarlo en el portafolio.</p>
                            </div>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                                {projects.map((p) => (
                                    <div key={p.id} style={styles.projectCard}>
                                        <div
                                            style={{
                                                width: 100,
                                                height: 80,
                                                borderRadius: "var(--radius-sm)",
                                                background: p.image
                                                    ? `url(${p.image}) center/cover`
                                                    : "linear-gradient(135deg, var(--bg-secondary), var(--bg-card))",
                                                flexShrink: 0,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "var(--text-muted)",
                                            }}
                                        >
                                            {!p.image && <Building2 size={28} style={{ opacity: 0.3 }} />}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 4 }}>
                                                {p.title}
                                            </h3>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 4,
                                                    color: "var(--accent)",
                                                    fontSize: "0.8rem",
                                                    marginBottom: 6,
                                                }}
                                            >
                                                <MapPin size={12} /> {p.location}
                                            </div>
                                            <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.5 }}>
                                                {p.description}
                                            </p>
                                            {p.features.length > 0 && (
                                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                                                    {p.features.map((f) => (
                                                        <span
                                                            key={f}
                                                            style={{
                                                                padding: "2px 8px",
                                                                background: "var(--accent-subtle)",
                                                                border: "1px solid var(--border-accent)",
                                                                borderRadius: 100,
                                                                fontSize: "0.7rem",
                                                                color: "var(--accent)",
                                                            }}
                                                        >
                                                            {f}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                                            <button
                                                onClick={() => handleEditProject(p)}
                                                style={{
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: "var(--radius-sm)",
                                                    background: "var(--accent-subtle)",
                                                    border: "1px solid var(--border-accent)",
                                                    color: "var(--accent)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                <Edit3 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProject(p.id)}
                                                style={{
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: "var(--radius-sm)",
                                                    background: "rgba(239,68,68,0.1)",
                                                    border: "1px solid rgba(239,68,68,0.3)",
                                                    color: "#ef4444",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ===== PROJECT FORM MODAL ===== */}
                {showProjectForm && (
                    <div style={styles.formOverlay} onClick={() => setShowProjectForm(false)}>
                        <div style={styles.formCard} onClick={(e) => e.stopPropagation()}>
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    marginBottom: 28,
                                }}
                            >
                                <h2
                                    style={{
                                        fontFamily: "var(--font-heading)",
                                        fontSize: "1.3rem",
                                        fontWeight: 700,
                                    }}
                                >
                                    {editingProject ? "Editar Proyecto" : "Nuevo Proyecto"}
                                </h2>
                                <button
                                    onClick={() => setShowProjectForm(false)}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "var(--text-muted)",
                                        cursor: "pointer",
                                    }}
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            <form onSubmit={handleSaveProject}>
                                <div style={{ marginBottom: 20 }}>
                                    <label style={styles.label}>Título del proyecto *</label>
                                    <input
                                        name="title"
                                        type="text"
                                        required
                                        placeholder="Ej: Construcción Casa Familiar Jamundí"
                                        defaultValue={editingProject?.title || ""}
                                        style={styles.input}
                                    />
                                </div>
                                <div style={{ marginBottom: 20 }}>
                                    <label style={styles.label}>Descripción *</label>
                                    <textarea
                                        name="description"
                                        required
                                        placeholder="Describe el proyecto..."
                                        defaultValue={editingProject?.description || ""}
                                        rows={3}
                                        style={{ ...styles.input, resize: "vertical" as const }}
                                    />
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                                    <div>
                                        <label style={styles.label}>Ubicación *</label>
                                        <input
                                            name="location"
                                            type="text"
                                            required
                                            placeholder="Ej: Jamundí, Valle del Cauca"
                                            defaultValue={editingProject?.location || ""}
                                            style={styles.input}
                                        />
                                    </div>
                                    <div>
                                        <label style={styles.label}>Categoría</label>
                                        <select
                                            name="category"
                                            defaultValue={editingProject?.category || "construccion"}
                                            style={{ ...styles.input, appearance: "none" as const, cursor: "pointer" }}
                                        >
                                            <option value="construccion">Construcción</option>
                                            <option value="remodelacion">Remodelación</option>
                                            <option value="acabados">Acabados</option>
                                            <option value="ornamentacion">Ornamentación</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ marginBottom: 20 }}>
                                    <label style={styles.label}>Año</label>
                                    <input
                                        name="year"
                                        type="number"
                                        placeholder="2025"
                                        defaultValue={editingProject?.year || new Date().getFullYear()}
                                        style={styles.input}
                                    />
                                </div>

                                {/* Features Selector */}
                                <div style={{ marginBottom: 24 }}>
                                    <label style={styles.label}>Características</label>
                                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                                        {PREDEFINED_FEATURES.map((feat) => (
                                            <button
                                                key={feat}
                                                type="button"
                                                onClick={() => toggleFeature(feat)}
                                                style={styles.featureChip(selectedFeatures.includes(feat))}
                                            >
                                                {feat}
                                            </button>
                                        ))}
                                    </div>
                                    <div style={{ display: "flex", gap: 8 }}>
                                        <input
                                            type="text"
                                            value={customFeature}
                                            onChange={(e) => setCustomFeature(e.target.value)}
                                            placeholder="Agregar otra característica..."
                                            style={styles.input}
                                        />
                                        <button
                                            type="button"
                                            onClick={addCustomFeature}
                                            style={{
                                                padding: "0 16px",
                                                background: "var(--bg-secondary)",
                                                border: "1px solid var(--border-color)",
                                                borderRadius: "var(--radius-sm)",
                                                cursor: "pointer",
                                                color: "var(--text-primary)",
                                            }}
                                        >
                                            <Plus size={18} />
                                        </button>
                                    </div>
                                    {/* Selected features preview (hidden in the chips mostly, but good for custom ones) */}
                                    <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 8 }}>
                                        {selectedFeatures
                                            .filter((f) => !PREDEFINED_FEATURES.includes(f))
                                            .map((f) => (
                                                <span key={f} style={styles.featureChip(true)} onClick={() => toggleFeature(f)}>
                                                    {f} <X size={12} style={{ marginLeft: 4 }} />
                                                </span>
                                            ))}
                                    </div>
                                </div>

                                {/* Image URLs Management */}
                                <div style={{ marginBottom: 28 }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, flexWrap: "wrap", gap: 8 }}>
                                        <label style={styles.label}>Galería de Imágenes</label>
                                        <div style={{ display: "flex", gap: 8 }}>
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                disabled={uploading}
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 6,
                                                    padding: "6px 16px",
                                                    background: "var(--accent-subtle)",
                                                    border: "1px solid var(--border-accent)",
                                                    borderRadius: 100,
                                                    color: "var(--accent)",
                                                    fontSize: "0.8rem",
                                                    cursor: uploading ? "wait" : "pointer",
                                                    fontWeight: 600,
                                                    opacity: uploading ? 0.6 : 1,
                                                }}
                                            >
                                                <Upload size={14} />
                                                {uploading ? "Subiendo..." : "📁 Subir desde PC"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleAddImage}
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    color: "var(--accent)",
                                                    fontSize: "0.8rem",
                                                    cursor: "pointer",
                                                    fontWeight: 600,
                                                }}
                                            >
                                                + Agregar URL
                                            </button>
                                        </div>
                                    </div>

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileUpload}
                                        style={{ display: "none" }}
                                    />

                                    {imageUrls.length === 0 && (
                                        <div style={{
                                            padding: 24,
                                            background: "var(--bg-secondary)",
                                            borderRadius: "var(--radius-sm)",
                                            fontSize: "0.85rem",
                                            color: "var(--text-secondary)",
                                            textAlign: "center",
                                            border: "2px dashed var(--border-color)",
                                        }}>
                                            📷 No hay imágenes. Sube fotos desde tu PC o agrega URLs.
                                            <br />
                                            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 12 }}>
                                                <button
                                                    type="button"
                                                    onClick={() => fileInputRef.current?.click()}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 6,
                                                        padding: "8px 20px",
                                                        background: "var(--gradient-gold)",
                                                        color: "#050507",
                                                        borderRadius: 100,
                                                        fontWeight: 700,
                                                        fontSize: "0.82rem",
                                                        border: "none",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    <Upload size={14} /> Subir Fotos
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleAddImage}
                                                    style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontSize: "0.82rem" }}
                                                >
                                                    o agregar URL
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {imageUrls.map((url, index) => (
                                        <div key={index} style={styles.imageInputRow}>
                                            {url && (
                                                <div style={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: "var(--radius-sm)",
                                                    background: `url(${url}) center/cover`,
                                                    flexShrink: 0,
                                                    border: "1px solid var(--border-color)",
                                                }} />
                                            )}
                                            <input
                                                type="text"
                                                value={url}
                                                onChange={(e) => handleImageChange(index, e.target.value)}
                                                placeholder="URL de imagen o ruta local"
                                                style={styles.input}
                                                readOnly={url.startsWith("/uploads/")}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                                style={{
                                                    background: "rgba(239,68,68,0.1)",
                                                    border: "none",
                                                    color: "#ef4444",
                                                    width: 40,
                                                    height: 40,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    borderRadius: "var(--radius-sm)",
                                                    cursor: "pointer",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="submit"
                                    style={{
                                        width: "100%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 8,
                                        padding: "14px 32px",
                                        background: "var(--gradient-gold)",
                                        color: "#050507",
                                        borderRadius: 100,
                                        fontWeight: 700,
                                        fontSize: "0.95rem",
                                        border: "none",
                                        cursor: "pointer",
                                        boxShadow: "var(--shadow-glow)",
                                    }}
                                >
                                    <Save size={18} />
                                    {editingProject ? "Guardar Cambios" : "Crear Proyecto"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
