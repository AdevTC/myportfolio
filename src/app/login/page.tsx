"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, ArrowRight, Chrome, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

export default function LoginPage() {
    const { loginWithGoogle, loginWithEmail, registerWithEmail, resetPassword } = useAuth();
    const [view, setView] = useState<"login" | "register" | "forgot">("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        try {
            if (view === "login") {
                await loginWithEmail(email, password);
            } else if (view === "register") {
                if (!name.trim()) {
                    throw new Error("El nombre de usuario es obligatorio.");
                }
                await registerWithEmail(email, password, name);
                setSuccess("¡Registro exitoso! Te hemos enviado un enlace de verificación. Por favor, revisa tu bandeja de entrada (y la carpeta de spam) para confirmar tu cuenta antes de acceder.");
                setEmail("");
                setPassword("");
                setName("");
                setView("login");
                setLoading(false);
            } else if (view === "forgot") {
                if (!email.trim()) {
                    throw new Error("El correo electrónico es obligatorio.");
                }
                await resetPassword(email);
                setSuccess("¡Enlace enviado! Te hemos enviado un correo para restablecer tu contraseña. Por favor, revisa tu bandeja de entrada y spam.");
                setEmail("");
                setView("login");
                setLoading(false);
            }
        } catch (err: any) {
            console.error("Auth error:", err);
            let friendlyMessage = "Ocurrió un error inesperado.";
            if (err.message === "verify-email-first") {
                friendlyMessage = "Tu dirección de correo no está verificada. Te hemos enviado un nuevo enlace de verificación. Por favor, revisa tu bandeja de entrada y la carpeta de spam.";
            } else if (err.code === "auth/invalid-credential") {
                friendlyMessage = "Credenciales incorrectas. Verifica tu correo y contraseña.";
            } else if (err.code === "auth/email-already-in-use") {
                friendlyMessage = "El correo electrónico ya está registrado.";
            } else if (err.code === "auth/weak-password") {
                friendlyMessage = "La contraseña debe tener al menos 6 caracteres.";
            } else if (err.code === "auth/invalid-email") {
                friendlyMessage = "El formato de correo no es válido.";
            } else if (err.code === "auth/user-not-found") {
                friendlyMessage = "No existe ninguna cuenta registrada con este correo electrónico.";
            } else if (err.message) {
                friendlyMessage = err.message;
            }
            setError(friendlyMessage);
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setError(null);
        setSuccess(null);
        setLoading(true);
        try {
            await loginWithGoogle();
        } catch (err: any) {
            console.error("Google auth error:", err);
            if (err.code !== "auth/popup-closed-by-user") {
                setError("No se pudo iniciar sesión con Google.");
            }
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen w-full flex flex-col justify-center items-center p-6 relative overflow-hidden select-none">
            {/* Ambient Background Glowing Auras */}
            <div className="absolute top-[20%] left-[20%] w-[35vw] h-[35vw] rounded-full blur-[160px] pointer-events-none" 
                style={{ backgroundColor: "color-mix(in srgb, var(--primary) 12%, transparent)" }}
            />
            <div className="absolute bottom-[20%] right-[20%] w-[35vw] h-[35vw] rounded-full blur-[160px] pointer-events-none" 
                style={{ backgroundColor: "color-mix(in srgb, var(--primary) 8%, transparent)" }}
            />

            {/* Intro Text */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-center mb-8 relative z-10 max-w-lg"
            >
                <div className="flex items-center justify-center gap-2 px-3 py-1 rounded-full glass text-[10px] font-mono text-zinc-400 mb-4 border border-white/5 w-fit mx-auto shadow-sm">
                    PORTFOLIO VERIFICADO
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40 mb-3 leading-none">
                    Adrián Tomás Cerdá
                </h1>
                <p className="text-zinc-400 text-sm font-light leading-relaxed">
                    Inicia sesión o regístrate para acceder al portfolio profesional completo y explorar su ecosistema interactivo.
                </p>
            </motion.div>

            {/* Glass Card Container */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
                className="relative w-full max-w-md glass rounded-3xl overflow-hidden shadow-2xl z-10 border border-white/5 bg-[#030408]/60 backdrop-blur-xl"
                style={{
                    boxShadow: "0 25px 70px -15px rgba(0,0,0,0.8), 0 0 30px -5px color-mix(in srgb, var(--primary) 15%, transparent)"
                }}
            >
                <div className="p-8">
                    {/* Sliding Tab Selector */}
                    {view !== "forgot" && (
                        <div className="flex bg-white/3 p-1 rounded-2xl border border-white/5 mb-8 relative h-12 items-center">
                            <div className="absolute inset-1 w-[calc(50%-4px)] h-[calc(100%-8px)] rounded-xl bg-primary transition-all duration-300 ease-out" 
                                style={{ 
                                    left: view === "login" ? "4px" : "calc(50%)",
                                    boxShadow: "0 4px 15px -4px color-mix(in srgb, var(--primary) 40%, transparent)" 
                                }}
                            />
                            <button 
                                type="button" 
                                onClick={() => { setView("login"); setError(null); setSuccess(null); }}
                                className={`flex-1 text-xs font-semibold z-10 text-center transition-colors uppercase tracking-wider ${view === "login" ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                Acceder
                            </button>
                            <button 
                                type="button" 
                                onClick={() => { setView("register"); setError(null); setSuccess(null); }}
                                className={`flex-1 text-xs font-semibold z-10 text-center transition-colors uppercase tracking-wider ${view === "register" ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                            >
                                Registrarse
                            </button>
                        </div>
                    )}

                    {view === "forgot" && (
                        <div className="text-center mb-6 relative z-10">
                            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Recuperar Contraseña</h2>
                            <p className="text-zinc-400 text-xs mt-1.5 font-light leading-relaxed">
                                Introduce tu correo electrónico y te enviaremos un enlace seguro para restablecerla.
                            </p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AnimatePresence mode="wait">
                            {view === "register" && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-1.5"
                                >
                                    <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Nombre de Usuario</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                        <input 
                                            type="text" 
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Tu nombre completo"
                                            required={view === "register"}
                                            className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary/50 focus:bg-zinc-950/85 transition-all"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Correo Electrónico</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="correo@ejemplo.com"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary/50 focus:bg-zinc-950/85 transition-all"
                                />
                            </div>
                        </div>

                        {view !== "forgot" && (
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Contraseña</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                    <input 
                                        type="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary/50 focus:bg-zinc-950/85 transition-all"
                                    />
                                </div>
                                {view === "login" && (
                                    <div className="text-right mt-1.5">
                                        <button
                                            type="button"
                                            onClick={() => { setView("forgot"); setError(null); setSuccess(null); }}
                                            className="text-[10px] font-mono text-zinc-400 hover:text-primary transition-all duration-200"
                                        >
                                            ¿Olvidaste tu contraseña?
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Success box */}
                        <AnimatePresence>
                            {success && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                                >
                                    <CheckCircle className="shrink-0 mt-0.5" size={16} />
                                    <span className="text-[11px] font-mono leading-relaxed">{success}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Error box */}
                        <AnimatePresence>
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="flex items-start gap-2.5 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400"
                                >
                                    <AlertCircle className="shrink-0 mt-0.5" size={16} />
                                    <span className="text-[11px] font-mono leading-relaxed">{error}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{ 
                                boxShadow: "0 10px 20px -5px color-mix(in srgb, var(--primary) 30%, transparent)" 
                            }}
                            className="w-full py-3 bg-primary hover:brightness-110 active:scale-98 disabled:opacity-50 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider mt-6"
                        >
                            {loading ? (
                                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    {view === "login" && "Ingresar"}
                                    {view === "register" && "Crear Cuenta"}
                                    {view === "forgot" && "Enviar Enlace"}
                                    <ArrowRight size={14} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Options depending on View */}
                    {view !== "forgot" ? (
                        <>
                            {/* Divider */}
                            <div className="relative my-6 flex items-center justify-center">
                                <div className="absolute inset-x-0 h-px bg-white/5" />
                                <span className="relative px-3 bg-[#030408]/60 text-[10px] font-mono text-zinc-600 uppercase tracking-widest">o accede con</span>
                            </div>

                            {/* Google Auth Button */}
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="w-full py-3 border border-white/10 hover:border-white/20 bg-zinc-950/40 hover:bg-zinc-950/70 active:scale-98 disabled:opacity-50 text-zinc-300 hover:text-white font-semibold rounded-2xl transition-all flex items-center justify-center gap-2.5 text-xs uppercase tracking-wider"
                            >
                                <Chrome size={16} className="text-red-400" />
                                Google Account
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={() => { setView("login"); setError(null); setSuccess(null); }}
                            className="w-full py-3 border border-white/10 hover:border-white/20 bg-zinc-950/40 hover:bg-zinc-950/70 active:scale-98 disabled:opacity-50 text-zinc-400 hover:text-white font-semibold rounded-2xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider mt-4"
                        >
                            <ArrowLeft size={14} className="text-zinc-500 mr-1" />
                            Volver al inicio de sesión
                        </button>
                    )}
                </div>
            </motion.div>
        </main>
    );
}
