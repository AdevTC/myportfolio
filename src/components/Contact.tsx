"use client";

import { useState } from "react";
import Section from "./ui/Section";
import { Mail, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Contact() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
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
        try {
            await addDoc(collection(db, "contact_messages"), {
                ...formData,
                createdAt: serverTimestamp(),
            });
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
        <Section id="contact" className="mb-20">
            <div className="max-w-4xl mx-auto glass rounded-3xl p-8 md:p-12 border border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    <div>
                        <h2 className="text-3xl font-bold mb-6">
                            Hablemos de <span className="text-primary">Tu Proyecto</span>
                        </h2>
                        <p className="text-muted-foreground mb-8">
                            ¿Buscas un experto en integraciones SAP o desarrollo Full Stack?
                            Estoy disponible para proyectos freelance y oportunidades a tiempo completo.
                        </p>

                        <div className="space-y-4">
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
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
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
                            rows={4}
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Mensaje"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:border-primary focus:outline-none transition-colors resize-none"
                            required
                        ></textarea>

                        <button
                            type="submit"
                            disabled={status === 'loading' || status === 'success'}
                            className={`w-full py-4 font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${status === 'success' ? 'bg-green-500 text-white' :
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

                </div>
            </div>
        </Section>
    );
}
