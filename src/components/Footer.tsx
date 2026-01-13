"use client";

import { useEffect, useState } from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import { useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGithubStats } from "@/hooks/useGithubStats";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import DownloadCV from "./DownloadCV";

function Counter({ to, label }: { to: number; label: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    useEffect(() => {
        if (isInView && to > 0) {
            let start = 0;
            const duration = 2000; // 2 sec
            // Ensure we step at least 1 at a time
            const step = Math.max(1, Math.ceil(to / 100));

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
        } else if (to > 0) {
            // If not in view yet but value changes, reset or just let inView trigger
            // We do nothing till view
        }
    }, [isInView, to]);

    return (
        <div ref={ref} className="text-center">
            <div className="text-2xl font-bold text-primary">{count.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-wider">{label}</div>
        </div>
    );
}

export default function Footer() {
    const { user } = useGithubStats();
    const [views, setViews] = useState(0);
    const [likes, setLikes] = useState(0);
    const [contributions, setContributions] = useState(0);
    const [stars, setStars] = useState(0);

    useEffect(() => {
        // Listen for view count & likes
        const unsub = onSnapshot(doc(db, "portfolio", "stats"), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setViews(data.views || 0);
                setLikes(data.likes || 0);
            }
        });

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

        return () => unsub();
    }, []);

    return (
        <footer className="w-full py-10 mt-20 border-t border-white/5 bg-black/20 backdrop-blur-sm">
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
                <div className="flex flex-col sm:flex-row gap-8 bg-white/5 p-5 rounded-2xl border border-white/5 items-center">
                    {/* Portfolio Stats */}
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-[10px] font-bold text-primary/70 uppercase tracking-widest mb-1">Portfolio Stats</span>
                        <div className="flex gap-6 md:gap-8">
                            <Counter to={views} label="Visitas" />
                            <Counter to={likes} label="Likes" />
                        </div>
                    </div>

                    <div className="w-full h-px sm:w-px sm:h-12 bg-white/10" />

                    {/* GitHub Stats */}
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-[10px] font-bold text-primary/70 uppercase tracking-widest mb-1">GitHub Stats</span>
                        <div className="flex gap-6 md:gap-8">
                            <Counter to={user ? user.public_repos : 25} label="Repositorios" />
                            <Counter to={stars} label="Stars" />
                            <Counter to={user ? user.followers : 100} label="Seguidores" />
                            <Counter to={contributions} label="Commits" />
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                <div className="flex gap-4 items-center">
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
