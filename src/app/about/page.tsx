import About from "@/components/About";
import Skills from "@/components/Skills";
import Hobbies from "@/components/Hobbies";
import Education from "@/components/Education";

export const metadata = {
    title: "Sobre Mí | Adrián Tomás Cerdá",
};

export default function AboutPage() {
    return (
        <main className="pt-24 pb-12">
            <About />
            <Skills />
            <Education />
            <Hobbies />
        </main>
    );
}
