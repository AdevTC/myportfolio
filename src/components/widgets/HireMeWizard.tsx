"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Briefcase, Mail, Building, DollarSign, Clock, MapPin, Send, CheckCircle2, ChevronRight, ChevronLeft, Sparkles, Phone, Linkedin, Globe } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { cn } from "@/lib/utils";

interface HireMeWizardProps {
    isOpen: boolean;
    onClose: () => void;
}

const STEPS = [
    { id: "intro", title: "Bienvenido", desc: "Datos Básicos" },
    { id: "role", title: "El Puesto", desc: "Empresa y Posición" },
    { id: "offer", title: "La Oferta", desc: "Condiciones" },
    { id: "extra", title: "Detalles", desc: "Modalidad y Notas" },
];

export default function HireMeWizard({ isOpen, onClose }: HireMeWizardProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        linkedin: "",
        company: "",
        companyWebsite: "",
        role: "",
        salaryRange: "",
        meetingTime: "",
        workMode: "remote", // remote, hybrid, onsite
        message: ""
    });

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            handleSubmit();
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.email || !formData.company) {
            alert("Por favor, rellena al menos tu Nombre, Email y Empresa para continuar.");
            return;
        }

        setIsSubmitting(true);
        try {
            await addDoc(collection(db, "hire_requests"), {
                ...formData,
                status: "new",
                createdAt: serverTimestamp()
            });
            setIsSuccess(true);
        } catch (error) {
            console.error("Error submitting form: ", error);
            alert("Hubo un error al enviar la solicitud. Por favor, inténtalo de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetAndClose = () => {
        onClose();
        // Reset after animation
        setTimeout(() => {
            setCurrentStep(0);
            setIsSuccess(false);
            setFormData({
                name: "", email: "", phone: "", linkedin: "", company: "", companyWebsite: "", role: "",
                salaryRange: "", meetingTime: "", workMode: "remote", message: ""
            });
        }, 300);
    };

    if (!isOpen) return null;

    // Animation variants
    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 50 : -50,
            opacity: 0
        })
    };

    // We can't strictly track direction here without complex state, so we'll just do a subtle fade/y-slide
    const fadeVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
    };

    return (
        <div className="fixed inset-0 z-[100] p-4 sm:p-6 flex items-center justify-center overflow-y-auto w-full h-full">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-md"
                onClick={isSubmitting ? undefined : resetAndClose}
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-2xl bg-[#0a0f1c] border border-primary/30 shadow-[0_0_50px_rgba(20,184,166,0.15)] rounded-3xl flex flex-col my-auto"
            >
                {/* Decorative glowing orb */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/5 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-xl text-primary border border-primary/30">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold font-heading text-white">Hire Me Wizard</h2>
                            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">Iniciando Protocolo de Contratación</p>
                        </div>
                    </div>
                    <button
                        onClick={resetAndClose}
                        disabled={isSubmitting}
                        className="p-2 text-muted-foreground hover:text-white hover:bg-white/10 rounded-full transition-colors disabled:opacity-50"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Progress Bar */}
                {!isSuccess && (
                    <div className="flex items-center px-6 pt-6 relative z-10">
                        {STEPS.map((step, idx) => (
                            <div key={step.id} className="flex-1 flex flex-col items-center gap-2 relative">
                                {/* Connector line */}
                                {idx !== STEPS.length - 1 && (
                                    <div className={cn(
                                        "absolute top-4 left-1/2 w-full h-[2px] transition-colors duration-500",
                                        idx < currentStep ? "bg-primary" : "bg-white/10"
                                    )} />
                                )}

                                {/* Step Circle */}
                                <div className={cn(
                                    "relative z-10 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 border-2",
                                    idx < currentStep ? "bg-primary border-primary text-[#0a0f1c]" :
                                        idx === currentStep ? "bg-[#0a0f1c] border-primary text-primary shadow-[0_0_15px_rgba(20,184,166,0.5)]" :
                                            "bg-[#0a0f1c] border-white/20 text-muted-foreground"
                                )}>
                                    {idx < currentStep ? <CheckCircle2 size={16} /> : idx + 1}
                                </div>
                                <span className={cn(
                                    "text-[10px] sm:text-xs font-medium uppercase tracking-wider text-center hidden sm:block",
                                    idx <= currentStep ? "text-primary/90" : "text-muted-foreground/50"
                                )}>
                                    {step.title}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Body Content */}
                <div className="p-6 md:p-8 relative z-10 min-h-[320px] flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        {isSuccess ? (
                            <motion.div
                                key="success"
                                variants={fadeVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="flex flex-col items-center justify-center text-center py-8 space-y-6"
                            >
                                <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 border border-green-500/30">
                                    <CheckCircle2 size={48} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-3xl font-bold text-white">¡Propuesta Enviada!</h3>
                                    <p className="text-muted-foreground max-w-md mx-auto">
                                        He recibido los detalles de la oferta. Me pondré en contacto contigo lo antes posible usando el correo que has proporcionado.
                                    </p>
                                </div>
                                <button
                                    onClick={resetAndClose}
                                    className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-colors"
                                >
                                    Cerrar y volver al Portfolio
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={`step-${currentStep}`}
                                variants={fadeVariants}
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                                className="space-y-6"
                            >
                                {/* Form Steps */}
                                {currentStep === 0 && (
                                    <div className="space-y-5">
                                        <div className="space-y-1 mb-6">
                                            <h3 className="text-2xl font-bold text-white">Hola, Reclutador 👋</h3>
                                            <p className="text-muted-foreground">Vamos a conocernos un poco. ¿Con quién tengo el gusto?</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex flex-col md:flex-row gap-4">
                                                <div className="relative group flex-1">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                                        <Briefcase size={18} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Tu Nombre Completo *"
                                                        value={formData.name}
                                                        onChange={(e) => handleChange("name", e.target.value)}
                                                        className="w-full h-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all outline-none"
                                                    />
                                                </div>
                                                <div className="relative group flex-1">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                                        <Mail size={18} />
                                                    </div>
                                                    <input
                                                        type="email"
                                                        placeholder="Tu Correo Electrónico *"
                                                        value={formData.email}
                                                        onChange={(e) => handleChange("email", e.target.value)}
                                                        className="w-full h-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-col md:flex-row gap-4">
                                                <div className="relative group flex-1">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                                        <Phone size={18} />
                                                    </div>
                                                    <input
                                                        type="tel"
                                                        placeholder="Teléfono (Opcional)"
                                                        value={formData.phone}
                                                        onChange={(e) => handleChange("phone", e.target.value)}
                                                        className="w-full h-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all outline-none"
                                                    />
                                                </div>
                                                <div className="relative group flex-1">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                                        <Linkedin size={18} />
                                                    </div>
                                                    <input
                                                        type="url"
                                                        placeholder="URL de LinkedIn (Opcional)"
                                                        value={formData.linkedin}
                                                        onChange={(e) => handleChange("linkedin", e.target.value)}
                                                        className="w-full h-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all outline-none"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 1 && (
                                    <div className="space-y-5">
                                        <div className="space-y-1 mb-6">
                                            <h3 className="text-2xl font-bold text-white">La Oportunidad 🚀</h3>
                                            <p className="text-muted-foreground">¿Para qué gran empresa y rol estás buscando cazar talento?</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex flex-col md:flex-row gap-4">
                                                <div className="relative group flex-1">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                                        <Building size={18} />
                                                    </div>
                                                    <input
                                                        type="text"
                                                        placeholder="Nombre de la Empresa *"
                                                        value={formData.company}
                                                        onChange={(e) => handleChange("company", e.target.value)}
                                                        className="w-full h-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all outline-none"
                                                    />
                                                </div>
                                                <div className="relative group flex-1">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                                        <Globe size={18} />
                                                    </div>
                                                    <input
                                                        type="url"
                                                        placeholder="Web de la Empresa (Opcional)"
                                                        value={formData.companyWebsite}
                                                        onChange={(e) => handleChange("companyWebsite", e.target.value)}
                                                        className="w-full h-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all outline-none"
                                                    />
                                                </div>
                                            </div>

                                            <div className="relative group text-left">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                                    <Briefcase size={18} />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Rol / Título del Puesto (ej. Senior Frontend)"
                                                    value={formData.role}
                                                    onChange={(e) => handleChange("role", e.target.value)}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="space-y-5">
                                        <div className="space-y-1 mb-6">
                                            <h3 className="text-2xl font-bold text-white">Hablemos de negocios 💰</h3>
                                            <p className="text-muted-foreground">Transparencia desde el principio. ¿Qué cifras e hitos manejamos?</p>
                                        </div>

                                        <div className="space-y-4 flex flex-col md:flex-row gap-4">
                                            <div className="relative group flex-1">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                                    <DollarSign size={18} />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Rango Salarial (ej. 45k-55k)"
                                                    value={formData.salaryRange}
                                                    onChange={(e) => handleChange("salaryRange", e.target.value)}
                                                    className="w-full h-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all outline-none"
                                                />
                                            </div>
                                            <div className="relative group flex-1">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                                                    <Clock size={18} />
                                                </div>
                                                <input
                                                    type="text"
                                                    placeholder="Horario de Ref. (ej. Tardes L-V)"
                                                    value={formData.meetingTime}
                                                    onChange={(e) => handleChange("meetingTime", e.target.value)}
                                                    className="w-full h-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 3 && (
                                    <div className="space-y-5">
                                        <div className="space-y-1 mb-6">
                                            <h3 className="text-2xl font-bold text-white">Últimos Detalles 🎯</h3>
                                            <p className="text-muted-foreground">¿Cómo trabajaremos? Déjame un mensaje con cualquier contexto extra.</p>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex bg-black/40 border border-white/10 p-1 rounded-xl">
                                                {[
                                                    { id: 'remote', label: '100% Remoto' },
                                                    { id: 'hybrid', label: 'Híbrido' },
                                                    { id: 'onsite', label: 'Presencial' },
                                                ].map(mode => (
                                                    <button
                                                        key={mode.id}
                                                        onClick={() => handleChange("workMode", mode.id)}
                                                        className={cn(
                                                            "flex-1 py-3 text-sm font-medium rounded-lg transition-all",
                                                            formData.workMode === mode.id ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:text-white"
                                                        )}
                                                    >
                                                        {mode.label}
                                                    </button>
                                                ))}
                                            </div>

                                            <textarea
                                                placeholder="Mensaje extra, enlace a la oferta, tecnologías requeridas, etc..."
                                                rows={4}
                                                value={formData.message}
                                                onChange={(e) => handleChange("message", e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white resize-none focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all outline-none"
                                            />
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Controls */}
                {!isSuccess && (
                    <div className="p-6 border-t border-white/5 bg-black/20 flex justify-between items-center relative z-10">
                        <button
                            onClick={handlePrev}
                            disabled={currentStep === 0 || isSubmitting}
                            className={cn(
                                "flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all",
                                currentStep === 0 ? "opacity-0 pointer-events-none" : "bg-white/5 hover:bg-white/10 text-white"
                            )}
                        >
                            <ChevronLeft size={18} /> Atrás
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={isSubmitting}
                            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-emerald-500 hover:from-primary/90 hover:to-emerald-500/90 text-[#0a0f1c] font-black rounded-xl transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_30px_rgba(20,184,166,0.5)] transform hover:-translate-y-0.5"
                        >
                            {isSubmitting ? (
                                "Enviando..."
                            ) : currentStep === STEPS.length - 1 ? (
                                <>Enviar Propuesta <Send size={18} /></>
                            ) : (
                                <>Siguiente <ChevronRight size={18} /></>
                            )}
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
