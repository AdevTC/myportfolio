"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Github, ExternalLink, Trophy, Users, LayoutDashboard, Database, BarChart3, X, ChevronRight, ChevronLeft, Image as ImageIcon } from "lucide-react";
import Section from "./ui/Section";

interface ProjectItem {
    id: string;
    title: string;
    description: string;
    tags: string[];
    logo: string;
    demoUrl?: string;
    repoUrl?: string;
    detailedDescription: string;
    features: { icon: any; title: string; desc: string }[];
    gallery: string[]; // New field for images
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
        ],
        gallery: [
            "/fantasya1.jpg", "/fantasya2.jpg", "/fantasya3.jpg", "/fantasya4.jpg", "/fantasya5.jpg",
            "/fantasya6.jpg", "/fantasya7.jpg", "/fantasya8.jpg", "/fantasya9.jpg", "/fantasya10.jpg",
            "/fantasya11.jpg", "/fantasya12.jpg", "/fantasya13.jpg", "/fantasya14.jpg", "/fantasya15.jpg"
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
        ],
        gallery: [
            "/wdc1.png",
            "/wdc2.png",
            "/wdc3.png",
            "/wdc4.png"
        ]
    }
];

export default function Projects() {
    const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const openProject = (project: ProjectItem) => {
        setSelectedProject(project);
        setCurrentImageIndex(0);
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!selectedProject) return;
        setCurrentImageIndex((prev) => (prev + 1) % selectedProject.gallery.length);
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!selectedProject) return;
        setCurrentImageIndex((prev) => (prev - 1 + selectedProject.gallery.length) % selectedProject.gallery.length);
    };

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
                        onClick={() => openProject(project)}
                        className="group relative h-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-primary/50 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 flex flex-col shadow-lg hover:shadow-primary/5"
                        whileHover={{ y: -5 }}
                    >
                        {/* Large Logo Area */}
                        <div className="h-48 w-full bg-gradient-to-br from-white/5 to-white/10 flex items-center justify-center p-8 relative overflow-hidden">
                            {/* Gallery Preview Background - Subtle */}
                            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500 overflow-hidden">
                                <img src={project.gallery[0]} alt="" className="w-full h-full object-cover blur-sm" />
                            </div>

                            <motion.img
                                layoutId={`logo-${project.id}`}
                                src={project.logo}
                                alt={project.title}
                                className="w-auto h-full object-contain relative z-10 drop-shadow-2xl group-hover:scale-110 transition-transform duration-300"
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

                            <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-grow line-clamp-3">
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
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 overflow-hidden">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedProject(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-lg"
                        />

                        {/* Modal Card */}
                        <motion.div
                            layoutId={`card-${selectedProject.id}`}
                            className="w-full max-w-5xl h-[90vh] bg-[#121212] rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative z-10 flex flex-col"
                        >
                            {/* Header / Hero Section with Gallery */}
                            <div className="relative h-[40%] min-h-[300px] w-full bg-black/50 group">
                                <div className="absolute inset-0">
                                    <img
                                        src={selectedProject.gallery[currentImageIndex]}
                                        alt="Project Screenshot"
                                        className="w-full h-full object-cover transition-opacity duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
                                </div>

                                {/* Navigation Arrows */}
                                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white/70 hover:bg-white/20 hover:text-white transition-all backdrop-blur-md opacity-0 group-hover:opacity-100">
                                    <ChevronLeft size={32} />
                                </button>
                                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white/70 hover:bg-white/20 hover:text-white transition-all backdrop-blur-md opacity-0 group-hover:opacity-100">
                                    <ChevronRight size={32} />
                                </button>

                                {/* Logo & Title Overlay */}
                                <div className="absolute bottom-6 left-6 md:left-10 flex items-end gap-6">
                                    <motion.div
                                        layoutId={`logo-${selectedProject.id}`}
                                        className="w-24 h-24 md:w-32 md:h-32 bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center justify-center shadow-2xl"
                                    >
                                        <img src={selectedProject.logo} alt={selectedProject.title} className="w-full h-full object-contain" />
                                    </motion.div>
                                    <div className="mb-2">
                                        <motion.h3
                                            layoutId={`title-${selectedProject.id}`}
                                            className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg"
                                        >
                                            {selectedProject.title}
                                        </motion.h3>
                                        <div className="flex gap-2 mt-2">
                                            {selectedProject.tags.map((tag) => (
                                                <span key={tag} className="px-3 py-1 rounded-full text-xs font-bold bg-black/60 text-white/90 border border-white/10 backdrop-blur-sm">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Close Button */}
                                <button
                                    onClick={() => setSelectedProject(null)}
                                    className="absolute top-4 right-4 p-2 rounded-full bg-black/20 text-white hover:bg-white/20 transition-colors backdrop-blur-md z-20 border border-white/5"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Content Section - Scrollable */}
                            <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-gradient-to-b from-[#121212] to-[#0a0a0a]">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                    {/* Left: Description */}
                                    <div className="lg:col-span-2 space-y-8">
                                        <div>
                                            <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-3 flex items-center gap-2">
                                                <LayoutDashboard size={16} />
                                                Sobre el proyecto
                                            </h4>
                                            <p className="text-lg text-white/80 leading-relaxed font-light">
                                                {selectedProject.detailedDescription}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {selectedProject.features.map((feature, i) => (
                                                <div key={i} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-primary/20 transition-colors">
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
                                    </div>

                                    {/* Right: Actions & Sidebar */}
                                    <div className="space-y-6">
                                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                                            <h4 className="font-bold text-white mb-2">Enlaces</h4>
                                            {selectedProject.demoUrl && (
                                                <a
                                                    href={selectedProject.demoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-all shadow-lg shadow-primary/20"
                                                >
                                                    <ExternalLink size={20} />
                                                    Ver Demo en vivo
                                                </a>
                                            )}
                                            {selectedProject.repoUrl && (
                                                <a
                                                    href={selectedProject.repoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-all border border-white/10"
                                                >
                                                    <Github size={20} />
                                                    Ver Código Fuente
                                                </a>
                                            )}
                                        </div>

                                        <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 to-transparent border border-primary/20">
                                            <div className="flex items-center gap-3 text-primary mb-2">
                                                <ImageIcon size={20} />
                                                <span className="font-bold">Galería</span>
                                            </div>
                                            <p className="text-sm text-white/60 mb-4">
                                                {selectedProject.gallery.length} imágenes disponibles
                                            </p>
                                            <div className="flex gap-2">
                                                {selectedProject.gallery.map((img, i) => (
                                                    <button
                                                        key={i}
                                                        onClick={() => setCurrentImageIndex(i)}
                                                        className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === i ? 'border-primary' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                                    >
                                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Section>
    );
}
