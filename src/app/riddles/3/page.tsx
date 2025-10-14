"use client";
import React, { useEffect, useMemo, useState, useRef } from "react";
import { useRiddles } from "@/app/context/riddleContext";
import { write } from "fs";
import Diamond from "../../../../components/diamondd";
import Script from "next/script";

type HintPost = {
    icon?: string;
    name?: string;
    content: string; // 表示用のテキスト（暗号化された画面: ... も含む）
    img?:string;
    time?:string;
    // 以下は暗号化投稿専用のメタ情報
    riddleNumber?: number; // 1..4 のどの謎の投稿か
    base64?: string; // 暗号化文字列
    isDecrypted?: boolean; // 復号済みか
};

export default function Home() {
    const { threeIsAnswered, incrementDecryptCount, decryptCounts } = useRiddles();
    const [crosswordAnswer, setCrosswordAnswer] = useState("");
    const [isCorrect, setIsCorrect] = useState(false);
    const [showError, setShowError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [anses,setAnses]=useState([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
    const kazumozi=["A","S","T","M","C","I","B","U","P","O","G","R","M","R","K","F","V","E","W","A","I"]
    
    const getAns=(bango:number)=>(
        ()=>{setAnses((prev)=>{prev[bango]=1-prev[bango];return prev})}
    )

    const [posts, setPosts] = useState<HintPost[]>([]);
            useEffect(()=>{
                const h=parseInt(sessionStorage.h);
                const m=parseInt(sessionStorage.m);
                setPosts([{
                    content:"今日はこまば遺跡に行ってきた！これがあの有名な「かがやきの石板」か、、、",
                    time:(h+Math.floor((m-37)/60))+":"+("0"+(m+26)%60).slice(-2),
                    img:"/論理クイズ.png"
                },
                {content:"💩",time:(h+Math.floor((m-20)/60))+":"+("0"+(m+40)%60).slice(-2)},
                {content:"シタっていう男はひどいうそつきだ。あいつの言うことは信じない方がいい。",time:(h+Math.floor((m-10)/60))+":"+("0"+(m+50)%60).slice(-2)},
                {content:"ケルネル高校の文化祭言ってきた!なぞに落書きして妨害してやったわw",time:h+":"+("0"+m).slice(-2)},
                {
                    time:sessionStorage.timm,
                    content: `俺のアカウント名、俺の本名から来てるんだよね。12個あるうちの10個目っていうことでさ。もし名前がトラだったら3/12なんだなw`,
                },
        
                ])
            },[])
    

    const handleCheckAnswer = async () => {
        setIsLoading(true);
        setShowError(false);
        setIsCorrect(false);
        try {
            const res = await fetch("/api/riddle/3", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answer: anses.join('')}),
            });
            const result = await res.json();
            //console.log(result)
            if (result.correct) setIsCorrect(true); else setShowError(true);
        } catch {
            setShowError(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 900, margin: "40px auto", padding: "32px", display: "flex", gap: "32px" }}>
            {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8SS8YBH1B6"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-8SS8YBH1B6');` }}
        />
            {/* 左：SNS風ヒント */}
            <div
                style={{
                    width: 320,
                    background: "#f6f8fb",
                    borderRadius: "16px",
                    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
                    padding: "20px 14px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {posts.map((post, idx) => (
                    <div
                        key={`post-${idx}`} // ← keyをユニークに
                        style={{
                            width: "100%",
                            marginBottom: "24px",
                            background: "#fff",
                            borderRadius: "12px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                            padding: "16px 12px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <img
                            src={post.icon ?? "/sampleicon.png"}
                            alt="アカウントアイコン"
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: "50%",
                                objectFit: "cover",
                                marginBottom: "8px",
                                border: "2px solid #0984e3",
                            }}
                        />
                        <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "6px" }}>
                            {post.name ?? "Bird41"}<span style={{fontSize:"0.9rem",fontWeight:200,color:"#868686ff"}}>　{post.time}</span>
                        </div>
                        <div style={{ color: "#4b5563", fontSize: "0.95rem", textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.6, wordBreak: "break-all", overflowWrap: "anywhere" }}>
                            {post.content}
                        </div>
                        {post.img!==undefined &&
                        <img
                            src={post.img}
                            onClick={()=>{window.open(post.img)}}
                            style={{
                                width: 250,
                                borderRadius: "5%",
                                marginTop: "8px",
                            }}
                        />}
                        
                    </div>
                ))}
            </div>
            <div className="container" style={{width : 700, textAlign: 'right'}} onClick={()=>console.log(anses)}>
                <h2
                    style={{
                        fontSize: "1.2rem",
                        color: "#34495e",
                        marginBottom: 12,
                        background: "#f5f7fa",
                        padding: "8px 16px",
                        borderRadius: "8px",
                    }}
                >「SNSの使い方」を読み、「なくすべきもの」を押せ</h2>
                <div style={{background: "#f9fafb",border:"2px solid black",borderRadius: "8px"}}>
                <p　style={{marginBottom:"10px",textAlign: 'left'}}>　箱のパスワードは、、、</p>
                <div style={{width:330,height:200,position:"relative",margin:"0 auto"}}>
                {[...Array(3)].map((_,idx)=>(
                    <div key={idx} style={{width:100,}}>
                    <Diamond typp={0} mozi={kazumozi[idx*7]} x={80+idx*110} y={15} sub={getAns(idx*7)}></Diamond>
                    <Diamond typp={0} mozi={kazumozi[idx*7+1]} x={0+idx*110} y={15} sub={getAns(idx*7+1)}></Diamond>
                    <Diamond typp={0} mozi={kazumozi[idx*7+2]} x={0+idx*110} y={90} sub={getAns(idx*7+2)}></Diamond>
                    <Diamond typp={0} mozi={kazumozi[idx*7+3]} x={80+idx*110} y={90} sub={getAns(idx*7+3)}></Diamond>
                    <Diamond typp={1} mozi={kazumozi[idx*7+4]} x={15+idx*110} y={0} sub={getAns(idx*7+4)}></Diamond>
                    <Diamond typp={1} mozi={kazumozi[idx*7+5]} x={15+idx*110} y={77} sub={getAns(idx*7+5)}></Diamond>
                    <Diamond typp={1} mozi={kazumozi[idx*7+6]} x={15+idx*110} y={157} sub={getAns(idx*7+6)}></Diamond>
                    </div>
                ))}
                </div>
                </div>
                <button
                        onClick={handleCheckAnswer}
                        disabled={isLoading}
                        style={{
                            marginTop:"10px",
                            padding: "10px 20px",
                            background: "#2563eb",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            fontWeight: 600,
                            cursor: isLoading ? "not-allowed" : "pointer",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                            transition: "background 0.2s",
                            opacity: isLoading ? 0.6 : 1,
                        }}
                    >
                        {isLoading ? "判定中..." : "Hello, world!"}
                    </button>
                
                
                {showError && <div style={{ color: "#d63031", marginBottom: 12 }}>答えが違います。もう一度挑戦してください。</div>}
                {isCorrect && (
                    <a href="/riddles/4" style={{ display: "block", textAlign: "center", marginTop: "24px", padding: "12px 0", background: "#00b894", color: "#fff", borderRadius: "8px", fontWeight: 600, textDecoration: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", transition: "background 0.2s" }}
                        onMouseOver={e => (e.currentTarget.style.background = "#55efc4")}
                        onMouseOut={e => (e.currentTarget.style.background = "#00b894")}>
                        箱が開いた！
                    </a>
                )}
            </div>
        </div>
    );
}