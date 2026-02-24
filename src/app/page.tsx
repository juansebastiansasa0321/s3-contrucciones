import Navbar from "@/components/Navbar";
import ServiceCard from "@/components/ServiceCard";
import ProjectGallery from "@/components/ProjectGallery";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import ContactForm from "@/components/ContactForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";
import Image from "next/image";
import {
  ArrowRight,
  Shield,
  Clock,
  Award,
  Users,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  Building2,
} from "lucide-react";

import servicesData from "@/data/services.json";
import projectsData from "@/data/projects.json";
import testimonialsData from "@/data/testimonials.json";

export default function Home() {
  return (
    <>
      <Navbar />

      {/* ===== HERO ===== */}
      <section id="inicio" className="hero">
        {/* Hero background image */}
        <div style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}>
          <Image
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80"
            alt="Construcción profesional"
            fill
            style={{ objectFit: "cover", opacity: 0.25 }}
            priority
            unoptimized
          />
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="dot" />
              Disponibles para nuevos proyectos en Cali & Jamundí
            </div>

            <h1 className="heading-xl">
              Construimos el hogar{" "}
              <span className="text-gradient">de tus sueños</span>
            </h1>

            <p>
              Somos expertos en construcción de viviendas, acabados,
              remodelaciones y ornamentación en <strong>Cali y Jamundí</strong>,
              Valle del Cauca. Desde la primera piedra hasta el último detalle,
              hacemos realidad tu proyecto.
            </p>

            <div className="hero-actions">
              <a href="#contacto" className="btn btn-primary">
                Cotizar Gratis <ArrowRight size={18} />
              </a>
              <a
                href="https://wa.me/573147872392?text=Hola%2C%20quiero%20cotizar%20un%20servicio%20de%20construcci%C3%B3n"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
              >
                WhatsApp
              </a>
              <a href="#proyectos" className="btn btn-secondary">
                Ver Proyectos
              </a>
            </div>

            <div className="hero-stats">
              <div className="hero-stat-item">
                <div className="number">10+</div>
                <div className="label">Años de experiencia</div>
              </div>
              <div className="hero-stat-item">
                <div className="number">150+</div>
                <div className="label">Proyectos realizados</div>
              </div>
              <div className="hero-stat-item">
                <div className="number">100%</div>
                <div className="label">Clientes satisfechos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICIOS ===== */}
      <section id="servicios" className="section section-accent">
        <div className="container">
          <div className="section-header">
            <span className="label">Nuestros Servicios</span>
            <h2 className="heading-lg">
              Todo lo que necesitas para{" "}
              <span className="text-gradient">tu proyecto</span>
            </h2>
            <p>
              Ofrecemos soluciones integrales de construcción, acabados y
              ornamentación. Desde viviendas completas hasta trabajos especializados.
            </p>
          </div>
          <div className="services-grid">
            {servicesData.map(
              (
                service: {
                  id: string;
                  title: string;
                  description: string;
                  icon: string;
                },
                index: number
              ) => (
                <ServiceCard
                  key={service.id}
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  index={index}
                />
              )
            )}
          </div>
        </div>
      </section>

      {/* ===== SOBRE NOSOTROS ===== */}
      <section id="nosotros" className="section section-alt">
        <div className="container">
          <div className="about-grid">
            <div className="about-image-wrapper" style={{ position: "relative" }}>
              <Image
                src="/uploads/1771723874388-noi7cf.jpg"
                alt="Equipo de S3 Construcciones trabajando en obra"
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized
              />
            </div>
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
                Sobre Nosotros
              </span>
              <h2 className="heading-lg">
                Más de <span className="text-gradient">10 años</span>{" "}
                construyendo sueños
              </h2>
              <p>
                Somos una empresa de construcción con sede en Cali, Valle del
                Cauca, especializada en la construcción de viviendas
                residenciales, acabados de alta calidad y ornamentación en Cali y Jamundí.
              </p>
              <p>
                Nuestro equipo de profesionales cuenta con amplia experiencia
                en todos los aspectos de la construcción: desde la obra gris
                hasta los acabados más finos, incluyendo ornamentación metálica.
                Nos caracterizamos por la puntualidad, calidad y transparencia.
              </p>
              <div className="about-features">
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
          </div>
        </div>
      </section>

      {/* ===== PROYECTOS ===== */}
      <section id="proyectos" className="section section-accent">
        <div className="container">
          <div className="section-header">
            <span className="label">Portafolio</span>
            <h2 className="heading-lg">
              Nuestros{" "}
              <span className="text-gradient">proyectos realizados</span>
            </h2>
            <p>
              Cada proyecto refleja nuestro compromiso con la excelencia y la
              satisfacción de nuestros clientes.
            </p>
          </div>
          <ProjectGallery projects={projectsData} />
        </div>
      </section>

      {/* ===== TESTIMONIOS ===== */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="label">Testimonios</span>
            <h2 className="heading-lg">
              Lo que dicen{" "}
              <span className="text-gradient">nuestros clientes</span>
            </h2>
            <p>
              La satisfacción de nuestros clientes es nuestra mejor carta de
              presentación.
            </p>
          </div>
          <TestimonialCarousel testimonials={testimonialsData} />
        </div>
      </section>

      {/* ===== AREA DE SERVICIO ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="label">Cobertura</span>
            <h2 className="heading-lg">
              Área de{" "}
              <span className="text-gradient">servicio</span>
            </h2>
            <p>
              Operamos en las principales zonas de Cali y Jamundí,
              Valle del Cauca.
            </p>
          </div>
          <div className="area-content">
            <div className="area-map">
              <div className="map-icon">
                <MapPin size={36} />
              </div>
              <h3 className="heading-sm" style={{ marginBottom: 8 }}>
                Cali & Jamundí
              </h3>
              <p className="text-secondary" style={{ fontSize: "0.9rem" }}>
                Valle del Cauca, Colombia
              </p>
              <p className="text-muted" style={{ fontSize: "0.85rem", marginTop: 12 }}>
                Cubrimos todas las comunas de Cali y las zonas urbana y rural de Jamundí
              </p>
            </div>
            <div className="area-locations">
              <div className="area-location-item">
                <div className="area-location-icon">
                  <Building2 size={22} />
                </div>
                <div>
                  <h4>Cali</h4>
                  <p>Norte, Sur, Oeste y zonas residenciales</p>
                </div>
              </div>
              <div className="area-location-item">
                <div className="area-location-icon">
                  <MapPin size={22} />
                </div>
                <div>
                  <h4>Jamundí</h4>
                  <p>Zona urbana, Alfaguara y alrededores</p>
                </div>
              </div>
              <div className="area-location-item">
                <div className="area-location-icon">
                  <CheckCircle size={22} />
                </div>
                <div>
                  <h4>Cobertura Total</h4>
                  <p>Nos desplazamos a cualquier punto de estas ciudades</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACTO ===== */}
      <section
        id="contacto"
        className="section section-alt"
      >
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <span className="label" style={{
                display: "inline-block",
                fontSize: "0.8rem",
                fontWeight: 600,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--accent)",
                marginBottom: 4,
                padding: "6px 16px",
                background: "var(--accent-subtle)",
                border: "1px solid var(--border-accent)",
                borderRadius: 100,
                width: "fit-content",
              }}>
                Contacto
              </span>
              <h2 className="heading-lg">
                ¿Listo para{" "}
                <span className="text-gradient">comenzar tu proyecto?</span>
              </h2>
              <p>
                Cuéntanos sobre tu proyecto y te daremos una cotización sin
                compromiso. Nos pondremos en contacto contigo en menos de 24
                horas.
              </p>
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <Phone size={20} />
                </div>
                <div>
                  <h4>Teléfono</h4>
                  <p>314 787 2392</p>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <Mail size={20} />
                </div>
                <div>
                  <h4>Email</h4>
                  <p>juansebastiansasa@gmail.com</p>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="contact-info-icon">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4>Ubicación</h4>
                  <p>Cali & Jamundí, Valle del Cauca</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
