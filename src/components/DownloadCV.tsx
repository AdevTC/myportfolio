"use client";

import { FileText, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface DownloadCVProps {
    className?: string;
    variant?: "default" | "icon" | "outline" | "ghost" | "custom";
    label?: string;
    children?: React.ReactNode;
}

export default function DownloadCV({ className, variant = "default", label = "Descargar CV", children }: DownloadCVProps) {
    if (variant === "custom") {
        return (
            <a
                href="/cv.pdf"
                download="CV_Adrian_Tomas_Cerda.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={className}
                aria-label={label}
            >
                {children}
            </a>
        );
    }
    if (variant === "icon") {
        return (
            <a
                href="/cv.pdf"
                download="CV_Adrian_Tomas_Cerda.pdf" // Suggested filename for user download
                target="_blank"
                rel="noopener noreferrer"
                className={cn("p-2 hover:bg-white/10 rounded-lg transition-colors text-white", className)}
                aria-label="Descargar CV"
            >
                <FileText size={24} />
            </a>
        );
    }

    if (variant === "outline") {
        return (
            <a
                href="/cv.pdf"
                download="CV_Adrian_Tomas_Cerda.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                    "px-6 py-3 border border-white/20 hover:bg-white/5 rounded-full font-bold transition-all hover:border-white/50 flex items-center gap-2",
                    className
                )}
            >
                {label} <Download size={18} />
            </a>
        );
    }

    if (variant === "ghost") {
        return (
            <a
                href="/cv.pdf"
                download="CV_Adrian_Tomas_Cerda.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                    "p-2 hover:bg-white/5 rounded-full transition-colors text-muted-foreground hover:text-white flex items-center gap-2 text-sm font-medium",
                    className
                )}
                aria-label="Descargar CV"
            >
                <Download size={18} /> <span className="hidden lg:inline">CV</span>
            </a>
        );
    }

    return (
        <a
            href="/cv.pdf"
            download="CV_Adrian_Tomas_Cerda.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "group relative px-6 py-3 bg-primary text-white rounded-full font-bold overflow-hidden transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/50 flex items-center gap-2",
                className
            )}
        >
            <div className="absolute inset-0 w-full h-full bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            <span className="relative flex items-center gap-2">
                {label} <Download size={18} />
            </span>
        </a>
    );
}
