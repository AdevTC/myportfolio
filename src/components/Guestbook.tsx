"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

interface GuestMessage {
    id: string;
    name: string;
    message: string;
    createdAt: Timestamp;
}

export default function Guestbook() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<GuestMessage[]>([]);
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch messages
    useEffect(() => {
        if (!isOpen) return;

        const q = query(
            collection(db, "guestbook"),
            orderBy("createdAt", "desc"),
            limit(50)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as GuestMessage[];
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !message.trim()) return;

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "guestbook"), {
                name: name.trim(),
                message: message.trim(),
                createdAt: serverTimestamp()
            });
            setMessage(""); // Keep name for convenience
        } catch (error) {
            console.error("Error adding document: ", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Trigger Button - Positioned to the left of Like Button (right-8 is like button) */}
            <div className="fixed bottom-8 right-28 z-40">
                <motion.button
                    onClick={() => setIsOpen(true)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xl hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                >
                    <MessageCircle size={24} />
                </motion.button>
            </div>

            {/* Modal / Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
                        />

                        {/* Panel */}
                        <motion.div
                            initial={{ opacity: 0, x: "100%" }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: "100%" }}
                            className="fixed inset-y-0 right-0 w-full max-w-md bg-[#0f172a] border-l border-white/10 z-50 shadow-2xl flex flex-col"
                        >
                            {/* Header */}
                            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20">
                                <h3 className="font-bold text-xl flex items-center gap-2">
                                    <MessageCircle size={20} className="text-primary" />
                                    Libro de Visitas
                                </h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Messages Feed */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                                {messages.length === 0 ? (
                                    <div className="text-center text-muted-foreground py-10">
                                        <p>Sé el primero en firmar el libro de visitas.</p>
                                    </div>
                                ) : (
                                    messages.map((msg) => (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="bg-white/5 border border-white/5 p-3 rounded-xl"
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-bold text-primary text-sm flex items-center gap-1">
                                                    <User size={14} />
                                                    {msg.name}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {msg.createdAt?.toDate ? formatDistanceToNow(msg.createdAt.toDate(), { locale: es, addSuffix: true }) : 'Justo ahora'}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-200 break-words">{msg.message}</p>
                                        </motion.div>
                                    ))
                                )}
                            </div>

                            {/* Input Form */}
                            <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-black/20">
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs text-muted-foreground ml-1">Tu Nombre</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Ej: Antonio Rodríguez"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-muted-foreground ml-1">Mensaje</label>
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Deja un comentario constructivo..."
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary transition-colors resize-none h-20"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-2 rounded-lg flex justify-center items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? (
                                            <span className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent border-white" />
                                        ) : (
                                            <>
                                                Enviar <Send size={16} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
