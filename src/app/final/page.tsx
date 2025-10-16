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


/*type MicroCMSResponse = {
  contents: PageContent[];
};*/

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [kirikae,setKirikae]=useState(90)
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
  const [showRankModal, setShowRankModal] = useState(false);


  useEffect(()=>{
    setts(1200-sessionStorage.zikan);
    seths(sessionStorage.sawhint);
    sessionStorage.zikan=1200;
    sessionStorage.sawhint=0;
  },[])

  const handleStartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleModalOk = () => {
    setShowModal(false);
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
      setPlayerScore(1200 - tscore - hscore * 5);
  }, [tscore, hscore]);

    useEffect(() => {
    const fetchScores = async () => {
      const { data: initialScores, error } = await supabase
        .from("ScoreBoard")
        .select("*")
        .order("score", { ascending: false })
        .limit(20);

      if (error) console.error(error);
      else setScores(initialScores || []);
    };
    fetchScores();
  }, []); // 初回レンダリング時に一度だけ実行

  useEffect(() => {
    if (playerScore != null) {
      const higherScores = scores.filter((s) => s.score > playerScore).length;
      setRank(higherScores + 1);
    }
  }, [playerScore, scores]);

  useEffect(() => {
    // スコアとランキングが確定したらモーダルを表示
    if (playerScore !== null && rank !== null) {
      setShowRankModal(true);
    }
  }, [playerScore, rank]);

  const handleSubmit = async () => {
  if (!nickname || playerScore == null) return;
  setIsSubmitting(true);

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
      
        {/* --- スコア登録モーダル --- */}
      
        <p style={{textAlign:"center"}}>クリアおめでとうございます！
        <br/>あなたがクリアにかかった時間:{`${Math.floor(tscore/60)}分${tscore%60}秒`}
        <br/>ヒントを見た回数:{hscore} 回
        <br/>あなたのスコア:{playerScore} ポイント
        </p>
        {submitted && (
        <div className="w-full max-w-md mx-auto mt-8" style={{width:"95%",textAlign:"center",border:"1px solid black",padding:10,borderRadius:10,backgroundColor:"#ff4d4f"}}>
          <h2 className="text-2xl font-semibold text-center mb-4">
            スコアボード
          </h2>
          <div style={{textAlign:"center",marginBottom:10}}>
            {scores.map((s, index) => (
              <p key={s.id}>
                <span className="text-gray-800">{index + 1}. {s.user_name || "匿名"}</span>
                <span className="text-gray-900">{s.score}</span>
              </p>
            ))}
            </div>
        </div>
      )} 
      <button
          onClick={handleStartClick}
          className = "botan"
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
        {showRankModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 m-4 max-w-lg w-full text-center transform transition-all">

            {canRankIn() ? (
              // --- 20位以内の場合 ---
              <div style={{
                position: "fixed",
                top: 0, left: 0, right: 0, bottom: 0,
                width:window.innerWidth,
                height:window.innerHeight,
                background: "rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000}}>
                  <div style={{
              background: "#fff",
              padding: "32px",
              borderRadius: "12px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
              maxWidth: "90vw",
              textAlign: "center"
                  }}>
                <p className="text-xl font-semibold">おめでとうございます！ <span className="text-3xl text-yellow-500 font-bold">{rank}</span> 位です！</p>
                {!submitted ? (
                  <div className="flex flex-col items-center gap-4 pt-4">
                    <input
                      className = "riddle-input"
                      type="text"
                      placeholder="ニックネームを入力"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      />
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting || !nickname.trim()}
                      className="botan"
                      style={{backgroundColor:(isSubmitting ? "#74b9ff":"#0984e3")}}
                    >
                      {isSubmitting ? "送信中..." : "スコアを登録する"}
                    </button>
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
            ) : (
              // --- ランク外の場合 ---
              <div className="space-y-4">
                <p className="text-xl font-semibold">残念！<span className="text-3xl font-bold">{rank}</span> 位でした。</p>
                <p className="text-gray-600">上位20位以内のみスコアが記録されます。</p>
                {!submitted && (
                  <button
                    onClick={() => {
                      setSubmitted(true); // スコアボード表示のトリガー
                      setShowRankModal(false); // モーダルを閉じる
                    }}
                    className="botan"
                  >
                    ランキングを見る
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- スコアボード (登録後またはスキップ後に表示) --- */}
      </div>
    

  );
}
