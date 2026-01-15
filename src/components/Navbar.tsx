"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ColorSwitcher from "./ColorSwitcher";
import DownloadCV from "./DownloadCV";
import { cn } from "@/lib/utils";

const MAIN_LINKS = [
    { name: "Inicio", href: "/" },
    { name: "Experiencia", href: "/experience" },
    { name: "Educación", href: "/education" },
    { name: "Proyectos", href: "/projects" },
    { name: "Contacto", href: "/contact" },
];

const MORE_LINKS = [
    { name: "Sobre Mí", href: "/about" },
    { name: "Habilidades", href: "/skills" },
    { name: "Testimonios", href: "/testimonials" },
    { name: "Hobbies", href: "/hobbies" },
];

const ALL_LINKS = [...MAIN_LINKS, ...MORE_LINKS];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMoreOpen, setIsMoreOpen] = useState(false);
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
                <Link href="/" className="hover:opacity-80 transition-opacity">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={50}
                        height={50}
                        className="w-auto h-12 object-contain invert dark:invert-0"
                    />
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {MAIN_LINKS.map((link) => (
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

                    {/* Dropdown "Más" */}
                    <div
                        className="relative"
                        onMouseEnter={() => setIsMoreOpen(true)}
                        onMouseLeave={() => setIsMoreOpen(false)}
                    >
                        <button
                            className={cn(
                                "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary",
                                MORE_LINKS.some(link => isActive(link.href)) ? "text-primary" : ""
                            )}
                        >
                            Más <ChevronDown size={14} />
                        </button>

                        <AnimatePresence>
                            {isMoreOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-full right-0 mt-2 w-48 bg-[#0f121b] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
                                >
                                    {MORE_LINKS.map(link => (
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className={cn(
                                                "block px-4 py-3 text-sm transition-colors border-b border-white/5 last:border-0 hover:bg-white/5",
                                                isActive(link.href) ? "text-primary font-bold bg-primary/5" : "text-zinc-300 hover:text-white"
                                            )}
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="w-px h-6 bg-white/20 mx-2" />
                    <DownloadCV variant="ghost" />
                    <ColorSwitcher />
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-4">
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
                            {ALL_LINKS.map((link) => (
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
