import { Phone, Mail, MapPin } from "lucide-react";
import Image from "next/image";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <span style={{ fontSize: '1.6rem', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                                Maestros & <span className="text-gradient">Remodelaciones</span>
                            </span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)' }}>
                                Cali <span style={{color: 'var(--text-muted)'}}>•</span> Jamundí
                            </span>
                        </div>
                        <p>
                            Más de 10 años construyendo hogares de calidad en Cali y Jamundí.
                            Desde la primera piedra hasta el último detalle.
                        </p>
                    </div>

                    <div className="footer-column">
                        <h4>Servicios</h4>
                        <ul>
                            <li><a href="#servicios">Construcción Completa</a></li>
                            <li><a href="#servicios">Acabados</a></li>
                            <li><a href="#servicios">Remodelación</a></li>
                            <li><a href="#servicios">Ornamentación</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4>Navegación</h4>
                        <ul>
                            <li><a href="#inicio">Inicio</a></li>
                            <li><a href="#nosotros">Nosotros</a></li>
                            <li><a href="#proyectos">Proyectos</a></li>
                            <li><a href="#contacto">Contacto</a></li>
                        </ul>
                    </div>

                    <div className="footer-column">
                        <h4>Contacto</h4>
                        <ul>
                            <li>
                                <a href="tel:+573147872392" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <Phone size={14} /> 314 787 2392
                                </a>
                            </li>
                            <li>
                                <a href="mailto:juansebastiansasa@gmail.com" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <Mail size={14} /> juansebastiansasa@gmail.com
                                </a>
                            </li>
                            <li>
                                <span style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                                    <MapPin size={14} /> Cali & Jamundí, Valle del Cauca
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Maestros & Remodelaciones Cali - Jamundí. Todos los derechos reservados.</p>
                    <p>Valle del Cauca, Colombia</p>
                </div>
            </div>
        </footer>
    );
}
