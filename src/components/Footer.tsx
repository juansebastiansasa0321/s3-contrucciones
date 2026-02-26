import { Building2, Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <h3>
                            S3{" "}
                            <span className="text-gradient">Remodelaciones Cali</span>
                        </h3>
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
                    <p>&copy; {new Date().getFullYear()} S3 Remodelaciones Cali. Todos los derechos reservados.</p>
                    <p>Cali & Jamundí, Valle del Cauca, Colombia</p>
                </div>
            </div>
        </footer>
    );
}
