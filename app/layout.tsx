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
    default: "POP — AI Movie Insights · Find Your Next Favorite Movie",
    template: "%s · POP Cinema",
  },
  description:
    "POP is an AI-powered movie discovery and insight builder. Search any film to get honest viewer-driven scores, emotion fingerprints, character breakdowns, snack-sentiment correlations, and trending picks from TMDb — no algorithm slop, just real movie talk.",
  applicationName: "POP — AI Movie Insight Builder",
  keywords: [
    "AI movie insights",
    "movie sentiment analysis",
    "viewer reviews",
    "TMDb trending movies",
    "movie discovery",
    "film recommendations",
    "AI film analysis",
    "movie emotion breakdown",
    "honest movie scores",
    "now playing movies",
    "POP Cinema",
    "AI Movie Insight Builder",
  ],
  authors: [{ name: "Vedaang Sharma", url: "https://github.com/vedaangsharma2006" }],
  creator: "Vedaang Sharma",
  publisher: "Vedaang Sharma",
  category: "entertainment",
  metadataBase: new URL("https://pop-cinema.vercel.app"),
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
    siteName: "POP — AI Movie Insight Builder",
    title: "POP — AI Movie Insights · Find Your Next Favorite Movie",
    description:
      "Honest scores, real viewer voices, emotion fingerprints, and a buttered bucket of recommendations. AI-powered movie discovery without the algorithm slop.",
    locale: "en_US",
    images: [
      {
        url: "/pop-logo.png",
        width: 512,
        height: 512,
        alt: "POP Cinema logo — a buttered popcorn bucket",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "POP — AI Movie Insights",
    description:
      "AI-powered movie discovery. Honest scores, emotion fingerprints, real viewer voices.",
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bagelFatOne.variable} ${jetbrainsMono.variable} ${nunito.variable}`}>
        {children}
      </body>
    </html>
  );
}
