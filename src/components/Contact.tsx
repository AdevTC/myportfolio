"use client";

import MeetingModal from "@/components/ui/MeetingModal";
import { useState } from "react";
import { Mail, MapPin, Send, CheckCircle, AlertCircle, Calendar, ArrowRight } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { sendEmail } from "@/app/actions";

export default function Contact() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
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

        setStatus('loading');

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
                // We don't fail the whole process if just email fails, as DB saved it.
            }

            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            console.error("Error sending message:", error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    return (
        <div className="h-full glass rounded-3xl p-8 border border-white/10 flex flex-col shadow-2xl min-h-[800px]">
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
                {/* Calendar / Meeting Button */}
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
                        <p className="font-medium">adriantomascv@gmail.com</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/5 rounded-lg"><MapPin className="text-primary" /></div>
                    <div>
                        <p className="text-sm text-muted-foreground">Ubicación</p>
                        <p className="font-medium">Madrid, España</p>
                    </div>
                </div>
            </div>

            <form className="space-y-4 flex-1 flex flex-col" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Nombre"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary focus:outline-none transition-colors"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary focus:outline-none transition-colors"
                        required
                    />
                </div>
                <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Asunto"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary focus:outline-none transition-colors"
                />
                <textarea
                    rows={8}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Mensaje"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary focus:outline-none transition-colors resize-none flex-1"
                    required
                ></textarea>

                <button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    className={`w-full py-4 font-bold rounded-lg transition-all flex items-center justify-center gap-2 mt-auto ${status === 'success' ? 'bg-green-500 text-white' :
                        status === 'error' ? 'bg-red-500 text-white' :
                            'bg-primary text-white hover:brightness-110'
                        }`}
                >
                    {status === 'loading' ? (
                        <span className="animate-spin rounded-full h-5 w-5 border-2 border-b-transparent border-white" />
                    ) : status === 'success' ? (
                        <> <CheckCircle size={18} /> Mensaje Enviado </>
                    ) : status === 'error' ? (
                        <> <AlertCircle size={18} /> Error </>
                    ) : (
                        <> <Send size={18} /> Enviar Mensaje </>
                    )}
                </button>
            </form>

            <MeetingModal isOpen={isMeetingOpen} onClose={() => setIsMeetingOpen(false)} />
        </div>
    );
}
