"use client";

import ContactForm from "@/components/Contact";

import Section from "@/components/ui/Section";

export default function ContactPage() {
    return (
        <div className="pt-32 pb-12 min-h-screen">
            {/* Using pt-32 to match strict top padding requirement if Section doesn't handle it exactly the same way, or to ensure spacing from fixed navbar. 
              Actually Section usually has padding, but for this specific layout we might want manual control or a wrapper Section.
              Let's use a wrapper div with max-w-7xl to align with other content.
              */}

            <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    <span className="text-primary">Contacta</span> Conmigo
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    ¿Tienes una idea? Hablemos.
                </p>
            </div>

            <div className="max-w-4xl mx-auto px-4 lg:px-6">
                <div className="w-full">
                    <ContactForm />
                </div>
            </div>
        </div>
    );
}
