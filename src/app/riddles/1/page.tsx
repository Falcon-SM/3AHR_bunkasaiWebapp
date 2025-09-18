"use client"; // ← 追加
import React from "react";
import { microcms } from "@/lib/microcms";

type PageContent = {
    quiz_one: string;
    quiz_two: string;
    quiz_three: string;
    quiz_four: string;
};

type MicroCMSResponse = {
    contents: PageContent[];
};

export default async function Home() {
    const data: MicroCMSResponse = await microcms.get<MicroCMSResponse>({
        endpoint: "riddles",
        queries: { limit: 1 },
    });
    const item = data.contents[0];
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

            <a
                href="/riddle/1"
                style={{
                    display: "block",
                    textAlign: "center",
                    marginTop: "32px",
                    padding: "12px 0",
                    background: "#0984e3",
                    color: "#fff",
                    borderRadius: "8px",
                    fontWeight: 600,
                    textDecoration: "none",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    transition: "background 0.2s",
                }}
                onMouseOver={e => (e.currentTarget.style.background = "#74b9ff")}
                onMouseOut={e => (e.currentTarget.style.background = "#0984e3")}
            >
                謎解きを始める
            </a>
        </div>
    );
}