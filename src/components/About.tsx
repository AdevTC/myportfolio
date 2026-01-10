"use client";

import Section from "./ui/Section";
import GithubHeatmap from "./GithubHeatmap";

export default function About() {
    return (
        <Section id="about" className="flex flex-col gap-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold">
                        <span className="text-primary">Sobre</span> Mí
                    </h2>
                    <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                        <p>
                            Ingeniero de Software especializado en <strong className="text-foreground">Integraciones y Desarrollo de Aplicaciones</strong>.
                            Experto en conectar sistemas empresariales complejos (SAP CPI, HL7) y crear arquitecturas modernas con Node.js y React.
                        </p>
                        <p>
                            Me apasiona traducir requerimientos de negocio en soluciones técnicas escalables. Actualmente trabajando en soluciones
                            Cloud-Native con <strong className="text-foreground">SAP BTP & CAP</strong>.
                        </p>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full -z-10" />
                    {/* Maybe an image or purely code aesthetic? Let's stick to the requested heatmap below or here? 
              The prompt said "Here goes the widget". Let's put it full width below or in this column. 
              Let's put it below full width for impact.
          */}
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-8 h-[2px] bg-primary"></span>
                    Actividad de Código
                </h3>
                <GithubHeatmap />
            </div>
        </Section>
    );
}
