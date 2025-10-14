"use client";

import { useEffect, useState, useRef } from "react";
//import { microcms } from "@/lib/microcms";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { text } from "stream/consumers";



/*type MicroCMSResponse = {
  contents: PageContent[];
};*/

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [kirikae,setKirikae]=useState(60)
  const [tscore,setts]=useState(0);
  const [hscore,seths]=useState(0);
  const router = useRouter();

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
    </div>

  );
}
