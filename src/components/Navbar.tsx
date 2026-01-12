"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ColorSwitcher from "./ColorSwitcher";
import DownloadCV from "./DownloadCV";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
    { name: "Inicio", href: "/" },
    { name: "Sobre Mí", href: "/about" },
    { name: "Experiencia", href: "/experience" },
    { name: "Proyectos", href: "/projects" },
    { name: "Educación", href: "/education" },
    { name: "Habilidades", href: "/skills" },
    { name: "Testimonios", href: "/testimonials" },
    { name: "Hobbies", href: "/hobbies" },
    { name: "Contacto", href: "/contact" },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const isActive = (path: string) => {
        if (path === "/" && pathname === "/") return true;
        if (path !== "/" && pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
                isScrolled ? "h-16 glass border-white/5" : "h-24 bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-xl font-bold tracking-tighter hover:text-primary transition-colors">
                    &lt;AdrianDev /&gt;
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors relative",
                                isActive(link.href) ? "text-primary" : "hover:text-primary"
                            )}
                        >
                            {link.name}
                            {isActive(link.href) && (
                                <motion.div
                                    layoutId="navbar-indicator"
                                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                                />
                            )}
                        </Link>
                    ))}
                    <div className="w-px h-6 bg-white/20 mx-2" />
                    <DownloadCV variant="ghost" />
                    <ColorSwitcher />
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-4">
                    <DownloadCV variant="icon" />
                    <ColorSwitcher />
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden glass border-b border-white/10 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-4">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={cn(
                                        "text-lg font-medium py-2 border-b border-white/5 last:border-0 transition-colors",
                                        isActive(link.href) ? "text-primary" : "hover:text-primary"
                                    )}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
