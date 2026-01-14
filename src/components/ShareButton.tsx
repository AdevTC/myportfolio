"use client";

import { useState } from "react";
import { Share2, Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
    className?: string;
    variant?: "icon" | "full";
}

export default function ShareButton({ className, variant = "icon", children }: ShareButtonProps & { children?: React.ReactNode }) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText("https://adriantomascerda.vercel.app/");
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <button
            onClick={handleShare}
            className={cn(
                "relative transition-all duration-300 group flex items-center justify-center",
                className
            )}
            title="Copiar enlace del portafolio"
            aria-label="Compartir portafolio"
        >
            {/* If children provided, render them. Otherwise render default icon logic */}
            {children ? (
                <>
                    {children}
                    {/* Copied Feedback Overlay for custom layouts? 
                        Maybe just simple feedback like text change or internal icon switch if the user provided the icon.
                        For now, let's assume the user handles the icon in children or we just overlay the check mark if variant='icon'.
                        Actually, let's keep the overlay logic but position it relative to the button.
                    */}
                    <div className={cn(
                        "absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl text-green-500 transition-all duration-300",
                        copied ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
                    )}>
                        <Check size={20} />
                    </div>
                </>
            ) : (
                <>
                    <div className={cn(
                        "transition-all duration-300 transform",
                        copied ? "scale-0 opacity-0 absolute" : "scale-100 opacity-100"
                    )}>
                        <Share2 size={20} />
                    </div>

                    <div className={cn(
                        "transition-all duration-300 transform absolute text-green-500",
                        copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
                    )}>
                        <Check size={20} />
                    </div>

                    {variant === "full" && (
                        <span className="ml-2 font-medium">
                            {copied ? "¡Enlace Copiado!" : "Compartir"}
                        </span>
                    )}
                </>
            )}
        </button>
    );
}
