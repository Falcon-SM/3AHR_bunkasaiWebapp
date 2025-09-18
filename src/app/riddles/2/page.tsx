"use client";
import React, { useState } from "react";

type PageContent = {
    quiz_one: string; /*unko*/
    quiz_two: string;
    quiz_three: string;
    quiz_four: string;
};

export default function Home() {
    const [crosswordAnswer, setCrosswordAnswer] = useState("");
    const [isCorrect, setIsCorrect] = useState(false);
    const [showError, setShowError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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

    return (
        <div
            className="container"
            style={{
                maxWidth: 600,
                margin: "40px auto",
                padding: "32px",
                background: "#fff",
                borderRadius: "16px",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
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
    );
}