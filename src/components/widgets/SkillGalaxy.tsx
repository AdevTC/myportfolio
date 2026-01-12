"use client";

import FloatingWindow from "../ui/FloatingWindow";
import { motion } from "framer-motion";

const SKILLS = [
    { name: "React", x: 20, y: 30, color: "bg-cyan-500" },
    { name: "Node", x: 70, y: 60, color: "bg-green-500" },
    { name: "Next", x: 40, y: 80, color: "bg-white" },
    { name: "TS", x: 80, y: 20, color: "bg-blue-600" },
    { name: "SQL", x: 30, y: 50, color: "bg-orange-500" },
    { name: "Tailwind", x: 10, y: 10, color: "bg-teal-400" },
    { name: "SAP", x: 60, y: 10, color: "bg-blue-800" },
    { name: "Git", x: 50, y: 40, color: "bg-red-500" },
];

export default function SkillGalaxy() {
    return (
        <FloatingWindow id="skills" title="Galaxia de Skills" width={400} height={400} className="overflow-hidden">
            <div className="relative w-full h-full bg-[#050510] rounded-xl overflow-hidden cursor-crosshair group">
                {/* Background stars */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#050510] to-[#050510]" />

                {SKILLS.map((skill, i) => (
                    <motion.div
                        key={skill.name}
                        drag
                        dragConstraints={{ left: 0, right: 340, top: 0, bottom: 340 }}
                        initial={{ x: skill.x * 3, y: skill.y * 3 }}
                        animate={{
                            x: [skill.x * 3, skill.x * 3 + (Math.random() * 40 - 20), skill.x * 3],
                            y: [skill.y * 3, skill.y * 3 + (Math.random() * 40 - 20), skill.y * 3],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className={`absolute w-16 h-16 rounded-full ${skill.color} bg-opacity-20 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-110 active:cursor-grabbing hover:bg-opacity-40 transition-all z-10`}
                    >
                        <span className="text-[10px] font-bold text-white drop-shadow-md">{skill.name}</span>
                    </motion.div>
                ))}

                <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-indigo-400/50 pointer-events-none">
                    Arrastra los planetas
                </p>
            </div>
        </FloatingWindow>
    );
}
