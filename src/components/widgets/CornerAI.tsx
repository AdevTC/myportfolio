"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, X, Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

// Message Type
interface Message {
    role: "user" | "model";
    parts: { text: string }[];
}

export default function CornerAI() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: "model", parts: [{ text: "¡Hola! Soy AIdri 🤖. Pregúntame lo que quieras sobre el portfolio, mi jefe (Adrián) o mis crisis existenciales como IA." }] }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userText = input;
        setInput("");
        setMessages(prev => [...prev, { role: "user", parts: [{ text: userText }] }]);
        setLoading(true);

        try {
            // System instruction is now handled in the server API route


            // Construct the prompt history including the new message
            const apiContents = [...messages, { role: "user", parts: [{ text: userText }] }];

            // Call internal Next.js API route (Server-Side) to hide API Key
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: apiContents
                    // system_instruction is now handled server-side to protect context
                })
            });

            const data = await response.json();

            if (data.error) {
                console.error("Gemini Error:", data.error);
                throw new Error(data.error.message || "Error en la API");
            }

            const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Lo siento, no pude procesar eso.";

            setMessages(prev => [...prev, { role: "model", parts: [{ text: reply }] }]);

        } catch (error: any) {
            console.error(error);
            let errorMessage = "Hubo un error al conectar con mi cerebro digital. Inténtalo de nuevo.";

            if (error.message.includes("GEMINI_API_KEY")) {
                errorMessage = "⚠️ Error de configuración: Falta la GEMINI_API_KEY en el servidor.";
            }

            setMessages(prev => [...prev, { role: "model", parts: [{ text: errorMessage }] }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="hidden lg:flex fixed bottom-6 right-6 z-50 flex-col items-end gap-4">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: "bottom right" }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="w-[350px] h-[500px] bg-[#0f121b]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden origin-bottom-right"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/5 bg-white/5 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-500/20 rounded-xl border border-purple-500/30 flex items-center justify-center overflow-hidden">
                                    <img src="/brand/aidri.png" alt="AIdri" className="w-full h-full object-cover scale-150" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">
                                        <span className="text-primary">AI</span>dri
                                    </h3>
                                    <p className="text-xs text-zinc-400 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        Online
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={scrollRef}>
                            {messages.map((m, i) => (
                                <div key={i} className={cn("flex gap-3", m.role === "user" ? "flex-row-reverse" : "")}>
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden",
                                        m.role === "user" ? "bg-primary/20" : "bg-purple-500/20 border border-purple-500/30"
                                    )}>
                                        {m.role === "user" ? (
                                            <User size={14} className="text-primary" />
                                        ) : (
                                            <img src="/brand/aidri.png" alt="AIdri" className="w-full h-full object-cover scale-150" />
                                        )}
                                    </div>
                                    <div className={cn(
                                        "max-w-[80%] rounded-2xl p-3 text-sm",
                                        m.role === "user"
                                            ? "bg-primary text-white rounded-tr-none"
                                            : "bg-white/10 text-zinc-200 rounded-tl-none"
                                    )}>
                                        {m.parts[0].text}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 overflow-hidden border border-purple-500/30">
                                        <img src="/brand/aidri.png" alt="AIdri" className="w-full h-full object-cover scale-150" />
                                    </div>
                                    <div className="bg-white/10 rounded-2xl p-3 rounded-tl-none flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-100"></span>
                                        <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-200"></span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSubmit} className="p-3 border-t border-white/5 bg-black/20">
                            <div className="relative">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Escribe un mensaje..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-zinc-600"
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !input.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Trigger Button - Always visible */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/20 transition-all relative group",
                    isOpen ? "bg-white/10 text-white" : "bg-gradient-to-br from-purple-600 to-blue-600 text-white"
                )}
            >
                {/* Glow Effect */}
                {!isOpen && (
                    <span className="absolute inset-0 rounded-full bg-purple-500 blur-lg opacity-50 group-hover:opacity-80 transition-opacity animate-pulse" />
                )}

                {/* Content Container (Masked) for Image Zoom */}
                <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center relative z-0">
                    {isOpen ? (
                        <X size={24} />
                    ) : (
                        <img src="/brand/aidri.png" alt="Open AIdri" className="w-full h-full object-cover scale-[1.4]" />
                    )}
                </div>

                {/* Status Dot (Outside Mask) */}
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#0f121b] flex items-center justify-center z-10 border border-white/10">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                </span>
            </motion.button>

        </div>
    );
}
