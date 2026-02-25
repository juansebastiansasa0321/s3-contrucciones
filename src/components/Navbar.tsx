"use client";

import { useState, useEffect } from "react";
import { Building2, Menu, X } from "lucide-react";

const navLinks = [
    { label: "Inicio", href: "/#inicio" },
    { label: "Servicios", href: "/#servicios" },
    { label: "Nosotros", href: "/#nosotros" },
    { label: "Proyectos", href: "/#proyectos" },
    { label: "Blog", href: "/blog" },
    { label: "Contacto", href: "/#contacto" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLinkClick = () => setMobileOpen(false);

    return (
        <>
            <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
                <div className="container navbar-inner">
                    <a href="#inicio" className="navbar-logo">
                        <span className="logo-icon">
                            <Building2 size={22} />
                        </span>
                        <span>
                            S3 <span className="text-gradient">Construcciones</span>
                        </span>
                    </a>

                    <ul className="navbar-links">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <a href={link.href}>{link.label}</a>
                            </li>
                        ))}
                        <li>
                            <a href="#contacto" className="navbar-cta">
                                Cotizar Gratis
                            </a>
                        </li>
                    </ul>

                    <button
                        className="mobile-menu-btn"
                        onClick={() => setMobileOpen(true)}
                        aria-label="Abrir menú"
                    >
                        <Menu size={28} />
                    </button>
                </div>
            </nav>

            <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
                <button
                    className="mobile-close-btn"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Cerrar menú"
                >
                    <X size={28} />
                </button>
                {navLinks.map((link) => (
                    <a key={link.href} href={link.href} onClick={handleLinkClick}>
                        {link.label}
                    </a>
                ))}
                <a
                    href="#contacto"
                    className="btn btn-primary"
                    onClick={handleLinkClick}
                >
                    Cotizar Gratis
                </a>
            </div>
        </>
    );
}
