"use client";

import { useState, useRef, useEffect } from "react";
import FloatingWindow from "../ui/FloatingWindow";
import { Send, Bot, User } from "lucide-react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function AIChatAssistant() {
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "¡Hola! Soy la IA de Adrián. Pregúntame sobre su experiencia, skills o proyectos." }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setInput("");
        setLoading(true);

        // Mock AI Response
        setTimeout(() => {
            let response = "Interesante pregunta. Adrián tiene amplia experiencia en React y Next.js.";
            if (userMsg.toLowerCase().includes("hola")) response = "¡Hola! ¿En qué puedo ayudarte hoy?";
            if (userMsg.toLowerCase().includes("experiencia")) response = "Adrián ha trabajado en múltiples proyectos Full Stack, especializándose en el ecosistema de JavaScript y SAP Cloud.";
            if (userMsg.toLowerCase().includes("contacto")) response = "Puedes contactar a Adrián a través del formulario de esta web o por LinkedIn.";

            setMessages(prev => [...prev, { role: "assistant", content: response }]);
            setLoading(false);
        }, 1000);
    };

    return (
        <FloatingWindow id="ai" title="Asistente Virtual" width={380} height={500}>
            <div className="flex flex-col h-full overflow-hidden">
                <div className="flex-1 overflow-y-auto space-y-4 p-2 custom-scrollbar" ref={scrollRef}>
                    {messages.map((m, i) => (
                        <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${m.role === "user"
                                    ? "bg-primary text-white rounded-br-none"
                                    : "bg-white/10 text-zinc-200 rounded-bl-none"
                                }`}>
                                {m.content}
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex justify-start">
                            <div className="bg-white/10 rounded-2xl rounded-bl-none px-4 py-2 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-100"></span>
                                <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce delay-200"></span>
                            </div>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="mt-4 flex gap-2 pt-4 border-t border-white/5">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Escribe tu pregunta..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="p-2 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </FloatingWindow>
    );
}
