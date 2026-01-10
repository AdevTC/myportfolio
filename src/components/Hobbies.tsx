"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Trophy, Flag, Activity, Users, Car, Gamepad2,
    Clapperboard, Tv, Headphones, Dog, Utensils, Moon, X
} from "lucide-react";
import Section from "./ui/Section";
import { cn } from "@/lib/utils";

interface Hobby {
    id: string;
    title: string;
    icon: any;
    shortDesc: string;
    description: string;
    color: string;
}

const HOBBIES: Hobby[] = [
    {
        id: "football",
        title: "Pasión Mundialista",
        icon: Trophy,
        shortDesc: "El fútbol de selecciones",
        description: "Me gusta mucho el fútbol de clubes, pero lo que me apasiona de verdad es el fútbol de selecciones. Cada vez que hay año mundialista estoy ansioso porque llegue el mes del mundial. Me suelo ver todos los partidos, disfrutando de la unión y la emoción que solo este evento puede generar.",
        color: "bg-blue-500"
    },
    {
        id: "f1",
        title: "Alonsista de Corazón",
        icon: Flag,
        shortDesc: "33 is coming",
        description: "Amo la Fórmula 1, la veo desde que era pequeño y siempre me ha gustado el deporte del motor. Pero me enamoré de él por, para mí, el mejor piloto que han visto mis ojos: Don Fernando Alonso Díaz. Soy alonsista desde niño y alonsista moriré. La magia del Nano es eterna.",
        color: "bg-emerald-500"
    },
    {
        id: "tennis",
        title: "Tenis: Big Three",
        icon: Activity,
        shortDesc: "Admirador del legado",
        description: "Fanático de Federer, Djokovic y Nadal. Me siento afortunado por haber visto al Big Three en acción. Para mí, el mejor y más completo de los 3 es Nadal; si las lesiones le hubiesen respetado, su palmarés sería aún más grande. Curiosamente, mi partido favorito suyo no es en Roland Garros, sino la legendaria final del Open de Australia 2022 contra Medvedev.",
        color: "bg-orange-500"
    },
    {
        id: "social",
        title: "Mis Amigos",
        icon: Users,
        shortDesc: "Mi hobby principal",
        description: "Me encanta quedar con mis amigos como hobby principal. Es mi forma de desconectar, reír y compartir momentos. Para mí, el tiempo de calidad con ellos es sagrado e insustituible.",
        color: "bg-purple-500"
    },
    {
        id: "pingpong",
        title: "Ping Pong",
        icon: Gamepad2,
        shortDesc: "Piques sanos",
        description: "Me encanta jugar al ping pong con mis amigos. Esos piques sanos, los torneos improvisados y la competitividad divertida son momentos que disfruto muchísimo.",
        color: "bg-rose-500"
    },
    {
        id: "driving",
        title: "Conducir",
        icon: Car,
        shortDesc: "Libertad en carretera",
        description: "Me encanta conducir. Más allá de un medio de transporte, disfruto de la conducción en sí misma. La carretera, la música y el coche forman una combinación perfecta para despejar la mente.",
        color: "bg-red-500"
    },
    {
        id: "cinema",
        title: "Cine",
        icon: Clapperboard,
        shortDesc: "El séptimo arte",
        description: "Soy un gran consumidor de películas. Me encanta sumergirme en nuevas historias, analizar la fotografía y disfrutar de una buena trama en la gran pantalla o en casa.",
        color: "bg-amber-500"
    },
    {
        id: "series",
        title: "Series",
        icon: Tv,
        shortDesc: "Maratones épicos",
        description: "Disfruto enganchándome a buenas series. Desde tramas complejas hasta comedias ligeras, me encanta seguir el desarrollo de personajes y arcos argumentales a lo largo de las temporadas.",
        color: "bg-indigo-500"
    },
    {
        id: "music",
        title: "Música",
        icon: Headphones,
        shortDesc: "Banda sonora vital",
        description: "Me encanta escuchar música. Es una parte fundamental de mi día a día, acompañándome en cada momento, desde el trabajo hasta los viajes en coche.",
        color: "bg-cyan-500"
    },
    {
        id: "animals",
        title: "Animales",
        icon: Dog,
        shortDesc: "Amor incondicional",
        description: "Me encantan los animales. Su compañía y lealtad me parecen fascinantes. Tengo una gran debilidad por ellos y disfruto mucho de su presencia.",
        color: "bg-lime-500"
    },
    {
        id: "food",
        title: "Gastronomía",
        icon: Utensils,
        shortDesc: "El placer de comer",
        description: "Me encanta comer. Disfruto probando nuevos platos y sabores, o simplemente deleitándome con una buena comida casera. Para mí, la gastronomía es uno de los grandes placeres de la vida.",
        color: "bg-yellow-600"
    },
    {
        id: "sleep",
        title: "Dormir",
        icon: Moon,
        shortDesc: "Recargando energía",
        description: "Y si se puede considerar hobby... ¡me encanta dormir! Disfruto mucho de un buen descanso reparador. No hay nada como levantarse con las pilas cargadas al 100%.",
        color: "bg-slate-500"
    }
];

export default function Hobbies() {
    const [selectedHobby, setSelectedHobby] = useState<Hobby | null>(null);

    return (
        <Section className="py-20">
            <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
                <h2 className="text-4xl font-bold mb-4">
                    Más allá del <span className="text-primary">Código</span>
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Lo que me mueve, me inspira y me hace desconectar.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {HOBBIES.map((hobby) => (
                    <motion.div
                        key={hobby.id}
                        layoutId={`card-${hobby.id}`}
                        onClick={() => setSelectedHobby(hobby)}
                        className="group relative overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-6 cursor-pointer hover:bg-white/10 transition-colors h-full flex flex-col items-start"
                        whileHover={{ y: -5 }}
                    >
                        <div className={cn("inline-flex p-3 rounded-2xl mb-4 text-white transition-transform group-hover:scale-110 duration-300", hobby.color)}>
                            <hobby.icon size={28} />
                        </div>
                        <h3 className="text-xl font-bold mb-1">{hobby.title}</h3>
                        <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-3">{hobby.shortDesc}</p>
                        <div className="mt-auto pt-2 flex items-center text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                            Leer más &rarr;
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedHobby && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedHobby(null)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            layoutId={`card-${selectedHobby.id}`}
                            className="relative w-full max-w-xl bg-[#0f172a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl z-10"
                        >
                            <div className={cn("p-8 md:p-10 text-white relative", selectedHobby.color)}>
                                <button
                                    onClick={(e) => { e.stopPropagation(); setSelectedHobby(null); }}
                                    className="absolute top-6 right-6 p-2 bg-black/20 hover:bg-black/40 rounded-full transition-colors text-white"
                                >
                                    <X size={24} />
                                </button>
                                <selectedHobby.icon size={48} className="mb-4 opacity-90" />
                                <h3 className="text-3xl font-bold mb-1">{selectedHobby.title}</h3>
                                <p className="text-white/80 font-medium uppercase tracking-wide text-sm">{selectedHobby.shortDesc}</p>
                            </div>
                            <div className="p-8 md:p-10 bg-[#0f172a]">
                                <p className="text-lg leading-relaxed text-slate-300">
                                    {selectedHobby.description}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </Section>
    );
}
