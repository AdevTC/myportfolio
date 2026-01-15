"use client";

import { useFloatingComponents } from "@/context/FloatingComponentContext";
import { AnimatePresence } from "framer-motion";

import GithubActivityModal from "./widgets/GithubActivityModal";
import AIChatAssistant from "./widgets/AIChatAssistant";
import FloatingTerminal from "./widgets/FloatingTerminal";
import CodeActivityModal from "./widgets/CodeActivityModal";
import SkillGalaxy from "./widgets/SkillGalaxy";
import KonamiCodeGame from "./widgets/KonamiCodeGame";

// Placeholders for now - we will implement real widgets next
const WidgetPlaceholder = ({ id }: { id: string }) => (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black border border-white/10 p-4 rounded text-white z-40">
        Widget: {id} (Work in Progress)
    </div>
);

export default function FloatingWindowManager() {
    const { openWidgets } = useFloatingComponents();

    return (
        <AnimatePresence>
            {openWidgets.map(id => {
                if (id === "github") return <GithubActivityModal key={id} />;
                if (id === "ai") return <AIChatAssistant key={id} />;
                if (id === "terminal") return <FloatingTerminal key={id} />;
                if (id === "codeActivity") return <CodeActivityModal key={id} />;

                if (id === "skills") return <SkillGalaxy key={id} />;
                if (id === "game") return <KonamiCodeGame key={id} />;

                return <WidgetPlaceholder key={id} id={id} />;
            })}
        </AnimatePresence>
    );
}
