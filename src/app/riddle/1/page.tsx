//小問4個は答え合わせいらない。その下のクロスワードは答え合わせ必須

"use client";
import React from "react";
import { useRouter } from "next/navigation";

// 謎1のコンポーネント
function Nazo1() {
    // 4問分の状態
    const [answers, setAnswers] = React.useState(["", "", "", ""]);
    // クロスワードの状態（例：5x5）
    const [crossword, setCrossword] = React.useState(Array(5).fill("").map(() => Array(5).fill("")));

    // 4問の入力変更
    const handleInputChange = (idx: number, value: string) => {
        const newAnswers = [...answers];
        newAnswers[idx] = value;
        setAnswers(newAnswers);
    };

    // クロスワードの入力変更
    const handleCrosswordChange = (row: number, col: number, value: string) => {
        const newCrossword = crossword.map(arr => [...arr]);
        newCrossword[row][col] = value;
        setCrossword(newCrossword);
    };

    return (
        <div className="container riddle-card">
            <h2 className="riddle-title">謎入力フォーム</h2>
            <div style={{ display: "grid", gap: "24px", marginBottom: "40px" }}>
                {[1, 2, 3, 4].map((num, idx) => (
                    <div key={num} className="riddle-question-block">
                        <p className="riddle-question">謎{num}の問題文（ここに出題内容を記載）</p>
                        <input
                            type="text"
                            className="riddle-input"
                            value={answers[idx]}
                            onChange={e => handleInputChange(idx, e.target.value)}
                            placeholder={`謎${num}の答えを入力`}
                        />
                    </div>
                ))}
            </div>

            <h2 className="riddle-title">クロスワードパズル</h2>
            <div style={{ overflowX: "auto", margin: "0 auto", maxWidth: "350px" }}>
                <table className="crossword-table" style={{ borderCollapse: "collapse", margin: "0 auto" }}>
                    <tbody>
                        {crossword.map((row, rIdx) => (
                            <tr key={rIdx}>
                                {row.map((cell, cIdx) => (
                                    <td key={cIdx} style={{ border: "1px solid #888", width: 40, height: 40, textAlign: "center", background: "#222" }}>
                                        <input
                                            type="text"
                                            maxLength={1}
                                            value={cell}
                                            onChange={e => handleCrosswordChange(rIdx, cIdx, e.target.value)}
                                            style={{ width: "100%", height: "100%", textAlign: "center", background: "#333", color: "#ffd700", border: "none", fontSize: "1.2rem" }}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// 必要ならNazo2は下に分離して定義
function Nazo2() {
    const [answer, setAnswer] = React.useState("");
    const [error, setError] = React.useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch("/api/riddle/2", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answer }),
            });
            const data = await res.json();
            if (data.correct) {
                router.push("/riddle/3");
            } else {
                setError("答えが違います。もう一度考えてみてください。");
            }
        } catch {
            setError("判定中にエラーが発生しました。");
        }
    };

    return (
        <div className="container riddle-card">
            <h2 className="riddle-title">謎2</h2>
            <form className="riddle-form" onSubmit={handleSubmit}>
                <label htmlFor="answer" className="riddle-label">あなたの答え：</label>
                <input
                    type="text"
                    id="answer"
                    className="riddle-input"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="ここに答えを入力"
                    required
                />
                <button type="submit" className="riddle-btn">送信</button>
            </form>
            {error && <p className="riddle-error">{error}</p>}
        </div>
    );
}

export default Nazo1;
