"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { verifyAdminPassword } from "@/app/actions";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, deleteDoc, getDocs } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Eye, Users, Clock, LogOut, CheckCircle, Terminal, Laptop, Trash2, Key, Heart, RefreshCw } from "lucide-react";

interface SessionData {
    sessionId: string;
    visitorId: string;
    userId: string;
    email: string;
    name: string;
    device: string;
    pagesVisited: string[];
    startedAt: any;
    lastActive: any;
    duration: number;
}

interface LikeLog {
    id: string;
    type: "web" | "comment";
    userName: string;
    userEmail: string;
    userId: string;
    likedAt: Date;
    targetId?: string;
    commentText?: string;
}

export default function AdminPage() {
    const { user, logout } = useAuth();
    const [adminVerified, setAdminVerified] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [verifyError, setVerifyError] = useState<string | null>(null);
    const [checkingAuth, setCheckingAuth] = useState(true);
    
    // Analytics states
    const [sessions, setSessions] = useState<SessionData[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    // Likes states
    const [likesLog, setLikesLog] = useState<LikeLog[]>([]);
    const [loadingLikes, setLoadingLikes] = useState(true);

    const fetchAllLikes = async () => {
        setLoadingLikes(true);
        try {
            const logItems: LikeLog[] = [];
            
            // 1. Fetch portfolio likes
            const portLikesSnap = await getDocs(collection(db, "portfolio", "stats", "likes"));
            portLikesSnap.forEach((doc) => {
                const data = doc.data();
                logItems.push({
                    id: doc.id,
                    type: "web",
                    userName: data.name || "",
                    userEmail: data.email || "",
                    userId: data.userId || doc.id,
                    likedAt: data.likedAt?.toDate() || new Date()
                });
            });

            // 2. Fetch comments and their likes
            const commentsSnap = await getDocs(collection(db, "comments"));
            for (const commentDoc of commentsSnap.docs) {
                const commentData = commentDoc.data();
                const commentLikesSnap = await getDocs(collection(db, "comments", commentDoc.id, "likes"));
                commentLikesSnap.forEach((likeDoc) => {
                    const likeData = likeDoc.data();
                    logItems.push({
                        id: `${commentDoc.id}_${likeDoc.id}`,
                        type: "comment",
                        userName: likeData.name || "",
                        userEmail: likeData.email || "",
                        userId: likeData.userId || likeDoc.id,
                        likedAt: likeData.likedAt?.toDate() || new Date(),
                        targetId: commentDoc.id,
                        commentText: commentData.message || ""
                    });
                });
            }

            // 3. Sort by likedAt descending
            logItems.sort((a, b) => b.likedAt.getTime() - a.likedAt.getTime());

            // 4. Map UIDs to emails/names using session data as fallback
            const userDetailsMap = new Map<string, { name: string, email: string }>();
            sessions.forEach(s => {
                if (s.userId && s.userId !== "anonymous") {
                    userDetailsMap.set(s.userId, { name: s.name, email: s.email });
                }
            });

            const resolvedItems = logItems.map(item => {
                let name = item.userName;
                let email = item.userEmail;
                if (!name || !email) {
                    const fallback = userDetailsMap.get(item.userId);
                    if (fallback) {
                        name = name || fallback.name;
                        email = email || fallback.email;
                    }
                }
                return {
                    ...item,
                    userName: name || "Usuario Registrado",
                    userEmail: email || `UID: ${item.userId.substring(0, 8)}...`
                };
            });

            setLikesLog(resolvedItems);
        } catch (err) {
            console.error("Error fetching likes log:", err);
        } finally {
            setLoadingLikes(false);
        }
    };

    useEffect(() => {
        if (!adminVerified || loadingData) return;
        fetchAllLikes();
    }, [adminVerified, loadingData, sessions.length]);

    // 1. Password or automatic authentication check
    useEffect(() => {
        if (typeof window !== "undefined") {
            const isLocalVerified = localStorage.getItem("portfolio_admin_verified") === "true";
            if (isLocalVerified) {
                setAdminVerified(true);
            }
        }
        setCheckingAuth(false);
    }, []);

    // 2. Auto-verify if logged email is owner, and de-authorize on global logout
    useEffect(() => {
        if (user) {
            if (user.email === "adriantomascv@gmail.com") {
                setAdminVerified(true);
                if (typeof window !== "undefined") {
                    localStorage.setItem("portfolio_admin_verified", "true");
                }
            }
        } else {
            setAdminVerified(false);
            if (typeof window !== "undefined") {
                localStorage.removeItem("portfolio_admin_verified");
            }
        }
    }, [user]);

    // 3. Real-time stats listener when verified
    useEffect(() => {
        if (!adminVerified) return;

        const sessionsQuery = query(collection(db, "sessions"), orderBy("lastActive", "desc"));
        
        const unsubscribe = onSnapshot(sessionsQuery, (snapshot) => {
            const loadedSessions: SessionData[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                loadedSessions.push({
                    sessionId: data.sessionId,
                    visitorId: data.visitorId,
                    userId: data.userId,
                    email: data.email,
                    name: data.name,
                    device: data.device,
                    pagesVisited: data.pagesVisited || [],
                    startedAt: data.startedAt?.toDate() || new Date(),
                    lastActive: data.lastActive?.toDate() || new Date(),
                    duration: data.duration || 0
                });
            });
            setSessions(loadedSessions);
            setLoadingData(false);
        }, (error) => {
            console.error("Error fetching sessions in real-time:", error);
            setLoadingData(false);
        });

        return () => unsubscribe();
    }, [adminVerified]);

    const handlePasswordVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setVerifyError(null);

        try {
            const res = await verifyAdminPassword(passwordInput);
            if (res.success) {
                setAdminVerified(true);
                if (typeof window !== "undefined") {
                    localStorage.setItem("portfolio_admin_verified", "true");
                }
            } else {
                setVerifyError(res.error || "Contraseña incorrecta.");
            }
        } catch (err) {
            console.error("Error verifying admin password:", err);
            setVerifyError("Error al validar con el servidor.");
        }
    };

    const handleAdminLogout = () => {
        setAdminVerified(false);
        if (typeof window !== "undefined") {
            localStorage.removeItem("portfolio_admin_verified");
        }
    };

    const handleDeleteSession = async (sessionId: string) => {
        if (confirm("¿Seguro que deseas eliminar el log de esta sesión?")) {
            try {
                await deleteDoc(doc(db, "sessions", sessionId));
            } catch (err) {
                console.error("Error deleting session log:", err);
            }
        }
    };

    // --- Analytics Processing ---
    // A. Visitas totales
    const totalVisits = sessions.length;

    // B. Usuarios Únicos (unicidad por visitorId)
    const uniqueUsersCount = new Set(sessions.map(s => s.visitorId)).size;

    // C. Usuarios Logueados Únicos
    const loggedUsers = Array.from(
        new Map(
            sessions
                .filter(s => s.userId !== "anonymous" && s.email !== "anonymous")
                .map(s => [s.email, { email: s.email, name: s.name, lastActive: s.lastActive }])
        ).values()
    );

    // D. Tiempo promedio de permanencia (segundos a formato minutos/segundos)
    const averageDurationSecs = totalVisits > 0 
        ? sessions.reduce((acc, s) => acc + s.duration, 0) / totalVisits 
        : 0;

    const formatDuration = (seconds: number) => {
        if (seconds < 60) return `${Math.round(seconds)}s`;
        const mins = Math.floor(seconds / 60);
        const secs = Math.round(seconds % 60);
        return `${mins}m ${secs}s`;
    };

    const isSessionActive = (lastActiveDate: Date) => {
        const diffMs = new Date().getTime() - lastActiveDate.getTime();
        return diffMs < 60000; // Active if updated in the last 60 seconds
    };

    if (checkingAuth) {
        return (
            <div className="min-h-screen w-full flex items-center justify-center bg-[#030408]">
                <div className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    // --- Render Login / Lock Screen ---
    if (!adminVerified) {
        return (
            <main className="min-h-screen w-full flex flex-col justify-center items-center p-6 relative overflow-hidden select-none bg-[#030408]">
                {/* Background Auras */}
                <div className="absolute top-[30%] left-[30%] w-[30vw] h-[30vw] rounded-full blur-[140px] pointer-events-none" 
                    style={{ backgroundColor: "color-mix(in srgb, var(--primary) 10%, transparent)" }}
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative w-full max-w-md glass rounded-3xl overflow-hidden shadow-2xl z-10 border border-white/5 bg-[#030408]/65 backdrop-blur-xl p-8"
                    style={{
                        boxShadow: "0 25px 70px -15px rgba(0,0,0,0.8), 0 0 30px -5px color-mix(in srgb, var(--primary) 15%, transparent)"
                    }}
                >
                    <div className="text-center mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                            <Lock style={{ color: "var(--primary)" }} size={22} />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight">Panel de Administración</h1>
                        <p className="text-zinc-500 text-xs mt-1 leading-relaxed">
                            Acceso restringido para el desarrollador. Introduce la clave de acceso.
                        </p>
                    </div>

                    <form onSubmit={handlePasswordVerify} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider">Contraseña de Control</label>
                            <div className="relative">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                                <input 
                                    type="password" 
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-12 pr-4 py-3 bg-black/40 border border-white/10 rounded-2xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-primary/50 focus:bg-zinc-950/85 transition-all"
                                />
                            </div>
                        </div>

                        {verifyError && (
                            <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
                                {verifyError}
                            </div>
                        )}

                        <button
                            type="submit"
                            style={{ 
                                boxShadow: "0 10px 20px -5px color-mix(in srgb, var(--primary) 20%, transparent)" 
                            }}
                            className="w-full py-3 bg-primary hover:brightness-110 active:scale-98 text-white font-bold rounded-2xl transition-all text-xs uppercase tracking-wider mt-4"
                        >
                            Verificar Acceso
                        </button>
                    </form>
                </motion.div>
            </main>
        );
    }

    // --- Render Admin Panel Dashboard ---
    return (
        <main className="min-h-screen bg-[#030408] text-white p-6 md:p-12 relative overflow-hidden pt-24">
            {/* Background Auras */}
            <div className="absolute top-[-10%] right-[-10%] w-[45vw] h-[45vw] rounded-full blur-[160px] pointer-events-none" 
                style={{ backgroundColor: "color-mix(in srgb, var(--primary) 6%, transparent)" }}
            />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full blur-[160px] pointer-events-none" 
                style={{ backgroundColor: "color-mix(in srgb, var(--primary) 4%, transparent)" }}
            />

            <div className="max-w-7xl mx-auto space-y-8 relative z-10">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6">
                    <div>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full glass text-[10px] font-mono text-zinc-400 mb-2 border border-white/5 w-fit">
                            CENTRO DE CONTROL
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400">
                            Consola Analítica
                        </h1>
                    </div>
                    <button 
                        onClick={handleAdminLogout}
                        className="px-4 py-2 border border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all"
                    >
                        <LogOut size={14} /> Cerrar Consola
                    </button>
                </div>

                {/* KPI Bento Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Visits */}
                    <div className="glass p-6 rounded-2xl flex flex-col justify-between border-white/5 shadow-sm">
                        <div className="flex items-center justify-between text-zinc-500">
                            <span className="text-[10px] font-mono uppercase tracking-wider">Visitas Totales</span>
                            <Eye size={20} className="text-primary" />
                        </div>
                        <div className="mt-4">
                            <span className="text-3xl font-extrabold tracking-tight">{loadingData ? "..." : totalVisits}</span>
                            <p className="text-[10px] text-zinc-500 mt-1">Sesiones de pestaña abiertas</p>
                        </div>
                    </div>

                    {/* Unique Users */}
                    <div className="glass p-6 rounded-2xl flex flex-col justify-between border-white/5 shadow-sm">
                        <div className="flex items-center justify-between text-zinc-500">
                            <span className="text-[10px] font-mono uppercase tracking-wider">Usuarios Únicos</span>
                            <Users size={20} className="text-blue-400" />
                        </div>
                        <div className="mt-4">
                            <span className="text-3xl font-extrabold tracking-tight">{loadingData ? "..." : uniqueUsersCount}</span>
                            <p className="text-[10px] text-zinc-500 mt-1">Identificadores de navegador únicos</p>
                        </div>
                    </div>

                    {/* Logged Users */}
                    <div className="glass p-6 rounded-2xl flex flex-col justify-between border-white/5 shadow-sm">
                        <div className="flex items-center justify-between text-zinc-500">
                            <span className="text-[10px] font-mono uppercase tracking-wider">Usuarios Registrados</span>
                            <CheckCircle size={20} className="text-emerald-400" />
                        </div>
                        <div className="mt-4">
                            <span className="text-3xl font-extrabold tracking-tight">{loadingData ? "..." : loggedUsers.length}</span>
                            <p className="text-[10px] text-zinc-500 mt-1">Usuarios autenticados</p>
                        </div>
                    </div>

                    {/* Average Stay */}
                    <div className="glass p-6 rounded-2xl flex flex-col justify-between border-white/5 shadow-sm">
                        <div className="flex items-center justify-between text-zinc-500">
                            <span className="text-[10px] font-mono uppercase tracking-wider">Estancia Media</span>
                            <Clock size={20} className="text-amber-400" />
                        </div>
                        <div className="mt-4">
                            <span className="text-3xl font-extrabold tracking-tight">{loadingData ? "..." : formatDuration(averageDurationSecs)}</span>
                            <p className="text-[10px] text-zinc-500 mt-1">Tiempo de foco activo promedio</p>
                        </div>
                    </div>
                </div>

                {/* Registered Users Section */}
                <div className="glass rounded-2xl border-white/5 overflow-hidden">
                    <div className="px-6 py-5 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                        <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                            <Users size={16} className="text-primary" />
                            Registro de Cuentas Autenticadas ({loggedUsers.length})
                        </h3>
                    </div>
                    {loadingData ? (
                        <div className="p-8 text-center text-zinc-500 text-xs font-mono">Cargando cuentas...</div>
                    ) : loggedUsers.length === 0 ? (
                        <div className="p-8 text-center text-zinc-500 text-xs font-mono">No se han registrado usuarios aún.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs font-mono">
                                <thead className="bg-white/[0.02] border-b border-white/5 text-zinc-400 uppercase">
                                    <tr>
                                        <th className="px-6 py-3.5">Usuario</th>
                                        <th className="px-6 py-3.5">Correo</th>
                                        <th className="px-6 py-3.5">Última Actividad</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {loggedUsers.map((u, i) => (
                                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4 font-semibold text-white">{u.name}</td>
                                            <td className="px-6 py-4 text-zinc-400">{u.email}</td>
                                            <td className="px-6 py-4 text-zinc-500">{u.lastActive.toLocaleDateString()} {u.lastActive.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Likes Registry Section */}
                <div className="glass rounded-2xl border-white/5 overflow-hidden">
                    <div className="px-6 py-5 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                        <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                            <Heart size={16} className="text-red-500 fill-red-500/20" />
                            Registro de Likes del Portfolio (Web y Comentarios) ({likesLog.length})
                        </h3>
                        <button
                            onClick={fetchAllLikes}
                            disabled={loadingLikes}
                            className="p-2 hover:bg-white/5 text-zinc-400 hover:text-white rounded-xl transition-all flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider border border-white/10"
                        >
                            <RefreshCw size={12} className={loadingLikes ? "animate-spin" : ""} />
                            Actualizar
                        </button>
                    </div>
                    {loadingLikes ? (
                        <div className="p-8 text-center text-zinc-500 text-xs font-mono">Cargando registro de likes...</div>
                    ) : likesLog.length === 0 ? (
                        <div className="p-8 text-center text-zinc-500 text-xs font-mono">No se han registrado likes todavía.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs font-mono">
                                <thead className="bg-white/[0.02] border-b border-white/5 text-zinc-400 uppercase">
                                    <tr>
                                        <th className="px-6 py-3.5">Tipo</th>
                                        <th className="px-6 py-3.5">Usuario</th>
                                        <th className="px-6 py-3.5">Detalle / Destino</th>
                                        <th className="px-6 py-3.5">Fecha</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {likesLog.map((item) => (
                                        <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4">
                                                {item.type === "web" ? (
                                                    <span className="px-2 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-[9px] uppercase tracking-wider">
                                                        💖 Web Global
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold text-[9px] uppercase tracking-wider">
                                                        💬 Comentario
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-white">{item.userName}</span>
                                                    <span className="text-[10px] text-zinc-500">{item.userEmail}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-zinc-400 max-w-xs md:max-w-md truncate">
                                                {item.type === "web" ? (
                                                    <span className="text-zinc-500 italic">Me gusta al portfolio completo</span>
                                                ) : (
                                                    <span title={item.commentText}>"{item.commentText}"</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-zinc-500">
                                                {item.likedAt.toLocaleDateString()} {item.likedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Session Logs (Live Activity Feed) */}
                <div className="glass rounded-2xl border-white/5 overflow-hidden">
                    <div className="px-6 py-5 border-b border-white/5 bg-white/[0.01] flex items-center justify-between">
                        <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                            <Terminal size={16} className="text-primary" />
                            Logs de Sesiones Activas en Vivo ({sessions.length})
                        </h3>
                    </div>

                    {loadingData ? (
                        <div className="p-8 text-center text-zinc-500 text-xs font-mono">Cargando sesiones...</div>
                    ) : sessions.length === 0 ? (
                        <div className="p-8 text-center text-zinc-500 text-xs font-mono">No hay datos de sesión registrados.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs font-mono">
                                <thead className="bg-white/[0.02] border-b border-white/5 text-zinc-400 uppercase">
                                    <tr>
                                        <th className="px-6 py-3.5">Estado</th>
                                        <th className="px-6 py-3.5">Identidad</th>
                                        <th className="px-6 py-3.5">Dispositivo</th>
                                        <th className="px-6 py-3.5">Permanencia</th>
                                        <th className="px-6 py-3.5">Rutas Visitadas</th>
                                        <th className="px-6 py-3.5 text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {sessions.map((s) => {
                                        const active = isSessionActive(s.lastActive);
                                        return (
                                            <tr key={s.sessionId} className="hover:bg-white/[0.02] transition-colors group">
                                                {/* LED Indicator */}
                                                <td className="px-6 py-4">
                                                    <span className="relative flex h-2 w-2">
                                                        {active && (
                                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                                        )}
                                                        <span className={`relative inline-flex rounded-full h-2 w-2 ${active ? 'bg-emerald-400' : 'bg-zinc-700'}`}></span>
                                                    </span>
                                                </td>

                                                {/* User Info */}
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-white">
                                                            {s.name !== "anonymous" ? s.name : "Anónimo"}
                                                        </span>
                                                        <span className="text-[10px] text-zinc-500">
                                                            {s.email !== "anonymous" ? s.email : s.visitorId}
                                                        </span>
                                                    </div>
                                                </td>

                                                {/* Device */}
                                                <td className="px-6 py-4 text-zinc-400">
                                                    <span className="flex items-center gap-1.5">
                                                        <Laptop size={14} className="text-zinc-600" />
                                                        {s.device}
                                                    </span>
                                                </td>

                                                {/* Duration */}
                                                <td className="px-6 py-4 text-zinc-300 font-bold">{formatDuration(s.duration)}</td>

                                                {/* Route Paths */}
                                                <td className="px-6 py-4 text-zinc-500 max-w-xs md:max-w-sm truncate">
                                                    <div className="flex items-center gap-1.5 flex-wrap overflow-hidden">
                                                        {s.pagesVisited.map((p, idx) => (
                                                            <span key={idx} className="flex items-center gap-1">
                                                                <span className="px-1.5 py-0.5 bg-white/3 rounded text-[9px] border border-white/5 text-zinc-400">{p === "/" ? "inicio" : p.replace("/", "")}</span>
                                                                {idx < s.pagesVisited.length - 1 && <span className="text-[9px] text-zinc-700">➔</span>}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </td>

                                                {/* Delete Action */}
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        onClick={() => handleDeleteSession(s.sessionId)}
                                                        className="text-zinc-600 hover:text-red-400 p-1 rounded hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                                                        title="Eliminar sesión"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
