"use client";

import { useEffect, useRef, useState } from "react";
import FloatingWindow from "../ui/FloatingWindow";

export default function KonamiCodeGame() {
    // Playable Pong Logic
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        if (!isPlaying || gameOver || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        // Game State
        const ball = { x: canvas.width / 2, y: canvas.height / 2, dx: 3, dy: -3, radius: 6 };
        const paddle = { width: 80, height: 10, x: (canvas.width - 80) / 2 };
        let points = 0;

        // Mouse Handler
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const relativeX = e.clientX - rect.left;
            if (relativeX > 0 && relativeX < canvas.width) {
                paddle.x = relativeX - paddle.width / 2;
            }
        };
        canvas.addEventListener("mousemove", handleMouseMove);

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw Ball
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fillStyle = "#00DDFF";
            ctx.fill();
            ctx.closePath();

            // Draw Paddle
            ctx.beginPath();
            ctx.rect(paddle.x, canvas.height - paddle.height - 5, paddle.width, paddle.height);
            ctx.fillStyle = "#00FF00";
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#00FF00";
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.closePath();

            // Collision Logic
            // Walls
            if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
                ball.dx = -ball.dx;
            }
            if (ball.y + ball.dy < ball.radius) {
                ball.dy = -ball.dy;
            }
            // Paddle
            if (ball.y + ball.dy > canvas.height - ball.radius - paddle.height - 5) {
                if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
                    ball.dy = -ball.dy * 1.1; // Speed up
                    ball.dx = ball.dx * 1.05;
                    points++;
                    setScore(points);
                } else if (ball.y + ball.dy > canvas.height - ball.radius) {
                    // Game Over
                    setGameOver(true);
                    return;
                }
            }

            ball.x += ball.dx;
            ball.y += ball.dy;

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
            canvas.removeEventListener("mousemove", handleMouseMove);
        };
    }, [isPlaying, gameOver]);

    return (
        <FloatingWindow id="game" title="Retro Pong" width={400} height={350} className="bg-black border-green-500/50">
            <div className="flex flex-col items-center justify-center h-full gap-4 relative">
                <div className="absolute top-2 right-4 text-green-500 font-mono font-bold text-xl">
                    {score.toString().padStart(3, '0')}
                </div>

                {!isPlaying && !gameOver && (
                    <div className="text-center z-10">
                        <h2 className="text-2xl font-bold text-green-500 mb-2 glitch-text">READY PLAYER ONE?</h2>
                        <p className="text-green-800/80 mb-6 text-xs font-mono">Control the paddle with your mouse</p>
                        <button
                            onClick={() => setIsPlaying(true)}
                            className="bg-green-600 text-black px-8 py-3 font-bold rounded hover:bg-green-500 transition-colors shadow-[0_0_20px_rgba(0,255,0,0.3)] animate-pulse"
                        >
                            INSERT COIN (START)
                        </button>
                    </div>
                )}

                {gameOver && (
                    <div className="text-center z-10">
                        <h2 className="text-3xl font-bold text-red-500 mb-2">GAME OVER</h2>
                        <p className="text-white mb-6">Score: {score}</p>
                        <button
                            onClick={() => {
                                setGameOver(false);
                                setScore(0);
                                setIsPlaying(true);
                            }}
                            className="border border-green-500 text-green-500 px-6 py-2 font-bold rounded hover:bg-green-500/20 transition-colors"
                        >
                            TRY AGAIN
                        </button>
                    </div>
                )}

                <canvas
                    ref={canvasRef}
                    width={360}
                    height={250}
                    className={`bg-[#051005] rounded border border-green-900/50 ${!isPlaying ? "opacity-30" : "opacity-100 cursor-none"}`}
                />
            </div>
        </FloatingWindow>
    );
}
