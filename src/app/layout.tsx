import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import ViewCounter from "@/components/ViewCounter";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LikeButton from "@/components/LikeButton";
import { CommandPalette } from "@/components/CommandPalette";
import { cn } from "@/lib/utils";

import { FloatingComponentProvider } from "@/context/FloatingComponentContext";
import CornerAI from "@/components/widgets/CornerAI";
import Preloader from "@/components/ui/Preloader";
import FloatingWindowManager from "@/components/FloatingWindowManager";
import MobileFootbar from "@/components/MobileFootbar";
import DesktopSidebar from "@/components/DesktopSidebar";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Adrián Tomás Cerdá | Software Engineer",
  description: "Portfolio profesional de Adrián Tomás Cerdá. Ingeniero de Software & SAP Integrator.",
  icons: {
    icon: [
      { url: '/logo.png', href: '/logo.png' },
    ],
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={cn(outfit.className, "overflow-x-hidden")}>
        <ThemeProvider>
          <FloatingComponentProvider>
            <ViewCounter />
            <CommandPalette />
            <Navbar />
            <main className="min-h-screen relative selection:bg-primary/30 w-full overflow-x-hidden">
              {children}
            </main>



            {/* Corner Floating Widgets */}
            <CornerAI />
            <Preloader />

            <DesktopSidebar />

            <FloatingWindowManager />

            <Footer />
            <MobileFootbar />
          </FloatingComponentProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
