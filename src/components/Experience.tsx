"use client";

import Section from "./ui/Section";
import { motion } from "framer-motion";
// import { Briefcase } from "lucide-react";

const EXPERIENCES = [
    {
        company: "Sapas Consulting - Grupo Costaisa",
        role: "SAP Cloud Integrations & BTP Developer",
        period: "Jul 2025 - Actualidad",
        description: "Diseño de integraciones clínicas (HL7 & SAP CPI) y Apps Cloud-Native con SAP CAP.",
        tech: ["SAP BTP", "CAP", "Node.js", "HL7"]
    },
    {
        company: "Timestamp",
        role: "Consultor de Integración SAP",
        period: "May 2025 - Jul 2025",
        description: "Desarrollo con Groovy, validaciones complejas y SuccessFactors.",
        tech: ["Groovy", "SuccessFactors", "CPI"]
    },
    {
        company: "Inetum",
        role: "Consultor Junior de Integración SAP",
        period: "Jul 2023 - May 2025",
        description: "Migración de legado y optimización de flujos en un 40%.",
        tech: ["SAP PI/PO", "Java", "XSLT"]
    }
];

interface ExperienceProps {
    limit?: number;
}

export default function Experience({ limit }: ExperienceProps) {
    const displayExperience = limit ? EXPERIENCES.slice(0, limit) : EXPERIENCES;
    return (
        <Section id="experience" className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">
                Experiencia <span className="text-primary">Profesional</span>
            </h2>

            <div className="relative max-w-4xl mx-auto">
                {/* Timeline Line */}
                <div className="max-w-4xl mx-auto space-y-12 relative before:absolute before:inset-0 before:ml-5 md:before:ml-[50%] before:-translate-x-px md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">
                    {displayExperience.map((exp, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? "md:flex-row-reverse" : ""
                                }`}
                        >
                            {/* Dot */}
                            <div className="absolute left-0 md:left-1/2 w-4 h-4 bg-primary rounded-full -translate-x-[7px] md:-translate-x-1/2 mt-1.5 ring-4 ring-black" />

                            {/* Content */}
                            <div className="ml-8 md:ml-0 md:w-1/2 p-6 glass rounded-2xl hover:border-primary/50 transition-colors group">
                                <span className="inline-block px-3 py-1 text-xs font-bold text-primary bg-primary/10 rounded-full mb-2">
                                    {exp.period}
                                </span>
                                <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                                    {exp.role}
                                </h3>
                                <h4 className="text-lg font-medium text-muted-foreground mb-4">
                                    {exp.company}
                                </h4>
                                <p className="text-muted-foreground mb-4">
                                    {exp.description}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {exp.tech.map(t => (
                                        <span key={t} className="text-xs px-2 py-1 bg-white/5 rounded border border-white/5">
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="hidden md:block md:w-1/2" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </Section>
    );
}
