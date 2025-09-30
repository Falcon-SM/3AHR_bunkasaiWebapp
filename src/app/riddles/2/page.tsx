"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useRiddles } from "@/app/context/riddleContext";

type PageContent = {
    quiz_one: string; /*unko*/
    quiz_two: string;
    quiz_three: string;
    quiz_four: string;
};

export default function Home() {
    const { twoIsAnswered, incrementDecryptCount, decryptCounts } = useRiddles();
    const [crosswordAnswer, setCrosswordAnswer] = useState("");
    const [isCorrect, setIsCorrect] = useState(false);
    const [showError, setShowError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [posts, setPosts] = useState([
        {
            icon: "/sampleicon.png",
            name: "Riddlemaster",
            content: "謎を解いていくと、ここに新しい投稿が表示されます！",
        },
    ]);
    const [decodeComment, setDecodeComment] = useState("");
    const [hasDecrypted, setHasDecrypted] = useState(false);

    // Base64暗号テキスト（第2問用）
    const base64Hint = useMemo(() => {
        const hint = "第2問のヒント: 戦国武将の中で、将軍を都から追放した人物。";
        if (typeof window === "undefined") return "";
        try { return window.btoa(unescape(encodeURIComponent(hint))); } catch { return ""; }
    }, [typeof window]); //必要では？

    // データ
    const item: PageContent = {
        quiz_one: "こんにちは世界",
        quiz_two: "Hey Siri, 明日の天気は？",
        quiz_three: "お腹すいたね",
        quiz_four: "Je suis étudiant",
    };

    const handleCheckAnswer = async () => {
        setIsLoading(true);
        setShowError(false);
        setIsCorrect(false);

        try {
            const res = await fetch("/api/riddle/2", {
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

    // 謎2に文字が入ったら、暗号化された投稿を一度だけ表示
    useEffect(() => {
        if (twoIsAnswered && posts.length === 1 && base64Hint) {
            setPosts((prev) => ([
                ...prev,
                {
                    icon: "/sampleicon.png",
                    name: "Riddlemaster",
                    content: `第2問に関する暗号化された投稿： ${base64Hint}`,
                },
            ]));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [twoIsAnswered, base64Hint]);

    const handleDecodeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cmd = decodeComment.trim();
        if (!cmd) return;
        if (cmd === "復号する" && !hasDecrypted) {
            try {
                const decoded = decodeURIComponent(escape(window.atob(base64Hint)));
                setPosts((prev) => {
                    const next = [...prev];
                    if (next[1]) {
                        next[1] = { ...next[1], content: decoded };
                    }
                    return next;
                });
                setHasDecrypted(true);
                incrementDecryptCount(2);
                try {
                    /*const stored = JSON.parse(localStorage.getItem("decryptCounts") || "{}");
                    stored[2] = (stored[2] || 0) + 1;
                    localStorage.setItem("decryptCounts", JSON.stringify(stored));*/
                } catch { }
            } catch { }
        } else {
            setPosts((prev) => ([
                ...prev,
                {
                    icon: "/sampleicon.png",
                    name: "Riddlemaster",
                    content: "コマンドが違うみたい。「復号する」と入力して送信してね。",
                },
            ]));
        }
        setDecodeComment("");
    };

    return (
        <div
            style={{
                maxWidth: 900,
                margin: "40px auto",
                padding: "32px",
                display: "flex",
                gap: "32px",
            }}
        >
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
                    <div key={`post-${idx}`} style={{ width: "100%", marginBottom: "24px", background: "#fff", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", padding: "16px 12px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <img src={post.icon} alt="アカウントアイコン" style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", marginBottom: "8px", border: "2px solid #0984e3" }} />
                        <div style={{ fontWeight: 700, fontSize: "1rem", marginBottom: "6px" }}>{post.name}</div>
                        <div style={{ color: "#4b5563", fontSize: "0.95rem", textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.6 }}>{post.content}</div>
                    </div>
                ))}
                {twoIsAnswered && (
                    <form onSubmit={handleDecodeSubmit} style={{ width: "100%", display: "flex", gap: 8 }}>
                        <input type="text" value={decodeComment} onChange={(e) => setDecodeComment(e.target.value)} placeholder="コメントで「復号する」 と送信" style={{ flex: 1, padding: "10px", fontSize: "0.95rem", borderRadius: "6px", border: "1px solid #d1d5db", background: "#fff" }} />
                        <button type="submit" style={{ background: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 14px", fontWeight: 600, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>送信</button>
                    </form>
                )}
                {hasDecrypted && (
                    <div style={{ marginTop: 10, color: "#6b7280", fontSize: "0.85rem" }}>
                        復号回数（第2問）: {decryptCounts[2] ?? 1}
                    </div>
                )}
            </div>
             <div
                className="container"
                style={{
                    flex: 1,
                    background: "#fff",
                    borderRadius: "16px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                    padding: "32px",
                }}
            >
                <h1 style={{ textAlign: "center", marginBottom: 32, fontWeight: 700, color: "#2c3e50" }}>
                    謎解きチャレンジ
                </h1>

                {[item.quiz_one, item.quiz_two, item.quiz_three, item.quiz_four].map((quiz, idx) => (
                    <div key={idx} style={{ marginBottom: 28 }}>
                        <h2
                            dangerouslySetInnerHTML={{ __html: quiz }}
                            style={{
                                fontSize: "1.2rem",
                                color: "#34495e",
                                marginBottom: 12,
                                background: "#f5f7fa",
                                padding: "8px 16px",
                                borderRadius: "8px",
                            }}
                        ></h2>
                        <input
                            type="text"
                            className="riddle-input"
                            placeholder={`謎${idx + 1}の答えを入力`}
                            style={{
                                width: "100%",
                                padding: "10px",
                                fontSize: "1rem",
                                borderRadius: "6px",
                                border: "1px solid #d1d5db",
                                marginBottom: "4px",
                            }}
                        />
                    </div>
                ))}

                <div style={{ margin: "40px 0 24px 0" }}>
                    <h2 style={{ color: "#2c3e50", marginBottom: 12 }}>クロスワード</h2>
                    <table style={{ borderCollapse: "collapse", margin: "0 auto" }}>
                        <tbody>
                            {[...Array(5)].map((_, rowIdx) => (
                                <tr key={rowIdx}>
                                    {[...Array(5)].map((_, colIdx) => (
                                        <td
                                            key={colIdx}
                                            style={{
                                                border: "1px solid #b2bec3",
                                                width: 40,
                                                height: 40,
                                                textAlign: "center",
                                                background: "#f5f7fa",
                                            }}
                                        >
                                            <input
                                                type="text"
                                                maxLength={1}
                                                style={{
                                                    width: "90%",
                                                    height: "90%",
                                                    textAlign: "center",
                                                    border: "none",
                                                    background: "transparent",
                                                    fontSize: "1.2rem",
                                                }}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* クロスワード回答欄＋ボタン */}
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
                    <button
                        onClick={handleCheckAnswer}
                        disabled={isLoading}
                        style={{
                            padding: "10px 20px",
                            background: "#0984e3",
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
                </div>
                {showError && (
                    <div style={{ color: "#d63031", marginBottom: 12 }}>
                        答えが違います。もう一度挑戦してください。
                    </div>
                )}
                {isCorrect && (
                    <a
                        href="/riddles/3"
                        style={{
                            display: "block",
                            textAlign: "center",
                            marginTop: "24px",
                            padding: "12px 0",
                            background: "#00b894",
                            color: "#fff",
                            borderRadius: "8px",
                            fontWeight: 600,
                            textDecoration: "none",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                            transition: "background 0.2s",
                        }}
                        onMouseOver={e => (e.currentTarget.style.background = "#55efc4")}
                        onMouseOut={e => (e.currentTarget.style.background = "#00b894")}
                    >
                        次の謎へ進む
                    </a>
                )}
            </div>
        </div>
    );
}