"use client";
import React, { useState, useEffect, useRef, RefObject, ReactNode } from "react";
import { useRiddles } from "@/app/context/riddleContext";
import { useRouter } from "next/navigation";

type props = {
    bun: string;
    n: number;
    hints: string[];
    imgg?: string;
    imgWidth?: number;
    imgHeight?: number;
    children?: ReactNode;
};

export default function Ques({ children, hints, bun, n, imgg = 'naan', imgWidth = 300, imgHeight = 200 }: props) {
    const router = useRouter();
    const { setGazo, setKakunin, ok, setOk, stage, setStage } = useRiddles()
    const {
        setOneIsAnswered,
        setTwoIsAnswered,
        setThreeIsAnswered,
        setFourIsAnswered,
    } = useRiddles();
    const [numhint, setNumhint] = useState(0);
    const [saidainum, setSaidainum] = useState(0);
    const [hintti, setHintti] = useState(false)
    const [hintbun, setHintbun] = useState("");
    const [answer, setAnswer] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showError, setShowError] = useState(false);
    const [isHintLoading, setIsHintLoading] = useState(false);
    const [saidai, setSaidai] = useState(2);
    const [hintbuf, setHintbuf] = useState<string | null>(null);
    const canvasRef = useRef<(HTMLCanvasElement) | null>(null)
    const handleCheckAnswer = async () => {
        setIsLoading(true);
        setShowError(false);
        setIsCorrect(false);
        try {
            let link = "";
            let saki = "";
            if (n < 10) {
                link = "sho";
            } else if (n == 10) {
                link = "1";
                saki = "riddles/2"
            } else {
                link = "4";
                saki = "riddles/5"
            }
            const res = await fetch("/api/riddle/" + link, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answer: answer, num: n }),
            });
            const result = await res.json();
            if (result.correct) {
                setIsCorrect(true);
                if (n >= 10) {
                    router.push("/" + saki)
                }
            } else {
                setShowError(true);
            }
        } catch {
            setShowError(true);
        } finally {
            setIsLoading(false);
        }

    };

    const handlehint = async (inde: number) => {
        setIsHintLoading(true);
        setShowError(false);
        try {
            let aa = n
            if (5 <= n && n < 10) {
                aa = n + 2;
            } else if (10 <= n && n < 12) {
                aa = 7 * (n - 9) - 1
            } else if (12 <= n) {
                aa = 7 * (n - 11) - 2
            }
            const res = await fetch("/api/hint", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ numquiz: aa, numhints: numhint + inde }),
            });
            const result = await res.json();
            if (numhint + 1 + inde == result.saidai) {
                setStage(n);
                setHintbuf(result.hint);
                setKakunin(true);
            } else {
                const sh = sessionStorage.sawhint;
                sessionStorage.sawhint = parseInt(sh) + Math.max(numhint + 1 + inde, saidainum) - saidainum;
                setSaidainum((prev) => Math.max(prev, numhint + 1 + inde));
                setHintbun(result.hint);
                setNumhint((prev) => (prev + 1 + inde));
                setSaidai(result.saidai);
            }
        } catch {
            setShowError(true);
        } finally {
            setIsHintLoading(false);
        }

    };
    useEffect(() => {
        if (stage == n && ok) {
            setHintbun(hintbuf ?? "a");
            setNumhint((prev) => (prev + 1));
            setOk(null);
            if (saidainum < saidai) {
                sessionStorage.sawhint = parseInt(sessionStorage.sawhint) + 1;
                setSaidainum(saidai);
            }
        }
    }, [ok])
    useEffect(() => {

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const [cx, cy, cw, ch, r] = [0, 0, 220, Math.ceil(hintbun.length / 14) * 25, 0];
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

        const words = hintbun;
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

    }, [hintbun]);
    if (n == 13) {
        useEffect(() => { setTimeout(() => { setHintti(true) }, 30000) });
    } else {
        useEffect(() => { setTimeout(() => { setHintti(true) }, 30000 * Math.max(n % 5 + 1, Math.floor(n / 2) + 2 * Math.floor((13 - n) / 2) - Math.floor((13 - n) / 4) * 10)) }, [])
    }
    return (
        <div style={{ marginBottom: 28, width: 500, display: "flex", overflow: "visible" }} key={n}>
            <div style={{ width: 500, flexShrink: 0 }}>
                {n >= 10 && <div
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
                >
                    {children}
                </div>}
                {n < 10 &&
                    <h2
                        style={{
                            fontSize: "1.2rem",
                            color: "#ffffffff",
                            marginBottom: 12,
                            background: "#303030ff",
                            padding: "8px 16px",
                            borderRadius: "8px",
                            fontWeight: 400,

                        }}>
                        {bun.split('\n').map((line, index) => (
                            <span key={index}>
                                {line}
                                <br />
                            </span>))}
                    </h2>
                }
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
                {(n < 12) &&
                    <div style={{ display: "flex", marginTop: (n >= 10 ? 30 : 0), }}>
                        <input
                            type="text"
                            className="riddle-input"
                            placeholder={n < 10 ? `謎${n % 5 + 1}の答えを入力` : "答えを入力"}
                            style={{
                                height: 25,
                                marginRight: 5,
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
                        <button
                            onClick={handleCheckAnswer}
                            disabled={isLoading}
                            className="botanin"
                            style={{
                                cursor: isLoading || answer.trim() == "" ? "not-allowed" : "pointer",
                                opacity: isLoading || answer.trim() == "" ? 0.6 : 1,
                            }}
                        >
                            {isLoading ? "判定中..." : (n! < 10 ? "チェック" : "回答する")}
                        </button>
                    </div>
                }
                {showError && (<p style={{ color: "#d63031", margin: 5 }}>答えが違います。もう一度挑戦してください。</p>)}
                {isCorrect && (<p style={{ margin: 5 }}>正解!</p>)}
                <div style={{ width: 220, flexShrink: 0 }}>
                    {(numhint > 0) &&
                        <button
                            onClick={() => { handlehint(-2) }}
                            style={{
                                marginTop: 10,
                                marginRight: 5,
                                padding: "10px 20px",
                                background: "#00eeffff",
                                color: "#000",
                                border: "none",
                                borderRadius: "6px",
                                fontWeight: 600,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                transition: "background 0.2s",
                            }}>前へ</button>
                    }
                    {(hintti && numhint < saidai) &&
                        <button
                            onClick={() => { handlehint(0) }}
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
                            }}>{numhint === 0 ? "ヒントを表示" : "次へ"}</button>
                    }
                </div>
            </div>
            <div>
                {numhint !== 0 &&
                    <canvas width={240} height={Math.ceil(hintbun.length / 14) * 25} ref={canvasRef} style={{ margin: "0 0 10px 80px", height: `${Math.ceil(hintbun.length / 14) * 25}px`, width: 240 }}></canvas>
                }
            </div>
        </div>
    )
};