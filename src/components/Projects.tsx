"use client";

import Section from "./ui/Section";
import ProjectCard from "./ProjectCard";

const PROJECTS = [
    {
        title: "HealthConnect API",
        description: "Orquestación de mensajería HL7 para hospitales. Procesa más de 1M de mensajes diarios con latencia <100ms.",
        tags: ["Node.js", "HL7", "Redis", "Docker"],
        color: "from-blue-500 to-cyan-500"
    },
    {
        title: "HR Data Sync",
        description: "Automatización de nóminas con SAP SuccessFactors. Sincronización bidireccional en tiempo real.",
        tags: ["SAP CPI", "Groovy", "OData", "SuccessFactors"],
        color: "from-purple-500 to-pink-500"
    },
    {
        title: "CryptoBlock Dashboard",
        description: "App Web3 con Angular y Smart Contracts. Visualización de transacciones en tiempo real.",
        tags: ["Angular", "Solidity", "Ethers.js", "Tailwind"],
        color: "from-emerald-500 to-teal-500"
    }
];

interface ProjectsProps {
    limit?: number;
}

export default function Projects({ limit }: ProjectsProps) {
    const displayProjects = limit ? PROJECTS.slice(0, limit) : PROJECTS;
    return (
        <Section id="projects">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">
                Proyectos <span className="text-primary">Destacados</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayProjects.map((project, index) => (
                    <ProjectCard key={index} {...project} />
                ))}
            </div>
        </Section>
    );
}
