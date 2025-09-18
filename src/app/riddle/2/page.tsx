"use client";
import React from "react";
import { useRouter } from "next/navigation";
export default function Nazo1() {
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
            <p className="riddle-question">柏田くん天才だな〜</p>

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

