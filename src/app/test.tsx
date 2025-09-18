"use client"; // クライアントコンポーネントであることを宣言

import { useEffect, useState } from "react";
import { microcms } from "@/lib/microcms";

type PageContent = {
  title: string;
  content: string;
};

type MicroCMSResponse = {
  contents: PageContent[];
};

export default function Home() {
  const [data, setData] = useState<MicroCMSResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // ネットワーク状態の監視
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    // 初期状態をセット
    setIsOnline(navigator.onLine);

    // APIからデータを取得する非同期関数
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (!navigator.onLine) {
          throw new Error("Offline");
        }
        const response: MicroCMSResponse = await microcms.get<MicroCMSResponse>({
          endpoint: "intro",
          queries: { limit: 1 },
        });
        setData(response);
      } catch (error) {
        // オフライン時や通信エラー時にデータ取得を中断
        setIsOnline(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  if (!isOnline) {
    return (
    <div className="container">
      <h2>こんにちは！3AHRへようこそ！</h2>
      <p>オフラインモードで続行します</p>
      <div style={{ margin: "32px 0" }}>
        <video
          controls
          width="100%"
          style={{
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          }}
        >
          <source src="/BunkasaiVideo1.mov" type="video/mp4" />
          お使いのブラウザは動画再生に対応していません。
        </video>
      </div>
      <a href="/riddles/1">謎解きを始める</a>
    </div>
  );
    
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data || data.contents.length === 0) {
    return <p>データが見つかりませんでした。</p>;
  }

  const item = data.contents[0];

  return (
    <div className="container">
      <h2 dangerouslySetInnerHTML={{ __html: item.title }} />
      <p>{item.content}</p>
      <div style={{ margin: "32px 0" }}>
        <video
          controls
          width="100%"
          style={{
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          }}
        >
          <source src="/BunkasaiVideo1.mov" type="video/mp4" />
          お使いのブラウザは動画再生に対応していません。
        </video>
      </div>
      <a href="/riddles/1">謎解きを始める</a>
    </div>
  );
}

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
