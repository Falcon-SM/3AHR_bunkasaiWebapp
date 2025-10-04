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
    router.push("/riddles/3");
  };

  const handleVideoEnded = () => {
    setVideoEnded(true);
  };

  return (
    <div className="container">
      <h2/>
      <div style={{ margin: "32px 0" }}>
        <video
          controls
          width="100%"
          style={{
            borderRadius: "12px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
          }}
          ref={videoRef}
          onEnded={handleVideoEnded}
        >
          <source src="/BunkasaiVideo1.mp4" type="video/mp4" />
          お使いのブラウザは動画再生に対応していません。
        </video>
      </div>
      {videoEnded && (
        <button
          onClick={handleModalOk}
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
          次のページに進む
        </button>
          )}
    </div>
  );
}
