"use client";

import { useEffect, useState, useRef } from "react";
import { Github, Linkedin, Mail, Eye, Heart, MessageSquare, Star, GitCommit, BookOpen, Users, ArrowUpRight } from "lucide-react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useGithubStats } from "@/hooks/useGithubStats";
import { usePortfolioStats } from "@/hooks/usePortfolioStats";
import ShareButton from "./ShareButton";
import DownloadCV from "./DownloadCV";

/* ─── Animated Counter ─── */
function Counter({ to, label, icon: Icon, isFloat = false }: {
    to: number;
    label: string;
    icon: React.ElementType;
    isFloat?: boolean;
}) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView && to > 0) {
            let start = 0;
            const step = isFloat ? 0.1 : Math.max(1, Math.ceil(to / 80));
            const timer = setInterval(() => {
                start += step;
                if (start >= to) {
                    setCount(to);
                    clearInterval(timer);
                } else {
                    setCount(start);
                }
            }, 20);
            return () => clearInterval(timer);
        }
    }, [isInView, to, isFloat]);

    return (
        <div ref={ref} className="flex flex-col items-center gap-1 group">
            <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                <Icon size={18} />
            </div>
            <div className="text-lg font-bold text-white tabular-nums">
                {isFloat ? count.toFixed(1) + "/5.0" : count.toLocaleString()}
            </div>
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">{label}</div>
        </div>
    );
}

/* ─── Navigation Links ─── */
const NAV_COLUMNS = [
    {
        title: "Páginas",
        links: [
            { name: "Inicio", href: "/" },
            { name: "Experiencia", href: "/experience" },
            { name: "Educación", href: "/education" },
            { name: "Proyectos", href: "/projects" },
        ],
    },
    {
        title: "Más",
        links: [
            { name: "Sobre Mí", href: "/about" },
            { name: "Habilidades", href: "/skills" },
            { name: "Testimonios", href: "/testimonials" },
            { name: "Hobbies", href: "/hobbies" },
        ],
    },
    {
        title: "Contacto",
        links: [
            { name: "Email", href: "mailto:adriantomascv@gmail.com" },
            { name: "LinkedIn", href: "https://linkedin.com/in/adriantomascerda" },
            { name: "GitHub", href: "https://github.com/AdevTC" },
            { name: "Formulario", href: "/contact" },
        ],
    },
];

/* ─── Stagger Animation Variants ─── */
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

/* ─── Footer Component ─── */
export default function Footer() {
    const { user } = useGithubStats();
    const { views, likes, comments, rating } = usePortfolioStats();
    const [contributions, setContributions] = useState(0);
    const [stars, setStars] = useState(0);
    const footerRef = useRef(null);
    const isInView = useInView(footerRef, { once: true, margin: "-50px" });

    useEffect(() => {
        const CACHE_KEY = "github_footer_stats";
        const CACHE_DURATION = 5 * 60 * 1000;

        const cached = localStorage.getItem(CACHE_KEY);
        const now = Date.now();

        if (cached) {
            const { stars, contributions, timestamp } = JSON.parse(cached);
            if (now - timestamp < CACHE_DURATION) {
                setStars(stars);
                setContributions(contributions);
                return;
            }
        }

        Promise.all([
            fetch("https://github-contributions-api.jogruber.de/v4/AdevTC?y=all").then(res => res.json()),
            fetch("https://api.github.com/users/AdevTC/repos?per_page=100").then(res => res.json()),
        ]).then(([contributionsData, reposData]) => {
            let newContributions = 0;
            let newStars = 0;

            if (contributionsData?.total) {
                newContributions = Object.values(contributionsData.total).reduce(
                    (a: any, b: any) => a + b, 0
                ) as number;
            }

            if (Array.isArray(reposData)) {
                newStars = reposData.reduce(
                    (acc: number, repo: any) => acc + (repo.stargazers_count || 0), 0
                );
            }

            setContributions(newContributions);
            setStars(newStars);

            localStorage.setItem(CACHE_KEY, JSON.stringify({
                stars: newStars,
                contributions: newContributions,
                timestamp: now,
            }));
        }).catch(err => console.error("Error fetching GitHub stats:", err));
    }, []);

    return (
        <footer
            ref={footerRef}
            className="relative w-full mt-16 lg:mt-24 overflow-hidden pb-24 lg:pb-0"
        >
            {/* ─── Decorative Glow ─── */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] lg:w-[600px] h-[200px] lg:h-[300px] bg-primary/15 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[200px] lg:w-[300px] h-[150px] lg:h-[200px] bg-blue-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

            {/* ─── Top Gradient Separator ─── */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            <div className="bg-gradient-to-b from-black/30 via-black/20 to-black/40 backdrop-blur-xl">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="max-w-7xl mx-auto px-5 lg:px-8 pt-10 lg:pt-16 pb-6 lg:pb-8"
                >
                    {/* ─── Row 1: Stats Section ─── */}
                    <motion.div variants={itemVariants} className="mb-10 lg:mb-16">
                        <div className="rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-sm p-5 lg:p-8">
                            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-8">
                                {/* Portfolio Stats */}
                                <div className="flex flex-col items-center gap-4 lg:gap-5">
                                    <span className="text-[10px] font-bold text-primary/80 uppercase tracking-[0.2em]">
                                        Portfolio Stats
                                    </span>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 lg:gap-8 w-full justify-items-center">
                                        <Counter to={likes} label="Likes" icon={Heart} />
                                        <Counter to={views} label="Visitas" icon={Eye} />
                                        <Counter to={comments} label="Comentarios" icon={MessageSquare} />
                                        <Counter to={rating} label="Estrellas" icon={Star} isFloat />
                                    </div>
                                </div>

                                {/* Divider — horizontal on mobile, vertical on desktop */}
                                <div className="w-full h-px lg:hidden bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                                <div className="relative flex flex-col items-center gap-4 lg:gap-5">
                                    <div className="hidden lg:block absolute left-0 top-4 bottom-4 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                                    <span className="text-[10px] font-bold text-primary/80 uppercase tracking-[0.2em]">
                                        GitHub Stats
                                    </span>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 lg:gap-8 w-full justify-items-center">
                                        <Counter to={user ? user.public_repos : 25} label="Repos" icon={BookOpen} />
                                        <Counter to={stars} label="Stars" icon={Star} />
                                        <Counter to={user ? user.followers : 100} label="Seguidores" icon={Users} />
                                        <Counter to={contributions} label="Commits" icon={GitCommit} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* ─── Row 2: Brand + Nav Links ─── */}
                    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-10 lg:gap-12">
                        {/* Brand Column */}
                        <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col items-center lg:items-start gap-4 text-center lg:text-left">
                            <Link href="/" className="hover:opacity-80 transition-opacity w-fit">
                                <Image
                                    src="/brand/logo.png"
                                    alt="Logo"
                                    width={70}
                                    height={70}
                                    className="w-auto h-14 lg:h-16 object-contain invert dark:invert-0"
                                />
                            </Link>
                            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
                                Ingeniero de Software apasionado por crear experiencias digitales excepcionales.
                                Siempre aprendiendo, siempre construyendo.
                            </p>
                            {/* Social Icons */}
                            <div className="flex gap-2 mt-2 flex-wrap justify-center lg:justify-start">
                                {[
                                    { icon: Github, href: "https://github.com/AdevTC", label: "GitHub" },
                                    { icon: Linkedin, href: "https://linkedin.com/in/adriantomascerda", label: "LinkedIn" },
                                    { icon: Mail, href: "mailto:adriantomascv@gmail.com", label: "Email" },
                                ].map(({ icon: SocialIcon, href, label }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target={href.startsWith("mailto") ? undefined : "_blank"}
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-primary/20 hover:border-primary/30 hover:scale-110 transition-all duration-300"
                                    >
                                        <SocialIcon size={18} />
                                    </a>
                                ))}
                                <ShareButton className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-zinc-400 hover:text-white hover:bg-primary/20 hover:border-primary/30 hover:scale-110 transition-all duration-300" />
                                <DownloadCV
                                    variant="icon"
                                    className="!p-2.5 rounded-xl !bg-white/5 border border-white/5 !text-zinc-400 hover:!text-white hover:!bg-primary/20 hover:border-primary/30 hover:scale-110 transition-all duration-300"
                                />
                            </div>
                        </motion.div>

                        {/* Navigation Columns */}
                        <div className="lg:col-span-8 grid grid-cols-3 gap-6 lg:gap-0">
                            {NAV_COLUMNS.map((col) => (
                                <motion.div key={col.title} variants={itemVariants} className="lg:col-span-1 flex flex-col gap-3 lg:gap-4 lg:items-start items-center">
                                    <h4 className="text-xs font-bold text-primary uppercase tracking-widest">{col.title}</h4>
                                    <ul className="flex flex-col gap-2 lg:gap-2.5 items-center lg:items-start">
                                        {col.links.map((link) => {
                                            const isExternal = link.href.startsWith("http") || link.href.startsWith("mailto");
                                            const Comp = isExternal ? "a" : Link;
                                            const extraProps = isExternal
                                                ? { target: link.href.startsWith("mailto") ? undefined : "_blank", rel: "noopener noreferrer" }
                                                : {};
                                            return (
                                                <li key={link.name}>
                                                    <Comp
                                                        href={link.href}
                                                        {...extraProps}
                                                        className="text-sm text-zinc-400 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center gap-1 group/link"
                                                    >
                                                        {link.name}
                                                        {isExternal && (
                                                            <ArrowUpRight size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                                        )}
                                                    </Comp>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* ─── Row 3: Bottom Bar ─── */}
                    <motion.div
                        variants={itemVariants}
                        className="mt-10 lg:mt-12 pt-5 lg:pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2"
                    >
                        <p className="text-xs text-zinc-500">
                            © {new Date().getFullYear()} Adrián Tomás Cerdá. Todos los derechos reservados.
                        </p>
                        <p className="text-xs text-zinc-600">
                            Diseñado y desarrollado con <span className="text-primary">♥</span>
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </footer>
    );
}
