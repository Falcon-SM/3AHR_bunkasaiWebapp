"use client";
import React, { useState, useEffect, useRef, RefObject } from "react";
import { useRiddles } from "@/app/context/riddleContext";

type props = {
    bun: string;
    n: number;
    hints: string[];
    imgg?: string;
    imgWidth?: number;
    imgHeight?: number;
};

export default function Ques({ hints, bun, n, imgg = 'naan', imgWidth = 300, imgHeight = 200 }: props) {
    const { setGazo } = useRiddles()
    const {
        setOneIsAnswered,
        setTwoIsAnswered,
        setThreeIsAnswered,
        setFourIsAnswered,
    } = useRiddles();
    const [hintti, setHintti] = useState(false)
    const [numhint, setNumhint] = useState(0);
    const [answer, setAnswer] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showError, setShowError] = useState(false)
    const canvasRef = [useRef<(HTMLCanvasElement) | null>(null), useRef<(HTMLCanvasElement) | null>(null), useRef<(HTMLCanvasElement) | null>(null), useRef<(HTMLCanvasElement) | null>(null)]
    const handleCheckAnswer = async () => {
        setIsLoading(true);
        setShowError(false);
        setIsCorrect(false);

        try {
            const res = await fetch("/api/riddle/sho", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answer: answer, num: n }),
            });
            const result = await res.json();
            if (result.correct) {
                setIsCorrect(true);
            } else {
                setShowError(true);
            }
        } catch {
            setShowError(true);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        for (let i = 0; i < hints.length; i++) {
            const canvas = canvasRef[i].current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            const [cx, cy, cw, ch, r] = [0, 0, 220, Math.ceil(hints[i].length / 16) * 25, 0];
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cx + r, cy);
            ctx.lineTo(cx + cw - r, cy);
            ctx.quadraticCurveTo(cx + cw, cy, cx + cw, cy + r);
            ctx.lineTo(cx + cw, cy + ch - 20);
            ctx.lineTo(cx + cw + 20 / 2, cy + ch - 20 / 2);
            ctx.lineTo(cx + cw, cy + ch);
            ctx.lineTo(cx + r, cy + ch);
            ctx.quadraticCurveTo(cx, cy + ch, cx, cy + ch - r);
            ctx.lineTo(cx, cy + r);
            ctx.quadraticCurveTo(cx, cy, cx + r, cy);
            ctx.closePath();
            ctx.fillStyle = "#00eeffff";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.fill();
            ctx.stroke();
            //ctx.save();
            ctx.textBaseline = "top";
            ctx.font = '15px Roboto medium';
            ctx.fillStyle = "black";

            const words = hints[i];
            let line = "";
            let curY = cy + 5;
            for (let n = 0; n < words.length; n++) {
                const testLine = line + words[n];
                const metrics = ctx.measureText(testLine);
                if (metrics.width > cw - 10 && line) {
                    ctx.fillText(line, 5, curY);
                    line = words[n];
                    curY += 22;
                } else {
                    line = testLine;
                }
            }
            console.log(line)
            if (line) {
                ctx.fillText(line, 5, curY);
            }
            ctx.restore();

        }
    }, [numhint]);
    useEffect(() => { setTimeout(() => { setHintti(true) }, 30000 * (n + 1)) }, [])
    return (
        <div style={{ marginBottom: 28, width: 500, display: "flex", overflow: "visible" }} key={n}>
            <div style={{ width: 500, flex: "0 0 auto" }}>
                <h2
                    //dangerouslySetInnerHTML={{ __html:{mondai[n]}}}
                    style={{
                        fontSize: "1.2rem",
                        color: "#ffffffff",
                        marginBottom: 12,
                        background: "#303030ff",
                        padding: "8px 16px",
                        borderRadius: "8px",
                        fontWeight: 400,

                    }}
                >{bun.split('\n').map((line, index) => (
                    <span key={index}>
                        {line}
                        <br />
                    </span>
                ))}</h2>
                {imgg !== "naan" && (
                    <img
                        src={imgg}
                        alt={`image-${n}`}
                        width={imgWidth}
                        height={imgHeight}
                        style={{ objectFit: "contain", marginBottom: 10 }}
                        onClick={() => { setGazo(imgg) }}
                    />
                )}
                <div style={{ display: "flex" }}>
                    <input
                        type="text"
                        className="riddle-input"
                        placeholder={`謎${n + 1}の答えを入力`}
                        style={{
                            padding: "10px",
                            fontSize: "1rem",
                            borderRadius: "6px",
                            //border: "1px solid #00eeffff",
                            marginBottom: "4px"
                        }}
                        onChange={(e) => {
                            setAnswer(e.target.value);
                            if (e.target.value.length > 0) {
                                if (n === 0) setOneIsAnswered(true);
                                if (n === 1) setTwoIsAnswered(true);
                                if (n === 2) setThreeIsAnswered(true);
                                if (n === 3) setFourIsAnswered(true);
                            }
                        }}
                    />
                    {answer.trim() !== "" && (
                        <button
                            onClick={handleCheckAnswer}
                            disabled={isLoading}
                            className="botanin"
                            style={{
                                cursor: isLoading ? "not-allowed" : "pointer",
                                opacity: isLoading ? 0.6 : 1,
                            }}
                        >
                            {isLoading ? "判定中..." : "チェック"}
                        </button>
                    )}
                </div>
                {showError && (<p style={{ color: "#d63031",margin:5 }}>残念、はずれ!</p>)}
                {isCorrect && (<p style={{ margin:5}}>正解!</p>)}
                <div style={{ width: 220, flex: "0 0 auto" }}>
                    {(hintti && numhint < hints.length) &&
                        <button
                            onClick={() => { sessionStorage.sawhint = parseInt(sessionStorage.sawhint) + 1; setNumhint((prev) => (prev + 1)) }}
                            style={{
                                marginTop: 10,
                                padding: "10px 20px",
                                background: "#00eeffff",
                                color: "#000",
                                border: "none",
                                borderRadius: "6px",
                                fontWeight: 600,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                transition: "background 0.2s",
                            }}>ヒントを表示</button>}
                </div>
                {[...Array(numhint)].map((_, idx) => (
                    <canvas width={240} height={Math.ceil(hints[idx].length / 16) * 25} key={idx} ref={canvasRef[idx]} style={{ margin: "0 0 10px 80px", height: `${Math.ceil(hints[idx].length / 16) * 25}px`, width: 240 }}></canvas>
                ))}
            </div>
        </div>)
};