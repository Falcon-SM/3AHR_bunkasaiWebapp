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
    const {setGazo}=useRiddles()
    const {
        setOneIsAnswered,
        setTwoIsAnswered,
        setThreeIsAnswered,
        setFourIsAnswered,
    } = useRiddles();
    const [hintti,setHintti]=useState(false)
    const [numhint, setNumhint] = useState(0);
    const canvasRef = [useRef<(HTMLCanvasElement) | null>(null), useRef<(HTMLCanvasElement) | null>(null), useRef<(HTMLCanvasElement) | null>(null), useRef<(HTMLCanvasElement) | null>(null)]
    useEffect(() => {
        for (let i = 0; i < hints.length; i++) {
            const canvas = canvasRef[i].current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;
            const [cx, cy, cw, ch, r] = [0, 0, 250, Math.ceil(hints[i].length / 16) * 20, 0];
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
            ctx.fillStyle = "white";
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
                    curY += 20;
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
    useEffect(()=>{setTimeout(()=>{setHintti(true)},30000*(n+1))},[])
    return (
        <div style={{ marginBottom: 28, width: 500, display: "flex", overflow: "visible" }} key={n}>
            <div style={{ width: 500, flex: "0 0 auto" }}>
                <h2
                    //dangerouslySetInnerHTML={{ __html:{mondai[n]}}}
                    style={{
                        fontSize: "1.2rem",
                        color: "#34495e",
                        marginBottom: 12,
                        background: "#f5f7fa",
                        padding: "8px 16px",
                        borderRadius: "8px",
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
                        style={{ objectFit: "contain" }}
                        onClick={()=>{setGazo(imgg)}}
                    />
                )}

                <input
                    type="text"
                    className="riddle-input"
                    placeholder={`謎${n + 1}の答えを入力`}
                    style={{
                        width: "calc(100% - 16px)",
                        padding: "10px",
                        fontSize: "1rem",
                        borderRadius: "6px",
                        border: "1px solid #d1d5db",
                        marginBottom: "4px",
                    }}
                    onChange={(e) => {
                        if(e.target.value.length > 0){
                            if (n === 0) setOneIsAnswered(true);
                            if (n === 1) setTwoIsAnswered(true);
                            if (n === 2) setThreeIsAnswered(true);
                            if (n === 3) setFourIsAnswered(true);
                        }
                    }}
                />
                {(hintti && numhint < hints.length) &&
                    <button
                        onClick={() => { sessionStorage.sawhint=parseInt( sessionStorage.sawhint)+1;alert(sessionStorage.sawhint);setNumhint((prev) => (prev + 1)) }}
                        style={{
                            padding: "10px 20px",
                            background: "#0984e3",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontWeight: 600,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                            transition: "background 0.2s",
                        }}>ヒントを表示</button>}
            </div>
            <div style={{ width: 300, flex: "0 0 auto" }}>
                {[...Array(numhint)].map((_, idx) => (
                    <canvas width={300} height={Math.ceil(hints[idx].length / 16) * 20} key={idx} ref={canvasRef[idx]} style={{ margin: "0 0 10px 80px", height: `${Math.ceil(hints[idx].length / 16) * 20}px`, width: 300 }}></canvas>
                ))}
            </div>
        </div>)
};