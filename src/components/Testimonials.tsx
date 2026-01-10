"use client";

import Section from "./ui/Section";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

const TESTIMONIALS = [
    {
        text: "Adrián demostró una capacidad excepcional para resolver problemas complejos en SAP CPI. Su ética de trabajo es impecable.",
        author: "María García",
        role: "Project Manager, Inetum"
    },
    {
        text: "Un desarrollador con visión de futuro. Su implementación de HL7 modernizó completamente nuestro flujo de datos hospitalario.",
        author: "Dr. Carlos Ruiz",
        role: "Director IT, Hospital Central"
    }
];

export default function Testimonials() {
    const [index, setIndex] = useState(0);

    const next = () => setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    const prev = () => setIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

    return (
        <Section className="max-w-4xl mx-auto text-center">
            <Quote size={48} className="text-primary mx-auto mb-8 opacity-50" />

            <div className="relative min-h-[300px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="px-8 md:px-20"
                    >
                        <p className="text-2xl md:text-3xl italic font-light mb-8">
                            &quot;{TESTIMONIALS[index].text}&quot;
                        </p>
                        <div>
                            <h4 className="text-xl font-bold">{TESTIMONIALS[index].author}</h4>
                            <p className="text-primary">{TESTIMONIALS[index].role}</p>
                        </div>
                    </motion.div>
                </AnimatePresence>

                <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full">
                    <ChevronLeft />
                </button>
                <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 hover:bg-white/10 rounded-full">
                    <ChevronRight />
                </button>
            </div>
        </Section>
    );
}
