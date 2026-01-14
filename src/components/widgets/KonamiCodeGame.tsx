"use client";

import { useEffect, useRef, useState } from "react";
import FloatingWindow from "../ui/FloatingWindow";
import { collection, addDoc, query, orderBy, limit, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function KonamiCodeGame() {
    // Playable Pong Logic
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // Leaderboard state
    const [nickname, setNickname] = useState("");
    const [showNicknameInput, setShowNicknameInput] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);

    useEffect(() => {
        // Pointer Lock Change Listener
        const handleLockChange = () => {
            if (document.pointerLockElement === canvasRef.current) {
                setIsPaused(false);
            } else {
                if (isPlaying && !gameOver) setIsPaused(true);
            }
        };

        document.addEventListener("pointerlockchange", handleLockChange);
        return () => document.removeEventListener("pointerlockchange", handleLockChange);
    }, [isPlaying, gameOver]);

    // Firebase & Leaderboard Logic
    useEffect(() => {
        if (showLeaderboard) {
            const fetchLeaderboard = async () => {
                const q = query(collection(db, "pong_scores"), orderBy("score", "desc"), limit(100));
                const querySnapshot = await getDocs(q);
                const scores = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
                setLeaderboard(scores);
            };
            fetchLeaderboard();
        }
    }, [showLeaderboard]);

    const saveScore = async (finalScore: number) => {
        if (!nickname) return;
        try {
            await addDoc(collection(db, "pong_scores"), {
                nickname,
                score: finalScore,
                timestamp: serverTimestamp()
            });
        } catch (e) { console.error("Error saving score:", e); }
    };

    useEffect(() => {
        if (!isPlaying || gameOver || isPaused || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        // Game State
        // Use refs for mutable game state to avoid closure staleness issues in the loop
        // However, simple variables inside useEffect work if we don't depend on external props changing mid-game
        // Re-initializing variables here means they reset on every pause/resume if not careful.
        // Better to use Refs for game state if we want it to persist across React renders (like pause/resume)
        // But for simplicity in this "Arcade" style, let's just use refs for positions.

        // Actually, to keep it simple and robust:
        // Let's rely on the fact that this effect runs when `isPaused` changes. 
        // We need persistence. Let's move state to refs.
    }, [isPlaying, gameOver, isPaused]); // This approach is tricky for pausing.

    // Better Approach: Game Loop Ref
    const gameState = useRef({
        ball: { x: 300, y: 200, dx: 4, dy: -4, radius: 8 },
        paddle: { width: 100, height: 12, x: 250 },
        score: 0
    });

    // Container ref for responsive sizing
    const containerRef = useRef<HTMLDivElement>(null);

    // Dynamic Sizing Logic
    useEffect(() => {
        if (!containerRef.current || !canvasRef.current) return;

        const resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                if (canvasRef.current) {
                    const prevWidth = canvasRef.current.width;
                    const prevHeight = canvasRef.current.height;

                    canvasRef.current.width = width;
                    canvasRef.current.height = height;

                    // If existing game, scale positions
                    if (prevWidth > 0 && prevHeight > 0) {
                        gameState.current.ball.x = (gameState.current.ball.x / prevWidth) * width;
                        gameState.current.ball.y = (gameState.current.ball.y / prevHeight) * height;
                        gameState.current.paddle.x = (gameState.current.paddle.x / prevWidth) * width;

                        // Physics: Speed based on HEIGHT as requested
                        // Initial speed approx 1.2% of height?
                        const speedFactor = height * 0.012;
                        const currentSpeedY = Math.abs(gameState.current.ball.dy);

                        // Only update if moving
                        if (currentSpeedY > 0) {
                            // Scale current speed to new height
                            gameState.current.ball.dy = Math.sign(gameState.current.ball.dy) * Math.max(speedFactor, currentSpeedY * (height / prevHeight));
                            // DX scales with width to keep angles reasonable but mainly controlled by hit
                            gameState.current.ball.dx = Math.sign(gameState.current.ball.dx) * (Math.abs(gameState.current.ball.dx) * (width / prevWidth));
                        }
                    }

                    // Keep paddle in bounds
                    if (gameState.current.paddle.x > width - gameState.current.paddle.width) {
                        gameState.current.paddle.x = width - gameState.current.paddle.width;
                    }
                }
            }
        });

        resizeObserver.observe(containerRef.current);

        return () => resizeObserver.disconnect();
    }, []);

    // Reset game state on start
    useEffect(() => {
        if (isPlaying && !gameOver && score === 0 && canvasRef.current) {
            const w = canvasRef.current.width;
            const h = canvasRef.current.height;

            // Base speed = 1.2% of HEIGHT
            const baseSpeed = Math.max(3, h * 0.012);

            gameState.current = {
                ball: { x: w / 2, y: h / 2, dx: baseSpeed * (Math.random() > 0.5 ? 0.8 : -0.8), dy: -baseSpeed, radius: 8 },
                paddle: { width: 100, height: 12, x: (w - 100) / 2 },
                score: 0
            };
        }
    }, [isPlaying, gameOver, score]);


    useEffect(() => {
        if (!isPlaying || gameOver || isPaused || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        const state = gameState.current;

        // Mouse Lock Movement Handler
        const handleMouseMove = (e: MouseEvent) => {
            if (document.pointerLockElement === canvas) {
                state.paddle.x += e.movementX;
                // Clamp paddle
                if (state.paddle.x < 0) state.paddle.x = 0;
                if (state.paddle.x + state.paddle.width > canvas.width) state.paddle.x = canvas.width - state.paddle.width;
            }
        };

        document.addEventListener("mousemove", handleMouseMove);

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Ball
            ctx.beginPath();
            ctx.arc(state.ball.x, state.ball.y, state.ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = "#00DDFF";
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#00DDFF";
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.closePath();

            // Draw Paddle
            ctx.beginPath();
            ctx.rect(state.paddle.x, canvas.height - state.paddle.height - 10, state.paddle.width, state.paddle.height);
            ctx.fillStyle = "#00FF00";
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#00FF00";
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.closePath();

            // Collision Logic
            // Walls
            if (state.ball.x + state.ball.dx > canvas.width - state.ball.radius || state.ball.x + state.ball.dx < state.ball.radius) {
                state.ball.dx = -state.ball.dx;
            }
            if (state.ball.y + state.ball.dy < state.ball.radius) {
                state.ball.dy = -state.ball.dy;
            }

            // Paddle
            if (state.ball.y + state.ball.dy > canvas.height - state.ball.radius - state.paddle.height - 10) {
                if (state.ball.x > state.paddle.x && state.ball.x < state.paddle.x + state.paddle.width) {
                    // Normalize hit position to -1 to 1
                    const hitPoint = (state.ball.x - (state.paddle.x + state.paddle.width / 2)) / (state.paddle.width / 2);

                    // Increase speed per hit (5%)
                    state.ball.dy = -state.ball.dy * 1.05;

                    // Angle logic: scaled by current Y speed to maintain vector
                    const currentSpeed = Math.abs(state.ball.dy);
                    // Add X velocity based on hit point
                    state.ball.dx = hitPoint * (currentSpeed * 0.8);

                    state.score++;
                    setScore(state.score);
                } else if (state.ball.y + state.ball.dy > canvas.height - state.ball.radius) {
                    // Game Over
                    if (!gameOver) { // Prevent double trigger
                        setGameOver(true);
                        setIsPlaying(false); // Stop the game loop
                        document.exitPointerLock();
                        saveScore(state.score);
                        setShowLeaderboard(true);
                    }
                    return;
                }
            }

            state.ball.x += state.ball.dx;
            state.ball.y += state.ball.dy;

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, [isPlaying, gameOver, isPaused]);

    const handleStart = () => {
        if (!nickname) {
            setShowNicknameInput(true);
            return;
        }
        setIsPlaying(true);
        setGameOver(false);
        setScore(0);
        setIsPaused(false);
        setShowLeaderboard(false);
        try {
            // Small delay to ensure render
            setTimeout(() => canvasRef.current?.requestPointerLock(), 100);
        } catch (e) { console.error(e); }
    };

    const resumeGame = async () => {
        setIsPaused(false);
        try {
            await canvasRef.current?.requestPointerLock();
        } catch (e) { console.error(e); }
    };

    return (
        <FloatingWindow
            id="game"
            title="Retro Pong (ESC to Pause)"
            width={700}
            height={500}
            className="bg-black border-green-500/50"
            contentClassName="p-0"
        >
            <div
                ref={containerRef}
                className="flex flex-col items-center justify-center h-full w-full relative overflow-hidden bg-[#051005]"
            >
                {/* CRT Scanline Effect */}
                <div className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] contrast-[1.2]" />

                <div className="absolute top-4 right-6 text-green-500 font-mono font-bold text-3xl z-10 drop-shadow-[0_0_10px_rgba(0,255,0,0.5)]">
                    {score.toString().padStart(3, '0')}
                </div>

                {/* --- MENUS --- */}

                {/* Nickname Input  */}
                {showNicknameInput && !isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/95">
                        <div className="text-center p-8 rounded-xl border border-green-500/30 backdrop-blur-sm max-w-sm w-full">
                            <h2 className="text-3xl font-bold text-green-500 mb-6 glitch-text">IDENTITY REQUIRED</h2>
                            <input
                                type="text"
                                placeholder="ENTER CODENAME"
                                className="w-full bg-black border-2 border-green-700 p-3 text-green-400 font-mono mb-4 text-center focus:outline-none focus:border-green-400 uppercase placeholder:text-green-900"
                                maxLength={10}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.currentTarget.value) {
                                        setNickname(e.currentTarget.value.toUpperCase());
                                        setShowNicknameInput(false);
                                    }
                                }}
                                onChange={(e) => setNickname(e.target.value.toUpperCase())}
                                value={nickname}
                            />
                            <button
                                onClick={() => {
                                    if (nickname) setShowNicknameInput(false);
                                }}
                                className="w-full bg-green-900/30 border border-green-500 text-green-400 px-4 py-3 font-bold rounded hover:bg-green-500 hover:text-black transition-all"
                            >
                                CONFIRM IDENTITY
                            </button>
                        </div>
                    </div>
                )}

                {/* Main Menu / Start Screen */}
                {!isPlaying && !gameOver && !showNicknameInput && !showLeaderboard && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="text-center bg-black/80 p-8 rounded-xl border border-green-500/30 backdrop-blur-sm shadow-2xl">
                            <h2 className="text-5xl font-bold text-green-500 mb-2 glitch-text tracking-tighter">RETRO PONG</h2>
                            {nickname && <p className="text-green-600 font-mono text-sm mb-6">OPERATOR: {nickname}</p>}

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleStart}
                                    className="bg-green-600 text-black px-12 py-3 font-bold rounded hover:bg-green-500 transition-all shadow-[0_0_20px_rgba(0,255,0,0.4)] hover:scale-105 active:scale-95 uppercase tracking-widest"
                                >
                                    INSERT COIN
                                </button>
                                <button
                                    onClick={() => setShowLeaderboard(true)}
                                    className="text-green-500/80 hover:text-green-400 text-sm font-mono mt-2 underline decoration-green-900 underline-offset-4"
                                >
                                    VIEW HIGH SCORES
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Leaderboard Screen */}
                {showLeaderboard && (
                    <div className="absolute inset-0 flex flex-col items-center z-30 bg-black/95 p-8 overflow-hidden">
                        <h2 className="text-3xl font-bold text-green-500 mb-6 border-b-2 border-green-500/50 pb-2 w-full text-center tracking-widest">TOP OPERATORS</h2>

                        <div className="w-full flex-1 overflow-y-auto custom-scrollbar pr-2 mb-6 font-mono text-green-400/90 text-sm space-y-2">
                            <div className="grid grid-cols-12 text-green-700 border-b border-green-900/50 pb-1 mb-2 font-bold uppercase text-xs">
                                <span className="col-span-2">#</span>
                                <span className="col-span-6">CODENAME</span>
                                <span className="col-span-4 text-right">SCORE</span>
                            </div>
                            {leaderboard.length === 0 ? (
                                <p className="text-green-800 text-center py-4">LOADING DATA...</p>
                            ) : (
                                leaderboard.map((entry, idx) => (
                                    <div key={idx} className={`grid grid-cols-12 ${entry.nickname === nickname ? 'text-white bg-green-900/30' : ''}`}>
                                        <span className="col-span-2 opacity-50">{(idx + 1).toString().padStart(2, '0')}</span>
                                        <span className="col-span-6 truncate">{entry.nickname}</span>
                                        <span className="col-span-4 text-right">{entry.score.toString().padStart(4, '0')}</span>
                                    </div>
                                ))
                            )}
                        </div>

                        <button
                            onClick={() => {
                                setShowLeaderboard(false);
                                setGameOver(false);
                                setIsPlaying(false);
                                setScore(0);
                            }}
                            className="border border-green-500 text-green-500 px-8 py-2 font-bold rounded hover:bg-green-500/20 transition-all uppercase text-sm"
                        >
                            BACK TO MENU
                        </button>
                    </div>
                )}

                {/* Pause Screen */}
                {isPaused && isPlaying && !gameOver && (
                    <div className="text-center z-10 bg-black/80 p-8 rounded-xl border border-green-500/30 backdrop-blur-sm absolute inset-0 flex flex-col items-center justify-center">
                        <h2 className="text-3xl font-bold text-yellow-500 mb-6 tracking-widest">PAUSED</h2>
                        <button
                            onClick={resumeGame}
                            className="border-2 border-green-500 text-green-500 px-8 py-3 font-bold rounded hover:bg-green-500/20 transition-all mb-4"
                        >
                            RESUME GAME
                        </button>
                        <button
                            onClick={() => {
                                setIsPlaying(false);
                                setScore(0);
                            }}
                            className="text-red-400 hover:text-red-300 text-sm"
                        >
                            QUIT TO MENU
                        </button>
                    </div>
                )}

                {/* Game Over Screen */}
                {gameOver && !showLeaderboard && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="text-center bg-black/90 p-8 rounded-xl border border-red-500/30 backdrop-blur-sm min-w-[300px]">
                            <h2 className="text-4xl font-bold text-red-500 mb-2 glitch-text">GAME OVER</h2>
                            <p className="text-white mb-2 text-xl font-mono">SCORE: <span className="text-green-400">{score}</span></p>
                            <p className="text-zinc-500 text-xs mb-8">Saving to global mainframe...</p>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={handleStart}
                                    className="border border-green-500 text-green-500 px-8 py-3 font-bold rounded hover:bg-green-500/20 transition-colors animate-pulse uppercase"
                                >
                                    TRY AGAIN
                                </button>
                                <button
                                    onClick={() => setShowLeaderboard(true)}
                                    className="text-zinc-400 hover:text-white text-xs underline decoration-zinc-700"
                                >
                                    Global Standings
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <canvas
                    ref={canvasRef}
                    className={`w-full h-full block ${(!isPlaying || isPaused) ? "opacity-30 blur-sm" : "opacity-100 cursor-none"}`}
                />
            </div>
        </FloatingWindow>
    );
}
