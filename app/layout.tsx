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
    apple: "/pop-logo.png",
  },
  openGraph: {
    type: "website",
    siteName: "POP — AI Movie Insights",
    title: "POP — AI Movie Insights, Ratings & Audience Reviews",
    description:
      "Explore movie ratings, real audience reviews, viewer sentiment, emotional insights and AI-powered movie analysis. Search films by title or IMDb ID.",
    url: "https://pop.vedaangsharma.in",
    locale: "en_US",
    images: [
      {
        url: "/pop-logo.png",
        width: 512,
        height: 512,
        alt: "POP — AI Movie Insights Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "POP — AI Movie Insights, Ratings & Audience Reviews",
    description:
      "Explore movie ratings, real audience reviews, viewer sentiment, emotional insights and AI-powered movie analysis.",
    creator: "@vedaangsharma",
    images: ["/pop-logo.png"],
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
      "name": "POP — AI Movie Insights",
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(WEBSITE_JSON_LD) }}
        />
      </head>
      <body className={`${bagelFatOne.variable} ${jetbrainsMono.variable} ${nunito.variable}`}>
        {children}
      </body>
    </html>
  );
}
