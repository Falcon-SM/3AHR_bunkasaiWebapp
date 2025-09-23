"use client";
import React, { useState } from "react";
import Ques from "../../../../components/shomon"

type PageContent = {
    quiz_one: string;
    quiz_two: string;
    quiz_three: string;
    quiz_four: string;
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
    const [crosswordAnswer, setCrosswordAnswer] = useState("");
    const [isCorrect, setIsCorrect] = useState(false);
    const [showError, setShowError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [quizTwoAnswer, setQuizTwoAnswer] = useState("");
    const [posts, setPosts] = useState([
        {
            icon: "/sampleicon.png",
            name: "Riddlemaster",
            content: "謎を解いていくと、ここに新しい投稿が表示されます！",
        },
    ]);

    const [oneIsAnswered, setOneIsAnswered] = useState(0);
    const [twoIsAnswered, setTwoIsAnswered] = useState(0);
    const [threeIsAnswered, setThreeIsAnswered] = useState(0);
    const [fourIsAnswered, setFourIsAnswered] = useState(0);


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
        //setQuizTwoAnswer(value);

        // すでに投稿済みでなければ追加
        if (value.trim() !== "" && posts.length === 1) {
            setPosts([
                ...posts,
                {
                    icon: "/sampleicon.png",
                    name: "Riddlemaster",
                    content: `今年は令和7年だよ!`,
                },
            ]);
        }

        if (oneIsAnswered == 1) {
            setPosts(prevPosts => [
                ...prevPosts,
                {
                    icon: "/sampleicon.png",
                    name: "Riddlemaster",
                    content: "徳川家の人だよ。下の名前は、なんだっけ。",
                },
            ]);
        }
        if (twoIsAnswered == 1) {
            setPosts(prevPosts => [
                ...prevPosts,
                {
                    icon: "/sampleicon.png",
                    name: "Riddlemaster",
                    content: "天下統一を目指したといわれている人だよ。ゲームにもよく出てくるよね。",
                },
            ]);
        }
        if (threeIsAnswered == 1) {
            setPosts(prevPosts => [
                ...prevPosts,
                {
                    icon: "/sampleicon.png",
                    name: "Riddlemaster",
                    content: "今年は令和7年だよ!",
                },
            ]);
        }
        if (fourIsAnswered == 1) {
            setPosts(prevPosts => [
                ...prevPosts,
                {
                    icon: "/sampleicon.png",
                    name: "Riddlemaster",
                    content: "東北地方の、太平洋沖が震源だよね。",
                },
            ]);
        }

        // 空欄になったら投稿を消す
        if (value.trim() === "" && posts.length > 1) {
            setPosts(posts.slice(0, 1));
        }
    };
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
                    過去の投稿を見る
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
                {[...Array(4)].map((_, idx) => (
                    <Ques key={idx} cl={handlehint(idx)} bun={mondai[idx]} n={idx} />
                ))}


                <div style={{ margin: "40px 0 24px 0" }}>
                    <h2 style={{ color: "#2c3e50", marginBottom: 12 }}>クロスワード</h2>
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
                                            )
                                        } else {
                                            <td
                                                key={colIdx}
                                                style={{
                                                    border: "none",
                                                    width: 40,
                                                    height: 40,
                                                    textAlign: "center",
                                                    background: "#f5f7fa",
                                                }}
                                            ></td>
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