"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameDay,
    isSameMonth,
    addMonths,
    subMonths,
    addYears,
    subYears,
    isWeekend,
    isToday,
    differenceInCalendarDays,
    setMonth,
    setYear
} from "date-fns";
import { es } from "date-fns/locale";
import {
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Calendar as CalendarIcon,
    Briefcase,
    MapPin,
    Sparkles,
    Flag,
    CheckCircle2,
    Building2,
    Clock,
    Layers,
    RotateCcw,
    Zap,
    ExternalLink,
    Filter,
    ArrowRight,
    Coffee,
    Shield,
    Check,
    Globe,
    Hourglass,
    Play,
    Pause,
    Share2,
    Link2,
    Command,
    Keyboard
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface CalendarExperienceItem {
    id: string;
    company: string;
    logo: string;
    startDate: string;
    endDate?: string;
    role: string;
    workMode: string;
    tech?: string[];
    url?: string;
    description?: string;
}

interface ExperienceCalendarProps {
    experiences: CalendarExperienceItem[];
    totalWorkedDays?: number;
    onNavigateToTimeline?: (companyId: string) => void;
}

const CAREER_START = new Date("2023-09-18T00:00:00");
const TIMELINE_MIN = new Date("2023-09-01T00:00:00");
const CURRENT_YEAR = new Date().getFullYear();
const TIMELINE_MAX = new Date(Math.max(2026, CURRENT_YEAR), 11, 31, 23, 59, 59);
const TOTAL_TIMELINE_DAYS = differenceInCalendarDays(TIMELINE_MAX, TIMELINE_MIN);

const COMPANY_THEMES: Record<string, {
    borderHover: string;
    borderDefault: string;
    gradientBg: string;
    blob1: string;
    blob2: string;
    cellBg: string;
    cellHover: string;
    accentText: string;
    badgeBg: string;
    dotColor: string;
    trackColor: string;
    glowShadow: string;
    keyHighlight: string;
}> = {
    alsea: {
        borderHover: "hover:border-blue-500/70 hover:shadow-[0_0_25px_rgba(37,99,235,0.25)]",
        borderDefault: "border-blue-500/30",
        gradientBg: "from-blue-950/40 via-[#0d1c3a]/30 to-indigo-950/40",
        blob1: "bg-blue-600/25",
        blob2: "bg-indigo-500/20",
        cellBg: "bg-blue-950/30 border-blue-500/25",
        cellHover: "hover:bg-blue-900/40 hover:border-blue-400/60",
        accentText: "text-blue-400",
        badgeBg: "bg-blue-500/15 text-blue-300 border-blue-500/30",
        dotColor: "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]",
        trackColor: "from-blue-600 to-indigo-600",
        glowShadow: "rgba(37,99,235,0.2)",
        keyHighlight: "Responsable Área BTP & Migraciones Oracle"
    },
    sapas: {
        borderHover: "hover:border-white/70 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]",
        borderDefault: "border-white/25",
        gradientBg: "from-neutral-900/60 via-[#18181b]/50 to-zinc-900/60",
        blob1: "bg-white/15",
        blob2: "bg-slate-200/10",
        cellBg: "bg-white/[0.04] border-white/20",
        cellHover: "hover:bg-white/[0.12] hover:border-white/60",
        accentText: "text-gray-100",
        badgeBg: "bg-white/15 text-white border-white/25",
        dotColor: "bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]",
        trackColor: "from-gray-100 to-slate-400",
        glowShadow: "rgba(255,255,255,0.15)",
        keyHighlight: "Integraciones Sanitarias HL7 & SAP CAP"
    },
    timestamp: {
        borderHover: "hover:border-red-500/70 hover:shadow-[0_0_25px_rgba(239,68,68,0.25)]",
        borderDefault: "border-red-500/30",
        gradientBg: "from-red-950/40 via-[#2a0e14]/30 to-rose-950/40",
        blob1: "bg-red-600/25",
        blob2: "bg-rose-500/20",
        cellBg: "bg-red-950/30 border-red-500/25",
        cellHover: "hover:bg-red-900/40 hover:border-red-400/60",
        accentText: "text-rose-400",
        badgeBg: "bg-red-500/15 text-red-300 border-red-500/30",
        dotColor: "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]",
        trackColor: "from-red-600 to-rose-600",
        glowShadow: "rgba(239,68,68,0.2)",
        keyHighlight: "SuccessFactors & Groovy Scripts Avanzados"
    },
    inetum: {
        borderHover: "hover:border-teal-500/70 hover:shadow-[0_0_25px_rgba(13,148,136,0.25)]",
        borderDefault: "border-teal-500/30",
        gradientBg: "from-teal-950/40 via-[#0a2324]/30 to-cyan-950/40",
        blob1: "bg-teal-500/25",
        blob2: "bg-emerald-500/20",
        cellBg: "bg-teal-950/30 border-teal-500/25",
        cellHover: "hover:bg-teal-900/40 hover:border-teal-400/60",
        accentText: "text-teal-400",
        badgeBg: "bg-teal-500/15 text-teal-300 border-teal-500/30",
        dotColor: "bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]",
        trackColor: "from-teal-500 to-emerald-600",
        glowShadow: "rgba(13,148,136,0.2)",
        keyHighlight: "Consultoría SAP PI/PO & Fundamentos Cloud"
    }
};

// Multi-company transition month styling helper (for split gradients)
function getMonthTransitionStyle(companyIds: string[], isAllFutureMonth: boolean) {
    if (companyIds.length === 0) {
        return "bg-white/[0.02] border-white/10";
    }

    if (isAllFutureMonth) {
        return "bg-white/[0.02] border-dashed border-white/15 text-muted-foreground opacity-60 hover:opacity-100 hover:border-white/30";
    }

    if (companyIds.length === 1) {
        const id = companyIds[0];
        const theme = COMPANY_THEMES[id] || COMPANY_THEMES.sapas;
        return `${theme.cellBg} hover:border-white/40`;
    }

    // 2 or more companies in the same month -> Blended corporate gradient!
    const [c1, c2] = companyIds;
    
    // Inetum (Teal) + Timestamp (Red)
    if ((c1 === 'inetum' && c2 === 'timestamp') || (c1 === 'timestamp' && c2 === 'inetum')) {
        return "bg-gradient-to-br from-teal-950/50 via-[#220f1c]/40 to-red-950/50 border-teal-500/40 hover:border-red-400/60 shadow-[0_0_15px_rgba(13,148,136,0.15)]";
    }
    // Timestamp (Red) + Sapas (White)
    if ((c1 === 'timestamp' && c2 === 'sapas') || (c1 === 'sapas' && c2 === 'timestamp')) {
        return "bg-gradient-to-br from-red-950/50 via-[#261820]/40 to-zinc-900/60 border-red-500/40 hover:border-white/60 shadow-[0_0_15px_rgba(239,68,68,0.15)]";
    }
    // Sapas (White) + Alsea (Blue)
    if ((c1 === 'sapas' && c2 === 'alsea') || (c1 === 'alsea' && c2 === 'sapas')) {
        return "bg-gradient-to-br from-zinc-900/60 via-[#101b33]/40 to-blue-950/50 border-white/30 hover:border-blue-400/60 shadow-[0_0_15px_rgba(59,130,246,0.15)]";
    }

    return "bg-gradient-to-br from-white/10 to-primary/10 border-white/20";
}

const KEY_MILESTONES = [
    { label: "Inicio Inetum", date: new Date("2023-09-18T00:00:00"), expId: "inetum" },
    { label: "Inicio Timestamp", date: new Date("2025-05-12T00:00:00"), expId: "timestamp" },
    { label: "Inicio Sapas", date: new Date("2025-07-07T00:00:00"), expId: "sapas" },
    { label: "Inicio Alsea", date: new Date("2026-09-14T00:00:00"), expId: "alsea" },
];

const MONTH_NAMES = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Dynamic years generation up to max(2026, currentYear)
const getDynamicYears = () => {
    const currentYr = new Date().getFullYear();
    const maxYr = Math.max(2026, currentYr);
    return Array.from({ length: maxYr - 2023 + 1 }, (_, i) => 2023 + i);
};

export default function ExperienceCalendar({ experiences, totalWorkedDays: propTotalWorkedDays, onNavigateToTimeline }: ExperienceCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState<Date>(() => new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(() => new Date());
    const [companyFilter, setCompanyFilter] = useState<string>("all");
    const [viewMode, setViewMode] = useState<"monthly" | "yearly" | "total">("monthly");
    
    // Playback (Time Travel) state
    const [isPlaying, setIsPlaying] = useState(false);

    // Share link copied toast state
    const [isLinkCopied, setIsLinkCopied] = useState(false);

    // Dynamic available years
    const availableYears = useMemo(() => getDynamicYears(), []);

    // Real-time Today boundary (00:00:00 for day matching)
    const today = useMemo(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }, []);

    // Custom Dropdown Menus Open State
    const [isMonthOpen, setIsMonthOpen] = useState(false);
    const [isYearOpen, setIsYearOpen] = useState(false);
    const [isCompanyFilterOpen, setIsCompanyFilterOpen] = useState(false);

    // Dropdown container refs for outside click handling
    const monthDropdownRef = useRef<HTMLDivElement>(null);
    const yearDropdownRef = useRef<HTMLDivElement>(null);
    const companyDropdownRef = useRef<HTMLDivElement>(null);

    // Timeline hover state for preview tooltip
    const [timelineHover, setTimelineHover] = useState<{
        x: number;
        percent: number;
        date: Date;
        expMatch: any;
    } | null>(null);

    const timelineBarRef = useRef<HTMLDivElement>(null);

    // Navigation helpers
    const handlePrev = useCallback(() => {
        if (viewMode === "yearly") {
            setCurrentMonth(prev => subYears(prev, 1));
        } else {
            setCurrentMonth(prev => subMonths(prev, 1));
        }
    }, [viewMode]);

    const handleNext = useCallback(() => {
        if (viewMode === "yearly") {
            setCurrentMonth(prev => addYears(prev, 1));
        } else {
            setCurrentMonth(prev => addMonths(prev, 1));
        }
    }, [viewMode]);

    const handleMonthSelect = (mIdx: number) => {
        setCurrentMonth(prev => setMonth(prev, mIdx));
        setIsMonthOpen(false);
    };

    const handleYearSelect = (yr: number) => {
        setCurrentMonth(prev => setYear(prev, yr));
        setIsYearOpen(false);
    };

    // 1. 🎬 PLAYBACK / TIMELAPSE ENGINE
    const handlePlayToggle = useCallback(() => {
        if (isPlaying) {
            setIsPlaying(false);
        } else {
            // If already at or beyond today or in total view, restart from career start
            if (currentMonth >= today || viewMode === "total") {
                setCurrentMonth(new Date("2023-09-01T00:00:00"));
                setSelectedDate(new Date("2023-09-18T00:00:00"));
            }
            setViewMode("monthly");
            setIsPlaying(true);
        }
    }, [isPlaying, currentMonth, today, viewMode]);

    useEffect(() => {
        if (!isPlaying) return;

        const interval = setInterval(() => {
            setCurrentMonth(prev => {
                const nextMonth = addMonths(prev, 1);
                // If reaches today or beyond timeline max, stop
                if (nextMonth > today || nextMonth > TIMELINE_MAX) {
                    setIsPlaying(false);
                    return prev;
                }
                return nextMonth;
            });
        }, 650);

        return () => clearInterval(interval);
    }, [isPlaying, today]);

    // 5. 🔗 DEEP LINKING (Read on mount & Copy link)
    useEffect(() => {
        if (typeof window === "undefined") return;
        const params = new URLSearchParams(window.location.search);
        const urlMonth = params.get("cal_m");
        const urlView = params.get("cal_v");
        const urlComp = params.get("cal_c");

        if (urlMonth && !isNaN(Date.parse(urlMonth))) {
            setCurrentMonth(new Date(urlMonth));
            setSelectedDate(new Date(urlMonth));
        }
        if (urlView === "monthly" || urlView === "yearly" || urlView === "total") {
            setViewMode(urlView);
        }
        if (urlComp && (urlComp === "all" || experiences.some(e => e.id === urlComp))) {
            setCompanyFilter(urlComp);
        }
    }, [experiences]);

    // Sync state to URL params seamlessly
    useEffect(() => {
        if (typeof window === "undefined") return;
        const params = new URLSearchParams(window.location.search);
        params.set("cal_m", format(currentMonth, "yyyy-MM"));
        params.set("cal_v", viewMode);
        if (companyFilter !== "all") {
            params.set("cal_c", companyFilter);
        } else {
            params.delete("cal_c");
        }
        const newUrl = `${window.location.pathname}?${params.toString()}#experience`;
        window.history.replaceState({}, "", newUrl);
    }, [currentMonth, viewMode, companyFilter]);

    const handleCopyShareLink = () => {
        if (typeof window === "undefined") return;
        navigator.clipboard.writeText(window.location.href);
        setIsLinkCopied(true);
        setTimeout(() => setIsLinkCopied(false), 2500);
    };

    // 4. ⌨️ KEYBOARD SHORTCUTS
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if typing in an input
            const target = e.target as HTMLElement;
            if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT")) {
                return;
            }

            if (e.key === "ArrowLeft") {
                e.preventDefault();
                handlePrev();
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                handleNext();
            } else if (e.key === "1") {
                setViewMode("monthly");
            } else if (e.key === "2") {
                setViewMode("yearly");
            } else if (e.key === "3") {
                setViewMode("total");
            } else if (e.key === "h" || e.key === "H" || e.key === "Home") {
                const now = new Date();
                setCurrentMonth(now);
                setSelectedDate(now);
                setViewMode("monthly");
            } else if (e.key === " " && !e.repeat) {
                e.preventDefault();
                handlePlayToggle();
            } else if (e.key === "c" || e.key === "C") {
                if (!e.ctrlKey && !e.metaKey) {
                    handleCopyShareLink();
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handlePrev, handleNext, handlePlayToggle]);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
                setIsMonthOpen(false);
            }
            if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target as Node)) {
                setIsYearOpen(false);
            }
            if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target as Node)) {
                setIsCompanyFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Helper: Match a date with its corresponding experience & future check
    const getDayExperience = (date: Date) => {
        const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const isFutureDay = d > today;

        for (const exp of experiences) {
            const start = new Date(exp.startDate);
            const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
            const end = exp.endDate ? new Date(exp.endDate) : null;
            const endDay = end ? new Date(end.getFullYear(), end.getMonth(), end.getDate()) : null;

            if (endDay) {
                if (d >= startDay && d <= endDay) {
                    const isStart = isSameDay(d, startDay);
                    const isEnd = isSameDay(d, endDay);
                    const dayOfExp = differenceInCalendarDays(d, startDay) + 1;
                    const totalDaysExp = differenceInCalendarDays(endDay, startDay) + 1;
                    const careerDay = d >= CAREER_START ? differenceInCalendarDays(d, CAREER_START) + 1 : 0;

                    return {
                        exp,
                        isStart,
                        isEnd,
                        dayOfExp,
                        totalDaysExp,
                        careerDay,
                        isFutureDay,
                        isCompleted: !isFutureDay
                    };
                }
            } else {
                if (d >= startDay) {
                    const isStart = isSameDay(d, startDay);
                    const dayOfExp = differenceInCalendarDays(d, startDay) + 1;
                    const careerDay = d >= CAREER_START ? differenceInCalendarDays(d, CAREER_START) + 1 : 0;

                    return {
                        exp,
                        isStart,
                        isEnd: false,
                        dayOfExp,
                        totalDaysExp: null,
                        careerDay,
                        isFutureDay,
                        isOngoing: !isFutureDay
                    };
                }
            }
        }
        return null;
    };

    // Calendar grid dates for current viewed month
    const calendarDays = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

        return eachDayOfInterval({ start: startDate, end: endDate });
    }, [currentMonth]);

    // Active companies in viewed month
    const activeCompaniesInMonth = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
        const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

        const set = new Set<string>();
        days.forEach(day => {
            const match = getDayExperience(day);
            if (match) set.add(match.exp.id);
        });

        return Array.from(set).map(id => experiences.find(e => e.id === id)).filter(Boolean) as CalendarExperienceItem[];
    }, [currentMonth, experiences]);

    // Summary stats for viewed month (Distinguishing worked days vs future planned days)
    const monthStats = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
        const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

        let totalWorkedDays = 0;
        let workDaysOnly = 0;
        let weekendsOnly = 0;
        let futurePlannedDays = 0;

        days.forEach(day => {
            const match = getDayExperience(day);
            if (match) {
                if (match.isFutureDay) {
                    futurePlannedDays++;
                } else {
                    totalWorkedDays++;
                    if (isWeekend(day)) {
                        weekendsOnly++;
                    } else {
                        workDaysOnly++;
                    }
                }
            }
        });

        const percentWorked = days.length > 0 ? (totalWorkedDays / days.length) * 100 : 0;

        return {
            totalWorkedDays,
            workDaysOnly,
            weekendsOnly,
            futurePlannedDays,
            totalDaysInMonth: days.length,
            percentWorked
        };
    }, [currentMonth, experiences]);

    // Total Career Overview Stats (Synchronized with global header stats)
    const totalCareerStats = useMemo(() => {
        let totalWorked = propTotalWorkedDays;
        if (totalWorked === undefined) {
            const totalMs = experiences.reduce((acc, exp) => {
                const startDate = new Date(exp.startDate);
                const now = new Date();
                if (startDate > now) return acc;
                const endDate = exp.endDate ? new Date(exp.endDate) : now;
                const effectiveEnd = endDate > now ? now : endDate;
                const ms = Math.max(0, effectiveEnd.getTime() - startDate.getTime());
                return acc + ms;
            }, 0);
            totalWorked = Math.round(totalMs / (1000 * 60 * 60 * 24));
        }

        let futurePlanned = 0;
        availableYears.forEach(yr => {
            const yStart = startOfYear(new Date(yr, 0, 1));
            const yEnd = endOfYear(new Date(yr, 0, 1));
            const days = eachDayOfInterval({ start: yStart, end: yEnd });
            days.forEach(d => {
                const match = getDayExperience(d);
                if (match && match.isFutureDay) {
                    futurePlanned++;
                }
            });
        });

        const startedCompanies = experiences.filter(exp => new Date(exp.startDate) <= today).length;

        return {
            totalWorkedDays: totalWorked,
            futurePlannedDays: futurePlanned,
            totalYears: availableYears.length,
            totalCompanies: experiences.length,
            startedCompanies
        };
    }, [experiences, availableYears, today, propTotalWorkedDays]);

    // Selected day detailed data
    const selectedDayData = useMemo(() => {
        if (!selectedDate) return null;
        const match = getDayExperience(selectedDate);
        return {
            date: selectedDate,
            match,
            isWknd: isWeekend(selectedDate)
        };
    }, [selectedDate, experiences]);

    // Timeline background company segments
    const timelineSegments = useMemo(() => {
        return experiences.map(exp => {
            const start = new Date(exp.startDate);
            const end = exp.endDate ? new Date(exp.endDate) : TIMELINE_MAX;

            const startDaysFromMin = Math.max(0, differenceInCalendarDays(start, TIMELINE_MIN));
            const endDaysFromMin = Math.min(TOTAL_TIMELINE_DAYS, differenceInCalendarDays(end, TIMELINE_MIN));

            const leftPercent = (startDaysFromMin / TOTAL_TIMELINE_DAYS) * 100;
            const widthPercent = Math.max(1.5, ((endDaysFromMin - startDaysFromMin) / TOTAL_TIMELINE_DAYS) * 100);
            const isEntirelyFuture = start > today;

            return {
                exp,
                leftPercent,
                widthPercent,
                theme: COMPANY_THEMES[exp.id] || COMPANY_THEMES.sapas,
                start,
                end,
                isEntirelyFuture
            };
        });
    }, [experiences, today]);

    // Active Timeline Window & Selected Day Indicator
    const activeTimelineRange = useMemo(() => {
        let rangeStart: Date;
        let rangeEnd: Date;

        if (viewMode === "total") {
            rangeStart = TIMELINE_MIN;
            rangeEnd = TIMELINE_MAX;
        } else if (viewMode === "yearly") {
            rangeStart = startOfYear(currentMonth);
            rangeEnd = endOfYear(currentMonth);
        } else {
            rangeStart = startOfMonth(currentMonth);
            rangeEnd = endOfMonth(currentMonth);
        }

        const clampedStart = rangeStart < TIMELINE_MIN ? TIMELINE_MIN : rangeStart;
        const clampedEnd = rangeEnd > TIMELINE_MAX ? TIMELINE_MAX : rangeEnd;

        const startDays = Math.max(0, differenceInCalendarDays(clampedStart, TIMELINE_MIN));
        const endDays = Math.min(TOTAL_TIMELINE_DAYS, differenceInCalendarDays(clampedEnd, TIMELINE_MIN));

        const leftPercent = (startDays / TOTAL_TIMELINE_DAYS) * 100;
        const widthPercent = Math.max(1.2, ((endDays - startDays) / TOTAL_TIMELINE_DAYS) * 100);

        let selectedDayPercent: number | null = null;
        if (selectedDate && viewMode === "monthly") {
            const dayDays = differenceInCalendarDays(selectedDate, TIMELINE_MIN);
            if (dayDays >= 0 && dayDays <= TOTAL_TIMELINE_DAYS) {
                selectedDayPercent = (dayDays / TOTAL_TIMELINE_DAYS) * 100;
            }
        }

        return {
            leftPercent,
            widthPercent,
            selectedDayPercent
        };
    }, [currentMonth, selectedDate, viewMode]);

    // Timeline Hover & Click Handlers
    const handleTimelineMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!timelineBarRef.current) return;
        const rect = timelineBarRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = Math.min(1, Math.max(0, clickX / rect.width));

        const targetDays = Math.round(percent * TOTAL_TIMELINE_DAYS);
        const hoveredDate = new Date(TIMELINE_MIN.getTime() + targetDays * 24 * 60 * 60 * 1000);
        const expMatch = getDayExperience(hoveredDate);

        setTimelineHover({
            x: clickX,
            percent: percent * 100,
            date: hoveredDate,
            expMatch
        });
    };

    const handleTimelineMouseLeave = () => {
        setTimelineHover(null);
    };

    const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!timelineBarRef.current) return;
        const rect = timelineBarRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = Math.min(1, Math.max(0, clickX / rect.width));

        const targetDays = Math.round(percent * TOTAL_TIMELINE_DAYS);
        const clickedDate = new Date(TIMELINE_MIN.getTime() + targetDays * 24 * 60 * 60 * 1000);

        setCurrentMonth(clickedDate);
        setSelectedDate(clickedDate);
    };

    const selectedFilterCompany = experiences.find(e => e.id === companyFilter);

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-in pb-12">
            
            {/* 1. TOP HEADER CONTROLS */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-xl space-y-6 relative z-30">
                
                {/* Main Navigation Bar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    
                    {/* Left: Navigation / Dropdowns / Playback */}
                    <div className="flex items-center gap-2.5 flex-wrap">
                        {/* Step Arrows (Hidden in Total View) */}
                        {viewMode !== "total" && (
                            <div className="flex items-center bg-black/40 border border-white/10 rounded-xl p-1 shadow-inner">
                                <button
                                    onClick={handlePrev}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
                                    title={viewMode === "yearly" ? "Año anterior (←)" : "Mes anterior (←)"}
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
                                    title={viewMode === "yearly" ? "Año siguiente (→)" : "Mes siguiente (→)"}
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        )}

                        {/* Custom Month Dropdown Menu (Only in Monthly Mode) */}
                        {viewMode === "monthly" && (
                            <div className="relative" ref={monthDropdownRef}>
                                <button
                                    onClick={() => {
                                        setIsMonthOpen(!isMonthOpen);
                                        setIsYearOpen(false);
                                        setIsCompanyFilterOpen(false);
                                    }}
                                    className="flex items-center gap-2 bg-black/50 border border-white/10 hover:border-primary/60 px-3.5 py-2 rounded-xl text-white font-bold text-sm md:text-base transition-all shadow-inner hover:shadow-[0_0_15px_rgba(234,88,12,0.2)] group"
                                >
                                    <CalendarIcon size={16} className="text-primary group-hover:scale-110 transition-transform" />
                                    <span className="capitalize">{MONTH_NAMES[currentMonth.getMonth()]}</span>
                                    <ChevronDown
                                        size={14}
                                        className={cn("text-muted-foreground transition-transform duration-300", isMonthOpen ? "rotate-180 text-primary" : "")}
                                    />
                                </button>

                                <AnimatePresence>
                                    {isMonthOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute top-full left-0 mt-2 z-50 min-w-[280px] p-2 bg-[#090d16]/95 border border-white/15 rounded-2xl shadow-2xl backdrop-blur-2xl ring-1 ring-black/60 grid grid-cols-3 gap-1.5"
                                        >
                                            {MONTH_NAMES.map((name, i) => {
                                                const isCurrent = currentMonth.getMonth() === i;
                                                return (
                                                    <button
                                                        key={i}
                                                        onClick={() => handleMonthSelect(i)}
                                                        className={cn(
                                                            "px-2 py-2 rounded-xl text-xs font-semibold text-center transition-all capitalize",
                                                            isCurrent
                                                                ? "bg-primary text-white shadow-md font-bold ring-1 ring-white/30"
                                                                : "text-gray-300 hover:text-white hover:bg-white/10"
                                                        )}
                                                    >
                                                        {name}
                                                    </button>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Custom Year Dropdown Menu (Monthly & Yearly Modes) */}
                        {viewMode !== "total" && (
                            <div className="relative" ref={yearDropdownRef}>
                                <button
                                    onClick={() => {
                                        setIsYearOpen(!isYearOpen);
                                        setIsMonthOpen(false);
                                        setIsCompanyFilterOpen(false);
                                    }}
                                    className="flex items-center gap-2 bg-black/50 border border-white/10 hover:border-primary/60 px-3.5 py-2 rounded-xl text-white font-bold font-mono text-sm md:text-base transition-all shadow-inner hover:shadow-[0_0_15px_rgba(234,88,12,0.2)] group"
                                >
                                    {viewMode === "yearly" && <CalendarIcon size={16} className="text-primary group-hover:scale-110 transition-transform" />}
                                    <span>{currentMonth.getFullYear()}</span>
                                    <ChevronDown
                                        size={14}
                                        className={cn("text-muted-foreground transition-transform duration-300", isYearOpen ? "rotate-180 text-primary" : "")}
                                    />
                                </button>

                                <AnimatePresence>
                                    {isYearOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                            transition={{ duration: 0.15 }}
                                            className="absolute top-full left-0 mt-2 z-50 min-w-[130px] p-1.5 bg-[#090d16]/95 border border-white/15 rounded-2xl shadow-2xl backdrop-blur-2xl ring-1 ring-black/60 space-y-1"
                                        >
                                            {availableYears.map(yr => {
                                                const isCurrent = currentMonth.getFullYear() === yr;
                                                return (
                                                    <button
                                                        key={yr}
                                                        onClick={() => handleYearSelect(yr)}
                                                        className={cn(
                                                            "w-full px-3 py-2 rounded-xl text-xs font-mono font-semibold flex items-center justify-between transition-all",
                                                            isCurrent
                                                                ? "bg-primary text-white shadow-md font-bold"
                                                                : "text-gray-300 hover:text-white hover:bg-white/10"
                                                        )}
                                                    >
                                                        <span>{yr}</span>
                                                        {isCurrent && <Check size={14} />}
                                                    </button>
                                                );
                                            })}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Title in Total View */}
                        {viewMode === "total" && (
                            <div className="flex items-center gap-2.5 bg-black/40 border border-white/10 px-3.5 py-2 rounded-xl">
                                <Globe size={16} className="text-primary" />
                                <span className="text-white font-bold text-sm md:text-base">
                                    Histórico Completo (2023 - {availableYears[availableYears.length - 1]})
                                </span>
                            </div>
                        )}

                        {/* Quick "Hoy" Button */}
                        <button
                            onClick={() => {
                                const now = new Date();
                                setCurrentMonth(now);
                                setSelectedDate(now);
                                if (viewMode === "total") setViewMode("monthly");
                            }}
                            className="text-xs font-medium flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
                            title="Ir a Hoy (Atajo: H)"
                        >
                            <RotateCcw size={12} />
                            <span>Hoy</span>
                        </button>

                        {/* 1. 🎬 PLAYBACK / TIMELAPSE BUTTON */}
                        <button
                            onClick={handlePlayToggle}
                            className={cn(
                                "text-xs font-bold flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all shadow-md",
                                isPlaying
                                    ? "bg-primary text-white ring-2 ring-primary/60 animate-pulse"
                                    : "bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 hover:text-white"
                            )}
                            title="Reproducir avance de carrera mes a mes (Atajo: Espacio)"
                        >
                            {isPlaying ? (
                                <>
                                    <Pause size={13} fill="currentColor" />
                                    <span>Pausar</span>
                                </>
                            ) : (
                                <>
                                    <Play size={13} fill="currentColor" />
                                    <span className="hidden sm:inline">Reproducir</span>
                                </>
                            )}
                        </button>

                        {/* 5. 🔗 COPY SHARE LINK BUTTON */}
                        <button
                            onClick={handleCopyShareLink}
                            className="text-xs font-medium flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-colors"
                            title="Copiar enlace a esta vista (Atajo: C)"
                        >
                            {isLinkCopied ? (
                                <>
                                    <Check size={13} className="text-emerald-400" />
                                    <span className="text-emerald-400 font-bold">¡Copiado!</span>
                                </>
                            ) : (
                                <>
                                    <Link2 size={13} />
                                    <span className="hidden sm:inline">Compartir</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Right: Custom Company Filter Dropdown & View Mode Switcher */}
                    <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                        
                        {/* Custom Company Filter Dropdown */}
                        <div className="relative" ref={companyDropdownRef}>
                            <button
                                onClick={() => {
                                    setIsCompanyFilterOpen(!isCompanyFilterOpen);
                                    setIsMonthOpen(false);
                                    setIsYearOpen(false);
                                }}
                                className="flex items-center gap-2 bg-black/50 border border-white/10 hover:border-white/30 px-3.5 py-2 rounded-xl text-xs md:text-sm font-semibold text-white transition-all shadow-inner"
                            >
                                <Filter size={14} className="text-muted-foreground" />
                                {companyFilter === "all" ? (
                                    <span>Todas las empresas</span>
                                ) : (
                                    <div className="flex items-center gap-1.5">
                                        <div className={cn(
                                            "w-4 h-4 rounded overflow-hidden shadow-sm",
                                            (selectedFilterCompany?.id === 'alsea' || selectedFilterCompany?.id === 'timestamp' || selectedFilterCompany?.id === 'inetum') ? "p-0" : "bg-white p-0.5"
                                        )}>
                                            <img src={selectedFilterCompany?.logo} alt={selectedFilterCompany?.company} className="w-full h-full object-cover" />
                                        </div>
                                        <span>{selectedFilterCompany?.company}</span>
                                    </div>
                                )}
                                <ChevronDown
                                    size={12}
                                    className={cn("text-muted-foreground transition-transform duration-300", isCompanyFilterOpen ? "rotate-180 text-white" : "")}
                                />
                            </button>

                            <AnimatePresence>
                                {isCompanyFilterOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute top-full right-0 mt-2 z-50 min-w-[220px] p-1.5 bg-[#090d16]/95 border border-white/15 rounded-2xl shadow-2xl backdrop-blur-2xl ring-1 ring-black/60 space-y-1"
                                    >
                                        <button
                                            onClick={() => {
                                                setCompanyFilter("all");
                                                setIsCompanyFilterOpen(false);
                                            }}
                                            className={cn(
                                                "w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all",
                                                companyFilter === "all"
                                                    ? "bg-white/15 text-white font-bold border border-white/20"
                                                    : "text-gray-300 hover:text-white hover:bg-white/10"
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-white/60" />
                                                <span>Todas las empresas</span>
                                            </div>
                                            {companyFilter === "all" && <Check size={14} />}
                                        </button>

                                        {experiences.map(exp => {
                                            const isSelected = companyFilter === exp.id;
                                            const theme = COMPANY_THEMES[exp.id];
                                            const isFullBleed = exp.id === 'alsea' || exp.id === 'timestamp' || exp.id === 'inetum';

                                            return (
                                                <button
                                                    key={exp.id}
                                                    onClick={() => {
                                                        setCompanyFilter(exp.id);
                                                        setIsCompanyFilterOpen(false);
                                                    }}
                                                    className={cn(
                                                        "w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all",
                                                        isSelected
                                                            ? `${theme?.badgeBg} font-bold ring-1 ring-white/30`
                                                            : "text-gray-300 hover:text-white hover:bg-white/10"
                                                    )}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className={cn(
                                                            "w-4 h-4 rounded overflow-hidden shadow-sm",
                                                            isFullBleed ? "p-0" : "bg-white p-0.5"
                                                        )}>
                                                            <img src={exp.logo} alt={exp.company} className="w-full h-full object-cover" />
                                                        </div>
                                                        <span>{exp.company}</span>
                                                    </div>
                                                    {isSelected && <Check size={14} />}
                                                </button>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* View Mode Toggle: Mensual / Anual / Total */}
                        <div className="flex bg-black/40 border border-white/10 rounded-xl p-1 shrink-0">
                            <button
                                onClick={() => setViewMode("monthly")}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                                    viewMode === "monthly"
                                        ? "bg-primary text-white shadow-md font-bold"
                                        : "text-muted-foreground hover:text-white"
                                )}
                                title="Vista Mensual (Atajo: 1)"
                            >
                                Mensual
                            </button>
                            <button
                                onClick={() => setViewMode("yearly")}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                                    viewMode === "yearly"
                                        ? "bg-primary text-white shadow-md font-bold"
                                        : "text-muted-foreground hover:text-white"
                                )}
                                title="Vista Anual (Atajo: 2)"
                            >
                                Anual
                            </button>
                            <button
                                onClick={() => setViewMode("total")}
                                className={cn(
                                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                                    viewMode === "total"
                                        ? "bg-primary text-white shadow-md font-bold"
                                        : "text-muted-foreground hover:text-white"
                                )}
                                title="Vista Histórico Total (Atajo: 3)"
                            >
                                Total
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. 🎚️ LÍNEA DE TIEMPO INTERACTIVA */}
                <div className="pt-2 border-t border-white/5 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1.5 font-semibold text-gray-300">
                            <Sparkles size={13} className="text-primary" />
                            Línea de Tiempo de Carrera (Pasa el cursor o haz clic para explorar)
                        </span>
                        <span className="font-mono text-white/60">
                            {format(TIMELINE_MIN, "MMM yyyy")} ➔ {format(TIMELINE_MAX, "MMM yyyy")}
                        </span>
                    </div>

                    {/* Timeline Interactive Bar */}
                    <div className="relative">
                        <div
                            ref={timelineBarRef}
                            onClick={handleTimelineClick}
                            onMouseMove={handleTimelineMouseMove}
                            onMouseLeave={handleTimelineMouseLeave}
                            className="relative h-11 bg-black/60 border border-white/10 rounded-xl overflow-hidden cursor-pointer group shadow-inner select-none"
                        >
                            {/* Company Segments */}
                            {timelineSegments.map(({ exp, leftPercent, widthPercent, theme, isEntirelyFuture }) => {
                                const isSelectedInFilter = companyFilter === "all" || companyFilter === exp.id;
                                const isFullBleed = exp.id === 'alsea' || exp.id === 'timestamp' || exp.id === 'inetum';

                                return (
                                    <div
                                        key={exp.id}
                                        style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
                                        className={cn(
                                            "absolute top-0 bottom-0 flex items-center justify-center border-r border-black/40 transition-all duration-300",
                                            isEntirelyFuture
                                                ? "bg-slate-900/80 border-dashed border-white/20"
                                                : `bg-gradient-to-r ${theme.trackColor}`,
                                            isSelectedInFilter
                                                ? isEntirelyFuture ? "opacity-60 hover:opacity-90" : "opacity-85 hover:opacity-100"
                                                : "opacity-20"
                                        )}
                                    >
                                        <div className="flex items-center gap-1.5 px-2 truncate pointer-events-none">
                                            <div className={cn(
                                                "w-4 h-4 rounded shrink-0 overflow-hidden shadow",
                                                isFullBleed ? "p-0" : "bg-white p-0.5",
                                                isEntirelyFuture ? "opacity-70" : ""
                                            )}>
                                                <img src={exp.logo} alt={exp.company} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="text-[10px] font-bold text-white drop-shadow truncate hidden sm:inline">
                                                {exp.company}
                                                {isEntirelyFuture && " (Próx.)"}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Milestone Pins along timeline (Only Starts) */}
                            {KEY_MILESTONES.map((km, idx) => {
                                const kmDays = differenceInCalendarDays(km.date, TIMELINE_MIN);
                                const kmPct = (kmDays / TOTAL_TIMELINE_DAYS) * 100;
                                const isMilestoneFuture = km.date > today;

                                return (
                                    <div
                                        key={idx}
                                        style={{ left: `${kmPct}%` }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setCurrentMonth(km.date);
                                            setSelectedDate(km.date);
                                        }}
                                        className="absolute top-0 bottom-0 w-0.5 bg-white/70 hover:w-1 hover:bg-white z-20 cursor-pointer group/pin"
                                        title={`${km.label}${isMilestoneFuture ? ' (Planificado)' : ''}`}
                                    >
                                        <div className={cn(
                                            "absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full border border-black shadow",
                                            isMilestoneFuture ? "bg-amber-300 shadow-[0_0_6px_rgba(251,191,36,0.8)]" : "bg-white shadow-[0_0_6px_white]"
                                        )} />
                                    </div>
                                );
                            })}

                            {/* DYNAMIC ACTIVE TIME WINDOW */}
                            <motion.div
                                animate={{
                                    left: `${activeTimelineRange.leftPercent}%`,
                                    width: `${activeTimelineRange.widthPercent}%`
                                }}
                                transition={{ type: "spring", stiffness: 350, damping: 32 }}
                                className="absolute top-0 bottom-0 z-30 pointer-events-none rounded-lg bg-amber-400/25 border-2 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.6)] backdrop-brightness-125"
                            >
                                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-4 rounded-full bg-amber-400 border border-black shadow" />
                                <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-4 rounded-full bg-amber-400 border border-black shadow" />
                            </motion.div>

                            {/* SPECIFIC SELECTED DAY PINPOINT (in monthly mode) */}
                            {activeTimelineRange.selectedDayPercent !== null && viewMode === "monthly" && (
                                <motion.div
                                    animate={{ left: `${activeTimelineRange.selectedDayPercent}%` }}
                                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    className="absolute top-0 bottom-0 w-0.5 bg-white z-40 pointer-events-none shadow-[0_0_8px_white]"
                                >
                                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 border-amber-500 shadow-md" />
                                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border-2 border-amber-500 shadow-md" />
                                </motion.div>
                            )}
                        </div>

                        {/* Interactive Floating Hover Tooltip */}
                        <AnimatePresence>
                            {timelineHover && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 5 }}
                                    style={{ left: `${timelineHover.percent}%` }}
                                    className="absolute -top-12 -translate-x-1/2 pointer-events-none z-50 whitespace-nowrap"
                                >
                                    <div className="bg-black/90 border border-white/20 px-2.5 py-1 rounded-lg shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs">
                                        <span className="font-bold text-white capitalize font-mono">
                                            {format(timelineHover.date, "MMM yyyy", { locale: es })}
                                        </span>
                                        {timelineHover.expMatch ? (
                                            <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-bold", COMPANY_THEMES[timelineHover.expMatch.exp.id]?.badgeBg)}>
                                                {timelineHover.expMatch.exp.company}
                                                {timelineHover.expMatch.isFutureDay && " (Próx.)"}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-[10px]">Transición</span>
                                        )}
                                    </div>
                                    <div className="w-2 h-2 bg-black/90 border-r border-b border-white/20 transform rotate-45 mx-auto -mt-1" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Milestone Quick Jump Chips */}
                    <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 text-xs">
                        <span className="text-[11px] text-muted-foreground shrink-0 font-medium mr-1">Saltar a:</span>
                        {KEY_MILESTONES.map((km, i) => {
                            const theme = COMPANY_THEMES[km.expId];
                            const isViewing = isSameMonth(currentMonth, km.date);

                            return (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setCurrentMonth(km.date);
                                        setSelectedDate(km.date);
                                        if (viewMode === "total") setViewMode("monthly");
                                    }}
                                    className={cn(
                                        "px-2.5 py-0.5 rounded-full text-[11px] shrink-0 transition-all border flex items-center gap-1.5",
                                        isViewing && viewMode === "monthly"
                                            ? `${theme.badgeBg} ring-1 ring-white/30 font-bold`
                                            : "bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
                                    )}
                                >
                                    <span className={cn("w-1.5 h-1.5 rounded-full", theme.dotColor)} />
                                    <span>{km.label}</span>
                                    <span className="text-[10px] font-mono opacity-60">({format(km.date, "MMM yy")})</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 3. MONTHLY VIEW */}
            {viewMode === "monthly" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left: Main Calendar Grid (2 Cols) */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-xl overflow-hidden">
                            
                            {/* Weekday Headers */}
                            <div className="grid grid-cols-7 gap-2 mb-3 text-center">
                                {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d, i) => (
                                    <div
                                        key={d}
                                        className={cn(
                                            "text-xs font-bold uppercase tracking-wider py-1.5 rounded-lg",
                                            i >= 5 ? "text-muted-foreground/60 bg-white/[0.02]" : "text-gray-300 bg-white/5"
                                        )}
                                    >
                                        {d}
                                    </div>
                                ))}
                            </div>

                            {/* Days Grid */}
                            <div className="grid grid-cols-7 gap-2">
                                {calendarDays.map((day, idx) => {
                                    const isCurMonth = isSameMonth(day, currentMonth);
                                    const match = getDayExperience(day);
                                    const isDaySelected = selectedDate && isSameDay(day, selectedDate);
                                    const isDayToday = isToday(day);
                                    const isWknd = isWeekend(day);
                                    const isFiltered = companyFilter !== "all" && match && match.exp.id !== companyFilter;
                                    const isDimmed = !isCurMonth || isFiltered;
                                    const isFutureDay = match ? match.isFutureDay : day > today;

                                    const theme = match ? COMPANY_THEMES[match.exp.id] : null;
                                    const isFullBleed = match ? (match.exp.id === 'alsea' || match.exp.id === 'timestamp' || match.exp.id === 'inetum') : false;

                                    return (
                                        <motion.div
                                            key={idx}
                                            whileHover={{ scale: 1.03, zIndex: 20 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setSelectedDate(day)}
                                            className={cn(
                                                "relative min-h-[75px] md:min-h-[90px] p-2 rounded-xl border flex flex-col justify-between cursor-pointer transition-all duration-200 group overflow-hidden",
                                                isDimmed ? "opacity-25 bg-transparent border-white/5" : "bg-white/[0.03] border-white/10",
                                                match && !isDimmed
                                                    ? isFutureDay
                                                        ? "border-dashed border-white/20 bg-white/[0.02] hover:border-white/40 hover:bg-white/[0.06]"
                                                        : `${theme?.cellBg} ${theme?.cellHover}`
                                                    : "hover:border-white/30 hover:bg-white/10",
                                                isWknd && match && !isDimmed && !isFutureDay ? "opacity-85" : "",
                                                isDaySelected ? "ring-2 ring-primary border-primary shadow-[0_0_20px_rgba(234,88,12,0.35)] scale-[1.02] z-10" : "",
                                                isDayToday ? "border-amber-400/80 shadow-[0_0_15px_rgba(251,191,36,0.3)] ring-1 ring-amber-400" : ""
                                            )}
                                        >
                                            {/* Glow blob (only for past/current worked days) */}
                                            {match && !isDimmed && !isFutureDay && (
                                                <div className={cn(
                                                    "absolute -bottom-6 -right-6 w-16 h-16 rounded-full blur-xl pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity",
                                                    theme?.dotColor
                                                )} />
                                            )}

                                            {/* Top: Day Number & Indicators */}
                                            <div className="flex items-center justify-between z-10">
                                                <span className={cn(
                                                    "text-xs md:text-sm font-bold font-mono",
                                                    isDayToday ? "text-amber-400 font-extrabold" : isCurMonth ? (isFutureDay ? "text-gray-400 font-medium" : "text-white") : "text-gray-500",
                                                    match && !isDimmed && !isFutureDay ? theme?.accentText : ""
                                                )}>
                                                    {format(day, "d")}
                                                </span>

                                                {match && !isDimmed && (
                                                    <div>
                                                        {match.isStart && (
                                                            <span className={cn(
                                                                "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border flex items-center gap-0.5 shadow-sm",
                                                                isFutureDay
                                                                    ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
                                                                    : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                                            )}>
                                                                <Flag size={9} />
                                                                <span className="hidden sm:inline">{isFutureDay ? "Próx." : "Inicio"}</span>
                                                            </span>
                                                        )}
                                                        {match.isEnd && (
                                                            <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-0.5 shadow-sm">
                                                                <CheckCircle2 size={9} />
                                                                <span className="hidden sm:inline">Fin</span>
                                                            </span>
                                                        )}
                                                        {isDayToday && !match.isStart && !match.isEnd && (
                                                            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,1)]" title="Hoy" />
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Bottom: Company Logo & Day Count */}
                                            {match && !isDimmed && (
                                                <div className="flex items-end justify-between gap-1 z-10 mt-1">
                                                    <div className={cn(
                                                        "w-6 h-6 md:w-7 md:h-7 rounded-lg shrink-0 flex items-center justify-center overflow-hidden shadow-md group-hover:scale-110 transition-transform ring-1 ring-white/20",
                                                        isFullBleed ? "p-0" : "bg-white p-0.5",
                                                        isFutureDay ? "opacity-50 grayscale hover:grayscale-0 hover:opacity-90" : ""
                                                    )}>
                                                        <img
                                                            src={match.exp.logo}
                                                            alt={match.exp.company}
                                                            className={cn(
                                                                "w-full h-full",
                                                                isFullBleed ? "object-cover scale-105" : "object-contain"
                                                            )}
                                                        />
                                                    </div>

                                                    <div className="text-right">
                                                        {isFutureDay ? (
                                                            <span className="text-[8px] font-mono text-gray-500 block leading-tight">
                                                                Planif.
                                                            </span>
                                                        ) : (
                                                            <span className="text-[9px] md:text-[10px] font-mono text-muted-foreground group-hover:text-white transition-colors block leading-tight">
                                                                d#{match.dayOfExp}
                                                            </span>
                                                        )}
                                                        {isWknd && (
                                                            <span className="text-[8px] text-white/40 block leading-tight">
                                                                Finde
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {!match && isWknd && isCurMonth && (
                                                <div className="text-[9px] text-muted-foreground/40 text-right z-10">
                                                    Fin sem.
                                                </div>
                                            )}
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Month Stats Bar */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
                            <div className="flex items-center gap-3 text-muted-foreground flex-wrap">
                                <div className="flex items-center gap-1.5">
                                    <Clock size={15} className="text-primary" />
                                    <span>
                                        Jornadas: <strong className="text-primary font-mono text-sm">{monthStats.workDaysOnly} laborables</strong>
                                        {monthStats.weekendsOnly > 0 && (
                                            <span className="text-muted-foreground font-mono"> + {monthStats.weekendsOnly} fin de sem.</span>
                                        )}
                                        {monthStats.futurePlannedDays > 0 && (
                                            <span className="text-amber-400/80 font-mono"> ({monthStats.futurePlannedDays} planificadas)</span>
                                        )}
                                    </span>
                                </div>
                                <span className="text-white/20 hidden sm:inline">|</span>
                                <span className="text-muted-foreground">
                                    Total: <strong className="text-white font-mono">{monthStats.totalWorkedDays} días completados ({monthStats.percentWorked.toFixed(0)}%)</strong>
                                </span>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Empresas:</span>
                                {activeCompaniesInMonth.length > 0 ? (
                                    activeCompaniesInMonth.map(exp => (
                                        <span key={exp.id} className={cn("px-2 py-0.5 rounded text-[11px] font-bold border", COMPANY_THEMES[exp.id]?.badgeBg)}>
                                            {exp.company}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-400 italic">Transición</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Day Inspector Panel */}
                    <div className="space-y-6">
                        <AnimatePresence mode="wait">
                            {selectedDayData && (
                                <motion.div
                                    key={selectedDayData.date.toISOString()}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -15 }}
                                    transition={{ duration: 0.25 }}
                                    className={cn(
                                        "bg-white/5 border rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-6 relative overflow-hidden",
                                        selectedDayData.match
                                            ? selectedDayData.match.isFutureDay
                                                ? "border-dashed border-white/25 shadow-lg"
                                                : `${COMPANY_THEMES[selectedDayData.match.exp.id]?.borderDefault} shadow-xl`
                                            : "border-white/10"
                                    )}
                                >
                                    {selectedDayData.match && !selectedDayData.match.isFutureDay && (
                                        <div className={cn(
                                            "absolute -top-20 -right-20 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-30",
                                            COMPANY_THEMES[selectedDayData.match.exp.id]?.blob1
                                        )} />
                                    )}

                                    {/* Date Header */}
                                    <div className="relative z-10 space-y-1 border-b border-white/10 pb-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                                                <CalendarIcon size={14} />
                                                Ficha del Día
                                            </span>
                                            <div className="flex items-center gap-2">
                                                {selectedDayData.match?.isFutureDay && (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-400/15 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                                                        <Hourglass size={10} />
                                                        Fecha Futura
                                                    </span>
                                                )}
                                                {selectedDayData.isWknd && (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white/5 text-gray-300 border border-white/10">
                                                        Fin de semana
                                                    </span>
                                                )}
                                                {isToday(selectedDayData.date) && (
                                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-400/20 text-amber-300 border border-amber-400/30">
                                                        Hoy
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <h4 className="text-xl font-bold text-white capitalize">
                                            {format(selectedDayData.date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                                        </h4>
                                    </div>

                                    {/* Company Details */}
                                    {selectedDayData.match ? (
                                        <div className="relative z-10 space-y-5">
                                            <div className="flex items-start gap-4">
                                                <div className={cn(
                                                    "w-14 h-14 rounded-xl shrink-0 flex items-center justify-center overflow-hidden shadow-xl ring-2 ring-white/10",
                                                    (selectedDayData.match.exp.id === 'alsea' || selectedDayData.match.exp.id === 'timestamp' || selectedDayData.match.exp.id === 'inetum')
                                                        ? "p-0"
                                                        : "bg-white p-2",
                                                    selectedDayData.match.isFutureDay ? "opacity-80" : ""
                                                )}>
                                                    <img
                                                        src={selectedDayData.match.exp.logo}
                                                        alt={selectedDayData.match.exp.company}
                                                        className={cn(
                                                            "w-full h-full",
                                                            (selectedDayData.match.exp.id === 'alsea' || selectedDayData.match.exp.id === 'timestamp' || selectedDayData.match.exp.id === 'inetum')
                                                                ? "object-cover scale-105"
                                                                : "object-contain"
                                                        )}
                                                    />
                                                </div>
                                                <div className="space-y-1 flex-1">
                                                    <div className="flex items-center justify-between">
                                                        <h5 className={cn("text-lg font-bold", COMPANY_THEMES[selectedDayData.match.exp.id]?.accentText)}>
                                                            {selectedDayData.match.exp.company}
                                                        </h5>
                                                        {selectedDayData.match.exp.url && (
                                                            <a
                                                                href={selectedDayData.match.exp.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-muted-foreground hover:text-white transition-colors"
                                                            >
                                                                <ExternalLink size={14} />
                                                            </a>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-300 font-medium line-clamp-1">
                                                        {selectedDayData.match.exp.role}
                                                    </p>
                                                    <p className="text-[11px] text-white/50 flex items-center gap-1">
                                                        <MapPin size={11} /> {selectedDayData.match.exp.workMode}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Key Responsibility Highlight */}
                                            <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex items-center gap-2 text-xs text-gray-300">
                                                <Shield size={14} className="text-primary shrink-0" />
                                                <span>{COMPANY_THEMES[selectedDayData.match.exp.id]?.keyHighlight}</span>
                                            </div>

                                            {/* Counters */}
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="bg-black/30 backdrop-blur-md rounded-xl p-3.5 border border-white/5 space-y-1">
                                                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                                        Día en Empresa
                                                    </span>
                                                    <p className="text-xl font-bold font-mono text-white">
                                                        #{selectedDayData.match.dayOfExp}
                                                        {selectedDayData.match.totalDaysExp && (
                                                            <span className="text-xs text-muted-foreground font-normal"> / {selectedDayData.match.totalDaysExp}</span>
                                                        )}
                                                    </p>
                                                </div>

                                                <div className="bg-black/30 backdrop-blur-md rounded-xl p-3.5 border border-white/5 space-y-1">
                                                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                                                        Día de Carrera
                                                    </span>
                                                    <p className="text-xl font-bold font-mono text-primary">
                                                        #{selectedDayData.match.careerDay}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Event Tags */}
                                            {(selectedDayData.match.isStart || selectedDayData.match.isEnd || selectedDayData.match.isFutureDay) && (
                                                <div className="space-y-2">
                                                    {selectedDayData.match.isStart && (
                                                        <div className={cn(
                                                            "rounded-xl p-3 flex items-center gap-2.5 text-xs font-semibold border",
                                                            selectedDayData.match.isFutureDay
                                                                ? "bg-amber-500/10 border-amber-500/30 text-amber-300"
                                                                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                                                        )}>
                                                            <Flag size={16} className="shrink-0" />
                                                            <span>
                                                                {selectedDayData.match.isFutureDay
                                                                    ? `Fecha planificada de inicio oficial en ${selectedDayData.match.exp.company}.`
                                                                    : `Primer día oficial en ${selectedDayData.match.exp.company}.`}
                                                            </span>
                                                        </div>
                                                    )}
                                                    {selectedDayData.match.isEnd && (
                                                        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 flex items-center gap-2.5 text-rose-300 text-xs font-semibold">
                                                            <CheckCircle2 size={16} className="text-rose-400 shrink-0" />
                                                            <span>Último día de etapa profesional en {selectedDayData.match.exp.company}.</span>
                                                        </div>
                                                    )}
                                                    {selectedDayData.match.isFutureDay && !selectedDayData.match.isStart && (
                                                        <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-2.5 text-gray-300 text-xs font-medium">
                                                            <Zap size={16} className="text-amber-400 shrink-0" />
                                                            <span>Esta fecha se irá rellenando automáticamente a medida que transcurra el tiempo.</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Tech Stack */}
                                            {selectedDayData.match.exp.tech && selectedDayData.match.exp.tech.length > 0 && (
                                                <div className="space-y-2 pt-2 border-t border-white/5">
                                                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1">
                                                        <Layers size={12} />
                                                        Stack Tecnológico en esta Etapa
                                                    </span>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {selectedDayData.match.exp.tech.slice(0, 8).map(t => (
                                                            <span key={t} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] text-gray-300">
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Quick Navigation to Timeline */}
                                            {onNavigateToTimeline && selectedDayData.match && (
                                                <button
                                                    onClick={() => onNavigateToTimeline(selectedDayData.match!.exp.id)}
                                                    className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors group/btn mt-2"
                                                >
                                                    <span>Ver detalles completos en Cronología</span>
                                                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform text-primary" />
                                                </button>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="relative z-10 py-8 text-center space-y-3">
                                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-muted-foreground">
                                                <Coffee size={20} className="text-amber-400/80" />
                                            </div>
                                            <p className="text-sm text-gray-300 font-medium">
                                                Día sin vinculación contractual activa
                                            </p>
                                            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                                                {selectedDayData.date < CAREER_START
                                                    ? "Fecha anterior al inicio de trayectoria en Inetum (18 Sep 2023)."
                                                    : "Periodo de fin de semana o descanso de transición entre etapas."}
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* 4. YEARLY OVERVIEW VIEW (12 Months Heatmap for 1 Year) */}
            {viewMode === "yearly" && (
                <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-xl space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
                            <div>
                                <h4 className="text-xl md:text-2xl font-bold text-white">
                                    Resumen Anual: {currentMonth.getFullYear()}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                    Haz clic en cualquier mes para abrir su cuadrícula detallada.
                                </p>
                            </div>
                        </div>

                        {/* 12 Months Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {Array.from({ length: 12 }).map((_, mIdx) => {
                                const mDate = setMonth(setYear(new Date(), currentMonth.getFullYear()), mIdx);
                                const mStart = startOfMonth(mDate);
                                const mEnd = endOfMonth(mDate);
                                const days = eachDayOfInterval({ start: mStart, end: mEnd });

                                const mCompanies = new Set<string>();
                                let isAllFutureMonth = true;

                                days.forEach(d => {
                                    const match = getDayExperience(d);
                                    if (match) {
                                        mCompanies.add(match.exp.id);
                                        if (!match.isFutureDay) isAllFutureMonth = false;
                                    }
                                });

                                const companyList = Array.from(mCompanies);
                                const isViewing = isSameMonth(currentMonth, mDate);
                                const monthStyle = getMonthTransitionStyle(companyList, isAllFutureMonth);

                                return (
                                    <div
                                        key={mIdx}
                                        onClick={() => {
                                            setCurrentMonth(mDate);
                                            setViewMode("monthly");
                                        }}
                                        className={cn(
                                            "border rounded-xl p-4 space-y-3 cursor-pointer transition-all duration-300 hover:scale-[1.02] group",
                                            monthStyle,
                                            isViewing ? "ring-2 ring-primary border-primary" : ""
                                        )}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold text-white capitalize group-hover:text-primary transition-colors">
                                                {format(mDate, "MMMM", { locale: es })}
                                            </span>
                                            {companyList.length > 0 && (
                                                <div className="flex -space-x-1.5">
                                                    {companyList.map(cid => {
                                                        const exp = experiences.find(e => e.id === cid);
                                                        if (!exp) return null;
                                                        const isFullBleed = cid === 'alsea' || cid === 'timestamp' || cid === 'inetum';

                                                        return (
                                                            <div
                                                                key={cid}
                                                                className={cn(
                                                                    "w-5 h-5 rounded-full overflow-hidden ring-1 ring-black shadow-sm",
                                                                    isFullBleed ? "p-0" : "bg-white p-0.5",
                                                                    isAllFutureMonth ? "opacity-60" : ""
                                                                )}
                                                                title={exp.company}
                                                            >
                                                                <img src={exp.logo} alt={exp.company} className="w-full h-full object-cover" />
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-7 gap-1">
                                            {days.map((d, dIdx) => {
                                                const match = getDayExperience(d);
                                                const theme = match ? COMPANY_THEMES[match.exp.id] : null;
                                                const isFutureDay = d > today;

                                                return (
                                                    <div
                                                        key={dIdx}
                                                        className={cn(
                                                            "w-full aspect-square rounded-[2px] transition-colors",
                                                            match
                                                                ? isFutureDay
                                                                    ? "bg-white/10 opacity-30 border border-white/5"
                                                                    : `${theme?.dotColor} opacity-80`
                                                                : "bg-white/5 opacity-30",
                                                            isToday(d) ? "ring-1 ring-amber-400" : ""
                                                        )}
                                                        title={`${format(d, "dd MMM yyyy")}: ${match ? match.exp.company + (isFutureDay ? ' (Planificado)' : '') : "Sin actividad"}`}
                                                    />
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* 5. TOTAL VIEW (All Career Compacted Year by Year) */}
            {viewMode === "total" && (
                <div className="space-y-6">
                    {/* Career Summary Header Card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-xl space-y-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
                            <div>
                                <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
                                    <Sparkles size={14} />
                                    <span>Trayectoria Completa</span>
                                </div>
                                <h4 className="text-2xl md:text-3xl font-bold text-white">
                                    Histórico Global de Carrera (2023 - {availableYears[availableYears.length - 1]})
                                </h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Visualización compactada año por año. Los días futuros permanecen en gris y se completan automáticamente con el paso del tiempo.
                                </p>
                            </div>

                            <div className="flex items-center gap-4 flex-wrap">
                                <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-center">
                                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Días Trabajados</span>
                                    <span className="text-xl font-bold font-mono text-primary">+{totalCareerStats.totalWorkedDays}</span>
                                </div>
                                <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-2 text-center">
                                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block">Empresas en Trayectoria</span>
                                    <span className="text-xl font-bold font-mono text-white">{totalCareerStats.totalCompanies}</span>
                                </div>
                            </div>
                        </div>

                        {/* Multi-Year Compact Rows */}
                        <div className="space-y-6">
                            {availableYears.map(yr => {
                                const yStart = startOfYear(new Date(yr, 0, 1));
                                const yEnd = endOfYear(new Date(yr, 0, 1));
                                const yearDays = eachDayOfInterval({ start: yStart, end: yEnd });

                                let yearWorkedDays = 0;
                                let yearFuturePlannedDays = 0;
                                const yearCompaniesSet = new Set<string>();

                                yearDays.forEach(d => {
                                    const match = getDayExperience(d);
                                    if (match) {
                                        yearCompaniesSet.add(match.exp.id);
                                        if (match.isFutureDay) {
                                            yearFuturePlannedDays++;
                                        } else {
                                            yearWorkedDays++;
                                        }
                                    }
                                });

                                const yearCompanies = Array.from(yearCompaniesSet)
                                    .map(cid => experiences.find(e => e.id === cid))
                                    .filter(Boolean) as CalendarExperienceItem[];

                                const yearMilestones = KEY_MILESTONES.filter(km => km.date.getFullYear() === yr);

                                return (
                                    <div
                                        key={yr}
                                        className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all space-y-4 group"
                                    >
                                        {/* Year Title Row */}
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => {
                                                        setCurrentMonth(new Date(yr, 0, 1));
                                                        setViewMode("yearly");
                                                    }}
                                                    className="text-2xl font-bold font-mono text-white group-hover:text-primary transition-colors flex items-center gap-1.5"
                                                    title={`Ver año ${yr} completo`}
                                                >
                                                    <span>{yr}</span>
                                                    <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                                </button>

                                                {/* Company Badges for that Year */}
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    {yearCompanies.map(exp => {
                                                        const theme = COMPANY_THEMES[exp.id];
                                                        const isFullBleed = exp.id === 'alsea' || exp.id === 'timestamp' || exp.id === 'inetum';
                                                        const isFutureExp = new Date(exp.startDate) > today;

                                                        return (
                                                            <div
                                                                key={exp.id}
                                                                className={cn(
                                                                    "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border",
                                                                    isFutureExp
                                                                        ? "bg-slate-900 border-dashed border-white/20 text-gray-300"
                                                                        : theme?.badgeBg
                                                                )}
                                                            >
                                                                <div className={cn(
                                                                    "w-3.5 h-3.5 rounded overflow-hidden",
                                                                    isFullBleed ? "p-0" : "bg-white p-0.5",
                                                                    isFutureExp ? "opacity-70" : ""
                                                                )}>
                                                                    <img src={exp.logo} alt={exp.company} className="w-full h-full object-cover" />
                                                                </div>
                                                                <span>{exp.company}</span>
                                                                {isFutureExp && <span className="text-[10px] text-amber-300 font-mono">(Próx.)</span>}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Worked Days in Year Counter */}
                                            <div className="text-xs font-mono text-muted-foreground flex items-center gap-3">
                                                {yearMilestones.map((ym, idx) => {
                                                    const isYmFuture = ym.date > today;
                                                    return (
                                                        <span key={idx} className={cn(
                                                            "font-sans font-bold flex items-center gap-1 px-2 py-0.5 rounded border text-xs",
                                                            isYmFuture
                                                                ? "bg-white/5 border-dashed border-white/20 text-gray-400"
                                                                : "bg-amber-400/10 border-amber-400/20 text-amber-300"
                                                        )}>
                                                            <Flag size={11} /> {ym.label} ({format(ym.date, "MMM")})
                                                        </span>
                                                    );
                                                })}
                                                <span className="text-white font-bold">
                                                    {yearWorkedDays} días completados
                                                    {yearFuturePlannedDays > 0 && (
                                                        <span className="text-muted-foreground font-normal"> (+{yearFuturePlannedDays} planificados)</span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        {/* 12 Months Horizontal Heatmap Blocks with Multi-Company Blended Gradients */}
                                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2">
                                            {Array.from({ length: 12 }).map((_, mIdx) => {
                                                const mDate = new Date(yr, mIdx, 1);
                                                const mStart = startOfMonth(mDate);
                                                const mEnd = endOfMonth(mDate);
                                                const daysInM = eachDayOfInterval({ start: mStart, end: mEnd });

                                                const mCompanies = new Set<string>();
                                                let isAllFutureMonth = true;

                                                daysInM.forEach(d => {
                                                    const match = getDayExperience(d);
                                                    if (match) {
                                                        mCompanies.add(match.exp.id);
                                                        if (!match.isFutureDay) isAllFutureMonth = false;
                                                    }
                                                });

                                                const companyList = Array.from(mCompanies);
                                                const isViewing = isSameMonth(currentMonth, mDate);
                                                const monthStyle = getMonthTransitionStyle(companyList, isAllFutureMonth);

                                                return (
                                                    <div
                                                        key={mIdx}
                                                        onClick={() => {
                                                            setCurrentMonth(mDate);
                                                            setViewMode("monthly");
                                                        }}
                                                        className={cn(
                                                            "p-2.5 rounded-xl border text-center cursor-pointer transition-all duration-200 hover:scale-105 group/month",
                                                            monthStyle,
                                                            isViewing ? "ring-2 ring-primary border-primary" : ""
                                                        )}
                                                        title={`Ver ${format(mDate, "MMMM yyyy", { locale: es })}`}
                                                    >
                                                        <span className="text-[11px] font-bold text-white block capitalize group-hover/month:text-primary transition-colors">
                                                            {format(mDate, "MMM", { locale: es })}
                                                        </span>

                                                        {/* Mini day dots in a compact row */}
                                                        <div className="grid grid-cols-7 gap-0.5 mt-2">
                                                            {daysInM.map((d, dIdx) => {
                                                                const match = getDayExperience(d);
                                                                const dTheme = match ? COMPANY_THEMES[match.exp.id] : null;
                                                                const isFutureDay = d > today;

                                                                return (
                                                                    <div
                                                                        key={dIdx}
                                                                        className={cn(
                                                                            "w-full aspect-square rounded-[2px] transition-colors",
                                                                            match
                                                                                ? isFutureDay
                                                                                    ? "bg-white/10 opacity-30 border border-white/5"
                                                                                    : `${dTheme?.dotColor} opacity-80`
                                                                                : "bg-white/5 opacity-30",
                                                                            isToday(d) ? "ring-1 ring-amber-400" : ""
                                                                        )}
                                                                        title={`${format(d, "dd MMM yyyy")}: ${match ? match.exp.company + (isFutureDay ? ' (Planificado)' : '') : "Sin actividad"}`}
                                                                    />
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* 4. ⌨️ FOOTER: KEYBOARD SHORTCUTS HINTS */}
            <div className="flex items-center justify-center gap-4 text-[11px] text-muted-foreground/60 flex-wrap pt-2 select-none">
                <div className="flex items-center gap-1.5">
                    <Keyboard size={13} className="text-primary/70" />
                    <span>Atajos:</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px] text-gray-300">← / → Mes</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px] text-gray-300">1 / 2 / 3 Vistas</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px] text-gray-300">Espacio Reproducir</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px] text-gray-300">H Hoy</span>
                    <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[10px] text-gray-300">C Compartir</span>
                </div>
            </div>
        </div>
    );
}
