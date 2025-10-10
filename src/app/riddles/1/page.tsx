"use client";
import React, { useEffect, useMemo, useState } from "react";
import Ques from "../../../../components/shomon";
import { useRiddles } from "@/app/context/riddleContext";

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
const crossd = [
    [0,0,0,1,0,0,0],
    [0,1,0,1,0,0,1],
    [1,1,1,1,0,0,1],
    [0,1,0,1,1,1,1],
    [0,1,0,0,0,0,1]

];
const crosshuto=[8,34,25,10,20,2]

const mondai = [
    "左下の⬛️から右上の⬛️へ向かえ。\n壁にぶつかるまで曲がれない。\nまた、右にしか曲がることができない。\n通った文字を順に読め。",
    "室町幕府の将軍を追放した戦国武将は？",
    "嘘をついているB組生徒の名を出席番号順に読め。\n下の5人は全員同じB組である。",
    "投稿者が文化祭で撮った写真に写っている謎を解け。",
    "来年の筑駒の文化祭のテーマはなんでしょう？"
]

const monim=['naan','naan', '/論理クイズ.png','naan','naan']

export default function Home() {
    const { oneIsAnswered, twoIsAnswered, threeIsAnswered, fourIsAnswered, incrementDecryptCount, decryptCounts,gazo,setGazo} = useRiddles();
    const [crosswordAnswer, setCrosswordAnswer] = useState("");
    const [isCorrect, setIsCorrect] = useState(false);
    const [showError, setShowError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [quizTwoAnswer, setQuizTwoAnswer] = useState("");
    const [posts, setPosts] = useState<HintPost[]>([]);
    useEffect(()=>{
        const h=new Date().getHours();
        const m=new Date().getMinutes();
        setPosts([{
            content:"今日はこまば遺跡に行ってきた！これがあの有名な「かがやきの石板」か、、、",
            time:(h+Math.floor((m-37)/60))+":"+("0"+(m+26)%60).slice(-2),
            img:"/論理クイズ.png"
        },
        {content:"💩",time:(h+Math.floor((m-20)/60))+":"+("0"+(m+40)%60).slice(-2)},
        {content:"シタっていう男はひどいうそつきだ。あいつの言うことは信じない方がいい。",time:(h+Math.floor((m-10)/60))+":"+("0"+(m+50)%60).slice(-2)},
        {content:"ケルネル高校の文化祭言ってきた!なぞに落書きして妨害してやったわw",time:h+":"+("0"+m).slice(-2)}

        ])
    },[])
    const [nokori,setnokori]=useState(1200);
    const [decodeInputs, setDecodeInputs] = useState<Record<number, string>>({}); // key: post index
    const hints=[["徳川家の人だよ！","たい焼きを食べて死んだという噂があるよ！","家康だよ！"],["この人が登場する有名な戦国ゲームがあるよ！","〇〇の野望","織田信長っていう人だよ！"],["a","b","c"],["a","b","d"],["廻天","結","Reboot"]]
    // Base64暗号テキスト（第1問用）
    const base64Hint = useMemo(() => {
        const hint = "第1問のヒント: 徳川家の初代将軍だよ。下の名前を思い出して。";
        if (typeof window === "undefined") return "";
        try { return window.btoa(unescape(encodeURIComponent(hint))); } catch { return ""; }
    }, [typeof window]);

    // Base64暗号テキスト（第2〜4問用）
    const base64Hint2 = useMemo(() => {
        const hint = "第2問のヒント: 室町幕府の将軍を都から追放した戦国武将。";
        if (typeof window === "undefined") return "";
        try { return window.btoa(unescape(encodeURIComponent(hint))); } catch { return ""; }
    }, []);
    const base64Hint3 = useMemo(() => {
        const hint = "第3問のヒント: 2019年から始まった新しい元号。";
        if (typeof window === "undefined") return "";
        try { return window.btoa(unescape(encodeURIComponent(hint))); } catch { return ""; }
    }, []);
    const base64Hint4 = useMemo(() => {
        const hint = "第4問のヒント: 東北地方の太平洋沖が震源の大規模地震の正式名称。";
        if (typeof window === "undefined") return "";
        try { return window.btoa(unescape(encodeURIComponent(hint))); } catch { return ""; }
    }, []);

    useEffect(()=>{
            console.log(Number.isNaN(Number(sessionStorage.zikan)));
            console.log(sessionStorage.zikan);
            if(!Number.isNaN(Number(sessionStorage.zikan))){
                setnokori(parseInt(sessionStorage.zikan));
            }
        },[])


    const handleCheckAnswer = async () => {
        setIsLoading(true);
        setShowError(false);
        setIsCorrect(false);

        try {
            const res = await fetch("/api/riddle/1", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answer: crosswordAnswer }),
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

    // 謎3に文字が入ったら暗号化投稿を一度だけ表示
    useEffect(() => {
        const alreadyPosted = posts.some(p => p.base64 === base64Hint3 && p.riddleNumber === 3);
        if (threeIsAnswered && !alreadyPosted && base64Hint3) {
            setPosts((prev) => ([
                ...prev,
                {
                    time:new Date().getHours()+":"+new Date().getMinutes(),
                    content: `俺のアカウント名、俺の本名から来てるんだよね。12個あるうちの10個目っていうことでさ。もし名前がトラだったら3/12なんだなw`,
                },
            ]));
        }
    }, [threeIsAnswered]);


    const handlePerPostDecodeSubmit = (postIndex: number) => (e: React.FormEvent) => {
        e.preventDefault();
        const input = (decodeInputs[postIndex] || "").trim();
        const post = posts[postIndex];
        if (!post || !post.base64 || post.isDecrypted) return;
        if (input === "復号する") {
            try {
                const decoded = decodeURIComponent(escape(window.atob(post.base64)));
                setPosts((prev) => {
                    const next = [...prev];
                    const target = next[postIndex];
                    if (target) {
                        target.content = decoded;
                        target.isDecrypted = true;
                    }
                    return next;
                });
                if (post.riddleNumber) {
                    incrementDecryptCount(1);
                    try {
                        const stored = JSON.parse(localStorage.getItem("decryptCounts") || "{}");
                        stored[post.riddleNumber] = (stored[post.riddleNumber] || 0) + 1;
                        localStorage.setItem("decryptCounts", JSON.stringify(stored));
                    } catch { }
                }
            } catch { }
        }
        setDecodeInputs((prev) => ({ ...prev, [postIndex]: "" }));
    };
    useEffect(() => {
    const timerId = setInterval(() => {
      setnokori((prev)=>(prev-1));
      sessionStorage.zikan=nokori;
    }
    , 1000);
    return () => clearInterval(timerId)
  }, [nokori]) 

    // 旧・単一フォームの復号ハンドラは不要になったため削除
    function handlehint(m: number) {
        return (() => setPosts([
            ...posts,
            {
                icon: "/sampleicon.png",
                name: "Riddlemaster",
                content: `第${m + 1}問のヒント:今年は令和7年だよ!`,
            },
        ]))
    }

    return (
        <div>
        <div
            style={{
                display: "flex",
                width: 1100,
                margin: "40px auto",
                gap: "32px",
            }}
        >
            {/* 左側：SNS風ヒントカード */}
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
                            {post.name ?? "とある筑駒生の独り言"}<span style={{fontSize:"0.9rem",fontWeight:200,color:"#868686ff"}}>　{post.time}</span>
                        </div>
                        <div style={{ color: "#4b5563", fontSize: "0.95rem", textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.6, wordBreak: "break-all", overflowWrap: "anywhere" }}>
                            {post.content}
                        </div>
                        {post.img!==undefined &&
                        <img
                            src={post.img}
                            onClick={()=>{setGazo((post.img ?? "a"))}}
                            style={{
                                width: 250,
                                borderRadius: "5%",
                                marginTop: "8px",
                            }}
                        />}
                        
                    </div>
                ))}
                {/* 復号回数表示は必要であれば各投稿の下に追加可能 */}
                <button
                    style={{
                        background: "#0ea5e9",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 18px",
                        fontWeight: 600,
                        cursor: "pointer",
                        marginTop: "12px",
                        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                    }}
                >
                    過去の投稿を見る
                </button>
            </div>

            {/* 右側：謎解き本体 */}
            <div
                className="container"
                style={{
                    flex: 1
                }}
            >
                <h1 style={{ textAlign: "center", marginBottom: 24, fontWeight: 800, color: "#1f2937", letterSpacing: 0.3 }}>
                    謎解きチャレンジ
                </h1>
                {[...Array(5)].map((_, idx) => (
                    <Ques key={idx} hints={hints[idx]} bun={mondai[idx]} n={idx} imgg={monim[idx]} imgWidth={400} imgHeight={250}/>
                ))}


                <div style={{ margin: "28px 0 20px 0", clear:"both"}}>
                    <h2 style={{ color: "#111827", marginBottom: 12, fontWeight: 700 }}>クロスワード</h2>
                    <table cellSpacing="0" style={{borderCollapse: "collapse", margin: "0 auto" }}>
                        <tbody>
                            {[...Array(5)].map((_, rowIdx) => (
                                <tr key={rowIdx} style={{margin:0}}>
                                    {[...Array(7)].map((_, colIdx) => {
                                        if (crossd[rowIdx][colIdx] === 1) {
                                            return (
                                                <td
                                                    key={colIdx}
                                                    style={{
                                                        border: `${["1px","3px"][+(crosshuto.indexOf(rowIdx*7+colIdx)!==-1)]} solid black`,
                                                        width: 40,
                                                        height: 40,
                                                        textAlign: "center",
                                                        background: "#f9fafb",
                                                    }}
                                                >
                                                    {crosshuto.indexOf(rowIdx*7+colIdx)!==-1 && <p style={{margin:0,fontSize:"10px",textAlign:"left"}}>{crosshuto.indexOf(rowIdx*7+colIdx)+1}</p>}
                                                    <input
                                                        type="text"
                                                        maxLength={1}
                                                        style={{
                                                            width: "92%",
                                                            height: "92%",
                                                            textAlign: "center",
                                                            background: "transparent",
                                                            fontSize: "1.2rem",
                                                            border:"none"
                                                        }}
                                                    />
                                                </td>
                                            );
                                        } else {
                                            return (
                                                <td
                                                    key={colIdx}
                                                    style={{
                                                        border: "none",
                                                        width: 40,
                                                        height: 40,
                                                        textAlign: "center",
                                                        background: "#f9fafb",
                                                    }}
                                                ></td>
                                            );
                                        }
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* クロスワード回答欄＋ボタン */}
                <p>答えは　1 2 3 4 5 6 3</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                    <input
                        type="text"
                        value={crosswordAnswer}
                        onChange={e => setCrosswordAnswer(e.target.value)}
                        placeholder="クロスワードの答えを入力"
                        style={{
                            flex: 1,
                            padding: "10px",
                            fontSize: "1rem",
                            borderRadius: "6px",
                            border: "1px solid #d1d5db",
                        }}
                    />
                    {crosswordAnswer.trim() !== "" && (
                        <button
                            onClick={handleCheckAnswer}
                            disabled={isLoading}
                            style={{
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
                            {isLoading ? "判定中..." : "回答する"}
                        </button>
                    )}
                </div>
                {showError && (
                    <div style={{ color: "#d63031", marginBottom: 12 }}>
                        答えが違います。もう一度挑戦してください。
                    </div>
                )}
                {isCorrect && (
                    <a
                        href="/riddles/2"
                        style={{
                            display: "block",
                            textAlign: "center",
                            marginTop: "24px",
                            padding: "12px 0",
                            background: "#059669",
                            color: "#fff",
                            borderRadius: "8px",
                            fontWeight: 600,
                            textDecoration: "none",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                            transition: "background 0.2s",
                        }}
                        onMouseOver={e => (e.currentTarget.style.background = "#10b981")}
                        onMouseOut={e => (e.currentTarget.style.background = "#059669")}
                    >
                        次の謎へ進む
                    </a>
                )}
            </div>
            <p style={{
                background:"#fff",
                borderRadius: "8px",
                border:"10px solid #0ea5e9",
                fontSize:"50px",
                padding:"5px",
                margin:"0px auto",
                height:60

            }}>{`${nokori/60|0}:${("0"+nokori%60).slice(-2)}`}</p>
        </div>
        {!(gazo==="n") && <div style={{position:"fixed",backgroundColor:"black",opacity:0.5,left:"0px",top:"0px",width:window.innerWidth,height:window.innerHeight}}></div>}
        {!(gazo==="n") && <button onClick={()=>{setGazo("n")}} className="batu">✖</button>}
        {!(gazo==="n") && <img src={gazo} style={{position:"fixed",width:(window.innerWidth-100),height:(window.innerHeight-100),top:"50px",left:"50px",objectFit: "contain"}}></img>}
        </div>
    );
}