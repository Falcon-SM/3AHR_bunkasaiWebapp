"use client";

import { useEffect, useState, useRef } from "react";
//import { microcms } from "@/lib/microcms";
import { useRouter } from "next/navigation";
import Script from "next/script";

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
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      localStorage.pagen = 2;
      localStorage.zikan = sessionStorage.zikan;
      localStorage.sawhint = sessionStorage.sawhint;
      event.preventDefault();
      // Chromeなどでは returnValue の設定が必要
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return (
    <div>
      <div className="container">
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-8SS8YBH1B6"
          strategy="afterInteractive"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-8SS8YBH1B6');` }}
        />
        <h2 />
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
            お使いのブラウザは動画再生に対応していません。別のブラウザをお試しください。
          </video>
        </div>
      </div>
      {videoEnded && (
        <div style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          width: window.innerWidth,
          height: window.innerHeight,
          background: "rgba(153, 153, 153, 0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            background: "#000000ff",
            padding: "32px",
            borderRadius: "12px",
            boxShadow: "0 4px 24px rgba(102, 102, 102, 0.18)",
            maxWidth: "90vw",
            textAlign: "center"
          }}>
            <button
              onClick={handleModalOk}
              className="botanin"
            >
              次へ
            </button>

          </div>
        </div>
      )}
    </div>
  );
}
