"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

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
                    <a href="#inicio" className="navbar-logo" style={{ display: 'flex', flexDirection: 'column', gap: '0px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '1.4rem', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                            Maestros & <span className="text-gradient">Remodelaciones</span>
                        </span>
                        <span style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                            Cali <span style={{color: 'var(--text-muted)'}}>•</span> Jamundí
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
