"use client";

import Section from "./ui/Section";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Plus, X, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from "firebase/firestore";

interface Testimonial {
    id: string;
    text: string;
    author: string;
    role?: string;
    company?: string;
    createdAt: Timestamp;
}

export default function Testimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [index, setIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        text: "",
        author: "",
        role: "",
        company: ""
    });

    const fetchTestimonials = async () => {
        try {
            const q = query(collection(db, "testimonials"), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(q);
            const data: Testimonial[] = [];
            querySnapshot.forEach((doc) => {
                data.push({ id: doc.id, ...doc.data() } as Testimonial);
            });
            setTestimonials(data);
        } catch (error) {
            console.error("Error fetching testimonials:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
    const prev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.text || !formData.author) return;

        setSubmitting(true);
        try {
            await addDoc(collection(db, "testimonials"), {
                text: formData.text,
                author: formData.author,
                role: formData.role,
                company: formData.company,
                createdAt: Timestamp.now()
            });

            await fetchTestimonials();
            setIsModalOpen(false);
            setFormData({ text: "", author: "", role: "", company: "" });
            setIndex(0); // Reset to show the newest one (since we order by desc)
        } catch (error) {
            console.error("Error adding testimonial:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Section className="max-w-4xl mx-auto text-center py-20">
            <Quote size={48} className="text-primary mx-auto mb-8 opacity-50" />

            {loading ? (
                <div className="min-h-[300px] flex items-center justify-center">
                    <Loader2 className="animate-spin text-primary" size={40} />
                </div>
            ) : testimonials.length > 0 ? (
                <div className="relative min-h-[300px] flex items-center justify-center flex-col">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={testimonials[index].id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="px-8 md:px-20"
                        >
                            <p className="text-2xl md:text-3xl italic font-light mb-8 leading-relaxed">
                                &quot;{testimonials[index].text}&quot;
                            </p>
                            <div>
                                <h4 className="text-xl font-bold">{testimonials[index].author}</h4>
                                {(testimonials[index].role || testimonials[index].company) && (
                                    <p className="text-primary font-medium">
                                        {testimonials[index].role}
                                        {testimonials[index].role && testimonials[index].company && " en "}
                                        {testimonials[index].company}
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between pointer-events-none px-4 md:px-0">
                        <button
                            onClick={prev}
                            className="pointer-events-auto p-3 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
                        >
                            <ChevronLeft size={32} />
                        </button>
                        <button
                            onClick={next}
                            className="pointer-events-auto p-3 hover:bg-white/10 rounded-full transition-colors text-white/50 hover:text-white"
                        >
                            <ChevronRight size={32} />
                        </button>
                    </div>

                    <div className="mt-12">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 mx-auto"
                        >
                            <Plus size={16} /> Agregar mi testimonio
                        </button>
                    </div>
                </div>
            ) : (
                <div className="min-h-[300px] flex flex-col items-center justify-center gap-6">
                    <div className="text-muted-foreground">
                        No hay testimonios todavía.
                        <br />
                        ¡Sé el primero en dejar uno!
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 bg-primary text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-lg shadow-primary/25"
                    >
                        Escribir Testimonio
                    </button>
                </div>
            )}

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-lg bg-[#0f172a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10 p-8"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <h3 className="text-2xl font-bold mb-6 text-center">Nuevo Testimonio</h3>

                            <form onSubmit={handleSubmit} className="space-y-4 text-left">
                                <div>
                                    <label className="block text-sm font-medium mb-1 text-muted-foreground">Tu opinión <span className="text-primary">*</span></label>
                                    <textarea
                                        required
                                        value={formData.text}
                                        onChange={e => setFormData({ ...formData, text: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50 min-h-[100px] resize-none"
                                        placeholder="¿Qué te pareció trabajar conmigo?"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1 text-muted-foreground">Nombre completo <span className="text-primary">*</span></label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.author}
                                        onChange={e => setFormData({ ...formData, author: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50"
                                        placeholder="Ej. Ana Pérez"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-muted-foreground">Rol (Opcional)</label>
                                        <input
                                            type="text"
                                            value={formData.role}
                                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50"
                                            placeholder="Ej. CEO"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 text-muted-foreground">Empresa (Opcional)</label>
                                        <input
                                            type="text"
                                            value={formData.company}
                                            onChange={e => setFormData({ ...formData, company: e.target.value })}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:border-primary/50"
                                            placeholder="Ej. Startup Inc."
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors mt-4 flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} /> Publicando...
                                        </>
                                    ) : (
                                        "Publicar Testimonio"
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Section>
    );
}
