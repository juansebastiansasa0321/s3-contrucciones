import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Image from "next/image";
import { Shield, Clock, Award, Users } from "lucide-react";

export const metadata = {
  title: "Sobre Nosotros | Maestros & Remodelaciones",
  description: "Conoce más sobre nuestro equipo de maestros de obra profesionales en Cali y Jamundí.",
};

export default function NosotrosPage() {
  return (
    <>
      <Navbar />
      
      {/* ===== HERO COMPLETO ===== */}
      <section className="section" style={{ paddingTop: '140px', paddingBottom: '80px', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <span className="label" style={{
                display: "inline-block",
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: 16,
                padding: "6px 16px",
                background: "var(--accent-subtle)",
                border: "1px solid var(--border-accent)",
                borderRadius: 100,
              }}>
                Nuestra Historia
              </span>
              <h1 className="heading-xl" style={{ marginBottom: 24 }}>
                Más de <span className="text-gradient">10 años</span>{" "}
                de experiencia en la obra
              </h1>
              <p style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--text-secondary)' }}>
                Somos un equipo de <strong>maestros de obra y especialistas en remodelaciones</strong> con sede en Cali.
                Ejecutamos proyectos de construcción residencial y comercial en Cali, Jamundí y el Valle del Cauca, ofreciendo mano de obra calificada.
              </p>
              <p style={{ fontSize: '1.1rem', marginBottom: '16px', color: 'var(--text-secondary)' }}>
                Desde la albañilería tradicional, instalación de pisos, obra blanca, hasta acabados finos y ornamentación metálica.
                Nos caracterizamos por nuestra honestidad, puntualidad y resultados duraderos que transforman espacios.
              </p>
              
              <div className="about-features" style={{ marginTop: 40 }}>
                <div className="about-feature-item">
                  <Shield size={20} />
                  Trabajo garantizado
                </div>
                <div className="about-feature-item">
                  <Clock size={20} />
                  Entrega puntual
                </div>
                <div className="about-feature-item">
                  <Award size={20} />
                  Calidad premium
                </div>
                <div className="about-feature-item">
                  <Users size={20} />
                  Equipo profesional
                </div>
              </div>
            </div>
            
            <div className="about-image-wrapper" style={{ position: "relative" }}>
              <Image
                src="/uploads/1771723874388-noi7cf.jpg"
                alt="Equipo de S3 Remodelaciones Cali trabajando en obra"
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
