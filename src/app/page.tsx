import dynamicImport from "next/dynamic";
import Navbar from "@/components/Navbar";
import ServiceCard from "@/components/ServiceCard";
import ContactForm from "@/components/ContactForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import Footer from "@/components/Footer";
import Image from "next/image";
import SwipeIndicator from "@/components/SwipeIndicator";
import pool from "@/lib/db";
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

import testimonialsData from "@/data/testimonials.json";

// Dynamic imports for below-the-fold heavy components
const ProjectGallery = dynamicImport(() => import("@/components/ProjectGallery"), {
  ssr: true,
});
const TestimonialCarousel = dynamicImport(() => import("@/components/TestimonialCarousel"), {
  ssr: true,
});

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { rows: projectsData } = await pool.query('SELECT * FROM projects ORDER BY "order" ASC, year DESC');
  const { rows: blogData } = await pool.query('SELECT * FROM blog_posts ORDER BY date DESC LIMIT 2');
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
            src="/cali_hero_bg.png"
            alt="Remodelaciones y Construcción Profesionales Cali Jamundí"
            fill
            style={{ objectFit: "cover", opacity: 0.4 }}
            sizes="100vw"
            quality={100}
            priority
          />
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="dot" />
              Disponibles para nuevos proyectos en Cali & Jamundí
            </div>

            <h1 className="heading-xl">
              Tus Maestros de Obra{" "}
              <span className="text-gradient">de confianza</span>
            </h1>

            <p>
              Somos especialistas en <strong>remodelaciones, acabados, obra blanca y ornamentación</strong> en Cali y Jamundí, Valle del Cauca.
              Un equipo de maestros de obra profesionales listos para transformar y hacer realidad tu proyecto residencial o comercial.
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
          <div className="services-grid" id="services-carousel">
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
          <SwipeIndicator containerId="services-carousel" itemCount={servicesData.length} />
        </div>
      </section>

      {/* ===== SOBRE NOSOTROS (RESUMEN) ===== */}
      <section id="nosotros" className="section section-alt">
        <div className="container" style={{ textAlign: "center", maxWidth: "800px" }}>
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
          <h2 className="heading-lg" style={{ marginBottom: "20px" }}>
            Más de <span className="text-gradient">10 años</span> construyendo en Cali
          </h2>
          <p style={{ color: "var(--text-secondary)", marginBottom: "32px", fontSize: "1.1rem" }}>
            Somos un equipo de maestros de obra y especialistas en remodelaciones. Ejecutamos proyectos de construcción residencial y comercial en Cali, Jamundí y el Valle del Cauca garantizando la mejor calidad de principio a fin.
          </p>
          <a href="/nosotros" className="btn btn-secondary" style={{ display: "inline-flex" }}>
            Conoce nuestra historia completa <ArrowRight size={18} style={{ marginLeft: 8 }} />
          </a>
        </div>
      </section>

      {/* ===== PROYECTOS ===== */}
      <section id="proyectos" className="section">
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
      <section className="section section-accent">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BLOG PREVIEW ===== */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-header">
            <span className="label">Blog</span>
            <h2 className="heading-lg">
              Guías y consejos de{" "}
              <span className="text-gradient">construcción</span>
            </h2>
            <p>
              Artículos escritos por expertos para ayudarte en tu próximo
              proyecto.
            </p>
          </div>
          <div className="blog-grid" id="blog-carousel">
            {blogData.map((post) => (
              <a
                key={post.id}
                href={`/blog/${post.id}`}
                className="blog-card"
              >
                <div className="blog-card-image">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="blog-card-category">
                    {post.category}
                  </div>
                </div>
                <div className="blog-card-content">
                  <h3 className="blog-card-title">{post.title}</h3>
                  <p className="blog-card-excerpt">{post.excerpt}</p>
                  <div className="blog-card-footer">
                    <span className="blog-card-meta">
                      <Clock size={14} />
                      {post.readTime} min de lectura
                    </span>
                    <span className="blog-card-link">
                      Leer más <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <SwipeIndicator containerId="blog-carousel" itemCount={blogData.length} />
          <div style={{ textAlign: "center", marginTop: 36 }}>
            <a href="/blog" className="btn btn-secondary">
              Ver todos los artículos
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* ===== CONTACTO ===== */}
      <section
        id="contacto"
        className="section section-accent"
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
            <div className="contact-form-wrapper">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
    </>
  );
}
