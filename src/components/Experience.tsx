"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Clock, TrendingUp, Calendar, Users, Briefcase, MapPin, ExternalLink, Server, Database, Network, ArrowRight, ArrowDown, Activity, Cpu, Layers, Coffee, Shield, Play, Square, Terminal, Zap } from "lucide-react";
import { createPortal } from "react-dom";
import Counter from "./ui/Counter";
import ExperienceMilestones from "./ExperienceMilestones";
import { cn } from "@/lib/utils";

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
    kpis: { label: string; value: string; icon: string }[]; // New field
}

// --- Constants ---
const S_INETUM_START = Number(process.env.NEXT_PUBLIC_SALARY_INETUM_START) || 19000;
const S_INETUM_END = Number(process.env.NEXT_PUBLIC_SALARY_INETUM_END) || 20000;
const S_TIMESTAMP = Number(process.env.NEXT_PUBLIC_SALARY_TIMESTAMP) || 26000;
const S_SAPAS = Number(process.env.NEXT_PUBLIC_SALARY_SAPAS) || 33000;

const calculateGrowth = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current / previous) - 1) * 100;
};

// --- Helpers ---
const getKpiIcon = (iconName: string) => {
    switch (iconName) {
        case 'activity': return Activity;
        case 'zap': return Zap;
        case 'network': return Network;
        case 'server': return Server;
        case 'users': return Users;
        case 'cpu': return Cpu;
        case 'layers': return Layers;
        case 'database': return Database;
        case 'trending-up': return TrendingUp;
        case 'briefcase': return Briefcase;
        case 'clock': return Clock;
        case 'coffee': return Coffee;
        case 'shield': return Shield;
        default: return Activity;
    }
};

// --- Data ---
const EXPERIENCES: ExperienceItem[] = [
    {
        id: "sapas",
        company: "Sapas Consulting",
        role: "SAP Cloud Integrations & BTP Developer",
        period: "Barcelona, España | Julio 2025 - Actualidad",
        startDate: "2025-07-07T09:00:00",
        description: "Diseño y desarrollo de integraciones clínicas (HL7 & SAP CPI) y arquitecturas Cloud-Native sobre SAP BTP.",
        tech: [
            "HL7", "SAP CAP", "CPI", "SAP BTP", "CDS", "CI/CD", "GitHub", "SAP HANA", "SAP BAS", // Sapas specific
            "Integration Suite", "SuccessFactors", "Node.js", "Groovy", "OData", "JSON", "SOAP", "XSD", "Java", "JWT", "OAuth", "Postman", "Insomnia", "Transformación de datos", "Validación de datos", "Error Handling" // Inherited from Timestamp/Core
        ],
        growthVsPrevious: calculateGrowth(S_SAPAS, S_TIMESTAMP),
        growthTotal: calculateGrowth(S_SAPAS, S_INETUM_START),
        teamSize: 8,
        logo: "/logos/sapas.png",
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
        ],
        kpis: [
            { label: "Mensajes HL7 Parseados", value: "+250,000", icon: "activity" },
            { label: "Latencia OData (BTP)", value: "<45ms", icon: "zap" },
            { label: "Sistemas Conectados", value: "12 (HIS/SAP/etc)", icon: "network" },
            { label: "Lógica Backend", value: "Clean Core CAP", icon: "server" }
        ]
    },
    {
        id: "timestamp",
        company: "Timestamp",
        role: "Consultor de Integración SAP",
        period: "Madrid, España | Mayo 2025 - Julio 2025",
        startDate: "2025-05-12T09:00:00",
        endDate: "2025-07-04T15:30:00",
        description: "Desarrollo avanzado de integraciones para RRHH y Finanzas con Groovy y SAP Integration Suite.",
        tech: [
            "Integration Suite", "SuccessFactors", "Node.js", "Groovy", "OData", "JSON", "SOAP", "SAP BTP", "Productos SAP", "XSD", "Definición de esquemas XML", "Java", "JWT", "OAuth", "Postman", "Insomnia", "Notepad++", "SoapUI", "Picklists", "CSV", "Base64", "Transformación de datos", "Validación de datos", "Error Handling", "Mapping"
        ],
        growthVsPrevious: calculateGrowth(S_TIMESTAMP, S_INETUM_END),
        growthTotal: calculateGrowth(S_TIMESTAMP, S_INETUM_START),
        teamSize: 6,
        logo: "/logos/timestamp.png",
        workMode: "Híbrido",
        url: "https://www.timestampgroup.com/es",
        achievements: [
            { title: "Groovy Avanzado", desc: "Scripts para procesos de RH y Finanzas." },
            { title: "Validación de Datos", desc: "Lógica condicional y transformaciones dinámicas." },
            { title: "Datos No Estructurados", desc: "Manejo de CSVs en Base64 e inyección de encabezados." },
            { title: "Automatización SF", desc: "Payloads XML dinámicos con MarkupBuilder." },
            { title: "Datos Bancarios", desc: "Gestión de campos condicionales y claves de detalle." },
            { title: "Nóminas e IRPF", desc: "iFlows para consulta y descarga de documentos." }
        ],
        kpis: [
            { label: "Nóminas Procesadas/Mes", value: "+12,000", icon: "users" },
            { label: "Groovy Scripting", value: "+3,500 líneas", icon: "cpu" },
            { label: "Reducción de Payload", value: "-35% XML size", icon: "layers" },
            { label: "Seguridad Financiera", value: "JWT / OAuth 2.0", icon: "shield" }
        ]
    },
    {
        id: "inetum",
        company: "Inetum",
        role: "Consultor Junior de Integración SAP",
        period: "Madrid, España | Julio 2023 - Mayo 2025",
        startDate: "2023-09-18T08:00:00",
        endDate: "2025-05-09T14:30:00",
        description: "Diseño, desarrollo y mantenimiento de soluciones de integración con SAP PI/PO y CPI.",
        tech: [
            "Base64", "CSV", "Definición de esquemas XML", "Desarrollo de software", "Groovy", "HTML", "Integration Suite", "JSON", "Mapping", "Microsoft Excel", "Notepad++", "Postman", "Productos SAP", "SAP BTP", "SAP NetWeaver", "SOAP", "SoapUI", "Trabajo en equipo", "XML", "XSD"
        ],
        growthVsPrevious: 0,
        growthTotal: calculateGrowth(S_INETUM_END, S_INETUM_START),
        teamSize: 14,
        logo: "/logos/inetum.png",
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
        ],
        kpis: [
            { label: "Migraciones PI/PO a CPI", value: "+15 escenarios", icon: "trending-up" },
            { label: "Esfuerzo Manual Ahorrado", value: "45% menos", icon: "briefcase" },
            { label: "Uptime Cloud Connector", value: "99.99%", icon: "clock" },
            { label: "Cafés Consumidos (Est.)", value: "~850 tazas", icon: "coffee" }
        ]
    }
];

// --- Helpers ---
const calculateDiffMs = (start: string, end?: string) => {
    const startDate = new Date(start);
    const endDate = end ? new Date(end) : new Date();
    return Math.abs(endDate.getTime() - startDate.getTime());
}

type TimeUnit =
    | 'Seg.' | 'Min.' | 'Horas' | 'Días' | 'Semanas' | 'Quincenas'
    | 'Meses' | 'Trimestres' | 'Cuatrimestres' | 'Semestres'
    | 'Años' | 'Bienios' | 'Trienios' | 'Cuatrienios' | 'Lustros'
    | 'Décadas' | 'Siglos' | 'Milenios';

const convertTime = (ms: number, unit: TimeUnit) => {
    const seconds = ms / 1000;
    const minutes = seconds / 60;
    const hours = minutes / 60;
    const days = hours / 24;
    const years = days / 365.25;

    switch (unit) {
        case 'Seg.': return seconds;
        case 'Min.': return minutes;
        case 'Horas': return hours;
        case 'Días': return days;
        case 'Semanas': return days / 7;
        case 'Quincenas': return days / 15;
        case 'Meses': return days / 30.4375; // More precise average
        case 'Trimestres': return days / 91.3125;
        case 'Cuatrimestres': return days / 121.75;
        case 'Semestres': return days / 182.625;
        case 'Años': return years;
        case 'Bienios': return years / 2;
        case 'Trienios': return years / 3;
        case 'Cuatrienios': return years / 4;
        case 'Lustros': return years / 5;
        case 'Décadas': return years / 10;
        case 'Siglos': return years / 100;
        case 'Milenios': return years / 1000;
        default: return days;
    }
};

const getDecimals = (unit: TimeUnit) => {
    switch (unit) {
        case 'Seg.':
        case 'Min.':
        case 'Horas':
        case 'Días': return 0;
        case 'Semanas':
        case 'Quincenas':
        case 'Meses': return 1;
        case 'Trimestres':
        case 'Cuatrimestres':
        case 'Semestres':
        case 'Años': return 2;
        case 'Bienios':
        case 'Trienios':
        case 'Cuatrienios':
        case 'Lustros': return 4;
        case 'Décadas': return 5;
        case 'Siglos': return 8;
        case 'Milenios': return 10;
        default: return 2;
    }
};

// --- Component ---
export default function Experience() {
    const [viewMode, setViewMode] = useState<'timeline' | 'comparison' | 'analytics' | 'milestones'>('timeline');
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [activeCardTab, setActiveCardTab] = useState<'details' | 'architecture'>('details');
    const [currentMsSapas, setCurrentMsSapas] = useState(0);
    const [timeUnit, setTimeUnit] = useState<TimeUnit>('Días');
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isCompaniesDropdownOpen, setCompaniesDropdownOpen] = useState(false);
    const [highlightedId, setHighlightedId] = useState<string | null>(null);
    const [salaryMetric, setSalaryMetric] = useState<'total' | 'previous'>('total');
    const [hoveredDistIndex, setHoveredDistIndex] = useState<number | null>(null);

    const companiesDropdownRef = useRef<HTMLDivElement>(null);
    const timeDropdownRef = useRef<HTMLDivElement>(null);

    // Handle outside clicks to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (companiesDropdownRef.current && !companiesDropdownRef.current.contains(event.target as Node)) {
                setCompaniesDropdownOpen(false);
            }
            if (timeDropdownRef.current && !timeDropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleCompanyClick = (expId: string) => {
        setCompaniesDropdownOpen(false);
        // Ensure we are in timeline view to see the list
        setViewMode('timeline');
        setActiveCardTab('details');

        // Small delay to allow view switch and render
        setTimeout(() => {
            const element = document.getElementById(`exp-${expId}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setHighlightedId(expId);
                // Remove highlight after 3 seconds
                setTimeout(() => setHighlightedId(null), 3000);
            }
        }, 100);
    };

    const TIME_UNITS: TimeUnit[] = [
        'Seg.', 'Min.', 'Horas', 'Días', 'Semanas', 'Quincenas',
        'Meses', 'Trimestres', 'Cuatrimestres', 'Semestres',
        'Años', 'Bienios', 'Trienios', 'Cuatrienios', 'Lustros',
        'Décadas', 'Siglos', 'Milenios'
    ];

    // Live counter for Sapas
    useEffect(() => {
        const updateMs = () => {
            setCurrentMsSapas(calculateDiffMs(EXPERIENCES[0].startDate));
        };
        updateMs();
        const interval = setInterval(updateMs, 1000); // Update every second for dynamic feel
        return () => clearInterval(interval);
    }, []);

    const toggleExpand = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
        setActiveCardTab('details');
    };

    // Global Stats
    const totalCompanies = EXPERIENCES.length;
    const totalMs = EXPERIENCES.reduce((acc, exp) => {
        if (exp.id === 'sapas') return acc + currentMsSapas;
        return acc + calculateDiffMs(exp.startDate, exp.endDate);
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
                    <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 text-muted-foreground animate-fade-in mb-8">
                        <div className="flex gap-12 items-center">
                            <div className="relative text-center group" ref={companiesDropdownRef}>
                                <div
                                    className="cursor-pointer"
                                    onClick={() => setCompaniesDropdownOpen(!isCompaniesDropdownOpen)}
                                >
                                    <p className="text-3xl font-bold text-white flex items-center justify-center gap-2">
                                        <Briefcase size={24} className="text-primary" />
                                        {totalCompanies}
                                    </p>
                                    <div className="flex items-center justify-center gap-1 group-hover:text-primary transition-colors mt-1">
                                        <span className="text-xs uppercase tracking-wider">Empresas</span>
                                        <ChevronDown size={12} className={`transition-transform duration-300 ${isCompaniesDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {isCompaniesDropdownOpen && (
                                        <>
                                            {/* Desktop Dropdown */}
                                            <motion.div
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                className="hidden md:block absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl p-2 z-50 min-w-[220px] backdrop-blur-xl"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {EXPERIENCES.map((exp) => (
                                                    <div
                                                        key={exp.id}
                                                        onClick={() => handleCompanyClick(exp.id)}
                                                        className="px-4 py-3 text-left hover:bg-white/5 rounded-lg transition-colors flex items-center gap-3 cursor-pointer"
                                                    >
                                                        <div className="w-8 h-8 rounded-md bg-white p-1 flex items-center justify-center shrink-0">
                                                            <img src={exp.logo} alt={exp.company} className="w-full h-full object-contain" />
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-200">{exp.company}</span>
                                                    </div>
                                                ))}
                                            </motion.div>

                                            {/* Mobile Dropdown (Portal) */}
                                            {typeof document !== 'undefined' && createPortal(
                                                <div className="md:hidden fixed inset-0 z-[9999] flex items-center justify-center p-4">
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCompaniesDropdownOpen(false);
                                                        }}
                                                    />
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                                        className="relative w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl p-2 z-10 max-h-[70vh] overflow-y-auto custom-scrollbar"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {EXPERIENCES.map((exp) => (
                                                            <div
                                                                key={`mobile-${exp.id}`}
                                                                onClick={() => handleCompanyClick(exp.id)}
                                                                className="px-4 py-3 text-left hover:bg-white/5 rounded-lg transition-colors flex items-center gap-3 border-b border-white/5 last:border-0 active:bg-white/10"
                                                            >
                                                                <div className="w-10 h-10 rounded-md bg-white p-1 flex items-center justify-center shrink-0">
                                                                    <img src={exp.logo} alt={exp.company} className="w-full h-full object-contain" />
                                                                </div>
                                                                <span className="text-base font-bold text-white">{exp.company}</span>
                                                            </div>
                                                        ))}
                                                    </motion.div>
                                                </div>,
                                                document.body
                                            )}
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Custom Aesthetic Dropdown */}
                            <div className="relative text-center group" ref={timeDropdownRef}>
                                <div
                                    className="cursor-pointer"
                                    onClick={() => setDropdownOpen(!isDropdownOpen)}
                                >
                                    <p className="text-3xl font-bold text-white flex items-center justify-center gap-2">
                                        <Clock size={24} className="text-primary" />
                                        <Counter value={convertTime(totalMs, timeUnit)} decimals={getDecimals(timeUnit)} />
                                    </p>
                                    <div className="flex items-center justify-center gap-1 group-hover:text-primary transition-colors mt-1">
                                        <span className="text-xs uppercase tracking-wider">{timeUnit} {timeUnit === 'Horas' ? 'Trabajadas' : 'Trabajados'}</span>
                                        <ChevronDown size={12} className={`transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {isDropdownOpen && (
                                        <>
                                            {/* Desktop Dropdown (Inline) */}
                                            <motion.div
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                className="hidden md:grid absolute left-1/2 -translate-x-1/2 top-full mt-2 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl p-2 z-50 min-w-[450px] max-h-[50vh] overflow-y-auto custom-scrollbar backdrop-blur-xl grid-cols-3 gap-1"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                {TIME_UNITS.map((unit) => (
                                                    <button
                                                        key={`desktop-${unit}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setTimeUnit(unit);
                                                            setDropdownOpen(false);
                                                        }}
                                                        className={`px-3 py-2 rounded-lg text-sm transition-all text-left flex items-center justify-between ${timeUnit === unit
                                                            ? "bg-primary/20 text-primary border border-primary/30"
                                                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                                                            }`}
                                                    >
                                                        {unit}
                                                        {timeUnit === unit && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                                    </button>
                                                ))}
                                            </motion.div>

                                            {/* Mobile Dropdown (Portal) */}
                                            {typeof document !== 'undefined' && createPortal(
                                                <div className="md:hidden fixed inset-0 z-[9999] flex items-center justify-center p-4">
                                                    {/* Backdrop */}
                                                    <motion.div
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDropdownOpen(false);
                                                        }}
                                                    />

                                                    {/* Content */}
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                                        className="relative w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl p-3 z-10 max-h-[70vh] overflow-y-auto custom-scrollbar grid grid-cols-2 gap-1"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {TIME_UNITS.map((unit) => (
                                                            <button
                                                                key={`mobile-${unit}`}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setTimeUnit(unit);
                                                                    setDropdownOpen(false);
                                                                }}
                                                                className={`px-4 py-3 rounded-xl text-xs font-medium transition-all text-left flex items-center justify-between ${timeUnit === unit
                                                                    ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_10px_rgba(234,88,12,0.2)]"
                                                                    : "text-gray-400 bg-white/5 hover:bg-white/10 hover:text-white"
                                                                    }`}
                                                            >
                                                                {unit}
                                                                {timeUnit === unit && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                </div>,
                                                document.body
                                            )}
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* View Toggle (Pill Style Reverted) */}
                    <div className="flex justify-center px-4 md:px-0 w-full">
                        <div className="bg-white/5 border border-white/10 p-1 rounded-2xl md:rounded-full grid grid-cols-2 md:flex md:items-center w-full max-w-[340px] md:max-w-none md:w-auto gap-1 md:gap-0">
                            <button
                                onClick={() => setViewMode('timeline')}
                                className={`px-4 md:px-6 py-2.5 md:py-2 rounded-xl md:rounded-full text-sm font-medium transition-all text-center ${viewMode === 'timeline'
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'text-muted-foreground hover:text-white'
                                    }`}
                            >
                                Cronología
                            </button>
                            <button
                                onClick={() => setViewMode('comparison')}
                                className={`px-4 md:px-6 py-2.5 md:py-2 rounded-xl md:rounded-full text-sm font-medium transition-all text-center ${viewMode === 'comparison'
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'text-muted-foreground hover:text-white'
                                    }`}
                            >
                                Comparación
                            </button>
                            <button
                                onClick={() => setViewMode('analytics')}
                                className={`px-4 md:px-6 py-2.5 md:py-2 rounded-xl md:rounded-full text-sm font-medium transition-all text-center ${viewMode === 'analytics'
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'text-muted-foreground hover:text-white'
                                    }`}
                            >
                                Analítica
                            </button>
                            <button
                                onClick={() => setViewMode('milestones')}
                                className={`px-4 md:px-6 py-2.5 md:py-2 rounded-xl md:rounded-full text-sm font-medium transition-all text-center ${viewMode === 'milestones'
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'text-muted-foreground hover:text-white'
                                    }`}
                            >
                                Hitos
                            </button>
                        </div>
                    </div>
                </div>

                {/* Timeline View */}
                {viewMode === 'timeline' && (
                    <div className="relative border-l-2 border-white/10 ml-4 md:ml-12 space-y-12 max-w-5xl mx-auto">
                        {EXPERIENCES.map((exp, index) => {
                            const ms = exp.id === 'sapas' ? currentMsSapas : calculateDiffMs(exp.startDate, exp.endDate);

                            return (
                                <div
                                    key={index}
                                    id={`exp-${exp.id}`}
                                    className="relative pl-8 md:pl-12 transition-all duration-500"
                                >
                                    {/* Dot indicator */}
                                    <div className="absolute -left-[9px] top-4 md:top-8 w-4 h-4 rounded-full bg-primary shadow-lg shadow-primary/50 ring-4 ring-black" />

                                    <div
                                        className={`bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/50 ${expandedIndex === index ? 'ring-1 ring-primary/30 bg-white/10' : ''
                                            } ${highlightedId === exp.id
                                                ? 'ring-2 ring-primary shadow-[0_0_30px_rgba(234,88,12,0.3)] scale-[1.02] bg-white/10'
                                                : ''
                                            }`}
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
                                                    <span className="font-bold text-white text-sm md:text-base">
                                                        <Counter
                                                            value={convertTime(ms, timeUnit)}
                                                            suffix={` ${timeUnit}`}
                                                            decimals={getDecimals(timeUnit)}
                                                        />
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] md:text-xs text-muted-foreground uppercase">Equipo</span>
                                                    <span className="font-bold text-white text-sm md:text-base">
                                                        <Counter value={exp.teamSize} suffix=" personas" />
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] md:text-xs text-muted-foreground uppercase">Crecimiento (Ant.)</span>
                                                    <span className={`font-bold text-sm md:text-base ${exp.growthVsPrevious && exp.growthVsPrevious > 0 ? 'text-green-400' : 'text-white'}`}>
                                                        {exp.growthVsPrevious ? <Counter value={exp.growthVsPrevious} prefix="+" suffix="%" decimals={2} /> : '-'}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] md:text-xs text-muted-foreground uppercase">Crecimiento (Inicio)</span>
                                                    <span className={`font-bold text-sm md:text-base ${exp.growthTotal && exp.growthTotal > 0 ? 'text-green-400' : 'text-white'}`}>
                                                        {exp.growthTotal ? <Counter value={exp.growthTotal} prefix="+" suffix="%" decimals={2} /> : '-'}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] md:text-xs text-muted-foreground uppercase">Tecnologías</span>
                                                    <span className="font-bold text-white text-sm md:text-base">
                                                        <Counter value={exp.tech.length} />
                                                    </span>
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
                                                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                                    className="overflow-hidden bg-black/20"
                                                >
                                                    <div className="p-6 md:p-8 pt-0 border-t border-white/10">
                                                        <p className="text-muted-foreground leading-relaxed md:hidden mb-6 block">
                                                            {exp.description}
                                                        </p>

                                                        {/* Sub-tab selector */}
                                                        <div className="flex gap-2 mb-6 border-b border-white/5 pb-4 pt-6">
                                                            <button
                                                                onClick={() => setActiveCardTab('details')}
                                                                className={`px-4 py-2 rounded-xl text-xs font-mono uppercase transition-all border ${
                                                                    activeCardTab === 'details'
                                                                        ? "bg-primary text-white border-primary/30"
                                                                        : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
                                                                }`}
                                                            >
                                                                📋 Logros y Stack
                                                            </button>
                                                            <button
                                                                onClick={() => setActiveCardTab('architecture')}
                                                                className={`px-4 py-2 rounded-xl text-xs font-mono uppercase transition-all border ${
                                                                    activeCardTab === 'architecture'
                                                                        ? "bg-primary text-white border-primary/30"
                                                                        : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
                                                                }`}
                                                            >
                                                                🔗 Diagrama de Integración
                                                            </button>
                                                        </div>

                                                        <AnimatePresence mode="wait">
                                                            {activeCardTab === 'details' ? (
                                                                <motion.div
                                                                    key="details"
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    exit={{ opacity: 0, y: -10 }}
                                                                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                                                                >
                                                                    <div className="lg:col-span-2 space-y-4">
                                                                        <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                                                            <span className="w-1 h-6 bg-primary rounded-full" />
                                                                            Detalles y Logros
                                                                        </h4>
                                                                        <motion.ul
                                                                            className="space-y-4"
                                                                            initial="hidden"
                                                                            animate="visible"
                                                                            variants={{
                                                                                hidden: { opacity: 0 },
                                                                                visible: {
                                                                                    opacity: 1,
                                                                                    transition: {
                                                                                        staggerChildren: 0.1
                                                                                    }
                                                                                }
                                                                            }}
                                                                        >
                                                                            {exp.achievements.map((achievement, i) => (
                                                                                <motion.li
                                                                                    key={i}
                                                                                    variants={{
                                                                                        hidden: { opacity: 0, x: -10 },
                                                                                        visible: { opacity: 1, x: 0 }
                                                                                    }}
                                                                                    className="flex gap-3 text-muted-foreground"
                                                                                >
                                                                                    <div className="min-w-[6px] h-[6px] rounded-full bg-primary mt-2.5" />
                                                                                    <span>
                                                                                        <strong className="text-white block mb-1">{achievement.title}</strong>
                                                                                        {achievement.desc}
                                                                                    </span>
                                                                                </motion.li>
                                                                            ))}
                                                                        </motion.ul>

                                                                        {/* KPIs and Impact Metrics Grid */}
                                                                        {exp.kpis && exp.kpis.length > 0 && (
                                                                            <div className="pt-8 border-t border-white/5 space-y-4">
                                                                                <h4 className="text-lg font-bold text-white flex items-center gap-2">
                                                                                    <span className="w-1 h-6 bg-primary rounded-full" />
                                                                                    Métricas de Impacto y Datos Curiosos
                                                                                </h4>
                                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                                    {exp.kpis.map((kpi, idx) => {
                                                                                        const KpiIcon = getKpiIcon(kpi.icon);
                                                                                        return (
                                                                                            <div
                                                                                                key={idx}
                                                                                                className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center gap-4 hover:border-primary/20 hover:scale-[1.01] transition-all duration-300"
                                                                                            >
                                                                                                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                                                                                                    <KpiIcon size={20} />
                                                                                                </div>
                                                                                                <div>
                                                                                                    <span className="block text-[10px] text-zinc-500 uppercase font-bold tracking-wider">{kpi.label}</span>
                                                                                                    <span className="text-lg font-extrabold text-white font-mono">{kpi.value}</span>
                                                                                                </div>
                                                                                            </div>
                                                                                        );
                                                                                    })}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    <div>
                                                                        <h4 className="text-lg font-bold text-white mb-4">Stack Tecnológico</h4>
                                                                        <motion.div
                                                                            className="flex flex-wrap gap-2"
                                                                            initial="hidden"
                                                                            animate="visible"
                                                                            variants={{
                                                                                hidden: { opacity: 0 },
                                                                                visible: {
                                                                                    opacity: 1,
                                                                                    transition: {
                                                                                        staggerChildren: 0.05,
                                                                                        delayChildren: 0.2
                                                                                    }
                                                                                }
                                                                            }}
                                                                        >
                                                                            {exp.tech.map((tech) => (
                                                                                <motion.span
                                                                                    key={tech}
                                                                                    variants={{
                                                                                        hidden: { opacity: 0, scale: 0.8 },
                                                                                        visible: { opacity: 1, scale: 1 }
                                                                                    }}
                                                                                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-sm text-primary/80 hover:bg-white/10 transition-colors cursor-default"
                                                                                >
                                                                                    {tech}
                                                                                </motion.span>
                                                                            ))}
                                                                        </motion.div>
                                                                    </div>
                                                                </motion.div>
                                                            ) : (
                                                                <motion.div
                                                                    key="architecture"
                                                                    initial={{ opacity: 0, y: 10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    exit={{ opacity: 0, y: -10 }}
                                                                >
                                                                    <IntegrationFlow experienceId={exp.id} />
                                                                </motion.div>
                                                            )}
                                                        </AnimatePresence>
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
                            const ms = exp.id === 'sapas' ? currentMsSapas : calculateDiffMs(exp.startDate, exp.endDate);

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
                                                <Counter
                                                    value={convertTime(ms, timeUnit)}
                                                    suffix={` ${timeUnit}`}
                                                    decimals={getDecimals(timeUnit)}
                                                />
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
                                                    <div className={`text-xl font-bold ${exp.growthVsPrevious && exp.growthVsPrevious > 0 ? 'text-green-400' : 'text-white'}`}>
                                                        {exp.growthVsPrevious ? <Counter value={exp.growthVsPrevious} prefix="+" suffix="%" decimals={2} /> : '-'}
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-muted-foreground mb-1 uppercase">Vs Inicio</p>
                                                    <div className={`text-xl font-bold ${exp.growthTotal && exp.growthTotal > 0 ? 'text-green-400' : 'text-white'}`}>
                                                        {exp.growthTotal ? <Counter value={exp.growthTotal} prefix="+" suffix="%" decimals={2} /> : '-'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </motion.div>
                )}

                {/* Analytics View */}
                {viewMode === 'analytics' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8 max-w-4xl mx-auto"
                    >
                        {/* Charts Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Salary Growth Chart */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:col-span-2">
                                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <TrendingUp className="text-green-400" size={20} />
                                        Crecimiento Salarial ({salaryMetric === 'total' ? 'Acumulado' : 'Vs. Anterior'})
                                    </h3>

                                    {/* Toggle */}
                                    <div className="bg-black/40 p-1 rounded-lg flex text-xs font-medium">
                                        <button
                                            onClick={() => setSalaryMetric('total')}
                                            className={`px-3 py-1.5 rounded-md transition-all ${salaryMetric === 'total' ? 'bg-green-500/20 text-green-400 shadow-sm' : 'text-muted-foreground hover:text-white'}`}
                                        >
                                            Acumulado
                                        </button>
                                        <button
                                            onClick={() => setSalaryMetric('previous')}
                                            className={`px-3 py-1.5 rounded-md transition-all ${salaryMetric === 'previous' ? 'bg-green-500/20 text-green-400 shadow-sm' : 'text-muted-foreground hover:text-white'}`}
                                        >
                                            Vs. Anterior
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {[...EXPERIENCES].reverse().map((exp, i) => {
                                        const value = salaryMetric === 'total' ? exp.growthTotal : exp.growthVsPrevious;
                                        const displayValue = value || 0;
                                        const barWidth = Math.min(Math.abs(displayValue), 100);

                                        return (
                                            <div key={exp.id} className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-white font-medium">{exp.company}</span>
                                                    <span className={`font-mono ${displayValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                        {displayValue > 0 ? '+' : ''}{displayValue.toFixed(2)}%
                                                    </span>
                                                </div>
                                                <div className="h-4 bg-white/10 rounded-full overflow-hidden relative">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${barWidth}%` }}
                                                        transition={{ duration: 1, delay: i * 0.1, ease: "easeOut" }}
                                                        className={`absolute top-0 left-0 h-full rounded-full ${displayValue >= 0 ? 'bg-gradient-to-r from-green-500 to-emerald-300' : 'bg-gradient-to-r from-red-500 to-orange-400'}`}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                                <p className="mt-6 text-xs text-muted-foreground text-center">
                                    {salaryMetric === 'total'
                                        ? '*Crecimiento porcentual respecto al salario inicial base.'
                                        : '*Crecimiento porcentual respecto a la posición inmediatemente anterior.'}
                                </p>
                            </div>

                            {/* Time Distribution (Enhanced) */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:col-span-2">
                                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                                    <Clock className="text-purple-400" size={20} />
                                    Distribución de Tiempo
                                </h3>

                                <div className="relative mb-8 group/chart">
                                    {/* The Bar */}
                                    <div className="flex h-16 rounded-2xl overflow-hidden w-full ring-4 ring-black/40 shadow-2xl relative z-10">
                                        {[...EXPERIENCES].reverse().map((exp, i) => {
                                            const ms = exp.id === 'sapas' ? currentMsSapas : calculateDiffMs(exp.startDate, exp.endDate);
                                            const percent = (ms / totalMs) * 100;

                                            // Premium Gradients
                                            const gradientClass =
                                                exp.id === 'sapas' ? 'bg-gradient-to-b from-primary to-orange-600' :
                                                    exp.id === 'timestamp' ? 'bg-gradient-to-b from-blue-500 to-indigo-700' :
                                                        'bg-gradient-to-b from-emerald-400 to-teal-700';

                                            return (
                                                <motion.div
                                                    key={exp.id}
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${percent}%` }}
                                                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                                                    className={`h-full relative transition-all duration-300 hover:brightness-110 cursor-crosshair ${gradientClass}`}
                                                    onMouseEnter={() => setHoveredDistIndex(i)}
                                                    onMouseLeave={() => setHoveredDistIndex(null)}
                                                >
                                                    {/* Shine Effect */}
                                                    <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                                                </motion.div>
                                            )
                                        })}
                                    </div>

                                    {/* Tooltip (Floating) */}
                                    <AnimatePresence>
                                        {hoveredDistIndex !== null && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: 5, scale: 0.9 }}
                                                className="absolute -top-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                                            >
                                                <div className="bg-black/90 border border-white/20 backdrop-blur-xl p-4 rounded-xl shadow-2xl flex flex-col items-center gap-1 min-w-[200px]">
                                                    <span className="text-white font-bold text-lg">
                                                        {[...EXPERIENCES].reverse()[hoveredDistIndex].company}
                                                    </span>
                                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                                        <Clock size={12} />
                                                        <span className="font-mono">
                                                            {(() => {
                                                                const exp = [...EXPERIENCES].reverse()[hoveredDistIndex];
                                                                const ms = exp.id === 'sapas' ? currentMsSapas : calculateDiffMs(exp.startDate, exp.endDate);
                                                                return convertTime(ms, timeUnit).toFixed(getDecimals(timeUnit));
                                                            })()} {timeUnit}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded-full text-primary mt-1">
                                                        {(() => {
                                                            const exp = [...EXPERIENCES].reverse()[hoveredDistIndex];
                                                            const ms = exp.id === 'sapas' ? currentMsSapas : calculateDiffMs(exp.startDate, exp.endDate);
                                                            return ((ms / totalMs) * 100).toFixed(1) + '%';
                                                        })()}
                                                    </span>
                                                </div>
                                                {/* Arrow */}
                                                <div className="w-4 h-4 bg-black/90 border-r border-b border-white/20 transform rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-2" />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Legend */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[...EXPERIENCES].reverse().map((exp) => {
                                        const ms = exp.id === 'sapas' ? currentMsSapas : calculateDiffMs(exp.startDate, exp.endDate);
                                        const percent = (ms / totalMs) * 100;
                                        const colorClass =
                                            exp.id === 'sapas' ? 'bg-primary' :
                                                exp.id === 'timestamp' ? 'bg-blue-600' :
                                                    'bg-emerald-500';

                                        return (
                                            <div key={exp.id} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                                <div className={`w-3 h-12 rounded-full ${colorClass} shadow-[0_0_10px_currentColor]`} />
                                                <div>
                                                    <span className="block text-white font-bold text-sm">{exp.company}</span>
                                                    <span className="text-muted-foreground text-xs">{percent.toFixed(1)}% del tiempo</span>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Work Mode Distribution (New) */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 md:col-span-2">
                                <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                                    <MapPin className="text-pink-400" size={20} />
                                    Distribución de Modalidad
                                </h3>

                                <div className="flex flex-col md:flex-row items-center justify-center gap-12">
                                    {/* Conic Gradient Chart */}
                                    {(() => {
                                        // Calculate Work Mode Stats
                                        const stats = EXPERIENCES.reduce((acc, exp) => {
                                            const mode = exp.workMode.includes('Remoto') ? 'Remoto' :
                                                exp.workMode.includes('Híbrido') ? 'Híbrido' : 'Presencial';
                                            const ms = exp.id === 'sapas' ? currentMsSapas : calculateDiffMs(exp.startDate, exp.endDate);
                                            acc[mode] = (acc[mode] || 0) + ms;
                                            return acc;
                                        }, {} as Record<string, number>);

                                        const remoteMs = stats['Remoto'] || 0;
                                        const hybridMs = stats['Híbrido'] || 0;

                                        const remotePercent = (remoteMs / totalMs) * 100;
                                        const hybridPercent = (hybridMs / totalMs) * 100;

                                        return (
                                            <>
                                                <div className="relative w-48 h-48 rounded-full shadow-2xl flex items-center justify-center group">
                                                    {/* CSS Conic Gradient */}
                                                    <div
                                                        className="absolute inset-0 rounded-full animate-spin-slow"
                                                        style={{
                                                            background: `conic-gradient(
                                                                #ec4899 0% ${remotePercent}%, 
                                                                #8b5cf6 ${remotePercent}% 100%
                                                            )`
                                                        }}
                                                    />
                                                    {/* Inner Circle for Donut Effect */}
                                                    <div className="absolute inset-4 bg-[#0a0a0a] rounded-full z-10 flex flex-col items-center justify-center p-4 text-center">
                                                        <span className="text-muted-foreground text-xs uppercase tracking-wider">Dominante</span>
                                                        <span className="text-2xl font-bold text-white">
                                                            {remotePercent > hybridPercent ? 'Remoto' : 'Híbrido'}
                                                        </span>
                                                        <span className="text-sm font-mono text-pink-400">
                                                            {(Math.max(remotePercent, hybridPercent)).toFixed(0)}%
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Legend */}
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex items-center gap-4 group">
                                                        <div className="w-12 h-12 rounded-xl bg-pink-500/20 flex items-center justify-center border border-pink-500/30 group-hover:scale-110 transition-transform">
                                                            <MapPin className="text-pink-500" size={24} />
                                                        </div>
                                                        <div>
                                                            <div className="text-lg font-bold text-white">Full Remoto</div>
                                                            <div className="text-pink-400 font-mono text-sm">{remotePercent.toFixed(1)}%</div>
                                                            <div className="w-32 h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    whileInView={{ width: `${remotePercent}%` }}
                                                                    className="h-full bg-pink-500"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4 group">
                                                        <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center border border-violet-500/30 group-hover:scale-110 transition-transform">
                                                            <Briefcase className="text-violet-500" size={24} />
                                                        </div>
                                                        <div>
                                                            <div className="text-lg font-bold text-white">Híbrido</div>
                                                            <div className="text-violet-400 font-mono text-sm">{hybridPercent.toFixed(1)}%</div>
                                                            <div className="w-32 h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                                                                <motion.div
                                                                    initial={{ width: 0 }}
                                                                    whileInView={{ width: `${hybridPercent}%` }}
                                                                    className="h-full bg-violet-500"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    })()}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Milestones View */}
                {viewMode === 'milestones' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <ExperienceMilestones experiences={EXPERIENCES} />
                    </motion.div>
                )}
            </div>
        </section>
    );
}

// --- Dynamic BTP/CPI Integration Flow Component ---
interface FlowNode {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ComponentType<any>;
    tech: string;
    description: string;
}

function IntegrationFlow({ experienceId }: { experienceId: string }) {
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationStep, setSimulationStep] = useState<number | null>(null);
    const [simulatedLogs, setSimulatedLogs] = useState<string[]>([]);
    
    const terminalContainerRef = useRef<HTMLDivElement>(null);
    const timeoutsRef = useRef<number[]>([]);

    const getFlowData = (): FlowNode[] => {
        switch (experienceId) {
            case "sapas":
                return [
                    {
                        id: "source",
                        title: "HIS Hospitalario",
                        subtitle: "Sistemas Clínicos",
                        icon: Server,
                        tech: "HL7, XML, SOAP",
                        description: "Los sistemas de información hospitalarios emiten mensajes clínicos en formato estándar HL7 (altas, ingresos, altas médicas) en tiempo real al producirse cualquier evento asistencial."
                    },
                    {
                        id: "cpi",
                        title: "SAP CPI / BTP",
                        subtitle: "Integration Suite",
                        icon: Network,
                        tech: "Groovy, Mapping, OAuth",
                        description: "Recibe, valida y enruta los mensajes clínicos de forma segura. Realiza mapeo complejo y transformaciones de datos utilizando scripts en Groovy para su adecuación."
                    },
                    {
                        id: "cap",
                        title: "SAP CAP Backend",
                        subtitle: "Servicios OData",
                        icon: Server,
                        tech: "Node.js, CDS, JWT",
                        description: "Procesamiento de lógica de negocio en la nube a través de microservicios OData V4 desarrollados sobre SAP Cloud Application Programming Model (CAP)."
                    },
                    {
                        id: "db",
                        title: "SAP HANA DB",
                        subtitle: "Persistencia Clínica",
                        icon: Database,
                        tech: "SQL, HANA Cloud",
                        description: "La base de datos en memoria almacena de manera definitiva y estructurada la información clínica y del ciclo del paciente para su explotación analítica posterior."
                    }
                ];
            case "timestamp":
                return [
                    {
                        id: "sf",
                        title: "SAP SuccessFactors",
                        subtitle: "Core de RRHH",
                        icon: Server,
                        tech: "OData v2/v4, Picklists",
                        description: "Punto de partida de la información de empleados, nóminas y estructura organizativa de la compañía. Los datos son expuestos mediante APIs REST y OData."
                    },
                    {
                        id: "cpi",
                        title: "SAP CPI Middleware",
                        subtitle: "Integration Suite",
                        icon: Network,
                        tech: "Groovy, XML, Base64",
                        description: "Procesa y manipula la información de nóminas de forma dinámica. Genera payloads XML usando MarkupBuilder en Groovy, e inyecta cabeceras codificadas en Base64."
                    },
                    {
                        id: "bank",
                        title: "Bancos / SFTP",
                        subtitle: "Destino Financiero",
                        icon: Database,
                        tech: "CSV, SOAP, Insomnia",
                        description: "Los archivos resultantes de nóminas e IRPF se transfieren de forma encriptada a servidores SFTP o servicios web bancarios para el abono efectivo de salarios."
                    }
                ];
            case "inetum":
                return [
                    {
                        id: "erp",
                        title: "ERP On-Premise",
                        subtitle: "Sistemas Legacy",
                        icon: Server,
                        tech: "SAP NetWeaver, XML",
                        description: "Sistemas ERP locales de compras, ventas y finanzas que contienen los datos transaccionales tradicionales listos para ser conectados."
                    },
                    {
                        id: "cc",
                        title: "Cloud Connector",
                        subtitle: "Túnel de Red Seguro",
                        icon: Network,
                        tech: "SSL, Proxy Seguro",
                        description: "Enlace encriptado punto a punto que conecta de forma segura los recursos del ERP local con la infraestructura en la nube de SAP, sin exponer puertos externos."
                    },
                    {
                        id: "cpi",
                        title: "SAP CPI Cloud",
                        subtitle: "Flujos de Datos",
                        icon: Database,
                        tech: "REST/SOAP, Mapping",
                        description: "Plataforma en la nube donde se ejecutan las migraciones de escenarios de integración PI/PO antiguos, optimizando los costes y automatizando procesos manuales."
                    }
                ];
            default:
                return [];
        }
    };

    const nodes = getFlowData();

    // Auto-scroll terminal to bottom
    useEffect(() => {
        if (terminalContainerRef.current) {
            terminalContainerRef.current.scrollTo({
                top: terminalContainerRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [simulatedLogs]);

    const clearAllTimeouts = () => {
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];
    };

    // Auto-select the first node on mount or reset
    useEffect(() => {
        if (nodes.length > 0 && !isSimulating) {
            setSelectedNode(nodes[0].id);
        }
        return () => {
            clearAllTimeouts();
        };
    }, [experienceId]);

    const getSimulationSequence = () => {
        switch (experienceId) {
            case "sapas":
                return [
                    { delay: 0, step: 0, text: "[12:05:01] INFO - Conexión establecida con el HIS Hospitalario." },
                    { delay: 500, text: "[12:05:01] EVENT - Transacción clínica: ADT^A08 (Actualización Paciente)." },
                    { delay: 1000, text: "[12:05:02] SEND - Enviando mensaje HL7 v2.x por socket TCP MLLP..." },
                    { delay: 1800, step: 1, text: "[12:05:03] RECEIVE - Mensaje HL7 recibido en el endpoint de SAP CPI." },
                    { delay: 2300, text: "[12:05:03] DECRYPT - Autenticación OAuth 2.0 validada con éxito." },
                    { delay: 2800, text: "[12:05:04] PROCESS - Ejecutando script Groovy: parseando HL7 a XML." },
                    { delay: 3300, text: "[12:05:04] SUCCESS - Conversión a payload JSON completada (3.2 KB)." },
                    { delay: 4100, step: 2, text: "[12:05:05] HTTP - Petición POST recibida en SAP CAP /odata/v4/Patients." },
                    { delay: 4600, text: "[12:05:05] SEC - Token JWT verificado y roles validados (Clean Core)." },
                    { delay: 5100, text: "[12:05:06] CALC - Ejecutando validaciones de negocio en Node.js (CDS)." },
                    { delay: 5900, step: 3, text: "[12:05:07] DB - Ejecutando query UPSERT en HANA Cloud." },
                    { delay: 6400, text: "[12:05:07] SUCCESS - Registro de paciente #9482 actualizado en 12ms." },
                    { delay: 6900, text: "[12:05:08] HTTP - Respuesta exitosa enviada: 201 Created." },
                    { delay: 7500, text: "[12:05:08] SIM - ¡Integración clínica completada con éxito!" }
                ];
            case "timestamp":
                return [
                    { delay: 0, step: 0, text: "[09:30:01] INFO - Suceso de nómina disparado en SAP SuccessFactors." },
                    { delay: 600, text: "[09:30:01] DATA - Consultando picklists y perfiles de empleados vía OData." },
                    { delay: 1200, text: "[09:30:02] SEND - Payload de nóminas listo. Iniciando llamada HTTPS segura..." },
                    { delay: 2000, step: 1, text: "[09:30:03] RECEIVE - Payload recibido en SAP CPI (Integration Suite)." },
                    { delay: 2600, text: "[09:30:03] PROCESS - Iniciando script Groovy con MarkupBuilder." },
                    { delay: 3200, text: "[09:30:04] COMPRESS - Comprimiendo payloads binarios de PDF a Base64." },
                    { delay: 3800, text: "[09:30:04] ENCRYPT - Cifrando campos condicionales y cuentas bancarias." },
                    { delay: 4600, step: 2, text: "[09:30:05] CONNECT - Conectando con servidor SFTP bancario vía SSH." },
                    { delay: 5200, text: "[09:30:06] UPLOAD - Transfiriendo archivo de remesas (Remesa_Sepa.xml)." },
                    { delay: 5800, text: "[09:30:06] SUCCESS - Transferencia completada de forma segura." },
                    { delay: 6500, text: "[09:30:07] SIM - ¡Flujo de nóminas procesado y enviado con éxito!" }
                ];
            case "inetum":
                return [
                    { delay: 0, step: 0, text: "[17:00:01] ERP - Pedido de compra creado localmente (PO #45000982)." },
                    { delay: 600, text: "[17:00:01] EVENT - Desencadenando RFC/IDoc saliente." },
                    { delay: 1200, text: "[17:00:02] CONNECT - Intentando ruta de red interna local..." },
                    { delay: 2000, step: 1, text: "[17:00:03] TUNNEL - Conexión de túnel SSL establecida con SAP BTP." },
                    { delay: 2600, text: "[17:00:03] SEC - Mapeo de recursos locales validado (Acceso concedido)." },
                    { delay: 3200, text: "[17:00:04] FORWARD - Petición retransmitida a la nube de forma segura." },
                    { delay: 4000, step: 2, text: "[17:00:05] RECEIVE - Recibida petición en iFlow de SAP CPI Cloud." },
                    { delay: 4600, text: "[17:00:05] MIGRATION - Ejecutando escenario migrado de PI/PO antiguo." },
                    { delay: 5200, text: "[17:00:06] SUCCESS - Mapeo de esquema XML validado contra XSD." },
                    { delay: 6000, text: "[17:00:06] SIM - ¡Escenario legado migrado y ejecutado correctamente!" }
                ];
            default:
                return [];
        }
    };

    const startSimulation = () => {
        if (isSimulating) return;
        clearAllTimeouts();
        setIsSimulating(true);
        setSimulatedLogs([]);
        setSimulationStep(0);
        setSelectedNode(nodes[0].id);

        const sequence = getSimulationSequence();
        const ids: number[] = [];

        sequence.forEach((item) => {
            const id = window.setTimeout(() => {
                if (item.step !== undefined) {
                    setSimulationStep(item.step);
                    setSelectedNode(nodes[item.step].id);
                }
                setSimulatedLogs(prev => [...prev, item.text]);
            }, item.delay);
            ids.push(id);
        });

        const maxDelay = Math.max(...sequence.map(s => s.delay));
        const doneId = window.setTimeout(() => {
            setIsSimulating(false);
            setSimulationStep(null);
        }, maxDelay + 800);
        ids.push(doneId);

        timeoutsRef.current = ids;
    };

    const stopSimulation = () => {
        clearAllTimeouts();
        setIsSimulating(false);
        setSimulationStep(null);
        setSimulatedLogs([]);
        if (nodes.length > 0) {
            setSelectedNode(nodes[0].id);
        }
    };

    if (nodes.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="w-1 h-6 bg-primary rounded-full" />
                        Flujo de Integración SAP BTP
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl mt-1">
                        Haz clic en cualquier nodo del flujo para inspeccionar las tecnologías y la lógica aplicada en esa fase del pipeline.
                    </p>
                </div>
                
                {/* Simulator Trigger Button */}
                <button
                    onClick={isSimulating ? stopSimulation : startSimulation}
                    className={cn(
                        "px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center gap-2 border w-fit shrink-0",
                        isSimulating
                            ? "bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30"
                            : "bg-primary/20 text-primary border-primary/30 hover:bg-primary/30 shadow-[0_0_15px_rgba(234,88,12,0.15)]"
                    )}
                >
                    {isSimulating ? (
                        <>
                            <Square size={12} fill="currentColor" />
                            Detener Test
                        </>
                    ) : (
                        <>
                            <Play size={12} fill="currentColor" />
                            Simular Integración
                        </>
                    )}
                </button>
            </div>

            {/* Diagram Container */}
            <div className="bg-black/45 border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center md:items-stretch gap-4 md:gap-0 relative overflow-hidden">
                {nodes.map((node, idx) => {
                    const NodeIcon = node.icon;
                    const isSimulatingThisNode = isSimulating && simulationStep === idx;
                    const isSelected = selectedNode === node.id;

                    return (
                        <div key={node.id} className="flex flex-col md:flex-row items-center flex-1">
                            {/* Node Card */}
                            <motion.div
                                whileHover={isSimulating ? {} : { scale: 1.03 }}
                                onClick={() => {
                                    if (!isSimulating) {
                                        setSelectedNode(node.id);
                                    }
                                }}
                                className={cn(
                                    "p-4 rounded-xl border flex flex-col items-center text-center cursor-pointer min-w-[150px] max-w-[180px] z-10 transition-all select-none mx-auto",
                                    isSimulating
                                        ? isSimulatingThisNode
                                            ? "bg-primary/20 border-primary shadow-[0_0_20px_rgba(234,88,12,0.4)] scale-105"
                                            : "bg-white/5 border-white/5 opacity-40 cursor-not-allowed"
                                        : isSelected
                                            ? "bg-primary/10 border-primary shadow-[0_0_15px_rgba(234,88,12,0.25)]"
                                            : "bg-white/5 border-white/10 hover:border-white/30 text-zinc-300"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-lg flex items-center justify-center mb-3 border",
                                    isSimulating
                                        ? isSimulatingThisNode
                                            ? "bg-primary/20 border-primary text-primary"
                                            : "bg-white/5 border-white/5 text-zinc-600"
                                        : isSelected 
                                            ? "bg-primary/20 border-primary text-primary" 
                                            : "bg-white/5 border-white/10 text-zinc-400"
                                )}>
                                    <NodeIcon size={20} />
                                </div>
                                <span className="text-xs font-bold text-white line-clamp-1">{node.title}</span>
                                <span className="text-[10px] text-zinc-500 font-mono mt-0.5">{node.subtitle}</span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-zinc-400 font-mono mt-2">{node.tech}</span>
                            </motion.div>

                            {/* Connector Line (if not last) */}
                            {idx < nodes.length - 1 && (
                                <div className="flex flex-1 items-center justify-center w-full md:w-auto">
                                    {/* Desktop Connector */}
                                    <div className="hidden md:flex flex-1 h-0.5 bg-zinc-800 self-center mx-2 relative min-w-[30px] w-full">
                                        <motion.div
                                            animate={{ left: ["0%", "100%"] }}
                                            transition={
                                                isSimulatingThisNode
                                                    ? { duration: 0.8, repeat: Infinity, ease: "linear" }
                                                    : { duration: 3, repeat: Infinity, ease: "linear" }
                                            }
                                            className={cn(
                                                "absolute w-2 h-2 rounded-full -translate-y-1/2 shadow-[0_0_8px_currentColor]",
                                                isSimulatingThisNode
                                                    ? "bg-primary text-primary"
                                                    : "bg-zinc-600 text-zinc-600"
                                            )}
                                        />
                                    </div>
                                    
                                    {/* Mobile Connector */}
                                    <div className="md:hidden w-0.5 h-8 bg-zinc-800 relative my-2">
                                        <motion.div
                                            animate={{ top: ["0%", "100%"] }}
                                            transition={
                                                isSimulatingThisNode
                                                    ? { duration: 0.6, repeat: Infinity, ease: "linear" }
                                                    : { duration: 2, repeat: Infinity, ease: "linear" }
                                            }
                                            className={cn(
                                                "absolute w-2 h-2 rounded-full -translate-x-1/2 shadow-[0_0_8px_currentColor]",
                                                isSimulatingThisNode
                                                    ? "bg-primary text-primary"
                                                    : "bg-zinc-600 text-zinc-600"
                                            )}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Terminal Console */}
            <AnimatePresence>
                {(isSimulating || simulatedLogs.length > 0) && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div ref={terminalContainerRef} className="bg-[#08080c] border border-white/10 rounded-xl p-4 font-mono text-[11px] text-zinc-300 shadow-inner h-40 overflow-y-auto flex flex-col gap-1.5 custom-scrollbar relative">
                            <div className="sticky top-0 bg-[#08080c]/90 backdrop-blur-md flex justify-between items-center text-[9px] text-zinc-500 border-b border-white/5 pb-1.5 mb-1.5 uppercase tracking-wider font-bold z-20">
                                <span className="flex items-center gap-1.5">
                                    <Terminal size={12} className="text-primary" />
                                    Consola de Integración SAP BTP
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <span className={cn("w-1.5 h-1.5 rounded-full", isSimulating ? "bg-amber-500 animate-pulse" : "bg-green-500")} />
                                    {isSimulating ? "RUNNING" : "COMPLETED"}
                                </span>
                            </div>
                            <div className="space-y-1.5 pt-1">
                                {simulatedLogs.map((log, index) => {
                                    let color = "text-zinc-400";
                                    if (log.includes("SUCCESS") || log.includes("¡Integración") || log.includes("¡Flujo") || log.includes("¡Escenario")) {
                                        color = "text-emerald-400 font-bold";
                                    } else if (log.includes("INFO") || log.includes("RECEIVE") || log.includes("CONNECT") || log.includes("SEND")) {
                                        color = "text-blue-400";
                                    } else if (log.includes("EVENT") || log.includes("DATA") || log.includes("ERP")) {
                                        color = "text-purple-400";
                                    } else if (log.includes("PROCESS") || log.includes("MIGRATION") || log.includes("Groovy")) {
                                        color = "text-amber-400";
                                    } else if (log.includes("DB") || log.includes("HANA") || log.includes("UPLOAD")) {
                                        color = "text-cyan-400";
                                    } else if (log.includes("SEC") || log.includes("DECRYPT") || log.includes("TUNNEL")) {
                                        color = "text-pink-400";
                                    }

                                    return (
                                        <div key={index} className={cn("leading-relaxed", color)}>
                                            {log}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Selected Node Details Box */}
            <AnimatePresence mode="wait">
                {selectedNode && (
                    <motion.div
                        key={selectedNode}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2"
                    >
                        {(() => {
                            const activeNode = nodes.find(n => n.id === selectedNode);
                            if (!activeNode) return null;
                            return (
                                <>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono uppercase tracking-wider text-primary">{activeNode.subtitle}</span>
                                        <span className="text-zinc-600">|</span>
                                        <span className="text-xs font-bold text-zinc-400 font-mono bg-white/5 px-2 py-0.5 rounded border border-white/5">{activeNode.tech}</span>
                                    </div>
                                    <h5 className="font-bold text-white text-base">{activeNode.title}</h5>
                                    <p className="text-zinc-400 text-xs leading-relaxed font-sans">{activeNode.description}</p>
                                </>
                            );
                        })()}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
