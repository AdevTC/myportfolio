"use client";

import { useEffect, useState } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGithubStats } from "@/hooks/useGithubStats";
import { usePortfolioStats } from "@/hooks/usePortfolioStats";
import { Download, Share2, Eye, MessageSquare, Star } from "lucide-react";
// ... imports

// ... imports
import ShareButton from "./ShareButton";
import DownloadCV from "./DownloadCV";

function Counter({ to, label, isFloat = false }: { to: number; label: string; isFloat?: boolean }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView && to > 0) {
            let start = 0;
            // Ensure we step at least 1 at a time (or 0.1 for floats)
            const step = isFloat ? 0.1 : Math.max(1, Math.ceil(to / 100));
            const intervalTime = 20;

            const timer = setInterval(() => {
                start += step;
                if (start >= to) {
                    setCount(to);
                    clearInterval(timer);
                } else {
                    setCount(start);
                }
            }, intervalTime);

            return () => clearInterval(timer);
        }
    }, [isInView, to, isFloat]);

    return (
        <div ref={ref} className="text-center">
            <div className="text-2xl font-bold text-primary">
                {isFloat ? count.toFixed(1) + "/5.0" : count.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
        </div>
    );
}

export default function Footer() {
    const { user } = useGithubStats();
    const { views, likes, comments, rating } = usePortfolioStats();
    const [contributions, setContributions] = useState(0);
    const [stars, setStars] = useState(0);

    useEffect(() => {
        // Fetch total contributions
        fetch("https://github-contributions-api.jogruber.de/v4/AdevTC?y=all")
            .then(res => res.json())
            .then(data => {
                if (data?.total) {
                    const total = Object.values(data.total).reduce((a: any, b: any) => a + b, 0) as number;
                    setContributions(total);
                }
            })
            .catch(err => console.error(err));

        // Fetch stars
        fetch("https://api.github.com/users/AdevTC/repos?per_page=100")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const totalStars = data.reduce((acc: number, repo: any) => acc + (repo.stargazers_count || 0), 0);
                    setStars(totalStars);
                }
            })
            .catch(err => console.error("Error fetching stars:", err));
    }, []);

    return (
        <footer className="w-full py-10 pb-32 lg:pb-10 mt-20 border-t border-white/5 bg-black/20 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">

                {/* Brand & Copyright */}
                <div className="text-center md:text-left flex flex-col items-center md:items-start">
                    <Link href="/" className="hover:opacity-80 transition-opacity mb-2">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={70}
                            height={70}
                            className="w-auto h-20 object-contain invert dark:invert-0"
                        />
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">
                        © {new Date().getFullYear()} Adrián Tomás Cerdá. Todos los derechos reservados.
                    </p>
                </div>

                {/* Live Counters */}
                <div className="flex flex-col xl:flex-row gap-8 xl:gap-12 bg-white/5 px-6 py-6 rounded-3xl border border-white/5 items-center justify-center w-full max-w-full overflow-hidden">
                    {/* Portfolio Stats */}
                    <div className="flex flex-col items-center gap-4 w-full sm:w-auto">
                        <span className="text-[10px] font-bold text-primary/70 uppercase tracking-widest">Portfolio Stats</span>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:gap-12 w-full">
                            <Counter to={likes} label="Likes" />
                            <Counter to={views} label="Visitas" />
                            <Counter to={comments} label="Comentarios" />
                            <Counter to={rating} label="ESTRELLAS" isFloat />
                        </div>
                    </div>

                    <div className="w-full h-px xl:w-px xl:h-16 bg-white/10" />

                    {/* GitHub Stats */}
                    <div className="flex flex-col items-center gap-4 w-full sm:w-auto">
                        <span className="text-[10px] font-bold text-primary/70 uppercase tracking-widest">GitHub Stats</span>
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4 sm:gap-10 w-full">
                            <Counter to={user ? user.public_repos : 25} label="Repositorios" />
                            <Counter to={stars} label="Stars" />
                            <Counter to={user ? user.followers : 100} label="Seguidores" />
                            <Counter to={contributions} label="Commits" />
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="flex gap-4 items-center">
                    <ShareButton className="p-2 bg-white/5 rounded-full hover:bg-primary hover:text-white transition-colors" />
                    <DownloadCV variant="icon" />
                    <a href="https://linkedin.com/in/adriantomascerda" target="_blank" rel="noopener noreferrer"
                        className="p-2 bg-white/5 rounded-full hover:bg-primary hover:text-white transition-colors">
                        <Linkedin size={20} />
                    </a>
                    <a href="mailto:adriantomascv@gmail.com"
                        className="p-2 bg-white/5 rounded-full hover:bg-primary hover:text-white transition-colors">
                        <Mail size={20} />
                    </a>
                    <a href="https://github.com/AdevTC" target="_blank" rel="noopener noreferrer"
                        className="p-2 bg-white/5 rounded-full hover:bg-primary hover:text-white transition-colors">
                        <Github size={20} />
                    </a>
                </div>
            </div>
        </footer>
    );
}
