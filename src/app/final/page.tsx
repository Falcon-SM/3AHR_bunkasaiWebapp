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
  const [showModal, setShowModal] = useState(false);
  const [kirikae, setKirikae] = useState(90)
  const [tscore, setts] = useState(0);
  const [hscore, seths] = useState(0);
  const router = useRouter();
  const [same,setSame]=useState(false);

  //以下はデータベース用です
  const [scores, setScores] = useState<Score[]>([]);
  const [nickname, setNickname] = useState("");
  const [playerScore, setPlayerScore] = useState<number | null>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showRankModal, setShowRankModal] = useState(false);

  const handleStartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleModalOk = () => {
    setShowModal(false);
    sessionStorage.zikan = 1200;
    sessionStorage.sawhint = 0;
    localStorage.clear();
    router.push("/");
  };

  const canRankIn = () => {
    // スコアボードに20人もいない場合は無条件でランクイン
    if (scores.length < 20) {
      return true;
    }
    // 20位のスコアを取得
    const twentiethScore = scores[19].score;
    // 自分のスコアが20位のスコアより高ければランクイン
    return playerScore != null && playerScore > twentiethScore;
  };

  useEffect(() => {
    if (showModal && kirikae > 15) {
      setKirikae(15);
    }
    if (kirikae === 0) {
      sessionStorage.zikan = 1200;
      sessionStorage.sawhint = 0;
      localStorage.clear();
      router.push("/")
    }
    if (!showRankModal) {
      const timerId = setInterval(() => {
        setKirikae((prev) => (prev - 1));
      }
        , 1000);
      return () => clearInterval(timerId)
    }


  }, [kirikae, showModal, showRankModal])

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
    if (sessionStorage.zikan<1){
      setSubmitted(true);
    }
    setts(1200 - sessionStorage.zikan);
    seths(sessionStorage.sawhint);
    setPlayerScore(sessionStorage.zikan - 300 * sessionStorage.sawhint);
  }, []); // 初回レンダリング時に一度だけ実行
  useEffect(() => {
    if (playerScore != null && scores.length > 0) {
      console.log(scores)
      const higherScores = scores.filter((s) => s.score > playerScore).length;
      setRank(higherScores + 1);
    }
  }, [scores, playerScore])
  useEffect(() => {
    if (rank !== null && sessionStorage.zikan>0) {
      setShowRankModal(true);
    }
  }, [rank])


  const handleSubmit = async () => {
    if (!nickname || playerScore == null) return;
    setIsSubmitting(true);
    if(scores.filter((s) => s.user_name === nickname).length>0){
      setIsSubmitting(false);
      setSame(true);
      return(0);
    }
    const { data: insertedData, error } = await supabase.from("ScoreBoard").insert([
      {
        user_name: nickname,
        score: playerScore,
      },
    ]);

    if (error) {
      console.error(error);
      setIsSubmitting(false);
    } else {
      // 登録成功後、最新のスコアをDBから再取得
      const { data: newScores, error: fetchError } = await supabase
        .from("ScoreBoard")
        .select("*")
        .order("score", { ascending: false })
        .limit(20);

      if (fetchError) {
        console.error(fetchError);
      } else {
        setScores(newScores || []);
      }

      setSubmitted(true);
      setIsSubmitting(false);
      setSame(false);
    }
  };

  if (playerScore == null) return <p>スコアを読み込み中...</p>;

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
        <h1 style={{ textAlign: "center", marginBottom: "24px" ,fontSize:50,color:"#48daff"}}>{sessionStorage.zikan>0 ? ("脱出成功!"):("時間切れ!")}</h1>

        {sessionStorage.zikan>0 ? (
        <p style={{ textAlign: "center" }}>クリアおめでとうございます！
          <br />あなたがクリアにかかった時間:{`${Math.floor(tscore / 60)}分${tscore % 60}秒`}
          <br />ヒントを見た回数:{hscore} 回
          <br />あなたのスコア:{playerScore} ポイント
        </p>
        ):(
          <p style={{ textAlign: "center" }}>お疲れさまでした!</p>
        )  
      }
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
        <button
          onClick={handleStartClick}
          className="botan"
        >
          謎解きを終わる
        </button>
        <p style={{ textAlign: "center" }}>この画面は{kirikae}秒後に自動で切り替わります</p>
      </div>
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          width: window.innerWidth,
          height: window.innerHeight,
          background: "rgba(255, 255, 255, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#303030",
            padding: "32px",
            borderRadius: "12px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
            maxWidth: "90vw",
            textAlign: "center"
          }}>
            <h3 style={{ marginBottom: "16px" }}>ありがとうございました</h3>
            <p>この画面は{kirikae}秒後に自動で切り替わります</p>

            <button
              onClick={handleModalOk}
              className="botan"
            >
              最初から
            </button>
          </div>
        </div>
      )}
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
            <p className="text-xl font-semibold">{canRankIn() && "おめでとうございます！"}<span className="text-3xl text-yellow-500 font-bold">{rank}</span> 位です！</p>
            {!submitted ? (
              <div className="flex flex-col items-center gap-4 pt-4">
                <input
                  className="riddle-input"
                  type="text"
                  placeholder="ニックネームを入力"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
                <p>スコアを登録すると後で表示されるQRコ<br />ードから後日自分のスコアを閲覧できます。</p>
                <p>あまりにふざけたニックネームにすると、<br />データが消える場合があります。</p>
                <button
                  onClick={() => {setShowRankModal(false);setSubmitted(true)}}
                  style={{
                    padding: "10px 32px",
                    background: "#000",
                    color: "#48daff",
                    border: "2px solid #48daff",
                    borderRadius: "6px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "1rem",
                    marginRight: "16px"
                  }}
                >
                  スコアを登録しない
                </button>

                <button
                  onClick={handleSubmit}
                  style={{
                    padding: "10px 32px",
                    background: "#48daff",
                    color: "#000",
                    border: "none",
                    borderRadius: "6px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontSize: "1rem"
                  }}
                >
                  {isSubmitting ? "送信中..." : "登録する"}
                </button>
                {same && <p style={{color:"red"}}>同じニックネームが既に使われています</p>}

              </div>
            ) : (
              <div className="pt-4">
                <p className="text-green-600 font-semibold text-lg">スコアを登録しました！</p>
                <button
                  onClick={() => setShowRankModal(false)} // モーダルを閉じる
                  className="botan"
                >
                  ランキングを見る
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
