import type { Metadata } from "next";
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
  title: "POP — Find Your Next Favorite Movie",
  description: "AI-powered movie insights with honest scores and real viewer voices. No algorithm slop.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${bagelFatOne.variable} ${jetbrainsMono.variable} ${nunito.variable}`}>
        {children}
      </body>
    </html>
  );
}
