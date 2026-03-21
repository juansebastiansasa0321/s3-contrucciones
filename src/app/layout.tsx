import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.s3contrucciones.com"),
  title: "Maestros & Remodelaciones Cali - Jamundí | Construcción Profesional",
  description:
    "Expertos en construcción, remodelaciones, acabados y obra blanca en Cali y Jamundí. Maestros de obra profesionales, pintura, plomería y ornamentación. ¡Cotiza tu proyecto hoy!",
  keywords: [
    "maestros de obra Cali",
    "maestros de obra Jamundí",
    "remodelaciones Cali",
    "remodelaciones Jamundí",
    "construcción de casas Cali",
    "acabados de construcción Cali",
    "obra blanca Cali",
    "remodelación de fachadas Jamundí",
    "albañiles Cali",
    "empresa de remodelaciones Valle del Cauca",
    "pintura y yeso Cali",
    "plomería profesional Cali",
    "ornamentación metálica Jamundí",
    "arreglos locativos Cali",
    "construcción de casas Jamundí",
  ],
  openGraph: {
    title: "Maestros & Remodelaciones Cali - Jamundí",
    description:
      "Construimos y remodelamos tu hogar con acabados de primera calidad en Cali y Jamundí. Maestros de obra con experiencia comprobada.",
    url: "https://www.s3contrucciones.com",
    siteName: "Maestros & Remodelaciones Cali - Jamundí",
    images: [
      {
        url: "/cali_hero_bg.png",
        width: 1200,
        height: 630,
        alt: "Maestros de Obra en Cali y Jamundí",
      },
    ],
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maestros & Remodelaciones Cali - Jamundí",
    description:
      "Expertos en construcción, acabados y remodelaciones en Cali y Jamundí, Valle del Cauca.",
    images: ["/cali_hero_bg.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://www.s3contrucciones.com",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: "Maestros & Remodelaciones Cali - Jamundí",
  description:
    "Maestros de obra expertos en construcción de viviendas, acabados, obra blanca y remodelaciones integrales en Cali y Jamundí, Valle del Cauca.",
  url: "https://www.s3contrucciones.com",
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
        {/* Google Analytics */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}

