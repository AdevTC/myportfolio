"use client";

import { useState, useRef, useEffect } from "react";
import FloatingWindow from "../ui/FloatingWindow";
import { PROJECTS } from "../Projects";
import { SKILLS_DATA } from "../Skills";

// Utils for formatting
const formatList = (items: string[]) => items.map(i => `  • ${i}`).join("\n");

type CommandHandler = (args: string[]) => string | string[];

export default function FloatingTerminal() {
    const [history, setHistory] = useState<string[]>([
        "Initializing Portfolio OS v2.5.0...",
        "Fetching system data... [OK]",
        "Loading modules: [PROJECTS] [SKILLS] [AI] [CALC]",
        "System ready. Awaiting input.",
        "Type 'help' to see available commands."
    ]);
    const [input, setInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Matrix Rain Effect (Simple Easter Egg State)
    const [isMatrixMode, setIsMatrixMode] = useState(false);

    // --- Command Logic ---
    const commands: Record<string, CommandHandler | string | string[]> = {
        help: [
            "Available commands:",
            "  about     - Bio & Contact Info",
            "  projects  - List all live projects",
            "  skills    - Technical diagnostics",
            "  calc      - Evaluation engine (e.g. calc 2*5)",
            "  clear     - Purge screen buffer",
            "  contact   - Transmission channels",
            "  whoami    - Identity check",
            "  matrix    - Toggle visual overlay",
            "  sudo      - Admin privileges"
        ],
        about: [
            "USER: Adrián Tomás Cerdá",
            "ROLE: Software Engineer & SAP Cloud Developer",
            "LOC:  Madrid, Spain",
            "BIO:  Passionate about clean code, cloud architectures, and digital experiences.",
            "      I build things that live on the web."
        ],
        contact: [
            "  Email:  adriantomascv@gmail.com",
            "  GitHub: @AdevTC",
            "  Linkdn: /in/adriantomas",
            "  Status: Open to exciting opportunities."
        ],
        projects: (args) => {
            if (args[0] === "-d" || args[0] === "--details") {
                return [
                    "--- DETAILED PROJECT LIST ---",
                    ...PROJECTS.map(p => `\n[${p.title}]\n  ${p.description}\n  Stack: ${p.tags.join(", ")}\n  URL: ${p.demoUrl || "N/A"}`)
                ];
            }
            return [
                "--- RECENT PROJECTS ---",
                ...PROJECTS.map((p, i) => `${i + 1}. ${p.title} (${p.tags.slice(0, 2).join(", ")})`),
                "",
                "Type 'projects -d' for detailed view."
            ];
        },
        skills: [
            "--- DIAGNOSTIC RESULT: TECH STACK ---",
            ...SKILLS_DATA.map(cat => `\n[${cat.label.toUpperCase()}]\n${cat.skills.map(s => `  • ${s.name}`).join("\n")}`)
        ],
        whoami: "User: Guest [Access Level: 1]. You are the observer.",
        sudo: [
            "Authenticating...",
            "...",
            "Access Denied: You didn't say the magic word."
        ],
        hello: "Beep boop. Greetings, carbon-based lifeform.",
        hi: "Hello there.",
        secret: "404 Secret Not Found. Or is it? Try 'matrix'.",
        matrix: (args) => {
            setIsMatrixMode(prev => !prev);
            return isMatrixMode ? "Deactivating visual overlay..." : "Wake up, Neo...";
        },
        ls: "access_denied: File system mapped to visual interface.",
        cd: "Movement restricted. Use the GUI navigator.",
        date: new Date().toString(),
        exit: "Closing session... (Just kidding, click the X button)"
    };

    const evaluateCalc = (expression: string): string => {
        try {
            // Sanitize input: allow only numbers, operators, parens
            const sanitized = expression.replace(/[^0-9+\-*/().]/g, '');
            if (!sanitized) return "Error: Empty or invalid expression.";
            // eslint-disable-next-line no-new-func
            const result = new Function('return ' + sanitized)();
            if (!isFinite(result)) return "Error: Result is infinite or NaN";
            return `= ${result}`;
        } catch (e) {
            return "Error: Invalid calculation syntax.";
        }
    };

    const handleCommand = (cmdStr: string) => {
        const trimmed = cmdStr.trim();
        if (!trimmed) return;

        const [cmd, ...args] = trimmed.split(" ");
        const lowerCmd = cmd.toLowerCase();

        let output: string | string[] = [];

        if (lowerCmd === "clear") {
            setHistory([]);
            return;
        }

        if (lowerCmd === "calc") {
            output = evaluateCalc(args.join(""));
        } else if (commands[lowerCmd]) {
            const handler = commands[lowerCmd];
            if (typeof handler === "function") {
                output = handler(args);
            } else {
                output = handler;
            }
        } else {
            output = `Command not found: '${lowerCmd}'. Type 'help' for options.`;
        }

        const outputLines = Array.isArray(output) ? output : [output];
        setHistory(prev => [...prev, `guest@portfolio:~$ ${cmdStr}`, ...outputLines]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleCommand(input);
        setInput("");
    };

    // Auto-scroll
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    // Focus input on click
    const handleContainerClick = () => {
        const selection = window.getSelection();
        if (selection && selection.toString().length > 0) return;
        inputRef.current?.focus();
    };

    return (
        <FloatingWindow
            id="terminal"
            title="Terminal"
            width={650}
            height={450}
            className={`bg-[#0c0c0c]/90 backdrop-blur-xl border-white/10 shadow-2xl font-mono transition-colors duration-500 ${isMatrixMode ? "text-green-500 border-green-500/30" : ""}`}
        >
            <div
                className="h-full flex flex-col p-4 text-sm font-mono overflow-hidden"
                onClick={handleContainerClick}
            >
                {/* Scrollable Output */}
                <div className={`flex-1 overflow-y-auto custom-scrollbar space-y-1 ${isMatrixMode ? "font-bold" : ""}`} ref={scrollRef}>
                    {history.map((line, i) => (
                        <div key={i} className={`break-words ${line.startsWith("guest@") ? (isMatrixMode ? "text-green-700" : "text-zinc-500 mt-2") :
                            line.startsWith("=") ? "text-cyan-400 font-bold" :
                                line.startsWith("Error") ? "text-red-400" :
                                    line.startsWith("---") ? "text-purple-400 font-bold mt-2" :
                                        line.startsWith("[") ? "text-yellow-400" :
                                            (isMatrixMode ? "text-green-500" : "text-emerald-400")
                            }`}>
                            {line}
                        </div>
                    ))}
                </div>

                {/* Input Line */}
                <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2 pt-2 border-t border-white/5 shrink-0">
                    <span className={isMatrixMode ? "text-green-600" : "text-pink-500 font-bold"}>guest@portfolio</span>
                    <span className="text-zinc-600">:</span>
                    <span className="text-blue-400">~</span>
                    <span className="text-zinc-600">$</span>
                    <input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className={`flex-1 bg-transparent border-none outline-none placeholder:text-zinc-700 ml-1 ${isMatrixMode ? "text-green-500 caret-green-500" : "text-zinc-100"}`}
                        autoFocus
                        spellCheck={false}
                        autoComplete="off"
                    />
                </form>
            </div>
        </FloatingWindow>
    );
}
