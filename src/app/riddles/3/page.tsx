"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useRiddles } from "@/app/context/riddleContext";
import { write } from "fs";
import Diamond from "../../../../components/diamondd";

export default function Home() {
    const { threeIsAnswered, incrementDecryptCount, decryptCounts } = useRiddles();
    const [crosswordAnswer, setCrosswordAnswer] = useState("");
    const [isCorrect, setIsCorrect] = useState(false);
    const [showError, setShowError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [posts, setPosts] = useState([
        { icon: "/sampleicon.png", name: "Riddlemaster", content: "謎を解いていくと、ここに新しい投稿が表示されます！" },
    ]);
    
    const handleCheckAnswer = async () => {
        setIsLoading(true);
        setShowError(false);
        setIsCorrect(false);
        try {
            const res = await fetch("/api/riddle/3", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answer: crosswordAnswer }),
            });
            const result = await res.json();
            if (result.correct) setIsCorrect(true); else setShowError(true);
        } catch {
            setShowError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 900, margin: "40px auto", padding: "32px", display: "flex", gap: "32px" }}>
            {/* 左：SNS風ヒント */}
            <div style={{ width: 320, background: "#f6f8fb", borderRadius: "16px", boxShadow: "0 6px 18px rgba(0,0,0,0.08)", padding: "20px 14px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                {posts.map((post, idx) => (
                    <div key={`post-${idx}`} style={{ width: "100%", marginBottom: "24px", background: "#fff", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", padding: "16px 12px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <img src={post.icon} alt="アカウントアイコン" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", marginBottom: "8px", border: "2px solid #0984e3" }} />
                        <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "6px" }}>{post.name}</div>
                        <div style={{ color: "#4b5563", fontSize: "0.95rem", textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.6 }}>{post.content}</div>
                    </div>
                ))}
            </div>
            <div className="container" style={{width : 700}}>
                <div style={{width:330,height:200,position:"relative",margin:"0 auto"}}>
                {[...Array(3)].map((_,idx)=>(
                    <div key={idx} style={{width:100,}}>
                    <Diamond typp={0} mozi="a" x={80+idx*110} y={15}></Diamond>
                    <Diamond typp={0} mozi="a" x={0+idx*110} y={15}></Diamond>
                    <Diamond typp={0} mozi="a" x={0+idx*110} y={90}></Diamond>
                    <Diamond typp={0} mozi="a" x={80+idx*110} y={90}></Diamond>
                    <Diamond typp={1} mozi="a" x={15+idx*110} y={0}></Diamond>
                    <Diamond typp={1} mozi="a" x={15+idx*110} y={157}></Diamond>
                    </div>
                ))}
                </div>
                
                {showError && <div style={{ color: "#d63031", marginBottom: 12 }}>答えが違います。もう一度挑戦してください。</div>}
                {isCorrect && (
                    <a href="/riddles/4" style={{ display: "block", textAlign: "center", marginTop: "24px", padding: "12px 0", background: "#00b894", color: "#fff", borderRadius: "8px", fontWeight: 600, textDecoration: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", transition: "background 0.2s" }}
                        onMouseOver={e => (e.currentTarget.style.background = "#55efc4")}
                        onMouseOut={e => (e.currentTarget.style.background = "#00b894")}>
                        次の謎へ進む
                    </a>
                )}
            </div>
        </div>
    );
}
