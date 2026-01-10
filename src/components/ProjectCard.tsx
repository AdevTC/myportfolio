"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Github, ExternalLink } from "lucide-react";

interface ProjectProps {
    title: string;
    description: string;
    tags: string[];
    color: string;
}

export default function ProjectCard({ title, description, tags, color }: ProjectProps) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

    function onMouseMove(event: React.MouseEvent<HTMLDivElement>) {
        const rect = event.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    }

    function onMouseLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <motion.div
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            className="relative w-full h-full min-h-[300px] rounded-2xl bg-white/5 border border-white/10 p-8 flex flex-col justify-between group cursor-pointer"
        >
            <div
                style={{ transform: "translateZ(50px)" }}
                className="absolute inset-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent -z-10 opacity-0 group-hover:opacity-100 transition-opacity"
            />

            <div style={{ transform: "translateZ(20px)" }}>
                <div className={`w-12 h-12 rounded-lg mb-6 flex items-center justify-center bg-gradient-to-br ${color}`}>
                    <div className="w-6 h-6 bg-white rounded-full opacity-20" />
                </div>

                <h3 className="text-2xl font-bold mb-3">{title}</h3>
                <p className="text-muted-foreground mb-6">{description}</p>

                <div className="flex flex-wrap gap-2 mb-8">
                    {tags.map(tag => (
                        <span key={tag} className="text-xs font-medium px-2 py-1 rounded bg-white/5 border border-white/5">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div style={{ transform: "translateZ(30px)" }} className="flex gap-4">
                <button className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                    <Github size={16} /> Repo
                </button>
                <button className="flex-1 py-2 rounded-lg bg-primary hover:brightness-110 transition-colors flex items-center justify-center gap-2 text-sm font-medium text-white">
                    <ExternalLink size={16} /> Demo
                </button>
            </div>
        </motion.div>
    );
}
