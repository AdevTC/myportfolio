import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import ViewCounter from "@/components/ViewCounter";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LikeButton from "@/components/LikeButton";
import { CommandPalette } from "@/components/CommandPalette";

import { FloatingComponentProvider } from "@/context/FloatingComponentContext";
import CornerAI from "@/components/widgets/CornerAI";
import CornerTools from "@/components/widgets/CornerTools";
import FABMenu from "@/components/widgets/FABMenu";
import FloatingWindowManager from "@/components/FloatingWindowManager";
import CodeActivityModal from "@/components/CodeActivityModal";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Adrián Tomás Cerdá | Software Engineer",
  description: "Portfolio profesional de Adrián Tomás Cerdá. Ingeniero de Software & SAP Integrator.",
  icons: {
    icon: "/logo.png",
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
          <FloatingComponentProvider>
            <ViewCounter />
            <CommandPalette />
            <Navbar />
            <main className="min-h-screen relative selection:bg-primary/30">
              {children}
            </main>

            <LikeButton />

            {/* Corner Floating Widgets */}
            <CornerAI />
            <CornerTools />
            <FABMenu />

            <FloatingWindowManager />
            <CodeActivityModal />

            <Footer />
          </FloatingComponentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
