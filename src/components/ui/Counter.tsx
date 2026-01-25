"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

interface CounterProps {
    value: number;
    direction?: "up" | "down";
    className?: string;
    prefix?: string;
    suffix?: string;
}

export default function Counter({
    value,
    direction = "up",
    className,
    prefix = "",
    suffix = "",
    decimals = 0,
}: CounterProps & { decimals?: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(direction === "down" ? value : 0);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    useEffect(() => {
        if (isInView) {
            // Determine animation characteristics based on value change magnitude
            // If it's a small change (likely a live tick), animate fast (e.g. 1s linear or 0.5s)
            // If it's a large change (initial load or unit switch), animate over 2s
            const current = motionValue.get();
            const delta = Math.abs(current - value);
            const isLiveTick = delta <= (value * 0.01) || delta === 1; // Arbitrary threshold for "small tick" relative to value

            const duration = isLiveTick ? 0.5 : 1;

            // use framer-motion's animate function for precise duration control
            import("framer-motion").then(({ animate }) => {
                animate(motionValue, value, {
                    duration: duration,
                    ease: isLiveTick ? "linear" : "easeOut", // Linear for ticks feels more clock-like
                });
            });
        }
    }, [motionValue, isInView, value]);

    useEffect(() => {
        motionValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = `${prefix}${Intl.NumberFormat("en-US", {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals,
                }).format(Number(latest.toFixed(decimals)))}${suffix}`;
            }
        });
    }, [motionValue, prefix, suffix, decimals]);

    return <span className={className} ref={ref} />;
}
