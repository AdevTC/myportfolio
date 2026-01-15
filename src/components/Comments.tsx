"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare, Send, Quote, Loader2, CheckCircle2, ShieldCheck, Filter, ChevronDown, User, Heart, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, updateDoc, doc, increment } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { z } from "zod";
// ...
import { useFloatingComponents } from "@/context/FloatingComponentContext";

const CATEGORIES = ["General", "Proyectos", "Diseño", "Funcionalidad", "Sugerencia"];

const SORTS = [
    { label: "Más Recientes", value: "newest" },
    { label: "Más Antiguos", value: "oldest" },
    { label: "Más Gustados", value: "likes" },
    { label: "Mejor Valorados", value: "rating" },
];

interface Comment {
    id: string;
    name: string;
    surname1: string;
    surname2?: string;
    email?: string;
    category: string;
    message: string;
    rating: number;
    isPublic: boolean;
    likes: number;
    createdAt: any;
}

export default function Comments() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    // Removed showModal state and form state
    const { toggleWidget } = useFloatingComponents();

    // Filters & Sort
    const [activeCategory, setActiveCategory] = useState("Todos");
    const [sortBy, setSortBy] = useState("newest");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Removed form state and handlers (handleSubmit, etc)

    useEffect(() => {
        // ... (keep fetch logic)
        const q = query(
            collection(db, "comments"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() } as Comment));
            setComments(fetched);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSort = (items: Comment[]) => {
        // ... (keep sort logic)
        const sorted = [...items];
        switch (sortBy) {
            case "newest": return sorted.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
            case "oldest": return sorted.sort((a, b) => (a.createdAt?.toMillis() || 0) - (b.createdAt?.toMillis() || 0));
            case "likes": return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
            case "rating": return sorted.sort((a, b) => b.rating - a.rating);
            default: return sorted;
        }
    };

    const handleLike = async (id: string) => {
        // ... (keep like logic)
        const ref = doc(db, "comments", id);
        updateDoc(ref, {
            likes: increment(1)
        }).catch(console.error);
    };

    const formatName = (name: string, surname1: string, surname2?: string) => {
        const n = name.split(" ")[0];
        const s1 = surname1.charAt(0).toUpperCase() + ".";
        const s2 = surname2 ? surname2.charAt(0).toUpperCase() + "." : "";
        return `${n} ${s1}${s2}`;
    };

    const getStats = () => {
        const total = comments.length;
        const avg = total ? (comments.reduce((acc, c) => acc + c.rating, 0) / total).toFixed(1) : "0.0";
        const happy = comments.filter(c => c.rating >= 4).length;
        return { total, avg, happy };
    };

    const stats = getStats();
    const filtered = comments.filter(c => activeCategory === "Todos" || c.category === activeCategory);
    const displayedComments = handleSort(filtered);

    // Removed inputClasses and labelClasses

    return (
        <section className="py-24 px-6 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">

                {/* Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-bold mb-4">El Muro de la Comunidad</h2>
                    <p className="text-muted-foreground text-lg">Tu opinión importa. Comparte tu experiencia y ayuda a mejorar este espacio.</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    {/* ... (keep stats cards) */}
                    <div className="bg-white/5 border border-white/5 p-8 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <MessageSquare size={64} />
                        </div>
                        <span className="text-4xl font-bold text-white mb-2">{stats.total}</span>
                        <span className="text-sm text-zinc-400 flex items-center gap-2 uppercase tracking-wider font-bold">
                            <MessageSquare size={16} className="text-blue-500" /> Comentarios
                        </span>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-8 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Star size={64} />
                        </div>
                        <span className="text-4xl font-bold text-yellow-500 mb-2">{stats.avg}</span>
                        <span className="text-sm text-zinc-400 flex items-center gap-2 uppercase tracking-wider font-bold">
                            <Star size={16} className="text-yellow-500" /> Nota Media
                        </span>
                    </div>
                    <div className="bg-white/5 border border-white/5 p-8 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Heart size={64} />
                        </div>
                        <span className="text-4xl font-bold text-red-500 mb-2">{stats.happy}</span>
                        <span className="text-sm text-zinc-400 flex items-center gap-2 uppercase tracking-wider font-bold">
                            <Heart size={16} className="text-red-500" /> Usuarios Felices
                        </span>
                    </div>
                </div>

                {/* Controls Bar */}
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 mb-12 backdrop-blur-sm relative z-40">
                    <button
                        onClick={() => toggleWidget("comments")}
                        className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2 w-full md:w-auto justify-center shadow-lg shadow-primary/20"
                    >
                        <MessageSquare size={20} />
                        Dejar Comentario
                    </button>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        {/* Filter Dropdown */}
                        <div className="relative z-50 w-full sm:w-48">
                            <button
                                onClick={() => {
                                    setIsFilterOpen(!isFilterOpen);
                                    setIsSortOpen(false);
                                }}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl font-medium flex items-center justify-between text-zinc-300 hover:text-white transition-colors"
                            >
                                <span className="flex items-center gap-2 truncate"><Filter size={16} /> {activeCategory}</span>
                                <ChevronDown size={16} className={`transition-transform duration-300 ${isFilterOpen ? "rotate-180" : ""}`} />
                            </button>

                            <AnimatePresence>
                                {isFilterOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 top-full mt-2 w-full bg-[#0f121b] border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl"
                                    >
                                        {["Todos", ...CATEGORIES].map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => {
                                                    setActiveCategory(cat);
                                                    setIsFilterOpen(false);
                                                }}
                                                className={cn(
                                                    "w-full text-left px-4 py-3 hover:bg-white/5 transition-colors text-sm border-b border-white/5 last:border-0",
                                                    activeCategory === cat ? "text-primary font-bold bg-primary/5" : "text-zinc-300 hover:text-white"
                                                )}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative z-50 w-full sm:w-48">
                            <button
                                onClick={() => {
                                    setIsSortOpen(!isSortOpen);
                                    setIsFilterOpen(false);
                                }}
                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl font-medium flex items-center justify-between text-zinc-300 hover:text-white transition-colors"
                            >
                                <span className="truncate">{SORTS.find(s => s.value === sortBy)?.label}</span>
                                <ChevronDown size={16} className={`transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`} />
                            </button>

                            <AnimatePresence>
                                {isSortOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute right-0 top-full mt-2 w-full bg-[#0f121b] border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-xl"
                                    >
                                        {SORTS.map((s) => (
                                            <button
                                                key={s.value}
                                                onClick={() => {
                                                    setSortBy(s.value);
                                                    setIsSortOpen(false);
                                                }}
                                                className={cn(
                                                    "w-full text-left px-4 py-3 hover:bg-white/5 transition-colors text-sm border-b border-white/5 last:border-0",
                                                    sortBy === s.value ? "text-primary font-bold bg-primary/5" : "text-zinc-300 hover:text-white"
                                                )}
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Comments Listing - Masonry / Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="animate-spin text-zinc-500" size={40} />
                    </div>
                ) : displayedComments.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-white/5 rounded-3xl bg-white/5">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 shadow-inner">
                            <MessageSquare className="text-zinc-700" size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-zinc-300 mb-2">Aún no hay mensajes</h3>
                        <p className="text-zinc-500 max-w-md">Sé el primero en compartir tu opinión en esta categoría. ¡Tu feedback es muy valioso!</p>
                        <button
                            onClick={() => toggleWidget("comments")}
                            className="mt-8 px-6 py-2 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors text-sm font-bold"
                        >
                            Escribir Ahora
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedComments.map((comment, i) => (
                            <CommentItem key={comment.id} comment={comment} index={i} handleLike={handleLike} formatName={formatName} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

// ... StarRating (local only for display if needed? No, CommentItem needs it)
// We need to keep StarRating and CommentItem as they are used for displaying the list.
// The form was moved, so we don't need imports related to form inputs like Send, CheckCircle2 mostly.
// But we keep what is used.

function StarRating({ rating }: { rating: number }) {
    // ... (keep implementation)
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => {
                const fill = Math.min(Math.max(rating - (star - 1), 0), 1) * 100;

                return (
                    <div key={star} className="relative">
                        <Star size={16} className="text-zinc-700" />
                        <div
                            className="absolute top-0 left-0 overflow-hidden"
                            style={{ width: `${fill}%` }}
                        >
                            <Star size={16} className="text-yellow-500 fill-yellow-500" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

function CommentItem({ comment, index, handleLike, formatName }: { comment: Comment, index: number, handleLike: (id: string) => void, formatName: any }) {
    // ... (keep implementation)
    const [isExpanded, setIsExpanded] = useState(false);
    const isLong = comment.message.length > 140;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="break-inside-avoid bg-white/5 border border-white/5 p-6 rounded-3xl hover:border-primary/20 transition-all duration-300 group relative flex flex-col h-full"
        >
            {/* ... keep content ... */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white font-bold text-sm">
                        {comment.name.charAt(0)}
                    </div>
                    <div>
                        <h4 className="font-bold text-zinc-200 text-sm flex items-center gap-1">
                            {formatName(comment.name, comment.surname1, comment.surname2)}
                            {comment.email && (
                                <span title="Verificado">
                                    <ShieldCheck size={14} className="text-blue-500" />
                                </span>
                            )}
                        </h4>
                        <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">{comment.category}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <StarRating rating={comment.rating} />
                    <span className="text-[10px] font-bold text-yellow-500 bg-yellow-500/10 px-1.5 py-0.5 rounded ml-2">
                        {comment.rating.toFixed(2)}
                    </span>
                </div>
            </div>

            <div className="flex-grow mb-4 relative">
                <p
                    className={cn(
                        "text-zinc-300 text-sm leading-relaxed transition-all",
                        !isExpanded ? "line-clamp-3" : ""
                    )}
                    style={{ minHeight: '4.5em' }}
                >
                    "{comment.message}"
                </p>
                {isLong && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-xs font-bold text-primary mt-1 hover:underline focus:outline-none"
                    >
                        {isExpanded ? "Ver menos" : "Ver más"}
                    </button>
                )}
            </div>

            <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                <span className="text-[10px] text-zinc-600">
                    {comment.createdAt?.toDate ? comment.createdAt.toDate().toLocaleDateString() : 'Reciente'}
                </span>

                <button
                    onClick={() => handleLike(comment.id)}
                    className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-red-500 transition-colors group/like"
                >
                    <Heart size={14} className={`group-hover/like:fill-red-500 ${comment.likes > 0 ? 'text-red-500' : ''}`} />
                    <span className="font-medium">{comment.likes || 0}</span>
                </button>
            </div>
        </motion.div>
    );
}
