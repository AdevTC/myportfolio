"use client";

import Section from "./ui/Section";
import { motion } from "framer-motion";

const SKILLS = {
    backend: ["Java", "Spring Boot", "Node.js", "Express", "Groovy", "SQL", "MongoDB"],
    frontend: ["Angular", "React", "Next.js", "Astro", "TypeScript", "Tailwind CSS"],
    integration: ["SAP CPI", "SAP BTP", "SAP CAP", "OData", "XSD", "WSDL", "SOAP/REST"]
};

function Marquee({ items, direction = "left", speed = 50 }: { items: string[], direction?: "left" | "right", speed?: number }) {
    return (
        <div className="flex overflow-hidden w-full relative group mask-linear">
            {/* mask-linear isn't a standard tailwind class, will rely on inline styles or add utility? 
           I'll just add overflow-hidden and standard flex. 
       */}
            <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-background to-transparent" />
            <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-background to-transparent" />

            <motion.div
                initial={{ x: direction === "left" ? 0 : "-50%" }}
                animate={{ x: direction === "left" ? "-50%" : 0 }}
                transition={{ repeat: Infinity, ease: "linear", duration: speed }}
                className="flex gap-4 py-4 min-w-max"
            >
                {[...items, ...items, ...items, ...items].map((item, idx) => (
                    <div
                        key={`${item}-${idx}`}
                        className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-lg font-medium hover:bg-primary/20 hover:border-primary/50 transition-colors cursor-default whitespace-nowrap"
                    >
                        {item}
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

export default function Skills() {
    return (
        <Section id="skills" className="overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
                Arsenal <span className="text-primary">Tecnológico</span>
            </h2>

            <div className="space-y-12">
                <div>
                    <h3 className="text-xl font-medium text-center mb-6 text-muted-foreground">Backend & Core</h3>
                    <Marquee items={SKILLS.backend} direction="left" speed={30} />
                </div>

                <div>
                    <h3 className="text-xl font-medium text-center mb-6 text-muted-foreground">Frontend Experience</h3>
                    <Marquee items={SKILLS.frontend} direction="right" speed={35} />
                </div>

                <div>
                    <h3 className="text-xl font-medium text-center mb-6 text-muted-foreground">SAP & Integration Ecosystem</h3>
                    <Marquee items={SKILLS.integration} direction="left" speed={40} />
                </div>
            </div>
        </Section>
    );
}
