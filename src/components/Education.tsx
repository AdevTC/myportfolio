"use client";

import Section from "./ui/Section";
import { GraduationCap, Award } from "lucide-react";

export default function Education() {
    return (
        <Section id="education">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Education */}
                <div>
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                        <GraduationCap className="text-primary" size={32} /> Educación
                    </h2>
                    <div className="space-y-8">
                        <div className="border-l-2 border-white/10 pl-6 relative">
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary" />
                            <h3 className="text-xl font-bold">Grado en Ingeniería Informática</h3>
                            <p className="text-primary/80 mb-1">UNIR</p>
                            <span className="text-sm text-muted-foreground">2025 - 2028</span>
                        </div>

                        <div className="border-l-2 border-white/10 pl-6 relative">
                            <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-white/20" />
                            <h3 className="text-lg font-bold">GS Desarrollo Web + Blockchain</h3>
                            <p className="text-muted-foreground mb-1">Cesur</p>
                            <span className="text-sm text-muted-foreground">2023 - 2025</span>
                        </div>

                        <div className="border-l-2 border-white/10 pl-6 relative">
                            <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-white/20" />
                            <h3 className="text-lg font-bold">GS Desarrollo Multiplataforma</h3>
                            <p className="text-muted-foreground mb-1">Cesur</p>
                            <span className="text-sm text-muted-foreground">2022 - 2024</span>
                        </div>
                    </div>
                </div>

                {/* Certifications (Carousel Simulation) */}
                <div>
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                        <Award className="text-primary" size={32} /> Certificaciones
                    </h2>

                    <div className="flex flex-col gap-4">
                        {[
                            { name: "SAP BTP Security", year: "2023" },
                            { name: "Discovering SAP Business Technology Platform", year: "2023" },
                            { name: "SAP Integration Suite - Managed Gateway", year: "2023" }
                        ].map((cert, i) => (
                            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center hover:bg-white/10 transition-colors cursor-default">
                                <span className="font-medium">{cert.name}</span>
                                <span className="text-sm px-2 py-1 bg-primary/20 text-primary rounded">{cert.year}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Section>
    );
}
