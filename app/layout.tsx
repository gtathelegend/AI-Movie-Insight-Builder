import type { Metadata, Viewport } from "next";
import { Bagel_Fat_One, JetBrains_Mono, Nunito } from "next/font/google";
import "./globals.css";

const bagelFatOne = Bagel_Fat_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bagel",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const nunito = Nunito({
  weight: ["600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "POP — AI Movie Insights, Ratings & Audience Reviews",
    template: "%s | POP — AI Movie Insights",
  },
  description:
    "Explore movie ratings, real audience reviews, viewer sentiment, emotional insights and AI-powered movie analysis. Search films by title or IMDb ID.",
  applicationName: "POP — AI Movie Insight Builder",
  keywords: [
    "movies",
    "movie reviews",
    "movie ratings",
    "audience reviews",
    "IMDb",
    "film reviews",
    "cinema",
    "audience sentiment",
    "movie analysis",
    "ratings",
    "films",
    "movie insights",
    "AI movie analysis",
    "movie sentiment analysis",
    "now playing movies",
    "trending movies",
    "POP Cinema",
    "AI Movie Insight Builder",
  ],
  authors: [{ name: "Vedaang Sharma", url: "https://github.com/gtathelegend" }],
  creator: "Vedaang Sharma",
  publisher: "Vedaang Sharma",
  category: "entertainment",
  metadataBase: new URL("https://pop.vedaangsharma.in"),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/pop-logo.png",
    shortcut: "/pop-logo.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    siteName: "POP",
    title: "POP — AI Movie Insights, Ratings & Audience Reviews",
    description:
      "Explore movie ratings, real audience reviews, viewer sentiment, emotional insights and AI-powered movie analysis. Search films by title or IMDb ID.",
    url: "https://pop.vedaangsharma.in",
    locale: "en_US",
    images: [
      {
        url: "https://pop.vedaangsharma.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "POP — AI Movie Insights",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "POP — AI Movie Insights, Ratings & Audience Reviews",
    description:
      "Explore movie ratings, real audience reviews, viewer sentiment, emotional insights and AI-powered movie analysis.",
    images: [
      {
        url: "https://pop.vedaangsharma.in/og-image.png",
        alt: "POP — AI Movie Insights",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#FFD23F",
  width: "device-width",
  initialScale: 1,
};

const WEBSITE_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://pop.vedaangsharma.in/#website",
      "url": "https://pop.vedaangsharma.in",
      "name": "POP",
      "description": "AI-powered movie intelligence platform providing verified metadata, audience sentiment, review synthesis, and critic comparisons.",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://pop.vedaangsharma.in/?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://pop.vedaangsharma.in/#organization",
      "name": "POP",
      "url": "https://pop.vedaangsharma.in",
      "logo": "https://pop.vedaangsharma.in/pop-logo.png",
      "description": "AI-powered movie intelligence platform providing verified metadata, audience sentiment, review synthesis, and critic comparisons.",
      "sameAs": [
        "https://github.com/gtathelegend",
        "https://www.linkedin.com/in/vedaangsharma2006"
      ],
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "info@vedaangsharma.in",
        "contactType": "customer support"
      }
    },
    {
      "@type": "Person",
      "@id": "https://pop.vedaangsharma.in/#creator",
      "name": "Vedaang Sharma",
      "url": "https://github.com/gtathelegend",
      "email": "mailto:info@vedaangsharma.in",
      "sameAs": [
        "https://github.com/gtathelegend",
        "https://www.linkedin.com/in/vedaangsharma2006"
      ]
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://pop.vedaangsharma.in/#software",
      "name": "POP Movie Insights",
      "applicationCategory": "EntertainmentApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
      },
      "author": {
        "@type": "Person",
        "name": "Vedaang Sharma",
        "url": "https://github.com/gtathelegend",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bagelFatOne.variable} ${jetbrainsMono.variable} ${nunito.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }}
        />
        {children}
      </body>
    </html>
  );
}
