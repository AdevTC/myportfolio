"use client";

import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import Section from "@/components/ui/Section";
import { Briefcase, Clock, Globe } from "lucide-react";

export default function HirePage() {
    useEffect(() => {
        (async function () {
            const cal = await getCalApi({});
            cal("ui", {
                styles: { branding: { brandColor: "#8b5cf6" } },
                hideEventTypeDetails: false,
                layout: "month_view"
            });
        })();
    }, []);

    return (
        <div className="pt-24 pb-12 min-h-screen">
            <Section id="hire">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Agenda una <span className="text-primary">Reunión</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Estoy disponible para consultorías, integraciones SAP y desarrollo a medida.
                            Elige el horario que mejor te convenga.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
                            <div className="p-3 bg-primary/20 text-primary rounded-xl"><Briefcase size={24} /></div>
                            <div>
                                <h3 className="font-bold">Profesional</h3>
                                <p className="text-sm text-muted-foreground">Enfoque 100% a negocio</p>
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
                            <div className="p-3 bg-primary/20 text-primary rounded-xl"><Clock size={24} /></div>
                            <div>
                                <h3 className="font-bold">Flexible</h3>
                                <p className="text-sm text-muted-foreground">Horarios adaptados a ti</p>
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
                            <div className="p-3 bg-primary/20 text-primary rounded-xl"><Globe size={24} /></div>
                            <div>
                                <h3 className="font-bold">Remoto</h3>
                                <p className="text-sm text-muted-foreground">Reuniones vía Google Meet</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl h-[700px]">
                        {/* Replace 'adevtc' with your actual Cal.com username */}
                        <Cal
                            calLink="rick/30min"
                            style={{ width: "100%", height: "100%", overflow: "scroll" }}
                            config={{ layout: 'month_view' }}
                        />
                    </div>
                </div>
            </Section>
        </div>
    );
}
