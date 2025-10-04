"use client";

import { useEffect, useState, useRef } from "react";
//import { microcms } from "@/lib/microcms";
import { useRouter } from "next/navigation";

type PageContent = {
  title: string;
  content: string;
};

/*type MicroCMSResponse = {
  contents: PageContent[];
};*/

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleStartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleModalOk = () => {
    setShowModal(false);
    router.push("/riddles/1");
  };

  const handleVideoEnded = () => {
    setVideoEnded(true);
  };

  return (
    <div className="container">
      <h2/>
             <p style={{ marginBottom: "24px" }}>
              謎解きの答えは他の人に教えないでください。<br />
              ドメインを手動で変更するのはご遠慮ください。<br />
              また、途中でヒントを自分の意思で出すことができますか、総合得点から引かれるので注意しましょう。<br />
              制限時間は20分です。次のページに遷移したら自動的にカウントダウンが始まります。<br />
              制限時間やルールを守って楽しく謎解きをしましょう！
            </p>
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
          謎解きを始める
        </button>
      {showModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
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
            <h3 style={{ marginBottom: "16px" }}>注意事項を読みましたか？</h3>
            <button
              onClick={() => setShowModal(false)}
              style={{
                padding: "10px 32px",
                background: "#fff",
                color: "#0984e3",
                border: "2px solid #0984e3",
                borderRadius: "6px",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "1rem",
                marginRight: "16px"
              }}
            >
              いいえ
            </button>

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
               はい 
            </button>
            
          </div>
        </div>
      )}
    </div>
  );
}
