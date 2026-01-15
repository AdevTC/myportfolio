"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare, Send, X, ShieldCheck, ChevronDown, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useFloatingComponents } from "@/context/FloatingComponentContext";
import StatusModal, { StatusType } from "@/components/ui/StatusModal";

// Validation Schema
const commentSchema = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras"),
    surname1: z.string().min(2, "El primer apellido es obligatorio").regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El apellido solo puede contener letras"),
    surname2: z.string().optional(),
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    category: z.string(),
    message: z.string().min(10, "El mensaje es muy corto (mínimo 10 caracteres)").max(500, "El mensaje es muy largo (máximo 500 caracteres)"),
    rating: z.number().min(0).max(5),
    isPublic: z.boolean()
});

const CATEGORIES = ["General", "Proyectos", "Diseño", "Funcionalidad", "Sugerencia"];

function StarRating({ rating }: { rating: number }) {
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

export default function CommentsModal() {
    const { isWidgetOpen, closeWidget } = useFloatingComponents();
    const isOpen = isWidgetOpen("comments");

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
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);

    const [statusModal, setStatusModal] = useState<{
        isOpen: boolean;
        type: StatusType;
        title: string;
        message: string;
    }>({
        isOpen: false,
        type: "success",
        title: "",
        message: ""
    });

    const showStatus = (type: StatusType, title: string, message: string) => {
        setStatusModal({ isOpen: true, type, title, message });
    };

    // Close on escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeWidget("comments");
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [closeWidget]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. Rate Limiting (Browser-based)
        const RATE_LIMIT_KEY = "last_comment_timestamp";
        const cooldown = 60 * 1000; // 60 seconds
        const lastTime = localStorage.getItem(RATE_LIMIT_KEY);

        if (lastTime && Date.now() - parseInt(lastTime) < cooldown) {
            showStatus("warning", "⏳ Espera un momento", "Por favor, espera un minuto antes de enviar otro comentario. (Protección Anti-Spam de la Comunidad)");
            return;
        }

        // 2. Zod Validation (Sanitization)
        const result = commentSchema.safeParse(formData);
        if (!result.success) {
            const firstError = result.error.issues[0].message;
            showStatus("error", "Datos incorrectos", firstError);
            return;
        }

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "comments"), {
                ...formData,
                category: formData.category,
                likes: 0,
                createdAt: serverTimestamp()
            });

            // Update Rate Limit Timestamp
            localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString());

            // Close widget logic moved to StatusModal onClose
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

            // Success feedback
            showStatus("success", "¡Comentario Enviado!", "Gracias por compartir tu opinión.");

        } catch (error) {
            console.error(error);
            showStatus("error", "Error inesperado", "Hubo un problema al conectar con el servidor.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses = "w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors placeholder:text-zinc-600";
    const labelClasses = "text-sm font-medium text-zinc-400 mb-2 block";

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => closeWidget("comments")}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <StatusModal
                        isOpen={statusModal.isOpen}
                        onClose={() => {
                            setStatusModal(prev => ({ ...prev, isOpen: false }));
                            if (statusModal.type === "success") {
                                closeWidget("comments");
                            }
                        }}
                        type={statusModal.type}
                        title={statusModal.title}
                        message={statusModal.message}
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative bg-[#0f121b] border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col pointer-events-auto"
                    >
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <h3 className="text-xl font-bold">Deja tu comentario</h3>
                            <button onClick={() => closeWidget("comments")} className="p-2 hover:bg-white/5 rounded-full transition-colors">
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                                        <div className="relative">
                                            <label className={labelClasses}>Categoría</label>
                                            <button
                                                type="button"
                                                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                                                className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-left focus:outline-none focus:border-primary/50 transition-colors flex justify-between items-center text-zinc-200 h-[50px]"
                                            >
                                                {formData.category}
                                                <ChevronDown size={16} className={`transition-transform duration-200 ${isCategoryOpen ? "rotate-180" : ""}`} />
                                            </button>

                                            <AnimatePresence>
                                                {isCategoryOpen && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                        className="absolute z-50 bottom-full mb-2 left-0 right-0 bg-[#0f121b] border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
                                                    >
                                                        {CATEGORIES.map((cat) => (
                                                            <button
                                                                key={cat}
                                                                type="button"
                                                                onClick={() => {
                                                                    setFormData({ ...formData, category: cat });
                                                                    setIsCategoryOpen(false);
                                                                }}
                                                                className={cn(
                                                                    "w-full text-left px-4 py-3 hover:bg-white/5 transition-colors text-sm border-b border-white/5 last:border-0",
                                                                    formData.category === cat ? "text-primary font-bold bg-primary/5" : "text-zinc-300 hover:text-white"
                                                                )}
                                                            >
                                                                {cat}
                                                            </button>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-3 mb-2 h-5">
                                                <label className="text-sm font-medium text-zinc-400">Puntuación</label>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-yellow-500 font-bold text-sm">{formData.rating}</span>
                                                    <div className="scale-90 origin-left flex items-center">
                                                        <StarRating rating={formData.rating} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 flex items-center h-[50px]">
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="5"
                                                    step="0.25"
                                                    value={formData.rating}
                                                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                                                    className="w-full accent-primary h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer"
                                                />
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
                                <div className="p-6 border-t border-white/5 bg-white/5 flex flex-col md:flex-row justify-between items-center gap-4 -mx-6 -mb-6 md:-mx-8 md:-mb-8 mt-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full md:w-auto px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/10 ml-auto"
                                    >
                                        {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                                        Publicar Comentario
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
