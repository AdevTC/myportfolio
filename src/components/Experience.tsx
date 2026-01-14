"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Clock, TrendingUp, Calendar, Users, Briefcase, MapPin, ExternalLink } from "lucide-react";

// --- Types ---
interface ExperienceItem {
    id: string;
    company: string;
    role: string;
    period: string;
    startDate: string;
    endDate?: string;
    description: string;
    tech: string[];
    achievements: { title: string; desc: string }[];
    growthVsPrevious?: number;
    growthTotal?: number;
    teamSize: number;
    logo: string;
    workMode: string;
    url: string; // New field
}

// --- Data ---
const EXPERIENCES: ExperienceItem[] = [
    {
        id: "sapas",
        company: "Sapas Consulting",
        role: "SAP Cloud Integrations & BTP Developer",
        period: "Barcelona, España | Julio 2025 - Actualidad",
        startDate: "2025-07-07",
        description: "Diseño y desarrollo de integraciones clínicas (HL7 & SAP CPI) y arquitecturas Cloud-Native sobre SAP BTP.",
        tech: ["SAP Cloud Integration (CPI)", "HL7", "SAP CAP", "Node.js", "Groovy", "OData", "APIs REST"],
        growthVsPrevious: 26.92,
        growthTotal: 73.68,
        teamSize: 8,
        logo: "/logo_sapas.png",
        workMode: "En Remoto / Teletrabajo",
        url: "https://www.sapas.com/",
        achievements: [
            { title: "Diseño y Desarrollo", desc: "Arquitecturas de integración complejas en SAP Integration Suite." },
            { title: "Orquestación HL7", desc: "Gestión integral de mensajes estándar HL7 para el ciclo de vida del paciente." },
            { title: "Transacciones Críticas", desc: "Procesamiento de altas, ingresos y movimientos hospitalarios." },
            { title: "Cloud-Native", desc: "Servicios OData V4 y backend SAP CAP." },
            { title: "Lógica de Negocio", desc: "Modelos CDS y validaciones complejas con Node.js." },
            { title: "Monitorización", desc: "Estrategias avanzadas en SAP CPI para trazabilidad completa." },
            { title: "Arquitectura", desc: "Definición de patrones de integración y diseño técnico." },
            { title: "Interoperabilidad", desc: "Conexión entre HIS heterogéneos y SAP." }
        ]
    },
    {
        id: "timestamp",
        company: "Timestamp",
        role: "Consultor de Integración SAP",
        period: "Madrid, España | Mayo 2025 - Julio 2025",
        startDate: "2025-05-12",
        endDate: "2025-07-04",
        description: "Desarrollo avanzado de integraciones para RRHH y Finanzas con Groovy y SAP Integration Suite.",
        tech: ["SAP CPI", "SuccessFactors EC", "Groovy", "SAP ECP", "OData", "XML/XSD"],
        growthVsPrevious: 30.00,
        growthTotal: 36.84,
        teamSize: 6,
        logo: "/logo_timestamp.png",
        workMode: "Híbrido",
        url: "https://www.timestampgroup.com/es",
        achievements: [
            { title: "Groovy Avanzado", desc: "Scripts para procesos de RH y Finanzas." },
            { title: "Validación de Datos", desc: "Lógica condicional y transformaciones dinámicas." },
            { title: "Datos No Estructurados", desc: "Manejo de CSVs en Base64 e inyección de encabezados." },
            { title: "Automatización SF", desc: "Payloads XML dinámicos con MarkupBuilder." },
            { title: "Datos Bancarios", desc: "Gestión de campos condicionales y claves de detalle." },
            { title: "Nóminas e IRPF", desc: "iFlows para consulta y descarga de documentos." }
        ]
    },
    {
        id: "inetum",
        company: "Inetum",
        role: "Consultor Junior de Integración SAP",
        period: "Madrid, España | Julio 2023 - Mayo 2025",
        startDate: "2023-09-18",
        endDate: "2025-05-09",
        description: "Diseño, desarrollo y mantenimiento de soluciones de integración con SAP PI/PO y CPI.",
        tech: ["SAP CPI", "SAP PI/PO", "Java", "Groovy", "APIs REST/SOAP", "Cloud Connector"],
        growthVsPrevious: 0,
        growthTotal: 5.26,
        teamSize: 14,
        logo: "/logo_inetum.png",
        workMode: "Híbrido",
        url: "https://www.inetum.com/es",
        achievements: [
            { title: "Eficiencia +40%", desc: "Mejora en procesamiento de datos con CPI y PI/PO." },
            { title: "Estandarización", desc: "Uso de XSD/WSDL reduciendo inconsistencias en 35%." },
            { title: "Velocidad +50%", desc: "Aceleración de flujo de información con APIs REST/SOAP." },
            { title: "Seguridad", desc: "Cloud Connector reduciendo intervención manual en 30%." },
            { title: "Costes -25%", desc: "Reducción operativa tras migración a SAP CPI." },
            { title: "Automatización", desc: "Menor esfuerzo manual (-45%) con scripts Groovy." },
            { title: "SLA +20%", desc: "Mejora en tiempo de respuesta ante incidencias." }
        ]
    }
];

// --- Helpers ---
const calculateDays = (start: string, end?: string) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// --- Component ---
export default function Experience() {
    const [viewMode, setViewMode] = useState<'timeline' | 'comparison'>('timeline');
    const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
    const [currentDaysSapas, setCurrentDaysSapas] = useState(0);

    // Live counter for Sapas
    useEffect(() => {
        const updateDays = () => {
            setCurrentDaysSapas(calculateDays(EXPERIENCES[0].startDate));
        };
        updateDays();
        const interval = setInterval(updateDays, 60000);
        return () => clearInterval(interval);
    }, []);

    const toggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    // Global Stats
    const totalCompanies = EXPERIENCES.length;
    const totalDays = EXPERIENCES.reduce((acc, exp) => {
        if (exp.id === 'sapas') return acc + currentDaysSapas;
        return acc + calculateDays(exp.startDate, exp.endDate);
    }, 0);

    return (
        <section id="experience" className="py-20 relative">
            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="mb-12 text-center space-y-6">
                    <h2 className="text-4xl md:text-5xl font-bold">
                        Experiencia <span className="text-primary">Profesional</span>
                    </h2>
                    <div className="h-1 w-20 bg-primary mx-auto rounded-full" />

                    {/* Global Summary Stats */}
                    <div className="flex justify-center gap-8 md:gap-16 text-muted-foreground animate-fade-in">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white flex items-center justify-center gap-2">
                                <Briefcase size={24} className="text-primary" />
                                {totalCompanies}
                            </p>
                            <span className="text-sm uppercase tracking-wider">Empresas</span>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white flex items-center justify-center gap-2">
                                <Clock size={24} className="text-primary" />
                                {totalDays}
                            </p>
                            <span className="text-sm uppercase tracking-wider">Días Trabajados</span>
                        </div>
                    </div>

                    {/* View Toggle */}
                    <div className="flex justify-center mt-6">
                        <div className="bg-white/5 border border-white/10 p-1 rounded-full flex items-center">
                            <button
                                onClick={() => setViewMode('timeline')}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${viewMode === 'timeline'
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'text-muted-foreground hover:text-white'
                                    }`}
                            >
                                Cronología
                            </button>
                            <button
                                onClick={() => setViewMode('comparison')}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${viewMode === 'comparison'
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'text-muted-foreground hover:text-white'
                                    }`}
                            >
                                Comparación
                            </button>
                        </div>
                    </div>
                </div>

                {/* Timeline View */}
                {viewMode === 'timeline' && (
                    <div className="relative border-l-2 border-white/10 ml-4 md:ml-12 space-y-12 max-w-5xl mx-auto">
                        {EXPERIENCES.map((exp, index) => {
                            const days = exp.id === 'sapas' ? currentDaysSapas : calculateDays(exp.startDate, exp.endDate);

                            return (
                                <div key={index} className="relative pl-8 md:pl-12">
                                    {/* Dot indicator */}
                                    <div className="absolute -left-[9px] top-4 md:top-8 w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/50 ring-4 ring-black" />

                                    <div
                                        className={`bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/50 ${expandedIndex === index ? 'ring-1 ring-primary/30 bg-white/10' : ''}`}
                                    >
                                        {/* Header (Always Visible) */}
                                        <div
                                            className="p-6 md:p-8 cursor-pointer flex flex-col gap-6"
                                            onClick={() => toggleExpand(index)}
                                        >
                                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                                {/* Logo & Role */}
                                                <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4 flex-1">
                                                    <div className="w-16 h-16 rounded-xl bg-white p-2 shrink-0 flex items-center justify-center">
                                                        <img src={exp.logo} alt={exp.company} className="w-full h-full object-contain" />
                                                    </div>
                                                    <div className="space-y-1 w-full md:w-auto">
                                                        <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors">
                                                            {exp.role}
                                                        </h3>
                                                        <div className="flex items-center justify-center md:justify-start gap-2">
                                                            <p className="text-xl text-muted-foreground font-medium">
                                                                {exp.company}
                                                            </p>
                                                            <a
                                                                href={exp.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-muted-foreground hover:text-primary transition-colors p-1"
                                                                onClick={(e) => e.stopPropagation()} // Prevent card toggle
                                                            >
                                                                <ExternalLink size={16} />
                                                            </a>
                                                        </div>

                                                        {/* Period & Work Mode */}
                                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm font-mono tracking-wider pt-1">
                                                            <span className="text-primary">{exp.period}</span>
                                                            <span className="hidden md:inline w-1.5 h-1.5 rounded-full bg-white/30" />
                                                            <span className="text-white/70 flex items-center gap-1">
                                                                <MapPin size={12} /> {exp.workMode}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Arrow */}
                                                <div className="flex items-start justify-end md:justify-start">
                                                    {expandedIndex === index ? <ChevronUp className="text-primary" /> : <ChevronDown className="text-muted-foreground" />}
                                                </div>
                                            </div>

                                            {/* Integrated Stats Row (Visible in Card) */}
                                            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 py-4 border-y border-white/5">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] md:text-xs text-muted-foreground uppercase">Tiempo</span>
                                                    <span className="font-bold text-white text-sm md:text-base">{days} días</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] md:text-xs text-muted-foreground uppercase">Equipo</span>
                                                    <span className="font-bold text-white text-sm md:text-base">{exp.teamSize} personas</span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] md:text-xs text-muted-foreground uppercase">Crecimiento (Ant.)</span>
                                                    <span className={`font-bold text-sm md:text-base ${exp.growthVsPrevious && exp.growthVsPrevious > 0 ? 'text-green-400' : 'text-white'}`}>
                                                        {exp.growthVsPrevious ? `+${exp.growthVsPrevious}%` : '-'}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] md:text-xs text-muted-foreground uppercase">Crecimiento (Inicio)</span>
                                                    <span className={`font-bold text-sm md:text-base ${exp.growthTotal && exp.growthTotal > 0 ? 'text-green-400' : 'text-white'}`}>
                                                        {exp.growthTotal ? `+${exp.growthTotal}%` : '-'}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] md:text-xs text-muted-foreground uppercase">Tecnologías</span>
                                                    <span className="font-bold text-white text-sm md:text-base">{exp.tech.length}</span>
                                                </div>
                                            </div>

                                            <p className="text-muted-foreground leading-relaxed hidden md:block">
                                                {exp.description}
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                {exp.tech.slice(0, 4).map((tech) => (
                                                    <span key={tech} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                                                        {tech}
                                                    </span>
                                                ))}
                                                {exp.tech.length > 4 && (
                                                    <span className="text-xs px-2 py-1 text-muted-foreground">+{exp.tech.length - 4} más</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Expanded Content */}
                                        <AnimatePresence>
                                            {expandedIndex === index && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                    className="overflow-hidden bg-black/20"
                                                >
                                                    <div className="p-6 md:p-8 pt-0 border-t border-white/10">
                                                        <p className="text-muted-foreground leading-relaxed md:hidden mb-6 block">
                                                            {exp.description}
                                                        </p>
                                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
                                                            <div className="lg:col-span-2 space-y-4">
                                                                <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                                    <span className="w-1 h-6 bg-primary rounded-full" />
                                                                    Detalles y Logros
                                                                </h4>
                                                                <ul className="space-y-4">
                                                                    {exp.achievements.map((achievement, i) => (
                                                                        <li key={i} className="flex gap-3 text-muted-foreground">
                                                                            <div className="min-w-[6px] h-[6px] rounded-full bg-primary mt-2.5" />
                                                                            <span>
                                                                                <strong className="text-white block mb-1">{achievement.title}</strong>
                                                                                {achievement.desc}
                                                                            </span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>

                                                            <div>
                                                                <h4 className="text-lg font-bold text-white mb-4">Stack Tecnológico</h4>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {exp.tech.map((tech) => (
                                                                        <span
                                                                            key={tech}
                                                                            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-primary/80 hover:bg-white/10 transition-colors"
                                                                        >
                                                                            {tech}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Comparison View */}
                {viewMode === 'comparison' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    >
                        {EXPERIENCES.map((exp) => {
                            const days = exp.id === 'sapas' ? currentDaysSapas : calculateDays(exp.startDate, exp.endDate);

                            return (
                                <div key={exp.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-6 hover:border-primary/30 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-white p-2 shrink-0 flex items-center justify-center">
                                            <img src={exp.logo} alt={exp.company} className="w-full h-full object-contain" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{exp.company}</h3>
                                                <a
                                                    href={exp.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-muted-foreground hover:text-primary transition-colors p-1"
                                                >
                                                    <ExternalLink size={14} />
                                                </a>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-xs text-muted-foreground">{exp.role}</p>
                                                <p className="text-[10px] text-white/50 flex items-center gap-1">
                                                    <MapPin size={10} /> {exp.workMode}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {/* Duration Stat */}
                                        <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                                            <div className="flex items-center gap-2 text-primary mb-2">
                                                <Clock size={18} />
                                                <span className="text-xs font-bold uppercase tracking-wider">Tiempo Trabajado</span>
                                            </div>
                                            <p className="text-3xl font-bold text-white">
                                                {days} <span className="text-sm text-muted-foreground font-normal">días</span>
                                            </p>
                                        </div>

                                        {/* Team Size */}
                                        <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                                            <div className="flex items-center gap-2 text-blue-400 mb-2">
                                                <Users size={18} />
                                                <span className="text-xs font-bold uppercase tracking-wider">Tamaño Equipo</span>
                                            </div>
                                            <p className="text-2xl font-bold text-white">
                                                {exp.teamSize} <span className="text-sm text-muted-foreground font-normal">personas</span>
                                            </p>
                                        </div>

                                        {/* Growth Stats */}
                                        <div className="bg-black/20 rounded-xl p-4 border border-white/5 space-y-4">
                                            <div className="flex items-center gap-2 text-green-400 mb-2">
                                                <TrendingUp size={18} />
                                                <span className="text-xs font-bold uppercase tracking-wider">Crecimiento (Salario)</span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-[10px] text-muted-foreground mb-1 uppercase">Vs Anterior</p>
                                                    <p className={`text-xl font-bold ${exp.growthVsPrevious && exp.growthVsPrevious > 0 ? 'text-green-400' : 'text-white'}`}>
                                                        {exp.growthVsPrevious ? `+${exp.growthVsPrevious}%` : '-'}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-muted-foreground mb-1 uppercase">Vs Inicio</p>
                                                    <p className={`text-xl font-bold ${exp.growthTotal && exp.growthTotal > 0 ? 'text-green-400' : 'text-white'}`}>
                                                        {exp.growthTotal ? `+${exp.growthTotal}%` : '-'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </motion.div>
                )}
            </div>
        </section>
    );
}
