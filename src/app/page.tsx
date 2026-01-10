import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="pb-20">
      <Hero />

      {/* Shortened Sections */}
      <div className="space-y-32">
        <About />

        <div className="relative">
          <Experience limit={3} />
          <div className="flex justify-center mt-8">
            <Link href="/experience" className="group flex items-center gap-2 text-primary font-bold hover:underline">
              Ver toda la experiencia <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="relative">
          <Projects limit={3} />
          <div className="flex justify-center mt-8">
            <Link href="/projects" className="group flex items-center gap-2 text-primary font-bold hover:underline">
              Ver todos los proyectos <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <Contact />
      </div>
    </div>
  );
}
