"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { Briefcase, Star, Trophy, Clock, Lock, CheckCircle2, ChevronDown, Info, X } from "lucide-react";
import { addDays, isBefore, format } from "date-fns";
import { es } from "date-fns/locale";

interface ExperienceItem {
    id: string;
    company: string;
    logo: string;
    startDate: string;
    endDate?: string;
    role: string;
}

interface ExperienceMilestonesProps {
    experiences: ExperienceItem[];
}

import { differenceInDays } from "date-fns";

type Tier = 'common' | 'special' | 'epic';

interface MilestoneSpec {
    label: string;
    days: number;
    icon: any;
    tier: Tier;
    date: Date;
    company?: string;
    logo?: string;
    role?: string;
    achieved: boolean;
    id: string;
    isEnd?: boolean;
    isNext?: boolean;
}

const COMPANY_THEMES: Record<string, {
    borderHover: string;
    borderDefault: string;
    gradientBg: string;
    blob1: string;
    blob2: string;
    accentText: string;
    progressBar: string;
}> = {
    alsea: {
        borderHover: "hover:border-blue-500/60 hover:shadow-[0_0_35px_rgba(37,99,235,0.25)]",
        borderDefault: "border-blue-500/20",
        gradientBg: "from-blue-950/40 via-[#0d1c3a]/30 to-indigo-950/40",
        blob1: "bg-blue-600/25",
        blob2: "bg-indigo-500/20",
        accentText: "group-hover:text-blue-400",
        progressBar: "from-blue-500 to-indigo-400"
    },
    sapas: {
        borderHover: "hover:border-white/60 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]",
        borderDefault: "border-white/20",
        gradientBg: "from-neutral-900/60 via-[#18181b]/50 to-zinc-900/60",
        blob1: "bg-white/15",
        blob2: "bg-slate-200/10",
        accentText: "group-hover:text-white",
        progressBar: "from-white to-slate-400"
    },
    timestamp: {
        borderHover: "hover:border-red-500/60 hover:shadow-[0_0_40px_rgba(239,68,68,0.25)]",
        borderDefault: "border-red-500/20",
        gradientBg: "from-red-950/50 via-[#2a0e14]/40 to-rose-950/40",
        blob1: "bg-red-600/25",
        blob2: "bg-rose-500/20",
        accentText: "group-hover:text-red-400",
        progressBar: "from-red-500 to-rose-500"
    },
    inetum: {
        borderHover: "hover:border-teal-500/60 hover:shadow-[0_0_35px_rgba(13,148,136,0.25)]",
        borderDefault: "border-teal-500/20",
        gradientBg: "from-teal-950/40 via-[#0a2324]/30 to-cyan-950/40",
        blob1: "bg-teal-500/25",
        blob2: "bg-emerald-500/20",
        accentText: "group-hover:text-teal-400",
        progressBar: "from-teal-500 to-emerald-400"
    }
};

// Logic to determine a milestone's tier and label based on number of days
const getMilestoneInfo = (days: number): { isMilestone: boolean; label: string; icon: any; tier: Tier } | null => {
    // Epics: Years and 500-day intervals (excluding 0)
    if (days > 0 && days % 365 === 0) return { isMilestone: true, label: `${days / 365} Año${days / 365 > 1 ? 's' : ''}`, icon: Trophy, tier: 'epic' };
    if (days > 0 && days % 500 === 0) return { isMilestone: true, label: `${days} Días`, icon: Trophy, tier: 'epic' };

    // Specials: 100-day intervals and 3-month (approx 90 days) intervals, half-years
    if (days > 0 && days % 100 === 0) return { isMilestone: true, label: `${days} Días`, icon: Star, tier: 'special' };
    if (days === 90) return { isMilestone: true, label: `3 Meses`, icon: Star, tier: 'special' };
    if (days === 183) return { isMilestone: true, label: `6 Meses`, icon: Star, tier: 'special' };

    // Commons: Early milestones
    if (days === 0) return { isMilestone: true, label: "Primer Día", icon: Briefcase, tier: 'common' };
    if (days === 10) return { isMilestone: true, label: "10 Días", icon: Star, tier: 'common' };
    if (days === 25) return { isMilestone: true, label: "25 Días", icon: Star, tier: 'common' };
    if (days === 50) return { isMilestone: true, label: "50 Días", icon: Star, tier: 'common' };
    if (days === 30) return { isMilestone: true, label: "1 Mes", icon: Star, tier: 'common' };

    return null; // Not a milestone day
};

export default function ExperienceMilestones({ experiences }: ExperienceMilestonesProps) {
    const [view, setView] = useState<'company' | 'general'>('company');
    const [expandedCompany, setExpandedCompany] = useState<string | null>(experiences[0]?.id || null);
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    const { companyMilestones, generalMilestones } = useMemo(() => {
        const now = new Date();
        const byCompany: Record<string, MilestoneSpec[]> = {};
        const generalList: MilestoneSpec[] = [];

        const sortedExperiences = [...experiences].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

        // 1. Generate Company-specific Milestones
        sortedExperiences.forEach((exp) => {
            const start = new Date(exp.startDate);
            const end = exp.endDate ? new Date(exp.endDate) : now;
            byCompany[exp.id] = [];

            let dayCount = 0;
            let currentMsDate = start;
            let nextMilestoneFound = false;

            // Generate milestones iteratively until we cross the end date OR finding the 'next' milestone
            while (true) {
                const info = getMilestoneInfo(dayCount);
                if (info) {
                    const achieved = isBefore(currentMsDate, now);

                    // Stop generating if we past the assignment end date and we are generating future milestones
                    if (exp.endDate && isBefore(end, currentMsDate)) {
                        break;
                    }

                    const ms: MilestoneSpec = {
                        label: info.label,
                        days: dayCount,
                        icon: info.icon,
                        tier: info.tier,
                        date: currentMsDate,
                        company: exp.company,
                        logo: exp.logo,
                        role: exp.role,
                        achieved,
                        id: `${exp.id}-${dayCount}`,
                    };

                    byCompany[exp.id].push(ms);

                    if (!achieved) {
                        nextMilestoneFound = true;
                        ms.isNext = true;
                        break; // We only need the ONE immediate next milestone
                    }
                }

                // Safety catch for infinite loop (stop around 40 years)
                if (dayCount > 15000) break;

                dayCount++;
                currentMsDate = addDays(start, dayCount);
            }

            // Añadir hito de finalización si aplica
            if (exp.endDate) {
                const ms: MilestoneSpec = {
                    label: "Fin de la Etapa",
                    days: differenceInDays(end, start),
                    icon: CheckCircle2,
                    tier: 'special',
                    date: end,
                    company: exp.company,
                    logo: exp.logo,
                    role: exp.role,
                    achieved: true,
                    id: `${exp.id}-end`,
                    isEnd: true,
                };
                // Make sure it goes in the correct chronological spot, though it's typically last anyway
                byCompany[exp.id].push(ms);
            }
        });

        // 2. Generate Global "General" Milestones across ALL experience
        let globalDayCount = 0;

        // Helper to precisely map aggregate career days to a calendar date
        const getDateForCumulativeDays = (targetDays: number): { date: Date, achieved: boolean } => {
            let remainingDays = targetDays;

            for (const exp of sortedExperiences) {
                const start = new Date(exp.startDate);
                const end = exp.endDate ? new Date(exp.endDate) : now;

                // Calculate exact days as a float consistent with main counter
                const msDiff = end.getTime() - start.getTime();
                const durationDays = msDiff / (1000 * 60 * 60 * 24);

                if (!exp.endDate) {
                    const exactDate = new Date(start.getTime() + remainingDays * 24 * 60 * 60 * 1000);
                    return { date: exactDate, achieved: isBefore(exactDate, now) };
                } else {
                    if (remainingDays <= durationDays) {
                        const exactDate = new Date(start.getTime() + remainingDays * 24 * 60 * 60 * 1000);
                        return { date: exactDate, achieved: true };
                    }
                    remainingDays -= durationDays; // Subtract and move to the next job
                }
            }

            // Fallback if target is beyond all known jobs 
            const lastExp = sortedExperiences[sortedExperiences.length - 1];
            const lastEnd = lastExp.endDate ? new Date(lastExp.endDate) : now;
            const exactDate = new Date(lastEnd.getTime() + remainingDays * 24 * 60 * 60 * 1000);
            return { date: exactDate, achieved: false };
        };

        while (true) {
            const info = getMilestoneInfo(globalDayCount);
            if (info) {
                const { date: projectedDate, achieved } = getDateForCumulativeDays(globalDayCount);

                const ms: MilestoneSpec = {
                    label: info.label + (globalDayCount === 0 ? " Profesional" : " de Carrera"),
                    days: globalDayCount,
                    icon: info.icon,
                    tier: info.tier,
                    date: projectedDate,
                    achieved: achieved,
                    id: `global-${globalDayCount}`,
                };

                generalList.push(ms);

                if (!ms.achieved) {
                    ms.isNext = true;
                    break;
                }
            }

            if (globalDayCount > 15000) break;
            globalDayCount++;
        }

        // Sort just in case
        generalList.sort((a, b) => a.date.getTime() - b.date.getTime());
        Object.values(byCompany).forEach(arr => arr.sort((a, b) => a.date.getTime() - b.date.getTime()));

        return { companyMilestones: byCompany, generalMilestones: generalList };
    }, [experiences]);

    const renderMilestone = (ms: MilestoneSpec, index: number, totalLen: number) => {
        const Icon = ms.icon;

        let colorClass = "text-muted-foreground bg-white/5 border-white/10";
        if (ms.achieved) {
            if (ms.tier === 'epic') colorClass = "text-yellow-400 bg-yellow-400/20 border-yellow-400/50 shadow-[0_0_15px_rgba(250,204,21,0.3)]";
            else if (ms.tier === 'special') colorClass = "text-purple-400 bg-purple-400/20 border-purple-400/50 shadow-[0_0_10px_rgba(192,132,252,0.2)]";
            else colorClass = "text-primary bg-primary/20 border-primary/50";
        } else if (ms.isNext) {
            // Next unachieved milestone look
            colorClass = "text-blue-400 bg-blue-400/10 border-blue-400/40 animate-pulse";
        }

        const lineClass = ms.achieved ? "bg-primary" : "bg-white/10";
        const isNextContainer = ms.isNext && !ms.achieved;

        // Progress calculation for Next milestone
        let progress = 0;
        let daysLeft = 0;
        if (isNextContainer) {
            const now = new Date();
            daysLeft = differenceInDays(ms.date, now);
            // Rough progress calculation assuming previous milestone was 0 (simplified)
            // A perfect calculation would subtract the previous milestone's date, but we'll use a standard 30-day window for visual flair
            progress = Math.max(0, Math.min(100, 100 - (daysLeft / 100) * 100)); // Just a visual filler
        }

        return (
            <div key={ms.id} className="relative flex gap-6 pb-8 last:pb-0 group">
                {/* Timeline Line */}
                {index < totalLen - 1 && (
                    <div className={`absolute top-10 left-[19px] bottom-0 w-0.5 ${lineClass} rounded-full`} />
                )}

                {/* Icon Container */}
                <div className="relative z-10 shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 shadow-lg ${ms.achieved ? 'bg-[#0a0a0a]' : 'bg-black/50 border-dashed border-white/20'}`}>
                        {ms.achieved ? (
                            <div className={`w-full h-full rounded-full flex items-center justify-center border ${colorClass}`}>
                                <Icon size={18} className={ms.tier === 'epic' ? "drop-shadow-[0_0_8px_currentColor]" : ""} />
                            </div>
                        ) : isNextContainer ? (
                            <div className={`w-full h-full rounded-full flex items-center justify-center border ${colorClass}`}>
                                <Icon size={16} />
                            </div>
                        ) : (
                            <Lock size={16} className="text-muted-foreground" />
                        )}
                    </div>
                </div>

                {/* Content Container */}
                <div className={`flex-1 transition-all duration-300 ${ms.achieved || isNextContainer ? 'opacity-100 hover:translate-x-1' : 'opacity-60 grayscale-[0.5]'}`}>
                    <div className={`bg-white/5 border p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors shadow-sm
                        ${ms.achieved ? 'border-white/10 md:hover:bg-white/10' : ''}
                        ${isNextContainer ? 'border-blue-400/30 bg-blue-400/5' : ''}
                    `}>
                        <div className="flex items-center gap-4">
                            {view === 'general' && ms.logo && (() => {
                                const isFullBleed = ms.company?.toLowerCase().includes('alsea') || ms.company?.toLowerCase().includes('timestamp') || ms.company?.toLowerCase().includes('inetum');
                                return (
                                    <div className={`hidden md:flex w-10 h-10 rounded-lg shrink-0 items-center justify-center overflow-hidden ${isFullBleed ? 'p-0' : 'bg-white p-1.5'}`}>
                                        <img
                                            src={ms.logo}
                                            alt={ms.company || 'Company'}
                                            className={`w-full h-full ${isFullBleed ? 'object-cover scale-105' : 'object-contain'}`}
                                        />
                                    </div>
                                );
                            })()}
                            <div>
                                <h4 className={`text-base md:text-lg font-bold flex flex-wrap items-center gap-2 ${ms.achieved ? 'text-white' : isNextContainer ? 'text-blue-400' : 'text-gray-400'}`}>
                                    {ms.isNext && !ms.achieved ? 'Próximo Hito: ' : ''}{ms.label}

                                    {/* Badges */}
                                    {ms.tier === 'epic' && ms.achieved && <span className="bg-yellow-400/20 text-yellow-400 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold border border-yellow-400/30">Épico</span>}
                                    {ms.tier === 'special' && ms.achieved && <span className="bg-purple-400/20 text-purple-400 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold border border-purple-400/30">Especial</span>}
                                    {ms.isEnd && <span className="text-gray-400 text-xs font-normal">Etapa Completada</span>}
                                </h4>
                                {view === 'general' && ms.company && (
                                    <p className="text-sm text-primary">{ms.company}</p>
                                )}
                            </div>
                        </div>

                        {/* Right Side: Date / Days Left */}
                        <div className="flex flex-col items-end gap-2">
                            <div className={`flex items-center gap-2 text-sm font-mono px-3 py-1.5 rounded-lg w-fit ${isNextContainer ? 'bg-blue-400/10 text-blue-400 border border-blue-400/20' : 'text-muted-foreground bg-black/40 border border-white/5'}`}>
                                <Clock size={14} />
                                {format(ms.date, "dd MMM yyyy", { locale: es })}
                            </div>
                            {isNextContainer && (
                                <div className="text-xs font-bold text-blue-400 flex flex-col items-end w-full">
                                    Faltan {daysLeft} días
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
            {/* View Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center bg-white/5 border border-white/10 p-2 text-sm font-medium rounded-2xl gap-2 shadow-xl">
                <div className="flex bg-black/40 rounded-xl p-1 w-full md:w-auto">
                    <button
                        onClick={() => setView('company')}
                        className={`flex-1 md:flex-none px-6 py-2 rounded-lg transition-all ${view === 'company' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:text-white'}`}
                    >
                        Por Empresa
                    </button>
                    <button
                        onClick={() => setView('general')}
                        className={`flex-1 md:flex-none px-6 py-2 rounded-lg transition-all ${view === 'general' ? 'bg-primary text-white shadow-lg' : 'text-muted-foreground hover:text-white'}`}
                    >
                        Historial General
                    </button>
                </div>

                <div className="flex items-center gap-4 px-2 mb-2 md:mb-0 w-full md:w-auto justify-between md:justify-end">
                    {view === 'general' && (
                        <div className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                            <Trophy size={14} className="text-yellow-400" />
                            {generalMilestones.filter((m: any) => m.achieved).length}/{generalMilestones.length} Hitos Globales
                        </div>
                    )}
                    <button
                        onClick={() => setIsInfoOpen(true)}
                        className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
                        title="Ver información de hitos"
                    >
                        <Info size={16} />
                    </button>
                </div>
            </div>

            {/* List Views */}
            {view === 'general' ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                        <div className="p-4 md:p-6 border-b border-white/5 flex items-center gap-3">
                            <Star className="text-primary" size={20} />
                            <h3 className="text-lg md:text-xl font-bold text-white">Historial General de Carrera</h3>
                        </div>
                        <div className="p-6 md:p-8 bg-black/30">
                            {generalMilestones.map((ms: any, i: number) => renderMilestone(ms, i, generalMilestones.length))}
                        </div>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    {experiences.map((exp) => {
                        const msList = companyMilestones[exp.id] || [];
                        const achievedCount = msList.filter((m: any) => m.achieved).length;
                        const isExpanded = expandedCompany === exp.id;
                        const isFullBleed = exp.id === 'alsea' || exp.id === 'timestamp' || exp.id === 'inetum';
                        const theme = COMPANY_THEMES[exp.id] || COMPANY_THEMES.sapas;

                        return (
                            <div
                                key={exp.id}
                                className={`relative overflow-hidden bg-white/[0.03] border border-white/10 rounded-2xl shadow-xl transition-all duration-500 group backdrop-blur-xl ${theme.borderHover} ${isExpanded ? 'ring-1 ' + theme.borderDefault : ''}`}
                            >
                                {/* Animated Ambient Color Mesh Blobs */}
                                <motion.div
                                    animate={{
                                        x: [0, 25, -20, 0],
                                        y: [0, -20, 15, 0],
                                        scale: [1, 1.15, 0.95, 1],
                                        opacity: [0.2, 0.45, 0.25, 0.2]
                                    }}
                                    transition={{
                                        duration: 8,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className={`absolute -top-20 -left-20 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-opacity ${theme.blob1}`}
                                />
                                <motion.div
                                    animate={{
                                        x: [0, -20, 25, 0],
                                        y: [0, 20, -15, 0],
                                        scale: [1, 1.2, 0.9, 1],
                                        opacity: [0.15, 0.4, 0.2, 0.15]
                                    }}
                                    transition={{
                                        duration: 10,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: 1
                                    }}
                                    className={`absolute -bottom-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-opacity ${theme.blob2}`}
                                />
                                <motion.div
                                    animate={{
                                        opacity: [0.15, 0.3, 0.15]
                                    }}
                                    transition={{
                                        duration: 7,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className={`absolute inset-0 bg-gradient-to-br pointer-events-none ${theme.gradientBg}`}
                                />

                                {/* Interfaz Empresa */}
                                <div
                                    className="relative z-10 p-4 md:p-6 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-white/5 transition-colors"
                                    onClick={() => setExpandedCompany(isExpanded ? null : exp.id)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-lg shrink-0 flex items-center justify-center overflow-hidden shadow-lg ring-1 ring-white/10 ${isFullBleed ? 'p-0' : 'bg-white p-1.5'}`}>
                                            <img
                                                src={exp.logo}
                                                alt={exp.company}
                                                className={`w-full h-full ${isFullBleed ? 'object-cover scale-105' : 'object-contain'}`}
                                            />
                                        </div>
                                        <div>
                                            <h3 className={`text-xl font-bold text-white transition-colors ${theme.accentText}`}>{exp.company}</h3>
                                            <p className="text-sm text-muted-foreground">{exp.role}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 w-full md:w-auto mt-2 md:mt-0">
                                        <div className="flex-1 md:flex-none">
                                            <div className="text-[10px] md:text-xs text-muted-foreground mb-1 flex justify-between uppercase font-bold tracking-wider">
                                                <span>Progreso</span>
                                                <span className="font-mono text-white">{achievedCount}/{msList.length}</span>
                                            </div>
                                            <div className="h-1.5 w-full md:w-32 bg-white/10 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(achievedCount / msList.length) * 100}%` }}
                                                    className={`h-full bg-gradient-to-r ${theme.progressBar}`}
                                                />
                                            </div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                                            <ChevronDown className={`text-muted-foreground transition-transform duration-300 ${isExpanded ? 'rotate-180 text-white' : ''}`} size={16} />
                                        </div>
                                    </div>
                                </div>

                                {/* Hitos Expandidos */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden bg-black/30"
                                        >
                                            <div className="p-6 md:p-8 border-t border-white/10">
                                                {msList.map((ms: any, i: number) => renderMilestone(ms, i, msList.length))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )
                    })}
                </motion.div>
            )}

            {/* Info Modal */}
            <AnimatePresence>
                {isInfoOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setIsInfoOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Info className="text-primary" size={24} />
                                    Sistema de Hitos
                                </h3>
                                <button
                                    onClick={() => setIsInfoOpen(false)}
                                    className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-muted-foreground hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 md:p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                <div className="space-y-4">
                                    <div className="flex gap-4 items-start">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center border text-yellow-400 bg-yellow-400/20 border-yellow-400/50 shadow-[0_0_15px_rgba(250,204,21,0.3)] shrink-0">
                                            <Trophy size={20} className="drop-shadow-[0_0_8px_currentColor]" />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-yellow-400 flex items-center gap-2">Hitos Épicos</h4>
                                            <p className="text-sm text-muted-foreground mt-1">Los logros más altos y difíciles de conseguir en la carrera profesional.</p>
                                            <ul className="text-sm text-gray-300 mt-2 list-disc list-inside space-y-1">
                                                <li>Cada Año cumplido (1 Año, 2 Años, 3 Años...).</li>
                                                <li>Cada 500 Días (500, 1000, 1500...).</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex gap-4 items-start">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center border text-purple-400 bg-purple-400/20 border-purple-400/50 shadow-[0_0_10px_rgba(192,132,252,0.2)] shrink-0">
                                            <Star size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-purple-400 flex items-center gap-2">Hitos Especiales</h4>
                                            <p className="text-sm text-muted-foreground mt-1">Logros importantes a medio e intermedio plazo.</p>
                                            <ul className="text-sm text-gray-300 mt-2 list-disc list-inside space-y-1">
                                                <li>Cada 100 Días exactos (100 Días, 200 Días...).</li>
                                                <li>Trimestres importantes (3 Meses, 6 Meses).</li>
                                                <li>Finalización de una Etapa Profesional.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex gap-4 items-start">
                                        <div className="w-12 h-12 rounded-full flex items-center justify-center border text-primary bg-primary/20 border-primary/50 shrink-0">
                                            <Briefcase size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-primary flex items-center gap-2">Hitos Comunes</h4>
                                            <p className="text-sm text-muted-foreground mt-1">Metas tempranas para celebrar la constancia.</p>
                                            <ul className="text-sm text-gray-300 mt-2 list-disc list-inside space-y-1">
                                                <li>Primer Día.</li>
                                                <li>10 Días, 25 Días, 50 Días.</li>
                                                <li>1er Mes de vida laboral.</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
