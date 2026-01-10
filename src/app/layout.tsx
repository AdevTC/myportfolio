import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import ViewCounter from "@/components/ViewCounter";
import Guestbook from "@/components/Guestbook";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LikeButton from "@/components/LikeButton";
import { CommandPalette } from "@/components/CommandPalette";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Adrián Tomás Cerdá | Software Engineer",
  description: "Portfolio profesional de Adrián Tomás Cerdá. Ingeniero de Software & SAP Integrator.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={outfit.className}>
        <ThemeProvider>
          <ViewCounter />
          <CommandPalette />
          <Navbar />
          <main className="min-h-screen relative selection:bg-primary/30">
            {children}
          </main>
          <Guestbook />
          <LikeButton />
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
