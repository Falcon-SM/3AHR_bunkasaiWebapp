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
  //const [data, setData] = useState<MicroCMSResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);

    setIsOnline(navigator.onLine);

    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (!navigator.onLine) {
          throw new Error("Offline");
        }
        /*const response: MicroCMSResponse = await microcms.get<MicroCMSResponse>({
          endpoint: "intro",
          queries: { limit: 1 },
        });*/
        //setData(response);
      } catch (error) {
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
            ref={videoRef}
            onEnded={handleVideoEnded}
          >
            <source src="/BunkasaiVideo1.mov" type="video/mp4" />
            お使いのブラウザは動画再生に対応していません。
          </video>
        </div>
        {videoEnded && (
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
        )}
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
              <h3 style={{ marginBottom: "16px" }}>注意事項</h3>
              <p style={{ marginBottom: "24px" }}>
                謎解きの答えは他の人に教えないでください。<br />
                ドメインを手動で変更するのはご遠慮ください。<br />
                制限時間やルールを守って楽しく謎解きをしましょう！
              </p>
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
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  /*if (!data || data.contents.length === 0) {
    return <p>データが見つかりませんでした。</p>;
  }*/

  //const item = data.contents[0];
//<p>{item.content}
  return (
    <div className="container">
      <h2 /*dangerouslySetInnerHTML={{ __html: item.title }}*/ />
      //kokokesita
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
          <source src="/BunkasaiVideo1.mov" type="video/mp4" />
          お使いのブラウザは動画再生に対応していません。
        </video>
      </div>
      {videoEnded && (
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
      )}
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
            <h3 style={{ marginBottom: "16px" }}>注意事項</h3>
            <p style={{ marginBottom: "24px" }}>
              謎解きの答えは他の人に教えないでください。<br />
              ドメインを手動で変更するのはご遠慮ください。<br />
              制限時間やルールを守って楽しく謎解きをしましょう！
            </p>
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
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
