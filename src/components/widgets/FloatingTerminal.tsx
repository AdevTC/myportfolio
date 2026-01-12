"use client";

import { useState, useRef, useEffect } from "react";
import FloatingWindow from "../ui/FloatingWindow";

export default function FloatingTerminal() {
    const [history, setHistory] = useState<string[]>([
        "Welcome to Portfolio OS v2.0.0",
        "Type 'help' to see available commands."
    ]);
    const [input, setInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleCommand = (cmd: string) => {
        const cleanCmd = cmd.trim().toLowerCase();
        let output: string[] = [];

        switch (cleanCmd) {
            case "help":
                output = [
                    "Available commands:",
                    "  about     - Bio & Contact",
                    "  projects  - List Projects",
                    "  skills    - List Tech Stack",
                    "  status    - Check System Status",
                    "  clear     - Clear terminal",
                ];
                break;
            case "about":
                output = [
                    "Adrián Tomás Cerdá",
                    "------------------",
                    "Role: Software Engineer & SAP Cloud Developer",
                    "Location: Madrid, Spain",
                    "Contact: adriantomascv@gmail.com",
                    "Github: @AdevTC"
                ];
                break;
            case "projects":
                output = [
                    "Recent Projects:",
                    "-----------------",
                    "1. Marine Blog (Next.js, Tailwind)",
                    "2. Portfolio V2 (React, Framer Motion)",
                    "3. SAP Integration Suite Custom Adapters",
                    "4. Full Stack E-commerce (Node.js, Postgres)"
                ];
                break;
            case "skills":
                output = [
                    "Tech Stack:",
                    "-----------",
                    "Frontend: React, Next.js, Tailwind, TypeScript",
                    "Backend: Node.js, Python, ABAP",
                    "Cloud: SAP BTP, AWS, Firebase",
                    "Database: PostgreSQL, MongoDB, HANA"
                ];
                break;
            case "status":
                output = ["System: Online", "Mode: Interactive", "User: Guest"];
                break;
            case "clear":
                setHistory([]);
                return;
            case "":
                break;
            default:
                output = [`Command not found: ${cmd}. Type 'help' for options.`];
        }

        setHistory(prev => [...prev, `> ${cmd}`, ...output]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleCommand(input);
        setInput("");
    };

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    return (
        <FloatingWindow id="terminal" title="Terminal - zsh" width={500} height={350} className="bg-[#1e1e1e]/95 font-mono">
            <div
                className="h-full flex flex-col p-2 text-sm text-green-400 font-mono overflow-hidden"
                onClick={() => inputRef.current?.focus()}
            >
                <div className="flex-1 overflow-y-auto custom-scrollbar" ref={scrollRef}>
                    {history.map((line, i) => (
                        <div key={i} className="whitespace-pre-wrap mb-1">{line}</div>
                    ))}
                </div>
                <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
                    <span className="text-blue-400">➜</span>
                    <span className="text-cyan-400">~</span>
                    <input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-zinc-100 placeholder:text-zinc-600"
                        autoFocus
                    />
                </form>
            </div>
        </FloatingWindow>
    );
}
