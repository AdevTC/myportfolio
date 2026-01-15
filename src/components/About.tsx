"use client";

import Section from "./ui/Section";

export default function About() {
    return (
        <Section id="about" className="flex flex-col gap-24 py-12">

            {/* Header Section */}
            <div className="text-center max-w-4xl mx-auto space-y-4">
                <h2 className="text-4xl md:text-6xl font-bold">
                    <span className="text-primary">Sobre</span> Mí
                </h2>
                <div className="h-1 w-24 bg-primary mx-auto rounded-full" />
                <p className="text-xl text-muted-foreground">
                    Más allá del código: Mi viaje, mi pasión y mi futuro.
                </p>
            </div>

            {/* Intro Section: Who Am I? */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="relative group perspective-1000 md:order-2">
                    <div className="relative aspect-square rounded-full md:rounded-2xl overflow-hidden shadow-2xl border-4 border-primary/20 transition-transform duration-500 hover:scale-105">
                        <img src="/about/portrait.png" alt="Adrian Tomas" className="object-cover w-full h-full" />
                    </div>
                    <div className="absolute -z-10 inset-0 bg-primary/30 blur-[60px] rounded-full scale-90" />
                </div>
                <div className="space-y-6 md:order-1">
                    <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">¿Quién soy yo?</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed text-justify">
                        Ante todo, soy un chaval con ilusiones, con toda una vida por delante y una mochila cargada de proyectos en mente. Mi identidad no se define únicamente por lo que hago frente a una pantalla, sino por cómo afronto la vida: con dedicación absoluta, sacrificio diario y unas ganas inmensas de trabajar para labrarme un futuro.
                    </p>
                    <p className="text-lg text-muted-foreground leading-relaxed text-justify">
                        Creo que las grandes metas no se alcanzan con golpes de suerte, sino con la constancia de quien se levanta cada día dispuesto a ser un poco mejor que ayer. Mi motor es esa ambición sana de querer sacar mi vida adelante, de construir algo propio y de sentir el orgullo de saber que cada logro ha sido fruto del esfuerzo honesto.
                    </p>
                </div>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

            {/* Block 1: The Spark (Text Left, Image Right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white">La Chispa Inicial</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed text-justify">
                        Todo comenzó con preguntas simples: "¿Cómo funciona esto?" y "¿Por qué hace aquello?". Esa curiosidad innata fue mi compañera constante durante mi infancia. No me bastaba con usar la tecnología; necesitaba entenderla, desmontarla y, en ocasiones, intentar mejorarla (con resultados variados).
                    </p>
                    <p className="text-lg text-muted-foreground leading-relaxed text-justify">
                        Esa inquietud me llevó a las aulas del <strong>Colegio Nuestra Señora de la Merced</strong> en Madrid. Allí, cursando el Bachillerato Tecnológico, las matemáticas y la física dejaron de ser asignaturas abstractas para convertirse en las herramientas con las que se construye el mundo moderno. Fue allí donde entendí que la lógica es el lenguaje universal de la solución de problemas.
                    </p>
                </div>
                <div className="relative group perspective-1000">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl rotate-2 transition-transform duration-500 hover:rotate-0">
                        <img src="/about/inicios.png" alt="Inicios Curiosos" className="object-cover w-full h-full" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                </div>
            </div>

            {/* Block 2: Professional Formation (Image Left, Text Right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
                <div className="relative group md:order-1 perspective-1000">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl -rotate-2 transition-transform duration-500 hover:rotate-0">
                        <img src="/about/formacion.png" alt="Formación Técnica" className="object-cover w-full h-full" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                </div>
                <div className="space-y-6 md:order-2">
                    <h3 className="text-2xl font-bold text-white">Forjando al Desarrollador</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed text-justify">
                        Con el objetivo claro, di el salto a la formación profesional en <strong>Cesur</strong>. Fueron años intensos de inmersión total. Primero con el <strong>Desarrollo de Aplicaciones Multiplataforma (DAM)</strong>, donde aprendí la robustez de las aplicaciones de escritorio y móviles. Luego, con el <strong>Desarrollo de Aplicaciones Web (DAW)</strong>, donde descubrí la versatilidad y el alcance global de la web.
                    </p>
                    <p className="text-lg text-muted-foreground leading-relaxed text-justify">
                        No fue solo aprender sintaxis; fue aprender a pensar como un ingeniero. Bases de datos, arquitecturas, control de versiones... cada concepto era una pieza más del rompecabezas. Aquí desarrollé mis primeros proyectos "serios", enfrentándome a plazos reales y bugs que parecían imposibles de resolver (hasta que, de repente, dejaban de serlo).
                    </p>
                </div>
            </div>

            {/* Block 3: Continuous Growth (Text Left, Image Stack Right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-white">Ingeniería y Evolución Constante</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed text-justify">
                        El mundo del software no se detiene, y yo tampoco. Actualmente, estoy elevando mi perfil técnico cursando el grado en <strong>Ingeniería Informática en la UNIR</strong>. Esta etapa está siendo transformadora. Me está permitiendo conectar la práctica diaria con la teoría fundamental: algoritmos avanzados, estructuras de datos complejas e ingeniería de software a gran escala.
                    </p>
                    <p className="text-lg text-muted-foreground leading-relaxed text-justify">
                        Compaginar estudios universitarios con mi carrera profesional me ha enseñado una lección valiosa: la disciplina es la clave de la libertad. Cada hora invertida estudiando se traduce directamente en un código más limpio, eficiente y escalable en mi trabajo diario.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl overflow-hidden shadow-lg translate-y-8">
                        <img src="/about/estudio.png" alt="Estudio" className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="rounded-xl overflow-hidden shadow-lg">
                        <img src="/about/crecimiento.png" alt="Crecimiento" className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" />
                    </div>
                </div>
            </div>

            {/* Block 4: Philosophy & Future (Images Left, Text Right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center md:flex-row-reverse">
                {/* Images Stack for Philosophy */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:order-1">
                    <div className="relative rounded-2xl overflow-hidden shadow-lg h-48 group md:col-span-2">
                        <img src="/about/futuro.png" alt="Futuro Cloud" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="relative rounded-2xl overflow-hidden shadow-lg h-40 group">
                        <img src="/about/equipo.png" alt="Trabajo en Equipo" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="relative rounded-2xl overflow-hidden shadow-lg h-40 group">
                        <img src="/about/philosophy.png" alt="Filosofía Abstracta" className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-6 md:order-2">
                    <h3 className="text-2xl font-bold text-white">Mi Filosofía Actual</h3>
                    <p className="text-lg text-muted-foreground leading-relaxed text-justify">
                        Hoy en día, me veo a mí mismo no solo como un programador, sino como un <strong>constructor de soluciones</strong>. Me apasiona el ecosistema "Full Stack" porque me permite tener una visión holística. Disfruto tanto optimizando una consulta SQL en el backend como ajustando una animación CSS para que se sienta "mágica".
                    </p>
                    <p className="text-lg text-muted-foreground leading-relaxed text-justify">
                        Creo firmemente que la mejor tecnología es la que es invisible para el usuario, esa que simplemente funciona y mejora su vida sin fricción. Mi meta es seguir explorando las fronteras de la computación en la nube, las arquitecturas distribuidas y, por supuesto, seguir escribiendo código que sea un orgullo leer y mantener.
                    </p>
                </div>
            </div>

            <div className="relative">
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 blur-[150px] rounded-full" />
            </div>
        </Section>
    );
}
