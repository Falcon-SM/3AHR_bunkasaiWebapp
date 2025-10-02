"use client";
import React, { useEffect, useMemo, useState } from "react";
import Ques from "../../../../components/shomon";
import { useRiddles } from "@/app/context/riddleContext";

type PageContent = {
    quiz_one: string;
    quiz_two: string;
    quiz_three: string;
    quiz_four: string;
};

type HintPost = {
    icon: string;
    name: string;
    content: string; // 表示用のテキスト（暗号化された画面: ... も含む）
    // 以下は暗号化投稿専用のメタ情報
    riddleNumber?: number; // 1..4 のどの謎の投稿か
    base64?: string; // 暗号化文字列
    isDecrypted?: boolean; // 復号済みか
};
const crossd = [
    [1, 1, 1, 0, 0],
    [1, 1, 1, 1, 1],
    [1, 0, 1, 0, 0],
    [1, 1, 1, 0, 0],
    [1, 1, 1, 0, 1]

];
const mondai = [
    "江戸幕府の初代将軍の名前はなんでしょうか？",
    "室町幕府の将軍を追放した戦国武将は？",
    "2019年からの新しい元号は？",
    "東日本大震災の正式名称は？"
]

export default function Home() {
    const { oneIsAnswered, twoIsAnswered, threeIsAnswered, fourIsAnswered, incrementDecryptCount, decryptCounts} = useRiddles();
    const [crosswordAnswer, setCrosswordAnswer] = useState("");
    const [isCorrect, setIsCorrect] = useState(false);
    const [showError, setShowError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [quizTwoAnswer, setQuizTwoAnswer] = useState("");
    const [posts, setPosts] = useState<HintPost[]>([
        {
            icon: "/sampleicon.png",
            name: "Riddlemaster",
            content: "謎を解いていくと、ここに新しい投稿が表示されます！",
        },
    ]);
    const [nokori,setnokori]=useState(1200);
    const [decodeInputs, setDecodeInputs] = useState<Record<number, string>>({}); // key: post index
    const hints=[["あああああああああああああああああ","b","c"],["a","b","c"],["a","b","c"],["a","b","d"]]

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

   

    // 謎1に文字が入ったら、暗号化された投稿を一度だけ表示
    useEffect(() => {
        const alreadyPosted = posts.some(p => p.base64 === base64Hint && p.riddleNumber === 1);
        if (oneIsAnswered && !alreadyPosted && base64Hint) {
            setPosts((prev) => ([
                ...prev,
                {
                    icon: "/sampleicon.png",
                    name: "Riddlemaster",
                    content: `第1問に関する暗号化された投稿： ${base64Hint}`,
                    riddleNumber: 1,
                    base64: base64Hint,
                    isDecrypted: false,
                },
            ]));
        } else if (!oneIsAnswered) {
            // 謎1の解答欄が空になったら、対応する投稿を削除
            const alreadyPosted = posts.some(p => p.riddleNumber === 1);
            if (alreadyPosted) setPosts(prev => prev.filter(p => p.riddleNumber !== 1));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [oneIsAnswered, base64Hint]);

    // 謎2に文字が入ったら暗号化投稿を一度だけ表示
    useEffect(() => {
        const alreadyPosted = posts.some(p => p.base64 === base64Hint2 && p.riddleNumber === 2);
        if (twoIsAnswered && !alreadyPosted && base64Hint2) {
            setPosts((prev) => ([
                ...prev,
                {
                    icon: "/sampleicon.png",
                    name: "Riddlemaster",
                    content: `第2問に関する暗号化された投稿： ${base64Hint2}`,
                    riddleNumber: 2,
                    base64: base64Hint2,
                    isDecrypted: false,
                },
            ]));
        } else if (!twoIsAnswered) {
            // 謎2の解答欄が空になったら、対応する投稿を削除
            const alreadyPosted = posts.some(p => p.riddleNumber === 2);
            if (alreadyPosted) setPosts(prev => prev.filter(p => p.riddleNumber !== 2));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [twoIsAnswered, base64Hint2]);

    // 謎3に文字が入ったら暗号化投稿を一度だけ表示
    useEffect(() => {
        const alreadyPosted = posts.some(p => p.base64 === base64Hint3 && p.riddleNumber === 3);
        if (threeIsAnswered && !alreadyPosted && base64Hint3) {
            setPosts((prev) => ([
                ...prev,
                {
                    icon: "/sampleicon.png",
                    name: "Riddlemaster",
                    content: `第3問に関する暗号化された投稿： ${base64Hint3}`,
                    riddleNumber: 3,
                    base64: base64Hint3,
                    isDecrypted: false,
                },
            ]));
        } else if (!threeIsAnswered) {
            // 謎3の解答欄が空になったら、対応する投稿を削除
            const alreadyPosted = posts.some(p => p.riddleNumber === 3);
            if (alreadyPosted) setPosts(prev => prev.filter(p => p.riddleNumber !== 3));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [threeIsAnswered, base64Hint3]);

    // 謎4に文字が入ったら暗号化投稿を一度だけ表示
    useEffect(() => {
        const alreadyPosted = posts.some(p => p.base64 === base64Hint4 && p.riddleNumber === 4);
        if (fourIsAnswered && !alreadyPosted && base64Hint4) {
            setPosts((prev) => ([
                ...prev,
                {
                    icon: "/sampleicon.png",
                    name: "Riddlemaster",
                    content: `第4問に関する暗号化された投稿： ${base64Hint4}`,
                    riddleNumber: 4,
                    base64: base64Hint4,
                    isDecrypted: false,
                },
            ]));
        } else if (!fourIsAnswered) {
            // 謎4の解答欄が空になったら、対応する投稿を削除
            const alreadyPosted = posts.some(p => p.riddleNumber === 4);
            if (alreadyPosted) setPosts(prev => prev.filter(p => p.riddleNumber !== 4));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fourIsAnswered, base64Hint4]);

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
      sessionStorage.zikan=nokori}
    , 1000)
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
                            src={post.icon}
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
                            {post.name}
                        </div>
                        <div style={{ color: "#4b5563", fontSize: "0.95rem", textAlign: "center", whiteSpace: "pre-line", lineHeight: 1.6, wordBreak: "break-all", overflowWrap: "anywhere" }}>
                            {post.content}
                        </div>
                        {post.base64 && !post.isDecrypted && (
                            <form onSubmit={handlePerPostDecodeSubmit(idx)} style={{ width: "100%", display: "flex", gap: 8, marginTop: 8 }}>
                                <input
                                    type="text"
                                    value={decodeInputs[idx] || ""}
                                    onChange={(e) => setDecodeInputs((prev) => ({ ...prev, [idx]: e.target.value }))}
                                    placeholder="コメントで「復号する」 と送信"
                                    style={{
                                        flex: 1,
                                        padding: "10px",
                                        fontSize: "0.95rem",
                                        borderRadius: "6px",
                                        border: "1px solid #d1d5db",
                                        background: "#fff",
                                    }}
                                />
                                <button
                                    type="submit"
                                    style={{
                                        background: "#2563eb",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "6px",
                                        padding: "8px 14px",
                                        fontWeight: 600,
                                        cursor: "pointer",
                                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                    }}
                                >送信</button>
                            </form>
                        )}
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
                {[...Array(4)].map((_, idx) => (
                    <Ques key={idx} hints={hints[idx]} bun={mondai[idx]} n={idx} />
                ))}


                <div style={{ margin: "28px 0 20px 0", clear:"both"}}>
                    <h2 style={{ color: "#111827", marginBottom: 12, fontWeight: 700 }}>クロスワード</h2>
                    <table style={{ borderCollapse: "collapse", margin: "0 auto" }}>
                        <tbody>
                            {[...Array(5)].map((_, rowIdx) => (
                                <tr key={rowIdx}>
                                    {[...Array(5)].map((_, colIdx) => {
                                        if (crossd[rowIdx][colIdx] === 1) {
                                            return (
                                                <td
                                                    key={colIdx}
                                                    style={{
                                                        border: "1px solid #e5e7eb",
                                                        width: 40,
                                                        height: 40,
                                                        textAlign: "center",
                                                        background: "#f9fafb",
                                                    }}
                                                >
                                                    <input
                                                        type="text"
                                                        maxLength={1}
                                                        style={{
                                                            width: "92%",
                                                            height: "92%",
                                                            textAlign: "center",
                                                            border: "1px solid #e5e7eb",
                                                            background: "transparent",
                                                            fontSize: "1.2rem",
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
                                                        background: "#fff",
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
    );
}