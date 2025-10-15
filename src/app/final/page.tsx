"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { text } from "stream/consumers";


type Score = {
  id: string;
  user_name: string;
  score: number;
  created_at: string;
};


/*type MicroCMSResponse = {
  contents: PageContent[];
};*/

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [kirikae,setKirikae]=useState(60)
  const [tscore,setts]=useState(0);
  const [hscore,seths]=useState(0);
  const router = useRouter();

  //以下はデータベース用です
  const [scores, setScores] = useState<Score[]>([]);
  const [nickname, setNickname] = useState("");
  const [playerScore, setPlayerScore] = useState<number | null>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);


  useEffect(()=>{
    setts(1200-sessionStorage.zikan);
    seths(sessionStorage.sawhint);
  },[])

  const handleStartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleModalOk = () => {
    setShowModal(false);
    router.push("/");
  };

  useEffect(() => {
    if (showModal && kirikae>15){
      setKirikae(15);
    }
    const timerId = setInterval(() => {
      setKirikae((prev)=>(prev-1));
    }
    , 1000);
    if(kirikae===0){
      router.push("/")
    }
    return () => clearInterval(timerId)
    }, [kirikae,showModal]) 

    //以下はデータベース用

    useEffect(() => {
    //得点
    setPlayerScore(87); //計算めんどくさい
  }, []);

    useEffect(() => {
    const fetchScores = async () => {
      const { data, error } = await supabase
        .from("scores")
        .select("*")
        .order("score", { ascending: false })
        .limit(20);

      if (error) console.error(error);
      else setScores(data || []);
    };
    fetchScores();
  }, [submitted]);

  useEffect(() => {
    if (playerScore != null && scores.length > 0) {
      const higherScores = scores.filter((s) => s.score > playerScore).length;
      setRank(higherScores + 1);
    }
  }, [playerScore, scores]);

  const handleSubmit = async () => {
    if (!nickname || playerScore == null) return;
    setIsSubmitting(true);

    const { error } = await supabase.from("scores").insert([
      {
        user_name: nickname,
        score: playerScore,
      },
    ]);

    setIsSubmitting(false);
    if (error) {
      console.error(error);
    } else {
      setSubmitted(true);
    }
  };

  if (playerScore == null) return <p>スコアを読み込み中...</p>;

  return (
    <div>
    <div className="container">
      <header className="relative overflow-hidden">
        {/* Google tag (gtag.js) */}
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
        <h1 style={{ textAlign: "center", marginBottom: "24px" }}>脱出成功!</h1>
        <p style={{textAlign:"center"}}>クリアおめでとうございます！
        <br/>あなたがクリアにかかった時間:{`${Math.floor(tscore/60)}分${tscore%60}秒`}
        <br/>ヒントを見た回数:{hscore}</p>
        <button
          onClick={handleStartClick}
          style={{
            display: "block",
            margin: "32px auto 0 auto",
            padding: "14px 40px",
            background: "#0984e3",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            fontWeight: 700,
            fontSize: "1.1rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
            cursor: "pointer",
            transition: "background 0.2s",
          }}
          onMouseOver={e => (e.currentTarget.style.background = "#74b9ff")}
          onMouseOut={e => (e.currentTarget.style.background = "#0984e3")}
        >
          謎解きを終わる
        </button>
        <p style={{textAlign:"center"}}>この画面は{kirikae}秒後に自動で切り替わります</p>
      </div>
        {showModal && (
          <div style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            width:window.innerWidth,
            height:window.innerHeight,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}>
            <div style={{
              background: "#fff",
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
                style={{
                  padding: "10px 32px",
                  background: "#0984e3",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  fontWeight: 600,
                  cursor: "pointer",
                  fontSize: "1rem"
                }}
              >
                最初から
              </button>
            </div>
          </div>
        )}
        {/*以下はデータベース用*/}
      <h1 className="text-3xl font-bold">🎯 あなたのスコア: {playerScore}</h1>

      {rank && rank <= 20 ? (
        <div className="text-center space-y-4">
          <p className="text-xl">おめでとう！第 {rank} 位です 🎉</p>
          {!submitted ? (
            <>
              <input
                type="text"
                placeholder="ニックネームを入力"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="border p-2 rounded-lg text-center"
              />
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                {isSubmitting ? "送信中..." : "スコアを登録"}
              </button>
            </>
          ) : (
            <p className="text-green-600 font-semibold">登録が完了しました ✅</p>
          )}
        </div>
      ) : (
        <div className="text-center space-y-4">
          <p className="text-xl">残念！{rank} 位でした 😢</p>
          <p>上位20位以内のみスコアが記録されます。</p>
          <button
            onClick={() => setSubmitted(true)}
            className="text-gray-600 underline"
          >
            記録をスキップ
          </button>
        </div>
      )}

      <div className="w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mt-6 mb-2">
          🏆 スコアボード
        </h2>
        <ul className="divide-y">
          {scores.map((s, index) => (
            <li
              key={s.id}
              className={`flex justify-between p-2 ${
                s.user_name === nickname ? "bg-yellow-100" : ""
              }`}
            >
              <span>
                {index + 1}. {s.user_name || "匿名"}
              </span>
              <span>{s.score}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>

  );
}
