"use client";

import * as React from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
    Home,
    Briefcase,
    Code2,
    Mail,
    Moon,
    Sun,
    Palette,
    GraduationCap,
    Cpu,
    MessageSquare,
    Gamepad2
} from "lucide-react";
import { useThemeStore, THEME_COLORS, PrimaryColor } from "@/store/themeStore";

export function CommandPalette() {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();
    const { toggleDarkMode, setPrimaryColor } = useThemeStore();

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        }
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    return (
        <Command.Dialog
            open={open}
            onOpenChange={setOpen}
            label="Command Menu"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 pt-[20vh]"
            onClick={() => setOpen(false)}
        >
            <div
                className="max-w-xl mx-auto w-full bg-[#1e293b] rounded-xl shadow-2xl border border-white/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center border-b border-white/10 px-3">
                    <Command.Input
                        placeholder="Escribe un comando o busca..."
                        className="w-full bg-transparent p-4 text-white placeholder:text-muted-foreground outline-none border-none"
                    />
                </div>

                <Command.List className="max-h-[300px] overflow-y-auto p-2 scroll-py-2">
                    <Command.Empty className="p-4 text-center text-sm text-muted-foreground">Sin resultados.</Command.Empty>

                    <Command.Group heading="Navegación" className="text-xs font-bold text-muted-foreground px-2 py-1 mb-1">
                        <Command.Item
                            onSelect={() => runCommand(() => router.push("/"))}
                            className="flex items-center gap-2 px-2 py-2 text-sm text-white rounded-lg aria-selected:bg-primary/20 aria-selected:text-primary cursor-pointer transition-colors"
                        >
                            <Home size={16} /> Inicio
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => router.push("/about"))}
                            className="flex items-center gap-2 px-2 py-2 text-sm text-white rounded-lg aria-selected:bg-primary/20 aria-selected:text-primary cursor-pointer transition-colors"
                        >
                            <User size={16} /> Sobre Mí
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => router.push("/experience"))}
                            className="flex items-center gap-2 px-2 py-2 text-sm text-white rounded-lg aria-selected:bg-primary/20 aria-selected:text-primary cursor-pointer transition-colors"
                        >
                            <Briefcase size={16} /> Experiencia
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => router.push("/projects"))}
                            className="flex items-center gap-2 px-2 py-2 text-sm text-white rounded-lg aria-selected:bg-primary/20 aria-selected:text-primary cursor-pointer transition-colors"
                        >
                            <Code2 size={16} /> Proyectos
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => router.push("/education"))}
                            className="flex items-center gap-2 px-2 py-2 text-sm text-white rounded-lg aria-selected:bg-primary/20 aria-selected:text-primary cursor-pointer transition-colors"
                        >
                            <GraduationCap size={16} /> Educación
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => router.push("/skills"))}
                            className="flex items-center gap-2 px-2 py-2 text-sm text-white rounded-lg aria-selected:bg-primary/20 aria-selected:text-primary cursor-pointer transition-colors"
                        >
                            <Cpu size={16} /> Habilidades
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => router.push("/testimonials"))}
                            className="flex items-center gap-2 px-2 py-2 text-sm text-white rounded-lg aria-selected:bg-primary/20 aria-selected:text-primary cursor-pointer transition-colors"
                        >
                            <MessageSquare size={16} /> Testimonios
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => router.push("/hobbies"))}
                            className="flex items-center gap-2 px-2 py-2 text-sm text-white rounded-lg aria-selected:bg-primary/20 aria-selected:text-primary cursor-pointer transition-colors"
                        >
                            <Gamepad2 size={16} /> Hobbies
                        </Command.Item>
                        <Command.Item
                            onSelect={() => runCommand(() => router.push("/contact"))}
                            className="flex items-center gap-2 px-2 py-2 text-sm text-white rounded-lg aria-selected:bg-primary/20 aria-selected:text-primary cursor-pointer transition-colors"
                        >
                            <Mail size={16} /> Contacto
                        </Command.Item>

                    </Command.Group>

                    <Command.Separator className="h-px bg-white/10 my-2" />

                    <Command.Group heading="Tema" className="text-xs font-bold text-muted-foreground px-2 py-1 mb-1">
                        <Command.Item
                            onSelect={() => runCommand(toggleDarkMode)}
                            className="flex items-center gap-2 px-2 py-2 text-sm text-white rounded-lg aria-selected:bg-primary/20 aria-selected:text-primary cursor-pointer transition-colors"
                        >
                            <Moon size={16} /> Alternar Modo Oscuro
                        </Command.Item>

                        {Object.keys(THEME_COLORS).map((color) => (
                            <Command.Item
                                key={color}
                                onSelect={() => runCommand(() => setPrimaryColor(color as PrimaryColor))}
                                className="flex items-center gap-2 px-2 py-2 text-sm text-white rounded-lg aria-selected:bg-primary/20 aria-selected:text-primary cursor-pointer transition-colors capitalize"
                            >
                                <div className="w-3 h-3 rounded-full" style={{ background: THEME_COLORS[color as PrimaryColor] }} />
                                Color {color}
                            </Command.Item>
                        ))}
                    </Command.Group>
                </Command.List>

                <div className="border-t border-white/10 p-2 flex justify-between items-center text-[10px] text-muted-foreground px-4">
                    <span>Navega con ↑↓</span>
                    <span className="flex items-center gap-1">
                        <span className="bg-white/10 px-1 rounded">↵</span> para seleccionar
                    </span>
                </div>
            </div>
        </Command.Dialog>
    )
}
