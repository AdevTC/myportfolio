"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Section from "./ui/Section";
import { GraduationCap, Award, MapPin, ExternalLink } from "lucide-react";
import React, { useRef } from "react";
import { cn } from "@/lib/utils";

// --- Data ---
const EDUCATION = [
    {
        title: "Grado en Ingeniería Informática",
        institution: "UNIR - Universidad Internacional de La Rioja",
        year: "2025 - 2028",
        description: "Doble mención en Ingeniería de Software y Computación. Formación avanzada en programación (paralela, distribuida), algoritmia, IA, ML y ciberseguridad. Preparación para roles de arquitectura de software y consultoría tecnológica.",
        longDescription: "Estudio el Grado en Ingeniería Informática en UNIR, con doble mención en Computación e Ingeniería del Software. Adquiriendo una sólida base teórica y práctica en programación avanzada (paralela, concurrente y distribuida), algoritmia, bases de datos, redes y sistemas distribuidos, inteligencia artificial, aprendizaje automático, ingeniería del software (requisitos, metodologías y reutilización), sistemas de información, usabilidad e interfaces, normativa tecnológica nacional e internacional y ciberseguridad.",
        color: "text-blue-400",
        border: "border-blue-500/50",
        bg: "bg-blue-500/10"
    },
    {
        title: "GS Desarrollo de Aplicaciones Web",
        institution: "Cesur",
        year: "Oct 2023 - Jun 2025",
        description: "Especialización en Blockchain. Stack: JavaScript, Ethereum, Bitcoin, HTML/CSS, XAMPP. Diseño de interfaces y despliegue de dApps.",
        color: "text-purple-400",
        border: "border-purple-500/50",
        bg: "bg-purple-500/10"
    },
    {
        title: "GS Desarrollo de Aplicaciones Multiplataforma",
        institution: "Cesur",
        year: "Sept 2022 - Jun 2024",
        description: "Delegado de clase. Desarrollo Java (Swing, JDBC), Android Studio, SQL (Oracle, MySQL). Enfoque en POO, MVC y ciberseguridad.",
        color: "text-emerald-400",
        border: "border-emerald-500/50",
        bg: "bg-emerald-500/10"
    },
    {
        title: "Bachillerato Tecnológico",
        institution: "Colegio SEI Nuestra Señora de la Merced",
        year: "Sept 2020 - May 2022",
        description: "Equipo de Baloncesto. Base sólida en Matemáticas, Física e Inglés. Fomento del trabajo en equipo.",
        color: "text-amber-400",
        border: "border-amber-500/50",
        bg: "bg-amber-500/10"
    }
];

const CERTIFICATIONS = [
    {
        name: "APTIS English First B2 Certificate",
        issuer: "British Council",
        year: "May 2025",
        icon: Award,
        color: "group-hover:text-pink-400",
        url: "https://credentials.britishcouncil.org/01214a1f-acd5-4c27-ae31-1e230aeafa97?key=439a1d63936c726301337f5fef8cc797222afd02555b678741de02e54254164f#acc.Mxu25nKN"
    },
    {
        name: "Discovering SAP Integration Suite",
        issuer: "SAP",
        year: "Apr 2024",
        icon: Award,
        color: "group-hover:text-blue-400",
        url: "https://www.credly.com/badges/db60fc5e-07ba-4a9f-87ed-85d47ab5fdb9/linked_in_profile"
    },
    {
        name: "Discovering SAP BTP",
        issuer: "SAP",
        year: "Dec 2023",
        icon: Award,
        color: "group-hover:text-blue-400",
        url: "https://www.credly.com/badges/7cc1bda9-0948-4a21-9316-276e2f406994/linked_in_profile"
    },
    {
        name: "Introducing Cloud Security on SAP BTP",
        issuer: "SAP",
        year: "Dec 2023",
        icon: Award,
        color: "group-hover:text-blue-400",
        url: "https://www.credly.com/badges/b261f5e3-d1bb-44d7-afba-58b545060f42/linked_in_profile"
    }
];

// --- 3D Tilt Card Component ---
function TiltCard({ children, className, href }: { children: React.ReactNode; className?: string; href?: string }) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 500, damping: 100 });
    const mouseY = useSpring(y, { stiffness: 500, damping: 100 });

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const Content = (
        <motion.div
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={cn("relative z-10 w-full", className)}
        >
            <div
                style={{
                    transform: "translateZ(75px)",
                    transformStyle: "preserve-3d",
                }}
                className="h-full"
            >
                {children}
            </div>
        </motion.div>
    );

    if (href) {
        return <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">{Content}</a>;
    }
    return <div className="h-full">{Content}</div>;
}

export default function Education() {
    return (
        <Section id="education" className="py-20 overflow-visible">
            <div className="flex flex-col mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4 flex items-center gap-4">
                    <GraduationCap className="text-primary" size={48} />
                    Trayectoria <span className="text-primary">Académica</span>
                </h2>
                <div className="h-1 w-32 bg-primary rounded-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

                {/* Timeline Column */}
                <div className="lg:col-span-7 space-y-12 relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary via-primary/20 to-transparent" />

                    {EDUCATION.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="relative pl-20 group"
                        >
                            {/* Dot */}
                            <div className={cn(
                                "absolute left-0 top-0 w-14 h-14 rounded-2xl flex items-center justify-center border-2 bg-[#0a0a0a] z-10 transition-colors duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)]",
                                item.border,
                                item.color
                            )}>
                                <GraduationCap size={24} />
                            </div>

                            {/* Content Card */}
                            <div className="bg-white/5 border border-white/5 p-6 rounded-2xl hover:bg-white/10 transition-all hover:border-white/20 group-hover:translate-x-2 duration-300">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                                    <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                                        {item.title}
                                    </h3>
                                    <span className={cn("text-xs font-bold px-3 py-1 rounded-full w-fit mt-2 sm:mt-0 whitespace-nowrap", item.bg, item.color)}>
                                        {item.year}
                                    </span>
                                </div>
                                <h4 className="text-lg font-medium text-white/80 flex items-center gap-2 mb-3">
                                    <MapPin size={16} className="text-zinc-500" />
                                    {item.institution}
                                </h4>
                                <p className="text-sm text-zinc-300 leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Certifications and Extras Column */}
                <div className="lg:col-span-5 flex flex-col gap-8">
                    <div className="sticky top-24">
                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                            <Award className="text-primary" size={28} /> Certificaciones
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {CERTIFICATIONS.map((cert, index) => (
                                <TiltCard key={index} className="h-full" href={cert.url}>
                                    <div className="h-full group relative bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-2xl border border-white/10 shadow-xl backdrop-blur-sm hover:border-primary/30">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

                                        {/* External Link Indicator */}
                                        {cert.url && (
                                            <div className="absolute top-3 right-3 text-white/20 group-hover:text-white transition-colors">
                                                <ExternalLink size={14} />
                                            </div>
                                        )}

                                        <div className="relative z-10 flex flex-col items-center text-center gap-4">
                                            <div className="p-3 bg-black/40 rounded-full shadow-inner">
                                                <cert.icon size={32} className={cn("text-zinc-400 transition-colors duration-500", cert.color)} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-sm leading-tight mb-2">
                                                    {cert.name}
                                                </h4>
                                                <p className="text-xs text-primary/80 font-mono tracking-wider bg-primary/10 px-2 py-0.5 rounded-md inline-block">
                                                    {cert.issuer}
                                                </p>
                                            </div>
                                            <div className="mt-auto pt-2 border-t border-white/5 w-full flex justify-center">
                                                <span className="text-[10px] uppercase font-bold text-zinc-500 flex items-center gap-1">
                                                    Expedición: <span className="text-zinc-300">{cert.year}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </TiltCard>
                            ))}
                        </div>

                        {/* Additional Motivation/Status Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-primary/20 to-purple-500/20 border border-white/10 relative overflow-hidden"
                        >
                            <div className="absolute -right-4 -top-4 opacity-20 rotate-12">
                                <Award size={120} />
                            </div>
                            <h4 className="text-lg font-bold text-white mb-2 relative z-10">Aprendizaje Continuo</h4>
                            <p className="text-sm text-zinc-300 relative z-10 leading-relaxed">
                                Enfocado en <span className="text-primary font-bold">Cloud Architecture</span>, <span className="text-purple-400 font-bold">AI Integration</span> y <span className="text-emerald-400 font-bold">Ciberseguridad</span>.
                            </p>
                        </motion.div>
                    </div>
                </div>

            </div>
        </Section>
    );
}
