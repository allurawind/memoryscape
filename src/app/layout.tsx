import type { Metadata } from "next";
import { Silkscreen, Space_Grotesk } from "next/font/google";
import SiteNav from "../components/SiteNav";
import { AudioProvider } from "@/contexts/AudioContext";
import "./globals.css";

const silkscreen = Silkscreen({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "SHRAVANI'S WORLD",
  description: "Brutal sci-fi memoryscape.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body
        suppressHydrationWarning
        className={`${spaceGrotesk.variable} ${silkscreen.variable} min-h-full bg-[#0a0a0f] font-sans text-white`}
      >
        <AudioProvider>
          <SiteNav />
          {children}
        </AudioProvider>
      </body>
    </html>
  );
}
