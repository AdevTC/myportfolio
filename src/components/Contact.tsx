"use client";

import MeetingModal from "@/components/ui/MeetingModal";
import { useState } from "react";
import { Mail, MapPin, Send, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sendEmail } from "@/app/actions";
import StatusModal, { StatusType } from "@/components/ui/StatusModal";

export default function Contact() {
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

    const [isLoading, setIsLoading] = useState(false);
    const [isMeetingOpen, setIsMeetingOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) return;

        setIsLoading(true);

        // Prepare FormData for Server Action
        const emailData = new FormData();
        emailData.append("name", formData.name);
        emailData.append("email", formData.email);
        emailData.append("subject", formData.subject);
        emailData.append("message", formData.message);

        try {
            // 1. Save to Firebase
            await addDoc(collection(db, "contact_messages"), {
                ...formData,
                createdAt: serverTimestamp(),
            });

            // 2. Send Real Email (Server Action)
            const emailResult = await sendEmail(emailData);

            if (!emailResult.success) {
                console.warn("Email sending failed:", emailResult.error);
            }

            // Success Feedback
            showStatus("success", "¡Mensaje Enviado!", "Me pondré en contacto contigo lo antes posible.");
            setFormData({ name: '', email: '', subject: '', message: '' });

        } catch (error) {
            console.error("Error sending message:", error);
            showStatus("error", "Error inesperado", "Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-full glass rounded-3xl p-8 border border-white/10 flex flex-col shadow-2xl min-h-[800px] relative">
            <StatusModal
                isOpen={statusModal.isOpen}
                onClose={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
                type={statusModal.type}
                title={statusModal.title}
                message={statusModal.message}
            />

            <div className="mb-8">
                <h2 className="text-3xl font-bold mb-4">
                    Hablemos de <span className="text-primary">Tu Proyecto</span>
                </h2>
                <p className="text-muted-foreground">
                    ¿Buscas un experto en integraciones SAP o desarrollo Full Stack?
                    Estoy disponible para proyectos freelance y oportunidades a tiempo completo.
                </p>
            </div>

            <div className="space-y-6 mb-8">
                {/* Calendar / Meeting Button - Enhanced CTA */}
                <button
                    onClick={() => setIsMeetingOpen(true)}
                    className="w-full relative group overflow-hidden rounded-xl p-[1px] transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary via-purple-500 to-primary opacity-70 group-hover:opacity-100 animate-gradient-xy transition-opacity" />
                    <div className="relative bg-[#0f121b] hover:bg-[#0f121b]/90 h-full rounded-xl p-4 flex items-center gap-4 transition-colors">
                        <div className="p-3 bg-primary/20 rounded-full group-hover:bg-primary/30 transition-colors shrink-0">
                            <Calendar className="text-primary w-6 h-6" />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-0.5">Prioridad</p>
                            <p className="font-bold text-white text-lg">Agendar Reunión (30 min)</p>
                            <p className="text-sm text-zinc-400 group-hover:text-zinc-300">Habla directamente conmigo</p>
                        </div>
                        <div className="bg-primary/10 p-2 rounded-full group-hover:bg-primary group-hover:text-white transition-all">
                            <ArrowRight className="w-5 h-5 text-primary group-hover:text-white" />
                        </div>
                    </div>
                </button>

                <div className="w-full h-px bg-white/5" />

                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-lg"><Mail className="text-primary" /></div>
                    <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <a href="mailto:adriantomascerda@gmail.com" className="font-medium hover:text-primary transition-colors">adriantomascerda@gmail.com</a>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-lg"><MapPin className="text-primary" /></div>
                    <div>
                        <p className="text-sm text-muted-foreground">Ubicación</p>
                        <p className="font-medium">Madrid, España (Remoto)</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 flex-grow flex flex-col">
                <div className="space-y-4 flex-grow">
                    <div>
                        <input
                            type="text"
                            name="name"
                            placeholder="Nombre"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors"
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="subject"
                            placeholder="Asunto"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors"
                            required
                        />
                    </div>
                    <div className="flex-grow">
                        <textarea
                            name="message"
                            placeholder="Mensaje"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full h-full min-h-[120px] bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                            required
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" />
                        ) : (
                            <>
                                Enviar Mensaje
                                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </div>
            </form>

            <MeetingModal isOpen={isMeetingOpen} onClose={() => setIsMeetingOpen(false)} />
        </div>
    );
}
