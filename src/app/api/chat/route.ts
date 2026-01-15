import { NextResponse } from 'next/server';
import { PORTFOLIO_DATA } from '@/lib/portfolio-data';

export async function POST(request: Request) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: 'Server configuration error: GEMINI_API_KEY is missing.' },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { contents } = body;

        // Construct the System Prompt
        const systemInstruction = `
            Eres "AIdri", un asistente virtual sarcástico pero útil que vive en el portafolio de Adrián Tomás Cerdá.
            
            TU PERSONALIDAD:
        - Tu nombre es "AIdri"(juego de palabras con Adrián e IA).
            - Eres divertido, un poco "friki" de la tecnología y tienes un tono relajado.
            - Eres un "becario virtual", pero NO eres pelota.No adules a Adrián.
            - Emojis favoritos: 🤖, 💻, 🚀, ⚡, ☕.

            TUS REGLAS:
        1. SOLO respondes preguntas sobre Adrián, su experiencia, sus proyectos o este portafolio.
            2. Si te preguntan algo fuera de contexto(ej: "¿Cómo hacer una paella?", "¿Quién es Messi?"), rechaza la pregunta con humor.
            Ejemplo: "Mi contrato de becario solo me permite hablar de lo que hace Adri en la oficina. Para recetas de cocina, busca en Google."
        3. IMPORTANTE: No seas exagerado con los halagos.
               - NO uses palabras como "crack", "máquina", "ídolo", "genio" o "jefazo".
               - Refiérete a él simplemente como "Adri" o "Adrián".
               - Sé profesional pero cercano, sin idolatrar.
            4. Usa la siguiente información("CONTEXTO") para responder con precisión.No inventes datos.

            CONTEXTO(Información sobre Adrián):
            ${JSON.stringify(PORTFOLIO_DATA, null, 2)}
        `;

        // 1. Dynamic Model Discovery
        // We first ask Google: "What models do I have access to?"
        let selectedModel = "gemini-1.5-flash"; // Default fallback
        try {
            const modelsResponse = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
                { method: "GET" }
            );
            const modelsData = await modelsResponse.json();

            if (modelsData.models) {
                console.log("✅ Available Models:", modelsData.models.map((m: any) => m.name));
                // Prefer 1.5 Flash, then 1.5 Pro, then others
                const candidates = [
                    "models/gemini-1.5-flash",
                    "models/gemini-1.5-flash-latest",
                    "models/gemini-1.5-pro",
                    "models/gemini-1.5-pro-latest",
                    "models/gemini-pro"
                ];

                const availableNames = modelsData.models.map((m: any) => m.name);
                const bestMatch = candidates.find(c => availableNames.includes(c));

                if (bestMatch) {
                    selectedModel = bestMatch.replace("models/", "");
                    console.log(`🎯 Selected Model: ${selectedModel}`);
                } else {
                    // Fallback: pick the first "gemini" model
                    const anyGemini = availableNames.find((n: string) => n.includes("gemini") && !n.includes("vision"));
                    if (anyGemini) selectedModel = anyGemini.replace("models/", "");
                }
            } else {
                console.warn("⚠️ Could not list models:", modelsData.error);
            }
        } catch (e) {
            console.warn("⚠️ Failed to list models, using fallback.", e);
        }

        // 2. Generate Content
        console.log(`🚀 Sending request to: ${selectedModel}`);
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents,
                    system_instruction: { parts: { text: systemInstruction } }
                })
            }
        );

        const data = await response.json();

        if (data.error) {
            console.error("❌ Generation Error:", data.error);
            return NextResponse.json({ error: data.error }, { status: 400 });
        }

        return NextResponse.json(data);

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
