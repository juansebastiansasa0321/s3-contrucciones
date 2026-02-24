import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "S3 Construcciones | Construcción y Acabados en Cali y Jamundí",
  description:
    "Empresa líder en construcción de viviendas, acabados, remodelaciones y ornamentación en Cali y Jamundí, Valle del Cauca. Construcción desde cero, pisos, pintura, plomería, ornamentación y más. ¡Cotiza gratis!",
  keywords: [
    "construcción Cali",
    "acabados Jamundí",
    "remodelación Valle del Cauca",
    "construcción viviendas Cali",
    "acabados de construcción",
    "pisos porcelanato Cali",
    "pintura profesional Jamundí",
    "plomería Cali",
    "ornamentación Cali",
    "ornamentación metálica Jamundí",
    "constructora Cali",
    "remodelaciones Jamundí",
    "constructor de casas Cali",
    "empresa de construcción Valle del Cauca",
  ],
  openGraph: {
    title: "S3 Construcciones | Construcción y Acabados en Cali y Jamundí",
    description:
      "Construimos tu hogar desde cero con acabados de primera calidad en Cali y Jamundí. ¡Más de 10 años de experiencia!",
    url: "https://construccionespremium.com",
    siteName: "S3 Construcciones",
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "S3 Construcciones | Cali y Jamundí",
    description:
      "Construcción de viviendas, acabados y remodelaciones en Cali y Jamundí, Valle del Cauca.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://construccionespremium.com",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: "S3 Construcciones",
  description:
    "Empresa líder en construcción de viviendas, acabados y remodelaciones en Cali y Jamundí, Valle del Cauca.",
  url: "https://construccionespremium.com",
  telephone: "+573147872392",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Cali",
    addressRegion: "Valle del Cauca",
    addressCountry: "CO",
  },
  areaServed: [
    {
      "@type": "City",
      name: "Cali",
      containedInPlace: { "@type": "State", name: "Valle del Cauca" },
    },
    {
      "@type": "City",
      name: "Jamundí",
      containedInPlace: { "@type": "State", name: "Valle del Cauca" },
    },
  ],
  priceRange: "$$",
  serviceType: [
    "Construcción de viviendas",
    "Acabados de construcción",
    "Remodelación",
    "Pintura",
    "Plomería",
    "Ornamentación",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
