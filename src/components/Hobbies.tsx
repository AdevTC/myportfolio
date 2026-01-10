"use client";

import Section from "./ui/Section";
import { Plane, Cpu, Languages } from "lucide-react";

const HOBBIES = [
    { icon: Plane, label: "Viajar", desc: "Explorando nuevas culturas" },
    { icon: Cpu, label: "Blockchain", desc: "Smart Contracts & Web3" },
    { icon: Languages, label: "Idiomas", desc: "Rompiendo barreras" },
];

export default function Hobbies() {
    return (
        <Section className="py-10">
            <div className="flex justify-center gap-12 flex-wrap">
                {HOBBIES.map((hobby, i) => (
                    <div key={i} className="group relative flex flex-col items-center gap-2 cursor-help">
                        <div className="p-4 rounded-full bg-white/5 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                            <hobby.icon size={24} className="text-white" />
                        </div>
                        <span className="text-sm font-medium">{hobby.label}</span>

                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black px-3 py-1 rounded text-xs whitespace-nowrap pointer-events-none">
                            {hobby.desc}
                        </div>
                    </div>
                ))}
            </div>
        </Section>
    );
}
