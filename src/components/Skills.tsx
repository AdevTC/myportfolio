"use client";

import { useState } from "react";
import Section from "./ui/Section";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Scroll, X, CheckCircle, BrainCircuit } from "lucide-react";
import { cn } from "@/lib/utils";

// --- Data Definition ---
export interface Skill {
    name: string;
    logo: string;
    description: string;
    usage: string;
    link: string;
}

export interface SkillCategory {
    id: string;
    label: string;
    skills: Skill[];
}

export const SKILLS_DATA: SkillCategory[] = [
    {
        id: "backend",
        label: "Backend & Core",
        skills: [
            { name: "Java", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg", description: "Lenguaje robusto y tipado.", usage: "Desarrollo de microservicios empresariales.", link: "https://www.java.com/" },
            { name: "Spring Boot", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg", description: "Framework líder en Java.", usage: "APIs REST, seguridad y microservicios.", link: "https://spring.io/projects/spring-boot" },
            { name: "Node.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg", description: "Runtime JS asíncrono.", usage: "Backends rápidos y escalables.", link: "https://nodejs.org/" },
            { name: "Python", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg", description: "Lenguaje versátil.", usage: "Scripting, automatización y análisis de datos.", link: "https://www.python.org/" },
            { name: "Express", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg", description: "Framework web para Node.", usage: "Middleware y APIs ligeras.", link: "https://expressjs.com/" },
            { name: "Groovy", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/groovy/groovy-original.svg", description: "Lenguaje dinámico.", usage: "Scripting avanzado en SAP CPI.", link: "https://groovy-lang.org/" },
        ]
    },
    {
        id: "frontend",
        label: "Frontend Experience",
        skills: [
            { name: "JavaScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg", description: "Lenguaje de la web.", usage: "Interactividad y lógica en cliente.", link: "https://developer.mozilla.org/es/docs/Web/JavaScript" },
            { name: "HTML5", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg", description: "Estructura web semántica.", usage: "Maquetación accesible y SEO-friendly.", link: "https://developer.mozilla.org/es/docs/Web/HTML" },
            { name: "CSS3", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg", description: "Estilos modernos.", usage: "Diseño responsivo, Grid y Flexbox.", link: "https://developer.mozilla.org/es/docs/Web/CSS" },
            { name: "React", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg", description: "Biblioteca UI.", usage: "Componentes dinámicos y SPAs.", link: "https://react.dev/" },
            { name: "Angular", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg", description: "Framework completo.", usage: "Aplicaciones empresariales robustas.", link: "https://angular.io/" },
            { name: "Next.js", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", description: "Framework React Productivo.", usage: "SSR, Rutas API y optimización.", link: "https://nextjs.org/" },
            { name: "TypeScript", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg", description: "JS con superpoderes.", usage: "Código seguro y mantenible.", link: "https://www.typescriptlang.org/" },
            { name: "Tailwind", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg", description: "Utility-first CSS.", usage: "Diseño rápido y consistente.", link: "https://tailwindcss.com/" }
        ]
    },
    {
        id: "databases",
        label: "Bases de Datos & Cloud",
        skills: [
            { name: "SQL", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg", description: "Consultas estructuradas.", usage: "Gestión de datos relacionales.", link: "https://www.mysql.com/" },
            { name: "MongoDB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg", description: "NoSQL flexible.", usage: "Datos no estructurados y prototipos.", link: "https://www.mongodb.com/" },
            { name: "Firebase", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg", description: "Backend-as-a-Service.", usage: "Auth, Realtime DB y Hosting.", link: "https://firebase.google.com/" },
            { name: "Google Cloud", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg", description: "Servicios en la nube.", usage: "Despliegues y servicios gestionados.", link: "https://cloud.google.com/" },
        ]
    },
    {
        id: "integration",
        label: "SAP & Integration Ecosystem",
        skills: [
            { name: "SAP BTP", logo: "https://cdn.worldvectorlogo.com/logos/sap-3.svg", description: "Business Technology Platform.", usage: "Desarrollo y extensión en la nube.", link: "https://www.sap.com/products/technology-platform.html" },
            { name: "SAP CPI", logo: "https://cdn.worldvectorlogo.com/logos/sap-3.svg", description: "Cloud Platform Integration.", usage: "Orquestación de flujos de integración.", link: "https://www.sap.com/products/technology-platform/integration-suite.html" },
            { name: "SAP CAP", logo: "https://cdn.worldvectorlogo.com/logos/sap-3.svg", description: "Cloud Application Programming.", usage: "Desarrollo rápido de servicios empresariales.", link: "https://cap.cloud.sap/" },
            { name: "SAP BAS", logo: "https://cdn.worldvectorlogo.com/logos/sap-3.svg", description: "Business Application Studio.", usage: "IDE en la nube para desarrollo SAP.", link: "https://help.sap.com/docs/bas" },
            { name: "NetWeaver", logo: "https://cdn.worldvectorlogo.com/logos/sap-3.svg", description: "Plataforma de integración.", usage: "Gestión de stacks ABAP/Java.", link: "https://www.sap.com/products/technology-platform.html" },
            { name: "SuccessFactors", logo: "https://cdn.worldvectorlogo.com/logos/sap-3.svg", description: "Suite HCM.", usage: "Integración de datos de RRHH.", link: "https://www.sap.com/products/hcm.html" },
            { name: "OData", logo: "/ODataLogo-250.png", description: "Protocolo Open Data.", usage: "APIs RESTful estándar.", link: "https://www.odata.org/" },
            { name: "SOAP", logo: "/api-soap-cloud.jpg", description: "Simple Object Access Protocol.", usage: "Integraciones legacy robustas.", link: "https://www.w3.org/TR/soap/" }, // Generic placeholder visual for protocol
            { name: "SOAPUI", logo: "/soapui.png", description: "Testing de APIs.", usage: "Pruebas funcionales de servicios SOAP/REST.", link: "https://www.soapui.org/" },
            { name: "HL7", logo: "/hl7.jpg", description: "Estándar de salud.", usage: "Intercambio de información médica.", link: "https://www.hl7.org/" },
            { name: "Mappings", logo: "https://cdn-icons-png.flaticon.com/512/1006/1006560.png", description: "Transformación de datos.", usage: "Conversión de estructuras complejas (XSLT, Groovy).", link: "https://www.w3.org/TR/xslt/" },
            { name: "FTP/SFTP", logo: "https://cdn-icons-png.flaticon.com/512/2333/2333452.png", description: "Transferencia de archivos.", usage: "Intercambio seguro de ficheros batch.", link: "https://en.wikipedia.org/wiki/SSH_File_Transfer_Protocol" },
        ]
    },
    {
        id: "tools",
        label: "Herramientas & DevTools",
        skills: [
            { name: "Git", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg", description: "Control de versiones.", usage: "Gestión de código fuente distribuido.", link: "https://git-scm.com/" },
            { name: "GitHub", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", description: "Plataforma de desarrollo.", usage: "CI/CD, Pull Requests y colaboración.", link: "https://github.com/" },
            { name: "VS Code", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg", description: "Editor de código.", usage: "IDE principal con extensiones potentes.", link: "https://code.visualstudio.com/" },
            { name: "Docker", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg", description: "Contenedores.", usage: "Despliegues consistentes y aislados.", link: "https://www.docker.com/" },
            { name: "Postman", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg", description: "Cliente API.", usage: "Pruebas y documentación de endpoints.", link: "https://www.postman.com/" },
            { name: "Notepad++", logo: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Notepad_plus_plus.png", description: "Editor ligero.", usage: "Edición rápida de logs y scripts.", link: "https://notepad-plus-plus.org/" },
            { name: "Base64", logo: "https://cdn-icons-png.flaticon.com/512/2304/2304626.png", description: "Codificación de datos.", usage: "Transmisión de binarios en texto plano.", link: "https://en.wikipedia.org/wiki/Base64" },
        ]
    },
    {
        id: "office",
        label: "Ofimática & Productividad",
        skills: [
            { name: "Excel", logo: "/excel.png", description: "Hojas de cálculo.", usage: "Análisis de datos y macros.", link: "https://www.microsoft.com/es-es/microsoft-365/excel" },
            { name: "Word", logo: "/word.webp", description: "Procesador de texto.", usage: "Documentación técnica y funcional.", link: "https://www.microsoft.com/es-es/microsoft-365/word" },
            { name: "PowerPoint", logo: "/microsoft-power-point-mobile-apps-logo-free-png.png", description: "Presentaciones.", usage: "Exposición de propuestas y demos.", link: "https://www.microsoft.com/es-es/microsoft-365/powerpoint" },
            { name: "Google Workspace", logo: "/google_logo.jpg", description: "Suite colaborativa.", usage: "Docs, Drive y colaboración en tiempo real.", link: "https://workspace.google.com/" },
        ]
    },
    {
        id: "multimedia",
        label: "Multimedia & Diseño",
        skills: [
            { name: "Canva", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg", description: "Diseño gráfico ágil.", usage: "Creación rápida de assets visuales.", link: "https://www.canva.com/" },
            { name: "Sony Vegas", logo: "/sonyvegas.png", description: "Edición de vídeo.", usage: "Montaje profesional de clips.", link: "https://www.vegascreativesoftware.com/" },
            { name: "DaVinci Resolve", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/DaVinci_Resolve_Studio.png", description: "Color y posproducción.", usage: "Edición de vídeo avanzada y color grading.", link: "https://www.blackmagicdesign.com/products/davinciresolve" },
            { name: "CapCut", logo: "/capcut.jpg", description: "Edición móvil/rápida.", usage: "Contenido para redes sociales.", link: "https://www.capcut.com/" },
            { name: "Clipchamp", logo: "/clipchamp.avif", description: "Editor de vídeo web.", usage: "Edición rápida en la nube.", link: "https://clipchamp.com/" },
            { name: "Photopea", logo: "/photopealogo.webp", description: "Editor de imagen web.", usage: "Retoque fotográfico accesible.", link: "https://www.photopea.com/" },
        ]
    }
];

const SOFT_SKILLS = [
    "Liderazgo", "Trabajo en Equipo", "Comunicación Efectiva", "Proactividad", "Resiliencia",
    "Adaptabilidad", "Resolución de Problemas", "Gestión del Tiempo", "Empatía", "Creatividad",
    "Pensamiento Crítico", "Inteligencia Emocional", "Toma de Decisiones", "Negociación",
    "Aprendizaje Continuo", "Atención al Detalle", "Organización", "Autonomía", "Gestión del Estrés",
    "Mentalidad de Crecimiento", "Colaboración Remota", "Feedback Constructivo"
];

// --- Components ---

function ViewToggle({ view, onChange }: { view: 'grid' | 'marquee', onChange: (v: 'grid' | 'marquee') => void }) {
    return (
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-fit mx-auto mb-12">
            <button
                onClick={() => onChange('grid')}
                className={cn(
                    "flex items-center gap-2 px-6 py-2 rounded-lg transition-all font-medium",
                    view === 'grid' ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-white"
                )}
            >
                <LayoutGrid size={18} /> Grid
            </button>
            <button
                onClick={() => onChange('marquee')}
                className={cn(
                    "flex items-center gap-2 px-6 py-2 rounded-lg transition-all font-medium",
                    view === 'marquee' ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-white"
                )}
            >
                <Scroll size={18} /> Marquee
            </button>
        </div>
    );
}

function Marquee({ items, direction = "left", speed = 50 }: { items: Skill[], direction?: "left" | "right", speed?: number }) {
    return (
        <div className="flex overflow-hidden w-full relative group">
            <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />

            <motion.div
                initial={{ x: direction === "left" ? 0 : "-50%" }}
                animate={{ x: direction === "left" ? "-50%" : 0 }}
                transition={{ repeat: Infinity, ease: "linear", duration: speed }}
                className="flex gap-4 py-4 min-w-max"
            >
                {[...items, ...items, ...items, ...items].map((skill, idx) => (
                    <div
                        key={`${skill.name}-${idx}`}
                        className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-lg font-medium hover:bg-primary/20 hover:border-primary/50 transition-colors cursor-default whitespace-nowrap flex items-center gap-3 backdrop-blur-sm"
                    >
                        <img src={skill.logo} alt={skill.name} className="w-6 h-6 object-contain" />
                        {skill.name}
                    </div>
                ))}
            </motion.div>
        </div>
    );
}

function GridView({ category, onSelect }: { category: SkillCategory, onSelect: (s: Skill) => void }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {category.skills.map((skill) => (
                <motion.div
                    key={skill.name}
                    layoutId={`skill-${skill.name}`}
                    onClick={() => onSelect(skill)}
                    className="group relative bg-white/5 border border-white/10 p-4 rounded-2xl cursor-pointer hover:bg-white/10 hover:border-primary/30 transition-all text-center flex flex-col items-center gap-3 h-full justify-start min-h-[140px]"
                    whileHover={{ y: -5 }}
                >
                    <div className="p-3 bg-white/5 rounded-full group-hover:scale-110 transition-transform duration-300 w-16 h-16 flex items-center justify-center">
                        <img src={skill.logo} alt={skill.name} className="w-10 h-10 object-contain" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm mb-1">{skill.name}</h4>
                        <p className="text-[10px] text-muted-foreground line-clamp-2 leading-tight hidden lg:block">{skill.description}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}

export default function Skills() {
    const [viewMode, setViewMode] = useState<'grid' | 'marquee'>('grid');
    const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

    return (
        <Section id="skills" className="overflow-hidden py-24">
            <h2 className="text-3xl md:text-5xl font-bold mb-8 text-center">
                Arsenal <span className="text-primary">Tecnológico</span>
            </h2>

            <ViewToggle view={viewMode} onChange={setViewMode} />

            <div className="space-y-16 max-w-7xl mx-auto mb-24">
                {SKILLS_DATA.map((category) => (
                    <div key={category.id} className="relative">
                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <span className="w-1 h-8 bg-primary rounded-full" />
                            {category.label}
                        </h3>

                        {viewMode === 'marquee' ? (
                            <Marquee
                                items={category.skills}
                                direction={['frontend', 'integration', 'office'].includes(category.id) ? 'right' : 'left'}
                                speed={Math.random() * (50 - 30) + 30}
                            />
                        ) : (
                            <GridView category={category} onSelect={setSelectedSkill} />
                        )}
                    </div>
                ))}
            </div>

            {/* Soft Skills Section */}
            <div className="max-w-6xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-8 flex items-center justify-center gap-3">
                    <BrainCircuit className="text-primary" size={32} />
                    Habilidades <span className="text-primary">Blandas</span>
                </h2>
                <div className="flex flex-wrap justify-center gap-3">
                    {SOFT_SKILLS.map((skill, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.02 }}
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                            className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium cursor-default hover:border-primary/50 transition-colors"
                        >
                            {skill}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedSkill && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedSkill(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            layoutId={`skill-${selectedSkill.name}`}
                            className="relative w-full max-w-lg bg-[#0f172a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10"
                        >
                            <div className="p-8 relative">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedSkill(null); }}
                                    className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-white"
                                >
                                    <X size={20} />
                                </button>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 w-20 h-20 flex items-center justify-center bg-white">
                                        <img src={selectedSkill.logo} alt={selectedSkill.name} className="w-16 h-16 object-contain" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-bold">{selectedSkill.name}</h3>
                                        <p className="text-muted-foreground">{selectedSkill.description}</p>
                                    </div>
                                </div>

                                <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                                    <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-2 font-bold">
                                        <CheckCircle size={14} className="text-primary" /> Uso Profesional
                                    </h4>
                                    <p className="text-slate-300 leading-relaxed text-sm">
                                        {selectedSkill.usage}
                                    </p>
                                </div>

                                <a
                                    href={selectedSkill.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-6 w-full py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-primary/20"
                                >
                                    Visitar Sitio Oficial
                                </a>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Section>
    );
}
