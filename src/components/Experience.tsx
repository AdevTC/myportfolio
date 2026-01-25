"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronUp, Clock, TrendingUp, Calendar, Users, Briefcase, MapPin, ExternalLink } from "lucide-react";
import { createPortal } from "react-dom";
import Counter from "./ui/Counter";

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

// --- Constants ---
const S_INETUM_START = Number(process.env.NEXT_PUBLIC_SALARY_INETUM_START) || 19000;
const S_INETUM_END = Number(process.env.NEXT_PUBLIC_SALARY_INETUM_END) || 20000;
const S_TIMESTAMP = Number(process.env.NEXT_PUBLIC_SALARY_TIMESTAMP) || 26000;
const S_SAPAS = Number(process.env.NEXT_PUBLIC_SALARY_SAPAS) || 33000;

const calculateGrowth = (current: number, previous: number) => {
    if (!previous) return 0;
    return ((current / previous) - 1) * 100;
};

// --- Data ---
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
    const [viewMode, setViewMode] = useState<'timeline' | 'comparison' | 'analytics'>('timeline');
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [currentMsSapas, setCurrentMsSapas] = useState(0);
    const [timeUnit, setTimeUnit] = useState<TimeUnit>('Días');
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isCompaniesDropdownOpen, setCompaniesDropdownOpen] = useState(false);
    const [highlightedId, setHighlightedId] = useState<string | null>(null);
    const [salaryMetric, setSalaryMetric] = useState<'total' | 'previous'>('total');

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
                    <div className="flex justify-center">
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
                            <button
                                onClick={() => setViewMode('analytics')}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${viewMode === 'analytics'
                                    ? 'bg-primary text-white shadow-lg'
                                    : 'text-muted-foreground hover:text-white'
                                    }`}
                            >
                                Analítica
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
                                                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-6">
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
                        {/* Salary Growth Chart */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
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
                                    // Handle missing or zero values comfortably
                                    const displayValue = value || 0;
                                    // For visual bar, cap at 100 or scale suitably. If it's "previous", 100% is a huge jump, but fine.
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

                        {/* Time Distribution */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Clock className="text-purple-400" size={20} />
                                Distribución de Tiempo
                            </h3>
                            <div className="flex h-12 rounded-full overflow-hidden w-full ring-4 ring-black/40 shadow-2xl">
                                {[...EXPERIENCES].reverse().map((exp, i) => {
                                    const ms = exp.id === 'sapas' ? currentMsSapas : calculateDiffMs(exp.startDate, exp.endDate);
                                    const percent = (ms / totalMs) * 100;

                                    // Distinct colors per company
                                    // Sapas: Primary (Pink/Reddish), Timestamp: Blue, Inetum: Emerald/Teal
                                    const colorClass =
                                        exp.id === 'sapas' ? 'bg-primary' :
                                            exp.id === 'timestamp' ? 'bg-blue-600' :
                                                'bg-emerald-600';

                                    return (
                                        <motion.div
                                            key={exp.id}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percent}%` }}
                                            transition={{ duration: 1, ease: "anticipate" }}
                                            className={`h-full relative transition-all hover:brightness-110 cursor-crosshair flex items-center justify-center ${colorClass}`}
                                            title={`${exp.company}: ${percent.toFixed(1)}%`}
                                        >
                                            <span className="text-white/90 font-bold text-xs truncate px-2 drop-shadow-md hidden md:block">
                                                {exp.company} ({percent.toFixed(0)}%)
                                            </span>
                                        </motion.div>
                                    )
                                })}
                            </div>
                            <div className="flex flex-wrap gap-4 justify-center mt-6">
                                {[...EXPERIENCES].reverse().map((exp) => {
                                    const ms = exp.id === 'sapas' ? currentMsSapas : calculateDiffMs(exp.startDate, exp.endDate);
                                    const percent = (ms / totalMs) * 100;
                                    const bgClass =
                                        exp.id === 'sapas' ? 'bg-primary' :
                                            exp.id === 'timestamp' ? 'bg-blue-600' :
                                                'bg-emerald-600';

                                    return (
                                        <div key={exp.id} className="flex items-center gap-2 text-sm bg-white/5 px-3 py-1.5 rounded-full border border-white/5 shadow-sm">
                                            <div className={`w-3 h-3 rounded-full ${bgClass} shadow-lg shadow-black/50`} />
                                            <span className="text-white/90 font-medium">{exp.company}</span>
                                            <span className="text-muted-foreground font-mono text-xs">| {percent.toFixed(1)}%</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </section>
    );
}
