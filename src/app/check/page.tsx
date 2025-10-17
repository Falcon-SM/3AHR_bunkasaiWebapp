"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Script from "next/script";

type Score = {
  id: string;
  user_name: string;
  score: number;
  created_at: string;
};

export default function Home() {
  const router = useRouter();
  const [same, setSame] = useState(false);

  //以下はデータベース用です
  const [scores, setScores] = useState<Score[]>([]);
  const [nickname, setNickname] = useState("");
  const [playerScore, setPlayerScore] = useState<number | null>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showRankModal, setShowRankModal] = useState(false);

  //以下はデータベース用

  useEffect(() => {
    const fetchScores = async () => {
      const { data: initialScores, error } = await supabase
        .from("ScoreBoard")
        .select("*")
        .order("score", { ascending: false });

      if (error) console.error(error);
      else setScores(initialScores || []);
    };
    fetchScores();
  }, []); // 初回レンダリング時に一度だけ実行
  useEffect(() => {
    if (scores.length > 0) {
      console.log(scores);
      setShowRankModal(true);
    }
  }, [scores, playerScore])


  const handleSubmit = async () => {
    if (!nickname) return;
    setIsSubmitting(true);
    const ss = scores.filter((s) => s.user_name === nickname);
    if (ss.length == 0) {
      setIsSubmitting(false);
      setSame(true);
      return (0);
    }
    setPlayerScore(ss[0].score);
    const higherScores = scores.filter((s) => s.score > ss[0].score).length;
    setRank(higherScores + 1);
    setSubmitted(true);
    setIsSubmitting(false);
    setSame(false);
  }

  return (
    <div>
      <div className="container">
        <header className="relative overflow-hidden">
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-8SS8YBH1B6"
            strategy="afterInteractive"
          />
          <Script
            id="gtag-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-8SS8YBH1B6');` }}
          />
        </header>
        <h1 style={{ textAlign: "center", marginBottom: "24px", color:"#48daff" }}>スコアチェック</h1>

        <p style={{ textAlign: "center" }}>あなたのニックネーム:{nickname}<br/>あなたのスコア:{playerScore} ポイント<br/>最終順位:{rank}位</p>
        {submitted && (
          <div className="w-full max-w-md mx-auto mt-8" style={{ width: "95%", textAlign: "center", border: "1px solid black", padding: 10, borderRadius: 10, backgroundColor: "#303030" }}>
            <h2 className="text-2xl font-semibold text-center mb-4">
              スコアボード
            </h2>
            <div style={{ margin: "0 auto 0 auto", marginBottom: 10 }}>
              {scores.map((s, index) => (
                <p key={s.id}>
                  <span className="text-gray-800">{index + 1}位 {s.user_name || "匿名"}　{s.score}点</span>
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
      {showRankModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          width: window.innerWidth,
          height: window.innerHeight,
          background: "rgba(255, 254, 254, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#000",
            padding: "32px",
            borderRadius: "12px",
            boxShadow: "0 4px 24px rgba(0, 0, 0, 0.4)",
            maxWidth: "90vw",
            textAlign: "center"
          }}>
            {!submitted ? (
              <div className="flex flex-col items-center gap-4 pt-4">
                <input
                  className="riddle-input"
                  type="text"
                  placeholder="ニックネームを入力"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />

                <button
                  onClick={handleSubmit}
                  className="botan"
                >
                  {isSubmitting ? "送信中..." : "スコアを取得"}
                </button>
                {same && <p style={{ color: "red" }}>ニックネームが間違っています</p>}

              </div>
            ) : (
              <div className="pt-4">
                <p className="text-green-600 font-semibold text-lg">スコアを取得しました！</p>
                <button
                  onClick={() => setShowRankModal(false)} // モーダルを閉じる
                  className="botan"
                >
                  スコアを見る
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
