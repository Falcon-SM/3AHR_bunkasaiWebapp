"use client";
import React, { useState } from "react";

type PageContent = {
    quiz_one: string;
    quiz_two: string;
    quiz_three: string;
    quiz_four: string;
};

export default function Home() {
    const [crosswordAnswer, setCrosswordAnswer] = useState("");
    const [isCorrect, setIsCorrect] = useState(false);
    const [showError, setShowError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [quizTwoAnswer, setQuizTwoAnswer] = useState("");
    const [posts, setPosts] = useState([
        {
            icon: "/sampleicon.png",
            name: "RiddleMaster",
            content: "謎を解いていくと、次の謎へのヒントが見つかるかも？\n#謎解き #ヒント",
        },
    ]);

    // データ
    const item: PageContent = {
        quiz_one: "江戸幕府の初代将軍の名前はなんでしょうか？",
        quiz_two: "室町幕府の将軍を追放した戦国武将は？",
        quiz_three: "2019年からの新しい元号は？",
        quiz_four: "東日本大震災の正式名称は？",
    };

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

    // 謎2の答え入力時に新しい投稿を追加
    const handleQuizTwoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuizTwoAnswer(value);

        // すでに投稿済みでなければ追加
        if (value.trim() !== "" && posts.length === 1) {
            setPosts([
                ...posts,
                {
                    icon: "/sampleicon.png",
                    name: "RiddleMaster",
                    content: `今年は令和7年だね！\n#謎解き #ヒント`,
                },
            ]);
        }
        // 空欄になったら投稿を消す
        if (value.trim() === "" && posts.length > 1) {
            setPosts(posts.slice(0, 1));
        }
    };

    return (
        <div
            style={{
                display: "flex",
                maxWidth: 900,
                margin: "40px auto",
                gap: "32px",
            }}
        >
            {/* 左側：SNS風ヒントカード */}
            <div
                style={{
                    width: 280,
                    background: "#f5f7fa",
                    borderRadius: "16px",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    padding: "24px 16px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                {posts.map((post, idx) => (
                    <div
                        key={idx}
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
                        <div style={{ color: "#636e72", fontSize: "0.95rem", textAlign: "center", whiteSpace: "pre-line" }}>
                            {post.content}
                        </div>
                    </div>
                ))}
                <button
                    style={{
                        background: "#0984e3",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "8px 24px",
                        fontWeight: 600,
                        cursor: "pointer",
                        marginTop: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                >
                    投稿する
                </button>
            </div>

            {/* 右側：謎解き本体 */}
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

                <div style={{ marginBottom: 28 }}>
                    <h2
                        dangerouslySetInnerHTML={{ __html: item.quiz_one }}
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
                        placeholder="謎1の答えを入力"
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
                <div style={{ marginBottom: 28 }}>
                    <h2
                        dangerouslySetInnerHTML={{ __html: item.quiz_two }}
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
                        value={quizTwoAnswer}
                        onChange={handleQuizTwoChange}
                        placeholder="謎2の答えを入力"
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
                <div style={{ marginBottom: 28 }}>
                    <h2
                        dangerouslySetInnerHTML={{ __html: item.quiz_three }}
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
                        placeholder="謎3の答えを入力"
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
                <div style={{ marginBottom: 28 }}>
                    <h2
                        dangerouslySetInnerHTML={{ __html: item.quiz_four }}
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
                        placeholder="謎4の答えを入力"
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
                    {crosswordAnswer.trim() !== "" && (
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