"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Github, ExternalLink, Trophy, Users, LayoutDashboard, Database, BarChart3, X, ChevronRight } from "lucide-react";
import Section from "./ui/Section";

interface ProjectItem {
    id: string;
    title: string;
    description: string; // Short summary
    tags: string[];
    logo: string;
    demoUrl?: string;
    repoUrl?: string;
    detailedDescription: string;
    features: { icon: any; title: string; desc: string }[];
}

const PROJECTS: ProjectItem[] = [
    {
        id: "fantasya",
        title: "Fantasya",
        description: "Gestor de ligas fantasy y red social para comunidades privadas.",
        tags: ["ReactJS", "Firebase", "Tailwind"],
        logo: "/logoFantasya_v0.png",
        demoUrl: "https://fantasya-app.vercel.app/",
        repoUrl: "https://github.com/AdevTC/fantasya-app",
        detailedDescription: "Fantasya nace de la necesidad de centralizar la gestión de ligas fantasy privadas. No es solo una herramienta de cálculo, es un centro de operaciones social donde la competición y la comunidad se unen. Diseñada para ligas que disfrutan del control manual y la profundidad de datos.",
        features: [
            {
                icon: LayoutDashboard,
                title: "Gestión Integral",
                desc: "Administración completa de clasificación, plantillas, finanzas y alineaciones jornada a jornada."
            },
            {
                icon: BarChart3,
                title: "Mercado y Estadísticas",
                desc: "Registro detallado de fichajes (pujas, clausulazos) y gráficos de evolución de valor y rendimiento."
            },
            {
                icon: Users,
                title: "Componente Social",
                desc: "Feed tipo red social para interactuar con otros mánagers, posts, comentarios y chats privados."
            },
            {
                icon: Trophy,
                title: "Historial y Palmarés",
                desc: "Un 'Salón de la Fama' que guarda trofeos, récords y logros de cada temporada para la posteridad."
            }
        ]
    },
    {
        id: "worldcup",
        title: "World Cup 2026 Sim",
        description: "Simulador completo del Mundial. Sorteos, predicciones, fases y reportes PDF.",
        tags: ["ReactJS", "i18n", "PDF Generation"],
        logo: "/logo_worldcup.png",
        demoUrl: "https://worldcup2026simulator.vercel.app/",
        repoUrl: "https://github.com/AdevTC/my-project",
        detailedDescription: "Una herramienta exhaustiva para vivir el mundial antes de que ocurra. Permite gestionar múltiples partidas, personalizar el sorteo (oficial o aleatorio) y simular cada fase del torneo con todo lujo de detalles, desde la fase de grupos hasta la gloria final.",
        features: [
            {
                icon: Database,
                title: "Simulación Completa",
                desc: "Sorteos oficiales o aleatorios, fase de grupos con tablas dinámicas y cuadro de eliminatorias."
            },
            {
                icon: LayoutDashboard,
                title: "Personalización",
                desc: "Multilenguaje (8 idiomas), guía interactiva, temas claro/oscuro y gestión de 3 partidas paralelas."
            },
            {
                icon: Trophy,
                title: "Data Center y Premios",
                desc: "Asignación de Balón de Oro, Guante de Oro y análisis de rendimiento por confederaciones."
            },
            {
                icon: BarChart3,
                title: "Reportes PDF",
                desc: "Generación automática de un reporte de 3 páginas con todos los resultados y el podio final."
            }
        ]
    }
];

export default function Projects() {
    const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

    return (
        <Section id="projects" className="py-20 relative">
            <div className="mb-12 text-center space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold">
                    Proyectos <span className="text-primary">Destacados</span>
                </h2>
                <div className="h-1 w-20 bg-primary mx-auto rounded-full" />
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Aplicaciones desarrolladas con pasión, buscando siempre la utilidad real y el cuidado en el diseño.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
                {PROJECTS.map((project) => (
                    <motion.div
                        key={project.id}
                        layoutId={`card-${project.id}`}
                        onClick={() => setSelectedProject(project)}
                        className="group relative h-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col"
                        whileHover={{ y: -5 }}
                    >
                        {/* Border Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Large Logo Area - Key Focus */}
                        <div className="h-48 w-full bg-black/20 flex items-center justify-center p-8 relative overflow-dashed">
                            {/* Decorative background circle */}
                            <div className="absolute w-32 h-32 bg-primary/20 blur-[50px] rounded-full group-hover:bg-primary/30 transition-all duration-500" />

                            <motion.img
                                layoutId={`logo-${project.id}`}
                                src={project.logo}
                                alt={project.title}
                                className="w-full h-full object-contain relative z-10 drop-shadow-2xl group-hover:scale-110 transition-transform duration-300"
                            />
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col flex-grow relative z-10">
                            <motion.h3
                                layoutId={`title-${project.id}`}
                                className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors"
                            >
                                {project.title}
                            </motion.h3>

                            <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-auto">
                                {project.tags.map((tag) => (
                                    <span key={tag} className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide bg-white/5 border border-white/10 text-white/60">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary">
                                <ChevronRight size={20} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal Overlay */}
            <AnimatePresence>
                {selectedProject && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProject(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />

                        {/* Modal Card */}
                        <motion.div
                            layoutId={`card-${selectedProject.id}`}
                            className="bg-[#0f0f0f] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 shadow-2xl relative z-10 flex flex-col md:flex-row"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white/50 hover:text-white hover:bg-white/10 transition-colors z-20"
                            >
                                <X size={24} />
                            </button>

                            {/* Sidebar / Header Section */}
                            <div className="w-full md:w-1/3 bg-white/5 p-8 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-white/10 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-50" />

                                <motion.div
                                    layoutId={`logo-${selectedProject.id}`}
                                    className="w-32 h-32 md:w-48 md:h-48 mb-6 relative z-10"
                                >
                                    <img
                                        src={selectedProject.logo}
                                        alt={selectedProject.title}
                                        className="w-full h-full object-contain drop-shadow-2xl"
                                    />
                                </motion.div>

                                <motion.h3
                                    layoutId={`title-${selectedProject.id}`}
                                    className="text-3xl font-bold text-white mb-2 relative z-10"
                                >
                                    {selectedProject.title}
                                </motion.h3>

                                <div className="flex flex-wrap gap-2 justify-center mt-4 relative z-10">
                                    {selectedProject.tags.map((tag) => (
                                        <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/20">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Detailed Content Section */}
                            <div className="w-full md:w-2/3 p-8 bg-[#0a0a0a]">
                                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Sobre el proyecto</h4>
                                <p className="text-lg text-white/90 leading-relaxed mb-8">
                                    {selectedProject.detailedDescription}
                                </p>

                                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Características Clave</h4>
                                <div className="grid grid-cols-1 gap-4 mb-8">
                                    {selectedProject.features.map((feature, i) => (
                                        <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                            <div className="shrink-0 text-primary mt-1">
                                                <feature.icon size={24} />
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-white text-base">{feature.title}</h5>
                                                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-4 pt-4 border-t border-white/10">
                                    {selectedProject.demoUrl && (
                                        <a
                                            href={selectedProject.demoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 transform hover:-translate-y-0.5"
                                        >
                                            <ExternalLink size={20} />
                                            Ver Demo
                                        </a>
                                    )}
                                    {selectedProject.repoUrl && (
                                        <a
                                            href={selectedProject.repoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/10"
                                        >
                                            <Github size={20} />
                                            Ver Código
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Section>
    );
}
