"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare, Send, Quote, Loader2, CheckCircle2, ShieldCheck, Filter, ChevronDown, User, Heart, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, updateDoc, doc, increment } from "firebase/firestore";

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

const CATEGORIES = ["General", "Proyectos", "Diseño", "Funcionalidad", "Sugerencia"];
const SORTS = [
    { label: "Más Recientes", value: "newest" },
    { label: "Más Antiguos", value: "oldest" },
    { label: "Más Gustados", value: "likes" },
    { label: "Mejor Valorados", value: "rating" },
];

export default function Comments() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Filters & Sort
    const [activeCategory, setActiveCategory] = useState("Todos");
    const [sortBy, setSortBy] = useState("newest");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        surname1: "",
        surname2: "",
        email: "",
        category: "General",
        message: "",
        rating: 5,
        isPublic: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const q = query(
            collection(db, "comments"),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetched = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() } as Comment))
                .filter(c => c.isPublic);
            setComments(fetched);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSort = (items: Comment[]) => {
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
        // Optimistic update could be added here, but Firestore is fast enough usually
        const ref = doc(db, "comments", id);
        await updateDoc(ref, {
            likes: increment(1)
        });

        // Local storage check to prevent spamming could go here
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.surname1 || !formData.message) return;

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "comments"), {
                ...formData,
                likes: 0,
                createdAt: serverTimestamp()
            });
            setShowModal(false);
            setFormData({
                name: "",
                surname1: "",
                surname2: "",
                email: "",
                category: "General",
                message: "",
                rating: 5,
                isPublic: true
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
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

    const inputClasses = "w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors placeholder:text-zinc-600";
    const labelClasses = "text-sm font-medium text-zinc-400 mb-2 block";

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
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 mb-12 backdrop-blur-sm">
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all flex items-center gap-2 w-full md:w-auto justify-center shadow-lg shadow-primary/20"
                    >
                        <MessageSquare size={20} />
                        Dejar Comentario
                    </button>

                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        {/* Filter Dropdown */}
                        <div className="relative z-20 w-full sm:w-48">
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
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 top-full mt-2 w-full bg-[#0f121b] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-30"
                                    >
                                        {["Todos", ...CATEGORIES].map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => {
                                                    setActiveCategory(cat);
                                                    setIsFilterOpen(false);
                                                }}
                                                className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors text-sm text-zinc-300 hover:text-white border-b border-white/5 last:border-0"
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Sort Dropdown */}
                        <div className="relative z-20 w-full sm:w-48">
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
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 top-full mt-2 w-full bg-[#0f121b] border border-white/10 rounded-xl overflow-hidden shadow-2xl z-30"
                                    >
                                        {SORTS.map((s) => (
                                            <button
                                                key={s.value}
                                                onClick={() => {
                                                    setSortBy(s.value);
                                                    setIsSortOpen(false);
                                                }}
                                                className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors text-sm text-zinc-300 hover:text-white border-b border-white/5 last:border-0"
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
                            onClick={() => setShowModal(true)}
                            className="mt-8 px-6 py-2 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors text-sm font-bold"
                        >
                            Escribir Ahora
                        </button>
                    </div>
                ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {displayedComments.map((comment, i) => (
                            <motion.div
                                key={comment.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                className="break-inside-avoid bg-white/5 border border-white/5 p-6 rounded-3xl hover:border-primary/20 transition-all duration-300 group relative"
                            >
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
                                    <div className="flex gap-0.5 bg-black/20 px-2 py-1 rounded-full">
                                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                                        <span className="text-xs font-bold text-yellow-500">{comment.rating}.0</span>
                                    </div>
                                </div>

                                <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                                    "{comment.message}"
                                </p>

                                <div className="flex items-center justify-between border-t border-white/5 pt-4">
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
                        ))}
                    </div>
                )}

                {/* Modal Form */}
                <AnimatePresence>
                    {showModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowModal(false)}
                                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative bg-[#0f121b] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
                            >
                                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                                    <h3 className="text-xl font-bold">Deja tu comentario</h3>
                                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="overflow-y-auto p-6 md:p-8">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Personal Info */}
                                        <div className="space-y-4">
                                            <h4 className="text-xs uppercase tracking-widest text-primary font-bold">Datos Personales</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div>
                                                    <label className={labelClasses}>Nombre *</label>
                                                    <input
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                        placeholder="Adrián" className={inputClasses} required
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelClasses}>1er Apellido *</label>
                                                    <input
                                                        name="surname1"
                                                        value={formData.surname1}
                                                        onChange={(e) => setFormData({ ...formData, surname1: e.target.value })}
                                                        placeholder="Tomás" className={inputClasses} required
                                                    />
                                                </div>
                                                <div>
                                                    <label className={labelClasses}>2do Apellido</label>
                                                    <input
                                                        name="surname2"
                                                        value={formData.surname2}
                                                        onChange={(e) => setFormData({ ...formData, surname2: e.target.value })}
                                                        placeholder="Cerdá" className={inputClasses}
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className={labelClasses}>Email (Privado, <span className="text-blue-400">Verifica tu cuenta</span>)</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    placeholder="ejemplo@email.com" className={inputClasses}
                                                />
                                            </div>
                                        </div>

                                        {/* Review Info */}
                                        <div className="space-y-4">
                                            <h4 className="text-xs uppercase tracking-widest text-primary font-bold mt-4">Tu Opinión</h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className={labelClasses}>Categoría</label>
                                                    <div className="relative">
                                                        <select
                                                            name="category"
                                                            value={formData.category}
                                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                                            className={`${inputClasses} appearance-none cursor-pointer`}
                                                        >
                                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                                        </select>
                                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" size={16} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className={labelClasses}>Puntuación</label>
                                                    <div className="flex gap-2 bg-white/5 border border-white/5 rounded-xl px-2 py-2.5">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => setFormData({ ...formData, rating: star })}
                                                                className="flex-1 flex justify-center hover:scale-110 transition-transform"
                                                            >
                                                                <Star size={24} className={star <= formData.rating ? "fill-yellow-400 text-yellow-400" : "text-zinc-700"} />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className={labelClasses}>Mensaje *</label>
                                                <textarea
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                                    placeholder="Escribe aquí tu comentario..."
                                                    className={`${inputClasses} min-h-[120px] resize-none`}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                <div className="p-6 border-t border-white/5 bg-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                                    <label className="flex items-center gap-3 cursor-pointer group select-none">
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.isPublic ? "bg-primary border-primary" : "border-zinc-600 bg-transparent"}`}>
                                            {formData.isPublic && <CheckCircle2 size={12} className="text-white" />}
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={formData.isPublic}
                                            onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                                            className="hidden"
                                        />
                                        <span className="text-sm text-zinc-400 group-hover:text-zinc-200 transition-colors">
                                            Hacer comentario público
                                        </span>
                                    </label>

                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="w-full md:w-auto px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/10"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                                        Publicar Comentario
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}
